/// <mls shortName="serviceFcaTree" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { convertTagToFileName } from './_100554_utilsLit';
import { ServiceBase } from './_100554_serviceBase';

export const initServiceFCATree = '';
@customElement('service-fca-tree-100554')
export class SimpleGreeting extends LitElement {

    public myParent: ServiceBase | undefined;

    constructor() {
        super();
    }

    //--------------COMPONENT---------------

    createRenderRoot() {
        return this;
    }

    render() {

        const ar = this.getFCAComponents();
        if (ar && ar.length > 0) return this.createNavigation(ar);
        return html`<h3 style="padding:1rem">No FCA items were found!<h3>`;
    }

    createNavigation(array: IInfoElCholdren[]) {

        return html`
            <ul>
                ${repeat(array, ((key: IInfoElCholdren, idx: number) => key.el.tagName + idx) as any, ((item: IInfoElCholdren, index: any) => {

            return this.renderItemTree(item, index);

        }) as any
        )}
            </ul><style>${this.myCss}</style>`;
    }

    renderItemTree(item: IInfoElCholdren, idx: string) {

        const name = convertTagToFileName(item.el.tagName.toLocaleLowerCase());
        return html`
            <li>
                <div id="${name + idx}" .info=${item} class="header" @click="${(e: MouseEvent) => this.selectItem(e, item)}">
                    ${name}
                </div>
                <ul>
                    ${repeat(item.children, ((c: IInfoElCholdren, idx: number) => c.el.tagName + idx) as any, ((i: any, idxI: any) => {

            return this.renderItemTree(i, idx + '_' + idxI);

        }) as any
        )}
                </ul>
            </li>
        `;

    }

    //-------- IMPLEMENTATION --------------

    public forceUpdate(): void {
        this.requestUpdate();
    }

    private servicePreview: HTMLElement | undefined;
    private setServicePreview(): void {
        if (this.servicePreview || !this.myParent) return;

        const nav3 = this.myParent.nav3Service;
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

    private selectItem(e: MouseEvent, item: IInfoElCholdren): void {

        e.stopPropagation();
        const target = e.target as HTMLElement;

        const father = item.el.closest('*[rendertype="editactive"]');
        if (father) {

            const id = target.id;
            item.el.click();
            setTimeout(() => {

                const me = this.querySelector('#' + id) as HTMLElement;
                if (me) me.click();
            }, 150);

        } else item.el.click();

    }

    private myCss = `
        service-fca-tree-100554{
            padding: 1rem;
            display:block;
        }
        service-fca-tree-100554 ul {
            list-style: none;
            padding: 0px 0rem 0rem 1rem;
            border-left: 1px solid #d4d4d4;
        }

        service-fca-tree-100554 ul li {
            position: relative;

        }

        service-fca-tree-100554 ul li .header {
            padding: .4rem;
            cursor: pointer;
        }

        service-fca-tree-100554 ul li .header:hover {
            border: 1px solid #d4d4d4;

        }

        service-fca-tree-100554 ul li:before {
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

interface IInfoElCholdren {
    el: HTMLElement,
    children: IInfoElCholdren[]
}
