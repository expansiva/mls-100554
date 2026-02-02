/// <mls shortName="serviceMindMap" project="100554" enhancement="_100554_enhancementLit" />

import { html, unsafeHTML, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from '/_100554_/l2/serviceBase.js';
import {  MindMapData, getMindMapByStorFile, setMindMapVariable } from '/_100554_/l2/libMindMap.js'
import '/_100554_/l2/widgetMindMapL4.js'; 

@customElement('service-mind-map-100554')
export class ServiceMindMap100554 extends ServiceBase {

    @property({ type: String }) msize = '';
    @property({ type: String }) dataJson: MindMapData | undefined;
    private actualFile: Record<number, mls.stor.IFileInfo> = {};

    constructor() {
        super();
        this.setEvents();
    }


    //-------SERVICE------------
    public details: IService = {
        icon: '&#xf5dc',
        state: 'background',
        position: 'right',
        tooltip: 'Mind map',
        visible: true,
        widget: '_100554_serviceMindMap',
        level: [1, 2, 3, 4, 5, 6, 7]
    }

    public onClickMain(op: string) {
        if (op === 'opAboutThis') this.showAboutThis();
        else if (this.menu.setMode) this.menu.setMode('initial');
    }

    public menu: IServiceMenu = {
        title: '',
        main: {
            opAboutThis: 'About this content',
        },
        tabs: undefined,
        tools: {},
        onClickMain: this.onClickMain.bind(this),
    }

    private showAboutThis(): boolean {

        const div = document.createElement('div');
        div.style.padding = '1rem';

        let name = 'collab-tiles-100554';

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

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {
        
        if (visible) {
            if (this.actualFile[mls.actualLevel]) {
                setMindMapVariable([]);
                this.configure();
            }

        }

    }

    //---------------EVENTS----------------

    private setEvents() {

        mls.events.addEventListener([2, 4], ['FileAction'], this.onMLSFileAction.bind(this));


    }

    private async onMLSFileAction(ev: mls.events.IEvent): Promise<void> {

        try {

            if (![2, 4].includes(ev.level) || (ev.type !== 'FileAction') || !ev.desc) return;
            const fileAction = JSON.parse(ev.desc) as mls.events.IFileAction;

            const eventsValid = ['open'];

            if (
                fileAction.position === this.position ||
                !eventsValid.includes(fileAction.action)
            ) return;

            const key = mls.stor.getKeyToFiles(fileAction.project, 2, fileAction.shortName, fileAction.folder, '.ts');

            if (!mls.stor.files[key]) return;

            this.actualFile[mls.actualLevel] = mls.stor.files[key];
            this.configure();

            if (ev.level === 4) this.openMe();


        } catch (e) {
            console.info(e);
        }

    }

    //----------COMPONENT------------------

    firstUpdated(_changedProperties: Map<PropertyKey, unknown>) {
        super.firstUpdated(_changedProperties);
    }

    render() {
        return this.renderDefault();

    }

    renderDefault() {
        const currentPage = this.actualFile[mls.actualLevel] ? this.actualFile[mls.actualLevel].shortName : "unknown" ;
        if (!this.dataJson) return html`No valid defs found in this ${currentPage}`;
        
        return html`<widget-mind-map-l4-100554 .mapState=${this.dataJson} currentpage="${currentPage}"></widget-mind-map-l4-100554>`
    }


    //----------IMPLEMENTS-------------------

    private async configure() {
        
        this.dataJson = this.actualFile ? await getMindMapByStorFile(this.actualFile[mls.actualLevel]) : undefined;
    }

}