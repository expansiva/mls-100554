/// <mls shortName="servicePreview" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

// version = 1

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IMenu } from './_100554_serviceBase';
import { convertTagToFileName } from './_100554_utilsLit'
import { initServicePreviewView } from './_100554_servicePreviewView';
import { initServicePreviewAddStyle } from './_100554_servicePreviewAddStyle';
import { IcaLitElement } from './_100554_icaLitElement';

/// **collab_i18n_start**
const message_pt = {
    variations: 'Variação',
    editStyle: 'Editar estilo',
    pause: 'Parar preview'
}

const message_en = {
    variations: 'Variation',
    editStyle: 'Edit style',
    pause: 'Pause preview'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-preview-100554')
export class ServicePreview100554 extends ServiceBase {

    private msg: MessageType = messages['en'];
    
    @property() itens: any = undefined;

    @property() error: string = '';

    @property() watch: boolean = true;

    private lastMode: string = 'icPreviewD';

    private lastLevel: number = -1;

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
        if (op === 'opAboutTag') return this.opAboutTag();
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public onClickIcon = (op: string): void => {
        this.lastMode = op;
        if (op === 'icPreviewD') this.preview('d');
        if (op === 'icPreviewM') this.preview('m');
    }

    public onClickButton = (op: string, opMenu?: string): boolean => {
        if (op === 'btWatch') return this.toogleWatch();
        if (op === 'btEditStyle') return this.editStyles();
        if (op === 'btVariations') return this.onBtVariationsClick(opMenu);
        else throw new Error('Invalid option')
    }

    private objVariations: any = {
        0: 'en-US',
        1: 'pt-BR'
    }

    private getIframePreviewHTML(): HTMLHtmlElement | undefined {
        const htmlEl = this.previousElementSibling
            ?.querySelector('service-preview-view-100554')
            ?.shadowRoot
            ?.querySelector('iframe')
            ?.contentDocument
            ?.querySelector('html') as HTMLHtmlElement;

        return htmlEl;
    }

    private onBtVariationsClick(opMenu: string | undefined) {
        if (!opMenu) return true;
        const htmlEl: HTMLHtmlElement | undefined = this.getIframePreviewHTML();
        const variation = opMenu.substring(0, 1);
        if (htmlEl) htmlEl.lang = this.objVariations[variation];
        window.globalVariation = !isNaN(+variation) ? +variation : 0;
        if (window.top) window.top.window.globalVariation = !isNaN(+variation) ? +variation : 0;
        this.requestUpdateAllIcaComponentsInPage();
        return true;
    }

    private toogleWatch(): boolean {
        this.watch = !this.watch;
        if (this.watch) {
            this.onReloader();
        }
        return this.watch;
    }

    private editStyles(): boolean {
        this.openService('_100554_serviceDsStyles', 'left', 3);
        return true;
    }

    public menu: IMenu = {
        title: 'Preview',
        actions: {
        },
        icons: {
            icPreviewD: 'Desktop;f390',
            icPreviewM: 'Mobile;f3cf'
        },
        buttons: {
            btVariations: this.msg.variations + ';f1ab:menu:0 - Default,1 - Portugues',
            btEditStyle: this.msg.editStyle + ';f0d0',
            btWatch: this.msg.pause + ';Update Preview;f04c;f04b',
        },
        actionDefault: '', // call after close icon clicked
        iconDefault: 'icPreviewD',
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        onClickIcon: this.onClickIcon,
        onClickButton: this.onClickButton

    }

    onServiceClick(visible: boolean, reinit: boolean) {

        if (visible && !reinit && this.menu.setIconActive) {
            this.menu.setIconActive(this.lastMode);

        } else if (visible && reinit && this.elPreview && this.menu.setIconActive && this.lastLevel == this.level) {
            this.menu.setIconActive(this.lastMode);

        } if (this.elPreview) {

            this.lastLevel = this.level;
            this.elPreview.setAttribute('level', this.level.toString());
        } else {
            this.preview(this.lastMode);
        }
    }

    // -------------- EVENTS -------------------


    private setEvents() {

        mls.events.addListener(2, 'FileAction', this.onMLSFileAction.bind(this));

        mls.events.addEventListener([3], ['DSStyleChanged', 'DSColorChanged', 'DSCustomChanged', 'DSTYPOChanged'], async (ev) => {

            const rc: any = JSON.parse(ev.desc as any);
            if (
                rc.emitter === 'right' ||
                rc.emitter === 'right-get' ||
                (rc.emitter === 'left' && rc.helper)) return;

            if (this.watch) this.onStyleChanged();
            // this.onReloader();

        });

    }

    private timeEvent: number = -1;

    private onReloader(): void {
        clearTimeout(this.timeEvent);
        this.timeEvent = setTimeout(async () => {
            this.onServiceClick(true, false);
            mls.events.fire((+(this.level as any)) as any, 'WCDEventChange' as any, `{"op":"Navigation"}`);
        }, 500);
    }

    private onStyleChanged() {
        if (this.elPreview) {
            this.lastLevel = this.level;
            this.elPreview.setAttribute('stylechanged', 'true');
        }
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

            if (this.watch) this.onReloader();

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

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html``;
    }

    // -------------- IMPLEMENTS-----------------

    public async setAboutTag(tag: string) {

        try {

            if (!tag) return false;

            const file = convertTagToFileName(tag.toLocaleLowerCase());


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

    private async preview(mode: string) {

        if (!(mls.actual[2] as any).left) return true;

        const fullname = `_${(mls.actual[2] as any).left.project}_${(mls.actual[2] as any).left.shortName}`;

        this.menu.title = 'Preview: ' + fullname;
        if (this.menu.updateTitle) this.menu.updateTitle();
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

    private requestUpdateAllIcaComponentsInPage() {
        
        const elements = this.previousElementSibling
            ?.querySelector('service-preview-view-100554')
            ?.shadowRoot
            ?.querySelector('iframe')
            ?.contentDocument
            ?.querySelectorAll('*')

        if (!elements) return;

        elements.forEach((el) => {
            if (el.tagName.split('-').length > 1 && (el as IcaLitElement).globalVariation !== undefined) {
                (el as IcaLitElement).globalVariation = window.globalVariation;
            }
        })

    }

}




