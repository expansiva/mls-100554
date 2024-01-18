/// <mls shortName="servicePreview" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
/**
 * @mlsComponentDetails {
 *  "webComponentDependencies": ["service-preview-view-100554"]
 * }
 */

import { html, css, unsafeHTML, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IMenu } from './_100554_serviceBase';
import { initServicePreviewView } from './_100554_servicePreviewView';
@customElement('service-preview-100554')
export class ServicePreview100554 extends ServiceBase {

    @property() itens: any = undefined;

    @property() error: string = '';

    private info: any = {};

    constructor() {
        super();
        initServicePreviewView;
        this.setEvents();
        console.info('inicializou os eventos')
    }

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    private levels = [1, 2, 3, 4, 5, 6, 7];

    public details: IService = {
        icon: '&#xf5b8',
        name: 'Preview 2',
        mode: 'B',
        position: 'right',
        readOnly: false,
        tooltip: 'Preview 2',
        className: undefined,
        tags: [],
        levels: [1, 2, 3, 4, 5, 6, 7]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public onClickIcon = (op: string): void => {
        if (op === 'icPreview') this.preview();
    }

    public menu: IMenu = {
        title: 'Save',
        actions: {
        },
        icons: {
            icPreview: 'Preview;f06e'
        },
        actionDefault: '', // call after close icon clicked
        iconDefault: 'icPreview',
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        onClickIcon: this.onClickIcon
    }

    private showInitial(): boolean {
        return true;
    }

    onServiceClick(visible: boolean, reinit: boolean) {

        if (visible && reinit) {

        }
    }

    private async preview() {

        /*const doc = document.createElement('service-preview-view-100554');
        doc.setAttribute('page', '_100554_ateste');
        doc.setAttribute('level', '2');
        
        if (this.menu.setMode) this.menu.setMode('page', doc);*/

        //------ TEmporario -----------
        const txt = await this.getMyHtml();
        const doc = document.createElement('iframe') as HTMLIFrameElement;
        doc.style.cssText = `width: 100%;height: calc(100vh - 230px);    border: none;`;
        doc.src = 'https://multilevelstudio.com/l4/_100529_service_preview_blocks2.json.html';
        doc.onload = () => {

            (doc as any).contentDocument.body['myHtml'] = txt;

            const s = document.createElement('script') as HTMLScriptElement;
            s.textContent = `
				window['mls'] = window['mls']  ? window['mls']  : parent.mls ? parent.mls : top['mls'];
				window['Quill'] = window['Quill']  ? window['Quill']  : parent.Quill ? parent.Quill : top['Quill'];
				window['monaco'] = window['monaco']  ? window['monaco']  : parent.monaco ? parent.monaco : top['monaco'];
				window['l2_html'] = window['l2_html']  ? window['l2_html']  : parent.l2_html ? parent.l2_html : top['l2_html'];
				window['l2_fieldTypes'] = window['l2_fieldTypes']  ? window['l2_fieldTypes']  : parent.l2_fieldTypes ? parent.l2_fieldTypes : top['l2_fieldTypes'];window['litDisableBundleWarning'] = true;


				`;
            (doc as any).contentDocument.body.appendChild(s);
            this.updatePage(((doc as any).contentDocument.body) as HTMLDivElement, 100529, 'service_preview_blocks2', '_100529_service_preview_blocks2', true, () => { });

        };

        //------ fim TEmporario -----------

        if (this.menu.setMode) this.menu.setMode('page', doc);
        return true;
    }

    // -------------- EVENTS -------------------

    private setEvents() {

        mls.events.addEventListener([2], ['ToolBarSelected'], (ev) => this.onToolBarSelected(ev));

    }

    private onToolBarSelected(ev: mls.events.IEvent) {
        console.info('passou');
        if (!ev || !ev.desc) return;
        const params: { level: number, position: string, from: string, to: string } = ev.desc ? JSON.parse(ev.desc) : {};

        if (![2].includes(params.level) || this.position === params.position) {
            return;
        }

        if (!['_100529_service_Source'].includes(params.to)) {

            this.activeMe('H', false);
        } else {
            this.activeMe('A', true);
        }

    };


    private activeMe(status: string, click: boolean): void {

        if (!this.serviceItemNav) return;
        this.serviceItemNav.setAttribute('mode', status);
        if (click) this.serviceItemNav.click();

    }

    // -------------- COMPONENT ---------------

    render() {
        return html``;
    }

    // -------------- IMPLEMENTS-----------------

    //------ TEmporario -----------
    private async getMyHtml() { // temporario

        try {

            const key = mls.stor.getKeyToFiles(
                mls.actual[2].project as number,
                2,
                mls.actual[2].path as string,
                '',
                '.html'
            );

            if (!mls.stor.files[key]) {
                console.info('not Found')
            }

            const file = mls.stor.files[key];

            let txt = '<h3>Configure your html by editor option!</h3>';

            if (file && file.getValueInfo)
                txt = (await file.getValueInfo()).content as string;

            if (file && txt === null)
                txt = await file.getContent() as string;

            return txt;

        } catch (e) {

            console.info(e);
            return '<h3>Configure your html by editor option!</h3>';
        }


    }

    private updatePage(div1: HTMLElement, pageProject: number, pageName: string, path: string, updateScripts = !1, callB: Function): void {

        if (path === '_0_development') { // temporario

            div1.innerHTML = `<h3> In development</h3>`;
            return;

        }

        div1.innerHTML = 'loading _' + pageProject + '_' + pageName + ' ...';
        const url = '/l4/_' + pageProject + '_' + pageName + '.json.html';

        mls.api.get(url, {}, (event, error) => {

            div1.innerHTML = event;


            if (error) {


                if (callB) callB(-1);

            } else if (updateScripts) {

                mls.l3.nodeScriptReplace(div1);
                if (callB) callB(1);

            }

        });

    }

    //------ FIM TEmporario -----------

}




