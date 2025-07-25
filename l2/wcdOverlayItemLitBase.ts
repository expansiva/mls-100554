/// <mls shortName="wcdOverlayItemLitBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { PropertyValueMap } from 'lit';
import { CollabLitElement } from './_100554_collabLitElement';
import { IICADepths } from './_100554_icaTypes';
import { WCDOverlayItensMethods, WCDOverlayMethods, WCDToolboxMethodos } from './_100554_wcdTypes';
import './_100554_wcdToolbox';

export abstract class WcdOverlayItemLitBase extends CollabLitElement implements WCDOverlayItensMethods {

    abstract info: IICADepths | undefined;
    abstract widget: string | undefined;
    abstract level: string | undefined;
    abstract boundingPage: DOMRect | undefined;
    abstract overlay: WCDOverlayMethods | undefined;
    abstract fcCallBackClick: (e: MouseEvent) => void;
    abstract fcCallBackLeave: (e: MouseEvent) => void;
    abstract fcCallBackOver: (e: MouseEvent) => void;

    public fcRemoveWcd() {

        this.info?.element.setAttribute('renderType', 'edit');
        this.removeAttribute('rendertype');

    }

    //---------COMPONENT--------------

    firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
        super.firstUpdated(_changedProperties);
        this.setEvents();
    }

    updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
        super.updated(changedProperties);
        if (changedProperties.has('level') && changedProperties.get('level') !== undefined) {
            this.checkToChangeWCD();
        }
    }


    //-------IMPLEMENT---------

    private setEvents() {
        this.onmouseover = (e) => {
            this.onIcaOverlayItemOver(e);
        };
        this.onmouseleave = (e) => {
            this.onIcaOverlayItemLeave(e);
        };
        this.onclick = (e) => {
            this.onIcaOverlayItemClick(e);
        };
    }

    private onIcaOverlayItemOver(e: MouseEvent) {

        const wcdOther = this.parentElement?.querySelector('wcd-toolbox-100554') as HTMLElement;

        if (wcdOther) {
            const elSelected = wcdOther.parentElement as WcdOverlayItemLitBase;
            const isOverlapping = this.isOverlapping(elSelected, this);
            if (isOverlapping) {
                return;
            }
        }

        const wcd = this.querySelector('wcd-toolbox-100554');
        if (wcd) return;
        this.style.background = '#d3e3fd';
        this.style.opacity = '.3'
        if (this.fcCallBackOver) this.fcCallBackOver(e);

    }

    private onIcaOverlayItemLeave(e: MouseEvent) {
        this.style.opacity = '';
        this.style.background = '';
        if (this.fcCallBackLeave) this.fcCallBackLeave(e);
    }

    private async onIcaOverlayItemClick(e: MouseEvent) {

        e.stopPropagation();
        const origin = (e.detail as any).origin;
        if (origin !== "editor") this.selectOnHTML();

        const iHave = this.querySelector('wcd-toolbox-100554');
        if (iHave) return;

        const group = this.findAncestorWithIsicaGroup(this.info?.element);
        if (group && (group as any).overlayRef) {
            (group as any).overlayRef.click();
            return;
        }

        await this.addWCDToolbox(e.x, e.y);

        if (this.fcCallBackClick) this.fcCallBackClick(e);

        if (this.level !== '3') return;
        mls.events.fire(3, 'WCDEventChange' as any, `{"op":"Navigation"}`);
    }

    private async addWCDToolbox(x: number = 0, y: number = 0) {
        if (!this.overlay || !this.info || !this.level) return;

        this.style.opacity = '';
        this.style.background = '';

        const iHaveEvents = this.querySelector('.itemHasEvent') as HTMLElement;
        if (iHaveEvents) {
            iHaveEvents.style.display = 'none';
        }

        let lestCssWcd = '';

        const overlayItens = this.overlay.querySelectorAll('*[rendertype="editactive"]');
        (overlayItens).forEach((ovI) => {

            const overlayItem = ovI as WcdOverlayItemLitBase;
            if (!overlayItem.info) return;

            overlayItem.info.element.setAttribute('renderType', 'edit');
            overlayItem.removeAttribute('rendertype');

            const oelHaveEvents = overlayItem.querySelector('.itemHasEvent') as HTMLElement;
            if (oelHaveEvents) oelHaveEvents.style.display = 'flex'

            const wc = overlayItem.querySelector('wcd-toolbox-100554') as HTMLElement;
            if (wc) {
                //lestCssWcd = wc.style.cssText;
                wc.remove();
            }

        });

        const wcd = document.createElement('wcd-toolbox-100554') as WCDToolboxMethodos;
        wcd.setAttribute('level', this.level);
        wcd.elICA = this.info.element;
        this.info.element.setAttribute('renderType', 'editactive')
        wcd.setAttribute('initialclick', `${x},${y}`);
        wcd.lastHelper = '';

        //if(lestCssWcd) wcd.style.cssText = lestCssWcd;
        this.setAttribute('rendertype', 'editactive');
        this.appendChild(wcd);
        this.overlay.updateSizeOverlayItems();
    }


    private findAncestorWithIsicaGroup(element: HTMLElement | undefined) {

        while (element) {
            if (element !== this.info?.element && element.hasAttribute && element.hasAttribute('isicagroup') && element.getAttribute('isicagroup') === 'true') {
                return element;
            }

            if (element.parentNode) {
                element = element.parentNode as HTMLElement;
            } else if ((element as any).host) {
                // If inside a shadow DOM, move up to the host
                element = (element as any).host as HTMLElement;
            } else {
                // Reached the top of the DOM tree
                break;
            }
        }

        return null;
    }

    private selectOnHTML(): void {

        if (!this.info || !this.info.element) return;
        const level = this.info.element.getAttribute('level');
        if (level !== '2') return;

        const id = this.info.element.getAttribute('idel');
        if (!id) return;
        const infoL2 = (mls.actual[2] as any).left as any;
        const name = mls.l2.getKey({ project: infoL2.project, shortName: infoL2.shortName, folder: infoL2.folder });
        const models = mls.editor.models[name];
        if (!models || !models.html) return;

        const model = models.html.model;
        const line = model.findMatches(`id="${id}"`, false, false, false, null, true);
        if (!line || !line[0]) return;
        const { startLineNumber } = line[0].range;

        mls.events.fire(2, 'WidgetAction' as any, `{"op":"SelectLine", "line":${startLineNumber}, "origin":"preview"}`);

    }


    private isOverlapping(el1: WcdOverlayItemLitBase, el2: WcdOverlayItemLitBase): boolean {

        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();
        /*const horizontalOverlap = rect1.left < rect2.right && rect1.right > rect2.left;
        const verticalOverlap = rect1.top < rect2.bottom && rect1.bottom > rect2.top;

        return horizontalOverlap && verticalOverlap;*/
        const completelyOverlaps =
            rect1.top <= rect2.top &&
            rect1.left <= rect2.left &&
            rect1.bottom >= rect2.bottom &&
            rect1.right >= rect2.right;

        return completelyOverlaps;

    }

    private async checkToChangeWCD() {

        const wcd = this.querySelector('wcd-toolbox-100554') as WCDToolboxMethodos;
        if (!wcd) return;
        if (!this.info || !this.info.element) return;
        await this.addWCDToolbox();
    }

}