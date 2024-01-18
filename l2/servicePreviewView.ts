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

    @property() lastCompiledUrl: string = '';

    connectedCallback() {
        super.connectedCallback();
        this.init();
    }

    render() {

        if (this.error !== '') return this.renderError();
        else return this.renderPreview();

    }

    renderError() {
        return html`<h3 style="color:red">${this.error}</h3>`
    }

    renderPreview() {
        return html`<iframe style="width:100%; height:100%; border:none" src="${this.lastCompiledUrl}"></iframe>`;
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
    private myFileBlob: Blob | undefined = undefined;

    private async setHtml() {

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
        const ret = await getDepedencesByHTML(txt, true);
        const jsonMap = this.mountJSImporMap(ret);
        const scriptJs = await this.mountJS(ret);
        const css = this.mountCSS(ret); 
 
        const src = `
                <head>
                    <script type="importmap">
                        ${jsonMap}
                        
                    </script>
                    ${css}
                </head>
                <body>
                    ${txt}
                    ${scriptJs}
                    
                </body>
        `;

        if (this.myFileBlob) URL.revokeObjectURL(this.lastCompiledUrl);
        this.myFileBlob = new Blob([src], { type: 'text/html' });
        this.lastCompiledUrl = URL.createObjectURL(this.myFileBlob);

    }


    private mountJSImporMap(info: IJSONDEpendence): string {

        try {

            if (info.importsMap.length <= 0) return '';

            const js = '{"imports": { ' + info.importsMap.join(',\n') + '} }';
            return js;

        } catch (e: any) {

            console.info('Error mountJSImporMap: ' + e.message);
            return '';

        }

    }

    private async mountJS(info: IJSONDEpendence) {

        try {

            if (info.importsJs.length <= 0) return '';

            let ret = '';

            for await (const s of info.importsJs) {

                ret = ` ${ret}
                    <script type="module" id="${s.replace('/', '')}">
                        ${await this.getScript(s)}
                    </script>
                `
            } 


            return ret;

        } catch (e: any) {

            console.info('Error mountJS: ' + e.message);
            return '';


        }

    }

    private async getScript(url: string) {

        try {

            const ret = await fetch(url);
            return await ret.text();
            
        } catch (e: any) {
            return e.message;
        }
        
    }

    

    private mountCSS(info: IJSONDEpendence) : string {

        try {

            if (info.css.length <= 0) return '';
            const css = info.css.join(' \n');
            return `
                <style>
                    ${css}
                </style>
            `

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
