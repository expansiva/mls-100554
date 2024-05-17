/// <mls shortName="collabFcaTree" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { convertTagToFileName } from './_100554_utilsLit';
import { ServiceBase } from './_100554_serviceBase';
import { CollabLitElement } from './_100554_collabLitElement';

export const initCollabFCATree = '';

/// **collab_i18n_start**
const message_pt = {
    noItens: 'Nenhum item ICA foi encontrado!'
}

const message_en = {
    noItens: 'No ICA items were found!',
    
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**
@customElement('collab-fca-tree-100554')
export class CollabFCATree extends CollabLitElement {

    private msg: MessageType = messages['en'];
    
    public myParent: ServiceBase | undefined;

    constructor() {
        super();
    }

    //--------------COMPONENT---------------

    createRenderRoot() {
        return this;
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        const ar = this.getFCAComponents();
        if (ar && ar.length > 0) return this.createNavigation(ar);
        return html`<h3 style="padding:1rem">${this.msg.noItens}<h3>`;
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

            setTimeout(() => {

                const active = this.querySelector('.activeBranch') as HTMLElement;
                if (active) active.classList.remove('activeBranch');

                this.idLastClick = '';
                item.el.click();

            }, 200);

        }

        let mySymbol = 'fa-cubes'
        if ((item.el as any).mySymbol) mySymbol = (item.el as any).mySymbol;

        return html`
            <li>
                <div id="${name + idx}" .info=${item} @mouseover="${this.mouseOver}" @mouseleave="${this.mouseLeave}" class="header ${cls}" @click="${(e: MouseEvent) => this.selectItem(e, item)}">
                    <info-item><span class="fa ${mySymbol}" style="margin-right:.5rem"></span>${name}</info-item>
                    <div class="dragDropcontainer">
                        <span class="dbefore fa fa-arrow-up"></span>
                        <span class="din fa fa-arrow-turn-down"></span>
                        <span class="dAfter fa fa-arrow-down"></span>
                    </div>
                    <div class="groupHiddenList" .info=${item} @click="${this.clickGroupHidden}">
                        <span class="mls-gpbtnslider-item fa fa-up-down-left-right" title="move" @click="${this.activeMove}"></span>
                        <span class="mls-gpbtnslider-item fa classLock" @click="${this.setLock}"></span>
                        <span class="mls-gpbtnslider-item fa fa-trash" @click="${this.delEl}" title="remove"></span>
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

        if (!view || !view.shadowRoot) return ret;

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
        let target = e.target as HTMLElement;
        if (target && target.className.indexOf('header') < 0) {
            target = target.closest('.header') as HTMLElement;
        }

        if (!target) return;

        const active = this.querySelector('.activeBranch') as HTMLElement;
        if (active && active === target) return;
        if (active) active.classList.remove('activeBranch');

        target.classList.add('activeBranch');

        item.el.style.border = '';
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

        if (!(el as any).info) return;

        let lock = 'fa-lock-open';
        const isGroup = (el as any).info.el.getAttribute('isFCAGroup');
        if (isGroup || isGroup === 'true') {
            lock = 'fa-lock';
        }

        const group = el.querySelector('.classLock') as HTMLElement;
        if (group) {
            group.classList.remove('fa-lock');
            group.classList.remove('fa-lock-open');
            group.title = lock === 'fa-lock' ? 'lock' : 'lock open';
            group.classList.add(lock);

        }

    }

    private setLock(e: MouseEvent) {

        e.stopPropagation();
        const el = e.target as HTMLElement;
        if (!el) return;
        const info: IInfoElCholdren = (el.parentElement as any).info;
        if (!info) return;

        const isGroup = (el.className.indexOf('fa-lock-open') < 0);
        info.el.setAttribute('isFCAGroup', (!isGroup).toString());

        let lock = 'fa-lock-open';
        if (!isGroup) {
            lock = 'fa-lock';
        }

        el.classList.remove('fa-lock');
        el.classList.remove('fa-lock-open');
        el.title = lock === 'fa-lock' ? 'lock' : 'lock open';
        el.classList.add(lock);

        this.requestUpdate();

    }

    private delEl(e: MouseEvent) {

        e.stopPropagation();
        const el = e.target as HTMLElement;
        if (!el) return;
        const info: IInfoElCholdren = (el.parentElement as any).info;
        if (!info) return;

        info.el.remove();

        this.requestUpdate();

    }

    private activeMove(e: MouseEvent) {

        e.stopPropagation();
        const el = e.target as HTMLElement;
        if (!el) return;
        const info: IInfoElCholdren = (el.parentElement as any).info;
        if (!info) return;

        const wc = info.el.querySelector('wcd-toolbox-100554') as HTMLElement;
        if (!wc || !wc.shadowRoot) return;

        const move = wc.shadowRoot.querySelector('wcd-toolbox-item-action-move-100554') as HTMLElement;
        if (move) move.click();

        setTimeout(() => {

            this.setDragDrop(info.el);

        }, 500);


    }

    private setDragDrop(active: HTMLElement): void {

        const dragStart = (e: MouseEvent, el: HTMLElement) => {
            e.stopPropagation();
            if (!(el as any).info) return;
            el.style.opacity = '0.4';
        };

        const dragEnter = (e: MouseEvent, el: HTMLElement) => {
            e.stopPropagation();
            const elLast = this.querySelector('.overdragdrop') as HTMLElement;
            if (elLast) elLast.classList.remove('overdragdrop');
            el.classList.add('overdragdrop');
        };

        const dragLeave = (e: MouseEvent, el: HTMLElement) => {
            e.stopPropagation();
            //el.classList.remove('overdragdrop');
        };

        const dragOver = (e: MouseEvent, el: HTMLElement) => {
            e.stopPropagation();
            e.preventDefault();
            (e as any).dataTransfer.dropEffect = 'move';
            return false;
        };

        const dragDrop = (e: MouseEvent, el: HTMLElement, mode: HTMLElement) => {
            e.stopPropagation();
            if (!(el as any).info) return;
            mode.click();

            return false;
        };

        const dragEnd = (e: MouseEvent, el: HTMLElement) => {
            e.stopPropagation();
            try {
                //mls.events.fire(2,'DSStyleChanged','{"emitter":"left"}',500);

                Array.from(listItens).forEach((el: any) => {

                    el.removeAttribute('draggable');
                    el.classList.remove('overdragdrop');
                    el.style.opacity = '';
                    el.ondragstart = () => { };
                    el.ondragenter = () => { };
                    el.ondragover = () => { };
                    el.ondragleave = () => { };                    

                    const elbefore = el.querySelector('.dbefore') as HTMLElement;
                    const elafter = el.querySelector('.dAfter') as HTMLElement;
                    const elinn = el.querySelector('.din') as HTMLElement;
                    
                    if (elbefore) {
                        elbefore.removeAttribute('draggable');
                        elbefore.ondrop = (e: MouseEvent) => { };
                    }
                    if (elafter) {
                        elafter.removeAttribute('draggable');
                        elafter.ondrop = (e: MouseEvent) => { };
                    }
                    if (elinn) {
                        elinn.removeAttribute('draggable');
                        elinn.ondrop = (e: MouseEvent) => { };
                    }

                    const cont = el.querySelector('.dragDropcontainer') as HTMLElement;

                    if (cont) {
                        cont.classList.remove('b');
                        cont.classList.remove('a');
                        cont.classList.remove('i');
                    }

                    if (el.info) {

                        const elBase = el.info.el;
                        if (!elBase) return;
                        if (elBase.getAttribute('renderType') === 'editactive') return;

                        elBase.style.position = '';
                        const content = elBase.querySelector(':scope > wcd-dragdrop-aux');
                        if (!content) return;
                        content.remove();

                    }

                });

            } catch (e) {
                this.requestUpdate();
            }



        };

        const addEventsDragAndDrop = (el: HTMLElement) => {

            if (!(el as any).info) return;

            const rtp = (el as any).info.el.getAttribute('rendertype');
            const wcd = (el as any).info.el.querySelector(':scope > wcd-dragdrop-aux');

            if (!wcd && rtp === 'edit') return;

            const before = wcd ? wcd.querySelector('wcd-dragdrop-aux-before') : undefined;
            const after = wcd ? wcd.querySelector('wcd-dragdrop-aux-after') : undefined;
            const inn = wcd ? wcd.querySelector('wcd-dragdrop-aux-in') : undefined;

            const elbefore = el.querySelector('.dbefore') as HTMLElement;
            const elafter = el.querySelector('.dAfter') as HTMLElement;
            const elinn = el.querySelector('.din') as HTMLElement;

            const cont = el.querySelector('.dragDropcontainer') as HTMLElement;
            if (cont && before) cont.classList.add('b');
            if (cont && after) cont.classList.add('a');
            if (cont && inn) cont.classList.add('i');

            if (active === (el as any).info.el) {
                el.ondragstart = (e: MouseEvent) => dragStart(e, el);
            }

            if (active !== (el as any).info.el) {
                el.ondragenter = (e: MouseEvent) => dragEnter(e, el);
                el.ondragover = (e: MouseEvent) => dragOver(e, el);
                el.ondragleave = (e: MouseEvent) => dragLeave(e, el);
                if (before && elbefore) {
                    elbefore.setAttribute('draggable', 'true');
                    elbefore.ondrop = (e: MouseEvent) => dragDrop(e, el, before);
                }
                if (after && elafter) {
                    elafter.setAttribute('draggable', 'true');
                    elafter.ondrop = (e: MouseEvent) => dragDrop(e, el, after);
                }
                if (inn && elinn) {
                    elinn.setAttribute('draggable', 'true');
                    elinn.ondrop = (e: MouseEvent) => dragDrop(e, el, inn);
                }
            }

            el.ondragend = (e: MouseEvent) => dragEnd(e, el);

        }

        const listItens = this.querySelectorAll('.header');

        Array.from(listItens).forEach((el) => {
            el.setAttribute('draggable', 'true');
            addEventsDragAndDrop(el as HTMLElement);
        });

    }

    private mouseOver(e: MouseEvent) {

        e.preventDefault();
        e.stopPropagation();

        let el = e.target as any;
        if (el && el.className.indexOf('header') < 0) {
            el = el.closest('.header') as HTMLElement;
        }

        let inOver = el.getAttribute('inOver');
        if (!inOver) inOver = 'false';

        if (!el || !el.info || inOver === 'true' || el.className.indexOf('activeBranch') >= 0) return;
        el.info.el.style.border = '1px solid blue';


    }

    private mouseLeave(e: MouseEvent) {

        e.preventDefault();
        e.stopPropagation();

        let el = e.target as any;
        if (el && el.className.indexOf('header') < 0) {
            el = el.closest('.header') as HTMLElement;
        }

        el.removeAttribute('inOver');
        el.info.el.style.border = '';


    }


    private myCss = `
        collab-fca-tree-100554{
            padding: 1rem;
            display:block;
        }
        collab-fca-tree-100554 ul {
            list-style: none;
            padding: 0px 0rem 0rem .5rem;
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

        collab-fca-tree-100554 ul li .header .dragDropcontainer {
            display:none;
            gap:0.5rem;
        }

        collab-fca-tree-100554 ul li .header.overdragdrop {
            display: flex!important;
            justify-content: space-between;
        }

        collab-fca-tree-100554 ul li .header.overdragdrop .dragDropcontainer {
            display:flex;
            gap:0.5rem;
        }

        collab-fca-tree-100554 ul li .header .dragDropcontainer span {
            display: none;
            justify-content: center;
            align-items: center;
            width:20px;
            heigth:20px;
        }

        collab-fca-tree-100554 ul li .header .dragDropcontainer.b .dbefore {
            display: flex!important;
        }

        collab-fca-tree-100554 ul li .header .dragDropcontainer.i .din {
            display: flex!important;
        }

        collab-fca-tree-100554 ul li .header .dragDropcontainer.a .dAfter {
            display: flex!important;
        }

        collab-fca-tree-100554 ul li div.activeBranch{
            border: 1px solid #d4d4d4;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 5px;
            background: #f8f8f8;
        }

        collab-fca-tree-100554 ul li:before {
            content: ' ';
            position: absolute;
            width: 7px;
            height: 1px;
            background: #d4d4d4;
            top: 1.2rem;
            left: -8px;
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