/// <mls shortName="aimTaskGetSourceLanguageTypescript" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { customElement } from 'lit/decorators.js';
import { AimTaskBase } from "./_100554_aimTaskBase";
import { ITaskRootArgs } from "./_100554_aimActionVerifyInternationalization";

@customElement('aim-task-get-source-language-typescript-100554')
class AimTaskGetSourceLanguageTypescript extends AimTaskBase {

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


            const models = mls.editor.models[shortName];
            if (!models || !models.ts || !models.ts.model) reject(`No find models for file: ${shortName}`);
            const value = models.ts?.model.getValue() || '';
            const data = getDataInternationalization(value);
            resolve(data);
        })

    }
}

export function getDataInternationalization(sourceComplete: string) {
    const regex = /\/\/\/ \*\*collab_i18n_start\*\*([\s\S]*?)\/\/\/ \*\*collab_i18n_end\*\*/g;
    let match;
    let remainingText = sourceComplete;
    let internationalization: IInternationalizationsDetails | undefined = undefined;

    match = regex.exec(sourceComplete)
    if (match) {
        const start = match.index;
        const end = regex.lastIndex;

        const beforeBlock = sourceComplete.slice(0, start);
        const block = match[0];
        const afterBlock = sourceComplete.slice(end);
        const startLine = (beforeBlock.match(/\n/g) || []).length + 1;
        const endLine = startLine + (block.match(/\n/g) || []).length;
        const languages = extractLanguages(match[1]);

        internationalization = {
            source: match[1].trim(),
            startLine,
            endLine,
            languages
        }
        remainingText = remainingText.replace(block, '');
    }

    return {
        internationalization,
        source: remainingText.trim(),
        sourceComplete
    };
}

function extractLanguages(text: string): string[] {
    const regex = /message_([a-zA-Z]+)/g;
    let match;
    const languages: Set<string> = new Set();
    while ((match = regex.exec(text)) !== null) {
        languages.add(match[1]);
    }
    return Array.from(languages);
}

export interface IInternationalizationsDetails {
    startLine: number,
    endLine: number,
    source: string,
    languages: string[]
}

export interface ISourceTypescriptData {
    source: string,
    internationalization: IInternationalizationsDetails | undefined,
    sourceComplete: string
}