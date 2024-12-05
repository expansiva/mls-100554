/// <mls shortName="pluginNewFilePage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { convertFileNameToTag } from './_100554_utilsLit';
import { IcaLitElement } from './_100554_icaLitElement';
import { getMessageKey } from "./_100554_collabLitElement";
import { propertyDataSource } from './_100554_icaLitElement';
import { IDetails, createNewFile, changeTagName, changeClassName, changeWidget } from "./_100554_pluginNewFileBase";
import './_100554_wcCode';


/// **collab_i18n_start**
const message_pt = {
    title: 'Criar um arquivo de pagina.',
    description: "Criar um arquivo do tipo pagina. Na pagina sera possivel manipular o globalState e dos eventos da página.",
    project: "Projeto",
    shortName: "Nome",
    header: "Criar uma pagina",
    btnCreate: 'Criar arquivo',
    loading: 'Criando arquivo...'
}

const message_en = {
    title: 'Create a page file.',
    description: "Create a page file. In the page, it will be possible to manipulate the globalState and the page events.",
    project: "Project",
    shortName: "ShortName",
    header: "Create a page",
    btnCreate: 'Create file',
    loading: 'Creating File...'
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
export class PluginNewFilePage extends IcaLitElement {

    @propertyDataSource() shortName: string | undefined;

    @propertyDataSource({ attribute: true }) project: number | undefined;

    @property() position: string = 'left';

    @property() loading: boolean = false;

    private template: string = `
import { CollabPageElement } from './_100554_collabPageElement';
import { customElement } from 'lit/decorators.js';
import { globalState } from './_100554_icaState';

 @customElement('[tagName]')
 export class [className] extends CollabPageElement {

     initPage() {
         window.globalState = {
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
         };
     }

     /// **collab_events_start**
     handleClickbuttonSum() {
         // here or code for event
     }

 }`;


    private enhancement: string = `_100554_enhancementLit`;

    private groupName: string = `other`;

    private getTemplate(): string {
        let newExample = this.template;
        if (this.shortName && this.project) {
            newExample = changeTagName(newExample, convertFileNameToTag(`_${this.project}_${this.shortName}`));
            newExample = changeClassName(newExample, this.project, this.shortName);
            newExample = changeWidget(newExample, this.project, this.shortName);
        }
        return `/// <mls shortName="${this.shortName}" project="${this.project}" enhancement="${this.enhancement}" groupName="${this.groupName}" />\n${newExample}\n`;;
    }

    private async handleAddFile() {
        if (!this.project || !this.shortName) return;
        this.loading = true;
        try {
            await createNewFile(this.project, this.position, this.shortName, this.enhancement, this.getTemplate());
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

                    <wc-code-100554 language="typescript" text="${this.getTemplate()}"></wc-code-100554>
                
                </div>`
            }
        `
    }

}