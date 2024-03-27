/// <mls shortName="aimTaskDsTokens" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { customElement } from 'lit/decorators.js';
import { getInfoMyService } from "./_100554_aimHelper";
import { AimTaskBase } from "./_100554_aimTaskBase";
import { ServiceDsTokens100554 } from "_100554_serviceDsTokens";

@customElement('aim-task-ds-tokens-100554')
class AimTaskDsTokens extends AimTaskBase {

    public onInitializing(): void { // from abstract
        this.getSource();
    }

    getSource() {
        this.getTokens().then((ret: string) => {
            const result = ret;
            this.notifyCompleteByStatus('ok', result);
        }).catch((e: any) => {
            this.notifyCompleteByStatus('error', e);
        });
    }

    private getTokens(): Promise<string> {

        return new Promise<string>(async (resolve, reject) => {
            try {
                const info = getInfoMyService(this);
                if (!info) {
                    reject('Not found info in getFileStyle');
                    return;
                }
                const activeServiceOp: ServiceDsTokens100554 = info.actServiceOp;
                if (activeServiceOp.tagName !== 'SERVICE-DS-TOKENS-100554') reject('100554_ServiceDsTokens is not active in level 3');
                const val = activeServiceOp.getEditorSource();
                this.taskChild.ref = activeServiceOp.getActualRef() || '';
                resolve(val);

            } catch (e: any) {
                reject(e);
            }

        });
    }

}
