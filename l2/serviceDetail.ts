/// <mls shortName="serviceDetail" project="100554" enhancement="_100554_enhancementLitService" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';
import { getAllWebComponentsInSource } from './_100554_libCompile';
import { convertTagToFileName } from './_100554_utilsLit';


@customElement('service-detail-100554')
export class ServiceDetail100554 extends ServiceBase {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property({ type: String }) msize = '';

    @query('#contentPlugin') contentPlugin: HTMLDivElement | undefined;

    private plugin: { shortName: string, project: number } = {} as any;

    constructor() {
        super();
        this.setEvents();
    }


    //-------SERVICE------------
    public details: IService = {
        icon: '&#xf059',
        state: 'background',
        position: 'right',
        tooltip: 'Detail',
        visible: true,
        widget: '_100554_serviceDetail',
        level: [1,2,3,4,5,6,7]
    }

    public onClickLink = (op: string): boolean => {
        if (op === 'opAboutThis') return this.showAboutThis();
        if (this.menu.setMode) this.menu.setMode('initial');        
        return false;
    }

    public menu: IMenu = {
        title: '',
        actions: {
            opAboutThis: 'About this content',
        },
        icons: {},
        actionDefault: '', // call after close icon clicked
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        getLastMode: undefined,
        updateTitle: undefined
    }

    private showAboutThis(): boolean {

        const div = document.createElement('div');
        div.style.padding = '1rem';

        const name = this.plugin.project ? `_${this.plugin.project}_${this.plugin.shortName}` : 'nothing selected';

        div.innerHTML = `
        
            <h3>About this content</h3>
            <ul>
                <li>Reference: ${name}</li>
                <li>Level: ${this.level}</li>
                <li>Position: ${this.position}</li>
                <li><button>Open</button></li>
            </ul>
		

        `;
        div.onclick = (e) => {

            let el = e.target as HTMLElement;

            if (el.tagName.toLocaleLowerCase() === 'button' || (el.parentElement && el.parentElement.tagName.toLocaleLowerCase() === 'button')) {

                const keyFile = mls.stor.getKeyToFiles(this.plugin.project, 2, this.plugin.shortName, '', '.ts');
                const storFile = mls.stor.files[keyFile];

                if (!storFile) return;

                this.selectLevel(2)
                this.fireEvents('open', storFile, {});
            }

        };
        if (this.menu.setMode) this.menu.setMode('page', div);
        return true;
    }

    //----------COMPONENT------------------

    createRenderRoot() {
        return this;
    }

    updated(changedProperties: any) {
        if (changedProperties.has('msize')) {
            if (!this.visible || !this.contentPlugin) return;

            Array.from(this.contentPlugin.children).forEach((child) => {
                if (child.tagName.startsWith('PLUGIN-')) {
                    child.setAttribute('msize', this.msize);
                }
            });
        }
    }

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

        this.plugin = info;
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

            Array.from(this.contentPlugin.children).forEach((child) => {
                if (child.tagName.startsWith('PLUGIN-')) {
                    child.setAttribute('msize', this.msize);
                }
            });

        }

    }

    private fireEvents(action: string, file: mls.stor.IFileInfo, info: any, timeout: number = 0): void {

        const params = {} as mls.events.IFileAction;

        (params.action as any) = action;
        params.level = file.level;
        params.project = file.project;
        params.shortName = file.shortName;
        params.extension = '.ts';
        params.folder = file.folder;
        params.position = 'left' as ('right' | 'left');

        if (info && info.shortName) {
            params.newshortName = info.shortName;
            params.newProject = info.project;
            params.newfolder = file.folder;
        }

        if (['open'].includes(action)) {

            mls.actual[2].setFullName(`_${file.project}_${file.shortName}`);
            (mls.actual[2] as any)['left' as any] = {
                project: file.project,
                shortName: file.shortName,
                extension: '.ts',
                folder: file.folder,
            } as any;

        }

        mls.events.fire([2], ['FileAction'], JSON.stringify(params), timeout);

    }

}
