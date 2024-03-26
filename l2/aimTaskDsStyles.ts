/// <mls shortName="aimTaskDsStyles" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { customElement } from 'lit/decorators.js';
import { getInfoMyService } from "./_100554_aimHelper";
import { AimTaskBase } from "./_100554_aimTaskBase";
import { ServiceDsStyles } from "_100554_serviceDsStyles";

@customElement('aim-task-ds-styles-100554')
export class AimTaskDsStyles extends AimTaskBase {

    public onInitializing(): void { // from abstract
        this.getSource();
    }

    getSource() {
        this.getStyle().then((ret: string) => {
            const result = ret;
            this.notifyCompleteByStatus('ok', result);
        }).catch((e: any) => {
            this.notifyCompleteByStatus('error', e);
        });

    }

    getStyle(): Promise<string> {

        return new Promise<string>(async (resolve, reject) => {
            try {
                const info = getInfoMyService(this);
                if (!info) {
                    reject('Not found info in getFileStyle');
                    return;
                }
        
                const activeServiceOp: ServiceDsStyles = info.actServiceOp;
                if (activeServiceOp.tagName !== 'SERVICE-DS-STYLES-100554') reject('100554_ServiceDsStyles is not active in level 3');
                if (!activeServiceOp.isComponent) reject('100554_ServiceDsStyles is in globalCss mode, please open component style');
                const val = activeServiceOp.getEditorSource();
                this.taskChild.ref = activeServiceOp.getActualRef() || '';
                resolve(val);

            } catch (e: any) {
                reject(e);
            }


        });
    }

}
