/// <mls shortName="servicePlugins" project="100554" enhancement="_100541_enhancementLit" groupName="services" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService } from './_100554_serviceBase';

@customElement('service-plugins-100554')
export class ServicePlugins extends ServiceBase {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property({ type: Array }) plugins: Plugin[] = this.getExamplesPlugins();

    @property({ type: String }) filterTerm: string = '';

    // eslint-disable-next-line
    public details: IService = {
        icon: '&#xf1e6',
        name: 'Plugins',
        mode: 'A',
        position: 'all',
        readOnly: false,
        tooltip: 'Plugins',
        className: '',
        tags: [],
        levels: [5]
    }

    /*createRenderRoot() {
        return this;
    }*/

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

    // Handlers para eventos de clique (Implementações fictícias)
    installPluginClicked() {
        console.log("Install Plugin clicked");
        // Implementar lógica
    }

    createNewPluginClicked() {
        console.log("Create New Plugin clicked");
        // Implementar lógica
    }

    searchInputChanged(event: Event) {
        const searchTerm = (event.target as HTMLInputElement).value;
        console.log("Search Term:", searchTerm);
        this.filterTerm = searchTerm;
        const plugins = this.filterPlugins(this.getExamplesPlugins());
        console.info(plugins)
        this.plugins = plugins;
    }

    // Handlers para eventos de clique (Implementações fictícias)
    activateClicked(plugin: Plugin) {
        console.log("Activate clicked for:", plugin.name);
        // Implementar lógica de ativação
    }

    deactivateClicked(plugin: Plugin) {
        console.info("Deactivate clicked for:", plugin.name);
        // Implementar lógica de desativação
    }

    deleteClicked(plugin: Plugin) {
        console.log("Delete clicked for:", plugin.name);
        // Implementar lógica de remoção
    }

    optionsClicked(plugin: Plugin) {
        console.log("Options clicked for:", plugin.name);
        // Implementar lógica para opções
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

        if (!this.filterTerm.trim()) {
            return plugins;
        }
        const searchTerm = this.filterTerm.toLowerCase();
        console.info({ searchTerm })
        return plugins.filter(plugin =>
            plugin.name.toLowerCase().includes(searchTerm) ||
            plugin.description.toLowerCase().includes(searchTerm) ||
            plugin.ref.toLowerCase().includes(searchTerm)
        );
    }

    // Método para renderizar o cabeçalho
    renderHeader() {
        return html`
            <div class="header">
                <div>
                    <button @click="${this.installPluginClicked}">Install Plugin</button>
                    <button @click="${this.createNewPluginClicked}">Create New Plugin</button>
                </div>
                <input type="text" placeholder="Search plugin..." @input="${this.searchInputChanged}">
            </div>
        `;
    }

    renderListPlugins() {
        // Agrupar plugins por categoria
        const groupedPlugins = this.groupPluginsByCategory(this.plugins);
        console.info(this.plugins);
        return html`
        <ul class="plugin-list">
            ${Object.keys(groupedPlugins).sort().map(category => html`
                <li class="headerCategory">
                    <details open ">
                        <summary>${category}</summary>
                                ${groupedPlugins[category].map(plugin => html`
                    <div class="plugin">

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

    render() {
        this.style.height = '100%';
        return html`
        ${this.renderHeader()}
        ${this.renderListPlugins()}
        `
    }


}

interface Plugin {
    prjID: number; // unique
    name: string;
    description: string;
    category: string;
    ref: string;
    status: 'active' | 'inactive';
}
