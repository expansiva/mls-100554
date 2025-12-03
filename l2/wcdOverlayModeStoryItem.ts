/// <mls shortName="wcdOverlayModeStoryItem" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, unsafeHTML } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { WcdOverlayItemLitBase } from '/_100554_/l2/wcdOverlayItemLitBase.js';
import { WCDOverlayMethods } from '/_100554_/l2/wcdTypes.js';
import { IICADepths } from '/_100554_/l2/icaTypes.js';
import { getPosition } from '/_100554_/l2/icaGlobal.js';

@customElement('wcd-overlay-mode-story-item-100554')
export class WcdOverlayModeStoryItem extends WcdOverlayItemLitBase  {

    @property() info: IICADepths | undefined;

    @property() widget: string | undefined;

    @property() level: string | undefined;

    public boundingPage: DOMRect | undefined;

    public overlay: WCDOverlayMethods | undefined;

    public fcCallBackClick = (e:MouseEvent)=>{};
    public fcCallBackLeave = (e:MouseEvent)=>{};
    public fcCallBackOver = (e:MouseEvent)=>{}; 


    //---------COMPONENT--------------

    render() {

        this.overlay = this.parentElement as WCDOverlayMethods;

        if (!this.info || !this.boundingPage) return html``;
        const pos = getPosition(this.info, this.boundingPage);
        this.info.element.overlayRef = this;
        this.style.display = 'block';
        this.style.position = 'absolute';
        this.style.width = pos.width;
        this.style.height = pos.height;
        this.style.top = pos.top;
        this.style.left = pos.left;
        let aux = '';
        if (this.info.element.dataset.event && this.level === '2') {
            aux = `<span class="itemHasEvent" style="display: flex; justify-content: center; align-items: center; width: 15px; background: var(--grey-color-darker); border-radius: 10px; padding: 2px; position: absolute; right: -8px; bottom: -8px; box-shadow: 0px 2px 4px #35353500;"><svg style="fill:#ffffff; width:12px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288l111.5 0L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7l-111.5 0L349.4 44.6z"/></svg></span>`;
        }
        return html`${unsafeHTML(aux)}`;
    }


}