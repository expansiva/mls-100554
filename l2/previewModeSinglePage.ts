/// <mls shortName="previewModeSinglePage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IJSONDependence } from './_100554_libCompile';
import { convertTagToFileName } from './_100554_utilsLit';
import * as util from './_100554_previewModeUtil';

export class PreviewModeSinglePage {

    private level: string | undefined;
    private json: IJSONDependence | undefined;
    private ifr: HTMLIFrameElement | undefined;
    private isService: boolean = false;
    private models: mls.editor.IModels | undefined = undefined;
    private file: mls.stor.IFileInfo | undefined = undefined;
    private esbuild: any;
    private needAwait = true;

    constructor(_j: IJSONDependence, _i: HTMLIFrameElement, _l: string, _s: boolean, _f: mls.stor.IFileInfo, _m: mls.editor.IModels | undefined) {
        this.json = _j;
        this.ifr = _i;
        this.level = _l;
        this.isService = _s;
        this.file = _f;
        this.models = _m;
    }

    public async init() {
        if (!this.json || !this.ifr) return;
        await this.loadEsbuild();
        if (this.needAwait) setTimeout(async () => await this.configIframe(), 200);
        else this.configIframe();
    }

    private async configIframe() {

        if (!this.json || !this.ifr || !this.esbuild || !this.file) return;

        let myMap = this.parseImportsMap(this.json.importsMap);
        const find = this.findWidgets(this.ifr.contentDocument?.body)
        let valids = [...Object.keys(myMap), ...this.json.importsJs, ...find];
        valids = [...new Set(valids)];

        if (Object.keys(myMap).length === 0) myMap = {
            lit: "https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js",
            "lit/decorators.js":"https://cdn.jsdelivr.net/npm/lit@3.0.0/decorators/+esm"

        } 

        const virtualFsPlugin = {
            name: 'virtual-fs',
            setup(build: any) {

                build.onResolve({ filter: /.*/ }, (args: any) => {

                    if (args.path.startsWith('./_100554_')) {
                        return {
                            path: args.path.replace('./_100554_', '/_100554_'),
                            namespace: 'virtual',
                        };
                    }

                    if (valids.includes(args.path)) {
                        return {
                            path: args.path,
                            namespace: 'virtual',
                        };
                    }

                    if (args.path.startsWith("_") &&
                        !args.importer.startsWith("https://")) {
                        return {
                            path: args.path.replace('_', '/_'),
                            namespace: 'virtual',
                        };
                    }

                    if ((args.path.startsWith("./") || args.path.startsWith("../")) &&
                        !args.importer.startsWith("https://") && !myMap[args.importer]) {

                        const url = new URL(args.path, 'file:' + args.importer);
                        let path = url.pathname;

                        if (!(/_(\d+)_/.test(path))) {

                            const info = mls.l2.getPath(args.importer.replace('/l2/', '').replace('/', ''));

                            if (!info.project) info.project = mls.actualProject as number;

                            if (path.indexOf(`_${info.project}_`) < 0) {
                                path = url.pathname.replace('/', `/_${info.project}_`)
                            }
                        }

                        return { path, namespace: 'virtual' };

                    }

                    // import url externa
                    if ((
                        args.path.startsWith("./") ||
                        args.path.startsWith("../") ||
                        args.path.startsWith("/")) &&
                        args.importer.startsWith("https://")) {

                        const url = new URL(args.path, args.importer);
                        return { path: url.href, namespace: 'virtual' };

                    }

                    // import url externa
                    if (args.path.startsWith("/") && myMap[args.importer]) {
                        const url = new URL(args.path, myMap[args.importer]);
                        return { path: url.href, namespace: 'virtual' };
                    }

                    // url externa
                    if (args.path.startsWith("http")) {
                        return { path: args.path, namespace: 'virtual' };
                    }

                    if (myMap[args.path]) {
                        return { path: myMap[args.path], namespace: 'virtual' };
                    }

                    /*
                    
                    const isValidStart = (path: string) => {
                        return !path.startsWith("./l2/") && !path.startsWith("_") && !(path.startsWith("./_") && path.indexOf("/l2/") >= 0)
                    }

                    const transforPathInitId = (input: string) => {

                        let [idPart, ...restParts] = input.split('/');
                        if (input.startsWith('./')) {
                            idPart = restParts[0];
                            restParts.shift();
                        }

                        const rest = restParts.join('/');

                        const lastSlashIndex = rest.lastIndexOf('/');
                        const path = rest.substring(0, lastSlashIndex);
                        const file = rest.substring(lastSlashIndex + 1);

                        return `/${path}/${idPart}${file}`;
                    }
                    
                    if ((
                        args.path.startsWith("./") ||
                        args.path.startsWith("../") ||
                        args.path.startsWith("/")) &&
                        myMap[args.importer] && isValidStart(args.path)) {

                        const url = new URL(args.path, myMap[args.importer]);
                        return { path: url.href, namespace: 'virtual' };

                    }

                    if ((
                        args.path.startsWith("./") ||
                        args.path.startsWith("../") ||
                        args.path.startsWith("/")) &&
                        args.importer.startsWith("https://") && isValidStart(args.path)) {

                        const url = new URL(args.path, args.importer);
                        return { path: url.href, namespace: 'virtual' };

                    }

                    if (args.path.startsWith("http")) {
                        return { path: args.path, namespace: 'virtual' };
                    }

                    if ((args.path.startsWith("_") || args.path.startsWith("./_")) &&
                        !args.importer.startsWith("https://") && !args.path.startsWith("./l2/")) {
                        return {
                            path: transforPathInitId(args.path),
                            namespace: 'virtual',
                        };
                    }

                    if (args.path.indexOf("/l2/") &&
                        !args.importer.startsWith("https://")) {
                        return {
                            path: args.path.replace('./l2/', `/_${mls.actualProject}_`),
                            namespace: 'virtual',
                        };
                    }*/


                    return null;
                });

                build.onLoad({ filter: /.*/, namespace: 'virtual' }, async (args: any) => {
                    try {

                        let path = myMap[args.path] ? myMap[args.path] : args.path;

                        const res = await fetch(path);
                        if (!res.ok) throw new Error(`Error get ${args.path}`);

                        const text = await res.text();
                        return { contents: text, loader: 'js' };

                    } catch (e) {
                        console.info('erro:' + args.path);
                        return { contents: '', loader: 'js' }
                    }

                });
            },
        };

        let allImports = [...this.json.importsJs, ...find];
        allImports = [...new Set(allImports)];

        const virtualEntryPath = "virtual-entry.js";
        const virtualEntryContent = allImports.map(path => `import "${path}";`).join("\n");

        const cachedJs = this.loadCache();
        const result = cachedJs ? cachedJs : await this.esbuild.build({
            stdin: {
                contents: virtualEntryContent,
                resolveDir: "/",
                sourcefile: virtualEntryPath,
                loader: "js"
            },
            bundle: true,
            minify: true,
            format: "esm",
            sourcemap: 'inline',
            write: false,
            plugins: [virtualFsPlugin]
        });

        util.mountJSImporMap(this.json, this.ifr);
        util.mountTokens(this.json.tokens || '', this.file);
        util.addJsReference(this.ifr, this.level || '2');
        const s = document.createElement('script') as HTMLScriptElement;
        s.textContent = result.outputFiles[0].text;
        this.ifr.contentDocument?.body.appendChild(s);
        if (this.isService && this.file) util.simulateService(this.json, this.ifr, this.file);
        if (!(window as any).cachePreview) {
            (window as any).cachePreview = {};
        }

        (window as any).cachePreview[this.json.importsJs[0]] = result;

    }

    private parseImportsMap(importsArray: string[]) {
        return Object.fromEntries(
            importsArray.map(str => {
                const match = str.match(/^"(.+?)":\s*"(.+?)"$/);
                if (!match) throw new Error("Formato inválido: " + str);
                const [, key, value] = match;
                return [key, value];
            })
        );
    }

    private findWidgets(rootElement: HTMLElement | undefined) {
        if (!rootElement) return [];
        const els = rootElement.querySelectorAll('[widget]');
        const array = Array.from(els)
            .map((el) => {

                if (!el.tagName.toLocaleLowerCase().startsWith('ica-'))
                    return '';

                const info = convertTagToFileName(el.getAttribute('widget') || '');
                if (!info) return '';
                return '/' + `_${info.project}_${info.shortName}`;

            })
            .filter(Boolean);
        const ret = [...new Set(array)]
        return ret;

    }

    private async loadEsbuild() {

        this.needAwait = true;
        if ((mls as any).esbuild) {
            this.esbuild = (mls as any).esbuild;
            this.needAwait = false;
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

    private loadCache() {
        if (mls.actualLevel !== 7) return;
        if (!(window as any).cachePreview || !this.json) return;
        if (!(window as any).cachePreview[this.json.importsJs[0]]) return;

        let needCompile = false;
        this.json.importsJs.forEach((i) => {
            const name = i.startsWith('/') ? i.replace('/', '') : i;
            const f = mls.l2.getPath(name);
            const key = mls.stor.getKeyToFiles(f.project, 2, f.shortName, f.folder, '.ts');
            if (mls.stor.files[key] && mls.stor.files[key].inLocalStorage) {
                needCompile = true;
            }

        });

        if (needCompile) return;

        return (window as any).cachePreview[this.json.importsJs[0]];
    }

}