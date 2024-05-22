/// <mls shortName="aimTaskGetSourceLanguages" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { customElement } from 'lit/decorators.js';
import { AimTaskBase } from "./_100554_aimTaskBase";
import { getDataInternationalization } from './_100554_aimTaskGetSourceLanguageTypescript';
import { ITaskFileInfo, ITaskRootArgsInitial } from './_100554_aimAddLanguageBase';
import { ICollabLanguage } from './_100554_collabLanguages';
import { checkAttributteHasVariation } from './_100554_icaBaseDescription';

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

    private async prepareInfoFile(args: ITaskRootArgsInitial): Promise<ITaskFileInfo> {

        const fileName = `_${args.project}_${args.fileName}`
        const infoFile: ITaskFileInfo = {
            fileName,
            checkHtml: true,
            checkTs: true,
            languages: args.languages,
            html: '',
            detailsi18n: undefined,
            attributesHTML: [],
            htmlTags: [],
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

        const keyToFileHTML = mls.stor.getKeyToFiles(args.project, 2, args.fileName, '', '.html');
        const fileHTML = mls.stor.files[keyToFileHTML];
        if (!fileHTML) infoFile.checkHtml = false;
        else {
            const valueHTML = await fileHTML.getContent();
            if (typeof valueHTML !== 'string') {
                infoFile.checkHtml = false;
                return infoFile;
            }

            infoFile.html = valueHTML;
            const rc = this.prepareHTMLInfo(valueHTML);
            infoFile.htmlTags = rc.components;
            infoFile.attributesHTML = rc.attrs;
        }

        return infoFile;
    }

    private prepareHTMLInfo(valueHTML: string) {
        const rc: ComponentData = {
            attrs: [],
            components: []
        };
        const data = this.analyzeHTML(valueHTML);
        data.attrs.forEach((attr) => {
            const hasVariation = checkAttributteHasVariation(attr);
            if (hasVariation) rc.attrs.push(attr);
        });

        rc.components = data.components;
        return rc;
    }

    private allElementsPresent(arrayA: string[], arrayB: string[]): boolean {
        for (const element of arrayA) {
            if (!arrayB.includes(element)) {
                return false;
            }
        }
        return true;
    }

    private analyzeHTML(htmlString: string): ComponentData {

        const tempElement = document.createElement('div');
        tempElement.innerHTML = htmlString;
        const data: ComponentData = {
            components: [],
            attrs: []
        };

        function traverseElement(element: HTMLElement) {
            if (element.tagName.includes('-')) {
                const tagName = element.tagName.toLowerCase();
                if (!data.components.includes(tagName)) {
                    data.components.push(tagName);
                }
                const attributes = element.getAttributeNames();
                attributes.forEach(attribute => {
                    if (!data.attrs.includes(attribute)) {
                        data.attrs.push(attribute);
                    }
                });
            }

            if (element.children.length > 0) {
                for (let i = 0; i < element.children.length; i++) {
                    traverseElement(element.children[i] as HTMLElement);
                }
            }
        }

        traverseElement(tempElement);
        return data;
    }
}


interface ComponentData {
    components: string[];
    attrs: string[];
}

