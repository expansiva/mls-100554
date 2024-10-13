/// <mls shortName="aimTaskResultText" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { AimTaskBase } from "./_100554_aimTaskBase";

@customElement('aim-task-result-text-100554')
export class AimTaskResultText extends AimTaskBase {

    public onInitializing(): void { // from abstract
        this.notifyCompleteByStatus('ok', '');
    }

    renderBody(taskRoot: mls.cbe.ITaskRoot, child: mls.cbe.ITaskChild) {
        const title = child.title;
        const body = child._tempResult || '';
        return html`
        <details open>
            <summary>${title}- Text</summary>
            <pre>
                <code>
                    ${body}
                </code>
            </pre>
        </details>
        `;
    }    

}