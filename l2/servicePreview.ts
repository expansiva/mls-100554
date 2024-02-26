/// <mls shortName="servicePreview" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
/**
 * @mlsComponentDetails {
 *  "webComponentDependencies": ["service-preview-view-100554"]
 * }
 */

// version = 1

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IMenu } from './_100554_serviceBase';
import { convertTagToFileName } from './_100554_utilsLit'
import { initServicePreviewView } from './_100554_servicePreviewView';
import { initServicePreviewAddStyle } from './_100554_servicePreviewAddStyle';
@customElement('service-preview-100554')
export class ServicePreview100554 extends ServiceBase {

    @property() itens: any = undefined;

    @property() error: string = '';

    private lastMode: string = 'icPreviewD';

    private lastLevel: number =  -1;

    private elPreview: HTMLElement | undefined = undefined;

    private info: any = {};

    constructor() {
        super();
        initServicePreviewView;
        initServicePreviewAddStyle;
        this.setEvents();
    }

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    private levels = [1, 2, 3, 4, 5, 6, 7];

    public details: IService = {
        icon: '&#xf06e',
        state: 'foreground',
        position: 'right',
        tooltip: 'Preview',
        visible: true,
        widget: '_100554_servicePreview',
        level: [1, 2, 3, 4, 5, 6, 7]
    }

    public onClickLink = (op: string): boolean => {
        if (op === 'actAddStyle') return this.actAddStyle();
        if (op === 'opAboutTag') return this.opAboutTag();
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public onClickIcon = (op: string): void => {
        this.lastMode = op;
        if (op === 'icPreviewD') this.preview('d');
        if (op === 'icPreviewM') this.preview('m');
    }

    public menu: IMenu = {
        title: 'Preview',
        actions: {
            actAddStyle: 'Add Style'
        },
        icons: {
            icPreviewD: 'Desktop;f390',
            icPreviewM: 'Mobile;f3cf'
        },
        actionDefault: '', // call after close icon clicked
        iconDefault: 'icPreviewD',
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        onClickIcon: this.onClickIcon
    }

    onServiceClick(visible: boolean, reinit: boolean) {
    
        if (visible && !reinit && this.menu.setIconActive) {
            this.menu.setIconActive(this.lastMode);
            
        } else if (visible && reinit && this.elPreview && this.menu.setIconActive && this.lastLevel == this.level) { 
            this.menu.setIconActive(this.lastMode);
            
        } if (this.elPreview) {
    
            this.lastLevel = this.level;
            this.elPreview.setAttribute('level', this.level.toString());
        }
    }

    // -------------- EVENTS -------------------


    private setEvents() {

        mls.events.addListener(2, 'FileAction', this.onMLSFileAction.bind(this));

        mls.events.addEventListener([2, 3], ['DSStyleChanged'], async (ev) => {

            const rc: any = JSON.parse(ev.desc as any);
            if (
                rc.emitter === 'right' ||
                rc.emitter === 'right-get' ||
                (rc.emitter === 'left' && rc.helper)) return;
            this.onReloader();

        });

    }

    private timeEvent: number = -1;

    private onReloader(): void {
        clearTimeout(this.timeEvent);
        this.timeEvent = setTimeout(async () => {
            this.onServiceClick(true, false);
        }, 500);
    }

    private async onMLSFileAction(ev: mls.events.IEvent): Promise<void> {

        try {

            if (this.visible === 'false' || !this.visible) return;

            if (ev.level !== +this.level || (ev.type !== 'FileAction')) return;

            const fileAction = JSON.parse(ev.desc as any) as mls.events.IFileAction;

            const eventsValid = ['open', 'statusOrErrorChanged', 'changed', 'new'];

            if (
                fileAction.position === this.position ||
                !eventsValid.includes(fileAction.action)
            ) return;

            this.onReloader();

        } catch (e) {

            console.info(e);

        }

    }

    private activeMe(status: string, click: boolean): void {

        if (!this.serviceItemNav) return;
        this.serviceItemNav.setAttribute('mode', status);
        if (click) this.serviceItemNav.click();

    }

    // -------------- COMPONENT ---------------

    async connectedCallback() {
        super.connectedCallback();
        const dsIndex = mls.actual[3].mode && +this.level !== 2 ? mls.actual[3].mode : 0;
        const ds = mls.l3.getDSInstance(mls.actual[5].project as any, dsIndex);
        await ds.init();
    }

    render() {
        return html``;
    }

    // -------------- IMPLEMENTS-----------------

    public async setAboutTag(tag: string) {

        try {

            if (!tag) return false;

            const file = convertTagToFileName(tag.toLocaleLowerCase());
            /*mls.actual[0].setFullName(file);
            const key = mls.stor.getKeyToFiles(mls.actual[0].project as number, 2, mls.actual[0].path as string, '', '.html');
            if (!mls.stor.files[key]) return false;

            this.htmlAbout = await mls.stor.files[key].getContent() as string;*/

        
            this.htmlAbout = `  
                <h3>About this Component</h3>
                <ul>
                    <li>Reference: ${file}</li>
                    <li>Tag: ${tag} </li>
                    <li>Level: 2 </li>                    
                </ul>`
                ;
            
            if (this.menu.setMenuActive && this.htmlAbout) this.menu.setMenuActive('opAboutTag');

        } catch (e) {

            console.info(e);
            return false;

        }


    }

    private htmlAbout = '';
    private opAboutTag() {

        const doc = document.createElement('div');
        doc.innerHTML = this.htmlAbout;
        if (this.menu.setMode) this.menu.setMode('page', doc);
        return true;

    }

    private actAddStyle() {

        if (!(mls.actual[2] as any).left) return true;

        const fullname = `_${(mls.actual[2] as any).left.project}_${(mls.actual[2] as any).left.shortName}`;
        const doc = document.createElement('service-preview-add-style-100554');
        doc.setAttribute('widget', fullname);
        doc.setAttribute('level', this.level as any);
        (doc as any).father = this;
        if (this.menu.setMode) this.menu.setMode('page', doc);
        return true;

    }

    private async preview(mode: string) {

        if (!(mls.actual[2] as any).left) return true;

        const fullname = `_${(mls.actual[2] as any).left.project}_${(mls.actual[2] as any).left.shortName}`;
        const doc = document.createElement('service-preview-view-100554');
        doc.setAttribute('page', fullname);
        doc.setAttribute('level', this.level as any);
        doc.setAttribute('mode', mode);
        (doc as any).father = this;
        this.lastLevel = this.level;
        this.elPreview = doc;
        if (this.menu.setMode) this.menu.setMode('page', doc);
        return true;

    }

}




