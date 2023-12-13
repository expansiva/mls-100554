/// <mls shortName="servicePlugins" project="100554" enhancement="_100541_enhancementLit" groupName="services" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService } from './_100554_serviceBase';

@customElement('service-plugins-100554')
export class ServicePlugins extends ServiceBase {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    get project(): number { return window['mls'] ? mls.actual[5].project : 0 };

    @property({ type: Array }) userPlugins: Plugin[] = this.getUserPluginsByProject(this.project);

    @property({ type: Array }) avaliablePlugins: Plugin[] = this.getAvaliablePlugins(this.project);

    @property({ type: String }) filterTerm: string = '';

    @property({ type: Number }) lastPluginIdAdd: number | undefined = undefined;

    @property({ type: String }) currentScenario: IScenaries = 'list'

    public details: IService = {
        icon: '&#xf1e6',
        name: 'Plugins',
        mode: 'A',
        position: 'all',
        readOnly: false,
        tooltip: 'Plugins',
        className: undefined,
        tags: [],
        levels: [5]
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
        this.toggleScenario();
    }

    installPluginClicked() {
        this.toggleScenario();
    }

    createNewPluginClicked() {
        console.log("Create New Plugin clicked");
        // Implementar lógica
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
        this.toggleScenario();
        setTimeout(() => {
            this.scrollToAddPlugin(plugin.prjID);
        }, 100)
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

    toggleScenario() {
        this.currentScenario = this.currentScenario === 'list' ? 'add' : 'list';
    }

    scrollToAddPlugin(pluginId: number) {
        const el = this.querySelector(`[pluginId="${pluginId}"`);
        console.info(el)
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }

    renderHeader() {
        return html` <div>${this.currentScenario === 'list' ?
            html`
                <div class="header">
                    <div>
                        <button @click="${this.installPluginClicked}">Install Plugin</button>
                        <button @click="${this.createNewPluginClicked}">Create New Plugin</button>
                    </div>
                    <input type="text" placeholder="Search plugin..." @input="${this.searchInputChanged}">
                </div>
            `
            : html`
                    <div class="header">
                        <div>
                            <button @click="${this.backListClicked}">Back List</button>
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
        <h4 style="${sortedCategories.length === 0 ? 'display:block' : 'display:none'}"> No plugins installed!</h4>
        <ul class="plugin-list">
            ${sortedCategories.map(category => html`
                <li class="headerCategory">
                    <details open ">
                        <summary>${category}</summary>
                            ${groupedPlugins[category].map(plugin => html`
                                <div
                                pluginId="${plugin.prjID}"
                                class="${plugin.status === 'active' ? 'plugin active' : 'plugin'}"
                                style="${plugin.prjID === this.lastPluginIdAdd ? 'background:#edffed' : ''}"
                                
                                >
                                    <div class= "plugin-title">
                                        <h3>${plugin.name}</h3>
                                        <div class="plugin-actions">
                                            ${plugin.status === 'active' ?
                html`<a  href="#" @click="${(e: MouseEvent) => { e.preventDefault(); this.deactivateClicked(plugin) }}">Deactivate</a>` :
                html`<a  href="#" @click="${(e: MouseEvent) => { e.preventDefault(); this.activateClicked(plugin) }}">Activate</a>`
            }
                                            <a href="#" @click="${(e: MouseEvent) => { e.preventDefault(); this.deleteClicked(plugin) }}">Delete</a>
                                        </div>
                                    </div>
                                    <div class="plugin-info">    
                                        <p>${plugin.description}</p>
                                        <p><strong>Reference:</strong> ${plugin.ref}</p>
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
        <h4 style="${sortedCategories.length === 0 ? 'display:block' : 'display:none'}"> No plugins avaliables!</h4>
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
                                            <a href="#" @click="${(e: MouseEvent) => { e.preventDefault(); this.addPluginClicked(plugin) }}">Install</a>
                                        </div>
                                    </div>
                                    <div class="plugin-info">    
                                        <p>${plugin.description}</p>
                                        <p><strong>Reference:</strong> ${plugin.ref}</p>
                                    </div>
                                </div>
                            `)}
                    </details>
                </li>        
            `)}
        </ul>
    `;
    }

    render() {
        this.style.height = '100%';
        return html`
        <div>${this.currentScenario === 'list' ?
                html`
                    ${this.renderHeader()}
                    ${this.renderListPlugins()}
                `
                : html`
                    ${this.renderHeader()}
                    ${this.renderListAvaliablePlugins()}

                `}
        </div>
        
        `
    }
}

type IScenaries = 'list' | 'add';

interface Plugin {
    prjID: number; // unique
    name: string;
    description: string;
    category: string;
    ref: string;
    status: PluginStatus
    selected?: boolean
}

type PluginStatus = 'active' | 'inactive';

interface IProjectsUserPlugins {
    [key: number]: IUserPlugins[]
}

interface IUserPlugins {
    prjID: number;
    status: PluginStatus
}
