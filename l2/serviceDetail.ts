/// <mls shortName="serviceDetail" project="100554" enhancement="_100554_enhancementLitService" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';
import { getAllWebComponentsInSource } from './_100554_libCompile';
import { convertTagToFileName } from './_100554_utilsLit';


@customElement('service-detail-100554')
export class ServiceDetail100554 extends ServiceBase {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @query('#contentPlugin') contentPlugin: HTMLDivElement | undefined;

    constructor() {
        super();
        this.setEvents();
    }


    //-------SERVICE------------
    public details: IService = {
        icon: '&#xf059',
        state: 'background',
        position: 'right',
        tooltip: 'Plugin Detail',
        visible: true,
        widget: '_100554_serviceDetail',
        level: [1,2,3,4,5,6,7]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'Example',
        actions: {
        },
        icons: {},
        actionDefault: '', // call after close icon clicked
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        getLastMode: undefined,
        updateTitle: undefined
    }

    //----------COMPONENT------------------

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }

    @property()
    name: string = 'Somebody';

    render() {
        return html`<div style="overflow:auto;height:100%;" id="contentPlugin"></div>`;
    }

    //----------IMPLEMENTS-------------------

    private setEvents(): void {

        mls.events.addEventListener([2, 3, 4, 5, 6, 7], ['PluginDetails' as any], (ev) => this.onPluginDetails(ev));
    }

    private onPluginDetails(ev: mls.events.IEvent) {

        if (!ev.desc) return;
        this.openMe();
        const data: { shortName: string, project: number } = JSON.parse(ev.desc);
        if (data.shortName) this.openPlugin(data)

    }

    private async openPlugin(info: { shortName: string, project: number }) {

        const keyFile = mls.stor.getKeyToFiles(info.project, 2, info.shortName, '', '.html');
        const storFile = mls.stor.files[keyFile];
        if (!storFile && this.contentPlugin) {
            this.contentPlugin.innerHTML = 'Not found storFile:' + JSON.stringify(info);
            return;
        } else if (!storFile) return;

        const content = await storFile.getContent();
        
        if (this.contentPlugin && typeof content === 'string') {

            this.contentPlugin.innerHTML = '';
            const allWcs = getAllWebComponentsInSource(content);

            this.contentPlugin.innerHTML = content;

            allWcs.forEach((wc) => {
                const fileName = convertTagToFileName(wc);
                const script = document.createElement('script');
                script.type = 'module';
                script.id = fileName;
                script.src = (`/${fileName}`);
                this.contentPlugin?.appendChild(script)
            });

        }

    }

}
