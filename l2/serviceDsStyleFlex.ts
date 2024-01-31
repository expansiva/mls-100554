/// <mls shortName="serviceDsStyleFlex" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

/**
 * @mlsComponentDetails {
 *  "webComponentDependencies": ["collab-ds-input-range-100554"]
 * }
 */

import { html, css, LitElement, repeat, unsafeHTML } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IMenu } from './_100554_serviceBase';
import { initCollabDSInputRange } from './_100554_collabDsInputRange';

@customElement('service-ds-style-flex-100554')
export class ServiceDsStyleFlex extends ServiceBase {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property() error: string = '';

    @property() helper: string = '_100554_serviceDsStyleFlex';

    constructor() {
        super();
        initCollabDSInputRange;
        this.setEvents();
    }

    public details: IService = {
        icon: '&#xf009',
        name: 'Flex',
        mode: 'B',
        position: 'right',
        readOnly: false,
        tooltip: 'Flex',
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
        title: 'Flex',
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
        return html`${this.renderFlex()}${this.renderFlexItem()}${this.renderGallery()}`;
    } 

    renderFlex() {
        return html`
            <div>
                <h5>Flex</h5>
                <div class="groupEdit">
                    <span>${this.myMsg.display}</span>
                    <select style="width:150px" prop="display">
                        <option value=""></option>
                        <option value="flex">Flex</option>
                        <option value="inline-flex">Inline Flex</option>
                    </select>
                </div>
                <div class="groupEdit">
                    <span>${this.myMsg.flexDirection}</span>
                    <select style="width:150px" prop="flex-direction">
                        <option value=""></option>
                        <option value="row">Row</option>
                        <option value="row-reverse">Row Reverse</option>
                        <option value="column">Column</option>
                        <option value="column-reverse">Column Reverse</option>
                    </select>   
                </div>
                <div class="groupEdit">
                    <span>${this.myMsg.flexWrap}</span>
                    <select style="width:150px" prop="flex-wrap">
                        <option value=""></option>
                        <option value="nowrap">Nowrap</option>
                        <option value="wrap">Wrap</option>
                        <option value="wrap-reverse">Wrap Reverse</option>
                    </select>  
                </div>
                <div class="groupEdit">
                    <span>${this.myMsg.justifyContent}</span>
                    <select style="width:150px" prop="justify-content">
                        <option value=""></option>
                        <option value="flex-start">Flex start</option>
                        <option value="flex-end">Flex end</option>
                        <option value="center">Center</option>
                        <option value="space-between">Space between</option>
                        <option value="space-around">Space around</option>
                    </select>  
                </div>
                <div class="groupEdit">
                    <span>${this.myMsg.alignItems}</span>
                    <select style="width:150px" prop="align-items">
                        <option value=""></option>
                        <option value="flex-start">Flex start</option>
                        <option value="flex-end">Flex end</option>
                        <option value="center">Center</option>
                        <option value="baseline">Baseline</option>
                        <option value="stretch">Stretch</option>
                    </select>  
                </div>
                <div class="groupEdit">
                    <span>${this.myMsg.alignContent}</span>
                    <select style="width:150px" prop="align-content">
                        <option value=""></option>
                        <option value="flex-start">Flex start</option>
                        <option value="flex-end">Flex end</option>
                        <option value="center">Center</option>
                        <option value="space-between">Space between</option>
                        <option value="space-around">Space around</option>
                        <option value="stretch">Stretch</option>
                    </select>  
                </div>
            </div>
        
        `;
    }

    renderFlexItem() {
        return html`
            <div>
                <h5>Flex-Item</h5>
                <div class="groupEdit">
                    <span>${this.myMsg.alignSelf}</span>
                    <select style="width:150px" prop="align-self">
                        <option value=""></option>
                        <option value="auto">auto</option>
                        <option value="flex-start">Flex start</option>
                        <option value="flex-end">Flex end</option>
                        <option value="center">Center</option>
                        <option value="baseline">Baseline</option>
                        <option value="stretch">Stretch</option>
                    </select>
                </div>
                <div class="groupEdit">
                    <span>${this.myMsg.order}</span>
                    <select style="width:150px" prop="order">
                        <option value=""></option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        
                    </select>   
                </div>
                
            </div>
        
        `;
    }

    renderGallery() {

        return html`
            <div style="display: flex; justify-content: center; align-items: center; gap: 1rem; padding: 1rem; flex-wrap: wrap; cursor:pointer;border:none">
                ${repeat(this.arrayGallery.slice(0,4), ((key: any) => key) as any,
                    ((css: any, index: any) => {
            
                        return html`<div style="${css}" @click="${this.clickGallery}" .gallery=${css}>
                            <span style="background: #363636; padding: 0.5rem; margin: 0.25rem;"></span>
                            <span style="background: #363636; padding: 0.5rem; margin: 0.25rem;"></span>
                            <span style="background: #363636; padding: 0.5rem; margin: 0.25rem;"></span>
                        </div>`;
                    }) as any
                )}
            </div>
            <div style="display: flex; justify-content: center; align-items: center; gap: 1rem; padding: 1rem; flex-wrap: wrap; cursor:pointer">
                ${repeat(this.arrayGallery.slice(4,8), ((key: any) => key) as any,
                    ((css: any, index: any) => {
            
                return html`<div style="${css}" @click="${this.clickGallery}" .gallery=${css}>
                    <span style="background: #363636; padding: 0.5rem; margin: 0.25rem;"></span>
                    <span style="background: #363636; padding: 0.5rem; margin: 0.25rem;"></span>
                    <span style="background: #363636; padding: 0.5rem; margin: 0.25rem;"></span>
                </div>`;
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

    private clickGallery(e: MouseEvent): void {

        const el = e.target as HTMLElement;
        if (!el) return;
        const css = (el as any).gallery;
        if (!css) return;

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

        const rc: IEventsObj = {
            emitter: 'right',
            value: changes,
            helper: this.helper
        };

        mls.events.fire([3], ['DSStyleChanged'], JSON.stringify(rc));

    }

    private arrayGallery = [
        'display: flex;flex-direction: row; justify-content: flex-start;border: 1px solid #cccccc;margin-left: 10px; width:120px;padding: 5px; cursor: pointer;background:white',
        'display: flex; flex-direction: row; justify-content: flex-end; border: 1px solid rgb(204, 204, 204); margin-left: 10px; width: 120px; padding: 5px; cursor: pointer;background:white',
        'display: flex; flex-direction: row; justify-content: center; border: 1px solid rgb(204, 204, 204); margin-left: 10px; width: 120px; padding: 5px; cursor: pointer;background:white',
        'display: flex; flex-direction: row; justify-content: space-between; border: 1px solid rgb(204, 204, 204); margin-left: 10px; width: 120px; padding: 5px; cursor: pointer;background:white',
        'display: flex;flex-direction: column; justify-content: flex-start;border: 1px solid #cccccc;margin-left: 10px; width:60px;height:200px; padding: 5px; cursor: pointer;background:white',
        'display: flex;flex-direction: column; justify-content: flex-end;border: 1px solid #cccccc;margin-left: 10px; width:60px;height:200px; padding: 5px; cursor: pointer;background:white',
        'display: flex;flex-direction: column; justify-content: center;border: 1px solid #cccccc;margin-left: 10px; width:60px;height:200px; padding: 5px; cursor: pointer;background:white',
        'display: flex;flex-direction: column; justify-content: space-between;border: 1px solid #cccccc;margin-left: 10px; width:60px;height:200px; padding: 5px; cursor: pointer;background:white'

    ];

    private updateMyMessages() {

        if (!window['message' as any]) return;
        const m = window['message' as any] as any;

        if (m.display) this.myMsg.display = m.display;
        if (m.flexDirection) this.myMsg.flexDirection = m.flexDirection;
        if (m.flexWrap) this.myMsg.flexWrap = m.flexWrap;
        if (m.justifyContent) this.myMsg.justifyContent = m.justifyContent;
        if (m.alignItems) this.myMsg.alignItems = m.alignItems;
        if (m.alignContent) this.myMsg.alignContent = m.alignContent;
        if (m.alignSelf) this.myMsg.alignSelf = m.alignSelf;
        if (m.order) this.myMsg.order = m.order;

    }

    private myMsg = {
        display: 'Display',
        flexDirection: 'Flex direction',
        flexWrap: 'Flex wrap',
        justifyContent: 'Justify content',
        alignItems: 'Align items',
        alignContent: 'Align content',
        alignSelf: 'Align self',
        order: 'Order'
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