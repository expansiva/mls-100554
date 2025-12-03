/// <mls shortName="serviceProject" project="100554" enhancement="_100554_enhancementLitService" groupName="other" />

import { html, css, repeat } from 'lit';
import { customElement, property, query, queryAll } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu, IOptions } from '/_100554_/l2/serviceBase.js';
import { collab_user } from '/_100554_/l2/collabIcons.js';
import { getAllWebComponentsInSource } from '/_100554_/l2/libCompile.js';
import { convertTagToFileName, convertFileNameToTag } from '/_100554_/l2/utilsLit.js';
import { loadPluginProject } from '/_100554_/l2/libCommom.js';
import('./_100554_collabPanel');

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

    private baseProject = 100554;

    private msg: MessageType = messages['en'];

    @property() activeTab: IScenery = 'Explore';

    @property({ type: Array }) explories: mls.plugin.MenuAction[] = [];

    @query('#projectDiv') projectDiv: HTMLDivElement | undefined;

    @query('details') firstDetails: HTMLDetailsExplore | undefined;

    @queryAll('.plugin-container') allContainers: HTMLDivElement[] | undefined;

    private myData: { [key: string]: mls.plugin.MenuAction[] } = {};

    //--------SERVICE---------

    private lastActiveTabByLevel: Record<number, number> = {
        5: ETabsL5.ShowCase,
        4: ETabs.Explore,
        3: ETabs.Explore,
        2: ETabs.Explore,
        1: ETabs.Explore,
    }

    public details: IService = {
        icon: '&#xf542',
        state: 'foreground',
        position: 'left',
        tooltip: 'Project',
        visible: true,
        widget: '_100554_serviceProject',
        level: [5]
    }

    public onClickMain(op: string) {
        if (op === 'opAboutThis') this.showAboutThis();
        else if (this.menu.setMode) this.menu.setMode('initial');

    }

    public onClickTabs(index: number): void {

        if (mls.actualLevel === 5) {
            this.activeTab = ETabsL5[index] as IScenery;
        } else {
            this.activeTab = ETabs[index] as IScenery;
        }
    }

    private getMenuTabsByLevel(): IOptions[] {
        if (!this.level) return [];
        if (!this.position) {
            return [
                { text: 'Explore', icon: 'e521' }
            ]
        }

        if (this.level === 5) {
            return [
                { text: 'ShowCase', icon: 'f5da' },
                { text: 'Admin', icon: 'f508' },
                { text: 'Plugins', icon: 'f1e6' },
            ]
        }
        if (this.level === 2 && this.position === 'right') {
            return [
                { text: 'Explore', icon: 'e521' }
            ]
        }
        return [
            { text: 'Explore', icon: 'e521' },
            { text: 'ShowCase', icon: 'f5da' }
        ]
    }

    public menu: IServiceMenu = {
        title: '',
        main: {
            opAboutThis: 'About this content',
        },
        tabs: {
            group: 'Mode',
            type: 'onlyicon',
            selected: 0,
            options: this.getMenuTabsByLevel()
        },
        tools: {},
        onClickMain: this.onClickMain.bind(this),
        onClickTabs: this.onClickTabs.bind(this),
    }

    private lastLevel: number = 0;

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

        if (visible && this.level !== this.lastLevel) {
            this.lastLevel = this.level;
            this.updateIconsByLevel();
        }

        if (visible) {
            this.refreshPlugins();
            this.requestUpdate();
        }
    }

    private showAboutThis(): boolean {

        const div = document.createElement('div');
        div.style.padding = '1rem';

        let name = 'nothing selected';

        switch (this.activeTab) {
            case 'Explore':
                name = 'service-project-100554';
                break;
            case 'ShowCase':
                name = 'project.html';
                break;
            case 'Admin':
                name = 'collab-panel-100554';
                break;
            case 'Plugins':
                name = 'service-project-100554';
                break;
            default:
                name = `nothing selected`;
        }

        div.innerHTML = `
        
            <h3>About this content</h3>
            <ul>
                <li>Reference: ${name}</li>
                <li>Level: ${this.level}</li>
                <li>Position: ${this.position}</li>
            </ul>
		

        `;

        if (this.menu.setMode) this.menu.setMode('page', div);
        return true;

    }

    //----------COMPONENT-----------
    async firstUpdated() {
        this.setMyData();
        await this.getExploreData();
        if (this.activeTab === 'Explore') {
            await this.updateComplete;
            if (this.firstDetails) this.firstDetails.click();
        }
    }

    async updated(changedProperties: Map<string | number | symbol, unknown>) {

        super.updated(changedProperties);
        if (changedProperties.has('activeTab') && !!changedProperties.get('activeTab')) {

            if (this.menu.setTabActive && mls.actualLevel === 5) this.menu.setTabActive(ETabsL5[this.activeTab]);
            else if (this.menu.setTabActive) this.menu.setTabActive(ETabs[this.activeTab]);
            if (this.activeTab === 'Explore') {
                await this.updateComplete;
                if (this.firstDetails) this.firstDetails.click();
            }

        }
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return html`
            ${this.renderContent()}
        `;
    }

    private renderContent() {

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

        return html`<div>
                ${this.explories.map((explorie, index) => {
            return html`
                        <details ?open=${index === 0} .data=${explorie} @click=${this.handleDetailExplorieClick}>
                            <summary>${explorie.category}</summary>
                            <div class="plugin-container"></div>
                        </details>
                    `
        })
            }</div>`;
    }

    private renderShowCase() {
        this.fireEventClose('<modules-100554></modules-100554>');

        const project = mls.actualProject;
        if (!project) return '<div>No project selected</div<';
        const keyToFile = mls.stor.getKeyToFiles(project, 2, 'project', '', '.html');
        const file = mls.stor.files[keyToFile]
        if (!file) return html`<div>File 'project.html' dont's exist in selected project</div>`;
        this.loadHelpPage('project' || '', project || 0);
        return html`<div style="overflow:auto;height:100%;" id="projectDiv"></div>`
    }

    private renderAdmin() {

        this.fireEventClose('Select a plugin');

        const keys = Object.keys(this.myData);
        return html`
        <div>
            ${repeat(keys, (
            (key: string, idx: number) => key + idx) as any,
            ((item: string, index: any) => {

                return this.renderPanel(item, index);

            }) as any
        )}
        </div>
        `

    }

    private renderPlugin() {
        this.fireEventClose('In development: Details plugins');

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

    private renderPanel(key: string, index: number) {
        return html`
            <collab-panel-100554 .myData=${this.myData[key]}></collab-panel-100554>
        `
    }

    //-------IMPLEMENTATION-----------

    private refreshPlugins() {
        this.allContainers?.forEach((item) => {
            const plg = item.children[0];
            if (plg) {
                plg.setAttribute('mode', 'list');
            }
        });
    }

    private updateIconsByLevel() {
        if (!this.menu || !this.menu.refresh || !this.menu.tabs || !this.menu.setTabActive) return;
        const menu = this.getMenuTabsByLevel();
        this.menu.tabs.options = menu;
        this.menu.refresh();
        if (this.menu.setTabActive) {
            this.menu.setTabActive(this.lastActiveTabByLevel[this.level]);
        }
    }

    private fireEventClose(msg: string) {
        mls.events.fire(
            5,
            'PluginDetails' as any,
            JSON.stringify(
                {
                    htmlText: `<div>${msg}</div>`

                }
            ),
            0
        );
    }

    private async handleDetailExplorieClick(e: MouseEvent) {
        const target = e.target as HTMLElement;
        const details = target.closest('details') as HTMLDetailsExplore;
        if (!details) return;
        const div = details.querySelector('div');
        if (!div || div.childElementCount > 0) return;
        const { folder, project, shortName } = mls.l2.getPath(details.data.widget);
        await import(`./_${project}_${shortName}`);
        const pluginTag = convertFileNameToTag({ project, shortName, folder });
        const pluginEl = document.createElement(pluginTag);
        pluginEl.setAttribute('autoprepare', '');
        pluginEl.setAttribute('level', this.level.toString());
        pluginEl.setAttribute('position', this.position.toString());
        (pluginEl as any).service = this;
        div.appendChild(pluginEl);
    }

    private async getExploreData() {
        let project = mls.actualProject;
        this.explories = await loadPluginProject(project || 0, 'l5Explore');

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
                    const info = convertTagToFileName(wc);
                    if (info) {
                        const script = document.createElement('script');
                        script.type = 'module';
                        script.id = `_${info.project}_${info.shortName}`;
                        script.src = (`/_${info.project}_${info.shortName}`);
                        this.projectDiv?.appendChild(script)
                    }
                });

                const div = document.createElement('div');
                div.innerHTML = content;
                div.children[0].setAttribute('level', '7');
                this.projectDiv.innerHTML = '';
                this.projectDiv.appendChild(div);
            }

        }
    }

    private async setMyData() {

        const prj = mls.actualProject;

        let array = await loadPluginProject(prj || 0, 'l5Project', false);
        array.forEach((item: mls.plugin.MenuAction) => {
            const cat = item.category as string;
            if (!this.myData[cat]) this.myData[cat] = [item]
            else this.myData[cat].push(item);
        });

        this.requestUpdate();

    }
}

enum ETabs {
    'Explore' = 0,
    'ShowCase' = 1,
    'Admin' = 2,
    'Plugins' = 3,

}

enum ETabsL5 {
    'ShowCase' = 0,
    'Admin' = 1,
    'Plugins' = 2,
    'Explore' = 3,

}

type IScenery = 'Explore' | 'ShowCase' | 'Admin' | 'Plugins'

interface Plugin {
    prjID: number; // unique
    name: string;
    description: string;
    category: string;
    status: PluginStatus
}

interface HTMLDetailsExplore extends HTMLDetailsElement {
    data: mls.plugin.MenuAction
}

type PluginStatus = 'active' | 'inactive';
