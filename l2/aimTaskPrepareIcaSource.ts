/// <mls shortName="aimTaskPrepareIcaSource" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { customElement } from 'lit/decorators.js';
import { getInfoMyService } from "./_100554_aimHelper";
import { AimTaskBase } from "./_100554_aimTaskBase";
import { convertFileNameToTag } from "./_100554_utilsLit";
import { getAttributeDefinitionsLit } from './_100554_icaBaseDescription';
import { IArgsAddIca } from './_100554_aimActionAddIca'

@customElement('aim-task-prepare-ica-source-100554')
export class AimTaskPrepareIcaSource extends AimTaskBase {

    public onInitializing(): void { // from abstract
        this.getSource();
    }

    getSource() {

        const promp: string | undefined= this.taskChild.prompt;
        if (!promp) {
            this.notifyCompleteByStatus('error', 'Invalid data in prompt');
            return;
        }
        const obj: IArgsAddIca = JSON.parse(promp);

        this._getSource(obj).then((ret: string) => {
            const result = ret;
            this.notifyCompleteByStatus('ok', result);
        }).catch((e: any) => {
            this.notifyCompleteByStatus('error', e);
        });
    }

    private _getSource(data: IArgsAddIca): Promise<string> {

        return new Promise<string>(async (resolve, reject) => {
            try {
                const info = getInfoMyService(this);
                if (!info) {
                    reject('Not found info');
                    return;
                }

                const { path, project } = mls.actual[2];
                if (!path || !project) {
                    reject('Not found path or project');
                    return;
                }
                const fullName = mls.actual[2].getFullName();
                const mfile = mls.l2.editor.mfiles[fullName];
                if (!mfile) {
                    reject('Not found mfile');
                    return;
                }

                const tps = mfile.compilerResults?.tripleSlashMLS;
                if (!mfile) {
                    reject('Not found tripleSlashMLS in mfile compilerResults');
                    return;
                }

                const activeServiceOp = info.actServiceOp;
                if (activeServiceOp.tagName !== 'SERVICE-SOURCE-100554') {
                    reject('100554_ServiceSource is not active in level 2');
                    return;
                }

                const regexRemoveSpaces = /\s+/g;
                const group = (data.group.join('')).replace(regexRemoveSpaces, '');
                const tagName = convertFileNameToTag(fullName);
                const className = path.charAt(0).toUpperCase() + path.substring(1, path.length);
                const importFile = `_100554_ica${group}`;
                const extend = `Ica${group}`;
                const [root, subgroup, finalgroup] = data.group;
                const props = getAttributeDefinitionsLit(root, subgroup, finalgroup);

                const template = `
/// <mls shortName="${tps.variables.shortName}" project="${tps.variables.project}" enhancement="${tps.variables.enhancement}" groupName="${group}" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { propertyDataSource } from './_100554_icaLitElement';
import { ${extend} } from './${importFile}';

@customElement('${tagName}')
export class ${className} extends ${extend} {
    
    static styles = css\`\`;
    
    ${props.join('\n')}   
                        
}
`

                this.taskChild.ref = activeServiceOp.getActualRef() || '';
                resolve(template);

            } catch (e: any) {
                reject(e);
            }


        });
    }
}
