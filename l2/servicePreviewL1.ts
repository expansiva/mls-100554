/// <mls shortName="servicePreviewL1" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { getDependenciesByHtmlFile, IJSONDependence } from './_100554_libCompile';
import { IService, IServiceMenu, IToolbarContent, ServiceBase } from './_100554_serviceBase';
import "./_100554_collabConsoleL1";

@customElement('service-preview-l1-100554')
export class ServicePreviewL1100554 extends ServiceBase {

    constructor() {
        super();
        this.setEvents();
    }

    //--------PROPERTS------------ 
    @query('#preview-container-l1') elContent: HTMLElement | undefined;

    //@property() msize: string = '';
    @property() error: string = '';
    @property() watch: boolean = true;

    //--------VARIABLES-----------

    private timeEvent: number = -1;
    private actualFile: mls.stor.IFileInfo | undefined;
    private actualFileKey: string | undefined;
    private actualTheme = 'Default';


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
        tools: {
            watchPreview: {
                type: 'cycle',
                selected: 0,
                options: [
                    { text: 'run', icon: 'f04c' },
                    { text: 'pause', icon: 'f04b' },
                ]
            },
        },
        onClickMain: () => { },
        onClickTabs: () => { },
        onClickTools: this.onClickTools.bind(this),
    }

    public onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null): void {

    }

    public onClickTools(op: string) {

        if (op === 'watchPreview') this.toogleWatch();
        else throw new Error('Invalid option')
    }

    //--------EVENTS-------------

    private setEvents() {

        mls.events.addEventListener([1], ['FileAction'], this.onMLSFileAction.bind(this));

    }

    private async onMLSFileAction(ev: mls.events.IEvent): Promise<void> {

        try {
            
            if (![1].includes(ev.level) || (ev.type !== 'FileAction') || !ev.desc) return;
            const fileAction = JSON.parse(ev.desc) as mls.events.IFileAction;

            const eventsValid = ['open', 'openBackground', 'statusOrErrorChanged', 'changed', 'new', 'modeCreated'];

            if (
                fileAction.position === this.position ||
                !eventsValid.includes(fileAction.action)
            ) return;

            if (mls.istrace) console.info('is preview l1 repaint:');

            const keyToFileInfo = mls.stor.getKeyToFiles(fileAction.project, 2, fileAction.shortName, fileAction.folder, '.ts');
            const storFile = mls.stor.files[keyToFileInfo];

            if (!storFile) return;
            this.openMe();
            this.actualFileKey = keyToFileInfo;
            this.actualFile = storFile;
            this.onReloader();

        } catch (e) {
            console.info(e);
        }

    }

    //--------COMPONENT----------

    updated(changedProperties: Map<string | number | symbol, unknown>): void {
        super.updated(changedProperties);
    }

    render() {

        this.style.display = 'block';
        if (!this.actualFile) return html`No file selected`;

        const hasError = this.error != '';
        const stErro = hasError ? 'color:red' : 'display:none';
        const stContent = hasError ? 'display:none' : 'height: 100%;';

        return html`
        <h1 style="${stErro}">${this.error}</h1>
        <div style="${stContent}" id="preview-container-l1"></div>`;

    }

    //--------IMPLEMENTS---------


    private load(): void {

        if (!this.watch) return

        if (!this.elContent) {
            this.error = 'Not found content';
            return;
        }

        if (!this.actualFile || this.actualFile.hasError) {

            this.error = 'Erro no file:' + this.actualFileKey;
            return;
        }

        Array.from(this.elContent.children).forEach((i) => i.remove());

        const iframe = document.createElement('iframe') as HTMLIFrameElement;
        iframe.style.cssText = `height:100%; width: 100%; border:none`;
        iframe.src = '/_100554_servicePreviewL1';
        iframe.onload = () => this.configIframe(iframe);

        (window as any).previewL1 = iframe;
        this.elContent.appendChild(iframe);

    }

    private toogleWatch() {
        this.watch = this.menu.tools.watchPreview.selected === 0;
        if (this.watch) this.onReloader();
    }

    private configIframe(iframe: HTMLIFrameElement) {

        if (!iframe.contentDocument) {
            this.error = 'Not found contentDocument';
            return;
        };

        this.loading = true;
        const head = iframe.contentDocument.querySelector('head');
        if (head) {
            const base = document.createElement('base');
            base.href = document.baseURI;
            head.appendChild(base);
        }

        this.initFrame(iframe);

    }

    private async initFrame(iframe: HTMLIFrameElement) {

        try {

            await this.setHTml(iframe);

            iframe.style.display = '';
            const html = iframe.contentDocument?.querySelector('html');

            if (html) {
                html.lang = this.lang;
                html.style.overflow = 'hidden';
                html.style.height = '100%';
            }

            if (iframe.contentDocument) {
                iframe.contentDocument.body.style.padding = '35px';
                iframe.contentDocument.body.style.overflowY = 'auto';
                iframe.contentDocument.body.style.overflowX = 'hidden';
                iframe.contentDocument.body.style.margin = '0';
                iframe.contentDocument.body.style.height = 'calc(100% - 70px)';
                iframe.contentDocument.body.style.width = 'calc(100% - 70px)';

            }

            this.loading = false;

        } catch (e: any) {
            this.error = e.message;
            this.loading = false;
        }
    }

    private async setHTml(iframe: HTMLIFrameElement) {

        if (!iframe.contentDocument || !this.actualFile) return;

        let txt = `<collab-console-l1-100554 file="${this.actualFileKey}"></collab-console-l1-100554>`;


        iframe.contentDocument.body.innerHTML = txt;
        const ret = await getDependenciesByHtmlFile(this.actualFile, txt, this.actualTheme, true);

        if (ret.errors.length > 0) {
            this.error = `Error(${ret.errors.length}) when compiling:${ret.errors[0].error}`;
            console.log('Errors in compile:', JSON.stringify(ret.errors));
        }

        this.mountJSImporMap(ret, iframe);
        this.mountJS(ret, iframe);
        this.mountCSS(iframe);
        this.mountTokens(iframe, ret.tokens || '');

    }

    private mountJSImporMap(info: IJSONDependence, ifr: HTMLIFrameElement): void {

        try {
            if (info.importsMap.length <= 0 || !ifr.contentDocument) return;
            const js = '{"imports": { ' + info.importsMap.join(',\n') + '} }';
            const script = document.createElement('script');
            script.type = 'importmap';
            script.textContent = js;
            ifr.contentDocument.head.appendChild(script);
        } catch (e: any) {
            console.info('Error mountJSImporMap: ' + e.message);
            return;
        }

    }

    private mountJS(info: IJSONDependence, ifr: HTMLIFrameElement): void {

        function loadScripts(scripts: string[]) {
            const loadScript = (src: string) => {
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.type = 'module';
                    script.id = src.replace('/', '');
                    script.src = src;
                    script.onload = resolve;
                    script.onerror = reject;
                    ifr.contentDocument?.body.appendChild(script);
                });
            };

            let nextScript = Promise.resolve();
            for (const script of scripts) {
                nextScript = nextScript.then(() => loadScript(script)) as Promise<void>;
            }
            return nextScript;
        }

        try {

            if (info.importsJs.length <= 0 || !ifr.contentDocument) return;
            const s = document.createElement('script') as HTMLScriptElement;
            s.textContent = `
				window['mls'] = window['mls']  ? window['mls']  : parent.mls ? parent.mls : top['mls'];
				window['globalVariation'] = window['globalVariation']  ? window['globalVariation']  : parent.globalVariation ? parent.globalVariation : top['globalVariation'];
				window['latest'] = window['latest']  ? window['latest']  : parent.latest ? parent.latest : top['latest'];
				window['Quill'] = window['Quill']  ? window['Quill']  : parent.Quill ? parent.Quill : top['Quill'];
				window['EasyMDE'] = window['EasyMDE']  ? window['EasyMDE']  : parent.EasyMDE ? parent.EasyMDE : top['EasyMDE'];
				window['l2_html'] = window['l2_html']  ? window['l2_html']  : parent.l2_html ? parent.l2_html : top['l2_html'];
                window['monaco'] = window['monaco']  ? window['monaco']  : parent.monaco ? parent.monaco : top['monaco'];
				window['l2_fieldTypes'] = window['l2_fieldTypes']  ? window['l2_fieldTypes']  : parent.l2_fieldTypes ? parent.l2_fieldTypes : top['l2_fieldTypes'];window['litDisableBundleWarning'] = true; window['collabActualLevel'] = ${this.level};

                
				`;
            ifr.contentDocument?.body.appendChild(s);
            loadScripts(info.importsJs);


        } catch (e: any) {
            console.info('Error mountJS: ' + e.message);
        }

    }

    private mountCSS(ifr: HTMLIFrameElement): void {
        try {
            if (!ifr.contentDocument) return;
            const style = document.createElement('style');
            ifr.contentDocument.body.className = 'scroll-custom';
            ifr.contentDocument.body.style.width = '100%';

            ifr.contentDocument.body.style.background = 'var(--bg-primary-color)';
            ifr.contentDocument.body.style.color = 'var(--text-primary-color)';


            ifr.contentDocument.body.appendChild(style);
        } catch (e: any) {
            console.info('Error mountCSS: ' + e.message);
        }
    }

    private mountTokens(iframe: HTMLIFrameElement, tokens: string): void {
        try {
            if (!iframe || !iframe.contentDocument) return;
            this.removeOlderTokens(iframe);
            const css = tokens || '';
            if (!css) return;
            const style = document.createElement('style');
            style.textContent = css;
            style.id = this.getIdTokens();
            iframe.contentDocument.head.appendChild(style);

        } catch (e: any) {
            console.info('Error mountTokens: ' + e.message);
        }
    }

    private getIdTokens() {
        if (!this.actualFile) return 'ds_tokens';
        const { project } = this.actualFile
        return '_' + project + '_ds_tokens';
    }

    private removeOlderTokens(ifr: HTMLIFrameElement) {
        const id = this.getIdTokens();
        if (!ifr.contentDocument || !id) return;
        const st = ifr.contentDocument.head.querySelectorAll(`#${id}`);
        st.forEach((s) => s.remove());
    }

    private onReloader(): void {

        if (!this.watch) return

        if (this.error !== '') this.error = '';

        clearTimeout(this.timeEvent);
        this.timeEvent = setTimeout(() => {
            this.load();
        }, 500)

    }
}