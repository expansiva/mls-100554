/// <mls shortName="servicePreviewL1" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html, css, unsafeHTML } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { getDependenciesByHtmlFile, IJSONDependence } from '/_100554_/l2/libCompile.js';
import { IService, IServiceMenu, IToolbarContent, ServiceBase } from '/_100554_/l2/serviceBase.js';
import "/_100554_/l2/servicePreviewL1ListServer.js";

import { openService, getProjectConfig } from '/_100554_/l2/libCommom.js';
import { convertFileNameToTag } from '/_100554_/l2/utilsLit.js';

/// **collab_i18n_start**
const message_pt = {
    noFindModule: 'Nenhum modulo configurado.',
}

const message_en = {
    noFindModule: 'No modules configured',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-preview-l1-100554')
export class ServicePreviewL1100554 extends ServiceBase {

    private msg: MessageType = messages['en'];

    //--------PROPERTS------------ 

    private get liveServerView(): any | null {
        if (!this.liveViewTag) return null;
        return this.querySelector(this.liveViewTag) as any | null;
    }

    @state() private liveViewTag?: string;

    @query('#preview-container-l1') elContent: HTMLElement | undefined;

    //@property() msize: string = '';
    @property() error: string = '';
    @property() watch: boolean = true;
    @property() startServer: boolean = false;

    //--------VARIABLES-----------

    private timeEvent: number = -1;
    private actualFile: mls.stor.IFileInfo | undefined;
    private actualFileKey: string | undefined;
    private actualTheme = 'Default';
    private startInstance: any;


    //---------SERVICE------------
    public details: IService = {
        icon: '&#xf06e',
        state: 'background',
        position: 'right',
        tooltip: 'Preview L1',
        visible: true,
        widget: '_100554_servicePreviewL1',
        level: [1]
    }

    public menu: IServiceMenu = {
        title: 'Preview L1',
        main: {},
        tabs: undefined,
        tools: {},
        onClickMain: () => { },
        onClickTabs: () => { },
        onClickTools: this.onClickTools.bind(this),
    }

    public onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null): void {

    }

    public onClickTools(op: string) {

    
    }


    //--------COMPONENT----------

    async connectedCallback() {
        super.connectedCallback();
        const moduleConfig = await getProjectConfig(mls.actualProject as number);
        if (!moduleConfig || !moduleConfig.masterBackEnd) return;
        const info = mls.l2.getPath(moduleConfig.masterBackEnd.serverView)
        await import(`/${moduleConfig.masterBackEnd.serverView}`);
        this.startInstance = await import(`/${moduleConfig.masterBackEnd.start}`);
        await this.startInstance.start(mls.actualProject, 'none');
        this.liveViewTag = convertFileNameToTag(info);

    }

    updated(changedProperties: Map<string | number | symbol, unknown>): void {
        super.updated(changedProperties);
    }

    render() {

        this.style.display = 'block';
        if (!this.liveViewTag) return html`<h3>${this.msg.noFindModule}<h3>`;
        const htmlString = `<${this.liveViewTag}></${this.liveViewTag}>`;
        return html`${unsafeHTML(htmlString)}`;

    }

    //--------IMPLEMENTS---------

    
}

