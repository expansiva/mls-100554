/// <mls shortName="pluginPageNavigation" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, repeat, TemplateResult } from 'lit';
import { convertTagToFileName } from './_100554_utilsLit';
import { PluginBaseModule } from './_100554_pluginBaseModule';
import { IcaLitElementBaseMethods } from './_100554_icaTypes';
import { IWCDCommand } from './_100554_wcdTypes';
import { execute as executeDel } from './_100554_wcdCommandDel';
import { move } from './_100554_wcdCommandMove'; 
import { canMoveElement } from './_100554_icaBaseDescription';

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

export class PluginPageNavigation extends PluginBaseModule {

    private msg: MessageType = messages['en'];

    constructor() {
        super();
        this.setEvents();
    }

    private setEvents(): void {
        mls.events.addListener(3, 'WCDEventChange' as any, (ev) => this.onWCDEventChange(ev));
        mls.events.addEventListener([1, 2, 3, 4, 5, 6, 7], ['ToolBarSelected'], (ev) => this.onlevelChange(ev));

    }

    private onlevelChange(ev: mls.events.IEvent) {

        if (!ev.desc) return;
        const j = JSON.parse(ev.desc);
        if (j.level === 3) {
            this.forceUpdate();
        }
    }

    private onWCDEventChange(ev: mls.events.IEvent) {
        console.info(ev);
        if (this && this.forceUpdate) {
            setTimeout(()=> this.forceUpdate(),150);
        }

    }

    //-------COMPONENT----------


    createRenderRoot() {
        return this;
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        const ar = this.getICAComponents();
        if (ar && ar.length > 0) return this.createNavigation(ar);
        return html`<h3 style="padding:1rem">${this.msg.noItens}<h3>`;
    }

    createNavigation(array: IInfoElChildren[]) {
        const obj = html`
            
            <ul>
                ${repeat(array, ((key: IInfoElChildren, idx: number) => key.id) as any,
            ((item: IInfoElChildren, index: any) => { return this.renderItemTree(item, index); }) as any
        )}
            </ul>
        `;

        return obj;

    }

    renderItemTree(item: IInfoElChildren, idx: string) {

        const name = convertTagToFileName(item.el.tagName.toLocaleLowerCase());
        const cls = item.el.overlayRef?.getAttribute('rendertype')
 === 'editactive' ? 'activeBranch' : '';       

        let mySymbol = 'fa-cubes'
        if ((item.el as any).mySymbol) mySymbol = (item.el as any).mySymbol;

        return html`
            <li>
                <div 
                    .info=${item}
                    draggable="true"
                    id="${name + idx}"                      
                    class="header ${cls} ${this.dropTarget === item ? 'drop-target' : ''}" 
                    @mouseover="${this.mouseOver}" 
                    @mouseleave="${this.mouseLeave}" 
                    @click="${(e: MouseEvent) => this.selectItem(e, item)}"

                    @dragstart=${(e: DragEvent) => this.handleDragStart(e, item)}
                    @dragover=${(e: DragEvent) => this.handleDragOver(e, item, e.currentTarget as HTMLElement)}
                    @dragleave=${(e: DragEvent) => this.handleDragLeave(e, e.currentTarget as HTMLElement)}
                    @drop=${(e: DragEvent) => this.handleDrop(e, e.currentTarget as HTMLElement)}

                    @touchstart=${(e: TouchEvent) => this.handleTouchStart(e, item, e.currentTarget as HTMLElement)}
                    @touchmove=${(e: TouchEvent) => this.handleTouchMove(e, item)}
                    @touchend=${(e: TouchEvent) => this.handleTouchEnd(e, e.currentTarget as HTMLElement)}
                    
                >
                    <info-item .info=${item}>
                        <span class="fa ${mySymbol}" style="margin-right:.5rem"></span>
                        ${name}
                    </info-item>
                    <div class="groupHiddenList" .info=${item}  @click="${this.clickGroupHidden}" >
                        <span class="mls-gpbtnslider-item fa fa-trash" @click="${this.delEl}" title="remove"></span>
                    </div>
                </div>
                <ul>
                    ${repeat(item.children, ((c: IInfoElChildren, idx: number) => c.el.tagName + idx) as any, ((i: any, idxI: any) => { return this.renderItemTree(i, idx + '_' + idxI); }) as any)}
                </ul>
            </li>
        `;

        //<span class="mls-gpbtnslider-item fa classLock" @click="${this.setLock}"></span>

    }

    //-------- IMPLEMENTATION --------------

    public forceUpdate(): void {
        
        this.requestUpdate();

    }

    private getICAComponents(): IInfoElChildren[] {

        let ret: IInfoElChildren[] = [];
        const scope = window.preview?.iframe?.contentDocument?.body;
        if (!scope) return ret;

        const reentrance = (array: IInfoElChildren[], element: HTMLElement) => {

            let info: IInfoElChildren | undefined;
            if (element.getAttribute('mls_origin') && !element.hasAttribute('modeoverlay')) {
                info = { el: element as IcaLitElementBaseMethods, id: element.id, children: [] as any };
                array.push(info);
            }

            const isGroup = element.getAttribute('isFCAGroup');

            if (!isGroup || isGroup === 'false') {

                if (element.shadowRoot) {
                    const children = Array.from(element.shadowRoot.children);

                    for (let i = 0; i < children.length; i++) {
                        const child = children[i] as HTMLElement;
                        reentrance(info ? info.children : array, child as HTMLElement)
                    }

                } else {
                    const children = Array.from(element.children);
                    for (let i = 0; i < children.length; i++) {
                        const child = children[i] as HTMLElement;
                        reentrance(info ? info.children : array, child as HTMLElement)
                    }
                }

            }

        }

        reentrance(ret, scope);

        return ret;

    }


    //private idLastClick: string = '';
    private selectItem(e: MouseEvent, item: IInfoElChildren): void {

        e.stopPropagation();
        let target = e.target as HTMLElement;
        if (target && target.className.indexOf('header') < 0) {
            target = target.closest('.header') as HTMLElement;
        }

        if (!target) return;

        const active = this.querySelector('.activeBranch') as HTMLElement;
        if (active && active === target) {
            return;
        }

        if (active) active.classList.remove('activeBranch');

        item.el.style.border = '';
        item.el.overlayRef?.click();
        item.el.overlayRef?.scrollIntoView({ block: 'center' });
        

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

    private delEl(e: MouseEvent) {

        e.stopPropagation();
        this.cmdDel();
        setTimeout(() => { this.requestUpdate(); }, 100);

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

        const info = (el.info) as IInfoElChildren;
        if (!info || !info.el.overlayRef) return;
        info.el.overlayRef.style.boxShadow = '0px 0px 2px #0909dd';


    }

    private mouseLeave(e: MouseEvent) {

        e.preventDefault();
        e.stopPropagation();

        let el = e.target as any;
        if (el && el.className.indexOf('header') < 0) {
            el = el.closest('.header') as HTMLElement;
        }

        el.removeAttribute('inOver');

        const info = (el.info) as IInfoElChildren;
        if (!info || !info.el.overlayRef) return;
        info.el.overlayRef.style.boxShadow = '';

    }

    private cmdDel() {

        if (!(window as any).preview || !(window as any).preview.iframe || !(window as any).preview.iframe.contentWindow.wcdState || !(window as any).preview.iframe.contentWindow.wcdState.elICA) return;

        const ica = (window as any).preview.iframe.contentWindow.wcdState.elICA
        if (!ica || !ica.overlayRef) return;

        const param: IWCDCommand = {
            args: new KeyboardEvent('keydown', {
                key: 'Del',
                code: 'Del',
                keyCode: 13,
                bubbles: true,
                cancelable: true,
                composed: true,
            }),
            overlay: ica.overlayRef.parentElement as any,
            selectedIca: ica
        }

        executeDel(param);

    }



    private draggedItem: IInfoElChildren | null = null;
    private dropTarget: IInfoElChildren | null = null;
    private dropPosition: 'above' | 'below' | 'inside' | null = null;

    private handleDragStart(event: DragEvent, item: IInfoElChildren) {
        event.stopPropagation();
        this.draggedItem = item;
        this.requestUpdate();    
    }

    private handleDragOver(event: DragEvent | TouchEvent, item: IInfoElChildren, element: HTMLElement) {

        event.stopPropagation();
        event.preventDefault();

        if (!this.draggedItem) return;

        let clientY = 'clientY' in event ? event.clientY : event.touches[0].clientY;

        const rect = element.getBoundingClientRect();
        const offsetY = clientY - rect.top;
        const height = rect.height;

        const li = element.closest('li');
        if (!li) return;

        if (offsetY < (height * 0.3)) {
            const canMove = true;
            this.dropPosition = 'above';
            element.style.border = "";
            li.style.border = "";
            li.style.borderTop = "2px solid " + (canMove ? 'blue' : 'red');


        } else if (offsetY > (height * 0.6)) {
            const canMove = true;
            this.dropPosition = 'below';
            element.style.border = "";
            li.style.border = "";
            li.style.borderBottom = "2px solid " + (canMove ? 'blue' : 'red');


        } 

        this.dropTarget = item;
        this.requestUpdate();    
    }

    private handleDragLeave(event: DragEvent, element: HTMLElement) {

        const li = element.closest('li');
        if (li) li.style.border = "";
        element.style.border = "";
    }

    private handleDrop(event: DragEvent, element: HTMLElement) {

        try {

            event.preventDefault();
            if (!this.draggedItem || !this.dropTarget) return;
            move(this.draggedItem.el, this.dropTarget.el, this.dropPosition || 'below');


        } catch (e: any) {

            console.info(e.message);

        } finally {
            element.style.border = "";

            const li = element.closest('li');
            if (li) li.style.border = "";

            this.draggedItem = null;
            this.dropTarget = null;
            this.dropPosition = null;

            setTimeout(() => { this.requestUpdate(); }, 500);
        }


    }

    private lastElementMove: undefined | HTMLElement;

    private handleTouchStart(event: TouchEvent, item: IInfoElChildren, el: HTMLElement) {
        event.preventDefault();
        el.click();
        this.draggedItem = item;
    }

    private handleTouchMove(event: TouchEvent, item: IInfoElChildren) {

        event.preventDefault();

        const touch = event.touches[0];
        let element = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;

        if (element && !element.classList.contains('header')) {
            element = element.closest('.header') as HTMLElement;
        }

        if (!element || !(element as any).info) return;

        item = (element as any).info;

        if (this.lastElementMove !== element) {

            if (this.lastElementMove) {
                let lil = this.lastElementMove.closest('li');
                if (lil) lil.style.border = "";
                this.lastElementMove.style.border = "";
            }

            this.lastElementMove = element;
            const li = element.closest('li');
            if (li) li.style.border = "";
            element.style.border = "";
            
        }

        this.handleDragOver(event as any, item, element as HTMLElement);

    }

    private handleTouchEnd(event: TouchEvent, element: HTMLElement) {

        event.preventDefault();
        this.handleDrop(event as any, this.lastElementMove || element);

    }


}

interface IInfoElChildren {
    el: IcaLitElementBaseMethods,
    id:string,
    children: IInfoElChildren[]
}

if (!customElements.get('plugin-page-navigation-100554')) {
    customElements.define('plugin-page-navigation-100554', PluginPageNavigation);
}