/// <mls shortName="pluginCreateNewProject" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';
import { collab_check, collab_xmark, collab_lock } from './_100554_collabIcons';

/// **collab_i18n_start**
const message_pt = {
    createProjectTitle: 'Criar projeto',
    createProjectHelper: 'Por favor escolha o tipo de projeto abaixo e pressione continuar.',
    labelName: 'Nome do projeto',
    labelDescription: 'Descrição',
    alertNoSelect: 'Por favor selecione um tipo de projeto',
    btnContinuar: 'Continuar',
    btnCreate: 'Criar projeto(Em desenvolvimento)',
    errorContinue: 'Selecione o tipo de site antes',
    detailsSystem: 'Sistema',
    detailsPluginsStorage: 'Plugins de armazenamento',
    detailsPluginsPublish: 'Plugins de publicação',
    alert: 'Em desenvolvimento',
}

const message_en = {
    createProjectTitle: 'Create project',
    createProjectHelper: 'Please choose your project type below and press continue.',
    labelName: 'Project name',
    labelDescription: 'Description',
    alertNoSelect: 'Please select project type',
    btnContinuar: 'Continue',
    btnCreate: 'Create Project (In develpoment)',
    errorContinue: 'Select the site type first',
    detailsSystem: 'System',
    detailsPluginsStorage: 'Storage plugins',
    detailsPluginsPublish: 'Publish plugins',
    alert: 'In develpoment'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('plugin-create-new-project-100554')
export class PluginCreateProject100554 extends LitElement {

    constructor() {
        super();
    }

    private msg: MessageType = messages['en'];

    @property({ type: String }) currentScenario: IScenaries = 'select';

    @property() actualSiteSelected: ISites | undefined;

    @queryAll('.tr-item') sitesItems: NodeListOf<HTMLElement> | undefined;

    @queryAll('.publish-item') publishItems: NodeListOf<HTMLElement> | undefined;

    @queryAll('.storage-item') storageItems: NodeListOf<HTMLElement> | undefined;

    
    //-------------COMPONENT---------------

    render() {
        return html`
            <section>
                ${this.renderScenario()}
            </section>
        `
    }

    renderScenario() {
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

    renderSelect() {
        return html`
            <div class="select-type-project">
                <span>${this.msg.createProjectHelper}</span>
                <div class="buttons-container left">
                    <button @click=${this.onBtnContinueClick}>${this.msg.btnContinuar}</button>
                </div>

                <hr>
                <div class="cols">
                    <div class="col-left">
                        <details open>
                            <summary>Sites</summary>
                            <div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Web</th>
                                            <th>Mobile Responsive</th>
                                            <th>App IOS</th>
                                            <th>App Android</th>
                                            <th>App Backend</th>
                                            <th>Multi Language</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${this.data.map((item) => {
            return item.mode === 'system' ? '' : html`
                                                <tr class="tr-item" @click=${(e: MouseEvent) => { this.onTypeSiteClick(item, e.target as HTMLElement) }}>
                                                    <td><span>${item.title}</span> <br><small> ${item.description} </small></td>
                                                    <td>${item.web === true ? collab_check : collab_xmark} </td>
                                                    <td>${item.mobile === true ? collab_check : collab_xmark} </td>
                                                    <td>${item.appMobileIOS === true ? collab_check : collab_xmark} </td>
                                                    <td>${item.appMobileAndroid === true ? collab_check : collab_xmark} </td>
                                                    <td>${item.backend === true ? collab_check : collab_xmark} </td>
                                                    <td>${item.multilanguage === true ? collab_check : collab_xmark} </td>                                
                                                </tr>
                                                `
        }
        )}
                                    </tbody>
                                </table>
                            </div>
                        </details>

                        <details open>
                            <summary>${this.msg.detailsSystem}</summary>
                            <div>
                                <ul>
                                    ${this.data.map((item) => {
            return item.mode === 'site' ? '' : html`
                                                <li class="tr-item" @click=${(e: MouseEvent) => { this.onTypeSiteClick(item, e.target as HTMLElement) }}>
                                                    <span>${item.title}</span> 
                                                    <br>
                                                    <small> ${item.description} </small>                            
                                                </li>
                                                `
        }
        )}
                                </ul>
                            </div>
                        </details>
                    </div>

                    <div class="col-right">
                        <div class="details-selected-item">
                            <div>
                                <span class="details-title">${this.actualSiteSelected?.title}</span>
                                <span class="details-more">${this.actualSiteSelected?.more}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="buttons-container">
                    <button @click=${this.onBtnContinueClick}>${this.msg.btnContinuar}</button>
                </div>

            </div>

        `;
    }

    renderCustomize() {
        return html`
            <div class="details-new-project">
                <details open>
                    <summary>Resume</summary>
                    <div>
                        <ul>
                            <li>
                                <div class="container-input">
                                    <span>Id:</span>
                                    <input value="101001" readonly></input>
                                </div>
                            </li>
                            <li></li>
                                <div class="container-input">
                                    <span>${this.msg.labelName}:</span>
                                    <input value="Test"></input>
                                </div>

                            <li>
                                <div class="container-input">
                                    <span>${this.msg.labelDescription}:</span>
                                    <textarea rows=6></textarea>
                                </div>
                            </li>
                        </ul>
                    </div>
                </details>
                
                <details open>
                    <summary>${this.msg.detailsPluginsPublish}</summary>
                    <div>
                        <div class="card-list">
                            ${this.pluginsPublish.map((item, index) => {
            return html`
                                <div
                                    class="card-item publish-item  ${!item.enabled ? 'disabled' : ''}  ${index === 0 ? 'selected' : ''}"
                                    @click=${(e: MouseEvent) => { this.onPluginPublishClick(item, e.target as HTMLElement) }}
                                >
                                    ${!item.enabled ? html`<span class="card-lock">${collab_lock}</span>` : ''}
                                    <span class="card-type ${item.type}">${item.type}</span>
                                    <span class="card-title">${item.title}</span>
                                    <span class="card-desc">${item.description}</span>
                                    <div class="card-details" >
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
                    <summary>${this.msg.detailsPluginsStorage}</summary>
                    <div>
                        <div class="card-list" >
                            ${this.pluginsStorage.map((item, index) => {
            return html`
                                <div class="card-item storage-item ${!item.enabled ? 'disabled' : ''} ${index === 0 ? 'selected' : ''}"
                                 @click=${(e: MouseEvent) => { this.onPluginStorageClick(item, e.target as HTMLElement) }}>

                                    ${!item.enabled ? html`<span class="card-lock">${collab_lock}</span>` : ''}
                                    <span class="card-type ${item.type}">${item.type}</span>
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

    //-----------IMPLEMENTATION-------------

    private changeScenario(scenario: IScenaries) {
        this.currentScenario = scenario
    }

    private onBtnContinueClick() {
        if (!this.actualSiteSelected) {
            alert(this.msg.errorContinue)
            return;
        }

        if (this.actualSiteSelected.title !== 'Blog / Institucional') {
            alert(this.msg.alert)
            return;
        }
        this.scrollTop = 0;
        this.changeScenario('customize');
    }

    private onBtnCreateClick() {
        alert(this.msg.alert);
    }


    private onTypeSiteClick(item: ISites, el: HTMLElement) {
        if (this.sitesItems) this.sitesItems.forEach((item) => item.classList.remove('selected'))
        if (el) {
            const tr = el.closest('.tr-item');
            tr?.classList.toggle('selected');
        }

        this.actualSiteSelected = item;
    }

    private onPluginPublishClick(item: IPlugins, el: HTMLElement) {
        const card = el.closest('.card-item');
        if (!item.enabled) {
            card?.classList.add('shake');
            setTimeout(() => card?.classList.remove('shake'), 1000);
            return;
        }
        if (this.publishItems) this.publishItems.forEach((item) => item.classList.remove('selected'))
        if (card) card.classList.toggle('selected');


    }

    private onPluginStorageClick(item: IPlugins, el: HTMLElement) {
        const card = el.closest('.card-item');
        if (!item.enabled) {
            card?.classList.add('shake');
            setTimeout(() => card?.classList.remove('shake'), 1000);
            return;
        }
        if (this.storageItems) this.storageItems.forEach((item) => item.classList.remove('selected'))
        if (card) card.classList.toggle('selected');



    }

    private data: ISites[] = [
        {
            title: "Blog / Institucional",
            mode: "site",
            description: "Ex: sites pessoais / comerciais com dados estáticos",
            more: "Lorem ipsum dolor sit amet. Quo vitae omnis qui sunt officiis qui dolor assumenda a officia quia. Ab nihil inventore sed accusamus quaerat At velit quidem qui molestias quidem est rerum labore aut officiis ratione! Rem assumenda quod ut consequatur voluptatem qui aliquam suscipit. Qui quia eveniet et atque animi id voluptatem natus et enim laudantium aut laboriosam ratione.Sit tenetur pariatur sit iure accusantium et accusamus tenetur ut fugit consequatur eum eligendi velit sed sunt nobis et perspiciatis incidunt. Aut explicabo maxime non animi autem rem repudiandae labore eum aliquam quis.Lorem ipsum dolor sit amet. Quo vitae omnis qui sunt officiis qui dolor assumenda a officia quia. Ab nihil inventore sed accusamus quaerat At velit quidem qui molestias quidem est rerum labore aut officiis ratione! Rem assumenda quod ut consequatur voluptatem qui aliquam suscipit. Qui quia eveniet et atque animi id voluptatem natus et enim laudantium aut laboriosam ratione.Sit tenetur pariatur sit iure accusantium et accusamus tenetur ut fugit consequatur eum eligendi velit sed sunt nobis et perspiciatis incidunt. Aut explicabo maxime non animi autem rem repudiandae labore eum aliquam quis.",
            web: true,
            mobile: true,
            appMobileIOS: false,
            appMobileAndroid: false,
            backend: false,
            multilanguage: true
        },
        {
            title: "Plataforma de publicação conteúdo(em desenvolvimento)",
            mode: "site",
            description: "Ex: Medium, Youtube, Vimeo",
            more: "Lorem ipsum dolor sit amet. Quo vitae omnis qui sunt officiis qui dolor assumenda a officia quia. Ab nihil inventore sed accusamus quaerat At velit quidem qui molestias quidem est rerum labore aut officiis ratione! Rem assumenda quod ut consequatur voluptatem qui aliquam suscipit. Qui quia eveniet et atque animi id voluptatem natus et enim laudantium aut laboriosam ratione.Sit tenetur pariatur sit iure accusantium et accusamus tenetur ut fugit consequatur eum eligendi velit sed sunt nobis et perspiciatis incidunt. Aut explicabo maxime non animi autem rem repudiandae labore eum aliquam quis.Lorem ipsum dolor sit amet. Quo vitae omnis qui sunt officiis qui dolor assumenda a officia quia. Ab nihil inventore sed accusamus quaerat At velit quidem qui molestias quidem est rerum labore aut officiis ratione! Rem assumenda quod ut consequatur voluptatem qui aliquam suscipit. Qui quia eveniet et atque animi id voluptatem natus et enim laudantium aut laboriosam ratione.Sit tenetur pariatur sit iure accusantium et accusamus tenetur ut fugit consequatur eum eligendi velit sed sunt nobis et perspiciatis incidunt. Aut explicabo maxime non animi autem rem repudiandae labore eum aliquam quis.",
            web: true,
            mobile: true,
            appMobileIOS: false,
            appMobileAndroid: false,
            backend: false,
            multilanguage: true
        },
        {
            title: "Portfólio / CMS(em desenvolvimento)",
            mode: "site",
            description: "sites pessoais ou comerciais com apresentação serviços produtos",
            more: "Lorem ipsum dolor sit amet. Quo vitae omnis qui sunt officiis qui dolor assumenda a officia quia. Ab nihil inventore sed accusamus quaerat At velit quidem qui molestias quidem est rerum labore aut officiis ratione! Rem assumenda quod ut consequatur voluptatem qui aliquam suscipit. Qui quia eveniet et atque animi id voluptatem natus et enim laudantium aut laboriosam ratione.Sit tenetur pariatur sit iure accusantium et accusamus tenetur ut fugit consequatur eum eligendi velit sed sunt nobis et perspiciatis incidunt. Aut explicabo maxime non animi autem rem repudiandae labore eum aliquam quis.Lorem ipsum dolor sit amet. Quo vitae omnis qui sunt officiis qui dolor assumenda a officia quia. Ab nihil inventore sed accusamus quaerat At velit quidem qui molestias quidem est rerum labore aut officiis ratione! Rem assumenda quod ut consequatur voluptatem qui aliquam suscipit. Qui quia eveniet et atque animi id voluptatem natus et enim laudantium aut laboriosam ratione.Sit tenetur pariatur sit iure accusantium et accusamus tenetur ut fugit consequatur eum eligendi velit sed sunt nobis et perspiciatis incidunt. Aut explicabo maxime non animi autem rem repudiandae labore eum aliquam quis.",
            web: true,
            mobile: true,
            appMobileIOS: true,
            appMobileAndroid: true,
            backend: true,
            multilanguage: true
        },
        {
            title: "Landing Page(em desenvolvimento)",
            mode: "site",
            description: "Captura de usuários e vendas produtos/serviços ",
            more: "Lorem ipsum dolor sit amet. Quo vitae omnis qui sunt officiis qui dolor assumenda a officia quia. Ab nihil inventore sed accusamus quaerat At velit quidem qui molestias quidem est rerum labore aut officiis ratione! Rem assumenda quod ut consequatur voluptatem qui aliquam suscipit. Qui quia eveniet et atque animi id voluptatem natus et enim laudantium aut laboriosam ratione.Sit tenetur pariatur sit iure accusantium et accusamus tenetur ut fugit consequatur eum eligendi velit sed sunt nobis et perspiciatis incidunt. Aut explicabo maxime non animi autem rem repudiandae labore eum aliquam quis.Lorem ipsum dolor sit amet. Quo vitae omnis qui sunt officiis qui dolor assumenda a officia quia. Ab nihil inventore sed accusamus quaerat At velit quidem qui molestias quidem est rerum labore aut officiis ratione! Rem assumenda quod ut consequatur voluptatem qui aliquam suscipit. Qui quia eveniet et atque animi id voluptatem natus et enim laudantium aut laboriosam ratione.Sit tenetur pariatur sit iure accusantium et accusamus tenetur ut fugit consequatur eum eligendi velit sed sunt nobis et perspiciatis incidunt. Aut explicabo maxime non animi autem rem repudiandae labore eum aliquam quis.",
            web: true,
            mobile: true,
            appMobileIOS: true,
            appMobileAndroid: true,
            backend: true,
            multilanguage: true
        },
        {
            title: "Educacional(em desenvolvimento)",
            mode: "site",
            description: "distribuição cursos e gestão alunos",
            more: "Lorem ipsum dolor sit amet. Quo vitae omnis qui sunt officiis qui dolor assumenda a officia quia. Ab nihil inventore sed accusamus quaerat At velit quidem qui molestias quidem est rerum labore aut officiis ratione! Rem assumenda quod ut consequatur voluptatem qui aliquam suscipit. Qui quia eveniet et atque animi id voluptatem natus et enim laudantium aut laboriosam ratione.Sit tenetur pariatur sit iure accusantium et accusamus tenetur ut fugit consequatur eum eligendi velit sed sunt nobis et perspiciatis incidunt. Aut explicabo maxime non animi autem rem repudiandae labore eum aliquam quis.Lorem ipsum dolor sit amet. Quo vitae omnis qui sunt officiis qui dolor assumenda a officia quia. Ab nihil inventore sed accusamus quaerat At velit quidem qui molestias quidem est rerum labore aut officiis ratione! Rem assumenda quod ut consequatur voluptatem qui aliquam suscipit. Qui quia eveniet et atque animi id voluptatem natus et enim laudantium aut laboriosam ratione.Sit tenetur pariatur sit iure accusantium et accusamus tenetur ut fugit consequatur eum eligendi velit sed sunt nobis et perspiciatis incidunt. Aut explicabo maxime non animi autem rem repudiandae labore eum aliquam quis.",
            web: true,
            mobile: true,
            appMobileIOS: true,
            appMobileAndroid: true,
            backend: true,
            multilanguage: true
        },
        {
            title: "E-Commerce(em desenvolvimento)",
            mode: "site",
            description: "Loja online de vendas",
            more: "Lorem ipsum dolor sit amet. Quo vitae omnis qui sunt officiis qui dolor assumenda a officia quia. Ab nihil inventore sed accusamus quaerat At velit quidem qui molestias quidem est rerum labore aut officiis ratione! Rem assumenda quod ut consequatur voluptatem qui aliquam suscipit. Qui quia eveniet et atque animi id voluptatem natus et enim laudantium aut laboriosam ratione.Sit tenetur pariatur sit iure accusantium et accusamus tenetur ut fugit consequatur eum eligendi velit sed sunt nobis et perspiciatis incidunt. Aut explicabo maxime non animi autem rem repudiandae labore eum aliquam quis.Lorem ipsum dolor sit amet. Quo vitae omnis qui sunt officiis qui dolor assumenda a officia quia. Ab nihil inventore sed accusamus quaerat At velit quidem qui molestias quidem est rerum labore aut officiis ratione! Rem assumenda quod ut consequatur voluptatem qui aliquam suscipit. Qui quia eveniet et atque animi id voluptatem natus et enim laudantium aut laboriosam ratione.Sit tenetur pariatur sit iure accusantium et accusamus tenetur ut fugit consequatur eum eligendi velit sed sunt nobis et perspiciatis incidunt. Aut explicabo maxime non animi autem rem repudiandae labore eum aliquam quis.",
            web: true,
            mobile: true,
            appMobileIOS: true,
            appMobileAndroid: true,
            backend: true,
            multilanguage: true
        },
        {
            title: "Educacional(em desenvolvimento)",
            mode: "site",
            description: "Ex: sites pessoais / comerciais com dados estáticos",
            more: "Lorem ipsum dolor sit amet. Quo vitae omnis qui sunt officiis qui dolor assumenda a officia quia. Ab nihil inventore sed accusamus quaerat At velit quidem qui molestias quidem est rerum labore aut officiis ratione! Rem assumenda quod ut consequatur voluptatem qui aliquam suscipit. Qui quia eveniet et atque animi id voluptatem natus et enim laudantium aut laboriosam ratione.Sit tenetur pariatur sit iure accusantium et accusamus tenetur ut fugit consequatur eum eligendi velit sed sunt nobis et perspiciatis incidunt. Aut explicabo maxime non animi autem rem repudiandae labore eum aliquam quis.Lorem ipsum dolor sit amet. Quo vitae omnis qui sunt officiis qui dolor assumenda a officia quia. Ab nihil inventore sed accusamus quaerat At velit quidem qui molestias quidem est rerum labore aut officiis ratione! Rem assumenda quod ut consequatur voluptatem qui aliquam suscipit. Qui quia eveniet et atque animi id voluptatem natus et enim laudantium aut laboriosam ratione.Sit tenetur pariatur sit iure accusantium et accusamus tenetur ut fugit consequatur eum eligendi velit sed sunt nobis et perspiciatis incidunt. Aut explicabo maxime non animi autem rem repudiandae labore eum aliquam quis.",
            web: true,
            mobile: true,
            appMobileIOS: true,
            appMobileAndroid: true,
            backend: true,
            multilanguage: true
        },
        {
            title: "B2B , B2C (Vendas)(em desenvolvimento)",
            mode: "site",
            description: "Ex: Amazon, Alibaba",
            more: "Lorem ipsum dolor sit amet. Quo vitae omnis qui sunt officiis qui dolor assumenda a officia quia. Ab nihil inventore sed accusamus quaerat At velit quidem qui molestias quidem est rerum labore aut officiis ratione! Rem assumenda quod ut consequatur voluptatem qui aliquam suscipit. Qui quia eveniet et atque animi id voluptatem natus et enim laudantium aut laboriosam ratione.Sit tenetur pariatur sit iure accusantium et accusamus tenetur ut fugit consequatur eum eligendi velit sed sunt nobis et perspiciatis incidunt. Aut explicabo maxime non animi autem rem repudiandae labore eum aliquam quis.Lorem ipsum dolor sit amet. Quo vitae omnis qui sunt officiis qui dolor assumenda a officia quia. Ab nihil inventore sed accusamus quaerat At velit quidem qui molestias quidem est rerum labore aut officiis ratione! Rem assumenda quod ut consequatur voluptatem qui aliquam suscipit. Qui quia eveniet et atque animi id voluptatem natus et enim laudantium aut laboriosam ratione.Sit tenetur pariatur sit iure accusantium et accusamus tenetur ut fugit consequatur eum eligendi velit sed sunt nobis et perspiciatis incidunt. Aut explicabo maxime non animi autem rem repudiandae labore eum aliquam quis.",
            web: true,
            mobile: true,
            appMobileIOS: true,
            appMobileAndroid: true,
            backend: true,
            multilanguage: true
        },
        {
            title: "ERP ( BackOffice)(em desenvolvimento)",
            mode: "site",
            description: "Ex: SAP, Oracle ERP",
            more: "Lorem ipsum dolor sit amet. Quo vitae omnis qui sunt officiis qui dolor assumenda a officia quia. Ab nihil inventore sed accusamus quaerat At velit quidem qui molestias quidem est rerum labore aut officiis ratione! Rem assumenda quod ut consequatur voluptatem qui aliquam suscipit. Qui quia eveniet et atque animi id voluptatem natus et enim laudantium aut laboriosam ratione.Sit tenetur pariatur sit iure accusantium et accusamus tenetur ut fugit consequatur eum eligendi velit sed sunt nobis et perspiciatis incidunt. Aut explicabo maxime non animi autem rem repudiandae labore eum aliquam quis.Lorem ipsum dolor sit amet. Quo vitae omnis qui sunt officiis qui dolor assumenda a officia quia. Ab nihil inventore sed accusamus quaerat At velit quidem qui molestias quidem est rerum labore aut officiis ratione! Rem assumenda quod ut consequatur voluptatem qui aliquam suscipit. Qui quia eveniet et atque animi id voluptatem natus et enim laudantium aut laboriosam ratione.Sit tenetur pariatur sit iure accusantium et accusamus tenetur ut fugit consequatur eum eligendi velit sed sunt nobis et perspiciatis incidunt. Aut explicabo maxime non animi autem rem repudiandae labore eum aliquam quis.",
            web: true,
            mobile: true,
            appMobileIOS: true,
            appMobileAndroid: true,
            backend: true,
            multilanguage: true
        },
        {
            title: "Plugins(em desenvolvimento)",
            mode: "system",
            description: "Pacote de plugins para o sistema",
            more: "Lorem ipsum dolor sit amet. Quo vitae omnis qui sunt officiis qui dolor assumenda a officia quia. Ab nihil inventore sed accusamus quaerat At velit quidem qui molestias quidem est rerum labore aut officiis ratione! Rem assumenda quod ut consequatur voluptatem qui aliquam suscipit. Qui quia eveniet et atque animi id voluptatem natus et enim laudantium aut laboriosam ratione.Sit tenetur pariatur sit iure accusantium et accusamus tenetur ut fugit consequatur eum eligendi velit sed sunt nobis et perspiciatis incidunt. Aut explicabo maxime non animi autem rem repudiandae labore eum aliquam quis.Lorem ipsum dolor sit amet. Quo vitae omnis qui sunt officiis qui dolor assumenda a officia quia. Ab nihil inventore sed accusamus quaerat At velit quidem qui molestias quidem est rerum labore aut officiis ratione! Rem assumenda quod ut consequatur voluptatem qui aliquam suscipit. Qui quia eveniet et atque animi id voluptatem natus et enim laudantium aut laboriosam ratione.Sit tenetur pariatur sit iure accusantium et accusamus tenetur ut fugit consequatur eum eligendi velit sed sunt nobis et perspiciatis incidunt. Aut explicabo maxime non animi autem rem repudiandae labore eum aliquam quis.",
            web: true,
            mobile: true,
            appMobileIOS: true,
            appMobileAndroid: true,
            backend: true,
            multilanguage: true
        },
        {
            title: "Pacote de Componentes(em desenvolvimento)",
            mode: "system",
            description: "Pacote de componentes para o sistema",
            more: "Lorem ipsum dolor sit amet. Quo vitae omnis qui sunt officiis qui dolor assumenda a officia quia. Ab nihil inventore sed accusamus quaerat At velit quidem qui molestias quidem est rerum labore aut officiis ratione! Rem assumenda quod ut consequatur voluptatem qui aliquam suscipit. Qui quia eveniet et atque animi id voluptatem natus et enim laudantium aut laboriosam ratione.Sit tenetur pariatur sit iure accusantium et accusamus tenetur ut fugit consequatur eum eligendi velit sed sunt nobis et perspiciatis incidunt. Aut explicabo maxime non animi autem rem repudiandae labore eum aliquam quis.Lorem ipsum dolor sit amet. Quo vitae omnis qui sunt officiis qui dolor assumenda a officia quia. Ab nihil inventore sed accusamus quaerat At velit quidem qui molestias quidem est rerum labore aut officiis ratione! Rem assumenda quod ut consequatur voluptatem qui aliquam suscipit. Qui quia eveniet et atque animi id voluptatem natus et enim laudantium aut laboriosam ratione.Sit tenetur pariatur sit iure accusantium et accusamus tenetur ut fugit consequatur eum eligendi velit sed sunt nobis et perspiciatis incidunt. Aut explicabo maxime non animi autem rem repudiandae labore eum aliquam quis.",
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
            enabled: true,
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
            enabled: false,
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
            enabled: false,
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
            enabled: true,
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
            enabled: false,
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
            enabled: false,
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

    static styles = css`
        :host {
            overflow-y: auto;
            overflow-x: hidden;
            display: block
        }

        button {
            background-color: var(--bg-secondary-color-lighter);
            border-radius: 8px;
            border: none;
            box-shadow: 0 1px 3px 0 var(--grey-color);
            display: flex;
            flex-direction: row;
            justify-content: center;
            gap: .2rem;
            font-weight: 700;
            align-items: center;
            height: 40px;
            transition: height .3s cubic-bezier(.25, .1, .25, 1);
            padding: .5rem;
            color: var(--text-primary-color);
            cursor: pointer
        }

        button:hover {
            background-color: var(--grey-color-light)
        }

        summary {
            cursor: pointer
        }

        input,
        select,
        textarea {
            display: block;
            font-size: 1rem;
            line-height: 1.5;
            color: #000000;
            background-color: #fff;
            background-clip: padding-box;
            border: 1px solid #ced4da;
            border-radius: .25rem;
            transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
            outline: none
        }


        details>div {
            padding-left: var(--space-32)
        }

        .container-input {
            max-width: 600px
        }

        textarea,
        input {
            width: 100%;
            max-width: 100%;
            min-width: 200px
        }

        input:read-only {
            background-color: var(--grey-color-light)
        }

        ul {
            padding-inline-start: 0
        }

        .buttons-container {
            margin-top: var(--space-32);
            margin-bottom: var(--space-32);
            display: flex;
            justify-content: center
        }

        .buttons-container button {
            color: #ffffff;
            background-color: var(--active-color);
            min-width: 200px
        }

        .buttons-container.left {
            margin-top: var(--space-16);
            justify-content: start
        }

        .select-type-project {
            padding: var(--space-16)
        }

        .select-type-project .cols {
            display: flex;
            gap: 3rem;
            flex-wrap: wrap
        }

        .select-type-project .cols .col-left {
            flex: 1
        }

        .select-type-project .cols .col-left ul {
            list-style: none;
            padding-inline-start: 0
        }

        .select-type-project .cols .col-left ul li:hover {
            background-color: var(--grey-color-light)
        }

        .select-type-project .cols .col-left ul li.selected {
            background-color: var(--active-color);
            color: #ffffff
        }

        .select-type-project .cols .col-left ul li.selected small {
            color: #ffffff
        }

        .select-type-project .cols .col-left ul li {
            padding: 1rem .3rem;
            font-size: var(--font-size-16);
            margin-bottom: var(--space-8);
            cursor: pointer;
            border-bottom: 1px solid var(--grey-color)
        }

        .select-type-project .cols .col-left ul li span {
            font-weight: var(--font-weight-bold)
        }

        .select-type-project .cols .col-left ul li small {
            font-weight: var(--font-weight-lighter);
            color: var(--text-primary-color-lighter)
        }

        .select-type-project .cols .col-right {
            min-width: 400px;
            flex: 1
        }

        .select-type-project .cols .col-right .details-selected-item {
            margin-top: 2rem
        }

        .select-type-project .cols .col-right .details-selected-item .details-title {
            font-size: var(--font-size-20);
            font-weight: var(--font-weight-bold);
            display: block
        }

        .select-type-project .cols .col-right .details-selected-item .details-more {
            font-size: var(--font-size-16)
        }

        .select-type-project .cols .col-right .details-select-type {
            display: block
        }

        .select-type-project .cols .col-right .details-select-type span {
            display: flex;
            justify-content: center
        }

        .select-type-project table {
            font-size: var(--font-size-16);
            border-spacing: 0;
            table-layout: fixed;
            width: 100%
        }

        .select-type-project table thead th {
            border: none;
            background-color: var(--grey-color-light)
        }

        .select-type-project table thead th:nth-child(1) {
            width: 200px
        }

        .select-type-project table thead th:not(:nth-child(1)) {
            width: 80px
        }

        .select-type-project table tbody tr>td:not(:nth-child(1)) {
            width: 80px
        }

        .select-type-project table tbody tr {
            cursor: pointer
        }

        .select-type-project table tbody tr:hover {
            background-color: var(--grey-color-light)
        }

        .select-type-project table tbody tr.selected {
            background-color: var(--active-color);
            color: #ffffff
        }

        .select-type-project table tbody tr.selected small {
            color: #ffffff
        }

        .select-type-project table tbody tr.selected svg {
            fill: #ffffff
        }

        .select-type-project table tbody td {
            text-align: center;
            vertical-align: middle
        }

        .select-type-project table tbody td span {
            font-weight: var(--font-weight-bold)
        }

        .select-type-project table tbody td small {
            font-weight: var(--font-weight-lighter);
            color: var(--text-primary-color-lighter)
        }

        .details-new-project {
            padding: var(--space-16)
        }

        .details-new-project ul {
            list-style: none
        }

        .details-new-project .card-list {
            display: flex;
            gap: 2rem;
            margin-top: 2rem;
            margin-bottom: 2rem;
            flex-wrap: wrap
        }

        .details-new-project .card-lock {
            z-index: 1001;
            opacity: 1;
            position: absolute;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: var(--error-color);
            border: 1px solid var(--grey-color);
            background-color: var(--bg-primary-color);
            top: -15px;
            right: -15px
        }

        .details-new-project .card-lock svg {
            fill: var(--error-color)
        }

        .details-new-project .card-item.disabled {
            cursor: not-allowed;
            opacity: .6;
            user-select: none
        }

        .details-new-project .card-item {
            z-index: 1000;
            position: relative;
            display: flex;
            flex-direction: column;
            width: 300px;
            border: 1px solid var(--grey-color-light);
            padding: var(--space-16);
            gap: .4rem;
            cursor: pointer;
            transition: transform .1s ease-in-out
        }

        .details-new-project .card-item:hover:not(.disabled),
        .details-new-project .card-item.selected {
            background-color: var(--grey-color-light)
        }

        .details-new-project .card-item.shake {
            animation: shake 1s cubic-bezier(.7, 0, .3, 1)
        }

        .details-new-project .card-item .card-type {
            width: 30px;
            display: block;
            margin-left: auto;
            padding: .25em .4em;
            font-size: 75%;
            font-weight: 700;
            line-height: 1;
            text-align: center;
            white-space: nowrap;
            padding-right: .6em;
            padding-left: .6em;
            border-radius: 10rem;
            background-color: var(--bg-secondary-color)
        }

        .details-new-project .card-item .card-type.free {
            background-color: var(--success-color);
            color: var(--grey-color-lighter)
        }

        .details-new-project .card-item .card-type.pro {
            background-color: var(--active-color);
            color: var(--grey-color-lighter)
        }

        .details-new-project .card-item .card-desc {
            font-size: var(--font-size-16)
        }

        .details-new-project .card-item .card-details {
            font-size: var(--font-size-16)
        }

        .details-new-project .card-item .card-details ul li {
            display: flex;
            align-items: center
        }

        @keyframes shake {
            0% {
                transform: translateX(0)
            }

            10% {
                transform: translateX(-10px)
            }

            20% {
                transform: translateX(8px)
            }

            30% {
                transform: translateX(-6px)
            }

            40% {
                transform: translateX(4px)
            }

            50% {
                transform: translateX(-2px)
            }

            60% {
                transform: translateX(1px)
            }

            70% {
                transform: translateX(-0.5px)
            }

            80% {
                transform: translateX(.25px)
            }

            90% {
                transform: translateX(-0.1px)
            }

            100% {
                transform: translateX(0)
            }
        }

    `;

}

type IScenaries = 'select' | 'customize';
interface IPlugins {
    type: 'free' | 'pro',
    enabled: boolean,
    title: string,
    description: string,
    details: IPluginsPublishDetails[]
}

interface IPluginsPublishDetails {
    item: string,
    enabled: boolean
}

interface ISites {
    mode: 'site' | 'system',
    title: string,
    description: string,
    more: string,
    web: true,
    mobile: boolean,
    appMobileIOS: boolean,
    appMobileAndroid: boolean,
    backend: boolean,
    multilanguage: boolean
}