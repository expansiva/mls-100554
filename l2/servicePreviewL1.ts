/// <mls shortName="servicePreviewL1" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { getDependenciesByHtmlFile, IJSONDependence } from './_100554_libCompile';
import { IService, IServiceMenu, IToolbarContent, ServiceBase } from './_100554_serviceBase';
import "./_100554_collabConsoleL1";

@customElement('service-preview-l1-100554')
export class ServicePreviewL1100554 extends ServiceBase {

    private esbuild: any;
    private iframe: HTMLIFrameElement | undefined;

    constructor() {
        super();
        this.init();
        this.setEvents();
    }

    //--------PROPERTS------------ 
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
            startServer: {
                type: 'cycle',
                selected: 0,
                options: [
                    { text: 'Server On', icon: 'f192' },
                    { text: 'Server Off', icon: 'f192' },
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
        else if (op === 'startServer') this.onBtnStartServerClick();
        else throw new Error('Invalid option')
    }

    private onBtnStartServerClick() {
        this.startServer = !this.startServer;

        if (this.startServer && this.iframe && this.iframe.contentWindow) {

            this.iframe.contentWindow.onmessage = async (e) => {
                
                const data = e.data;
                console.info('message', data);
                const res: ResponseMsgBase = {
                    type: "fetch-response",
                    id: data.id,
                    body: '',
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                }

                if (data.type !== "fetch-request") res.status = 502; //Bad Gateway
                else {

                    const method = data.url.split('/').pop();

                    if (!this.iframe || !(this.iframe.contentWindow as any)[method]) {
                        res.status = 503; // Service Unavailable
                    } else {

                        const exec = (this.iframe.contentWindow as any)[method];
                        const strJson = data.options && data.options.body ? data.options.body : '{}';
                        const resposta = await exec(JSON.parse(strJson));
                        res.body = JSON.stringify(resposta)

                    }

                }

                if (window.preview.iframe && window.preview.iframe.contentWindow)
                    window.preview.iframe.contentWindow.postMessage(res, "*" as any);
                //e.source?.postMessage(res, "*" as any);
            };

        } else {
            if (this.iframe && this.iframe.contentWindow) {
                this.iframe.contentWindow.onmessage = () => undefined;
            }
        }

        return this.startServer;

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

            const keyToFileInfo = mls.stor.getKeyToFiles(fileAction.project, 1, fileAction.shortName, fileAction.folder, '.ts');
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
        if (!this.actualFile) this.error = `No file selected`;

        const hasError = this.error != '';
        const stErro = hasError ? 'color:red' : 'display:none';
        const stContent = hasError ? 'display:none' : 'height: 100%;';

        return html`
        <div style="${stContent}" id="preview-container-l1"></div>
        <h1 style="${stErro}">${this.error}</h1>
        `;

    }

    //--------IMPLEMENTS---------

    private async init() {
        await this.loadEsbuild();
    }

    private async loadEsbuild() {
        if ((mls as any).esbuild) {
            this.esbuild = (mls as any).esbuild;
        } else if (!(mls as any).esbuildInLoad) await this.initializeEsBuild();
    }

    private async initializeEsBuild() {

        (mls as any).esbuildInLoad = true;
        const url = 'https://unpkg.com/esbuild-wasm@0.14.54/esm/browser.min.js';
        if (!this.esbuild) {
            this.esbuild = await import(url);
            await this.esbuild.initialize({
                wasmURL: "https://unpkg.com/esbuild-wasm@0.14.54/esbuild.wasm"
            });
            (mls as any).esbuild = this.esbuild;
            (mls as any).esbuildInLoad = false

        }

    }

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

        this.iframe = document.createElement('iframe') as HTMLIFrameElement;
        this.iframe.style.cssText = `height:100%; width: 100%; border:none`;
        this.iframe.src = '/_100554_servicePreviewL1';
        this.iframe.onload = () => this.configIframe(this.iframe as HTMLIFrameElement);
        this.iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');

        (window as any).previewL1 = this.iframe;
        this.elContent.appendChild(this.iframe);

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
            return;
        }

        const bundle = await this.compileWithEsbuild(ret);

        if (!bundle) {
            this.error = "Build returned empty result";
            return;
        }

        this.mountJSImporMap(ret, iframe);
        this.mountJSBundle(bundle, iframe);
        this.mountCSS(iframe);
        this.mountTokens(iframe, ret.tokens || '');

    }

    private mountJSBundle(jsCode: string, ifr: HTMLIFrameElement) {
        try {
            if (!ifr.contentDocument) return;

            const script = document.createElement('script');
            script.type = "module";
            script.textContent = jsCode;

            ifr.contentDocument.body.appendChild(script);

            const scriptBase = document.createElement('script');
            scriptBase.type = "module";
            scriptBase.src = "/_100554_collabConsoleL1";

            ifr.contentDocument.body.appendChild(scriptBase);



        } catch (e: any) {
            console.info('Error mountJSBundle: ' + e.message);
        }
    }

    private async compileWithEsbuild(info: IJSONDependence): Promise<string | null> {
        try {

            if (!this.esbuild) {
                console.warn("esbuild not loaded");
                return null;
            }

            const virtualFiles: Record<string, string> = await this.getVirtualFiles();

            let entryCode = Object.keys(mls.stor.files).map((p, i) => {

                const sf = mls.stor.files[p];
                if (!sf || sf.level !== 1 || sf.extension != '.ts' || sf.project !== mls.actualProject) return '';

                const verify = `/_${sf.project}_${sf.folder ? sf.folder + '/' : ''}${sf.shortName}`;
                const name = './' + (sf.folder ? sf.folder + '/' : '') + sf.shortName;

                const aux = info.importsJs.includes(verify) ? `Object.assign(window, m${i});` : '';

                return `import * as m${i} from "${name}";
                ${aux} 
                `

            }).join("\n").trim();



            const result = await this.esbuild.build({
                stdin: {
                    contents: entryCode,
                    sourcefile: "virtual-entry.ts",
                    resolveDir: "/",
                },
                bundle: true,
                write: false,
                format: "esm",
                loader: { ".ts": "ts" },
                plugins: [this.getVirtualFilesPlugin(virtualFiles)]
            });

            if (!result.outputFiles || !result.outputFiles[0]) return null;

            return result.outputFiles[0].text;

        } catch (err) {
            console.error("esbuild error:", err);
            return null;
        }
    }

    private async getVirtualFiles(): Promise<Record<string, string>> {

        let files: Record<string, string> = !(window as any).cachePreviewL1Files ? {} : (window as any).cachePreviewL1Files;

        for (const [name, f] of Object.entries(mls.stor.files)) {

            if (!f || f.project !== mls.actualProject || f.level !== 1 || f.extension !== '.ts') continue;

            const name = (f.folder ? f.folder + '/' + f.shortName : f.shortName).toLocaleLowerCase();
            if (files[name] && !f.inLocalStorage) continue;

            files[name] = await f.getContent() as string;

        }

        (window as any).cachePreviewL1Files = files;

        return files;

    }

    private getVirtualFilesPlugin(files: Record<string, string>) {
        return {
            name: "virtual-files",
            setup(build: any) {

                // Resolver imports relativos
                build.onResolve({ filter: /^\.|\// }, (args: any) => {

                    if (args.importer.split('/').length >= 3) {

                        const importer = args.importer;
                        const base = "file://" + importer;
                        const resolvedURL = new URL(args.path, base);
                        let resolved = resolvedURL.pathname;

                        // adiciona extensão se faltar
                        if (!resolved.endsWith(".ts") && !resolved.endsWith(".js")) {
                            resolved += ".ts";
                        }

                        return {
                            path: resolved,
                            namespace: "vfs",
                        };
                    } else {

                        const resolved = new URL(args.path, "file://" + args.resolveDir + "/").pathname;
                        return { path: resolved.endsWith(".ts") || resolved.endsWith(".js") ? resolved : resolved + ".ts", namespace: "vfs" };
                    }
                });

                // Retornar conteúdo dos arquivos da memória
                build.onLoad({ filter: /\.(ts|js)$/, namespace: "vfs" }, (args: any) => {
                    const path = (args.path.replace(/^\/+/, "").replace('.ts', '').trim()).toLocaleLowerCase(); // remove /
                    const content = files[path];
                    if (!content) {
                        console.warn("Arquivo não encontrado no virtual FS:", path);
                        return { contents: "", loader: "ts" };
                    }
                    return { contents: content, loader: path.endsWith(".js") ? "js" : "ts" };
                });
            }
        };
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

interface ResponseMsgBase {
    type: "fetch-response",
    id: string,
    body: string,
    status: number,
    headers: any

}