/// <mls shortName="serviceDsStyleColumn" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

/**
 * @mlsComponentDetails {
 *  "webComponentDependencies": ["collab-ds-input-range-100554"]
 * }
 */

import { html, css, LitElement, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IMenu } from './_100554_serviceBase';
import { initCollabDSInputRange } from './_100554_collabDsInputRange';
import { initCollabDsInputSelectColor } from './_100554_collabDsInputSelectColor';

@customElement('service-ds-style-column-100554')
export class ServiceDsStyleColumn extends ServiceBase {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property() error: string = '';

    @property() helper: string = '_100554_serviceDsStyleColumn';

    constructor() {
        super();
        this.setEvents();
    }

    public details: IService = {
        icon: '&#xf07e',
        name: 'Size',
        mode: 'B',
        position: 'right',
        readOnly: false,
        tooltip: 'Size',
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
        if ( obj.emitter !== 'left' || this.visible === 'false' || obj.value.length <= 0) return;

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
        return html`<p> Hello, ${this.error} !</p>`;
    }

    //-------------IMPLEMENTS--------------

    private tpMeasures = ['px', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax', 'ex', 'ch', 'auto'];

    private tpOverflow = ['none', 'auto', 'hidden', 'inherit', 'initial', 'overlay', 'revert', 'scroll', 'unset', 'visible']


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

        if (m.width) this.myMsg.width = m.width;

    }

    private myMsg = {
        width: 'Width',
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
    1: initCollabDSInputRange;
    2:initCollabDsInputSelectColor
}
