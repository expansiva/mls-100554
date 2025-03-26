/// <mls shortName="pluginNewFileService" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { convertFileNameToTag } from './_100554_utilsLit';
import { IcaLitElement } from './_100554_icaLitElement';
import { getMessageKey } from "./_100554_collabLitElement";
import { propertyDataSource } from './_100554_icaLitElement';
import { ServiceBase } from './_100554_serviceBase';
import { IDetails, createNewFile, changeTagName, changeClassName, changeWidget } from "./_100554_pluginNewFileBase";
import './_100554_wcCode';

/// **collab_i18n_start**
const message_pt = {
    title: 'Criar um service',
    description: "Criar um service, que será utilizado no sistema collab.\nUm service no collab.codes, permite a criação de menus após selecionar o level, fica no nav2, com ícones.\nApós criar o arquivo use a inteligência artificial para preparar o service.",
    project: "Projeto",
    shortName: "Nome",
    header: "Criar um service",
    btnCreate: 'Criar arquivo',
    loading: 'Criando arquivo...',
    error: 'Nome do arquivo em branco ou invalido'
}

const message_en = {
    title: 'Create a service in Lit',
    description: "Create a service to be used in the Collab system.\nA service in collab.codes allows creating menus after selecting the level, placed in nav2 with icons.\nAfter creating the file, use artificial intelligence to prepare the service.",
    project: "Project",
    shortName: "ShortName",
    header: "Create a service in Lit",
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
    description: msg.description,
    tags: ["lit", "internal", "service"],
}


@customElement('plugin-new-file-service-100554')
export class PluginNewFileService extends IcaLitElement {

    @propertyDataSource() shortName: string | undefined;

    @propertyDataSource({ attribute: true }) project: number | undefined;

    @property() position: 'left' | 'right' = 'left';

    @property() loading: boolean = false;

    private service = this.closest('service-detail-100554') as ServiceBase;

    private template: string = `
import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from './_100554_serviceBase';

@customElement('[tagName]')
export class [className] extends ServiceBase {
    public details: IService = {
        icon: '&#xf15b',
        state: 'foreground',
        position: 'right',
        tooltip: 'Service Example',
        visible: true,
        widget: '[widgetName]',
        level: [5]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IServiceMenu = {
        title: 'Example',
        actions: {
        },
        icons: {},
        actionDefault: '', // call after close icon clicked
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        getLastMode: undefined,
        updateTitle: undefined
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }


    @property() 
    name: string = 'Somebody';

    render() {
        return html\`<p> Hello, \${ this.name } !</p>\`;
    }
}`;


    private enhancement: string = `_100554_enhancementLitService`;

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
        if (!this.project || !this.shortName) {
            this.service.setError(msg.error)
            return;
        };
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