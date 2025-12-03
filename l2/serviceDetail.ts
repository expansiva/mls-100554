/// <mls shortName="serviceDetail" project="100554" enhancement="_100554_enhancementLitService" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from '/_100554_/l2/serviceBase.js';
import { getAllWebComponentsInSource } from '/_100554_/l2/libCompile.js';
import { convertTagToFileName, convertFileNameToTag } from '/_100554_/l2/utilsLit.js';

@customElement('service-detail-100554')
export class ServiceDetail100554 extends ServiceBase {

    @property({ type: String }) msize = '';
    @property({ type: String }) widget = '';

    @state() typeRender: 'default' = 'default';

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

    public updateContentPluginWithElement(element: HTMLElement) {

        const tag = element.tagName.toLocaleLowerCase();
        if (tag.indexOf('-')) {
            const info = convertTagToFileName(tag);
            if (info) {
                this.plugin = {
                    project: info.project,
                    shortName: info.folder ? `${info.folder}/${info.shortName}` : info.shortName
                };
            }
        }
        this._updateContentPluginWithElement(element);
    }

    public clear() {
        if (!this.contentPlugin) throw new Error('Error on serviceDetail, contentPlugin is null');
        Array.from(this.contentPlugin.children).forEach((i) => {
            if((i as any).level !== mls.actualLevel)(i as HTMLElement).style.display = "none";
        });
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

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

        if (!visible && this.contentPlugin) {
            //Array.from(this.contentPlugin.children).forEach((i) => (i as HTMLElement).style.display = "none");

        }

        if (!this.contentPlugin) return;
        Array.from(this.contentPlugin.children).forEach((child) => {
            if (child.tagName.startsWith('PLUGIN-')) {
                child.setAttribute('msize', this.msize);
            }

            (child as HTMLElement).style.display = 'none';
        });

    }

    //----------COMPONENT------------------

    firstUpdated(_changedProperties: Map<PropertyKey, unknown>) {
        super.firstUpdated(_changedProperties);
        this.onWidgetChanged();
    }

    updated(changedProperties: Map<PropertyKey, unknown>) {

        super.firstUpdated(changedProperties);

        if (changedProperties.has('widget')) {
            this.onWidgetChanged();
        }

        if (changedProperties.has('msize')) {
            if (!this.visible || !this.contentPlugin) return;

            Array.from(this.contentPlugin.children).forEach((child) => {
                if (child.tagName.startsWith('PLUGIN-')) {
                    child.setAttribute('msize', this.msize);
                }
            });
        }
    }

    render() {
        return this.renderDefault();
        
    } 

    renderDefault() {
        return html`<div style="overflow:auto;height: calc(100% - 2rem);padding:1rem" id="contentPlugin"></div>`;
    }


    //----------IMPLEMENTS-------------------

    private setEvents(): void {
        mls.events.addEventListener([0, 1, 2, 3, 4, 5, 6, 7], ['PluginDetails'], (ev) => this.onPluginDetails(ev));
        mls.events.addListener(2, 'MonacoAction', (ev) => this.onMonacoEvents(ev));
        mls.events.addListener(2, 'FileAction', (ev) => this.onFileActionReceived.bind(this)(ev));
        
    }

    private onMonacoEvents(ev: mls.events.IEvent): void {

        if (!ev.desc) return;
        const args: mls.events.IMonacoAction = JSON.parse(ev.desc);
        if (!args) return;
        const { action, position } = args;

        if (position === this.position) return;
        if (action !== 'helpAssistant') return;
        if (!args.codeLenCommand?.refs) return;

        this.openMe();
        mls.actual[0].setFullName(args.codeLenCommand.refs);
        const { project, path } = mls.actual[0];
        if (!path || !project) return;
        const info: mls.events.IPluginDetail = {
            project,
            shortName: path,
        };
        this.showPluginContent(info);

    }

    private async onFileActionReceived(ev: mls.events.IEvent) {

        if (!ev.desc) return;
        const params: mls.events.IFileAction = JSON.parse(ev.desc);
        if (params.action !== 'fileReference') return;
        const info: mls.events.IPluginDetail = {
            project: 100554,
            shortName: 'pluginCodelensFileReferences',
            htmlText: `<plugin-codelens-file-references-100554 project=${params.project} shortname=${params.shortName} position=${params.position}></plugin-codelens-file-references-100554>`
        };
        this.openMe();
        this.showPluginContent(info);

    }

    private onPluginDetails(ev: mls.events.IEvent) {
        if (!ev.desc) throw new Error('Error on PluginDetails event, invalid desc');
        this.openMe();
        if (this.menu && this.menu.closeMenu) this.menu.closeMenu();
        const data: mls.events.IPluginDetail = JSON.parse(ev.desc);

        this.showPluginContent(data);
    }

    private onWidgetChanged() {
        if (this.widget) {
            const { project, shortName, folder } = mls.l2.getPath(this.widget);
            const tag = convertFileNameToTag({ project, shortName, folder });
            const info: mls.events.IPluginDetail = {
                project,
                shortName,
                htmlText: `<${tag}></${tag}>`
            };
            this.showPluginContent(info);
        }
    }

    private async showPluginContent(info: mls.events.IPluginDetail) {
        // show htmlText or plugin html
        if (!info.project || !info.shortName) {
            if (!info.htmlText) throw new Error(`Error on PluginDetails events, invalid data: ${info.project} ${info.shortName}`);
        }
        if (!this.contentPlugin) throw new Error('Error on serviceDetail, contentPlugin is null');

        this.plugin = info;
        const plugin = info.htmlText ? 'any' : `_${info.project}_${info.shortName}`;
        const content: string = info.htmlText ? info.htmlText : await this.getHtmlFromPlugin(info);
        this.updateContentPluginWithScripts(plugin, content, (info as any).arguments);
    }

    private async getHtmlFromPlugin(info: mls.events.IPluginDetail): Promise<string> {
        const keyFile = mls.stor.getKeyToFiles(info.project, 2, info.shortName, '', '.html');
        const storFile = mls.stor.files[keyFile];
        if (!storFile) return 'Not found storFile:' + JSON.stringify(info);
        const content = await storFile.getContent();
        if (typeof content !== 'string') return `Error on content of _${info.project}_${info.shortName}`;
        return content;
    }

    private updateContentPluginWithScripts(ori: string, content: string, args: any): void {
        if (!this.contentPlugin) throw new Error('Error on serviceDetail, contentPlugin is null');

        Array.from(this.contentPlugin.children).forEach((i) => (i as HTMLElement).style.display = "none");

        let el = this.contentPlugin.querySelector('#' + ori + mls.actualLevel) as HTMLElement;

        if (!el) {
            el = document.createElement('div');
            el.id = ori + mls.actualLevel;
            this.setContentinEl(el, content, args);
            return;
        }

        if (ori === 'any') {
            el.innerHTML = '';
            this.setContentinEl(el, content, args);
            el.style.display = '';
            return;
        }

        el.style.display = '';
        (el as any).args = args;

    }

    private _updateContentPluginWithElement(element: HTMLElement) {

        if (!this.contentPlugin) throw new Error('Error on serviceDetail, contentPlugin is null');
        Array.from(this.contentPlugin.children).forEach((i) => (i as HTMLElement).style.display = "none");

        let el = this.contentPlugin.querySelector('#' + element.tagName.toLowerCase()) as HTMLElement;
        if (!el) {
            el = document.createElement('div');
            el.id = element.tagName.toLowerCase();
        }
        el.style.display = 'block';
        this.setContentElement(el, element);

    }

    private setContentElement(el: HTMLElement, elementToAdd: HTMLElement) {
        if (!this.contentPlugin) throw new Error('Error on serviceDetail, contentPlugin is null');
        const allWcs = getAllWebComponentsInSource(elementToAdd.outerHTML);
        el.innerHTML = '';
        allWcs.forEach((wc) => {
            const info = convertTagToFileName(wc);
            if (info) {
                const script = document.createElement('script');
                script.type = 'module';
                script.id = `_${info.project}_${info.shortName}`;
                script.src = (`/_${info.project}_${info.shortName}`);
                el.appendChild(script)
            }
        });
        el.appendChild(elementToAdd);
        this.contentPlugin.appendChild(el);

    }

    private setContentinEl(el: HTMLElement, content: string, args: any) {

        if (!this.contentPlugin) throw new Error('Error on serviceDetail, contentPlugin is null');

        const allWcs = getAllWebComponentsInSource(content);
        el.innerHTML = content;
        (el as any).args = args;
        allWcs.forEach((wc) => {
            const info = convertTagToFileName(wc);
            if (info) {
                const script = document.createElement('script');
                script.type = 'module';
                script.id = `_${info.project}_${info.shortName}`;
                script.src = (`/_${info.project}_${info.shortName}`);
                el.appendChild(script)
            }
        });

        Array.from(el.children).forEach((child) => {
            if (child.tagName.startsWith('PLUGIN-')) {
                child.setAttribute('msize', this.msize);
            }
        });

        this.contentPlugin.appendChild(el);
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
