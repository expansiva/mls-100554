/// <mls shortName="pluginNewFileBlank" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';
import { getMessageKey } from "/_100554_/l2/collabLitElement.js";
import { propertyDataSource } from '/_100554_/l2/collabDecorators.js';
import { IDetails, createNewFile } from "/_100554_/l2/pluginNewFileBase.js";
import { ServiceBase } from '/_100554_/l2/serviceBase.js';
import '/_100554_/l2/widgetTextCode.js';

/// **collab_i18n_start**
const message_pt = {
    title: "Criar um arquivo em branco.",
    desc: "Criar um arquivo em branco em lit 3.",
    project: "Projeto",
    shortName: "Nome",
    header: "Arquivo em branco",
    btnCreate: 'Criar arquivo',
    loading: 'Criando arquivo...',
    error: 'Nome do arquivo em branco ou invalido'

}

const message_en = {
    title: "Create a blank file.",
    desc: "Create a blank file in Lit 3.",
    project: "Project",
    shortName: "ShortName",
    header: "Blank File",
    btnCreate: 'Create file',
    loading: 'Creating File...',
    error: 'Blank or invalid file name'
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
    description: msg.desc,
    tags: ["lit", "html", "component"],
}

@customElement('plugin-new-file-blank-100554')
export class PluginNewFileBlank extends StateLitElement {

    @propertyDataSource() shortName: string | undefined;

    @propertyDataSource() folder: string | undefined;

    @propertyDataSource({ attribute: true }) project: number | undefined;

    @property() position: 'left' | 'right' = 'left';

    @property() loading: boolean = false;

    private service = this.closest('service-detail-100554') as ServiceBase;

    private template: string = ``;

    private enhancement: string = `_100554_enhancementLit`;

    private groupName: string = `other`;

    private getTemplate(): string {

        const group = this.groupName && this.groupName != 'other' ? ` groupName="${this.groupName}"` : '';
        const folder = this.folder ? ` folder="${this.folder}"` : '';
        const enhancement = '_blank';
        
        return `/// <mls shortName="${this.shortName}" project="${this.project}" enhancement="${enhancement}"${group}${folder} />\n${this.template}\n`;;
    }

    private async handleAddFile() {
        if (!this.project || !this.shortName) {
            this.service.setError(msg.error)
            return;
        };
        this.loading = true;
        try {
            await createNewFile({
                project: this.project,
                position: this.position,
                shortName: this.shortName,
                folder:this.folder,
                enhancement: this.enhancement,
                sourceTS: this.getTemplate(),
                openPreview:true
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
                    <widget-text-code-100554 language="typescript" text="${this.getTemplate()}"></widget-text-code-100554>
                </div>`
            }
        `
    }

}