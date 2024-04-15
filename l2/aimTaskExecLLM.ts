/// <mls shortName="aimTaskExecLLM" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, unsafeHTML, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { executePrompt, ITaskFinish } from "./_100554_aimHelper";
import { AimTaskBase } from "./_100554_aimTaskBase";

@customElement('aim-task-exec-l-l-m-100554')
export class AimTaskExecLLM extends AimTaskBase {

    public onInitializing(): void { // from abstract
        this.senderToServer(this.taskRoot);
    }

    senderToServer(taskRoot: cbe.ITaskRoot) {
        this.taskChild.trace.push(new Date().toISOString() + ': sending to server');

        executePrompt(this.taskIndex)
            .then((value: cbe.ITaskRoot) => {
                if (!value) throw new Error('invalid task retorned');

                this.taskChild.trace.push(new Date().toISOString() + ': received from server, len=' + (JSON.stringify(taskRoot)).length);
                this.taskChild.mode = taskRoot.mode = 'processed';
                this.notifyCompleteByStatus('ok', '');
                
                return;
            }).catch((reason: Error) => {
                this.taskChild.trace.push(new Date().toISOString() + ': error on executePrompt: ' + reason.message || '?');
                this.taskChild.mode = taskRoot.mode = 'error'; 
                this.notifyCompleteByStatus("error", '');
                return;
            });
    }

    onIconClick(action: string): void {
        // this.task.result.len += 1;
        this.requestUpdate();
    }
}
