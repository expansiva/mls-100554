/// <mls shortName="aimTaskGetSourceLanguages" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { customElement } from 'lit/decorators.js';
import { AimTaskBase } from "./_100554_aimTaskBase";
import { getDataInternationalization } from './_100554_aimTaskGetSourceLanguageTypescript';
import { ITaskFileInfo, ITaskRootArgsInitial } from './_100554_aimAddLanguageBase';

@customElement('aim-task-get-source-languages-100554')
export class AimTaskGetSourceLanguages extends AimTaskBase {

    public onInitializing(): void { // from abstract
        this.getSource();
    }

    getSource() {

        if (!this.taskRoot.args) {
            this.taskChild.trace.push(new Date().toISOString() + ': taskroot args is missing');
            this.notifyCompleteByStatus('error', '');
            return;
        }
        const args: ITaskRootArgsInitial = JSON.parse(this.taskRoot.args);
        
        this.prepareInfoFile(args).then((ret: ITaskFileInfo) => {
            const result = ret;
            this.notifyCompleteByStatus('ok', JSON.stringify(result));
        }).catch((e: any) => {
            this.notifyCompleteByStatus('error', e);
        });
    }

    private async prepareInfoFile(args: ITaskRootArgsInitial) {

        const fileName = `_${args.project}_${args.fileName}`
        const infoFile: ITaskFileInfo = {
            fileName,
            checkHtml: false,
            checkTs: true,
            languages: args.languages,
            html: '',
            detailsi18n: undefined,
            onlyLanguageDontConfigured: args.onlyLanguageDontConfigured
        };

        const mfile = mls.l2.editor.mfiles[fileName];
        if (!mfile) infoFile.checkTs = false;
        const valueTs = mfile.model.getValue() || '';
        if (!valueTs) infoFile.checkTs = false;

        const details = getDataInternationalization(valueTs);
        if (!details.internationalization || !details.internationalization.source || details.internationalization.languages.length === 0) infoFile.checkTs = false;
        if (args.onlyLanguageDontConfigured && this.allElementsPresent(args.languages.map((lang) => lang.code), details.internationalization?.languages || [])) infoFile.checkTs = false;

        infoFile.detailsi18n = details.internationalization;
        return infoFile;
    }

    private allElementsPresent(arrayA: string[], arrayB: string[]): boolean {
        for (const element of arrayA) {
            if (!arrayB.includes(element)) {
                return false;
            }
        }
        return true;
    }

}
