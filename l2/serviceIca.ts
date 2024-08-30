/// <mls shortName="serviceIca" project="100554" enhancement="_100554_enhancementLitService" groupName="service" />

import { html, css, unsafeHTML, repeat } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';
import { initCollabICATree } from './_100554_collabIcaTree';
import { getAllWebComponentsInSource } from './_100554_libCompile';
import { convertTagToFileName } from './_100554_utilsLit';


/// **collab_i18n_start**
const message_pt = {
}

const message_en = {
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-ica-100554')
export class ServiceFca100554 extends ServiceBase {

    private msg: MessageType = messages['en'];

    static styles = css``

    @property() activeTab: ITabType = 'AboutICA';

    @query('#helpDiv') helpDiv: HTMLDivElement | undefined;

    constructor() {
        super();
        initCollabICATree;
        this.setEvents();
    }

    public details: IService = {
        icon: '&#xf2db',
        state: 'background',
        position: 'left',
        tooltip: 'ICA',
        visible: true,
        widget: '_100554_serviceIca',
        level: [4]
    }

    public onClickIcon = (op: string): void => {
        this.activeTab = op as ITabType;
    }

    public menu: IMenu = {
        title: '',
        actions: {
        },
        icons: {
            AboutICA: 'Help;3f',
            Navigation: 'Navigation;f041',
            Properties: 'Properties;f0ce',
            Styles: 'Styles;f5ad',
            Animation: 'Animation;f5ae',
        },
        actionDefault: '', // call after close icon clicked
        iconDefault: 'AboutFCA',
        setMode: undefined, // child will set this
        onClickIcon: this.onClickIcon,
        getLastMode: undefined,
        updateTitle: undefined
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

        if (visible && reinit) {

            //if (this.activeTab !== 'Navigation') return;
            const elTree = this.querySelector('collab-ica-tree-100554');
            if (elTree && (elTree as any).forceUpdate) (elTree as any).forceUpdate();
        }
    }

    //--------------COMPONENT---------------

    createRenderRoot() {
        return this;
    }

    render() {
        return html`
            ${this.renderContent()}
        `;
    }

    renderContent() {
        switch (this.activeTab) {
            case 'Navigation':
                return this.renderNavigation();
            case 'Properties':
                return this.renderProperties();
            case 'Styles':
                return this.renderStyles();
            case 'Animation':
                return this.renderAnimation();
            case 'AboutICA':
                return this.renderAboutICA();
            default:
                return html``;
        }
    }

    renderNavigation() {

        return html`<collab-ica-tree-100554 "scroll-custom" style=" height: calc(100vh - 140px); overflow-y: auto;" .myParent=${this}></collab-ica-tree-100554>`;
    }

    renderProperties() {
        return html`<collab-ica-config-attributes-100554 .myParent=${this} ></collab-ica-config-attributes-100554>`;
    }

    renderStyles() {
        return html`<div></div>`;
    }

    renderAnimation() {
        return html`<div>In development: Animation</div>`;
    }

    renderAboutICA() {
        const { shortName, project } = (mls.actual[2] as any).left;
        const mfile = mls.l2.editor.get({ shortName, project });
        if (!mfile) return html`<div>No file opened</div>`;
        const modelHTML = (mfile as any).modelHTML;
        if (!modelHTML) return html`<div>No html source founded in opened file</div>`;
        const htmlFile = modelHTML.getValue() || '';

        const div = document.createElement('div');
        div.innerHTML = htmlFile;

        this.loadHelpPage('wcdOverlayModeStoryPage', 100554);
        return html`<div id="helpDiv"></div>`

    }

    //------------IMPLEMENTATION------------------

    private async loadHelpPage(shortName: string, project: number) {
        const keyFile = mls.stor.getKeyToFiles(project, 2, shortName, '', '.html');
        const storFile = mls.stor.files[keyFile];
        if (storFile) {
            const content = await storFile.getContent();
            if (this.helpDiv && typeof content === 'string') {
                const allWcs = getAllWebComponentsInSource(content);

                allWcs.forEach((wc) => {
                    const fileName = convertTagToFileName(wc);
                    const script = document.createElement('script');
                    script.type = 'module';
                    script.id = fileName;
                    script.src = (`/${fileName}`);
                    this.helpDiv?.appendChild(script)
                });

                const div = document.createElement('div');
                div.innerHTML = content;
                div.children[0].setAttribute('level', '7');
                this.helpDiv.innerHTML = '';
                this.helpDiv.appendChild(div);
            }

        }
    }

    private setEvents(): void {
        mls.events.addListener(4, 'WCDEvent' as any, (ev) => this.onWCDEvent(ev));
        mls.events.addListener(4, 'WCDEventChange' as any, (ev) => this.onWCDEventChange(ev));
    }

    private onWCDEvent(ev: mls.events.IEvent) {

        if (!ev.desc) return;
        const data: IWCDParams = JSON.parse(ev.desc);
        if (this.menu.setIconActive) {
            this.openMe();
            this.menu.setIconActive(data.op);
        }

    }

    private onWCDEventChange(ev: mls.events.IEvent) {

        if (this.activeTab !== 'Navigation') return;

        const elTree = this.querySelector('collab-ica-tree-100554');
        if (elTree && (elTree as any).forceUpdate) (elTree as any).forceUpdate();

    }



}

export type ITabType = 'Navigation' | 'Properties' | 'Styles' | 'Animation' | 'AboutICA'

export interface IWCDParams {
    level: number,
    position: 'left' | 'right',
    wdcPath: string,
    op: ITabType,
}



