/// <mls shortName="serviceDsStyleSpacing" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

/**
 * @mlsComponentDetails {
 *  "webComponentDependencies": ["collab-ds-input-range-100554"]
 * }
 */

import { html, css, LitElement, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IMenu } from './_100554_serviceBase';
import { initCollabDSInputRange } from './_100554_collabDsInputRange';

@customElement('service-ds-style-spacing-100554')
export class ServiceDsStyleSpacing extends ServiceBase {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property() error: string = '';

    @property() helper: string = '_100554_serviceDsStyleSpacing';

    constructor() {
        super();
        this.setEvents();
    }

    public details: IService = {
        icon: '&#xe4ba',
        name: 'Spacing',
        mode: 'B',
        position: 'right',
        readOnly: false,
        tooltip: 'Spacing',
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
        title: 'Spacing',
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

            if (['margin', 'padding'].includes(prop)) {
                this.uppProp(value, prop);

            } else {

                const el = this.shadowRoot.querySelector('*[prop="' + prop + '"]') as HTMLInputElement;
                if (el) el.value = value;

            }

        })

    }

    private onDSStyleSelected(ev: mls.events.IEvent) {

        const params: IEventsSelectedObj = ev.desc ? JSON.parse(ev.desc) : [];
        if (params.service.length > 0 && !params.service.includes(this.helper) || !this.serviceItemNav) return;
        this.serviceItemNav.setAttribute('mode', 'A');

    }

    private onDSStyleUnSelected(ev: mls.events.IEvent) {
        const params: IEventsSelectedObj = ev.desc ? JSON.parse(ev.desc) : [];
        if (params.service.includes(this.helper) || !this.serviceItemNav) return;
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
        return html`${this.renderMargin()}${this.renderPadding()}`;
    }

    renderMargin() {
        return html`
            <div>
                <h5 style="display:flex; gap:1.5rem" >${this.myMsg.margin}<input type="checkbox" prop="margin"></h5>
                <div class="groupEdit">
                    <span>${this.myMsg.top}</span>
                    <collab-ds-input-range-100554 prop="margin-top" value="0px" .arraySelect=${this.tpMeasures} group="margin" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.myMsg.left}</span>
                    <collab-ds-input-range-100554 prop="margin-left" value="0px" .arraySelect=${this.tpMeasures} group="margin" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554>    
                </div>
                <div class="groupEdit">
                    <span>${this.myMsg.bottom}</span>
                    <collab-ds-input-range-100554 prop="margin-bottom" value="0px" .arraySelect=${this.tpMeasures} group="margin" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554> 
                </div>
                <div class="groupEdit">
                    <span>${this.myMsg.right}</span>
                    <collab-ds-input-range-100554 prop="margin-right" value="0px" .arraySelect=${this.tpMeasures} group="margin" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554> 
                </div>
            </div>
        `;
    }

    renderPadding() {
        return html`
            <div>
                <h5 style="display:flex; gap:1.5rem" >${this.myMsg.padding}<input type="checkbox" prop="padding"></h5>
                <div class="groupEdit">
                    <span>${this.myMsg.top}</span>
                    <collab-ds-input-range-100554 prop="padding-top" value="0px" .arraySelect=${this.tpMeasures} group="padding" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.myMsg.left}</span>
                    <collab-ds-input-range-100554 prop="padding-left" value="0px" .arraySelect=${this.tpMeasures} group="padding" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554>    
                </div>
                <div class="groupEdit">
                    <span>${this.myMsg.bottom}</span>
                    <collab-ds-input-range-100554 prop="padding-bottom" value="0px" .arraySelect=${this.tpMeasures} group="padding" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554> 
                </div>
                <div class="groupEdit">
                    <span>${this.myMsg.right}</span>
                    <collab-ds-input-range-100554 prop="padding-right" value="0px" .arraySelect=${this.tpMeasures} group="padding" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554> 
                </div>
            </div>
        `;
    }

    //-------------IMPLEMENTS--------------

    private tpMeasures = ['px', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax', 'ex', 'ch', 'auto'];

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

            this.uppProp(el.value, group);
            return;
        }

        this.emitEvent({
            key: el.getAttribute('prop') as string,
            value: el.value,
        })

    }

    private uppProp(value: string, group: string): void {

        if (!this.shadowRoot) return;

        const info: any = {
            margin: {
                p1: 'margin-top',
                p2: 'margin-left',
                p3: 'margin-right',
                p4: 'margin-bottom',
            },
            padding: {
                p1: 'padding-top',
                p2: 'padding-left',
                p3: 'padding-bottom',
                p4: 'padding-right',
            },
        }

        const prop = group;

        const elP1 = this.shadowRoot.querySelector(`*[prop="${info[group].p1}"]`) as HTMLInputElement;
        const elP2 = this.shadowRoot.querySelector(`*[prop="${info[group].p2}"]`) as HTMLInputElement;
        const elP3 = this.shadowRoot.querySelector(`*[prop="${info[group].p3}"]`) as HTMLInputElement;
        const elP4 = this.shadowRoot.querySelector(`*[prop="${info[group].p4}"]`) as HTMLInputElement;

        const ar: HTMLInputElement[] = [];

        if (elP1) ar.push(elP1);
        if (elP2) ar.push(elP2);
        if (elP3) ar.push(elP3);
        if (elP4) ar.push(elP4);

        ar.forEach((i) => {
            i.value = value;
        });

        this.emitEvent({
            key: prop,
            value: value,
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

        if (m.margin) this.myMsg.margin = m.margin;
        if (m.padding) this.myMsg.padding = m.padding;
        if (m.top) this.myMsg.top = m.top;
        if (m.left) this.myMsg.left = m.left;
        if (m.bottom) this.myMsg.bottom = m.bottom;
        if (m.right) this.myMsg.right = m.right;

    }

    private myMsg = {
        margin: 'Margin',
        padding: 'Padding',
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

interface initComponents {
    1:initCollabDSInputRange;
}