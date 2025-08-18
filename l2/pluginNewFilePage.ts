/// <mls shortName="pluginNewFilePage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { convertFileNameToTag } from './_100554_utilsLit';
import { StateLitElement } from './_100554_stateLitElement';
import { getMessageKey } from "./_100554_collabLitElement";
import { propertyDataSource } from './_100554_collabDecorators';
import { IDetails, createNewFile, changeTagName, changeClassName, changeWidget, changeStateName } from "./_100554_pluginNewFileBase";
import { ServiceBase } from './_100554_serviceBase';
import './_100554_widgetTextCode';

/// **collab_i18n_start**
const message_pt = {
    title: 'Criar um arquivo de pagina.',
    description: "Criar um arquivo do tipo pagina. Na pagina sera possivel manipular o globalState e dos eventos da página.",
    project: "Projeto",
    shortName: "Nome",
    header: "Criar uma pagina",
    btnCreate: 'Criar arquivo',
    loading: 'Criando arquivo...',
    error: 'Nome do arquivo em branco ou invalido',
    errorPageName: 'O nome do arquivo deve começar com "page"',

}

const message_en = {
    title: 'Create a page file.',
    description: "Create a page file. In the page, it will be possible to manipulate the globalState and the page events.",
    project: "Project",
    shortName: "ShortName",
    header: "Create a page",
    btnCreate: 'Create file',
    loading: 'Creating File...',
    error: 'Blank or invalid file name',
    errorPageName: 'File name must start with "page"',

}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

const lang = getMessageKey(messages);
let msg: MessageType = messages[lang];

export const details: IDetails = {
    title: msg.title,
    description: msg.description,
    tags: ["lit", "html", "page"],
}

@customElement('plugin-new-file-page-100554')
export class PluginNewFilePage extends StateLitElement {

    @propertyDataSource({ attribute: true }) shortName: string | undefined;

    @propertyDataSource({ attribute: true }) project: number | undefined;

    @propertyDataSource({ attribute: true }) folder: string | undefined;

    @property() position: 'left' | 'right' = 'left';

    @property() loading: boolean = false;

    private service = this.closest('service-detail-100554') as ServiceBase;

    private template: string = `
import { CollabPageElement } from './_100554_collabPageElement';
import { customElement } from 'lit/decorators.js';
import { globalState, setState, initState } from './_100554_collabState';

 @customElement('[tagName]')
 export class [className] extends CollabPageElement {

     initPage() {

        initState('[stateName]', {
            tables: {
                 sex: [{ key: 'm', value: 'masculino' }, { key: 'f', value: 'feminino' }],
             },
             newUser: {
                 name: '',
                 age: 0,
                 city: '',
                 sex: ''
             },
             sum: 0,
        });

     }

 }`;


    private enhancement: string = `_100554_enhancementLit`;

    private groupName: string = `other`;

    private getTemplateTS(): string {

        let newExample = this.template;
        if (this.shortName && this.project) {
            newExample = changeTagName(newExample, convertFileNameToTag({ project: this.project, shortName: this.shortName, folder: this.folder }));
            newExample = changeClassName(newExample, this.project, this.shortName);
            newExample = changeWidget(newExample, this.project, this.shortName);
            newExample = changeStateName(newExample, this.shortName);

        }

        const group = this.groupName && this.groupName != 'other' ? ` groupName="${this.groupName}"` : ` groupName="page"`;
        const folder = this.folder ? ` folder="${this.folder}"` : '';
        const enhancement =  this.enhancement ? this.enhancement : '_blank';

        return `/// <mls shortName="${this.shortName}" project="${this.project}" enhancement="${enhancement}"${group}${folder} />\n${newExample}\n`;;
    }

    private getTemplateHTML(): string {

        if (!this.shortName || !this.project) return '';

        const tagName = convertFileNameToTag({ project: this.project, shortName: this.shortName, folder: this.folder });
        return `<${tagName} modeoverlay="wcd-overlay-mode-default-100554">\n\t<ica-layout-flow-section-100554 id="section1" class="inset" widget="wc-section-100554">
		\n\t\t<ica-apresentation-text-text-100554 id="apText1" widget="wc-text-100554" text="In development" type="h2">
		</ica-apresentation-text-text-100554>
	\n\t</ica-layout-flow-section-100554>
</${tagName}>`;
    }

    private async handleAddFile() {
        if (!this.project || !this.shortName) {
            this.service.setError(msg.error);
            return;
        };
        if (!this.shortName.startsWith('page')) {
            this.service.setError(msg.errorPageName);
            return;
        }
        this.loading = true;
        try {
            await createNewFile({
                project: this.project,
                position: this.position,
                shortName: this.shortName,
                enhancement: this.enhancement,
                sourceTS: this.getTemplateTS(),
                sourceHTML: this.getTemplateHTML(),
                openPreview: true
            });
        } catch (e: any) {
            this.loading = false;
        }
    }

    render() {
        return html`
            ${this.loading ?
                html`<div>${msg.loading}</div>`
                :
                html`   
                <div>
                    <h2>${msg.header} </h2>
                    <hr>
                    <div>
                        <span> <b>${msg.project}:</b> ${this.project}</span>
                        <span> <b>${msg.shortName}:</b> ${this.shortName}</span>    
                    </div>
                    <div style="margin-top:1rem;">
                        <button @click=${this.handleAddFile}>${msg.btnCreate}</button>
                    </div>

                    <widget-text-code-100554 language="typescript" text="${this.getTemplateTS()}"></widget-text-code-100554>
                    <widget-text-code-100554 language="html" text="${this.getTemplateHTML()}"></widget-text-code-100554>

                
                </div>`
            }
        `
    }

}