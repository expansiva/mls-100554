/// <mls shortName="servicePreviewView" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement, unsafeHTML } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getDepedencesByHtml, IJSONDependence } from './_100554_libCompile';

export const initServicePreviewView = '';
@customElement('service-preview-view-100554')
export class ServicePreviewView extends LitElement {

    private file: mls.stor.IFileInfo | undefined = undefined;

    private mfile: mls.l2.editor.IMFile | undefined = undefined;

    @property() father: any ;

    @property() page: string = '';

    @property() mode: string = 'd';

    @property() level: string = '';

    @property() error: string = '';

    @property() lastCompiledUrl: string = '';

    @property() widthP: string = '300';
    @property() heightP: string = '600';


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
        if (this.mode === 'm') {
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
                        <label>Width:</label>
                        <input type="number" value="300" @input="${this.changeWidthP}">
                    </div>
                    <div>
                        <label>Height:</label>
                        <input type="number" value="700" @input="${this.changeHeightP}">
                    </div>
                    ${this.renderEditStyle()}
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
            return html`${this.renderEditStyle()}<iframe style="width:100%; height:100%; border:none; display:none" src="/_100554_servicePreview" @load="${this.load}" ></iframe>`;

        }
    }

    renderEditStyle() {

        if (!this.verifyWC()) return '';
        const cls = this.mode === 'm' ? 'editMobile' : 'editDesktop';
        return html`
            <edit-style class="${cls}" title="Edit styles" @click="${this.onStyleEditClick}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width:19px; height:19px"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M0 32C0 14.3 14.3 0 32 0H160c17.7 0 32 14.3 32 32V416c0 53-43 96-96 96s-96-43-96-96V32zM223.6 425.9c.3-3.3 .4-6.6 .4-9.9V154l75.4-75.4c12.5-12.5 32.8-12.5 45.3 0l90.5 90.5c12.5 12.5 12.5 32.8 0 45.3L223.6 425.9zM182.8 512l192-192H480c17.7 0 32 14.3 32 32V480c0 17.7-14.3 32-32 32H182.8zM128 64H64v64h64V64zM64 192v64h64V192H64zM96 440a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>
            </edit-style>        
        `
    }

    updated(changedProperties: any) {
        super.updated(changedProperties);
        if (changedProperties.has('level')) {
            const oldLevel = changedProperties.get('level');
            if (!oldLevel) return; 
            this.fireChangeFCA();
        }
    }

    static styles = css`
        :host{
            position:relative;
        }

        .editMobile{
            background: white;
            box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 2px 2px;
            top: 10px;
            right: 20px;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        }

        .editDesktop{
            background: white;
            box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 2px 2px;
            position: absolute;
            top: 10px;
            right: 20px;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        }

        edit-style:hover{
            box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 5px 2px;
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

    //-------- IMPLEMENTS---------

    private fireChangeFCA(): void {
        if (!this.shadowRoot) return;
        const iframe = this.shadowRoot.querySelector('iframe') as HTMLIFrameElement;
        if (!iframe || !iframe.contentDocument) return;
        this.changeLevelFca(iframe.contentDocument.body);
    }

    private changeLevelFca(el: HTMLElement): void{
        
        let tagEl = el.tagName.toLowerCase();
        if (tagEl.startsWith('fca-')) { 
            el.setAttribute('level', this.level);
        }

        for (const i of el.children) {

            this.changeLevelFca(i as HTMLElement);

        }
        
    }

    private load(): void {
        if (!this.shadowRoot) return;
        const iframe = this.shadowRoot.querySelector('iframe') as HTMLIFrameElement;
        this.init(iframe);
    }

    private async init(iframe: HTMLIFrameElement) {

        try {

            this.setMyFile();
            await this.setHTml(iframe);
            iframe.style.display = '';
            this.showLoader(false);

        } catch (e: any) {

            this.error = e.message;
            this.showLoader(false);

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

        const mkey = mls.l2.editor.getKey({
            project: info.project as number,
            shortName: info.path as string,
        }
        );

        if (!mls.stor.files[key]) throw new Error(this.myMsg.notFoundStorfile + ': ' + key);

        if (!mls.l2.editor.mfiles[mkey]) throw new Error(this.myMsg.notFoundStorfile + ' mfile: ' + mkey);

        this.file = mls.stor.files[key];

        this.mfile = mls.l2.editor.mfiles[mkey];


    }

    private lastHTML: string = '';
    private async setHTml(iframe: HTMLIFrameElement) {

        if (!iframe.contentDocument || !this.mfile) return;

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
        (iframe.contentDocument.body as any)['service'] = this.father;

        const ret = await getDepedencesByHtml(this.mfile, txt, true);
        this.mountJSImporMap(ret, iframe);
        this.mountJS(ret, iframe);
        this.mountCSS(ret, iframe);
        this.mountTokens(ret, iframe);

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
				window['l2_fieldTypes'] = window['l2_fieldTypes']  ? window['l2_fieldTypes']  : parent.l2_fieldTypes ? parent.l2_fieldTypes : top['l2_fieldTypes'];window['litDisableBundleWarning'] = true; window['collabActualLevel'] = ${this.level};


				`;
            ifr.contentDocument.body.appendChild(s);

        } catch (e: any) {

            console.info('Error mountJS: ' + e.message);


        }

    }

    private mountCSS(info: IJSONDependence, ifr: HTMLIFrameElement): void {

        try {


            if (!ifr.contentDocument) return;
            let cls = '';
            if (this.mode === 'm') cls = this.scrollMobile;
            const css = info.css.join(' \n');
            const style = document.createElement('style');
            style.textContent = css + ' \n' + cls;
            ifr.contentDocument.body.className = 'scroll-custom';
            ifr.contentDocument.body.style.height = 'calc(100vh - 30px)';
            ifr.contentDocument.body.style.width = '98%'; 
            ifr.contentDocument.body.appendChild(style);

        } catch (e: any) {

            console.info('Error mountCSS: ' + e.message);

        }

    }

    
    private mountTokens(info: IJSONDependence, ifr: HTMLIFrameElement): void {

        try {
            if (!ifr.contentDocument) return;
            const css = info.tokens[0];
            const style = document.createElement('style');
            style.textContent = css;
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

    private infoDS = { project: -1, level: '-1', myDS: undefined as any };

    private verifyWC(): boolean {

        if (this.infoDS.project !== mls.actual[5].project) {
            this.infoDS.level = '-1';
            this.infoDS.myDS = undefined;
            this.infoDS.project = mls.actual[5].project as any;
        }

        let comp;
        if (this.infoDS.level !== this.level && this.level === '2') {

            this.infoDS.myDS = mls.l3.getDSInstance(mls.actual[5].project as any, 0);

        } else if (this.infoDS.level !== this.level) {

            this.infoDS.myDS = mls.l3.getDSInstance(mls.actual[5].project as any, mls.actual[3].mode);
        }

        if (this.infoDS.myDS && this.infoDS.myDS.components) {

            mls.actual[0].setFullName(this.page);
            const info = mls.actual[0];
            comp = this.infoDS.myDS.components.find(`_${info.project}_${info.path}`);
        }

        return !!comp;

    }

    private async onStyleEditClick() {

        const styleService = document.querySelector(`mls-toolbar-content-service-100529[path="_100529_service_styles"]`);
        if (styleService) styleService.setAttribute('forceinstance', 'true');
        else this.father.openService('_100554_serviceDsStyles', 'left', '3');

        mls.actual[0].setFullName(this.page);
        const info = mls.actual[0];

        const rc = {
            emitter: 'right',
            less: '',
            isComponent: true,
            widget: `_${info.project}_${info.path}`,
            helper: '_100529_service_preview',
            origemLevel: +this.level
        };

        mls.events.fire(3, 'DSStyleChanged', JSON.stringify(rc), 500);

    }

    private showError(err: string) {

        if (!this.father) return;
        this.father.setError(err);

    }


    private myMsg = {
        pageNotDefined: 'Page not defined',
        notFoundStorfile: 'Not found storfile',
    }

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