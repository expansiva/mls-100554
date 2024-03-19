/// <mls shortName="aimTaskTSSource" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ITaskFinish } from "./_100554_aimHelper";
import { AimTaskBase } from "./_100554_aimTaskBase";

@customElement('aim-task-t-s-source-100554')
class AimTaskTSSource extends AimTaskBase {

    public onInitializing(): void { // from abstract
        this.getSource();
    }

    getSource() {
        // get typescript source from ref
        const result = 'let a = b;\nconsole.log("minha laranjeira");';
        this.notifyCompleteByStatus('ok', result);
    }

}
