/// <mls shortName="aimTaskResultTable" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, unsafeHTML, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { executePrompt, ITaskFinish } from "./_100554_aimHelper";
import { AimTaskBase } from "./_100554_aimTaskBase";

@customElement('aim-task-result-table-100554')
export class AimTaskResultTable extends AimTaskBase {

    public onInitializing(): void { // from abstract
        this.notifyCompleteByStatus('ok', '');
    }

    renderBody(taskRoot: cbe.ITaskRoot, child: cbe.ITaskChild) {
        const title = child.title;
        const body = child._tempResult || '';
        return html`
        <details open>
            <summary>${title}</summary>
            <div style='margin: 10px'>${this.renderTable2(this.parseTable2(body))}</div> 
        </details>
        `;
    }

    parseTable(body: string): string[][] {
        const i1 = body.indexOf('|');
        if (i1 < 0) return [];
        let lines = body.substring(i1).split('\n');
        let tab1: string[][] = [];
        for (const line of lines) {
            if (!line.startsWith('|')) continue;
            const cols = line.trim().split('|');
            tab1.push(cols);
        }
        return tab1;
    }

    parseTable2(body: string) {
        const regex = /\|/g;
        const lines = body.split('\n');
        const linesWithValues = lines.filter(line => line.trim() !== '');
        const table = linesWithValues.map(line => line.split(regex));
        const tableWithNoEspaces = table.map(line => line.map(cel => cel.trim()));
        return tableWithNoEspaces;
    }

    renderTable2(tab1: string[][]) {

        if (tab1.length < 2) return html`invalid table`;
        return html`
        <table class="tb">
            <thead>
            <tr>${tab1[0].map(header => html`<th class="th">${header}</th>`)}</tr>
            </thead>
            <tbody>
            ${tab1.slice(1).map(row => html`
                <tr>${row.map(cell => html`<td class="td">${cell}</td>`)}</tr>
            `)}
            </tbody>
        </table>
        `;
    }

}
