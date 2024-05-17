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

/// **collab_i18n_start**
const message_pt = {
    margin: 'Margem',
    padding: 'Preenchimento',
    top: 'Topo',
    left: 'Esquerda',
    bottom: 'Inferior',
    right: 'Direita',
}

const message_en = {
    margin: 'Margin',
    padding: 'Padding',
    top: 'Top',
    left: 'Left',
    bottom: 'Bottom',
    right: 'Right',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-ds-style-spacing-100554')
export class ServiceDsStyleSpacing extends ServiceBase {

    private msg: MessageType = messages['en'];
    
    private myUpp = false;

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property() error: string = '';

    @property() helper: string = '_100554_serviceDsStyleSpacing';

    constructor() {
        super();
        initCollabDSInputRange()
        this.setEvents();
    }

    public details: IService = {
        icon: '&#xe4ba',
        state: 'foreground',
        position: 'right',
        tooltip: 'Spacing',
        tags: ['ds_styles'],
        visible: false,
        widget: '_100554_serviceDsStyleSpacing',
        level: [3]
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

    private setValues(ar: IBlockLessLine[]): void {
        this.myUpp = true;
        ar.forEach((i: any) => {

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
        this.myUpp = false;
    }

    private onDSStyleSelected(ev: mls.events.IEvent) {

        const params: IEventsSelectedObj = ev.desc ? JSON.parse(ev.desc) : [];
        if (params.service.length > 0 && !params.service.includes(this.helper) || !this.serviceItemNav) return;
        this.serviceItemNav.setAttribute('mode', 'A');
        this.showNav2Item(true);

    }

    private onDSStyleUnSelected(ev: mls.events.IEvent) {
        const params: IEventsSelectedObj = ev.desc ? JSON.parse(ev.desc) : [];
        if (params.service.includes(this.helper) || !this.serviceItemNav) return;
        this.serviceItemNav.setAttribute('mode', 'H');
        this.showNav2Item(false);
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

        return html`${this.renderMargin()}${this.renderPadding()}`;
    }

    renderMargin() {
        return html`
            <div>
                <h5 style="display:flex; gap:1.5rem" >${this.msg.margin}<input type="checkbox" prop="margin"></h5>
                <div class="groupEdit">
                    <span>${this.msg.top}</span>
                    <collab-ds-input-range-100554 prop="margin-top" value="0px" .arraySelect=${this.tpMeasures} group="margin" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.left}</span>
                    <collab-ds-input-range-100554 prop="margin-left" value="0px" .arraySelect=${this.tpMeasures} group="margin" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554>    
                </div>
                <div class="groupEdit">
                    <span>${this.msg.bottom}</span>
                    <collab-ds-input-range-100554 prop="margin-bottom" value="0px" .arraySelect=${this.tpMeasures} group="margin" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554> 
                </div>
                <div class="groupEdit">
                    <span>${this.msg.right}</span>
                    <collab-ds-input-range-100554 prop="margin-right" value="0px" .arraySelect=${this.tpMeasures} group="margin" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554> 
                </div>
            </div>
        `;
    }

    renderPadding() {
        return html`
            <div>
                <h5 style="display:flex; gap:1.5rem" >${this.msg.padding}<input type="checkbox" prop="padding"></h5>
                <div class="groupEdit">
                    <span>${this.msg.top}</span>
                    <collab-ds-input-range-100554 prop="padding-top" value="0px" .arraySelect=${this.tpMeasures} group="padding" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.left}</span>
                    <collab-ds-input-range-100554 prop="padding-left" value="0px" .arraySelect=${this.tpMeasures} group="padding" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554>    
                </div>
                <div class="groupEdit">
                    <span>${this.msg.bottom}</span>
                    <collab-ds-input-range-100554 prop="padding-bottom" value="0px" .arraySelect=${this.tpMeasures} group="padding" @onchange="${(e: any) => this.onChangeProp(e)}"></collab-ds-input-range-100554> 
                </div>
                <div class="groupEdit">
                    <span>${this.msg.right}</span>
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
