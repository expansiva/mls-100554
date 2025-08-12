/// <mls shortName="previewModeMinimum" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IJSONDependence } from './_100554_libCompile';
import * as util from './_100554_previewModeUtil';

export class PreviewModeMinimum {

    private level: string | undefined;
    private json: IJSONDependence | undefined;
    private ifr: HTMLIFrameElement | undefined;
    private isService: boolean = false;
    private models: mls.editor.IModels | undefined = undefined;
    private file: mls.stor.IFileInfo | undefined = undefined;

    constructor(_j: IJSONDependence, _i: HTMLIFrameElement, _l: string, _s:boolean, _f: mls.stor.IFileInfo, _m: mls.editor.IModels | undefined) {

        this.json = _j;
        this.ifr = _i;
        this.level = _l;
        this.isService = _s;
        this.file = _f;
        this.models = _m;
    }

    public async init() {

        if (!this.json || !this.ifr || !this.file) return;

        util.mountJSImporMap(this.json, this.ifr);
        this.mountJS(this.json, this.ifr);
        util.mountCSS(this.ifr);
        util.mountTokens(this.json.tokens || '', this.file);
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
            util.addJsReference(ifr, this.level || '2');
            loadScripts(info.importsJs).then(() => {
                if (!this.file || !this.isService) return;
                util.simulateService(info, ifr, this.file)
            })

        } catch (e: any) {
            console.info('Error mountJS: ' + e.message);
        }

    }


}