/// <mls shortName="servicePreviewView" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement, unsafeHTML } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getDepedencesByHtml, IJSONDEpendence } from './_100554_libCompile';

export const initServicePreviewView = '';
@customElement('service-preview-view-100554')
export class ServicePreviewView extends LitElement {

    private file: mls.stor.IFileInfo | undefined = undefined;

    @property() father: any = undefined;

    @property() page: string = '';

    @property() level: string = '';

    @property() error: string = '';

    @property() lastCompiledUrl: string = '';

    connectedCallback() {
        super.connectedCallback();
    }

    render() {

        if (this.error !== '') return this.renderError();
        else return this.renderPreview();

    }

    renderError() {
        return html`<h3 style="color:red">${this.error}</h3>`
    }

    renderPreview() { 

        return html`<iframe style="width:100%; height:100vh; border:none; display:none" src="/_100554_servicePreview" @load="${this.load}" ></iframe>`;
    }

    //-------- IMPLEMENTS---------

    private load(): void {
        if (!this.shadowRoot) return;
        const iframe = this.shadowRoot.querySelector('iframe') as HTMLIFrameElement;
        this.init(iframe);
    }

    private async init(iframe: HTMLIFrameElement) {

        this.setMyFile();
        await this.setHTml(iframe);
        iframe.style.display = '';

    }

    private setMyFile(): void {

        if (!this.page || this.page === '') throw new Error(this.myMsg.pageNotDefined);


        mls.actual[0].setFullName(this.page);
        const info = mls.actual[0];

        const key = mls.stor.getKeyToFiles(
            info.project as number,
            2,
            info.path as string,
            '',
            '.html'
        );

        if (!mls.stor.files[key]) throw new Error(this.myMsg.notFoundStorfile + ': ' + key);

        this.file = mls.stor.files[key];


    }

    private lastHTML: string = '';
    private async setHTml(iframe: HTMLIFrameElement) {

        if (!iframe.contentDocument) return;

        let txt = '<h3>Configure your html by editor option!</h3>';

        if (this.file && this.file.getValueInfo)
            txt = (await this.file.getValueInfo()).content as string;

        if (this.file && txt === null)
            txt = await this.file.getContent() as string;

        if (this.lastHTML === txt) {
            const h = this.lastCompiledUrl;
            this.lastCompiledUrl = h;
            return;
        }

        this.lastHTML = txt;
        iframe.contentDocument.body.innerHTML = txt;

        const ret = await getDepedencesByHtml(txt, true);
        this.mountJSImporMap(ret, iframe);
        this.mountJS(ret, iframe);
        this.mountCSS(ret, iframe);


    }

    private mountJSImporMap(info: IJSONDEpendence, ifr: HTMLIFrameElement): void {

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

    private mountJS(info: IJSONDEpendence, ifr: HTMLIFrameElement): void {

        try {

            if (info.importsJs.length <= 0 || !ifr.contentDocument) return;

            info.importsJs.forEach((i) => {

                if (!ifr.contentDocument) return
                const script = document.createElement('script');
                script.type = 'module';
                script.id = i.replace('/', '');
                script.src = i;
                ifr.contentDocument.body.appendChild(script);

            });

            const s = document.createElement('script') as HTMLScriptElement;
				s.textContent = `
				window['mls'] = window['mls']  ? window['mls']  : parent.mls ? parent.mls : top['mls'];
				window['Quill'] = window['Quill']  ? window['Quill']  : parent.Quill ? parent.Quill : top['Quill'];
				window['monaco'] = window['monaco']  ? window['monaco']  : parent.monaco ? parent.monaco : top['monaco'];
				window['l2_html'] = window['l2_html']  ? window['l2_html']  : parent.l2_html ? parent.l2_html : top['l2_html'];
				window['l2_fieldTypes'] = window['l2_fieldTypes']  ? window['l2_fieldTypes']  : parent.l2_fieldTypes ? parent.l2_fieldTypes : top['l2_fieldTypes'];window['litDisableBundleWarning'] = true;


				`;
				ifr.contentDocument.body.appendChild(s);

        } catch (e: any) {

            console.info('Error mountJS: ' + e.message);


        }

    }

    private mountCSS(info: IJSONDEpendence, ifr: HTMLIFrameElement): void {

        try {

            if (info.css.length <= 0 || !ifr.contentDocument) return;
            const css = info.css.join(' \n');
            const style = document.createElement('style');
            style.textContent = css;
            ifr.contentDocument.head.appendChild(style);

        } catch (e: any) {

            console.info('Error mountCSS: ' + e.message);

        }

    }

    private showLoader(show: boolean) {

        if (!this.father) return;
        this.father.loader = show;

    }

    private showError(err: string) {

        if (!this.father) return;
        this.father.setError(err);

    }


    private myMsg = {
        pageNotDefined: 'Page not defined',
        notFoundStorfile: 'Not found storfile',
    }


}