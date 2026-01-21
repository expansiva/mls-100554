/// <mls shortName="serviceUnit" project="100554" enhancement="_100554_enhancementLitService" />

import { html } from 'lit';
import { customElement, property, query, queryAll } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu, IOptions } from '/_100554_/l2/serviceBase.js';
import { getAllWebComponentsInSource } from '/_100554_/l2/libCompile.js';
import { convertTagToFileName, convertFileNameToTag } from '/_102027_/l2/utils.js';
import { loadPluginProject } from '/_100554_/l2/libCommom.js';
import('/_100554_/l2/collabPanel.js');

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

@customElement('service-unit-100554')
export class ServiceUnit extends ServiceBase {

    private baseProject = 100554;

    private msg: MessageType = messages['en'];

    @property() activeTab: IScenery = 'Explore';

    @property({ type: Array }) explories: mls.plugin.MenuAction[] = [];

    @query('#projectDiv') projectDiv: HTMLDivElement | undefined;

    @query('details') firstDetails: HTMLDetailsExplore | undefined;

    @queryAll('.plugin-container') allContainers: HTMLDivElement[] | undefined;

    private lastActiveTabByLevel: Record<number, number> = {
        5: ETabs.Explore,
        4: ETabs.Explore,
        3: ETabs.Explore,
        2: ETabs.Explore,
        1: ETabs.Explore,
    }

    private myData: { [key: string]: mls.plugin.MenuAction[] } = {};

    //---------SERVICE-------------

    public details: IService = {
        icon: '&#xf5da',
        state: 'foreground',
        position: 'left',
        tooltip: 'Unit',
        visible: true,
        widget: '_100554_serviceUnit',
        level: [5]
    }

    public onClickMain(op: string) {
        if (op === 'opAboutThis') this.showAboutThis();
        else if (this.menu.setMode) this.menu.setMode('initial');

    }

    public onClickTabs(index: number): void {
        this.activeTab = ETabs[index] as IScenery;
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
            options: [{ text: 'Explore', icon: 'e521' }]
        },
        tools: {},
        onClickMain: this.onClickMain.bind(this),
        onClickTabs: this.onClickTabs.bind(this),
    }

    private lastLevel: number = 0;

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

        if (this.visible && this.level !== this.lastLevel) {
            this.lastLevel = this.level;
        }

        if (this.visible) {
            this.refreshPlugins();
        }
    }

    private showAboutThis(): boolean {

        const div = document.createElement('div');
        div.style.padding = '1rem';

        let name = 'nothing selected';

        switch (this.activeTab) {
            case 'Explore':
                name = 'plugin-explore-list-100554';
                break;
            default:
                name = 'nothing selected';
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

    //-------COMPONENT-----------

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

            if (this.menu.setTabActive) this.menu.setTabActive(ETabs[this.activeTab]);
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
        this.fireEventClose('In development: Details showcase');

        const project = mls.actualProject;
        if (!project) return '<div>No project selected</div<';
        const keyToFile = mls.stor.getKeyToFiles(project, 2, 'project', '', '.html');
        const file = mls.stor.files[keyToFile]
        if (!file) return html`<div>File 'project.html' dont's exist in selected project</div>`;
        this.loadHelpPage('project' || '', project || 0);
        return html`<div style="overflow:auto;height:100%;" id="projectDiv"></div>`
    }


    //----------IMPLEMENTATION----------

    private refreshPlugins() {
        this.allContainers?.forEach((item) => {
            const plg = item.children[0];
            if (plg) {
                plg.setAttribute('mode', 'list');
            }
        });
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
        await import(`/_${project}_/l2/${shortName}`);
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

    private async loadHelpPage(shortName: string, project: number) {
        const keyFile = mls.stor.getKeyToFiles(project, 2, shortName, '', '.html');
        const storFile = mls.stor.files[keyFile];
        if (storFile) {
            const content = await storFile.getContent();
            if (this.projectDiv && typeof content === 'string') {
                const allWcs = getAllWebComponentsInSource(content);
                console.info(allWcs);

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

}
type IScenery = 'Explore' | 'ShowCase'

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
