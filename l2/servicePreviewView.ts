/// <mls shortName="servicePreviewView" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement, unsafeHTML } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getDepedencesByHTML, IJSONDEpendence } from './_100554_libCompile';

export const initServicePreviewView = '';
@customElement('service-preview-view-100554')
export class ServicePreviewView extends LitElement {

    private file: mls.stor.IFileInfo | undefined = undefined;

    @property() father: any = undefined;

    @property() page: string = '';

    @property() level: string = '';

    @property() error: string = '';

    @property() lastCompiled: string = '';

    connectedCallback() {
        super.connectedCallback();
        this.init();
    }

    createRenderRoot() {
        return this;
    }


    render() {

        if (this.error !== '') return this.renderError();
        else return this.renderPreview();

    }

    renderError() {
        return html`<h3 style="color:red">${this.error}</h3>`
    }

    renderPreview() {
        return unsafeHTML(this.lastCompiled);
    }

    //-------- IMPLEMENTS---------

    private async init() {

        try {
            this.setMyFile();
            await this.setHtml();

        } catch (e: any) {

            this.error = e.message;
            this.showError(e.message);

        }

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

    private async setHtml() {

        let txt = '<h3>Configure your html by editor option!</h3>';

        if (this.file && this.file.getValueInfo)
            txt = (await this.file.getValueInfo()).content as string;

        if (this.file && txt === null)
            txt = await this.file.getContent() as string;

        if (this.lastHTML === txt) {
            const h = this.lastCompiled;
            this.lastCompiled = h;
            return;
        }

        this.lastHTML = txt;
        const ret = await getDepedencesByHTML(txt, true);
        this.mountJSImporMap(ret);
        this.mountCSS(ret);
        this.mountJS(ret);

        this.lastCompiled = txt;



    }


    private mountJSImporMap(info: IJSONDEpendence) {

        try {

            if (info.importsMap.length <= 0) return;

            const sc = document.head.querySelector('script[type=importmap]');
            if (sc) return;

            const js = '{"imports": { ' + info.importsMap.join(',\n') + '} }';

            const script = document.createElement('script');
            script.type = 'importmap';
            script.textContent = js;
            document.head.appendChild(script);

            return;


        } catch (e: any) {

            console.info('Error mountJSImporMap: ' + e.message);
            return '';

        }

    }

    private mountJS(info: IJSONDEpendence) {

        try {

            if (info.importsJs.length <= 0) return;

            info.importsJs.forEach((i) => {

                const script = document.createElement('script');
                script.type = 'module';
                script.id = i.replace('/', '');
                script.src = i;
                this.appendChild(script);

            });

        } catch (e: any) {

            console.info('Error mountJS: ' + e.message);
            return '';


        }

    }

    private mountCSS(info: IJSONDEpendence) {

        try {

            if (info.css.length <= 0) return '';

            const sc = document.head.querySelector('style[mystyle]');
            if (sc) return;

            const css = info.css.join(' \n');
            const style = document.createElement('style');
            style.textContent = css;
            style.setAttribute('mystyle', 'true');
            document.head.appendChild(style);
            return '';

        } catch (e: any) {

            console.info('Error mountCSS: ' + e.message);
            return '';

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
