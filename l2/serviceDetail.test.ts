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

    // Coming back to the tab: `serviceBase.attributeChangedCallback` passes reinit = true
    // (`oldVal !== null && visible`). The first version of the fix was tested with false and
    // did nothing in the browser, because the method returned early on reinit.
    onServiceClick.call(host, true, true, null);
    assert.equal(any4.style.display, '');
    assert.equal(any3.style.display, 'none');
    assert.equal(plugin.style.display, 'none');
    assert.equal(plugin.msize, 'compact');

    onServiceClick.call(host, false, false, null);
    assert.equal(any4.style.display, 'none');
    onServiceClick.call(host, true, true, null);
    assert.equal(any4.style.display, '', 'a second round trip shows it again');

    // First show of the service (oldVal null): reinit false, visible true. Same result.
    onServiceClick.call(host, false, false, null);
    onServiceClick.call(host, true, false, null);
    assert.equal(any4.style.display, '');
});

test('onServiceClick shows the content last opened on the level, even when its id has no level', () => {
    const onServiceClick = loadOnServiceClick();
    (globalThis as { mls: { actualLevel: number } }).mls.actualLevel = 5;
    // An element opened by openElementInServiceDetails: wrapper id = its tag, no level suffix.
    const editor = child('aura--plugins--plugin-menu-editor-102020', 'block');
    const older = child('any5', 'none');
    const host = {
        contentPlugin: { children: [older, editor] },
        msize: 'compact',
        activeContentByLevel: new Map<number, Child>([[5, editor]]),
    };

    // openMe() makes the tab visible AFTER the content was put in place: it must stay shown.
    onServiceClick.call(host as unknown as Host, true, false, null);
    assert.equal(editor.style.display, '');
    assert.equal(older.style.display, 'none', 'only the active content, not every one of the level');

    onServiceClick.call(host as unknown as Host, false, false, null);
    assert.equal(editor.style.display, 'none');
    onServiceClick.call(host as unknown as Host, true, true, null);
    assert.equal(editor.style.display, '');
});

test('onServiceClick without an active content shows only the last child of the level', () => {
    const onServiceClick = loadOnServiceClick();
    (globalThis as { mls: { actualLevel: number } }).mls.actualLevel = 5;
    const first = child('a5', 'none');
    const last = child('b5', 'none');
    const host: Host = { contentPlugin: { children: [first, last] }, msize: 'compact' };
    onServiceClick.call(host, true, false, null);
    assert.equal(first.style.display, 'none');
    assert.equal(last.style.display, '');
});
