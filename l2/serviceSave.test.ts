/// <mls fileReference="_100554_/l2/serviceSave.test.ts" enhancement="_blank" />

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

// tsx does not apply experimentalDecorators, so importing the Lit class throws.
// The method bodies are loaded from serviceSave.ts and executed as-is.

interface SaveHost {
    showLoader(loader: boolean): void;
    templateSweepApplies(): Promise<boolean>;
    myMessage: { msgTotFile: string };
    totFileSize: string;
    scenery: string;
    initInfoProject(): Promise<void>;
    setInfos(): Promise<void>;
    infoCalls: number;
    infoSetCalls: number;
}

type SweepFn = () => Promise<unknown>;

function extractBody(signature: string): string {
    const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'serviceSave.ts'), 'utf8');
    const start = source.indexOf(signature);
    if (start < 0) throw new Error(signature + ' not found in serviceSave.ts');
    const bodyStart = source.indexOf('{', start);
    let depth = 0;
    let end = bodyStart;
    for (; end < source.length; end++) {
        const ch = source[end];
        if (ch === '{') depth++;
        else if (ch === '}') {
            depth--;
            if (depth === 0) {
                end++;
                break;
            }
        }
    }
    return source.slice(bodyStart, end);
}

function transpile(wrapped: string, fileName: string): string {
    const transpiled = ts.transpileModule(wrapped, {
        compilerOptions: { target: ts.ScriptTarget.ES2022 },
        fileName,
        reportDiagnostics: true,
    });
    const errors = (transpiled.diagnostics ?? []).filter((item) => item.category === ts.DiagnosticCategory.Error);
    if (errors.length > 0) {
        throw new Error(errors.map((item) => ts.flattenDiagnosticMessageText(item.messageText, '\n')).join('\n'));
    }
    return transpiled.outputText;
}

function loadInit(sweep: SweepFn): (this: SaveHost, isSetInfoProject?: boolean) => Promise<void> {
    const body = extractBody('private async init(isSetInfoProject: boolean = true)');
    const wrapped = `async function init(isSetInfoProject = true) ${body}\nreturn init;`;
    const factory = new Function('removeNewStorFilesWithTemplateDefault', transpile(wrapped, 'serviceSave.init.ts'));
    return factory(sweep);
}

function loadSweepApplies(): (this: SaveHost) => Promise<boolean> {
    const body = extractBody('private async templateSweepApplies(): Promise<boolean>');
    const wrapped = `async function templateSweepApplies() ${body}\nreturn templateSweepApplies;`;
    const factory = new Function(transpile(wrapped, 'serviceSave.templateSweepApplies.ts'));
    return factory();
}

function hostFor(applies: (this: SaveHost) => Promise<boolean>): SaveHost {
    const host: SaveHost = {
        showLoader() {},
        templateSweepApplies: () => applies.call(host),
        myMessage: { msgTotFile: 'Total' },
        totFileSize: '',
        scenery: '',
        infoCalls: 0,
        infoSetCalls: 0,
        async initInfoProject() { this.infoCalls += 1; },
        async setInfos() { this.infoSetCalls += 1; },
    };
    return host;
}

interface DriverGetter {
    (project: number): Promise<{ driverVersion?: string }> | { driverVersion?: string };
}

function withDriver(getDefaultDriver: DriverGetter | undefined, run: () => Promise<void>): Promise<void> {
    const mls = (globalThis as { mls: { actualProject?: number; stor: { others?: { getDefaultDriver?: DriverGetter } } } }).mls;
    const previousProject = mls.actualProject;
    const previousOthers = mls.stor.others;
    mls.actualProject = 102071;
    mls.stor.others = getDefaultDriver ? { getDefaultDriver } : {};
    return run().finally(() => {
        mls.actualProject = previousProject;
        mls.stor.others = previousOthers;
    });
}

test('st71 s1c serviceSave init', async (t) => {
    const applies = loadSweepApplies();

    await t.test('VM driver does not call the sweep', async () => {
        let calls = 0;
        const init = loadInit(async () => { calls += 1; });
        const host = hostFor(applies);
        await withDriver(async () => ({ driverVersion: '1.0.0-vm.1' }), async () => {
            await init.call(host);
        });
        assert.equal(calls, 0);
        assert.equal(host.scenery, 'save');
        assert.equal(host.infoCalls, 1);
        assert.equal(host.infoSetCalls, 1);
    });

    await t.test('legacy driver calls the sweep', async () => {
        let calls = 0;
        const init = loadInit(async () => { calls += 1; });
        const host = hostFor(applies);
        await withDriver(async () => ({ driverVersion: '1.0.0.4' }), async () => {
            await init.call(host);
        });
        assert.equal(calls, 1);
        assert.equal(host.scenery, 'save');
        assert.equal(host.infoSetCalls, 1);
    });

    await t.test('getDefaultDriver failing logs and skips the sweep', async () => {
        const seen: string[] = [];
        const original = console.error;
        console.error = (...args: unknown[]) => { seen.push(args.map((item) => String(item)).join(' ')); };
        try {
            let missingCalls = 0;
            const init = loadInit(async () => { missingCalls += 1; });
            const host = hostFor(applies);
            await withDriver(undefined, async () => {
                await init.call(host);
            });
            assert.equal(missingCalls, 0);
            assert.ok(seen.some((line) => line.includes('getDefaultDriver is missing')));

            seen.length = 0;
            let rejectedCalls = 0;
            const initRejected = loadInit(async () => { rejectedCalls += 1; });
            const hostRejected = hostFor(applies);
            await withDriver(async () => { throw new Error('driver down'); }, async () => {
                await initRejected.call(hostRejected);
            });
            assert.equal(rejectedCalls, 0);
            assert.ok(seen.some((line) => line.includes('driver down')));
            assert.equal(hostRejected.scenery, 'save');
            assert.equal(hostRejected.infoSetCalls, 1);
        } finally {
            console.error = original;
        }
    });
});
