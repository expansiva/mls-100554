/// <mls shortName="servicePreviewView" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement, unsafeHTML } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getDependenciesByHtml, IJSONDependence } from './_100554_libCompile';
import { convertFileNameToTag } from './_100554_utilsLit';
import { getDSInstance, DesignSystemIO } from './_100554_libDesignSystem';

export const initServicePreviewView = '';

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
export class ServicePreviewView extends LitElement {

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

    //-----------EVENTS-----------------

    private setEventsCollab(): void {
        mls.events.addListener(2, 'WidgetAction', this.onWidgetActionEvents.bind(this));
    }

    //---------COMPONENTS---------------


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
            this.style.cssText = `
                width:100%;
                height:100vh;
                min-height:700px;
                display: flex!important;
                flex-direction: column;
                align-items: center;
                padding-top:.5rem;
            `;
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

            this.style.cssText = `
                display: block;
                width: 100%;
                height: 100%;
            `;
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

        if (!id || !this.shadowRoot) return;
        const iframe = this.shadowRoot.querySelector('iframe');
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

        if (!id || !this.shadowRoot) return undefined;
        const iframe = this.shadowRoot.querySelector('iframe');

        if (!iframe || !iframe.contentDocument) return undefined;

        const doc = iframe.contentDocument;

        let elements: Element[] = [];
        // Function to traverse shadow DOM
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
        if (!this.shadowRoot) return;
        const iframe = this.shadowRoot.querySelector('iframe') as HTMLIFrameElement;
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

    private async addStyles() { // Nao utilizado mais

        // if (!this.models || !this.models.ts) return;
        // const { project, shortName } = this.models.ts.storFile;
        // let txt = await this.getFileContent();
        // const ret = await getDependenciesByHtml(this.models, txt, this.actualtheme, true);
        // const iframe = this.shadowRoot?.querySelector('iframe');
        // if (!iframe) return;
        // this.mountCSS(ret, iframe);
        // this.mountTokens(ret, iframe);

        // const tag = convertFileNameToTag(`_${project}_${shortName}`);
        // const el = iframe.contentDocument?.body.querySelector(tag);
        // if (!el) return;
        // const css = ret.css.join(' \n');
        // const enhacement = await this.getEnhacement();
        // if (!enhacement) return;
        // (enhacement as any).setStylesProcessed(css, el, tag);

    }

    // private async getEnhacement() {
    //     if (!this.mfile) return;
    //     const enhacementName = (this.mfile.compilerResults as any).tripleSlashMLS.variables.enhancement;
    //     if (!enhacementName) throw new Error('enhacementName not valid');
    //     const mModule = await mls.l2.enhancement.getEnhancementInstance(this.mfile);
    //     return mModule;
    // }

    private load(): void {
        this.showLoader(true);
        if (!this.shadowRoot) return;
        const iframe = this.shadowRoot.querySelector('iframe') as HTMLIFrameElement;
        const head = iframe.contentDocument?.querySelector('head');
        if (head) {
            const base = document.createElement('base');
            base.href = document.baseURI;
            head.appendChild(base);
        }
        this.init(iframe);
        window.preview.iframe = iframe;
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
            if (html) html.lang = this.lang;
            if (iframe.contentDocument) iframe.contentDocument.body.style.paddingTop = '55px';

            this.showLoader(false);
        } catch (e: any) {
            this.error = e.message;
            this.showLoader(false);
        }
    }

    private setTheme(iframe: HTMLIFrameElement) {
        const isLight = this.father.light;
        const html = iframe.contentDocument?.querySelector('html');
        if (!isLight && html) {
            html.setAttribute('data-theme', 'dark');
        }
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
    private async setHTml(iframe: HTMLIFrameElement) {

        if (!iframe.contentDocument || !this.models) return;
        let txt = await this.getFileContent();

        if (this.lastHTML === txt) {
            const h = this.lastCompiledUrl;
            this.lastCompiledUrl = h;
            return;
        }

        this.lastHTML = txt;
        iframe.contentDocument.body.innerHTML = txt;
        iframe.contentDocument.body.style.paddingTop = '10px';
        (iframe.contentDocument.body as any)['service'] = this.father;

        const ret = await getDependenciesByHtml(this.models, txt, this.actualtheme, true);
        this.mountJSImporMap(ret, iframe);
        this.mountJS(ret, iframe);
        this.mountCSS(iframe);
        this.mountTokens(ret, iframe);

    }

    private async getFileContent(): Promise<string> {
        let txt = '<h3>' + this.msg.configure + '</h3>';

        if (this.file && this.file.getValueInfo)
            txt = (await this.file.getValueInfo()).content as string;

        if (this.file && txt === null)
            txt = await this.file.getContent() as string;

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

                function setScrool(){
            
                    const scrollY = localStorage.getItem('servicePreviewScrool');
                    if(!scrollY) return;
                    localStorage.setItem('servicePreviewScrool', '');
                    setTimeout(()=>{window.scrollTo(0, scrollY);},500);
                }
                setScrool();
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
        if (this.file && this.models && this.models.ts) {

            const txt = this.models.ts.model.getValue();
            if (txt.indexOf('extends ServiceBase') === -1) return;
            const tag = convertFileNameToTag(`_${this.file.project}_${this.file.shortName}`);
            const instance = ifr.contentDocument.body.querySelector(tag);

            if (instance) {
                this.addFA(ifr);
                this.addTooltip(ifr);
                this.addNav3(ifr, instance);
            }
        }
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

    private addNav3(ifr: HTMLIFrameElement, instance: Element) {
        if (!ifr || !ifr.contentDocument || !ifr.contentWindow) return;
        if (!ifr.contentWindow.customElements.get('mls-nav3-100529')) {
            ifr.contentWindow.customElements.define('mls-nav3-100529', (window as any)['l4_html']._100529_mls_nav3);
        }
        ifr.contentWindow.customElements.whenDefined('mls-nav3-100529').then(() => {
            if (!ifr.contentDocument) return;
            const collabNav = document.createElement('collab-nav');
            collabNav.style.position = 'relative';
            collabNav.style.width = '100%';
            collabNav.style.display = 'block';

            (collabNav as any)['mlsWidget'] = instance;
            const mlsnav3 = document.createElement('mls-nav3-100529');
            mlsnav3.setAttribute('is-mls2', 'true');
            collabNav.appendChild(mlsnav3);
            ifr.contentDocument.body.insertBefore(collabNav, instance);
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

    private removeOlderStyle(ifr: HTMLIFrameElement) {
        const id = this.getIdStyle();
        if (!ifr.contentDocument || !id) return;
        const st = ifr.contentDocument.body.querySelectorAll(`#${id}`);
        st.forEach((s) => s.remove());
    }

    private removeOlderTokens(ifr: HTMLIFrameElement) {
        const id = this.getIdTokens();
        if (!ifr.contentDocument || !id) return;
        const st = ifr.contentDocument.body.querySelectorAll(`#${id}`);
        st.forEach((s) => s.remove());
    }

    private removeOlderGlobalStyle(ifr: HTMLIFrameElement) {
        if (!ifr.contentDocument) return;
        const st = ifr.contentDocument.body.querySelector(`#css_global`);
        if (st) st.remove()
    }

    private mountCSS(ifr: HTMLIFrameElement): void {
        try {
            if (!ifr.contentDocument) return;
            let cls = '';
            if (this.mode === 'mobile') cls = this.scrollMobile;
            const style = document.createElement('style');
            style.textContent = ' \n' + cls;
            ifr.contentDocument.body.className = 'scroll-custom';
            ifr.contentDocument.body.style.width = '98%';
            ifr.contentDocument.body.appendChild(style);
        } catch (e: any) {
            console.info('Error mountCSS: ' + e.message);
        }
    }

    private getIdStyle() {
        if (!this.models || !this.models.ts) return '';
        const { project, shortName } = this.models.ts.storFile
        return '_' + project + '_' + shortName;
    }

    private getIdTokens() {
        if (!this.models || !this.models.ts) return 'ds_tokens';
        const { project } = this.models.ts.storFile
        return '_' + project + '_ds_tokens';
    }

    private mountTokens(info: IJSONDependence, ifr: HTMLIFrameElement): void {
        try {
            if (!ifr.contentDocument) return;
            this.removeOlderTokens(ifr);
            const css = info.tokens[0];
            const style = document.createElement('style');
            style.textContent = css;
            style.id = this.getIdTokens();
            ifr.contentDocument.body.appendChild(style);

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
        const iframe = this.shadowRoot?.querySelector('iframe');
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


    static styles = css`
        :host{
            position:relative;
        }

        .watchDesktop{
            position: absolute;
            background: white;
            box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 2px 2px;
            top: 3px;
            right: 46px;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        }

        .groupSetMobile{
            display:flex;
            width:300px;
            gap:.8rem;
            justify-content: center;
            align-items: center;
            margin-bottom:1rem;
        }

        .groupSetMobile div{
            display:flex;
            flex-direction: column;
            
        }

        .groupSetMobile label{
            font-size:.8rem;
            font-weight:bold;
        }

        .groupSetMobile input{
            border:1px solid #cac7c7;
            outline:none;
            width:100px;
            height:20px;
            border-radius:5px;
        }

        .phone {
            z-index: 1;
            padding: 0 0.5rem;
            border: 0.25rem solid #404040;
            border-radius: 1rem;
            display: flex;
            flex-direction: column;
            //box-shadow: 0.5rem 0.5rem rgba(0, 0, 0, 0.3);
            box-shadow:0px 5px 3px 3px rgba(0, 0, 0, 0.3);
            background:white;
        }

        .phone_mic {
            height: 0.25rem;
            width: 4rem;
            margin: 1rem auto;
            border-radius: 999rem;
            background-color: #505050;
        }

        .phone_screen {
            position: relative;
            flex: 1 0 auto;
            border: 1px solid #505050;
            border-radius:5px;
        }

        .phone_screen iframe{
            border-radius:5px;
        }
        
        .phone_button {
            width: 1.5rem;
            height: 1.5rem;
            border: 2px solid #505050;
            border-radius: 50%;
            margin: 1rem auto;
        }
    
    `;

    private scrollMobile = `
        .scroll-custom::-webkit-scrollbar {
            width: 5px;
        }
        .scroll-custom::-webkit-scrollbar-track {
            background: #ddd;
        }
        .scroll-custom::-webkit-scrollbar-thumb {
            background: #666;
        }
        .scroll-custom::scrollbar {
            width: 2px;
        }
        .scroll-custom::scrollbar-track {
            background: #ddd;
        }
        .scroll-custom::scrollbar-thumb {
            background: #666;
        };
    `
}

interface IInfoDesignSystem {
    project: number,
    level: number,
    ds: DesignSystemIO
}