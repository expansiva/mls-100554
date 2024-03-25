/// <mls shortName="aimTaskResultTokens" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { AimTaskBase } from "./_100554_aimTaskBase";
import { getInfoMyService } from "./_100554_aimHelper";
import { initCollabShowCodeSnippet100554, CollabShowCodeSnippet100554 } from './_100554_collabShowCodeSnippet';
import { ServiceDsTokens100554 } from "_100554_serviceDsTokens";

@customElement('aim-task-result-tokens-100554')
export class AimTaskResultLess extends AimTaskBase {

    constructor() {
        super();
        initCollabShowCodeSnippet100554();
    }

    @query('collab-show-code-snippet-100554')
    codeSnippet: CollabShowCodeSnippet100554 | undefined;

    private result: string = '';

    public onInitializing(): void { // from abstract
        this.notifyCompleteByStatus('ok', '');
    }

    firstUpdated(a: any) {
        super.firstUpdated(a);
        if (this.codeSnippet) this.codeSnippet.textIn = this.result;
    }

    renderBody(taskRoot: cbe.ITaskRoot, child: cbe.ITaskChild) {
        const title = child.title;
        const body = child._tempResult || '';
        this.result = this.extractLess(body)[0] || '';
        return html`
        <details open>
            <summary>${title}</summary>
            <div style='margin: 10px'>
                <button @click=${this.onAccept}>Accept</button>
                <collab-show-code-snippet-100554 language="less"></collab-show-code-snippet-100554>
            </div> 
        </details>
        `;
    }

    private onAccept() {
        const info = getInfoMyService(this);
        if (!info) return;
        const activeServiceOp: ServiceDsTokens100554 = info.actServiceOp;
        if (activeServiceOp.tagName !== 'SERVICE-DS-TOKENS-100554') return;
        activeServiceOp.setEditorSource(this.result);
    }

    private extractLess(src: string) {
        const regex = /```less([\s\S]+?)```/g;
        const matches = src.match(regex);
        const contents = [];

        if (matches) {
            for (const m of matches) {
                const conteudo = m.replace(/```less|```/g, '').trim();
                contents.push(conteudo);
            }
        }

        return contents;
    }


}
