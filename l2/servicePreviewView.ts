/// <mls shortName="servicePreviewView" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getDependenciesByHtml, getTokens, IJSONDependence } from './_100554_libCompile';
import { convertFileNameToTag } from './_100554_utilsLit';
import { ServiceBase } from './_100554_serviceBase'
import { compileStyleUsingStorFile } from './_100554_enhancementStyle';
import { IcaLitElement } from './_100554_icaLitElement';

/// **collab_i18n_start**
const message_pt = {
    pageNotDefined: 'Página não definida',
    notFoundStorfile: 'Arquivo não encontrado',
    errorCompile: 'Erro ao compilar typescript',
    configure: 'Configure seu HTML pela opção do editor!',
    width: 'Largura',
    height: 'Altura'
}

const message_en = {
    pageNotDefined: 'Page not defined',
    notFoundStorfile: 'Not found storfile',
    errorCompile: 'Error on compiling typescript',
    configure: 'Configure your html by editor option!',
    width: 'Width',
    height: 'Height',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**


@customElement('service-preview-view-100554')
export class ServicePreviewView extends IcaLitElement {

    public infoIca: any;

    private msg: MessageType = messages['en'];

    private file: mls.stor.IFileInfo | undefined = undefined;

    private models: mls.editor.IModels | undefined = undefined;

    @property() father: any;

    @property() page: string = '';

    @property() mode: string = 'desktop';

    @property() lang: string = 'en';

    @property() level: string = '';

    @property() isDsComponent: boolean = false;

    @property() watch: boolean = true;

    @property() stylechanged: string = '';

    @property() actualtheme: string = 'Default';

    @property() error: string = '';

    @property() lastCompiledUrl: string = '';

    @property() widthP: string = '300';

    @property() heightP: string = '600';

    private setEventsCollab(): void {
        mls.events.addListener(2, 'WidgetAction', this.onWidgetActionEvents.bind(this));
    }

    connectedCallback() {
        super.connectedCallback();
        this.setEventsCollab();
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string) {
        if (name === 'stylechanged') {
            if (newVal === 'true') this.addStyles();
            return;
        }
        super.attributeChangedCallback(name, oldVal, newVal);
    }

    render() {
        const lang = this.father && this.father.getMessageKey ? this.father.getMessageKey(messages) : 'en-us';
        this.msg = messages[lang];
        if (this.error !== '') return this.renderError();
        else return this.renderPreview();
    }

    renderError() {
        return html`<h3 style="color:red">${this.error}</h3>`
    }

    renderPreview() {

        this.watch = this.father.watch;

        if (this.mode === 'mobile') {

            this.classList.remove('desktop');
            this.classList.add('mobile');
            return html` 
                
                <div class="groupSetMobile">
                    <div>
                        <label>${this.msg.width}:</label>
                        <input type="number" value="300" @input="${this.changeWidthP}">
                    </div>
                    <div>
                        <label>${this.msg.height}:</label>
                        <input type="number" value="700" @input="${this.changeHeightP}">
                    </div>
                    </div> 
                <div class="phone" style="width:${this.widthP}px; height:${this.heightP}px">
                    <div class="phone_mic"></div>
                    <div class="phone_screen">
                        <iframe style="width:100%; height:100%; border:none; display:none"  src="/_100554_servicePreview" @load="${this.load}" ></iframe>
                    </div>
                    <div class="phone_button"></div>
                </div>
                
            `

        } else {

            this.classList.add('desktop');
            this.classList.remove('mobile');

            return html`
            <iframe
                style="width:100%; height:100%; border:none; display:none" src="/_100554_servicePreview"
                @load="${this.load}" >
            
            </iframe>`;

        }
    }

    updated(changedProperties: any) {
        super.updated(changedProperties);
        if (changedProperties.has('level')) {
            const oldLevel = changedProperties.get('level');
            if (!oldLevel) return;
            this.fireChangeICA();
        }
    }

    //-------- IMPLEMENTS---------

    private onWidgetActionEvents(ev: mls.events.IEvent) {
        if (ev.level.toString() !== this.level) return;
        if (!ev.desc) return;
        const json = JSON.parse(ev.desc);
        if (json.op !== 'SelectWidget') return;
        this.selectIdinPreview(json.id, json.origin);
    }

    private selectIdinPreview(id: string, origin: 'editor' | 'preview'): void {

        if (!id) return;
        const iframe = this.querySelector('iframe');
        if (!iframe || !iframe.contentDocument) return;

        if (origin !== 'editor') return;

        const el = this.findElementsStartingWithIca(id) as HTMLElement;
        if (!el) return;

        const ev = new CustomEvent('click', {
            detail: {
                origin,
            }
        });

        const ov = (el as any).overlayRef;
        if (!ov) return;
        ov.dispatchEvent(ev);

    }

    private findElementsStartingWithIca(id: string): Element | undefined {

        if (!id) return undefined;
        const iframe = this.querySelector('iframe');
        if (!iframe || !iframe.contentDocument) return undefined;
        const doc = iframe.contentDocument;
        let elements: Element[] = [];

        function traverseShadowRoot(element: Element) {
            if (element.tagName.toLowerCase().startsWith('ica')) {
                elements.push(element);
                return;
            }

            if (element.shadowRoot) {
                element.shadowRoot.querySelectorAll('*').forEach((item) => {
                    traverseShadowRoot(item);
                })
            } else {
                const children = Array.from(element.children);
                if (children.length > 0) {
                    children.forEach(child => traverseShadowRoot(child));
                }
            }
        }

        doc.body.querySelectorAll('*').forEach((item) => {
            traverseShadowRoot(item);
        });

        const newId = `ica_${id}`;
        const ret = elements.find((el) => el.id === newId);
        return ret as HTMLElement;
    }

    private fireChangeICA(): void {
        const iframe = this.querySelector('iframe') as HTMLIFrameElement;
        if (!iframe || !iframe.contentDocument) return;
        this.changeLevelIca(iframe.contentDocument.body);
    }

    private changeLevelIca(el: HTMLElement): void {

        const isPage = (el as any).isPage
        let tagEl = el.tagName.toLowerCase();
        if (tagEl.startsWith('ica-') || isPage) {
            el.setAttribute('level', this.level);
        }

        for (const i of el.children) {
            this.changeLevelIca(i as HTMLElement);
        }
    }

    private async addStyles() {

        if (!this.models || !this.models.style || !window.preview.iframe || !window.preview.iframe.contentDocument || !window.preview.iframe.contentWindow) return;
        const { project, shortName } = this.models.style.storFile;
        const id = convertFileNameToTag(`_${project}_${shortName}`);
        const oldStyle = window.preview.iframe.contentDocument.head.querySelector(`style[id=${id}]`);
        const newStyle = document.createElement('style');
        const newLess = await compileStyleUsingStorFile(shortName, project, this.actualtheme);
        if (newLess) {
            newStyle.id = id;
            newStyle.textContent = newLess;
            window.preview.iframe.contentDocument.head.appendChild(newStyle);
            if (oldStyle) oldStyle.remove();
        }
        const tokens = await getTokens({ project, shortName }, this.actualtheme)
        this.mountTokens(tokens || '');
        this.stylechanged = 'false';

    }

    private load(): void {

        this.showLoader(true);
        const iframe = this.querySelector('iframe') as HTMLIFrameElement;
        const head = iframe.contentDocument?.querySelector('head');
        if (head) {
            const base = document.createElement('base');
            base.href = document.baseURI;
            head.appendChild(base);
        }
        this.init(iframe);
        window.preview.iframe = iframe;
        const collabConsole = this.parentElement?.querySelector('collab-console-100554') as HTMLElement;
        (collabConsole as any).scope = iframe.contentWindow;

    }

    private async init(iframe: HTMLIFrameElement) {

        try {
            this.setDevice(iframe);
            this.setTheme(iframe);
            this.setMyFile();

            if (!this.models
                || this.models.ts?.storFile.hasError
                || this.models.style?.storFile.hasError
                || this.models.html?.storFile.hasError) {

                this.error = this.msg.errorCompile;
                this.showLoader(false);
                this.renderError();
                return;
            }

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

            this.showLoader(false);
            this.dispatchEvent(new CustomEvent('preview-loaded', {
                detail: { shortName: this.models.ts?.storFile.shortName, project: this.models.ts?.storFile.project },
                bubbles: true,
                composed: true,
            }));

        } catch (e: any) {
            this.error = e.message;
            this.showLoader(false);
        }
    }

    private setTheme(iframe: HTMLIFrameElement) {
        const isLight = this.father.light;
        const html = iframe.contentDocument?.querySelector('html');
        const meta = iframe.contentDocument?.querySelector('meta[name="color-scheme"]');
        if (!isLight && html) {
            html.setAttribute('data-theme', 'dark');
        }
        if (meta) meta.remove();
    }

    private setDevice(iframe: HTMLIFrameElement) {
        if (iframe.contentDocument) iframe.contentDocument.documentElement.setAttribute('data-device', this.mode);
    }

    private setMyFile(): void {

        if (!this.page || this.page === '') throw new Error(this.msg.pageNotDefined);
        mls.actual[0].setFullName(this.page);
        const info = mls.actual[0];

        const key = mls.stor.getKeyToFiles(
            info.project as number,
            2,
            info.path as string,
            '',
            '.html'
        );

        const mkey = mls.l2.getKey({
            project: info.project as number,
            shortName: info.path as string,
        });

        if (!mls.stor.files[key]) throw new Error(this.msg.notFoundStorfile + ': ' + key);
        if (!mls.editor.models[mkey]) throw new Error(this.msg.notFoundStorfile + ' mfile: ' + mkey);

        this.file = mls.stor.files[key];
        this.models = mls.editor.models[mkey];
    }

    private lastHTML: string = '';

    private isService: boolean = false;

    private checkIfIsService(): boolean {
        if (!this.file || !this.models || !this.models.ts) return false;
        const txt = this.models.ts.model.getValue();
        if (txt.indexOf('extends ServiceBase') === -1) return false;
        return true;

    }
    private async setHTml(iframe: HTMLIFrameElement) {

        if (!iframe.contentDocument || !this.models) return;
        let txt = await this.getFileContent();
        this.isService = this.checkIfIsService()
        this.lastHTML = txt;

        (iframe.contentDocument.body as any)['service'] = this.father;

        let ret;
        if (this.isService && this.file) {
            const tag = convertFileNameToTag(`_${this.file.project}_${this.file.shortName}`);
        }

        iframe.contentDocument.body.innerHTML = txt;
        ret = await getDependenciesByHtml(this.models, txt, this.actualtheme, true);

        if (ret.errors.length > 0) {
            this.father.setError(`Error(${ret.errors.length}) when compiling:${ret.errors[0].error}`);
            console.log('Errors in compile:', JSON.stringify(ret.errors));
        }

        this.mountJSImporMap(ret, iframe);
        this.mountJS(ret, iframe);
        this.mountCSS(iframe);
        this.mountTokens(ret.tokens || '');

    }

    private async getFileContent(): Promise<string> {

        let txt = '<h3>' + this.msg.configure + '</h3>';
        if (this.file && this.file.getValueInfo) txt = (await this.file.getValueInfo()).content as string;
        if (this.file && txt === null) txt = await this.file.getContent() as string;
        return txt;

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

                window['previewL1'] = window['previewL1']  ? window['previewL1']  : parent.previewL1 ? parent.previewL1 : top['previewL1'];

                window['preview'] = window['preview']  ? window['preview']  : parent.preview ? parent.preview : top['preview'];
				`;
            ifr.contentDocument?.body.appendChild(s);

            loadScripts(info.importsJs)
                .then(() => {
                    this.simulateService(info, ifr)
                })

        } catch (e: any) {
            console.info('Error mountJS: ' + e.message);
        }

    }

    private async simulateService(info: IJSONDependence, ifr: HTMLIFrameElement) {

        if (!ifr || !ifr.contentDocument || !ifr.contentWindow) return;
        if (this.isService) {
            this.addFA(ifr);
            this.addTooltip(ifr);
            this.addStyleMls(ifr);
            this.addNav3(ifr);
        }
    }

    private addStyleMls(ifr: HTMLIFrameElement) {
        const styleMls = document.querySelector('style#mls-style');
        if (!styleMls || !ifr || !ifr.contentDocument || !ifr.contentWindow) return;
        const newStyle = styleMls.cloneNode(true);
        ifr.contentDocument.head.appendChild(newStyle);
    }

    private addTooltip(ifr: HTMLIFrameElement) {
        if (!ifr || !ifr.contentDocument || !ifr.contentWindow) return;
        if (!ifr.contentWindow.customElements.get('collab-tooltip')) {
            ifr.contentWindow.customElements.define('collab-tooltip', (window as any)['l4_html'].MlsTooltip);
        }
        ifr.contentWindow.customElements.whenDefined('collab-tooltip').then(() => {
            if (!ifr.contentDocument) return;
            const collaTbTooltip = document.createElement('collab-tooltip');
            ifr.contentDocument.body.appendChild(collaTbTooltip);
        });
    }

    private waitForComponents(context: Window, componentNames: string[]) {
        const promises = componentNames.map(name =>
            context.customElements.whenDefined(name)
        );
        return Promise.all(promises);
    }

    private addNav3(ifr: HTMLIFrameElement) {

        const wcToAdd = [
            { name: '_100529_collab_nav_3', tag: 'collab-nav-3' },
            { name: '_100529_collabNav3Menu', tag: 'collab-nav-3-menu' },
            { name: '_100529_collab_nav_3_tools_link', tag: 'collab-nav-3-menu-tools-link' },
            { name: '_100529_collab_nav_3_tools_cycle', tag: 'collab-nav-3-menu-tools-cycle' },
            { name: '_100529_collab_nav_3_tools_dropdown', tag: 'collab-nav-3-menu-tools-dropdown' },
        ]

        if (!ifr || !ifr.contentDocument || !ifr.contentWindow) return;
        wcToAdd.forEach((wc) => {
            if (!ifr || !ifr.contentDocument || !ifr.contentWindow) return;
            if (!ifr.contentWindow.customElements.get(wc.tag)) ifr.contentWindow.customElements.define(wc.tag, (window as any)['l4_html'][wc.name]);
        });

        const allTags = wcToAdd.map((item) => item.tag);
        this.waitForComponents(ifr.contentWindow, allTags).then(async () => {

            if (!ifr.contentDocument || !this.file) return;

            const dataService = `_${this.file?.project}_${this.file?.shortName}`
            const tag = convertFileNameToTag(`_${this.file.project}_${this.file.shortName}`);
            const old = ifr.contentDocument.querySelector(tag);
            if (!old) return;
            await import(`./_${this.file.project}_${this.file.shortName}`);

            const instance = old.cloneNode() as ServiceBase;
            const lvl = instance.getAttribute('level') || '2';
            old?.remove();
            const collabNav = document.createElement('collab-nav-3');
            collabNav.setAttribute('toolbarposition', instance.position || 'right');
            collabNav.setAttribute('data-service', dataService);

            collabNav.setAttribute('level', lvl);
            instance.setAttribute('level', lvl);

            const collabNavService = document.createElement('collab-nav-3-service');
            collabNavService.setAttribute('data-service', dataService);
            collabNavService.className = 'active';

            collabNav.style.position = 'relative';
            collabNav.style.width = '100%';
            collabNav.style.display = 'block';

            (collabNavService as any).mlsWidget = instance;
            const mlsnav3 = document.createElement('collab-nav-3-menu');
            mlsnav3.setAttribute('is-mls2', 'true');
            mlsnav3.setAttribute('toolbarposition', instance.position || 'right');

            collabNav.appendChild(collabNavService);
            collabNavService.appendChild(mlsnav3);

            ifr.contentDocument.body.appendChild(collabNav);
            mlsnav3.after(instance);

        });

    }

    private addFA(ifr: HTMLIFrameElement) {
        if (!ifr || !ifr.contentDocument || !ifr.contentWindow) return;
        const styleFA = document.createElement('link');
        styleFA.rel = 'stylesheet';
        styleFA.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css';
        styleFA.type = 'text/css';
        ifr.contentDocument.head.appendChild(styleFA);
    }

    private removeOlderTokens(ifr: HTMLIFrameElement) {
        const id = this.getIdTokens();
        if (!ifr.contentDocument || !id) return;
        const st = ifr.contentDocument.head.querySelectorAll(`#${id}`);
        st.forEach((s) => s.remove());
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

    private getIdTokens() {
        if (!this.models || !this.models.ts) return 'ds_tokens';
        const { project } = this.models.ts.storFile
        return '_' + project + '_ds_tokens';
    }

    private mountTokens(tokens: string): void {
        try {
            const iframe = window.preview.iframe;
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
    private changeWidthP(e: InputEvent): void {
        const el = e.target as HTMLInputElement;
        if (!el) return;
        if (el.value === '' || +el.value < 200) return;
        this.widthP = el.value;
    }

    private changeHeightP(e: InputEvent): void {
        const el = e.target as HTMLInputElement;
        if (!el) return;
        if (el.value === '' || +el.value < 250) return;
        this.heightP = el.value;
    }

    private timeShow = -1;
    private showLoader(show: boolean) {
        clearTimeout(this.timeShow);

        this.timeShow = setTimeout(() => {
            if (!this.father) return;
            this.father.loading = show;
        }, 200);
    }

    public cleanTree(): string {

        let ret = '';
        const iframe = this.querySelector('iframe');
        if (!iframe) return '';
        const div = document.createElement('div');
        const divRet = document.createElement('div');
        const body = iframe.contentDocument?.body
        if (!body) return ret;
        this.cleanTree2(div, body as HTMLElement);
        this.cleanTree3(divRet, div);
        return divRet.innerHTML;

    }

    private cleanTree2(father: HTMLElement, element: HTMLElement): HTMLElement {

        const tagname = element.tagName.toLowerCase();
        if (tagname.startsWith('ica-')) {
            let children = [...element.children];
            for (const child of children) {
                this.cleanTree2(father, child as HTMLElement);
            }

        } else {
            const clone = element.cloneNode(false);
            father.appendChild(clone);
            let children = [];

            if (element.shadowRoot) {
                children = [...element.shadowRoot.children]
            } else {
                children = [...element.children]
            }

            for (const child of children) {
                this.cleanTree2(clone as HTMLElement, child as HTMLElement);
            }

        }

        return father;
    }

    private cleanTree3(father: HTMLElement, element: HTMLElement) {

        let children = [...element.children];

        for (const child of children) {
            const tagname = child.tagName.toLowerCase();
            if (tagname.indexOf('-') > 0) {
                const clone = child.cloneNode(false);
                father.appendChild(clone);
                this.cleanTree3(clone as HTMLElement, child as HTMLElement);
            } else {
                this.cleanTree3(father, child as HTMLElement);
            }
        }

    }

}
