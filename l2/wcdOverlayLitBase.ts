/// <mls shortName="wcdOverlayLitBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, PropertyValueMap } from 'lit';
import { property } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
import { IcaLitElementBase } from './_100554_icaLitElementBase';
import { ActionTag, IICADepths } from './_100554_icaTypes';
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