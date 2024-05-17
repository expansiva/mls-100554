/// <mls shortName="serviceDsStyleFilter" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

/**
 * @mlsComponentDetails {
 *  "webComponentDependencies": ["collab-ds-input-range-100554"]
 * }
 */

import { html, css, LitElement, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IMenu } from './_100554_serviceBase';
import { initCollabDSInputRange } from './_100554_collabDsInputRange';

/// **collab_i18n_start**
const message_pt = {
    loading: 'Carregando...',
    grayscale: 'Tons de cinza',
    blur: 'Desfoque',
    sepia: 'Sepia',
    saturate: 'Saturar',
    opacity: 'Opacidade',
    brightness: 'Brilho',
    contrast: 'Contraste',
    hueRotate: 'Rotação de matiz',
    invert: 'Inverter',
}

const message_en = {
    loading: 'Loading...',
    grayscale: 'Grayscale',
    blur: 'Blur',
    sepia: 'Sepia',
    saturate: 'Saturate',
    opacity: 'Opacity',
    brightness: 'Brightness',
    contrast: 'Contrast',
    hueRotate: 'Hue-rotate',
    invert: 'Invert',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-ds-style-filter-100554')
export class ServiceDsStyleFilter extends ServiceBase {

    private msg: MessageType = messages['en'];
    
    private filter = {
        grayscale: '',
        blur: '',
        sepia: '',
        saturate: '',
        opacity: '',
        brightness: '',
        contrast: '',
        huerotate: '',
        invert: ''
    }

    private myUpp = false;

    @property()
    private opened = false;

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property() error: string = '';

    @property() helper: string = '_100554_serviceDsStyleFilter';

    constructor() {
        super();
        initCollabDSInputRange();
        this.setEvents();
    }

    public details: IService = {
        icon: '&#xf0b0',
        state: 'foreground',
        position: 'right',
        tooltip: 'Filter',
        visible: false,
        tags: ['ds_styles'],
        widget: '_100554_serviceDsStyleFilter',
        level: [3]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public onClickIcon = (op: string): void => {
    }

    public menu: IMenu = {
        title: 'Filter',
        actions: {
        },
        icons: {
        },
        actionDefault: '', // call after close icon clicked
        iconDefault: '',
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        onClickIcon: this.onClickIcon
    }

    onServiceClick(visible: boolean, reinit: boolean) {

        if (visible || reinit) {
            if (this.opened === false) this.opened = true;
            this.fireEventAboutMe();
        }
    }

    //-------------EVENTS--------------

    private setEvents(): void {
        mls.events.addEventListener([3], ['DSStyleChanged'], (ev) => {
            this.onstylechanged(ev.desc as any);
        });

        mls.events.addEventListener([3], ['DSStyleSelected'], (ev) => {
            this.onDSStyleSelected(ev);
        });

        mls.events.addEventListener([3], ['DSStyleUnSelected'], (ev) => {
            this.onDSStyleUnSelected(ev);
        });

        mls.events.addEventListener([3], ['DSStyleCursorChanged'], (ev) => {
            this.onDSStyleCursorChanged(ev);
        });


    }

    private onstylechanged(desc: string) {

        const obj: IEventsObj = JSON.parse(desc);
        if (obj.emitter === 'left' && this.visible === 'true' && obj.value.length > 0) {

            this.setValues(obj.value);
        }

    }

    private onDSStyleSelected(ev: mls.events.IEvent) {

        const params: IEventsSelectedObj = ev.desc ? JSON.parse(ev.desc) : [];
        if (params.service.length > 0 && !params.service.includes(this.helper) || !this.serviceItemNav) return;
        this.serviceItemNav.setAttribute('mode', 'A');
        if (this.showNav2Item) this.showNav2Item(true);

    }

    private onDSStyleUnSelected(ev: mls.events.IEvent) {
        const params: IEventsSelectedObj = ev.desc ? JSON.parse(ev.desc) : [];
        if (params.service.includes(this.helper) || !this.serviceItemNav) return;
        this.serviceItemNav.setAttribute('mode', 'H');
        if (this.showNav2Item) this.showNav2Item(false);
    }

    private onDSStyleCursorChanged(ev: mls.events.IEvent) {
        const rc: ICursorChangeEventsObj = JSON.parse(ev.desc as any);
        if (rc.helper === this.helper) {
            if (this.visible === 'true' || !this.serviceItemNav) return;
            this.serviceItemNav.click();
        }
    }

    //-------------COMPONENT-----------

    connectedCallback() {
        super.connectedCallback();
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html` ${this.opened ?
            html`${this.renderFilter()}${this.renderGallery()}` :
            html`${this.msg.loading}`
            } 
        `;
    }

    renderFilter() {

        return html`
            <div>
                <div class="groupEdit">
                    <span>${this.msg.grayscale}</span>
                    <collab-ds-input-range-100554 prop="grayscale" value="0px" useSelect="false" @onchange="${(e: any) => this.onChangeProp(e.detail)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.blur}</span>
                    <collab-ds-input-range-100554 prop="blur" value="0px" useSelect="false" @onchange="${(e: any) => this.onChangeProp(e.detail)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.sepia}</span>
                    <collab-ds-input-range-100554 prop="sepia" value="0px" useSelect="false" @onchange="${(e: any) => this.onChangeProp(e.detail)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.saturate}</span>
                    <collab-ds-input-range-100554 prop="saturate" value="0px" useSelect="false" @onchange="${(e: any) => this.onChangeProp(e.detail)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.opacity}</span>
                    <collab-ds-input-range-100554 prop="opacity" value="0px" useSelect="false" @onchange="${(e: any) => this.onChangeProp(e.detail)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.brightness}</span>
                    <collab-ds-input-range-100554 prop="brightness" value="0px" useSelect="false" @onchange="${(e: any) => this.onChangeProp(e.detail)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.contrast}</span>
                    <collab-ds-input-range-100554 prop="contrast" value="0px" useSelect="false" @onchange="${(e: any) => this.onChangeProp(e.detail)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.hueRotate}</span>
                    <collab-ds-input-range-100554 prop="huerotate" value="0px" useSelect="false" @onchange="${(e: any) => this.onChangeProp(e.detail)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.invert}</span>
                    <collab-ds-input-range-100554 prop="invert" value="0px" useSelect="false" @onchange="${(e: any) => this.onChangeProp(e.detail)}"></collab-ds-input-range-100554>
                </div>
            </div>
        `;

    }

    renderGallery() {

        return html`
            <div style="display: flex; justify-content: center; align-items: center; gap: 1rem; padding: 1rem; flex-wrap: wrap; cursor:pointer">
                ${repeat(this.arrayGallery, ((key: any) => key) as any,
            ((css: any, index: any) => {
                return html`
                                <img style="width:60px;${css}" @click="${this.clickGallery}" .gallery=${css} src="https://angrytools.com/css-generator/img/rose.jpg" />
                            `
                    ;
            }) as any
        )}
            </div>
        
        `
    }

    //-------------IMPLEMENTS--------------


    private timeonChangeProp = -1;
    private onChangeProp(obj: IBlockLessLine) {
        clearTimeout(this.timeonChangeProp);
        this.timeonChangeProp = setTimeout(() => {
            this.mountValue();
        }, 500);
    }

    private fireEventAboutMe(): void {
        const rc = {
            emitter: 'right-get',
        };

        mls.events.fire([3], ['DSStyleChanged'], JSON.stringify(rc), 500);
    }

    private emitEvent(obj: IBlockLessLine) {

        if (this.myUpp) return;
        const rc: IEventsObj = {
            emitter: this.position,
            value: [obj],
            helper: this.helper
        };

        if (typeof mls !== 'object') return;
        mls.events.fire([3], ['DSStyleChanged'], JSON.stringify(rc));

    }

    private timeLoader = -1;
    private showLoader(loader: boolean): void {

        clearTimeout(this.timeLoader);
        this.timeLoader = setTimeout(() => {
            this.loading = loader;
        }, 200);

    }

    public mountValue() {

        if (!this.shadowRoot) return;

        let value = '';

        const elG = this.shadowRoot.querySelector('*[prop="grayscale"]') as HTMLInputElement;
        const elB = this.shadowRoot.querySelector('*[prop="blur"]') as HTMLInputElement;
        const elS = this.shadowRoot.querySelector('*[prop="sepia"]') as HTMLInputElement;
        const elSt = this.shadowRoot.querySelector('*[prop="saturate"]') as HTMLInputElement;
        const elO = this.shadowRoot.querySelector('*[prop="opacity"]') as HTMLInputElement;
        const elBr = this.shadowRoot.querySelector('*[prop="brightness"]') as HTMLInputElement;
        const elC = this.shadowRoot.querySelector('*[prop="contrast"]') as HTMLInputElement;
        const elH = this.shadowRoot.querySelector('*[prop="huerotate"]') as HTMLInputElement;
        const elI = this.shadowRoot.querySelector('*[prop="invert"]') as HTMLInputElement;

        value += elG.value ? 'grayscale(' + elG.value + '%)' : '';
        value += elB.value ? ' blur(' + elB.value + 'px)' : '';
        value += elS.value ? ' sepia(' + elS.value + ')' : '';
        value += elSt.value ? ' saturate(' + elSt.value + ')' : '';
        value += elO.value ? ' opacity(' + elO.value + ')' : '';
        value += elBr.value ? ' brightness(' + elBr.value + '%)' : '';
        value += elC.value ? ' contrast(' + elC.value + '%)' : '';
        value += elH.value ? ' hue-rotate(' + elH.value + 'deg)' : '';
        value += elI.value ? ' invert(' + elI.value + '%)' : '';

        const change: IBlockLessLine = {
            key: 'filter',
            value
        };

        this.emitEvent(change);

    }

    private setValues(block: IBlockLessLine[]) {

        if (!this.shadowRoot) return;

        const myFilter = this.filter as any;

        Object.keys(myFilter).forEach((item) => { myFilter[item] = ''; });

        const textFilter = block.find((item) => item.key === 'filter');
        if (!textFilter) return;

        this.myUpp = true;

        const { value } = textFilter;

        const filter = value.split(' ');

        filter.forEach((item) => {

            const prop = item.substr(0, item.indexOf('(')).replace('-', '');
            item = item.substr(item.indexOf('('), item.length);
            const num = item.match(/[\.-\d]/g)?.join('');
            if (myFilter[prop] !== undefined) myFilter[prop] = num;

        });

        const elG = this.shadowRoot.querySelector('*[prop="grayscale"]') as HTMLInputElement;
        const elB = this.shadowRoot.querySelector('*[prop="blur"]') as HTMLInputElement;
        const elS = this.shadowRoot.querySelector('*[prop="sepia"]') as HTMLInputElement;
        const elSt = this.shadowRoot.querySelector('*[prop="saturate"]') as HTMLInputElement;
        const elO = this.shadowRoot.querySelector('*[prop="opacity"]') as HTMLInputElement;
        const elBr = this.shadowRoot.querySelector('*[prop="brightness"]') as HTMLInputElement;
        const elC = this.shadowRoot.querySelector('*[prop="contrast"]') as HTMLInputElement;
        const elH = this.shadowRoot.querySelector('*[prop="huerotate"]') as HTMLInputElement;
        const elI = this.shadowRoot.querySelector('*[prop="invert"]') as HTMLInputElement;

        if (elG) elG.value = this.filter.grayscale;
        if (elB) elB.value = this.filter.blur;
        if (elS) elS.value = this.filter.sepia;
        if (elSt) elSt.value = this.filter.saturate;
        if (elO) elO.value = this.filter.opacity;
        if (elBr) elBr.value = this.filter.brightness;
        if (elC) elC.value = this.filter.contrast;
        if (elH) elH.value = this.filter.huerotate;
        if (elI) elI.value = this.filter.invert;

        this.myUpp = false;

    }

    private clickGallery(e: MouseEvent): void {

        const el = e.target as HTMLElement;
        if (!el) return;
        const css = (el as any).gallery;
        //if (!css) return;

        const commands: string[] = css.split(';');
        const changes: any[] = [];
        commands.forEach((item) => {

            const [key, value] = item.split(':');
            if (!key) return;

            changes.push({
                key: key.trim(),
                value: value.trim()
            });

        });

        if (changes.length <= 0) changes.push({ key: 'filter', value: '' });

        this.setValues(changes);

        const rc: IEventsObj = {
            emitter: 'right',
            value: changes,
            helper: this.helper
        };

        mls.events.fire([3], ['DSStyleChanged'], JSON.stringify(rc));

    }

    private arrayGallery = [
        '',
        'filter: brightness(20%) sepia(1) hue-rotate(180deg) saturate(5);',
        'filter: brightness(20%) sepia(1) hue-rotate(310deg) saturate(5);',
        'filter: brightness(70%) sepia(1) hue-rotate(360deg) saturate(6);',
        'filter: brightness(70%) sepia(1) hue-rotate(206deg) saturate(6);',
        'filter: brightness(40%) sepia(1) hue-rotate(-42deg) saturate(6);',
        'filter: brightness(40%) sepia(1) hue-rotate(-40deg);',
        'filter: blur(2px);',
        'filter: invert(100%) sepia(2);',
        'filter: brightness(40%) sepia(1) hue-rotate(-40deg);'


    ];

}

interface ICursorChangeEventsObj {
    emitter: 'left'
    helper: string,
}

interface IEventsSelectedObj {
    service: string[]
    isComponent: boolean
}

interface IEventsObj {
    emitter: 'right' | 'left' | 'right-get',
    helper: string,
    value: IBlockLessLine[],
}

interface IBlockLessLine {
    key: string,
    value: string,
}

