/// <mls shortName="wcdOverlayModeStoryItem" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, LitElement, PropertyValueMap, unsafeHTML } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { WCDToolbox , initWCDToolbox} from './_100554_wcdToolbox';
import { WcdOverlayLitBase } from './_100554_wcdOverlayLitBase';
import { IICADepths } from './_100554_icaTypes';
import { getPosition } from './_100554_icaGlobal';

export function initWcdOverlayModeStoryItem(): boolean {
    return true;
}

@customElement('wcd-overlay-mode-story-item-100554')
export class WcdOverlayModeStoryItem extends LitElement {

    @property() info: IICADepths | undefined;

    @property() widget: string | undefined;

    @property() level: string | undefined;

    public boundingPage: DOMRect | undefined;

    public overlay: WcdOverlayLitBase | undefined;

    constructor() {
        super();
        initWCDToolbox();
    }

    //---------COMPONENT--------------

    createRenderRoot() {
        return this; // dont use shadow root
    }

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

    render() {

        this.overlay = this.parentElement as WcdOverlayLitBase;

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

    //---------IMPLEMENTS--------------

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

    private onIcaOverlayItemLeave(e: MouseEvent) {
        this.style.opacity = '';
        this.style.background = '';
    }

    private onIcaOverlayItemOver(e: MouseEvent) {
        const wcdOther = this.parentElement?.querySelector('wcd-toolbox-100554') as HTMLElement;
        if (wcdOther) {
            const elSelected = wcdOther.parentElement as WcdOverlayModeStoryItem;
            if (this.isOverlapping(elSelected, this)) {
                return;
            }
        }

        const wcd = this.querySelector('wcd-toolbox-100554');
        if (wcd) return;
        this.style.background = '#d3e3fd';
        this.style.opacity = '.3'
    }

    private isOverlapping(el1: WcdOverlayModeStoryItem, el2: WcdOverlayModeStoryItem): boolean {

        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();

        return !(
            rect1.top > rect2.bottom ||
            rect1.right < rect2.left ||
            rect1.bottom < rect2.top ||
            rect1.left > rect2.right
        );
    }

    private async onIcaOverlayItemClick(e: MouseEvent) {
        e.stopPropagation();
        const origin = (e.detail as any).origin;
        if (origin !== "editor") this.selectOnHTML();

        const iHave = this.querySelector('wcd-toolbox-100554');
        if (iHave) return;

        const group = this.findAncestorWithIsicaGroup(this.info?.element);
        if(group && (group as any).overlayRef){
            (group as any).overlayRef.click();
            return;
        }

        await this.addWCDToolbox();
        if (this.level !== '4') return;
        //mls.events.fire(4, 'WCDEvent' as any, `{"op":"Navigation"}`);
        mls.events.fire(4, 'WCDEventChange' as any, `{"op":"Navigation"}`);
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

    private async addWCDToolbox() {
        if (!this.overlay || !this.info || !this.level) return;

        this.style.opacity = '';
        this.style.background = '';

        const iHaveEvents = this.querySelector('.itemHasEvent') as HTMLElement;
        if (iHaveEvents) {
            iHaveEvents.style.display = 'none';
        }

        const wcds = this.overlay.querySelectorAll('wcd-toolbox-100554');
        wcds.forEach((wc) => {
            const pr = wc.closest('wcd-overlay-mode-story-item-100554') as WcdOverlayModeStoryItem;
            if (pr && pr.info) pr.info.element.setAttribute('renderType', 'edit');
            const oelHaveEvents = pr.querySelector('.itemHasEvent') as HTMLElement;
            if(oelHaveEvents) oelHaveEvents.style.display = 'flex'
            wc.remove()
        });
        const wcd = document.createElement('wcd-toolbox-100554') as WCDToolbox;
        wcd.setAttribute('level', this.level);
        wcd.elICA = this.info.element;
        this.info.element.setAttribute('renderType', 'editactive')

        /*await this.setActions();
        let act = (this.info.element.actions as any)[this.level as any];
        if (!act) act = [];
        wcd.actions = act;*/
        wcd.lastHelper = '';

        this.appendChild(wcd);
    }

    private selectOnHTML(): void {

        if (!this.info || !this.info.element) return;
        const level = this.info.element.getAttribute('level');
        if (level !== '2') return;

        const id = this.info.element.getAttribute('idel');
        if (!id) return;
        const infoL2 = (mls.actual[2] as any).left as any;
        const name = mls.l2.editor.getKey({ project: infoL2.project, shortName: infoL2.shortName });
        const mfile = mls.l2.editor.mfiles[name];
        if (!mfile || !(mfile as any).modelHTML) return;

        const model = (mfile as any).modelHTML;
        const line = model.findMatches(`id="${id}"`, false, false, false, null, true);
        if (!line || !line[0]) return;
        const { startLineNumber } = line[0].range;

        mls.events.fire(2, 'WidgetAction' as any, `{"op":"SelectLine", "line":${startLineNumber}, "origin":"preview"}`);

    }

    /*private async setActions() {
        if (!this.info || !this.info.element) return;
        const el = this.info.element;
        if (el.isLoadMyAction[this.level as any]) return;

        await el.setActions(this.level as any);
        el.isLoadMyAction[this.level as any] = true;
    }*/

    private async checkToChangeWCD() {

        const wcd = this.querySelector('wcd-toolbox-100554') as WCDToolbox;
        if (!wcd) return;
        if (!this.info || !this.info.element) return;
        await this.addWCDToolbox();
    }

}