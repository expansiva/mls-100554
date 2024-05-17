/// <mls shortName="servicePlugins" project="100554" enhancement="_100554_enhancementLit" groupName="services" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IMenu } from './_100554_serviceBase';

/// **collab_i18n_start**
const message_pt = {
    installPlugin: 'Instalar plugin',
    createNewPlugin: 'Criar novo plugin',
    backList: 'Voltar à lista',
    noPluginsInstalled: 'Nenhum plugin instalado',
    desactivate: 'Desativar',
    activate: 'Ativar',
    delete: 'Excluir',
    reference: 'Referência',
    noPluginsAvaliables: 'Nenhum plugin disponível',
    install: 'Instalar',
    p1: 'O que são plugins?',
    p2: 'Plugins são trechos de código que incorporam funcionalidades adicionais ao seu projeto. Eles são desenvolvidos para estender e aprimorar as capacidades do seu projeto.',
    p3: 'Como os plugins funcionam?',
    p4: 'Quando você instala e ativa um plugin, ele introduz novos recursos ou funcionalidades ao seu projeto. Os plugins podem modificar a maneira como o seu projeto opera, adicionando novas opções de configuração, inteligência artificial, widgets, códigos curtos, entre outras funcionalidades.',
    p5: 'Onde encontrar plugins?',
    p6: 'Você pode localizar plugins diretamente no (L5) do seu projeto, na seção de Serviços (Service) chamado "Plugins". Neste local, é possível gerenciar e adicionar novos plugins ao seu projeto.',
    p7: 'Como criar um plugin?',
    p8: 'Para criar um plugin...',

}

const message_en = {
    installPlugin: 'Install plugin',
    createNewPlugin: 'Create new plugin',
    backList: 'Back list',
    noPluginsInstalled: 'No plugins  installed',
    desactivate: 'Desactivate',
    activate: 'Activate',
    delete: 'Delete',
    reference: 'Reference',
    noPluginsAvaliables: 'No plugins avaliables',
    install: 'Install',
    p1: 'What are plugins?',
    p2: 'Plugins are snippets of code that incorporate additional functionality into your project. They are developed to extend and enhance your projects capabilities.',
    p3: 'How do plugins work?',
    p4: 'When you install and activate a plugin, it introduces new features or functionality to your project. Plugins can modify the way your project operates, adding new configuration options, artificial intelligence, widgets, short codes, among other features.',
    p5: 'Where to find plugins?',
    p6: 'You can find plugins directly in (L5) of your project, in the Services section called "Plugins". Here, you can manage and add new plugins to your project.',
    p7: 'How to create a plugin?',
    p8: 'To create a plugin...',
}


type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-plugins-100554')
export class ServicePlugins extends ServiceBase {

    private msg: MessageType = messages['en'];
    
    static styles = css`[[mls_getDefaultDesignSystem]]`;

    get project(): number { return window['mls'] ? mls.actual[5].project as number : 0 };

    @property({ type: Array }) userPlugins: Plugin[] = this.getUserPluginsByProject(this.project);

    @property({ type: Array }) avaliablePlugins: Plugin[] = this.getAvaliablePlugins(this.project);

    @property({ type: String }) filterTerm: string = '';

    @property({ type: Number }) lastPluginIdAdd: number = -1;

    @property({ type: String }) currentScenario: IScenaries = 'list';
        
    public details: IService = {
        icon: '&#xf1e6',
        state: 'foreground',
        tooltip: 'Plugins',
        visible: true,
        position: "all",
        widget: '_100554_servicePlugins',
        level: [5],
    }

    public onClickLink = (op: string): boolean => {
        if (op === 'opPlugins') return this.showInitial();
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'Plugins',
        actions: {
            
        },
        icons: {},
        actionDefault: 'opPlugins', // call after close icon clicked
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
    }

    private showInitial(): boolean {
        return true;
    }

    onServiceClick(visible: boolean, reinit: boolean) {

        if (visible && reinit) {
            this.userPlugins = this.getUserPluginsByProject(this.project);
            this.avaliablePlugins = this.getAvaliablePlugins(this.project);
            this.currentScenario = 'list'
        }
    }

    getExamplesPlugins(): Plugin[] {

        return [
            // Exemplos de plugins comuns do WordPress
            { prjID: 1, name: "SEO Optimizer", description: "Enhances your site's SEO.", category: "SEO", ref: "https://example.com/plugin/seo-optimizer", status: "active" },
            { prjID: 2, name: "Contact Form Builder", description: "Create custom contact forms.", category: "Forms", ref: "https://example.com/plugin/contact-form-builder", status: "inactive" },
            { prjID: 3, name: "Social Media Integration", description: "Integrate social media platforms.", category: "Social Media", ref: "https://example.com/plugin/social-media-integration", status: "active" },
            { prjID: 4, name: "E-commerce Solution", description: "Manage your online store.", category: "E-commerce", ref: "https://example.com/plugin/e-commerce-solution", status: "active" },
            { prjID: 5, name: "Event Calendar", description: "Schedule and display events.", category: "Event Management", ref: "https://example.com/plugin/event-calendar", status: "inactive" },
            { prjID: 6, name: "Gallery Manager", description: "Create and manage image galleries.", category: "Media", ref: "https://example.com/plugin/gallery-manager", status: "active" },
            { prjID: 7, name: "Advanced Analytics", description: "Provides detailed analytics for your site.", category: "Analytics", ref: "https://example.com/plugin/advanced-analytics", status: "active" },
            { prjID: 8, name: "Backup and Restore", description: "Back up and restore your site data.", category: "Utilities", ref: "https://example.com/plugin/backup-restore", status: "inactive" },
            { prjID: 9, name: "Custom CSS Editor", description: "Edit the CSS of your site directly.", category: "Design", ref: "https://example.com/plugin/custom-css-editor", status: "active" },
            { prjID: 10, name: "Drag and Drop Builder", description: "Build your pages with a drag and drop interface.", category: "Page Builder", ref: "https://example.com/plugin/drag-drop-builder", status: "active" },
            { prjID: 11, name: "Email Marketing Integration", description: "Integrate email marketing services.", category: "Marketing", ref: "https://example.com/plugin/email-marketing", status: "active" },
            { prjID: 12, name: "Fast Cache Cleaner", description: "Speed up your site by cleaning cache.", category: "Performance", ref: "https://example.com/plugin/fast-cache-cleaner", status: "inactive" },
            { prjID: 13, name: "Google Maps Embed", description: "Embed Google Maps in your site.", category: "Maps", ref: "https://example.com/plugin/google-maps-embed", status: "active" },
            { prjID: 14, name: "Help Desk Support", description: "Add a help desk system to your site.", category: "Support", ref: "https://example.com/plugin/help-desk-support", status: "inactive" },
            { prjID: 15, name: "Image Optimizer", description: "Optimize images for better performance.", category: "Media", ref: "https://example.com/plugin/image-optimizer", status: "active" },
            { prjID: 16, name: "Job Board", description: "Create a job board for your site.", category: "Business", ref: "https://example.com/plugin/job-board", status: "active" },
            { prjID: 17, name: "Knowledge Base", description: "Build a knowledge base for your users.", category: "Content", ref: "https://example.com/plugin/knowledge-base", status: "inactive" },
            { prjID: 18, name: "Live Chat", description: "Enable live chat support on your site.", category: "Communication", ref: "https://example.com/plugin/live-chat", status: "active" },
            { prjID: 19, name: "Membership Management", description: "Manage user memberships on your site.", category: "Community", ref: "https://example.com/plugin/membership-management", status: "inactive" },
            { prjID: 20, name: "Newsletter Subscription", description: "Allow users to subscribe to your newsletters.", category: "Marketing", ref: "https://example.com/plugin/newsletter-subscription", status: "active" },
            { prjID: 21, name: "Online Booking", description: "Manage online bookings and appointments.", category: "Booking", ref: "https://example.com/plugin/online-booking", status: "active" },
            { prjID: 22, name: "Payment Gateway Integration", description: "Integrate various payment gateways.", category: "E-commerce", ref: "https://example.com/plugin/payment-gateway", status: "inactive" },
            { prjID: 23, name: "Quiz and Survey", description: "Create quizzes and surveys for your users.", category: "Interactive", ref: "https://example.com/plugin/quiz-survey", status: "active" },
            { prjID: 24, name: "Related Posts", description: "Show related posts at the end of each article.", category: "Content", ref: "https://example.com/plugin/related-posts", status: "inactive" },
            { prjID: 25, name: "Security Firewall", description: "Enhance the security of your site.", category: "Security", ref: "https://example.com/plugin/security-firewall", status: "active" },
            { prjID: 26, name: "SEO Friendly URLs", description: "Generate SEO friendly URLs for your site.", category: "SEO", ref: "https://example.com/plugin/seo-friendly-urls", status: "inactive" },
            { prjID: 27, name: "Social Sharing Buttons", description: "Add social sharing buttons to your posts.", category: "Social Media", ref: "https://example.com/plugin/social-sharing-buttons", status: "active" },
            { prjID: 28, name: "Theme Customizer", description: "Customize the look and feel of your site.", category: "Design", ref: "https://example.com/plugin/theme-customizer", status: "inactive" },
            { prjID: 29, name: "User Profile Editor", description: "Let users edit their profiles on your site.", category: "User Management", ref: "https://example.com/plugin/user-profile-editor", status: "active" },
            { prjID: 30, name: "Video Embedder", description: "Easily embed videos into your posts.", category: "Media", ref: "https://example.com/plugin/video-embedder", status: "inactive" },
        ];
    }

    backListClicked() {
        this.changeScenario('list');
    }

    installPluginClicked() {
        this.changeScenario('add');
    }

    createNewPluginClicked() {
        this.changeScenario('help');
    }

    searchInputChanged(event: Event) {
        const searchTerm = (event.target as HTMLInputElement).value;
        this.filterTerm = searchTerm;
        const plugins = this.filterPlugins(this.getUserPluginsByProject(this.project));
        this.userPlugins = plugins;
    }

    activateClicked(plugin: Plugin) {
        console.log("Activate clicked for:", plugin.name);
        this.changeStatus(this.project, plugin.prjID, 'active');
        this.userPlugins = this.getUserPluginsByProject(this.project);
    }

    deactivateClicked(plugin: Plugin) {
        console.info("Deactivate clicked for:", plugin.name);
        this.changeStatus(this.project, plugin.prjID, 'inactive');
        this.userPlugins = this.getUserPluginsByProject(this.project);
    }

    deleteClicked(plugin: Plugin) {
        console.log("Delete clicked for:", plugin.name);
        this.deletePlugin(this.project, plugin.prjID);
        this.userPlugins = this.getUserPluginsByProject(this.project);
        this.avaliablePlugins = this.getAvaliablePlugins(this.project);
    }

    addPluginClicked(plugin: Plugin) {
        this.addPlugin(this.project, plugin.prjID);
        this.lastPluginIdAdd = plugin.prjID;
        this.userPlugins = this.getUserPluginsByProject(this.project);
        this.avaliablePlugins = this.getAvaliablePlugins(this.project);
        this.changeScenario('list');
        setTimeout(() => {
            this.scrollToAddPlugin(plugin.prjID);
        }, 400)
    }

    getAvaliablePlugins(project: number): Plugin[] {
        const pluginsUser = this.getUserPluginsByProject(project);
        const allPlugins = this.getExamplesPlugins();
        const avaliablePlugins = allPlugins.filter(itemA => !pluginsUser.some(itemB => itemB.prjID === itemA.prjID));
        return avaliablePlugins;
    }

    getUserPlugins(): IProjectsUserPlugins {
        const data = localStorage.getItem('collab-user-plugins');
        const plugins: IProjectsUserPlugins = data ? JSON.parse(data) : {};
        return plugins;
    }

    getUserPluginsByProject(project: number): Plugin[] {
        let plugins: IProjectsUserPlugins = this.getUserPlugins();
        if (!plugins[project]) return [];
        const rc = this.mergeAndRemoveMissing(this.getExamplesPlugins(), plugins[project])
        return rc;
    }

    mergeAndRemoveMissing(arr1: Plugin[], arr2: IUserPlugins[]) {
        const filteredArr1 = arr1.filter(obj1 => arr2.some(obj2 => obj2.prjID === obj1.prjID));
        const mergedArray = filteredArr1.map(obj1 => {
            const matchingObject = arr2.find(obj2 => obj2.prjID === obj1.prjID);
            return { ...obj1, ...matchingObject };
        });
        return mergedArray;
    }

    addPlugin(project: number, pluginId: number) {
        const userPlugins: IProjectsUserPlugins = { ... this.getUserPlugins() };
        if (!userPlugins[project]) userPlugins[project] = [];
        const findPlugin = userPlugins[project].find((item: IUserPlugins) => item.prjID === pluginId);
        if (findPlugin) throw new Error('Plugin already installed');
        userPlugins[project].push({ prjID: pluginId, status: 'active' });
        localStorage.setItem('collab-user-plugins', JSON.stringify(userPlugins));
    }

    changeStatus(project: number, pluginId: number, status: PluginStatus) {
        const plugins: IProjectsUserPlugins = this.getUserPlugins();
        if (!plugins[project]) plugins[project] = [];
        const findPlugin = plugins[project].find((item: IUserPlugins) => item.prjID === pluginId);
        if (findPlugin) {
            findPlugin.status = status;
        } else plugins[project].push({ prjID: pluginId, status });
        localStorage.setItem('collab-user-plugins', JSON.stringify(plugins));
    }

    deletePlugin(project: number, pluginId: number) {
        const plugins: IProjectsUserPlugins = this.getUserPlugins();
        if (!plugins[project]) plugins[project] = [];
        const index = plugins[project].findIndex((item: IUserPlugins) => item.prjID === pluginId);
        if (!index) return;
        plugins[project].splice(index, 1);
        localStorage.setItem('collab-user-plugins', JSON.stringify(plugins));
    }

    groupPluginsByCategory(plugins: Plugin[]): { [category: string]: Plugin[] } {
        return plugins.reduce((acc, plugin) => {
            if (!acc[plugin.category]) {
                acc[plugin.category] = [];
            }
            acc[plugin.category].push(plugin);
            return acc;
        }, {} as { [category: string]: Plugin[] });
    }

    filterPlugins(plugins: Plugin[]): Plugin[] {
        if (!this.filterTerm.trim()) return plugins;
        const searchTerm = this.filterTerm.toLowerCase();
        return plugins.filter(plugin =>
            plugin.name.toLowerCase().includes(searchTerm) ||
            plugin.description.toLowerCase().includes(searchTerm) ||
            plugin.ref.toLowerCase().includes(searchTerm)
        );
    }

    changeScenario(scenario: IScenaries) {
        this.currentScenario = scenario
    }

    scrollToAddPlugin(pluginId: number) {
        const el = (this.shadowRoot as any).querySelector(`[plugin-id="${pluginId}"`);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }

    renderHeader() {
        return html` <div>${this.currentScenario === 'list' ?
            html`
                <div class="header">
                    <div>
                        <button @click="${this.installPluginClicked}">${this.msg.installPlugin}</button>
                        <button @click="${this.createNewPluginClicked}">${this.msg.createNewPlugin}</button>
                    </div>
                    <input type="text" placeholder="Search plugin..." @input="${this.searchInputChanged}">
                </div>
            `
            : html`
                    <div class="header">
                        <div>
                            <button @click="${this.backListClicked}">${this.msg.backList}Back List</button>
                        </div>
                    </div>
                `}
                </div>            
        `;
    }

    renderListPlugins() {
        // Agrupar plugins por categoria
        const groupedPlugins = this.groupPluginsByCategory(this.userPlugins);
        const sortedCategories = Object.keys(groupedPlugins).sort();
        return html`
        <h4 style="${sortedCategories.length === 0 ? 'display:block' : 'display:none'}">${this.msg.noPluginsInstalled}</h4>
        <ul class="plugin-list">
            ${sortedCategories.map(category => html`
                <li class="headerCategory">
                    <details open ">
                        <summary>${category}</summary>
                            ${groupedPlugins[category].map(plugin => html`
                                <div
                                plugin-id="${plugin.prjID}"
                                class="${plugin.status === 'active' ? 'plugin active' : 'plugin'}"
                                style="${plugin.prjID === this.lastPluginIdAdd ? 'background:#edffed' : ''}"
                                
                                >
                                    <div class= "plugin-title">
                                        <h3>${plugin.name}</h3>
                                        <div class="plugin-actions">
                                            ${plugin.status === 'active' ?
                html`<a  href="#" @click="${(e: MouseEvent) => { e.preventDefault(); this.deactivateClicked(plugin) }}">${this.msg.desactivate}</a>` :
                html`<a  href="#" @click="${(e: MouseEvent) => { e.preventDefault(); this.activateClicked(plugin) }}">${this.msg.activate}</a>`
            }
                                            <a href="#" @click="${(e: MouseEvent) => { e.preventDefault(); this.deleteClicked(plugin) }}">${this.msg.delete}</a>
                                        </div>
                                    </div>
                                    <div class="plugin-info">    
                                        <p>${plugin.description}</p>
                                        <p><strong>${this.msg.reference}:</strong> ${plugin.ref}</p>
                                    </div>
                                </div>
                            `)}
                    </details>
                </li>        
            `)}
        </ul>
    `;
    }

    renderListAvaliablePlugins() {
        const groupedPlugins = this.groupPluginsByCategory(this.avaliablePlugins);
        const sortedCategories = Object.keys(groupedPlugins).sort();
        return html`
        <h4 style="${sortedCategories.length === 0 ? 'display:block' : 'display:none'}">${this.msg.noPluginsAvaliables}!</h4>
        
        <ul class="plugin-list">
            ${sortedCategories.map(category => html`
                <li class="headerCategory">
                    <details open ">
                        <summary>${category}</summary>
                            ${groupedPlugins[category].map(plugin => html`
                                <div class="plugin">
                                    <div class= "plugin-title">
                                        <h3>${plugin.name}</h3>
                                        <div class="plugin-actions">
                                            <a href="#" @click="${(e: MouseEvent) => { e.preventDefault(); this.addPluginClicked(plugin) }}">${this.msg.install}</a>
                                        </div>
                                    </div>
                                    <div class="plugin-info">    
                                        <p>${plugin.description}</p>
                                        <p><strong>${this.msg.reference}:</strong> ${plugin.ref}</p>
                                    </div>
                                </div>
                            `)}
                    </details>
                </li>        
            `)}
        </ul>
    `;
    }

    private renderHelper() {
        return html`
            <h2>${this.msg.p1}</h2>
            <p>${this.msg.p2}</p>
            <h2>${this.msg.p3}</h2>
            <p>${this.msg.p4}</p>

            <h2>${this.msg.p5}</h2>
            <p>${this.msg.p6}</p>

            <h2>${this.msg.p7}</h2>
            <p>${this.msg.p8}</p>
        `
    }

    renderScenario() {
        switch (this.currentScenario) {
            case 'list':
                return html`
                    ${this.renderHeader()}
                    ${this.renderListPlugins()}
                `
            case 'add':
                return html`
                    ${this.renderHeader()}
                    ${this.renderListAvaliablePlugins()}
                `
            case 'help':
                return html`
                    ${this.renderHeader()}
                    ${this.renderHelper()}
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
}

type IScenaries = 'list' | 'add' | 'help';

interface Plugin {
    prjID: number; // unique
    name: string;
    description: string;
    category: string;
    ref: string;
    status: PluginStatus
}

type PluginStatus = 'active' | 'inactive';

interface IProjectsUserPlugins {
    [key: number]: IUserPlugins[]
}

interface IUserPlugins {
    prjID: number;
    status: PluginStatus
}
