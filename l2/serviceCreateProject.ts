/// <mls shortName="serviceCreateProject" project="100554" enhancement="_100554_enhancementLitService" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';
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

@customElement('service-create-project-100554')
export class ServiceCreateProject100554 extends ServiceBase {

    constructor() {
        super();
        this.setEvents();
    }

    private msg: MessageType = messages['en'];

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property({ type: String }) currentScenario: IScenaries = 'select';

    @property() actualSiteSelected: ISites | undefined;

    @queryAll('.tr-item') sitesItems: NodeListOf<HTMLElement> | undefined;

    @queryAll('.publish-item') publishItems: NodeListOf<HTMLElement> | undefined;

    @queryAll('.storage-item') storageItems: NodeListOf<HTMLElement> | undefined;

    public details: IService = {
        icon: '&#xf15b',
        state: 'background',
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

    public onClickTitle() {
        this.changeScenario('select');
        this.actualSiteSelected = undefined;
        this.menu.title = {
            icon: '',
            text: this.msg.createProjectTitle,
        }
        if (this.menu.updateTitle) this.menu.updateTitle();
    }

    public menu: IMenu = {
        title: this.msg.createProjectTitle,
        actions: {
        },
        icons: {},
        actionDefault: '', // call after close icon clicked
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        onClickTitle: this.onClickTitle.bind(this),
        getLastMode: undefined,
        updateTitle: undefined
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {
        if (visible === true) this.setFullScreen(6, 'left')
        else this.setFullScreen(6, 'default')
    }

    private changeScenario(scenario: IScenaries) {
        this.currentScenario = scenario
    }

    private onBtnContinueClick() {
        if (!this.actualSiteSelected) {
            this.setError(this.msg.errorContinue)
            return;
        }

        if (this.actualSiteSelected.title !== 'Blog / Institucional') {
            this.setError(this.msg.alert)
            return;
        }
        this.menu.title = {
            icon: '&#xf053',
            text: this.msg.createProjectTitle
        }
        if (this.menu.updateTitle) this.menu.updateTitle();
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

    private setEvents() {
        mls.events.addEventListener([6], ['ProjectCreate'] as any, (details) => {
            this.openService('_100554_serviceCreateProject', 'left', 6);
        });
    }

    private renderSelect() {
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

    private renderCustomize() {
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