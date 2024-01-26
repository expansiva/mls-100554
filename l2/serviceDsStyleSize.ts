/// <mls shortName="serviceDsStyleSize" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IMenu } from './_100554_serviceBase';

@customElement('service-ds-style-size-100554')
export class SimpleGreeting extends ServiceBase {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property() error: string = '';

    @property() helper: string = '_100554_serviceDsStyleSize';

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

        if (visible && this.menu.setIconActive) {

        }
    }

    //-------------EVENTS--------------

    private setEvents(): void {
        mls.events.addEventListener([3], ['DSStyleChanged'], (ev) => {
            console.info(ev.desc);
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
		if (rc.helper === this.constructor.name) {
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
                <h5>${this.myMsg.width}</h5>
                <div class="groupEdit">
                    <span>${this.myMsg.width}</span>
                    ${this.renderInputRangeAndSearch('width', this.tpMeasures,
            0, 0, -1, this.onChangeProp.bind(this)
        )}
                </div>
                <div class="groupEdit">
                    <span>${this.myMsg.maxWidth}</span>
                    ${this.renderInputRangeAndSearch('max-width', this.tpMeasures,
            0, 0, -1, this.onChangeProp.bind(this)
        )}
                </div>
                <div class="groupEdit">
                    <span>${this.myMsg.minWidth}</span>
                    ${this.renderInputRangeAndSearch('min-width', this.tpMeasures,
            0, 0, -1, this.onChangeProp.bind(this)
        )}
                </div>
            </div>
        `;

    }

    renderHeight() {

        return html`
            <div>
                <h5>${this.myMsg.height}</h5>
                <div class="groupEdit">
                    <span>${this.myMsg.height}</span>
                    ${this.renderInputRangeAndSearch('height', this.tpMeasures,
            0, 0, -1, this.onChangeProp.bind(this)
        )}
                </div>
                <div class="groupEdit">
                    <span>${this.myMsg.maxHeight}</span>
                    ${this.renderInputRangeAndSearch('max-height', this.tpMeasures,
            0, 0, -1, this.onChangeProp.bind(this)
        )}
                </div>
                <div class="groupEdit">
                    <span>${this.myMsg.minHeight}</span>
                    ${this.renderInputRangeAndSearch('min-height', this.tpMeasures,
            0, 0, -1, this.onChangeProp.bind(this)
        )}
                </div>
            </div>
        `;

    }

    renderOverflow() {

        return html`
            <div>
                <h5>${this.myMsg.overflow}</h5>
                <div class="groupEdit">
                    <span>${this.myMsg.overflow}</span>
                    <input type="checkbox"></input>
                </div>
                <div class="groupEdit">
                    <span>${this.myMsg.overflowX}</span>
                    <select>
                        ${repeat(
            this.tpOverflow,
            ((key: any) => key) as any,
            ((k: any, index: any) => {

                return html`<option value="${k}">${k}</option>`;

            }) as any
        )}
                    </select>
                </div>
                <div class="groupEdit">
                    <span>${this.myMsg.overflowY}</span>
                    <select>
                        ${repeat(
            this.tpOverflow,
            ((key: any) => key) as any,
            ((k: any, index: any) => {

                return html`<option value="${k}">${k}</option>`;

            }) as any
        )}
                    </select>
                </div>
            </div>
        `;

    }

    renderInputRangeAndSearch(prop: string, ar: string[], init: number, min: number, max: number, fcChange: Function) {

        return html`
            <serv-group-input-range .onchange=${fcChange} .prop="${prop}">
                <input type="range" .value="${init}" min="${min}" max="${max < 0 ? '' : max}" @input="${this.changeRange}">
                <div>
                    <input type="search" .value="${init}" @input="${this.changeInput}">
                    <select @change="${this.changeSelect}">
                        ${repeat(
            ar,
            ((key: any) => key) as any,
            ((k: any, index: any) => {

                return html`<option value="${k}">${k}</option>`;

            }) as any
        )}
                    </select>
                </div>
            </serv-group-input-range>
        `
    }

    //------------IMPLEMENTS-----------

    private tpMeasures = ['px', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax', 'ex', 'ch', 'auto'];

    private tpOverflow = ['none', 'auto', 'hidden', 'inherit', 'initial', 'overlay', 'revert', 'scroll', 'unset', 'visible']

    private changeRange(e: InputEvent): void {
        this.allChange(e, 'range')
    }

    private changeInput(e: InputEvent): void {
        this.allChange(e, 'input')
    }

    private changeSelect(e: InputEvent): void {
        this.allChange(e, 'sel')
    }

    private allChange(e: InputEvent, mode: string): void {

        e.stopPropagation();
        const el = e.target as HTMLInputElement;
        if (!el) return;

        const parent = el.closest('serv-group-input-range');
        if (!parent) return;

        let input = parent.querySelector('input[type="search"]') as HTMLInputElement;

        let range = parent.querySelector('input[type="range"]') as HTMLInputElement;

        let sel = parent.querySelector('select') as HTMLSelectElement;

        if (!input || !sel || !range) return;

        if (mode === 'range') {
            input.value = range.value;
        } else if (mode === 'input') {

            const regexNum = /\d+/;
            const tot = input.value.match(regexNum);
            const max = range.getAttribute('max');
            if (!max || max < (tot as any)[0]) range.setAttribute('max', (tot as any)[0]);
            range.value = (tot as any)[0];
        }

        if ((parent as any).onchange) (parent as any).onchange(
            {
                key: (parent as any).prop,
                value: input.value + sel.value
            }
        );

    }

    private timeonChangeProp = -1;
    private onChangeProp(obj: IBlockLessLine) {
        clearTimeout(this.timeonChangeProp);
        this.timeonChangeProp = setTimeout(() => {
            this.emitEvent(obj);
        }, 500);
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
        if (m.maxWidth) this.myMsg.maxWidth = m.maxWidth;
        if (m.minWidth) this.myMsg.minWidth = m.minWidth;
        if (m.height) this.myMsg.height = m.height;
        if (m.maxHeight) this.myMsg.maxHeight = m.maxHeight;
        if (m.minHeight) this.myMsg.minHeight = m.minHeight;
        if (m.overflow) this.myMsg.overflow = m.overflow;
        if (m.overflowX) this.myMsg.overflowX = m.overflowX;
        if (m.overflowY) this.myMsg.overflowY = m.overflowY;

    }

    private myMsg = {
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
