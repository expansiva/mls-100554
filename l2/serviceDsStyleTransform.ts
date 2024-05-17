/// <mls shortName="serviceDsStyleTransform" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

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
    scaleX: 'Escala x',
    scaleY: 'Escala y',
    skewX: 'Inclinar x',
    skewY: 'Inclinar Y',
    translateX: 'Traduzir x',
    translateY: 'Traduzir y',
    rotate: 'Girar',
}

const message_en = {
    scaleX: 'Scale x',
    scaleY: 'Scale y',
    skewX: 'Skew x',
    skewY: 'Skew Y',
    translateX: 'Translate x',
    translateY: 'Translate y',
    rotate: 'Rotate',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**
@customElement('service-ds-style-transform-100554')
export class ServiceDsStyleTransform extends ServiceBase {

    private msg: MessageType = messages['en'];
    
    private filter = {
        scaleX: '',
        scaleY: '',
        rotate: '',
        translateX: '',
        translateY: '',
        skewX: '',
        skewY: '',
    }

    private myUpp = false;

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property() error: string = '';

    @property() helper: string = '_100554_serviceDsStyleTransform';

    constructor() {
        super();
        initCollabDSInputRange();
        this.setEvents();
    }

    public details: IService = {
        icon: '&#xf2f1',
        state: 'foreground',
        position: 'right',
        tooltip: 'Transform',
        visible: false,
        widget: '_100554_serviceDsStyleTransform',
        tags: ['ds_styles'],
        level: [3]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public onClickIcon = (op: string): void => {
    }

    public menu: IMenu = {
        title: 'Transform',
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

        return html`${this.renderTransform()}${this.renderGallery()}`;
    }

    renderTransform() {

        return html`
            <div>
                <div class="groupEdit">
                    <span>${this.msg.scaleX}</span>
                    <collab-ds-input-range-100554 prop="scaleX" value="0px" useSelect="false" @onchange="${(e: any) => this.onChangeProp(e.detail)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.scaleY}</span>
                    <collab-ds-input-range-100554 prop="scaleY" value="0px" useSelect="false" @onchange="${(e: any) => this.onChangeProp(e.detail)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.skewX}</span>
                    <collab-ds-input-range-100554 prop="skewX" value="0px" useSelect="false" @onchange="${(e: any) => this.onChangeProp(e.detail)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.skewY}</span>
                    <collab-ds-input-range-100554 prop="skewY" value="0px" useSelect="false" @onchange="${(e: any) => this.onChangeProp(e.detail)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.translateX}</span>
                    <collab-ds-input-range-100554 prop="translateX" value="0px" useSelect="false" @onchange="${(e: any) => this.onChangeProp(e.detail)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.translateY}</span>
                    <collab-ds-input-range-100554 prop="translateY" value="0px" useSelect="false" @onchange="${(e: any) => this.onChangeProp(e.detail)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.rotate}</span>
                    <collab-ds-input-range-100554 prop="rotate" value="0px" useSelect="false" @onchange="${(e: any) => this.onChangeProp(e.detail)}"></collab-ds-input-range-100554>
                </div>
            </div>
        `;

    }

    renderGallery() {

        return html`
            <div style="display: flex; justify-content: center; align-items: center; gap: 1rem; padding: 1rem; flex-wrap: wrap; cursor:pointer">
                ${repeat(this.arrayGallery, ((key: any) => key) as any,
            ((css: any, index: any) => {
                return html`<h5 style="${css}" @click="${this.clickGallery}" .gallery=${css}>Item</h5>`;
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

    private mountValue(): void {

        if (!this.shadowRoot) return;

        const elSX = this.shadowRoot.querySelector('*[prop="scaleX"]') as HTMLInputElement;
        const elSY = this.shadowRoot.querySelector('*[prop="scaleY"]') as HTMLInputElement;
        const elSKX = this.shadowRoot.querySelector('*[prop="skewX"]') as HTMLInputElement;
        const elSKY = this.shadowRoot.querySelector('*[prop="skewY"]') as HTMLInputElement;
        const elTX = this.shadowRoot.querySelector('*[prop="translateX"]') as HTMLInputElement;
        const elTY = this.shadowRoot.querySelector('*[prop="translateY"]') as HTMLInputElement;
        const elR = this.shadowRoot.querySelector('*[prop="rotate"]') as HTMLInputElement;

        let value = '';

        if (elSX.value || elSY.value) {

            value += 'scale(' + (elSX.value ? elSX.value : '1') + (elSY.value ? ', ' + elSY.value : '') + ')';

        }

        if (elR.value) {

            value += elR.value ? ' rotate(' + elR.value + 'deg)' : '';

        }

        if (elTX.value || elTY.value) {

            value += 'translate(' + (elTX.value ? elTX.value + 'px' : '0px') + (elTY.value ? ', ' + elTY.value : ', 0') + 'px)';

        }

        if (elSKX.value || elSKY.value) {

            value += 'skew(' + (elSKX.value ? elSKX.value + 'deg' : '0deg') + (elSKY.value ? ', ' + elSKY.value : ', 0') + 'deg)';

        }

        const change: IBlockLessLine = {
            key: 'transform',
            value
        };

        this.emitEvent(change);


    }

    private setValues(block: IBlockLessLine[]) {

        Object.keys(this.filter).forEach((item) => { (this.filter as any)[item] = ''; });

        const textTransform = block.find((item) => item.key === 'transform');
        if (!textTransform || !this.shadowRoot) return;

        this.myUpp = true;

        let { value } = textTransform;

        const myFilter = this.filter as any;
        const filter = value.split(')');
        filter.forEach((item) => {

            if (!item) return;
            const prop = item.substr(0, item.indexOf('(')).trim();
            item = item.substr(item.indexOf('('), item.length);
            if (prop.indexOf('scale') >= 0 || prop.indexOf('translate') >= 0 || prop.indexOf('skew') >= 0) {

                item.split(',').forEach((vl, index) => {

                    if (!vl) return;
                    const num = vl.match(/[\.-\d]/g)?.join('');
                    const prefx = index === 0 ? 'X' : 'Y';
                    if (myFilter[prop + prefx] !== undefined) myFilter[prop + prefx] = num;

                });

            } else {

                const num = item.match(/[\.-\d]/g)?.join('');
                if (myFilter[prop] !== undefined) myFilter[prop] = num;

            }

        });

        const elSX = this.shadowRoot.querySelector('*[prop="scaleX"]') as HTMLInputElement;
        const elSY = this.shadowRoot.querySelector('*[prop="scaleY"]') as HTMLInputElement;
        const elSKX = this.shadowRoot.querySelector('*[prop="skewX"]') as HTMLInputElement;
        const elSKY = this.shadowRoot.querySelector('*[prop="skewY"]') as HTMLInputElement;
        const elTX = this.shadowRoot.querySelector('*[prop="translateX"]') as HTMLInputElement;
        const elTY = this.shadowRoot.querySelector('*[prop="translateY"]') as HTMLInputElement;
        const elR = this.shadowRoot.querySelector('*[prop="rotate"]') as HTMLInputElement;

        if (elSX) elSX.value = this.filter.scaleX;
        if (elSY) elSY.value = this.filter.scaleY;
        if (elSKX) elSKX.value = this.filter.skewX;
        if (elSKY) elSKY.value = this.filter.skewY;
        if (elTX) elTX.value = this.filter.translateX;
        if (elTY) elTY.value = this.filter.translateY;
        if (elR) elR.value = this.filter.rotate;

        this.myUpp = false;

    }

    private clickGallery(e: MouseEvent): void {

        const el = e.target as HTMLElement;
        if (!el) return;
        const css = (el as any).gallery;

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

        if (changes.length <= 0) changes.push({ key: 'transform', value: '' });
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
        'transform: scale(1.5);',
        'transform: rotate(90deg);',
        'transform: rotate(181deg);',
        'transform: rotate(270deg);',
        'transform: skew(50deg);',
        'transform: skew(50deg, -50deg);',
        'transform: skew(-50deg, 0deg);',
        'transform: skew(-50deg, 50deg);'

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