/// <mls shortName="serviceDsStyleBackground" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

/**
 * @mlsComponentDetails {
 *  "webComponentDependencies": ["collab-ds-input-range-100554"]
 * }
 */

import { html, css, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IMenu } from './_100554_serviceBase';

@customElement('service-ds-style-background-100554')
export class ServiceDsStyleBackground extends ServiceBase {

    private myUpp = false;

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property() error: string = '';

    @property() helper: string = '_100554_serviceDsStyleBackground';

    constructor() {
        super();
        this.setEvents();
    }

    public details: IService = {
        icon: '&#xf0db',
        name: 'Background',
        mode: 'B',
        position: 'right',
        readOnly: false,
        tooltip: 'Background',
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
        title: 'Background',
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

    private setValues(ar: IBlockLessLine[]): void{

        this.myUpp = true;
        ar.forEach((i: any) => {

            if (!this.shadowRoot || !i.key) return;
            const value = i.value;
            const prop = i.key;
            const el = this.shadowRoot.querySelector('*[prop="' + prop + '"]') as HTMLInputElement;
            if (el) el.value = value;

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
        this.updateMyMessages();


    }

    render() {
        return html`ok`;
    }

    //-------------IMPLEMENTS--------------

    private timeonChangeProp = -1;
    private onChangeProp(obj: IBlockLessLine) {
        clearTimeout(this.timeonChangeProp);
        this.timeonChangeProp = setTimeout(() => {
            this.emitEvent(obj);
        }, 500);
    }

    private onChangeProp2(prop: string) {
        clearTimeout(this.timeonChangeProp);
        this.timeonChangeProp = setTimeout(() => {
            if (!this.shadowRoot) return;
            const el = this.shadowRoot.querySelector('*[prop="' + prop + '"]') as HTMLSelectElement;
            this.emitEvent({ key: prop, value: el.value });
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

    private updateMyMessages() {

        if (!window['message' as any]) return;
        const m = window['message' as any] as any;

        if (m.columnsCount) this.myMsg.columnsCount = m.columnsCount;
        

    }

    private myMsg = {
        columnsCount: 'Columns Count',
        
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
