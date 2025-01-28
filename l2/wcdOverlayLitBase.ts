/// <mls shortName="wcdOverlayLitBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />


import { property } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
import { ActionTag, IICADepths, IcaLitElementBaseMethods } from './_100554_icaTypes';
import { WCDOverlayMethods, IWCDCommand, WCDToolboxMethodos, IListWidgetBase } from './_100554_wcdTypes';

export abstract class WcdOverlayLitBase extends CollabLitElement implements WCDOverlayMethods {

    @property({ type: String, reflect: true }) level: string = mls.actualLevel.toString() || '7';

    public myItens: IICADepths[] = []

    constructor() {
        super();
        document.onkeydown = (e) => { this.onkeyDown(e) }
    }

    refreshOverlay(): void {
        throw new Error('Method not implemented.');
    }

    //------------COMPONENT---------------

    createRenderRoot() {
        return this; // dont use shadow root
    }

    //-----------IMEPLEMENTATION----------   

    abstract listWidgetsBase: IListWidgetBase[] 

    abstract myKeyEvents: { [key: string]: Function }

    abstract changeOverlayItemsLevel(): void

    abstract createOverlayItems(): void;

    abstract selectItem(ica: IcaLitElementBaseMethods): void;

    abstract getActionsTagsDefault(): { [key: string]: ActionTag };

    private onkeyDown(e: KeyboardEvent) {

        e.stopPropagation();

        let el = this.querySelector('wcd-toolbox-100554') as WCDToolboxMethodos;

        const param: IWCDCommand = {
            args: e,
            overlay: this,
            selectedIca: undefined
        };

        if (!el) {
            if (this.myKeyEvents[e.key]) this.myKeyEvents[e.key](param);
            return;
        }

        if (this.myKeyEvents[e.key]) {
            param.selectedIca = el.elICA;//as IcaLitElementBase;
            this.myKeyEvents[e.key](param);
        }

    }

}

