/// <mls shortName="wcdToolboxItemActionMove" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { WcdToolboxItemBase } from '/_100554_/l2/wcdToolboxItemBase.js';
import { IcaLitElementBaseMethods } from '/_100554_/l2/icaTypes.js';
import { WCDOverlayItensMethods } from '/_100554_/l2/wcdTypes.js';
import { move, updateOverlay } from '/_100554_/l2/wcdCommandMove.js';
import { getPosition } from '/_100554_/l2/icaGlobal.js'; 


@customElement('wcd-toolbox-item-action-move-100554')
export class WCDToolboxItemActionMove extends WcdToolboxItemBase {

    private forceUpdate = true;
    public args: string | undefined;
    public elSiblings: IcaLitElementBaseMethods[] | undefined;
    private sort: any;

    constructor() {
        super();
    }

    //-------COMPONENT---------------------

    updated(changedProperties: any) {
        super.updated(changedProperties);

    }

    disconnectedCallback() {

        if (this.elSiblings && this.forceUpdate) {
            this.recreateOverlay();
            this.removeEvents();
        }
        
        super.disconnectedCallback();
    }

    render() {
        if (this.args === 'left') return this.renderLeft();
        if (this.args === 'below') return this.renderBelow();
        return this.renderButton();

    }

    renderButton() {
        this.title = "move";
        this.onclick = (e) => this.clickButton(e);
        this.classList.add('f-button');
        return html`<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4V224H109.3l9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4H224V402.7l-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4V288H402.7l-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4H288V109.3l9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z"/></svg>`;
    }

    renderLeft() {
        this.getAndSetMySiblings();
        this.title = "move";
        this.style.left = '-30px';
        return html`
            <svg xmlns="http://www.w3.org/2000/svg" style="width: 15px; height: 15px; background: #0099ff; padding: 3px; fill: white; border-radius: 50%;" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/></svg>
        `
    }

    renderBelow() {
        this.getAndSetMySiblings();
        this.title = "move";
        this.style.bottom = '-30px';
        return html`
            <svg xmlns="http://www.w3.org/2000/svg" style="transform: rotate(90deg); width: 15px; height: 15px; background: #0099ff; padding: 3px; fill: white; border-radius: 50%;" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/></svg>
        `
    }

    //---------IMPLEMENTATION-----------------

    private clickButton(e: MouseEvent) {

        e.stopPropagation();

        if (!this.myParent || !this.elICA) return;

        const s = this.checkSiblingsPosition(this.elICA);

        if (s === 'nosiblings') return;

        const p = s === 'left' ? 'p-l2' : 'p-m3';

        this.myParent.setIconsWcdToolbox(
            [
                {
                    name: 'backButton',
                },
                {
                    name: '_100554_wcdToolboxItemActionMove',
                    level: [2, 3],
                    args: s,
                    position: p
                }
            ],
            false,
            'false'
        )

    }


    private checkSiblingsPosition(element: HTMLElement): 'nosiblings' | 'below' | 'left' {

        if (!element.parentElement) return 'nosiblings';

        const siblings = Array.from(element.parentElement.children).filter(el => el !== element);

        if (siblings.length === 0) return 'nosiblings';

        const elementRect = element.getBoundingClientRect();
        let hasHorizontalSibling = false;
        let hasVerticalSibling = false;

        for (const sibling of siblings) {
            const siblingRect = sibling.getBoundingClientRect();

            if (Math.abs(siblingRect.top - elementRect.top) < 5) {

                hasVerticalSibling = true;
            }
            if (Math.abs(siblingRect.left - elementRect.left) < 5) {
                hasHorizontalSibling = true;
            }
        }

        if (hasVerticalSibling) return 'below';
        if (hasHorizontalSibling) return 'left';

        return 'nosiblings';
    }

    private getAndSetMySiblings() {

        if (!this.elICA || !this.elICA.parentElement || !this.elICA.overlayRef) return;

        this.elSiblings = Array.from(this.elICA.parentElement.children) as IcaLitElementBaseMethods[];

        this.elSiblings.forEach((el) => {

            if (!el.overlayRef) return;
            const ov = el.overlayRef as WCDOverlayItensMethods;

            ov.setAttribute('draggable', 'true');
            ov.ondragstart = (e) => this.handleDragStart(e, ov);
            ov.ondragover = (e) => this.handleDragOver(e, ov);
            ov.ondrop = (e) => this.handleDrop(e, ov);

            ov.ontouchstart = (e) => this.handleTouchStart(e, ov);
            ov.ontouchmove = (e) => this.handleTouchMove(e, ov);
            ov.ontouchend = (e) => this.handleTouchEnd(e, ov);

        });

        const p = this.elICA.overlayRef.parentElement;
        if (!p) return;

        Array.from(p.children).forEach((i) => {
            if (i.hasAttribute('draggable')) return;
            i.remove();
        });
    }

    private removeEvents() {

        this.elSiblings?.forEach((el) => {

            if (!el.overlayRef) return;
            const ov = el.overlayRef as WCDOverlayItensMethods;

            ov.removeAttribute('draggable');
            ov.ondragstart = () => undefined;
            ov.ondragover = () => undefined;
            ov.ondrop = () => undefined;

            ov.ontouchstart = () => undefined;
            ov.ontouchmove = () => undefined;
            ov.ontouchend = () => undefined;

        });

    }


    private draggedItem: WCDOverlayItensMethods | null = null;

    private handleDragStart(event: DragEvent, item: WCDOverlayItensMethods) {
        event.stopPropagation();
        this.draggedItem = item;
    }

    private handleDragOver(event: DragEvent | TouchEvent, element: WCDOverlayItensMethods) {

        event.preventDefault();

        if (!this.draggedItem || this.draggedItem === element || !this.draggedItem.info || !element.info) return;

        let client = 'clientX' in event ? event.clientX : event.touches[0].clientX;
        if (this.args === 'left') client = 'clientY' in event ? event.clientY : event.touches[0].clientY;

        const rect = element.getBoundingClientRect();
        const offset = this.args === 'left' ? client - rect.top : client - rect.left;
        const base = this.args === 'left' ? rect.height : rect.width;


        if (offset < (base * 0.3)) {
            move(this.draggedItem.info.element, element.info.element, 'above', false);

        } else if (offset > (base * 0.6)) {
            move(this.draggedItem.info.element, element.info.element, 'below', false);
        }

        this.updatePosition(this.draggedItem, element);

    }


    private updatePosition(dragItem: WCDOverlayItensMethods, dropItem: WCDOverlayItensMethods) {

        const overlay = dragItem.parentElement as HTMLElement;
        if (!overlay) return;

        const boundingPage = overlay.getBoundingClientRect();

        [dragItem, dropItem].forEach((item) => {

            if (!item.info) return;
            const { x, y, height, width } = item.info.element.getBoundingClientRect();
            item.info.x = x;
            item.info.y = y;
            item.info.height = height;
            item.info.width = width;
            const pos = getPosition(item.info, boundingPage);
            item.style.width = pos.width;
            item.style.height = pos.height;
            item.style.top = pos.top;
            item.style.left = pos.left;

        });

    }

    private handleDrop(event: DragEvent, element: WCDOverlayItensMethods) {

        if (!this.draggedItem || !this.draggedItem.info) return;
        this.forceUpdate = false;
        updateOverlay(this.draggedItem.info.element);

    }

    private recreateOverlay() {
        if (!this.elICA ) return;
        updateOverlay(this.elICA);
    }

    private handleTouchStart(event: TouchEvent, item: WCDOverlayItensMethods) {
        event.preventDefault();
        this.draggedItem = item;
    }

    private handleTouchMove(event: TouchEvent, item: WCDOverlayItensMethods) {

        event.preventDefault();

        const touch = event.touches[0];
        let element = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;

        if (!element) return;

        this.handleDragOver(event, element as WCDOverlayItensMethods);

    }

    private handleTouchEnd(event: TouchEvent, element: WCDOverlayItensMethods) {

        event.preventDefault();
        this.handleDrop(event as any, element);

    }
}