/// <mls shortName="aimTaskTSSource" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ITaskFinish, getInfoMyService } from "./_100554_aimHelper";
import { AimTaskBase } from "./_100554_aimTaskBase";

@customElement('aim-task-t-s-source-100554')
class AimTaskTSSource extends AimTaskBase {

    public onInitializing(): void { // from abstract
        this.getSource();
    }

    getSource() {
        // get typescript source from ref

        /*const result = 'let a = b;\nconsole.log("minha laranjeira");';
        this.notifyCompleteByStatus('ok', result);*/

        this.getFileSource().then((ret: string) => {
            const result = ret;
            this.notifyCompleteByStatus('ok', result);
        }).catch((e: any) => {
            this.notifyCompleteByStatus('error', e);
        });
        
    }

    private getFileSource(): Promise<string>{

        return new Promise<string>(async (resolve, reject) => {

            try {

                const info = getInfoMyService(this);
                if (!info || ( info.actServiceOp && info.actServiceOp.tagName !== 'SERVICE-SOURCE-100554')) {
                    reject('Not found info in getFileSource');
                    return;
                }

                const position = info.position === 'left' ? 'right' : 'left';

                if (!(mls.actual[2] as any)[position]) {
                    reject('No files selected in getFileSource');
                    return;
                }

                const { project, shortName, extension, folder } = (mls.actual[2] as any)[position];

                const key = mls.stor.getKeyToFiles(project, 2, shortName, folder, extension);

                const file = mls.stor.files[key];

                if (!file) {
                    reject('Not found stor.file in getFileSource');
                    return;
                }

                const ret = await file.getContent();
                this.taskChild.ref = info.actServiceOp.getActualRef();
                resolve(ret as any);
                
            } catch (e:any) {
                reject(e);
            }


        });
    }

}
