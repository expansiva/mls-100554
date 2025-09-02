/// <mls shortName="serviceOrganism" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, unsafeHTML, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from './_100554_serviceBase';
import { loadPluginProject, forceServiceInstance } from './_100554_libCommom';
import { convertFileNameToTag } from './_100554_utilsLit';
import { readProjectTypescriptAndCompile } from './_100554_collabLibModel';
import "./_100554_wcdToolboxItemActionEditAttrOut";
import "./_100554_pluginExploreList";
import "./_100554_pluginPrototypeImprove";

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

    public onClickTabs(index: number) {
        this.activeTab = ESceneries[index] as ITabType;
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
            options: [
                { text: 'Explore', icon: 'e521' },
                { text: 'Navigation', icon: 'f041' },
                { text: 'Style', icon: 'f53f' },
                { text: 'Improve', icon: 'f5dc' },
            ]
        },
        tools: {},
        onClickMain: this.onClickMain.bind(this),
        onClickTabs: this.onClickTabs.bind(this),
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

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

        switch (this.activeTab) {
            case 'icExplorer':
                return this.renderExplorer();
            case 'icNavigation':
                return this.renderNavigation();
            case 'icStyle':
                return this.renderStyle();
            case 'icImprove':
                return this.renderImprove();
            default:
                return html``;
        }
    }

    renderExplorer() {
        return html`<plugin-explore-list-100554 .service=${this} autoprepare="true"></plugin-explore-list-100554>`;
    }

    renderNavigation() {
        return html`<plugin-navigation-render-organism-100554 .service=${this} autoprepare="true"></plugin-navigation-render-organism-100554`;
    }

    renderStyle() {

        return html`<plugin-edit-style-l3-100554 .service=${this} msize="${this.msize}"></plugin-edit-style-l3-100554>`;
    }

    renderImprove() {
        return html`<plugin-prototype-improve-100554 scope="organism" ></plugin-prototype-improve-100554>`;
    }

    //---------IMPLEMENTATION------------

    private async loadPlugins() {

        const project = mls.actualProject;
        if (!project) return;

        const plgNav = await loadPluginProject(project, 'l3PageNavigation');
        const plgStyle = await loadPluginProject(project, 'l3PageStyle');
        const plgNavName = plgNav[0] ? plgNav[0].widget : '';
        const plgStlpName = plgStyle[0] ? plgStyle[0].widget : '';

        if (plgNavName) {
            const { folder, project, shortName } = mls.l2.getPath(plgNavName);
            await import(`./_${project}_${shortName}`);
            this.pluginNav = convertFileNameToTag({ project, shortName, folder });
        }

        if (plgStlpName) {
            const { folder, project, shortName } = mls.l2.getPath(plgStlpName);
            await import(`./_${project}_${shortName}`);
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

export type ITabType = 'icExplorer' | 'icNavigation' | 'icStyle' | 'icImprove';

enum ESceneries {
    'icExplorer' = 0,
    'icNavigation' = 1,
    'icStyle' = 2,
    'icImprove' = 3,

} 