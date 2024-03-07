/// <mls shortName="collabFcaTree" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { convertTagToFileName } from './_100554_utilsLit';
import { ServiceBase } from './_100554_serviceBase';

export const initCollabFCATree = '';

@customElement('collab-fca-tree-100554')
export class CollabFCATree extends LitElement {
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

        const obj = html`
            <ul>
                ${repeat(array, ((key: IInfoElCholdren, idx: number) => key.el.tagName + idx) as any, ((item: IInfoElCholdren, index: any) => {
    
                        return this.renderItemTree(item, index);

                    }) as any
                )}
            </ul><style>${this.myCss}</style>
        `;

        return obj;

    }

    renderItemTree(item: IInfoElCholdren, idx: string) {

        const name = convertTagToFileName(item.el.tagName.toLocaleLowerCase());
        const cls = (item.el as any).renderType === 'editactive' ? 'activeBranch' : '';

        if (this.idLastClick === name + idx) { // Verifico se preciso forçar um click
            this.idLastClick = '';
            item.el.click();
        }

        return html`
            <li>
                <div id="${name + idx}" .info=${item} class="header ${cls}" @click="${(e: MouseEvent) => this.selectItem(e, item)}">
                    ${name}
                    <div class="groupHiddenList" @click="${this.clickGroupHidden}">
                        <span class="mls-gpbtnslider-item fa fa-undo"></span>
                        <span class="mls-gpbtnslider-item fa fa-clone"></span>
                        <span class="mls-gpbtnslider-item fa fa-file-pen"></span>
                        <span class="mls-gpbtnslider-item fa fa-trash"></span>
                    </div>
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

    private idLastClick: string = '';
    private selectItem(e: MouseEvent, item: IInfoElCholdren): void {

        e.stopPropagation();
        const target = e.target as HTMLElement;

        const active = this.querySelector('.activeBranch') as HTMLElement;
        if (active && active === target) return;
        if (active) active.classList.remove('activeBranch');

        target.classList.add('activeBranch');

        const father = item.el.closest('*[rendertype="editactive"]');
        if (father) {

            this.idLastClick = target.id;
            item.el.click();

        } else item.el.click();

    }

    private clickGroupHidden(e: MouseEvent) {

        e.stopPropagation();
        const el = e.target as HTMLElement;
        if (!el) return;
        el.classList.toggle('activegpbtnslider');

    }

    private myCss = `
        collab-fca-tree-100554{
            padding: 1rem;
            display:block;
        }
        collab-fca-tree-100554 ul {
            list-style: none;
            padding: 0px 0rem 0rem 1rem;
            border-left: 1px solid #d4d4d4;
        }

        collab-fca-tree-100554 ul li {
            position: relative;
            user-select:none;

        }

        collab-fca-tree-100554 ul li .header {
            padding: .4rem;
            cursor: pointer;
        }

        collab-fca-tree-100554 ul li .header:hover {
            border: 1px solid #d4d4d4;

        }

        collab-fca-tree-100554 ul li div.activeBranch{
            border: 1px solid #d4d4d4;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        collab-fca-tree-100554 ul li:before {
            content: ' ';
            position: absolute;
            width: 15px;
            height: 1px;
            background: #d4d4d4;
            top: 1.2rem;
            left: -16px;
        }

        collab-fca-tree-100554 .groupHiddenList {
            border-radius: 4px;
            padding: .3rem;
            transition: all 0.5s;
            cursor: pointer;
            display: none; //flex!important;
            z-index: 9;
            height: .7rem;
            
        }

        collab-fca-tree-100554 ul li div.activeBranch .groupHiddenList{
            display: flex;
            align-items: center;
            position: relative;
        }

        collab-fca-tree-100554 .groupHiddenList::after {
            content: ' ';
            width: 23px;
            height: 19px;
            position: absolute;
            right: -15px;
            background-image:  url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 512'><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d='M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z' fill='rgb(66,65,65,1)'/></svg>");
            background-repeat:no-repeat;
            background-position-y: center;
        }

        collab-fca-tree-100554 .groupHiddenList .mls-gpbtnslider-item {
            display: none;
            transition: 0.5s;
            margin-left: 1rem;
            z-index: 10;
            font-size: 16px;
            line-height: normal;
        }

        collab-fca-tree-100554 .groupHiddenList .mls-gpbtnslider-item:hover {
            color: #1a83ff;
        }
        

        collab-fca-tree-100554 .groupHiddenList.activegpbtnslider {
            padding-right: 24px;
            padding-left: 8px;
        }

        collab-fca-tree-100554 .groupHiddenList.activegpbtnslider .mls-gpbtnslider-item {
            display: inherit;
            text-align: center;
            float: left;
        }
        
    `;

}

interface IInfoElCholdren {
    el: HTMLElement,
    children: IInfoElCholdren[]
}