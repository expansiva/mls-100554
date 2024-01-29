/// <mls shortName="serviceDsStyleBorder" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

/**
 * @mlsComponentDetails {
 *  "webComponentDependencies": ["collab-ds-input-range-100554","collab-ds-input-select-color-100554"]
 * }
 */

import { html, css, LitElement, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IMenu } from './_100554_serviceBase';
import { initCollabDSInputRange } from './_100554_collabDsInputRange';
import { initCollabDsInputSelectColor } from './_100554_collabDsInputSelectColor';

@customElement('service-ds-style-border-100554')
export class ServiceDsStyleBorder extends ServiceBase {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property() error: string = '';

    @property() helper: string = '_100554_serviceDsStyleBorder';

    constructor() {
        super();
        initCollabDSInputRange;
        initCollabDsInputSelectColor;
        this.setEvents();
    }

    public details: IService = {
        icon: '&#xf853',
        name: 'Border',
        mode: 'B',
        position: 'right',
        readOnly: false,
        tooltip: 'Border',
        className: undefined,
        tags: [],
        levels: [3]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public onClickIcon = (op: string): void => {
    }

    public menu: IMenu = {
        title: 'Border',
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

        if (visible) {

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
        if (obj.emitter !== 'left' || this.visible === 'false' || obj.value.length <= 0) return;

        obj.value.forEach((i: any) => {

            if (!this.shadowRoot || !i.key) return;
            const value = i.value;
            const prop = i.key;
            const el = this.shadowRoot.querySelector('*[prop="' + prop + '"]') as HTMLInputElement;
            if (el) el.value = value;

        })

    }

    private onDSStyleSelected(ev: mls.events.IEvent) {

        const params: IEventsSelectedObj = ev.desc ? JSON.parse(ev.desc) : [];
        if (params.service.length > 0 && !params.service.includes('_100554_serviceDsStyleSize') || !this.serviceItemNav) return;
        this.serviceItemNav.setAttribute('mode', 'A');

    }

    private onDSStyleUnSelected(ev: mls.events.IEvent) {
        const params: IEventsSelectedObj = ev.desc ? JSON.parse(ev.desc) : [];
        if (params.service.includes('_100554_serviceDsStyleSize') || !this.serviceItemNav) return;
        this.serviceItemNav.setAttribute('mode', 'H');
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
        this.updateMyMessages();


    }

    render() {
        return html`${this.renderBorder()}`;
    }

    renderBorder() {
        return html`
            <div>
                <h5 style="display:flex; gap:1.5rem" >${this.myMsg.border}<input type="checkbox" prop="border"></h5>
                <div class="groupEdit">
                    <span>${this.myMsg.top}</span>
                    <collab-ds-input-select-color-100554 prop="border-top" valueInput="0px" .arrayInputSelect=${this.tpMeasures} .arraySelect=${this.tpBorder} valueSelect="none" group="border" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-select-color-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.myMsg.left}</span>
                    <collab-ds-input-select-color-100554 prop="border-left" valueInput="0px" .arrayInputSelect=${this.tpMeasures} .arraySelect=${this.tpBorder} valueSelect="none" group="border" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-select-color-100554>   
                </div>
                <div class="groupEdit">
                    <span>${this.myMsg.bottom}</span>
                    <collab-ds-input-select-color-100554 prop="border-bottom" valueInput="0px" .arrayInputSelect=${this.tpMeasures} .arraySelect=${this.tpBorder} valueSelect="none" group="border" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-select-color-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.myMsg.right}</span>
                    <collab-ds-input-select-color-100554 prop="border-right" valueInput="0px" .arrayInputSelect=${this.tpMeasures} .arraySelect=${this.tpBorder} valueSelect="none" group="border" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-select-color-100554>
                </div>
            </div>
        `
    }

    //-------------IMPLEMENTS--------------

    private tpMeasures = ['px', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax', 'ex', 'ch', 'auto'];

    private tpBorder = ['none', 'solid', 'dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset', 'hidden']


    private timeonChangeProp = -1;
    private onChangeProp(e: KeyboardEvent) {
        clearTimeout(this.timeonChangeProp);
        this.timeonChangeProp = setTimeout(() => {
            const el = (e.detail as any).target as HTMLInputElement;
            this.beforeEmitEvent(el, e.detail as any);
        }, 500);
    }

    private beforeEmitEvent(el: HTMLInputElement, obj: IBlockLessLine) {

        if (!this.shadowRoot) return;
        const group = el ? el.getAttribute('group') as string : '';
        const elGroup = this.shadowRoot.querySelector(`input[prop="${group}"]`) as HTMLInputElement;
        let isGroup = false;
        if (elGroup) isGroup = elGroup.checked;

        if (isGroup) {

            if (group === 'border') this.uppBorder(obj);
            return;
        }

        console.info({
            key: el.getAttribute('prop'),
            value: el.value,
        })

    }

    private uppBorder(obj: any): void {

        if (!this.shadowRoot) return;
        const elTop = this.shadowRoot.querySelector(`*[prop="border-top"]`) as HTMLInputElement;
        const elLeft = this.shadowRoot.querySelector(`*[prop="border-left"]`) as HTMLInputElement;
        const elRight = this.shadowRoot.querySelector(`*[prop="border-right"]`) as HTMLInputElement;
        const elBottom = this.shadowRoot.querySelector(`*[prop="border-bottom"]`) as HTMLInputElement;

        const ar: HTMLInputElement[] = [];
        
        if (elTop) ar.push(elTop);
        if (elLeft) ar.push(elLeft);
        if (elRight) ar.push(elRight);
        if (elBottom) ar.push(elBottom);

        ar.forEach((i) => {

            obj.value.forEach((v:any) => {

                let attr = '';
                if (v.tp === 'input') attr = 'valueinput';
                if (v.tp === 'select') attr = 'valueselect';
                if (v.tp === 'color') attr = 'valuecolor';

                i.setAttribute(attr, v.value);
                
            })            

        });

        console.info({
            key: 'border',
            value: elTop.value,
        })

    }

    private fireEventAboutMe(): void {
        const rc = {
            emitter: 'right-get',
        };

        mls.events.fire([3], ['DSStyleChanged'], JSON.stringify(rc));
    }

    private emitEvent(obj: IBlockLessLine) {

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

    private updateMyMessages() {

        if (!window['message' as any]) return;
        const m = window['message' as any] as any;

        if (m.border) this.myMsg.border = m.border;
        if (m.top) this.myMsg.top = m.top;
        if (m.left) this.myMsg.left = m.left;
        if (m.bottom) this.myMsg.bottom = m.bottom;
        if (m.right) this.myMsg.right = m.right;

    }

    private myMsg = {
        border: 'Border',
        top: 'Top',
        left: 'Left',
        bottom: 'Bottom',
        right: 'Right',
    }
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
