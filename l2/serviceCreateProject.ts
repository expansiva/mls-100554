/// <mls shortName="serviceCreateProject" project="100554" enhancement="_100554_enhancementLitService" groupName="other" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';
import { collab_check, collab_xmark } from './_100554_collabIcons';

/// **collab_i18n_start**
const message_pt = {
    createProjectTitle: 'Criar projecto',
    createProjectHelper: 'Por favor escolha o tipo de projeto abaixo e pressione continuar',
    labelName: 'Nome do projeto',
    labelDescription: 'Descrição',
    alertNoSelect: 'Por favor selecione um tipo de projeto',
    btnContinuar: 'Continuar',
    btnCreate: 'Criar projeto(Em desenvolvimento)',

}

const message_en = {
    createProjectTitle: 'Create project',
    createProjectHelper: 'Please choose your project type below and press continue',
    labelName: 'Project name',
    labelDescription: 'Description',
    alertNoSelect: 'Please select project type',
    btnContinuar: 'Continue',
    btnCreate: 'Create Project (In develpoment)',


}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-create-project-100554')
export class ServiceCreateProject100554 extends ServiceBase {

    private msg: MessageType = messages['en'];

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property({ type: String }) currentScenario: IScenaries = 'customize';

    public details: IService = {
        icon: '&#xf15b',
        state: 'foreground',
        position: 'left',
        tooltip: 'Create project',
        visible: true,
        widget: '_100554_serviceCreateProject',
        level: [6]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: this.msg.createProjectTitle,
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

    private changeScenario(scenario: IScenaries) {
        this.currentScenario = scenario
    }

    private onBtnContinueClick() {
        this.changeScenario('customize');
    }

    private onBtnCreateClick() {
        //
    }

    private renderSelect() {
        return html`
            <div class="select-type-project">
                <details>
                    <summary>sites</summary>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Web</th>
                                    <th>Mobile(Responsive)</th>
                                    <th>App(Mobile) - IOS</th>
                                    <th>App(Mobile) - Android</th>
                                    <th>App Backend</th>
                                    <th>Multilanguage</th>

                                </tr>
                            </thead>
                            <tbody>
                                ${this.data.map((item) =>
            html`
                                    <tr>
                                        <td><span>${item.title}</span> <br><small> ${item.description} </small></td>
                                        <td>${item.web === true ? collab_check : collab_xmark} </td>
                                        <td>${item.mobile === true ? collab_check : collab_xmark} </td>
                                        <td>${item.appMobileIOS === true ? collab_check : collab_xmark} </td>
                                        <td>${item.appMobileAndroid === true ? collab_check : collab_xmark} </td>
                                        <td>${item.backend === true ? collab_check : collab_xmark} </td>
                                        <td>${item.multilanguage === true ? collab_check : collab_xmark} </td>                                
                                    </tr>
                                    `
        )}
                        
                            
                            </tbody>
                        <table>
                    </div>
                </details>
                <details>
                    <summary>system</summary>
                    <div>
                    </div>
                </details>

                <div>
                    <button @click=${this.onBtnContinueClick}>${this.msg.btnContinuar}</button>
                </div>
            </div>

        `;
    }



    private renderCustomize() {
        return html`

            <div class="details-new-project">
                <details open>
                    <summary>Resume</summary>
                    <div>
                        <ul>
                            <li>Id: 101001 </li>
                            <li>${this.msg.labelName}: 'Test'</li>
                            <li>
                                <span>${this.msg.labelDescription}:</span>
                                <textarea rows=6>
                                </textarea>
                            </li>
                        </ul>
                    </div>
                </details>
                
                <details open>
                    <summary>Plugins Publicação</summary>
                    <div>
                        <div class="card-list">
                            ${this.pluginsPublish.map((item) => {
                                return html`
                                <div class="card-item">

                                    <span class="card-type">${item.type}</span>
                                    <span class="card-title">${item.title}</span>
                                    <span class="card-desc">${item.description}</span>
                                    <div class="card-details">
                                        <ul>   
                                            ${item.details.map((details) => {
                                                return html`
                                                    <li>
                                                        <span>${details.enabled === true ? collab_check : collab_xmark} </span>                                
                                                        <span>${details.item}</span>
                                                        
                                                    </li>
                                                
                                                `
                                            })}
                                        </ul>
                                    </div>
                                </div>
                                `
                            })}
                        </div>
                    </div>
                </details>
                <details open>
                    <summary>Plugins Armazenamento</summary>
                    <div>
                        <div class="card-list">
                            ${this.pluginsStorage.map((item) => {
                                return html`
                                <div class="card-item">

                                    <span class="card-type">${item.type}</span>
                                    <span class="card-title">${item.title}</span>
                                    <span class="card-desc">${item.description}</span>
                                    <div class="card-details">
                                        <ul>   
                                            ${item.details.map((details) => {
                                                return html`
                                                    <li>
                                                        <span>${details.enabled === true ? collab_check : collab_xmark} </span>                                
                                                        <span>${details.item}</span>
                                                        
                                                    </li>
                                                
                                                `
                                            })}
                                        </ul>
                                    </div>
                                </div>
                                `
                            })}
                        </div>
                    </div>
                </details>
            </div>

            <div class="buttons-container">
                <button @click=${this.onBtnCreateClick}>${this.msg.btnCreate}</button>
            </div>
        `;
    }

    private renderScenario() {
        switch (this.currentScenario) {
            case 'select':
                return html`
                    ${this.renderSelect()}
                `
            case 'customize':
                return html`
                    ${this.renderCustomize()}
                `
        }
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
            <section>
                ${this.renderScenario()}
            </section>
        `
    }

    private data: ISites[] = [
        {
            title: "Blog / Institucional",
            description: "Ex: sites pessoais / comerciais com dados estáticos",
            web: true,
            mobile: true,
            appMobileIOS: false,
            appMobileAndroid: false,
            backend: false,
            multilanguage: true
        },
        {
            title: "Plataforma de publicação conteúdo(em desenvolvimento)",
            description: "Ex: Medium, Youtube, Vimeo",
            web: true,
            mobile: true,
            appMobileIOS: false,
            appMobileAndroid: false,
            backend: false,
            multilanguage: true
        },
        {
            title: "Portfólio / CMS(em desenvolvimento)",
            description: "sites pessoais ou comerciais com apresentação serviços produtos",
            web: true,
            mobile: true,
            appMobileIOS: true,
            appMobileAndroid: true,
            backend: true,
            multilanguage: true
        },
        {
            title: "Landing Page(em desenvolvimento)",
            description: "Captura de usuários e vendas produtos/serviços ",
            web: true,
            mobile: true,
            appMobileIOS: true,
            appMobileAndroid: true,
            backend: true,
            multilanguage: true
        },
        {
            title: "Educacional(em desenvolvimento)",
            description: "distribuição cursos e gestão alunos",
            web: true,
            mobile: true,
            appMobileIOS: true,
            appMobileAndroid: true,
            backend: true,
            multilanguage: true
        },
        {
            title: "E-Commerce(em desenvolvimento)",
            description: "Loja online de vendas",
            web: true,
            mobile: true,
            appMobileIOS: true,
            appMobileAndroid: true,
            backend: true,
            multilanguage: true
        },
        {
            title: "Educacional(em desenvolvimento)",
            description: "Ex: sites pessoais / comerciais com dados estáticos",
            web: true,
            mobile: true,
            appMobileIOS: true,
            appMobileAndroid: true,
            backend: true,
            multilanguage: true
        },
        {
            title: "B2B , B2C (Vendas)(em desenvolvimento)",
            description: "Ex: Amazon, Alibaba",
            web: true,
            mobile: true,
            appMobileIOS: true,
            appMobileAndroid: true,
            backend: true,
            multilanguage: true
        },
        {
            title: "ERP ( BackOffice)(em desenvolvimento)",
            description: "Ex: SAP, Oracle ERP",
            web: true,
            mobile: true,
            appMobileIOS: true,
            appMobileAndroid: true,
            backend: true,
            multilanguage: true
        }
    ]

    private pluginsPublish: IPlugins[] = [
        {
            type: 'free',
            title: 'Download site',
            description: 'Permite baixar o site na máquina local e instalar em um provedor, requer conhecimentos técnicos',
            details: [
                {
                    enabled: true,
                    item: 'Alto controle'
                },
                {
                    enabled: true,
                    item: 'Integrar com sites existentes'
                }
            ]
        },
        {
            type: 'pro',
            title: 'GitHub',
            description: 'Permite publicar e usar sites no github.io , exemplo: meusite.github.io',
            details: [
                {
                    enabled: true,
                    item: 'Free'
                },
                {
                    enabled: true,
                    item: 'DNS'
                }
            ]
        },
        {
            type: 'pro',
            title: 'S3 - site estático',
            description: 'Permite usar um serviço que cobra pelo que utiliza, econômico, muito escalável, e com o DNS personalizado, ex: meusite.com',
            details: [
                {
                    enabled: true,
                    item: 'Econômico'
                },
                {
                    enabled: true,
                    item: 'Escalável'
                }
            ]
        }
    ];

    private pluginsStorage: IPlugins[] = [
        {
            type: 'free',
            title: 'Armazenamento Local',
            description: 'Permite baixar o site na máquina local e instalar em um provedor, requer conhecimentos técnicos',
            details: [
                {
                    enabled: false,
                    item: 'Backup'
                },
                {
                    enabled: false,
                    item: 'Histórico'
                }
            ]
        },
        {
            type: 'pro',
            title: 'GitHub',
            description: 'Permite controle de versão robusto, integração contínua, revisões de código,  acessível de qualquer lugar, aumentando a produtividade e a segurança do código',
            details: [
                {
                    enabled: true,
                    item: 'Backup'
                },
                {
                    enabled: true,
                    item: 'Histórico'
                }
            ]
        },
        {
            type: 'pro',
            title: 'GitLab',
            description: 'Semelhante ao GitHub, permite também a instalação em servidores próprios, útil para empresas com muitos desenvolvedores simultâneos e que querem um serviço dedicado',
            details: [
                {
                    enabled: true,
                    item: 'Backup'
                },
                {
                    enabled: true,
                    item: 'Histórico'
                }
            ]
        },
    ];

}

type IScenaries = 'select' | 'customize';
interface IPlugins {
    type: 'free' | 'pro',
    title: string,
    description: string,
    details: IPluginsPublishDetails[]
}

interface IPluginsPublishDetails {
    item: string,
    enabled: boolean
}

interface ISites {
    title: string,
    description: string,
    web: true,
    mobile: boolean,
    appMobileIOS: boolean,
    appMobileAndroid: boolean,
    backend: boolean,
    multilanguage: boolean
}