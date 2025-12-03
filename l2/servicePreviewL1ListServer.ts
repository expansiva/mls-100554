/// <mls shortName="servicePreviewL1ListServer" project="100554" enhancement="_100554_enhancementLit" />

import { html, repeat, unsafeHTML } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js'
import { IJSONDependence } from '/_100554_/l2/libCompile.js';
import "/_100554_/l2/collabConsoleL1.js";

@customElement('service-preview-l1-list-server-100554')
export class ServicePreviewL1ListServer extends CollabLitElement {

    private esbuild: any;
    private cacheBuild: Record<string, string> = {};
    public iframes: Record<string, HTMLIFrameElement> = {};
    public servers: Record<string, HTMLIFrameElement> = {};

    @state() listItens: IListItem[] = [];
    @query("#viewServer") viewServer: HTMLElement | undefined;
    @query("#iframesContent") iframesContent: HTMLElement | undefined;

    constructor() {
        super();
        
        this.init();
    }

    //--------COMPONENT----------

    render() {
        return html`
        <div class="wrap">
            ${this.renderHeader()}
            ${this.renderList()}
        </div>
        <div id="modal" class="modal-backdrop" role="dialog" aria-modal="true" aria-hidden="true">
            <div class="modal" role="document">
                <button class="btn close" id="closeModal" aria-label="Fechar" @click=${this.handleCloseView}>Close</button>
                <h3 id="modalTitle">Server Details</h3>
                <p id="modalBody">Server information...</p>
                <div id="viewServer">
                </div>
            </div>
        </div>
        <div id="iframesContent" style="display:none">
        </div>
        `;
    }

    renderHeader() {
        return html`
        <header>
            <div>
                <h1>Servers</h1>
                <p class="lead">List of servers with status and quick actions (Power On/Off, Restart, View)</p>
            </div>
        </header>
        `
    }

    renderList() {
        return html`
        <main>
            <div class="list" id="serverList" aria-live="polite">
                ${repeat(this.listItens, ((key: IListItem) => key.server) as any, ((k: IListItem, index: any) => { return this.renderItem(k, index) }) as any)}
            </div>
        </main>
        `
    }

    renderItem(item: IListItem, idx: number) {
        const n = item.icon ? unsafeHTML(item.icon) : `SV${idx + 1}`;
        return html`
        <div class="server" data-status="off" data-path="${item.server}">
            <div class="server-main">
                <div class="thumb">${n}</div>
                <div class="meta">
                    <div class="name">${item.name}</div>
                    <div class="desc">File: ${item.server}</div>
                </div>
            </div>

            <div class="status">
                <div class="badge badge--off">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.6"/></svg>
                    Off
                </div>

                <div class="controls">
                    <button class="btn btn--primary btn-power" title="Desligar/ligar" @click=${this.handleClickPower}>
                        <svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2v6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M5.5 8.5a7 7 0 1013 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
                        Power
                    </button>

                    <button class="btn btn--danger btn-restart" title="Restart"  @click=${this.handleClickRestart} >
                        <svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 12a9 9 0 11-9-9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        Restart
                    </button>

                    <button class="btn btn--primary btn-view" title="Visualizar" @click=${this.handleClickView} >
                        <svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
                        View
                    </button>
                </div>
            </div>
        </div>
        `
    }

    //---------IMPLEMENTS-------------


    private async init() {

        const url = `/_${mls.actualProject}_project`;
        const m = await import(url);
        const array: IListItem[] = [];
        if (m.modules) {
            m.modules.forEach((s: any, index: number) => {
                if (!s.pathServer) return;
                array.push({
                    name: s.name || 'S' + (index + 1),
                    server: s.pathServer || 'null',
                    icon: s.icon
                })
            })
        }

        this.listItens = array;
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

    private handleClickPower(ev: MouseEvent) {

        const btn = (ev.target as HTMLElement).closest('button');
        if (!btn) return;
        const server = btn.closest('.server') as HTMLElement;
        if (!server) return;
        const path = server.getAttribute('data-path') as string;
        if (!path) return;

        const current = server.getAttribute('data-status');
        if (current === 'on') {
            server.setAttribute('data-status', 'off');
        } else {
            server.setAttribute('data-status', 'on');
        }

        this.refreshRow(path, server);

    }

    private handleClickRestart(ev: MouseEvent) {

        const btn = (ev.target as HTMLElement).closest('button');
        if (!btn) return;
        const server = btn.closest('.server') as HTMLElement;
        if (!server) return;
        const path = server.getAttribute('data-path') as string;
        if (!path) return;

        if (server.getAttribute('data-status') !== 'on') return;

        server.setAttribute('data-status', 'restarting');
        this.refreshRow(path, server);


    }

    private handleClickView(ev: MouseEvent) {

        const btn = (ev.target as HTMLElement).closest('button');
        if (!btn) return;
        const server = btn.closest('.server') as HTMLElement;
        if (!server) return;
        const path = server.getAttribute('data-path') as string;
        if (!path) return;

        const modal = this.querySelector('#modal') as HTMLElement;
        if (!modal) return;

        if (!this.viewServer) return;

        this.viewServer.innerHTML = '';
        this.viewServer.appendChild(this.iframes[path]);

        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');


    }

    private handleCloseView(ev: MouseEvent) {

        const btn = (ev.target as HTMLElement).closest('button');
        if (!btn) return;
        const modal = btn.closest('#modal') as HTMLElement;
        if (!modal) return;

        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');


    }

    private refreshRow(path: string, row: HTMLElement) {
        const status = row.getAttribute('data-status');
        const badge = row.querySelector('.badge') as HTMLElement;
        const restartBtn = row.querySelector('.btn-restart') as HTMLButtonElement;

        badge.innerHTML = `<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.6"/></svg>`;

        if (status === 'on') {
            badge.classList.remove('badge--off', 'badge--restart');
            badge.classList.add('badge--on');
            badge.innerHTML += ' On'
            restartBtn.disabled = false;
            restartBtn.removeAttribute('aria-disabled');
            this.onServer(path, row);

        } else if (status === 'off') {

            badge.classList.remove('badge--on', 'badge--restart');
            badge.classList.add('badge--off');
            badge.innerHTML += ' Off'
            restartBtn.disabled = true;
            restartBtn.setAttribute('aria-disabled', 'true');
            this.offServer(path);

        } else if (status === 'restarting') {

            badge.classList.remove('badge--on', 'badge--off');
            badge.classList.add('badge--restart')
            badge.innerHTML = '<span class="spinner" aria-hidden="true"></span> Restarting';
            restartBtn.disabled = true;
            restartBtn.setAttribute('aria-disabled', 'true');
            this.restartServer(path, row);
        }

    }

    private onServer(path: string, server: HTMLElement) {
        if (!this.iframes[path]) {
            this.createServer(path, server);
            return;
        }

        const i = this.iframes[path];
        if (!i.contentWindow) return;

        i.contentWindow.onmessage = async (e) => {

            const data = e.data;
            console.info('message', data);
            const res: ResponseMsgBase = {
                type: "fetch-response",
                id: data.id,
                body: '',
                status: 200,
                headers: { "Content-Type": "application/json" }
            }

            if (data.type === "fetch-request") {

                const method = 'exec'; // data.url.split('/').filter(Boolean).join('_');
                if (i && (i.contentWindow as any)[method]) {

                    const exec = (i.contentWindow as any)[method];
                    const strJson = data.options && data.options.body ? data.options.body : '{}';
                    const resposta = await exec(JSON.parse(strJson));
                    res.body = JSON.stringify(resposta)

                    if (window.preview.iframe && window.preview.iframe.contentWindow)
                        window.preview.iframe.contentWindow.postMessage(res, "*" as any);

                }
            }

        };

    }

    private offServer(path: string) {
        if (!this.iframes[path]) return;
        const i = this.iframes[path];
        if (!i.contentWindow) return;

        i.contentWindow.onmessage = () => undefined;

    }

    private restartServer(path: string, server: HTMLElement) {

        if (this.iframes[path]) {
            this.iframes[path].remove();
            delete this.iframes[path];
        }

        this.createServer(path, server);


    }

    private createServer(path: string, server: HTMLElement): void {

        if (this.iframes[path]) return

        this.iframes[path] = document.createElement('iframe') as HTMLIFrameElement;
        this.iframes[path].src = '/_100554_servicePreviewL1';
        this.iframes[path].onload = () => {
            try {
                this.setHTml(path, this.iframes[path]);
                this.onServer(path, server);
                server.setAttribute('data-status', 'on');
                this.refreshRow(path, server);
            } catch (e) {
                server.setAttribute('data-status', 'off');
                this.refreshRow(path, server);
            }

        };
        this.iframes[path].setAttribute('sandbox', 'allow-scripts allow-same-origin');

        this.servers = {};
        Object.keys(this.iframes).forEach((key: string) => {
            const f = this.listItens.find((i: IListItem) => i.server === key);

            if (f) this.servers[f.name] = this.iframes[key];
        });

        (top as any).previewL1 = this.servers;

        if (this.iframesContent) this.iframesContent.appendChild(this.iframes[path]);

    }


    private async setHTml(path: string, iframe: HTMLIFrameElement) {

        if (!iframe.contentDocument) return;

        const info = mls.l2.getPath(path);
        const key = mls.stor.getKeyToFiles(info.project, 1, info.shortName, info.folder, '.ts');
        if (!mls.stor.files[key]) throw new Error('[setHTml]: Not found stor');

        const actualFile = mls.stor.files[key];

        let txt = `<collab-console-l1-100554 file="${path}"></collab-console-l1-100554>
        <style>
            html{
                height:100%;
            }
            body{
                height: calc(100% - 34px);
            }
        </style>`;


        iframe.contentDocument.body.innerHTML = txt;

        let name = `/_${actualFile.project}_${actualFile.shortName}`;
        if (actualFile.folder) name = `/_${actualFile.project}_${actualFile.folder}/${actualFile.shortName}`;

        const ret = {
            errors: [] as any,
            importsJs: ["/_100554_collabConsoleL1", name],
            importsMap: ['"lit": "https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js"', '"lit/decorators.js": "https://cdn.jsdelivr.net/npm/lit@3.0.0/decorators/+esm"']
        } as IJSONDependence;

        if (ret.errors.length > 0) throw new Error(`[setHTml]: Error(${ret.errors.length}) when compiling:${ret.errors[0].error}`);

        const bundle = this.cacheBuild[path] ? this.cacheBuild[path] : await this.compileWithEsbuild(ret, actualFile);

        if (!bundle) throw new Error(`[setHTml]: Build returned empty result`);

        if (!this.cacheBuild[path]) this.cacheBuild[path] = bundle;

        this.mountJSImporMap(ret, iframe);
        this.mountJSBundle(bundle, iframe);

    }

    private async compileWithEsbuild(info: IJSONDependence, storFile: mls.stor.IFileInfo): Promise<string | null> {
        try {

            if (!this.esbuild) {
                console.warn("esbuild not loaded");
                return null;
            }

            const virtualFiles: Record<string, string> = await this.getVirtualFiles(storFile);

            let entryCode = Object.keys(mls.stor.files).map((p, i) => {

                const sf = mls.stor.files[p];
                if (!sf || sf.level !== 1 || sf.extension != '.ts' || sf.project !== storFile.project) return '';

                const verify = `/_${sf.project}_${sf.folder ? sf.folder + '/' : ''}${sf.shortName}`;
                const name = './' + (sf.folder ? sf.folder + '/' : '') + sf.shortName + '.js';

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

    private async getVirtualFiles(storFile: mls.stor.IFileInfo): Promise<Record<string, string>> {

        let files: Record<string, string> = {};

        for (const [name, f] of Object.entries(mls.stor.files)) {

            if (!f || f.project !== storFile.project || f.level !== 1 || f.extension !== '.ts') continue;

            const name = ((f.folder ? f.folder + '/' + f.shortName : f.shortName) + '.js').toLocaleLowerCase();

            if (files[name]) continue;

            files[name] = await f.getContent() as string;

        }

        return files;

    }

    private getVirtualFilesPlugin(files: Record<string, string>) {
        return {
            name: "virtual-files",
            setup(build: any) {
                // Resolver imports relativos
                build.onResolve({ filter: /^(\.|\/)/ }, (args: any) => {

                    if (args.importer.split('/').length >= 3) {

                        const importer = args.importer;
                        const base = "file://" + importer;
                        const resolvedURL = new URL(args.path, base);
                        let resolved = resolvedURL.pathname;

                        // adiciona extensão se faltar
                        if (!resolved.endsWith(".ts") && !resolved.endsWith(".js")) {
                            resolved += ".js";
                        }

                        return {
                            path: resolved,
                            namespace: "vfs",
                        };
                    } else {

                        const resolved = new URL(args.path, "file://" + args.resolveDir + "/").pathname;
                        return { path: resolved.endsWith(".ts") || resolved.endsWith(".js") ? resolved : resolved + ".js", namespace: "vfs" };
                    }
                });

                // Retornar conteúdo dos arquivos da memória
                build.onLoad({ filter: /\.(ts|js)$/, namespace: "vfs" }, (args: any) => {
                    const path = (args.path.replace(/^\/+/, "").trim()).toLocaleLowerCase(); // remove /
                    const content = files[path];
                    if (!content) {
                        console.warn("Arquivo não encontrado no virtual FS:", path);
                        return { contents: "", loader: "ts" };
                    }
                    return { contents: content, loader: "ts" };
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

}

interface ResponseMsgBase {
    type: "fetch-response",
    id: string,
    body: string,
    status: number,
    headers: any

}

interface IListItem {
    name: string,
    server: string,
    icon: string | undefined
}
