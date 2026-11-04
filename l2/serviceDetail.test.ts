/// <mls fileReference="_100554_/l2/serviceDetail.test.ts" enhancement="_blank" />

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

// tsx does not apply experimentalDecorators, so importing the Lit class throws.
// The method body is loaded from serviceDetail.ts and executed as-is.

interface Child {
    id: string;
    tagName: string;
    style: { display: string };
    msize?: string;
    setAttribute(name: string, value: string): void;
}

interface Host {
    contentPlugin: { children: Child[] } | undefined;
    msize: string;
}

function loadOnServiceClick(): (this: Host, visible: boolean, reinit: boolean, el: null) => void {
    const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'serviceDetail.ts'), 'utf8');
    const signature = 'onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null)';
    const start = source.indexOf(signature);
    if (start < 0) throw new Error('onServiceClick not found in serviceDetail.ts');
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
    const body = source.slice(bodyStart, end);
    const wrapped = `function onServiceClick(visible: boolean, reinit: boolean, el: null) ${body}\nreturn onServiceClick;`;
    const transpiled = ts.transpileModule(wrapped, {
        compilerOptions: { target: ts.ScriptTarget.ES2022 },
        fileName: 'serviceDetail.onServiceClick.ts',
        reportDiagnostics: true,
    });
    const errors = (transpiled.diagnostics ?? []).filter((item) => item.category === ts.DiagnosticCategory.Error);
    if (errors.length > 0) {
        throw new Error(errors.map((item) => ts.flattenDiagnosticMessageText(item.messageText, '\n')).join('\n'));
    }
    const factory = new Function(transpiled.outputText);
    return factory();
}

function child(id: string, display: string, tagName = 'DIV'): Child {
    return {
        id,
        tagName,
        style: { display },
        setAttribute(name: string, value: string) {
            if (name === 'msize') this.msize = value;
        },
    };
}

test('onServiceClick hides every child and, on return, shows only the current level', () => {
    const onServiceClick = loadOnServiceClick();
    const any4 = child('any4', '');
    const any3 = child('any3', 'none');
    const plugin = child('plugin-host', '', 'PLUGIN-HOST');
    const host: Host = {
        contentPlugin: { children: [any4, any3, plugin] },
        msize: 'compact',
    };
    (globalThis as { mls: { actualLevel: number } }).mls.actualLevel = 4;

    onServiceClick.call(host, false, false, null);
    assert.equal(any4.style.display, 'none');
    assert.equal(any3.style.display, 'none');
    assert.equal(plugin.style.display, 'none');
    assert.equal(plugin.msize, 'compact');

    onServiceClick.call(host, true, false, null);
    assert.equal(any4.style.display, '');
    assert.equal(any3.style.display, 'none');
    assert.equal(plugin.style.display, 'none');
    assert.equal(plugin.msize, 'compact');
});
