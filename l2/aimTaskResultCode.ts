/// <mls shortName="aimTaskResultCode" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { AimTaskBase } from "./_100554_aimTaskBase";
import { initCollabShowCodeSnippet100554, CollabShowCodeSnippet100554 } from './_100554_collabShowCodeSnippet';
import { initCollabShowCodeDiff100554, CollabShowCodeDiff } from './_100554_collabShowCodeDiff';
import { getInfoMyService } from './_100554_aimHelper';

@customElement('aim-task-result-code-100554')
export class AimTaskResultCode extends AimTaskBase {

    @query('collab-show-code-snippet-100554')
    codeSnippet: CollabShowCodeSnippet100554 | undefined;

    @query('collab-show-code-diff-100554')
    codeDif: CollabShowCodeDiff | undefined;

    private result: string = '';

    constructor() {
        super();
        initCollabShowCodeSnippet100554();
        initCollabShowCodeDiff100554();
    }

    public onInitializing(): void { // from abstract
        this.notifyCompleteByStatus('ok', '');
    }

    renderBody(taskRoot: cbe.ITaskRoot, child: cbe.ITaskChild) {
        const title = child.title;
        const body = child._tempResult || '';
        this.result = this.extractScript(body);
        return html`
        <details open>
            <summary>${title}- Code</summary>
            <div style='margin: 10px'>
                <collab-show-code-snippet-100554 withAccept="true" .onAccept=${this.onAccept.bind(this)}>
                </collab-show-code-snippet-100554>
            </div> 
        </details>
        `;
    }

    private onAccept() {
        const info = getInfoMyService(this);
        if (!info || !info.actServiceOp) return;
        if (info.actServiceOp.tagName !== 'SERVICE-SOURCE-100554') return;
        info.actServiceOp.setEditorValue(this.result);
    }

    private extractScript(src: string) {
        const regex = /```typescript([\s\S]+?)```/g;
        const matches = src.match(regex);
        const contents = [];

        let ret = src;

        if (matches) {
            for (const m of matches) {
                const conteudo = m.replace(/```typescript|```/g, '').trim();
                contents.push(conteudo);
            }

            ret = contents[0];
        }

        return ret;
    }

    firstUpdated(a: any) {
        super.firstUpdated(a);
        if (this.codeSnippet) this.codeSnippet.textIn = this.result;
    }

}
