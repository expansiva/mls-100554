/// <mls shortName="servicePreviewView" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, unsafeHTML } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getDependenciesByHtml, getDependenciesByHtmlFile, getTokens, IJSONDependence } from './_100554_libCompile';
import { convertFileNameToTag } from './_100554_utilsLit';
import { createAllModels } from './_100554_collabLibModel';

import { compileStyleUsingStorFile } from './_100554_enhancementStyle';
import { StateLitElement } from './_100554_stateLitElement';
import { PreviewModeSinglePage } from './_100554_previewModeSinglePage';
import { PreviewModeMinimum } from './_100554_previewModeMinimum';

/// **collab_i18n_start**
const message_pt = {
    pageNotDefined: 'Página não definida',
    notFoundStorfile: 'Arquivo não encontrado',
    errorCompile: 'Erro ao compilar',
    configure: 'Configure seu HTML pela opção do editor!',
    width: 'Largura',
    height: 'Altura',
    msgSecurity: `<div>
  <h2>🛡️ Modo de Segurança</h2>
  <p>Atualmente, você está em <strong>modo de segurança</strong>. Isso significa que o seu código não foi carregado por precaução.</p>
  <p>Assim que você fizer sua primeira edição, o sistema sairá automaticamente desse modo e o código será carregado normalmente.</p>
</div>`
}

const message_en = {
    pageNotDefined: 'Page not defined',
    notFoundStorfile: 'Not found storfile',
    errorCompile: 'Error on compiling',
    configure: 'Configure your html by editor option!',
    width: 'Width',
    height: 'Height',
    msgSecurity: `<div>
<h2>🛡️ Safe Mode</h2>
<p>You are currently in <strong>safe mode</strong>. This means that your code has not been loaded as a precaution.</p>
<p>As soon as you make your first edit, the system will automatically exit this mode and the code will load normally.</p>
</div>`
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**


@customElement('service-preview-view-100554')
export class ServicePreviewView extends StateLitElement {

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
        return html`<div class="error">${unsafeHTML(this.error)}</div>`
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

        //if (!this.models || !this.models.style || !window.preview.iframe || !window.preview.iframe.contentDocument || !window.preview.iframe.contentWindow) return;
        //const { project, shortName, folder } = this.models.style.storFile;
        if (!this.file || !window.preview.iframe || !window.preview.iframe.contentDocument || !window.preview.iframe.contentWindow) return;
        const { project, shortName, folder } = this.file;
        const id = convertFileNameToTag({ project, shortName, folder });
        const oldStyle = window.preview.iframe.contentDocument.head.querySelector(`style[id=${id}]`);
        const newStyle = document.createElement('style');
        const newLess = await compileStyleUsingStorFile(shortName, project, this.actualtheme);
        if (newLess) {
            newStyle.id = id;
            newStyle.textContent = newLess;
            window.preview.iframe.contentDocument.head.appendChild(newStyle);
            if (oldStyle) oldStyle.remove();
        }
        const tokens = await getTokens({ project, shortName, folder }, this.actualtheme)
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
            this.father.setError('');
            this.setDevice(iframe);
            this.setTheme(iframe);
            await this.setMyFile();

            if (this.models &&
                (

                    this.models.ts?.storFile.hasError ||
                    this.models.style?.storFile.hasError ||
                    this.models.html?.storFile.hasError
                )
            ) {

                const trace = this.models?.ts?.compilerResults?.errors.map((err) => err.messageText).join('\n - ');
                const traceStyle = this.models?.style?.styleResults?.errors.map((err) => err.messageText).join('\n - ');
                this.error = this.msg.errorCompile + '\n' + `<div class="error-list"> ${trace ? `<b>TYPESCRIPT</b> <br> - ${trace}` : ''} <br><br> ${traceStyle ? `<b>LESS</b> <br> - ${traceStyle}` : ''} </div>`;

                this.showLoader(false);
                this.renderError();
                return;
            }

            if (!this.file) {
                this.error = this.msg.errorCompile + '\n' + `<div class="error-list"> - Not Found storFile </div>`;

                this.showLoader(false);
                this.renderError();
                return;
            }

            if ((window as any).securityMode) {

                (iframe as any).contentDocument.body.innerHTML = this.msg.msgSecurity;
                iframe.style.display = '';
                (window as any).securityMode = false;
                this.showLoader(false);
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
                const base = document.createElement('base') as HTMLBaseElement;
                base.href = 'https://collab.codes/';
                iframe.contentDocument.head.insertBefore(base, iframe.contentDocument.head.firstChild);
            }

            if (iframe.contentDocument) {
                // iframe.contentDocument.body.style.padding = '35px';
                // iframe.contentDocument.body.style.height = 'calc(100% - 70px)';
                // iframe.contentDocument.body.style.width = 'calc(100% - 70px)';
                iframe.contentDocument.body.style.overflowY = 'auto';
                iframe.contentDocument.body.style.overflowX = 'hidden';
                iframe.contentDocument.body.style.margin = '0';
                iframe.contentDocument.body.style.height = '100%';
                iframe.contentDocument.body.style.width = '100%';
                iframe.contentDocument.body.style.background = 'var(--bg-primary-color)';
                iframe.contentDocument.body.style.color = 'var(--text-primary-color)';

            }

            this.showLoader(false);
            this.dispatchEvent(new CustomEvent('preview-loaded', {
                detail: { shortName: this.file.shortName, project: this.file.project },
                bubbles: true,
                composed: true,
            }));

            /*if (this.file && (window as any).lastTesting !== this.file.shortName) {
                (window as any).lastTesting = this.file.shortName;
                this.fireTesting();
            }*/


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

    private async setMyFile() {

        if (!this.page || this.page === '') throw new Error(this.msg.pageNotDefined);

        const info = mls.l2.getPath(this.page);


        const key = mls.stor.getKeyToFiles(
            info.project as number,
            2,
            info.shortName as string,
            info.folder,
            '.html'
        );

        const file = mls.stor.files[key];

        const mkey = mls.editor.getKeyModel(info.project as number, info.shortName as string, file.folder);

        if (!mls.stor.files[key]) throw new Error(this.msg.notFoundStorfile + ': ' + key);

        if (!mls.editor.models[mkey] && mls.actualLevel !== 7) {
            await createAllModels(file);
        }

        if (!mls.editor.models[mkey] && mls.actualLevel !== 7) throw new Error(this.msg.notFoundStorfile + ': ' + mkey);
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

        if (!iframe.contentDocument || !this.file) return;
        let txt = await this.getFileContent();
        this.isService = this.checkIfIsService()
        this.lastHTML = txt;

        (iframe.contentDocument.body as any)['service'] = this.father;

        let ret;

        iframe.contentDocument.body.innerHTML = txt;
        //ret = await getDependenciesByHtml(this.models, txt, this.actualtheme, true);
        ret = await getDependenciesByHtmlFile(this.file, txt, this.actualtheme, true);


        const els = iframe.contentDocument.body.querySelectorAll('*');
        els.forEach((el) => el.setAttribute('mls_origin', 'true'));

        if (ret.errors.length > 0) {
            this.father.setError(`Error(${ret.errors.length}) when compiling:${ret.errors[0].error}`);
            console.log('Errors in compile:', JSON.stringify(ret.errors));
        }

        if (!(mls as any).modePreview) (mls as any).modePreview = 'singlePage';

        switch ((mls as any).modePreview) {
            case 'minimum': this.modeMinimum(ret, iframe); break;
            case 'singlePage': this.modeSinglePage(ret, iframe); break;
            default: this.modeMinimum(ret, iframe); break;
        }

    }

    private async getFileContent(): Promise<string> {

        let txt = '<h3>' + this.msg.configure + '</h3>';
        if (this.file && this.file.getValueInfo) txt = (await this.file.getValueInfo()).content as string;
        if (this.file && txt === null) txt = await this.file.getContent() as string;
        return txt;

    }

    private async modeSinglePage(json: IJSONDependence, iframe: HTMLIFrameElement) {
        if (!this.file) return;
        const c = new PreviewModeSinglePage(json, iframe, this.level, this.isService, this.file, this.models);
        await c.init();
    }


    private async modeMinimum(json: IJSONDependence, iframe: HTMLIFrameElement) {

        if (!this.file) return;
        const c = new PreviewModeMinimum(json, iframe, this.level, this.isService, this.file, this.models);
        await c.init();
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

    private removeOlderTokens(ifr: HTMLIFrameElement) {
        const id = this.getIdTokens();
        if (!ifr.contentDocument || !id) return;
        const st = ifr.contentDocument.head.querySelectorAll(`#${id}`);
        st.forEach((s) => s.remove());
    }

    private getIdTokens() {
        if (!this.file) return 'ds_tokens';
        const { project } = this.file
        return '_' + project + '_ds_tokens';
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
            if (show === false) this.father.updateLoadingToFalseIfNoTasksRunning();
            else this.father.loading = show;
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


    private fireTesting() {
        if (!this.file) return;

        let info = this.getTesting()
        const s = this.file.shortName;
        info.push(s);
        info = [... new Set(info)];
        this.setTesting(info)
        console.info('salvou' + JSON.stringify(info));

        setTimeout(() => {

            info = this.getTesting();
            info = this.removerTesting(info, s);
            this.setTesting(info)
            console.info('removeu' + JSON.stringify(info));

        }, 20000)
    }

    private getTesting(): string[] {
        const sT = localStorage.getItem('iframeTesting') || '[]';
        let info = JSON.parse(sT);
        return info
    }

    private setTesting(info: string[]) {
        info = [... new Set(info)];
        localStorage.setItem('iframeTesting', JSON.stringify(info));
    }

    private removerTesting(array: string[], item: string): string[] {
        return array.filter(str => str !== item);
    }

}
