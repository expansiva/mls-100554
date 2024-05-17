/// <mls shortName="serviceDsStyleSize" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
/**
 * @mlsComponentDetails {
 *  "webComponentDependencies": ["collab-ds-input-range-100554"]
 * }
 */

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IMenu } from './_100554_serviceBase';
import { initCollabDSInputRange } from './_100554_collabDsInputRange';

/// **collab_i18n_start**
const message_pt = {
    width: 'Largura',
    maxWidth: 'Largura máxima',
    minWidth: 'Largura mínima',
    height: 'Altura',
    maxHeight: 'Altura máxima',
    minHeight: 'Altura mínima',
    overflow: 'Overflow',
    overflowX: 'Overflow-x',
    overflowY: 'Overflow-y'
}

const message_en = {
    width: 'Width',
    maxWidth: 'Max Width',
    minWidth: 'Min Width',
    height: 'Height',
    maxHeight: 'Max Height',
    minHeight: 'Min Height',
    overflow: 'Overflow',
    overflowX: 'Overflow-x',
    overflowY: 'Overflow-y'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-ds-style-size-100554')
export class ServiceDsStyleSize extends ServiceBase {

    private msg: MessageType = messages['en'];
    
    private myUpp = false;

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property() error: string = '';

    @property() helper: string = '_100554_serviceDsStyleSize';

    constructor() {
        super();
        initCollabDSInputRange();
        this.setEvents();
    }

    public details: IService = {
        icon: '&#xf07e',
        state: 'foreground',
        position: 'right',
        tooltip: 'Size',
        visible: false,
        widget: '_100554_serviceDsStyleSize',
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
        title: 'Size',
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

            if (prop === 'overflow') {

                const elGroup = this.shadowRoot.querySelector('*[prop="overflow"]') as HTMLInputElement;

                const el = this.shadowRoot.querySelector('*[prop="overflow-x"]') as HTMLSelectElement;

                const el2 = this.shadowRoot.querySelector('*[prop="overflow-y"]') as HTMLSelectElement;

                if (elGroup) elGroup.checked = true;
                if (el) el.value = value;
                if (el2) el2.value = value;

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

        if (this.error) return html`<h3 style="color:red">${this.error}</h3>`;
        return this.renderBody();
    }

    renderBody() {
        return html`
            ${this.renderWidth()}
            ${this.renderHeight()}
            ${this.renderOverflow()}
        `
    }

    renderWidth() {

        return html`
            <div>
                <h5>${this.msg.width}</h5>
                <div class="groupEdit">
                    <span>${this.msg.width}</span>
                    <collab-ds-input-range-100554 prop="width" value="0px" .arraySelect=${this.tpMeasures} @onchange="${(e: any) => this.onChangeProp(e.detail)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.maxWidth}</span>
                    <collab-ds-input-range-100554 prop="max-width" value="0px" .arraySelect=${this.tpMeasures} @onchange="${(e: any) => this.onChangeProp(e.detail)}"></collab-ds-input-range-100554>    
                </div>
                <div class="groupEdit">
                    <span>${this.msg.minWidth}</span>
                    <collab-ds-input-range-100554 prop="min-width" value="0px" .arraySelect=${this.tpMeasures} @onchange="${(e: any) => this.onChangeProp(e.detail)}"></collab-ds-input-range-100554>
                </div>
            </div>
        `;

    }

    renderHeight() {

        return html`
            <div>
                <h5>${this.msg.height}</h5>
                <div class="groupEdit">
                    <span>${this.msg.height}</span>
                    <collab-ds-input-range-100554 prop="height" value="0px" .arraySelect=${this.tpMeasures} @onchange="${(e: any) => this.onChangeProp(e.detail)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.maxHeight}</span>
                    <collab-ds-input-range-100554 prop="max-height" value="0px" .arraySelect=${this.tpMeasures} @onchange="${(e: any) => this.onChangeProp(e.detail)}"></collab-ds-input-range-100554>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.minHeight}</span>
                    <collab-ds-input-range-100554 prop="min-height" value="0px" .arraySelect=${this.tpMeasures} @onchange="${(e: any) => this.onChangeProp(e.detail)}"></collab-ds-input-range-100554>
                </div>
            </div>
        `;

    }

    renderOverflow() {

        return html`
            <div>
                <h5>${this.msg.overflow}</h5>
                <div class="groupEdit">
                    <span>${this.msg.overflow}</span>
                    <input type="checkbox" prop="overflow"></input>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.overflowX}</span>
                    <select @change="${(e: MouseEvent) => this.onChangeProp2('overflow-x')}" prop="overflow-x" group="overflow">
                        <option value="none">none</option>
                        <option value="auto">auto</option>
                        <option value="hidden">hidden</option>
                        <option value="inherit">inherit</option>
                        <option value="initial">initial</option>
                        <option value="overlay">overlay</option>
                        <option value="revert">revert</option>
                        <option value="scroll">scroll</option>
                        <option value="unset">unset</option>
                        <option value="visible">visible</option>
                    </select>
                </div>
                <div class="groupEdit">
                    <span>${this.msg.overflowY}</span>
                    <select @change="${this.onChangeProp2}" prop="overflow-y" group="overflow">
                        <option value="none">none</option>
                        <option value="auto">auto</option>
                        <option value="hidden">hidden</option>
                        <option value="inherit">inherit</option>
                        <option value="initial">initial</option>
                        <option value="overlay">overlay</option>
                        <option value="revert">revert</option>
                        <option value="scroll">scroll</option>
                        <option value="unset">unset</option>
                        <option value="visible">visible</option>
                    </select>
                </div>
            </div>
        `;

    }


    //------------IMPLEMENTS-----------

    private tpMeasures = ['px', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax', 'ex', 'ch', 'auto'];

    private onChangeProp2(prop: string) {
        clearTimeout(this.timeonChangeProp);
        this.timeonChangeProp = setTimeout(() => {

            if (!this.shadowRoot) return;

            const elGroup = this.shadowRoot.querySelector('*[prop="overflow"]') as HTMLInputElement;

            const isGroup = elGroup && elGroup.checked;

            if (isGroup) {

                const el = this.shadowRoot.querySelector('*[prop="' + prop + '"]') as HTMLSelectElement;

                const el2 = this.shadowRoot.querySelector('*[prop="' + (prop === 'overflow-x' ? 'overflow-y' : 'overflow-x') + '"]') as HTMLSelectElement;

                if (el2) el2.value = el.value;

                this.emitEvent({ key: 'overflow', value: el.value });

            } else {

                const el = this.shadowRoot.querySelector('*[prop="' + prop + '"]') as HTMLSelectElement;
                this.emitEvent({ key: prop, value: el.value });

            }

        }, 500);
    }

    private timeonChangeProp = -1;
    private onChangeProp(obj: IBlockLessLine) {
        clearTimeout(this.timeonChangeProp);
        this.timeonChangeProp = setTimeout(() => {
            this.emitEvent(obj);
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
        if ((obj as any).target) delete (obj as any).target;
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
