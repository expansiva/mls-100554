/// <mls shortName="aimTaskGetSourceLanguageTypescript" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { customElement } from 'lit/decorators.js';
import { AimTaskBase } from "./_100554_aimTaskBase";
import { ITaskRootArgs } from "./_100554_aimActionVerifyInternationalization";

@customElement('aim-task-get-source-language-typescript-100554')
export class AimTaskGetSourceLanguageTypescript extends AimTaskBase {

    public onInitializing(): void { // from abstract
        this.getSource();
    }

    getSource() {

        if (!this.taskRoot.args) {
            this.notifyCompleteByStatus('error', 'Invalid Args');
            return;
        }

        const data: ITaskRootArgs = JSON.parse(this.taskRoot.args as string);
        const shortName: string = data.fileName;

        this._getSource(shortName).then((ret: ISourceTypescriptData) => {
            const result = ret;
            this.notifyCompleteByStatus('ok', JSON.stringify(result));
        }).catch((e: any) => {
            this.notifyCompleteByStatus('error', e);
        });
    }

    private _getSource(shortName: string): Promise<ISourceTypescriptData> {
        return new Promise<ISourceTypescriptData>(async (resolve, reject) => {
            const mfile = mls.l2.editor.mfiles[shortName];
            if (!mfile) reject(`No mfile find for file: ${shortName}`);
            const value = mfile.model.getValue();
            const data = this.getDataInternalization(value);
            resolve(data);
        })

    }

    public getDataInternalization(sourceComplete: string): ISourceTypescriptData {

        const regex = /\/\/\/ **collab_i18n_start*([\s\S]+?)\/\/\/ **collab_i18n_end**/;
        const match = sourceComplete.match(regex);

        let internalization: IInternalizationsDetails | undefined = undefined;
        let source: string = '';
        if (match && match.index) {
            const internationalizationText = match[1].trim();

            const languages = Object.keys(internationalizationText.match(/message_[a-z]{2}/g)?.reduce((acc: any, curr: string) => {
                const language = curr.split('_')[1];
                acc[language] = true;
                return acc;
            }, {}) || {});

            const startIndex = sourceComplete.substring(0, match.index).split('\n').length;
            const blankLinesBefore = sourceComplete.substring(0, match.index).match(/\n\s*\n/g);
            const blankLinesBeforeCount = blankLinesBefore ? blankLinesBefore.length : 0;
            const endIndex = startIndex + internationalizationText.split('\n').length + blankLinesBeforeCount;
            const beforeMatch = sourceComplete.substring(0, match.index).trim();
            const afterMatch = sourceComplete.substring(match.index + match[0].length).trim();
            internalization = {
                endLine: endIndex,
                source: internationalizationText,
                startLine: startIndex,
                languages
            }
            source = beforeMatch + "\n" + afterMatch;
        }

        return { internalization, source, sourceComplete };
    }
}

export interface IInternalizationsDetails {
    startLine: number,
    endLine: number,
    source: string,
    languages: string[]
}

export interface ISourceTypescriptData {
    source: string,
    internalization: IInternalizationsDetails | undefined,
    sourceComplete: string
}