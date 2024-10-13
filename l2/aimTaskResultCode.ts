/// <mls shortName="aimTaskResultCode" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { AimTaskBase } from "./_100554_aimTaskBase";

import { initCollabShowCodeDiff100554, CollabShowCodeDiff } from './_100554_collabShowCodeDiff';
import { getInfoMyService, extractScript } from './_100554_aimHelper';

@customElement('aim-task-result-code-100554')
export class AimTaskResultCode extends AimTaskBase {

    @query('collab-show-code-diff-100554')
    codeDif: CollabShowCodeDiff | undefined;

    private result: string = '';

    constructor() {
        super();
    
        initCollabShowCodeDiff100554();
    }

    public onInitializing(): void { // from abstract
        this.notifyCompleteByStatus('ok', '');
    }

    renderBody(taskRoot: mls.cbe.ITaskRoot, child: mls.cbe.ITaskChild) {
        const title = child.title;
        const body = child._tempResult || '';
        this.result = extractScript(body, /```typescript([\s\S]+?)```/g);
        return html`
        <details open>
            <summary>${title}- Code</summary>
            <div style='margin: 10px'>
                <collab-show-code-diff-100554 withAccept="true" .onAccept=${this.onAccept.bind(this)}>
                </collab-show-code-diff-100554>
            </div> 
        </details>
        `;
    }

    private onAccept() {
        console.info('onAccept')
        const info = getInfoMyService(this);
        if (!info || !info.actServiceOp) return;
        if (info.actServiceOp.tagName !== 'SERVICE-SOURCE-100554') return;
        info.actServiceOp.setEditorValue(this.result);
    }

    firstUpdated(a: any) {
        super.firstUpdated(a);
        // if (this.codeSnippet) this.codeSnippet.textIn = this.result;
    }

}
