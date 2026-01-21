/// <mls shortName="serviceOrganism" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, unsafeHTML, repeat } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from '/_100554_/l2/serviceBase.js';
import { loadPluginProject, forceServiceInstance } from '/_100554_/l2/libCommom.js';
import { convertFileNameToTag } from '/_102027_/l2/utils.js';
import { readProjectTypescriptAndCompile } from '/_100554_/l2/collabLibModel.js';

import { PluginEditStyleL3 } from '/_100554_/l2/pluginEditStyleL3.js';

import "/_100554_/l2/pluginExploreList.js";
import "/_100554_/l2/pluginPrototypeImprove.js";
import '/_100554_/l2/pluginOrganismAdd.js';
import '/_100554_/l2/pluginOrganismProperty.js';

/// **collab_i18n_start**
const message_pt = {
    detailsHint: 'Detalhes do objeto selecionado na página, - help , - ajustes widget como mutations (ica), - ajustes dinâmicos (wcd) , por favor selecione um item na página',
    selectPlugin: 'Por favor selecione um plugin IA',
    loading: 'Carregando...',
    notFoundPlugin: 'Plugin não encontrado!'

}

const message_en = {
    detailsHint: 'Details of the selected object on the page, - help , - widget settings like mutations (ica), - dynamic settings (wcd), please select an item on the page',
    selectPlugin: 'Please select a plugin IA',
    loading: 'Loading...',
    notFoundPlugin: 'Plugin not found!'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-organism-100554')
export class ServiceOrganism100554 extends ServiceBase {

    private msg: MessageType = messages['en'];
    @property({ type: String }) msize = '';

    @property() activeTab: ITabType = 'icExplorer';
    @property() pluginNav: string = '';
    @property() pluginStyle: string = '';

    constructor() {
        super();
        this.init();
    }

    private async init() {
        this.setEvents();
        this.fireEventLoadProject();
        forceServiceInstance(2, '_100554_serviceSource');
    }

    private setEvents(): void {
        mls.events.addListener(3, 'WCDEvent' as any, (ev) => this.onWCDEvent(ev));
        mls.events.addEventListener([3], ['FileAction'], this.onMLSFileAction.bind(this));
    }

    private fireEventThisProject = 0;
    private fireEventLoadProject(): void {

        if (this.fireEventThisProject === mls.actualProject) return;
        this.fireEventThisProject = mls.actualProject as number;
        readProjectTypescriptAndCompile(mls.actualProject as number, '', true);
    }

    //-------SERVICE---------------

    public details: IService = {
        icon: '&#xf0c1',
        state: 'background',
        position: 'right',
        tooltip: 'Organism',
        visible: true,
        widget: '_100554_serviceOrganism',
        level: [5]
    }


    public onClickMain(op: string) {
        if (op === 'opAboutThis') this.showAboutThis();
        else if (this.menu.setMode) this.menu.setMode('initial');

    }

    public onClickTabsNavigation(index: number, oldEl: HTMLElement, newEl: HTMLElement) {
        this.activeTab = ESceneries[index] as ITabType;
        if (this.activeTab === 'icStyle') {
            const el = this.querySelector('plugin-edit-style-l3-100554') as PluginEditStyleL3;
            if (el && el.forceUpdate) el.forceUpdate();

        }
    }

    public onClickTabs(index: number) {

        if (this.menu && this.menu.tabNavigate && this.menu.tabs?.selected !== undefined) {
            this.activeTab = ESceneries[index] as ITabType;
            const previousIndex = this.menu.tabs.previous !== undefined ? this.menu.tabs.previous : this.menu.tabs.selected;
            const oldTab = this.querySelector(`.tab-index-${previousIndex}`) as HTMLElement;
            const newTab = this.querySelector(`.tab-index-${index}`) as HTMLElement;
            this.menu.tabNavigate(index, oldTab, newTab);
        }
    }

    public menu: IServiceMenu = {
        title: '',
        main: {
            opAboutThis: 'About this content',
        },
        tabs: {
            group: 'Mode',
            type: 'onlyicon',
            selected: -1,
            mode: 'compact',
            effect: 'slide',
            options: [
                { text: 'Explore', icon: 'e521' },
                { text: 'Navigation', icon: 'f041' },
                { text: 'Style', icon: 'f53f' },
                { text: 'Improve', icon: 'f5dc' },
                { text: 'Add', icon: '2b' },
                { text: 'Property', icon: '2b' },
            ]
        },
        tools: {},
        onClickMain: this.onClickMain.bind(this),
        onClickTabs: this.onClickTabs.bind(this),
        onClickTabsNavigation: this.onClickTabsNavigation.bind(this),

    }

    async onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

        if (!visible) return;
        const tab = this.getAttribute('tab');
        await this.updateComplete;
        if (tab &&
            tab === 'navigation' &&
            this.activeTab !== 'icNavigation' &&
            this.menu &&
            this.menu.setTabActive &&
            this.menu.onClickTabs &&
            this.menu.tabBack
        ) {
            this.removeAttribute('tab');
            if (ESceneries[this.activeTab] > ESceneries.icNavigation) {
                this.menu.tabBack();
            } else this.menu.setTabActive(ESceneries.icNavigation);
        }

    }

    private showAboutThis(): boolean {

        const div = document.createElement('div');
        div.style.padding = '1rem';
        let name = 'nothing selected';
        switch (this.activeTab) {
            case 'icExplorer':
                name = 'plugin-explore-list-100554';
                break;
            case 'icNavigation':
                name = 'plugin-navigation-render-organism-100554';
                break;
            case 'icStyle':
                name = 'plugin-edit-style-l3-100554';
                break;
            case 'icImprove':
                name = 'plugin-prototype-improve-100554';
                break;
            case 'icAdd':
                name = 'plugin-organism-add-100554';
                break;
            case 'icProperty':
                name = 'plugin-organism-property-100554';
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

    //-------COMPONENT--------------

    createRenderRoot() {
        return this;
    }


    async firstUpdated() {
        if (this.menu.setTabActive) this.menu.setTabActive(ESceneries[this.activeTab]);
        await this.loadPlugins();
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
            ${this.renderContent()}
        `;
    }

    renderContent() {

        return html`
            <div>
                <div class="tab-content tab-index-${ESceneries.icExplorer}" style="display:none;">
                    ${this.renderExplorer()}
                </div>
                <div class="tab-content tab-index-${ESceneries.icNavigation}" style="display:none;">
                    ${this.renderNavigation()}
                </div>
                <div class="tab-content tab-index-${ESceneries.icStyle}" style="display:none;">
                    ${this.renderStyle()}
                </div>
                <div class="tab-content tab-index-${ESceneries.icImprove}" style="display:none;">
                    ${this.renderImprove()}
                </div>
                <div class="tab-content tab-index-${ESceneries.icAdd}" style="display:none;">
                    ${this.renderAddOrganism()}
                </div>
                <div class="tab-content tab-index-${ESceneries.icProperty}" style="display:none;">
                    ${this.renderPropertyOrganism()}
                </div>
            </div>
    `;
    }


    private renderExplorer() {
        return html`<plugin-explore-list-100554 .service=${this} autoprepare="true"></plugin-explore-list-100554>`;
    }

    private renderNavigation() {
        return html`<plugin-navigation-render-organism-100554
            @on-add-click=${this.onNavigationOrganismAddClick.bind(this)}
            @on-property-click=${this.onNavigationOrganismPropertyClick.bind(this)}
            @on-style-click=${this.onNavigationOrganismStyleClick.bind(this)}
            .service=${this} 
            autoprepare="true"
         ></plugin-navigation-render-organism-100554`;
    }

    private renderStyle() {
        return html`<plugin-edit-style-l3-100554 .service=${this} msize="${this.msize}"></plugin-edit-style-l3-100554>`;
    }

    private renderImprove() {
        return html`<plugin-prototype-improve-100554 scope="organism" ></plugin-prototype-improve-100554>`;
    }

    private renderAddOrganism() {
        return html`<plugin-organism-add-100554 @improve-completed=${this.onImproveCompleted.bind(this)} .service=${this}></plugin-organism-add-100554>`;
    }

    private renderPropertyOrganism() {
        return html`<plugin-organism-property-100554 .service=${this}></plugin-organism-property-100554>`;
    }

    //---------IMPLEMENTATION------------

    private onImproveCompleted() {

    }

    private onNavigationOrganismAddClick() {
        if (this.menu && this.menu.setTabActive) this.menu.setTabActive(ESceneries.icAdd);
    }

    private onNavigationOrganismPropertyClick() {
        if (this.menu && this.menu.setTabActive) this.menu.setTabActive(ESceneries.icProperty);
    }

    private onNavigationOrganismStyleClick() {
        if (this.menu && this.menu.setTabActive) this.menu.setTabActive(ESceneries.icStyle);
    }

    private async loadPlugins() {

        const project = mls.actualProject;
        if (!project) return;

        const plgNav = await loadPluginProject(project, 'l3PageNavigation');
        const plgStyle = await loadPluginProject(project, 'l3PageStyle');
        const plgNavName = plgNav[0] ? plgNav[0].widget : '';
        const plgStlpName = plgStyle[0] ? plgStyle[0].widget : '';

        if (plgNavName) {
            const { folder, project, shortName } = mls.l2.getPath(plgNavName);
            await import(`/_${project}_/l2/${shortName}`);
            this.pluginNav = convertFileNameToTag({ project, shortName, folder });
        }

        if (plgStlpName) {
            const { folder, project, shortName } = mls.l2.getPath(plgStlpName);
            await import(`/_${project}_/l2/${shortName}`);
            this.pluginStyle = convertFileNameToTag({ project, shortName, folder });
        }
    }

    private onWCDEvent(ev: mls.events.IEvent) {

        if (!ev.desc) return;
        const data: IWCDParams = JSON.parse(ev.desc);
        if (this.menu.setTabActive) {
            this.openMe();
            this.menu.setTabActive(ESceneries[data.op]);
        }

    }

    private async onMLSFileAction(ev: mls.events.IEvent): Promise<void> {

        try {

            if (![3].includes(ev.level) || (ev.type !== 'FileAction') || !ev.desc) return;

            const fileAction = JSON.parse(ev.desc) as mls.events.IFileAction;

            const eventsValid = ['open'];

            if (
                fileAction.position === 'right' ||
                !eventsValid.includes(fileAction.action)
            ) return;


            if (!this.visible || this.visible === 'false') {
                this.openMe();
            }

            if (this.menu.setTabActive) this.menu.setTabActive(1);

            setTimeout(() => this.requestUpdate(), 500);

        } catch (e) {
            console.info(e);
        }

    }


}

export interface IWCDParams {
    level: number,
    position: 'left' | 'right',
    wdcPath: string,
    op: ITabType,
}

export type ITabType = 'icExplorer' | 'icNavigation' | 'icStyle' | 'icImprove' | 'icAdd' | 'icProperty';

enum ESceneries {
    'icExplorer' = 0,
    'icNavigation' = 1,
    'icStyle' = 2,
    'icImprove' = 3,
    'icAdd' = 4,
    'icProperty' = 5,



} 