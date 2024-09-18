/// <mls shortName="serviceProject" project="100554" enhancement="_100554_enhancementLitService" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';
import { collab_user } from './_100554_collabIcons';
import { getAllWebComponentsInSource } from './_100554_libCompile';
import { convertTagToFileName } from './_100554_utilsLit';

/// **collab_i18n_start**
const message_pt = {
    installPlugin: 'Explore e adicione novos plug-ins',
}

const message_en = {
    installPlugin: 'Explore and add new plugins',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-project-100554')
export class ServiceProject100554 extends ServiceBase {

    private msg: MessageType = messages['en'];

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property() activeTab: IScenery = 'Explore';

    @query('#projectDiv') projectDiv: HTMLDivElement | undefined;


    public details: IService = {
        icon: '&#xf542',
        state: 'foreground',
        position: 'left',
        tooltip: 'Project',
        visible: true,
        widget: '_100554_serviceProject',
        level: [5]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public onClickIcon = (op: string): void => {
        this.activeTab = op as IScenery;
    }

    public menu: IMenu = {
        title: '',
        actions: {
        },
        icons: {
            Explore: 'Explore;e521',
            ShowCase: 'ShowCase;f5da',
            Admin: 'Admin;f508',
            Plugins: 'Plugins;f1e6',
        },
        actionDefault: '', // call after close icon clicked
        iconDefault: 'Explore',
        iconMenuType: 'full',
        setMode: undefined,
        updateTitle: undefined,
        getLastMode: undefined,
        lastIcon: undefined,
        setIconActive: undefined,
        onClickLink: this.onClickLink,
        onClickIcon: this.onClickIcon,


    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return html`
            ${this.renderContent()}
        `;
    }

    renderContent() {
        switch (this.activeTab) {
            case 'Explore':
                return this.renderExplore();
            case 'ShowCase':
                return this.renderShowCase();
            case 'Admin':
                return this.renderAdmin();
            case 'Plugins':
                return this.renderPlugin();
            default:
                return html``;
        }
    }

    private renderExplore() {
        return html`In develpoment`;
    }

    private renderShowCase() {
        const { project } = mls.actual[5];
        if (!project) return '<div>No project selected</div<';
        const keyToFile = mls.stor.getKeyToFiles(project, 2, 'project', '', '.html');
        const file = mls.stor.files[keyToFile]
        if (!file) return html`<div>File 'project.html' dont's exist in selected project</div>`;
        this.loadHelpPage('project' || '', project || 0);
        return html`<div style="overflow:auto;height:100%;" id="projectDiv"></div>`
    }


    private renderAdmin() {
        return html`
        <div>
            <div class="panel">
                <div class="panel-container">
                    <div class="panel-container-item">
                        <svg fill="#000000" height="40px" width="40px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 459.75 459.75" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M447.652,304.13h-40.138c-6.681,0-12.097,5.416-12.097,12.097v95.805c0,6.681,5.416,12.098,12.097,12.098h40.138 c6.681,0,12.098-5.416,12.098-12.098v-95.805C459.75,309.546,454.334,304.13,447.652,304.13z"></path> <path d="M348.798,258.13H308.66c-6.681,0-12.098,5.416-12.098,12.097v141.805c0,6.681,5.416,12.098,12.098,12.098h40.138 c6.681,0,12.097-5.416,12.097-12.098V270.228C360.896,263.546,355.48,258.13,348.798,258.13z"></path> <path d="M151.09,304.13h-40.138c-6.681,0-12.097,5.416-12.097,12.097v95.805c0,6.681,5.416,12.098,12.097,12.098h40.138 c6.681,0,12.098-5.416,12.098-12.098v-95.805C163.188,309.546,157.771,304.13,151.09,304.13z"></path> <path d="M52.236,258.13H12.098C5.416,258.13,0,263.546,0,270.228v141.805c0,6.681,5.416,12.098,12.098,12.098h40.138 c6.681,0,12.097-5.416,12.097-12.098V270.228C64.333,263.546,58.917,258.13,52.236,258.13z"></path> <path d="M249.944,196.968h-40.138c-6.681,0-12.098,5.416-12.098,12.098v202.967c0,6.681,5.416,12.098,12.098,12.098h40.138 c6.681,0,12.098-5.416,12.098-12.098V209.066C262.042,202.384,256.625,196.968,249.944,196.968z"></path> <path d="M436.869,244.62c8.14,0,15-6.633,15-15v-48.479c0-8.284-6.716-15-15-15c-8.284,0-15,6.716-15,15v12.119L269.52,40.044 c-3.148-3.165-7.536-4.767-11.989-4.362c-4.446,0.403-8.482,2.765-11.011,6.445L131.745,209.185L30.942,144.969 c-6.987-4.451-16.26-2.396-20.71,4.592c-4.451,6.987-2.396,16.259,4.592,20.71l113.021,72c2.495,1.589,5.286,2.351,8.046,2.351 c4.783,0,9.475-2.285,12.376-6.507L261.003,74.025L400.8,214.62h-12.41c-8.284,0-15,6.716-15,15c0,8.284,6.716,15,15,15 c6.71,0,41.649,0,48.443,0H436.869z"></path> </g> </g></svg>
                        <span>Usage</span>
                    </div>
                    <div class="panel-container-item">
                       <svg viewBox="0 0 32 32" height="40px" width="40px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="icomoon-ignore"> </g> <path d="M17.599 3.738v2.598l0.8 0.207c0.905 0.234 1.768 0.597 2.566 1.081l0.715 0.434 1.86-1.86 2.262 2.262-1.888 1.888 0.407 0.708c0.451 0.785 0.788 1.635 1.002 2.527l0.196 0.817h2.744v3.199h-2.806l-0.216 0.782c-0.233 0.844-0.583 1.654-1.040 2.406l-0.434 0.716 2.036 2.035-2.262 2.262-2.064-2.064-0.707 0.407c-0.734 0.422-1.531 0.745-2.368 0.961l-0.8 0.206v2.951h-3.199v-2.951l-0.8-0.206c-0.837-0.216-1.634-0.539-2.368-0.961l-0.708-0.407-2.064 2.064-2.262-2.262 2.036-2.035-0.434-0.716c-0.457-0.753-0.807-1.562-1.040-2.406l-0.216-0.782h-2.806v-3.199h2.744l0.196-0.817c0.213-0.891 0.551-1.742 1.002-2.527l0.407-0.708-1.888-1.888 2.262-2.262 1.86 1.86 0.715-0.434c0.798-0.484 1.661-0.848 2.566-1.081l0.8-0.207v-2.598h3.199zM16 20.799c2.646 0 4.798-2.153 4.798-4.799s-2.152-4.799-4.798-4.799-4.798 2.153-4.798 4.799c0 2.646 2.152 4.799 4.798 4.799zM18.666 2.672h-5.331v2.839c-1.018 0.263-1.975 0.67-2.852 1.202l-2.022-2.022-3.769 3.77 2.065 2.065c-0.498 0.867-0.875 1.81-1.114 2.809h-2.97v5.331h3.060c0.263 0.953 0.655 1.85 1.156 2.676l-2.198 2.198 3.769 3.77 2.241-2.241c0.816 0.469 1.7 0.828 2.633 1.069v3.191h5.331v-3.191c0.933-0.241 1.817-0.6 2.633-1.069l2.241 2.241 3.769-3.77-2.198-2.198c0.501-0.826 0.893-1.723 1.156-2.676h3.060v-5.331h-2.97c-0.239-0.999-0.616-1.941-1.114-2.809l2.065-2.065-3.769-3.77-2.022 2.022c-0.877-0.532-1.834-0.939-2.852-1.202v-2.839h-0zM16 19.733c-2.062 0-3.732-1.671-3.732-3.733s1.67-3.732 3.732-3.732 3.732 1.671 3.732 3.732c0 2.062-1.67 3.733-3.732 3.733v0z" > </path> </g></svg>
                        <span>Config</span>
                    </div>     
                </div>
            </div>
        
        </div>`;
    }

    private renderPlugin() {
        const groupedPlugins = this.groupPluginsByCategory(this.pluginsList);
        const sortedCategories = Object.keys(groupedPlugins).sort();
        return html`

        <ul class="plugin-container">
            ${sortedCategories.map(category => html`
                <li class="headerCategory">
                    <details open ">
                        <summary>${category}</summary>
                            <div class="plugins-list">
                            ${groupedPlugins[category].map(plugin => html`
                                <div
                                    plugin-id="${plugin.prjID}"
                                    class="${plugin.status === 'active' ? 'plugin active' : 'plugin'}"                                
                                >
                                    <div class= "plugin-title">
                                        <h3>${plugin.name}</h3>
                                    </div>
                                    <div class="plugin-info">    
                                        <p>${plugin.description}</p>
                                        <div>
                                            <div class="owner">
                                                <i>${collab_user}</i>
                                                <span>CollabTeam</span>
                                            </div>
                                            <div class="${plugin.status === 'active' ? 'plugin-status active' : 'plugin-status inactive'}">
                                                <div></div>
                                                <span>${plugin.status === 'active' ? 'Enabled' : 'Disabled'}</span>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            `)}
                        </div>
                        
                    </details>
                </li>        
            `)}
        </ul>
        <div class="buttons-container">
            <button @click=${this.handleAddNewPlugin}>${this.msg.installPlugin}</button>
        </div>
    `;
    }

    private handleAddNewPlugin() {
        alert('In Develpoment');
    }




    private pluginsList: Plugin[] = [
        { prjID: 1, name: "SEO Optimizer", description: "Melhore o posicionamento do seu site nos mecanismos de busca, ajustando as práticas recomendadas de SEO de forma automatizada e eficaz.", category: "SEO", status: "active" },
        { prjID: 3, name: "Social Media Integration", description: "Integre facilmente plataformas de redes sociais ao seu site, permitindo que os usuários compartilhem conteúdo e conectem suas contas.", category: "Social Media", status: "active" },
        { prjID: 4, name: "E-commerce Solution", description: "Gerencie sua loja online com este plugin robusto, que permite controle completo sobre inventário, vendas e integração de pagamentos.", category: "E-commerce", status: "active" },
        { prjID: 6, name: "Gallery Manager", description: "Crie, organize e gerencie galerias de imagens no seu site, oferecendo uma experiência visual personalizada e otimizada para seus visitantes.", category: "Media", status: "active" },
        { prjID: 9, name: "Custom CSS Editor", description: "Personalize o design do seu site com um editor de CSS integrado, permitindo edições diretas no estilo das suas páginas sem a necessidade de ferramentas externas.", category: "Design", status: "active" },
        { prjID: 11, name: "Email Marketing Integration", description: "Integre serviços de marketing por e-mail diretamente ao seu site, facilitando o envio de newsletters e campanhas personalizadas para sua audiência.", category: "Marketing", status: "active" },
        { prjID: 15, name: "Image Optimizer", description: "Otimize automaticamente as imagens do seu site para melhorar a performance, garantindo tempos de carregamento mais rápidos sem perder qualidade.", category: "Media", status: "active" },
        { prjID: 17, name: "Knowledge Base", description: "Crie e organize uma base de conhecimento completa para seus usuários, permitindo fácil acesso a artigos de ajuda e documentação técnica.", category: "Content", status: "inactive" },
        { prjID: 20, name: "Newsletter Subscription", description: "Permita que os visitantes do seu site se inscrevam facilmente em newsletters, mantendo-os atualizados sobre novidades e promoções de maneira automatizada.", category: "Marketing", status: "active" },
        { prjID: 22, name: "Payment Gateway Integration", description: "Integre uma ampla variedade de gateways de pagamento ao seu site, garantindo uma experiência de checkout segura e fácil para seus clientes.", category: "E-commerce", status: "inactive" },
        { prjID: 24, name: "Related Posts", description: "Exiba posts relacionados ao final de cada artigo, aumentando o engajamento dos usuários ao manter o interesse em conteúdos similares.", category: "Content", status: "inactive" },
        { prjID: 26, name: "SEO Friendly URLs", description: "Gere URLs otimizadas para SEO automaticamente, melhorando o posicionamento do seu site nos mecanismos de busca e facilitando a indexação de conteúdo.", category: "SEO", status: "inactive" },
        { prjID: 27, name: "Social Sharing Buttons", description: "Adicione botões de compartilhamento social aos seus posts, facilitando para os visitantes a divulgação de conteúdo em suas redes sociais preferidas.", category: "Social Media", status: "active" },
        { prjID: 28, name: "Theme Customizer", description: "Personalize facilmente a aparência do seu site com este plugin, que oferece uma interface simples para ajustar cores, fontes e layout.", category: "Design", status: "inactive" },
        { prjID: 30, name: "Video Embedder", description: "Incorpore vídeos diretamente nas suas postagens sem complicações, permitindo que você adicione conteúdo multimídia de maneira rápida e eficaz.", category: "Media", status: "inactive" },
    ];
    private groupPluginsByCategory(plugins: Plugin[]): { [category: string]: Plugin[] } {
        return plugins.reduce((acc, plugin) => {
            if (!acc[plugin.category]) {
                acc[plugin.category] = [];
            }
            acc[plugin.category].push(plugin);
            return acc;
        }, {} as { [category: string]: Plugin[] });
    }

    private async loadHelpPage(shortName: string, project: number) {
        const keyFile = mls.stor.getKeyToFiles(project, 2, shortName, '', '.html');
        const storFile = mls.stor.files[keyFile];
        if (storFile) {
            const content = await storFile.getContent();
            if (this.projectDiv && typeof content === 'string') {
                const allWcs = getAllWebComponentsInSource(content);

                allWcs.forEach((wc) => {
                    const fileName = convertTagToFileName(wc);
                    const script = document.createElement('script');
                    script.type = 'module';
                    script.id = fileName;
                    script.src = (`/${fileName}`);
                    this.projectDiv?.appendChild(script)
                });

                const div = document.createElement('div');
                div.innerHTML = content;
                div.children[0].setAttribute('level', '7');
                this.projectDiv.innerHTML = '';
                this.projectDiv.appendChild(div);
            }

        }
    }


}

type IScenery = 'Explore' | 'ShowCase' | 'Admin' | 'Plugins'

interface Plugin {
    prjID: number; // unique
    name: string;
    description: string;
    category: string;
    status: PluginStatus
}

type PluginStatus = 'active' | 'inactive';
