/// <mls shortName="serviceDsComponentsList" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html, css, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';
import { collab_cubes, collab_caret_righttv } from './_100554_collabIcons';

/// **collab_i18n_start**
const message_pt = {
}

const message_en = {
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-ds-components-list-100554')
export class ServiceDsComponentsList100554 extends ServiceBase {

    private msg: MessageType = messages['en'];
     
    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property() itens: IServiceComponents[] = [];

    @property() error: string = '';

    @property()
    private selectWidget: string | undefined;

    private ds: mls.l3.DesignSystemIO | undefined;

    constructor() {
        super();
        this.setEvents();
    }

    public details: IService = {
        icon: '&#xf1b3',
        state: 'foreground',
        position: 'left',
        tooltip: 'Components',
        visible: true,
        tags: ['ds_components'],
        widget: '_100554_serviceDsComponentsList',
        level: [3]
    }

    public onClickLink = (op: string): boolean => {
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'Details',
        actions: {
        },
        icons: {},
        actionDefault: '', // call after close icon clicked
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        getLastMode: undefined,
        updateTitle: undefined
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

        if (visible) {
            this.init();
            mls.events.fire([this.level], ['DSWidgetsSelected'], '', 300);
        } else {
            mls.events.fire([this.level], ['DSWidgetsUnSelected'], '', 0);
        }
    }

    //--------------- COMPONENTE---------------

    connectedCallback() {
        super.connectedCallback();
        this.updateMyMessages();
        this.init();
    }

    render() {

        if (this.error !== '') {

            setTimeout(() => this.error = '', 3000);
            return html`${this.error}`;

        }
        return html` ${this.itens
            ? this.renderItens() : this.renderNoItens()}
            
        `
    }


    renderNoItens() {
        return html`
            <span>${this.myMsg.noItems}</span>  
        `
    }

    renderItens() {

        return html`
            
                <ul>
                    ${repeat(this.itens.sort((a, b) => a.group.localeCompare(b.group)),
            ((i: IServiceComponents) => i.group) as any,
            ((item: IServiceComponents, index: any) => {

                return this.renderGroup(item, index);

            }) as any
        )}
                </ul> 
        
        `
    }
    
    renderGroup(item: IServiceComponents, index: number) {

        return html`
        <li @click=${this.openMeList}>

            <div style="display:flex; align-items:center;">
                ${collab_caret_righttv}
                <label style="font-weight:500">${item.group}</label>
            </div>
            <ul>
                ${repeat(item.components.sort((a, b) => a.name.localeCompare(b.name)),
            ((i: mls.l3.IComponentInfo) => i.name) as any,
            ((it: mls.l3.IComponentInfo, indexI: any) => {

                return this.renderComponent(it, indexI);

            }) as any
        )}
            </ul>
        </li>
        `;

    }

    renderComponent(item: mls.l3.IComponentInfo, index: number) {

        return html`
        <li
            style="padding-left: 1.1rem;"
            class=${item.name === this.selectWidget ? 'selected' : ''} 
            .item=${item} 
            @click=${(e: MouseEvent) => { this.openComponent(e, item.name) }}
        > 
            <div style="display:flex;align-items:center;gap:.5rem">
                ${collab_cubes}
                <span>${item.name}</span>
            </div>
        </li>
        `;

    }



    //------------------- EVENTS---------------

    setEvents() {
        mls.events.addListener(3, 'DSWidgetsChanged', (ev) => this.onDsWidgetsChanged(ev));

    }

    //----------- IMPLEMENTATION---------------

    private async init() {

        try {

            this.showLoader(true);

            const { project } = mls.actual[5];
            const { mode } = mls.actual[3];

            this.ds = mls.l3.getDSInstance(project as any, mode);
            if (!this.ds) throw new Error('No found getDSInstance:' + mode + ',' + project);

            await this.ds.init();
            this.setList();

            this.showLoader(false);

        } catch (e) {
            console.info(e);
            this.showLoader(false);
        }
    }

    private setList(): void {

        if (!this.ds) return;
        const { list } = this.ds.components;
        const components: mls.l3.IComponentInfo[] = [];

        Object.keys(list).forEach((comp) => {
            components.push(list[comp]);
        });

        const groupedData = components.reduce((acc: any, obj) => {
            const key = obj.group;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(obj);
            return acc;
        }, {});

        const rc: IServiceComponents[] = [];

        Object.keys(groupedData).forEach((group) => {
            const obj: IServiceComponents = {
                group,
                icon: 'fa-solid fa-bolt',
                components: groupedData[group]
            };
            rc.push(obj);
        });

        this.itens = rc;

    }

    private onDsWidgetsChanged(ev: mls.events.IEvent) {
        if (!ev.desc) return;
        const data: IEventDSWidgetsChangedParams = JSON.parse(ev.desc);
        if (data.position === this.position) return;
        if(data.op === 'update') this.setList();
    }

    private openComponent(e: MouseEvent, widget:string) {
        e.stopPropagation();
        let el = e.target as HTMLElement;
        if (!el) return;
        el = el.closest('li') as HTMLElement;
        if (!el) return;
        this.selectWidget = widget;
        const info: mls.l3.IComponentInfo = (el as any).item;
        this.fireComunication(info);
    }

    private openMeList(e: MouseEvent) {

        e.stopPropagation();
        const el = e.target as HTMLElement;
        if (!el) return;

        const li = el.closest('li') as HTMLElement;
        if (!li) return;
        li.classList.toggle('open');


    }

    private timeShowLoader = -1;
    private showLoader(show: boolean): void {

        clearTimeout(this.timeShowLoader);
        this.timeShowLoader = setTimeout(() => {
            this.loading = show;
        }, 200);

    }

    private updateMyMessages() {

        if (!window['message' as any]) return;
        const m = window['message' as any] as any;

        if (m.noItems) this.myMsg.noItems = m.noItems;

    }

    private myMsg = {
        noItems: 'No items'
    }

    public fireComunication(info: mls.l3.IComponentInfo): void {
        const obj: IEventDSWidgetsChangedParams = {
            op: 'widgets',
            position: this.position,
            value: info
        };
        mls.events.fire([this.level], ['DSWidgetsChanged'], JSON.stringify(obj), 300);
    }

}

export interface IEventDSWidgetsChangedParams {
    op: 'widgets' | 'update',
    position: string,
    value: mls.l3.IComponentInfo | undefined
}

interface IServiceComponents {
    group: string,
    icon: string,
    components: mls.l3.IComponentInfo[]
}

interface IServiceWidgetsItens {
    name: string,
    icon: string,
    text: string,
    examples: IServiceWidgetsExamples[],
    styles: IServiceWidgetsStyles[],
}

interface IServiceWidgetsExamples {
    json: string,
    className: string,
}

interface IServiceWidgetsStyles {
    cls: string,
    less: string,
}
