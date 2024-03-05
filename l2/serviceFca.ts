/// <mls shortName="serviceFca" project="100554" enhancement="_100554_enhancementLitService" groupName="service" />

import { html, css, unsafeHTML, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { convertTagToFileName } from './_100554_utilsLit';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

//teste
@customElement('service-fca-100554')
export class ServiceFca100554 extends ServiceBase {

    static styles = css``

    @property()
    activeTab: ITabType = 'AboutFCA';

    @property()
    forceUpdate: string = '0';

    constructor() {
        super();
        this.setEvents();
    }

    public details: IService = {
        icon: '&#xf2db',
        state: 'background',
        position: 'left',
        tooltip: 'Service FCA',
        visible: true,
        widget: '_100554_serviceFca',
        level: [4]
    }

    public onClickIcon = (op: string): void => {
        this.activeTab = op as ITabType;
    }

    public menu: IMenu = {
        title: '',
        actions: {
        },
        icons: {
            AboutFCA: 'About FCA;3f',
            Navigation: 'Navigation;f041',
            Properties: 'Properties;f0ce',
            Styles: 'Styles;f5ad',
            Animation: 'Animation;f5ae',
        },
        actionDefault: '', // call after close icon clicked
        iconDefault: 'AboutFCA',
        setMode: undefined, // child will set this
        onClickIcon: this.onClickIcon,
        getLastMode: undefined,
        updateTitle: undefined
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

        if (!visible && !reinit && this.menu.setIconActive) {
            this.menu.setIconActive('Navigation');
        }

    }

    //--------------COMPONENT---------------

    createRenderRoot() {
        return this;
    }

    render() {
        return html`
            <div style="display:none">${this.forceUpdate}</div>
            ${this.renderContent()}
        `;
    }

    renderContent() {
        switch (this.activeTab) {
            case 'Navigation':
                return this.renderNavigation();
            case 'Properties':
                return this.renderProperties();
            case 'Styles':
                return this.renderStyles();
            case 'Animation':
                return this.renderAnimation();
            case 'AboutFCA':
                return this.renderAboutFCA();
            default:
                return html``;
        }
    }

    renderNavigation() {
        const ar = this.getFCAComponents();
        return this.createNavigation(ar);
        //return html`<div>In develpoment: Navigation</div>`;
    }

    renderProperties() {
        return html`<div>In develpoment: Properties</div>`;
    }

    renderStyles() {
        return html`<div></div>`;
    }

    renderAnimation() {
        return html`<div>In develpoment: Animation</div>`;
    }

    renderAboutFCA() {
        return html`<div>In develpoment: AboutFCA</div>`;
    }

    //------------IMPLEMENTATION------------------

    private setEvents(): void {
        mls.events.addListener(4, 'WCDEvent' as any, (ev) => this.onWCDEvent(ev));
        mls.events.addListener(4, 'WCDEventChange' as any, (ev) => this.onWCDEventChange(ev));
    }

    private onWCDEvent(ev: mls.events.IEvent) {

        if (!ev.desc) return;
        const data: IWCDParams = JSON.parse(ev.desc);
        if (this.menu.setIconActive) {
            this.openMe();
            this.menu.setIconActive(data.op);
        }

    }

    private onWCDEventChange(ev: mls.events.IEvent) {
        
        if (this.activeTab !== 'Navigation') return;
        this.forceUpdate = (+this.forceUpdate + 1).toString();

    }

    private servicePreview: HTMLElement | undefined;
    private setServicePreview(): void {
        if (this.servicePreview) return;

        const nav3 = this.nav3Service;
        if (!nav3) return;

        const wc = (nav3 as any).getActiveInstance('right');
        if (!wc) return;

        if (wc.tagName.toLowerCase() === 'service-preview-100554') {
            this.servicePreview = wc;
        }

    }

    private getFCAComponents(): IInfoElCholdren[] {

        this.setServicePreview();

        let ret: IInfoElCholdren[] = [];

        if (!this.servicePreview || !this.servicePreview.parentElement) return ret;

        const view = this.servicePreview.parentElement.querySelector('service-preview-view-100554') as HTMLElement;

        if (!view.shadowRoot) return ret;

        const iframe = view.shadowRoot.querySelector('iframe') as HTMLIFrameElement;
        if (!iframe) return ret;

        const scope = iframe.contentDocument?.body;
        if (!scope) return ret;

        const reentrance = (array: IInfoElCholdren[], el: HTMLElement | HTMLElement) => {

            const tag = el.tagName.toLowerCase();
            let info: IInfoElCholdren | undefined;
            if (tag.startsWith('fca-')) {

                info = { el: el as HTMLElement, children: [] as any };
                array.push(info);

            }

            const isGroup = el.getAttribute('isFCAGroup');

            if (!isGroup || isGroup === 'false') {
                Array.from(el.children).forEach(i => {
                    reentrance(info ? info.children : array, i as HTMLElement);
                })
            }

        }

        Array.from(scope.children).forEach(i => {
            reentrance(ret, i as HTMLElement);
        })
        return ret;

    }

    private createNavigation(array: IInfoElCholdren[]) {

        return html`
            <ul>
                ${repeat(array, ((key: IInfoElCholdren, idx: number) => key.el.tagName + idx) as any, ((item: IInfoElCholdren, index: any) => {
                    
                    return this.renderItemTree(item, index);

                    }) as any
                )}
            </ul><style>${this.myCss}</style>`;
    }

    renderItemTree(item: IInfoElCholdren, idx:string) {

        const name = convertTagToFileName(item.el.tagName.toLocaleLowerCase());
        return html`
            <li>
                <div id="${name+idx}" class="header" @click="${(e: MouseEvent) => this.selectItem(e, item)}">
                    ${name}
                </div>
                <ul>
                    ${repeat( item.children, ((c: IInfoElCholdren, idx:number) => c.el.tagName + idx) as any, ((i: any, idxI: any) => {

                            return this.renderItemTree(i,idx+'_'+idxI);

                        }) as any
                    )}
                </ul>
            </li>
        `;

    }

    private selectItem(e: MouseEvent, item: IInfoElCholdren): void {

        e.stopPropagation();
        const target = e.target as HTMLElement;

        const father = item.el.closest('*[rendertype="editactive"]');
        if (father) {

            const id = target.id;
            item.el.click();
            setTimeout(() => {
                const me = this.querySelector('#' + id) as HTMLElement;
                if(me) me.click();
            },150);

        }else item.el.click();
        
    }

    private myCss =  `
        service-fca-100554{
            padding: 1rem;
            display:block;
        }
        service-fca-100554 ul {
            list-style: none;
            padding: 0px 0rem 0rem 1rem;
            border-left: 1px solid #d4d4d4;
        }

        service-fca-100554 ul li {
            position: relative;

        }

        service-fca-100554 ul li .header {
            padding: .4rem;
            cursor: pointer;
        }

        service-fca-100554 ul li .header:hover {
            border: 1px solid #d4d4d4;

        }

        service-fca-100554 ul li:before {
            content: ' ';
            position: absolute;
            width: 15px;
            height: 1px;
            background: #d4d4d4;
            top: 1.2rem;
            left: -16px;
        }
    `;
    

}

export type ITabType = 'Navigation' | 'Properties' | 'Styles' | 'Animation' | 'AboutFCA'

export interface IWCDParams {
    level: number,
    position: 'left' | 'right',
    wdcPath: string,
    op: ITabType,
}

interface IInfoElCholdren {
    el: HTMLElement,
    children: IInfoElCholdren[]
}

