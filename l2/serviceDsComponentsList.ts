/// <mls shortName="serviceDsComponentsList" project="100554" enhancement="_100554_enhancementLit" groupName="service" />

import { html, css, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

@customElement('service-ds-components-list-100554')
export class ServiceDsComponentsList100554 extends ServiceBase {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @property() itens: IServiceComponents[] = [];

    @property() error: string = '';

    private ds: mls.l3.DesignSystemIO | undefined;

    constructor() {
        super();
        this.setEvents();
    }

    public details: IService = {
        icon: '&#xf02d',
        state: 'foreground',
        position: 'left',
        tooltip: 'Components Design System',
        visible: true,
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
                    ${repeat(this.itens,
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
        <li @click="${this.openMeList}">
            <div>
                <span class="fatv fa-caret-righttv" >
                </span>
                <label style="font-weight:500">${item.group}</label>
            </div>
            <ul>
                ${repeat(item.components,
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
        <li style="padding-left: 1.1rem;" .item=${item} @click="${this.openComponent}"> 
            <div style="display:flex;align-items:center;gap:.5rem">
                <span class="fa fa-cubes"></span>
                <span>${item.name}</span>
            </div>
        </li>
        `;

    }

    

    //------------------- EVENTS---------------

    setEvents() {

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

    private openComponent(e: MouseEvent) {

        e.stopPropagation();
        let el = e.target as HTMLElement;
        if (!el) return;
        el = el.closest('li') as HTMLElement;
        if (!el) return;
        
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

        const obj = {
			op: 'widgets',
			value: info.name
		};

		mls.events.fire([this.level], ['DSWidgetsSelected'], JSON.stringify(obj), 800);

	}


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
