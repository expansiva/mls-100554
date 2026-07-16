/// <mls fileReference="_100554_/l2/previewModeSinglePage.ts" enhancement="_100554_/l2/enhancementLit" />

import { IJSONDependence } from '/_102027_/l2/libCompile.js';
import { setErrorOnModel, convertTagToFileName, getPath } from '/_102027_/l2/utils.js';
import * as util from '/_100554_/l2/previewModeUtil.js';

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

    public async buildJS(other: string[]) {
        await this.loadEsbuild();
        return this._buildJS(other);
    }

    private async configIframe() {

        if (!this.json || !this.ifr || !this.esbuild || !this.file) return;

        const find = this.findWidgets(this.ifr.contentDocument?.body);
        const savedBody = this.ifr.contentDocument?.body.innerHTML || '';
        if (this.ifr.contentDocument) this.ifr.contentDocument.body.innerHTML = '';

        const result = await this._buildJS(find);
        util.mountJSImporMap(this.json, this.ifr);
        util.mountLinks(this.json, this.ifr);
        util.mountTokens(this.json.tokens || '', this.file);
        util.addJsReference(this.ifr, this.level || '2');
        const s = document.createElement('script') as HTMLScriptElement;
        s.textContent = result.outputFiles[0].text;
        this.ifr.contentDocument?.body.appendChild(s);
        if (this.isService && this.file) util.simulateService(this.json, this.ifr, this.file);

        if (this.ifr && this.ifr.contentDocument && savedBody) {
            const div = this.ifr.contentDocument.createElement('div');
            div.innerHTML = savedBody;
            div.style.height = '100%';
            this.ifr.contentDocument.body.appendChild(div);
            //this.ifr.contentDocument.body.insertAdjacentHTML('beforeend', savedBody);
        }

    


    }

    private async _buildJS(other: string[]) {
        if (!this.json || !this.esbuild || !this.file) return;

        let myMap = this.parseImportsMap(this.json.importsMap);
        let valids = [...Object.keys(myMap), ...this.json.importsJs, ...other];
        valids = [...new Set(valids)];

        if (Object.keys(myMap).length === 0) {
            const enhancementModules = await import('/_100554_/l2/enhancementLit.js');
            const maps = enhancementModules.requires.filter((item: any) => item.type === 'cdn');
            maps.forEach((item: any) => {
                myMap[item.name] = item.ref;
            });
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

                    if ((args.path.startsWith("/") || args.path.startsWith("./") || args.path.startsWith("../")) &&
                        !args.importer.startsWith("https://") && !myMap[args.importer]) {

                        const url = new URL(args.path, 'file:' + args.importer);
                        let path = url.pathname;

                        if (!(/_(\d+)_/.test(path))) {

                            const info = getPath(args.importer.replace('/l2/', '').replace('/', ''));

                            if (!info) throw new Error('[virtualFsPlugin] Not found path:' + args.importer.replace('/l2/', '').replace('/', ''));

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

                    return null;
                });

                build.onLoad({ filter: /.*/, namespace: 'virtual' }, async (args: any) => {
                    try {

                        let path = myMap[args.path] ? myMap[args.path] : args.path;

                        const res = await fetch(path);
                        if (!res.ok) throw new Error(`Error get ${args.path}`);

                        const text = await res.text();
                        return { contents: text, loader: 'js' };

                    } catch (e: any) {
                        console.info('erro:' + args.path);
                        return {
                            contents: '',
                            loader: 'js',
                            warnings: [{
                                text: e.message, notes: [
                                    { text: 'build-error' }
                                ]
                            }]
                        }
                    }

                });
            },
        };


        let allImports = [...this.json.importsJs, ...other];
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

        if (result.warnings && result.warnings.length > 0) {
            const msgs = result.warnings
                .filter((item: any) => item.notes?.[0]?.text === 'build-error')
                .map((item: any) => item.text)
                .join('\n');

            if (this.models?.ts?.model && msgs.trim()) {
                const lineLength = this.models.ts.model.getLineLength(1);
                setErrorOnModel(this.models.ts.model, 1, 1, lineLength, msgs, monaco.MarkerSeverity.Error);
                this.models.ts.storFile.hasError = true;
            }
        }

        if (!(window as any).cachePreview) {
            (window as any).cachePreview = {};
        }
        (window as any).cachePreview[this.json.importsJs[0]] = result;

        return result;
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
        this.json.importsJs.forEach((i: string) => {
            const name = i.startsWith('/') ? i.replace('/', '') : i;
            const f = getPath(name);
            if (!f) throw new Error('[loadCache] Not found path:' + name);
            const key = mls.stor.getKeyToFiles(f.project, 2, f.shortName, f.folder, '.ts');
            if (mls.stor.files[key] && mls.stor.files[key].inLocalStorage) {
                needCompile = true;
            }

        });

        if (needCompile) return;

        return (window as any).cachePreview[this.json.importsJs[0]];
    }

}