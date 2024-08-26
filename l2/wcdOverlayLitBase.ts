/// <mls shortName="wcdOverlayLitBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, PropertyValueMap } from 'lit';
import { property } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
import { IcaLitElementBase } from './_100554_icaLitElementBase';
import { ActionTag } from './_100554_icaGlobal';
import { IWCDCommand } from './_100554_wcdCommandBase';

export abstract class WcdOverlayLitBase extends CollabLitElement {

    @property({ type: String, reflect: true }) level: string = mls.actualLevel.toString() || '7';

    public myItens: IICADepths[] = []

    constructor() {
        super();
        document.onkeydown = (e) => { this.onkeyDown(e) }
    }

    //------------COMPONENT---------------
    
    createRenderRoot() {
        return this; // dont use shadow root
    }

    //-----------IMEPLEMENTATION----------    

    abstract myKeyEvents:{[key: string]:Function}
    
    abstract changeOverlayItemsLevel() :void 

    abstract createOverlayItems(): void;

    abstract selectItem(ica:IcaLitElementBase): void;

    abstract getActionsTagsDefault(): { [key: string]: ActionTag };

    private onkeyDown(e: any) {

        e.stopPropagation();
        
        let el = this.querySelector('wcd-toolbox-100554');

        const param: IWCDCommand = {
            args: e,
            overlay: this as any,
            selectedIca: undefined
        };

        if (!el) {
            if (this.myKeyEvents[e.key]) this.myKeyEvents[e.key](param);
            return;
        }

        el = el.parentElement;

        if (!(el as any).info) {
            
            if (this.myKeyEvents[e.key]) this.myKeyEvents[e.key](param);
            return;

        }

        el = (el as any).info?.element as HTMLElement;

        if (this.myKeyEvents[e.key]) {
            param.selectedIca = el as any;//as IcaLitElementBase;
            this.myKeyEvents[e.key](param);
        }   

    }
    
}

export function getPosition(icaInfo: IICADepths, boundingPage: DOMRect) {

    const elBase = icaInfo.element;
    let { width, height } = icaInfo;
    const ad3 = (n1: number, s1: string, s2: string): number => n1 + parseInt(s1, 10) + parseInt(s2, 10);
    const { marginTop, marginBottom, marginLeft, marginRight, paddingTop, paddingBottom, paddingLeft, paddingRight } = window.getComputedStyle(elBase);

    let left = icaInfo.x;
    let top = icaInfo.y;
    left -= parseInt(marginLeft, 10);
    top -= parseInt(marginTop, 10);
    width = Math.max(ad3(width, marginLeft, marginRight), ad3(0, paddingLeft, paddingRight));

    if (width > elBase.ownerDocument.body.clientWidth) width -= 3;
    height = Math.max(ad3(height, marginTop, marginBottom), ad3(0, paddingTop, paddingBottom));

    return {
        left: `${left - boundingPage.left}px`,
        top: `${top - boundingPage.top}px`,
        width: `${width}px`,
        height: `${height}px`
    }
}

export interface IICADepths {
    element: IcaLitElementBase | HTMLElement,
    depth: number,
    x: number,
    y: number,
    height: number,
    width: number,
    opacity: string,
}