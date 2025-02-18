/// <mls shortName="wcdToolboxItemActionEditAttrOut" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { WcdToolboxItemBase } from './_100554_wcdToolboxItemBase';
import { WCDPopupMethodos } from './_100554_wcdTypes';
import { dispatchEventConciliate } from './_100554_wcdCommandBase';
import { globalWcd } from './_100554_wcdState';
import { getAtributtesByTag } from './_100554_icaBaseDescription';

@customElement('wcd-toolbox-item-action-edit-attr-out-100554')
export class WCDToolboxItemActionEditAttr extends WcdToolboxItemBase {

    @property({ type: Array, reflect: true }) attrs: IAttr[] = [];

    public args: string | undefined;
    private mode: 'loading' | 'notFound' | 'show' = 'loading';

    constructor() {
        super();
        this.setEvents();
        this.getMyAtributtes();
    }

    private setEvents(): void {
        mls.events.addListener(3, 'WCDEventChange' as any, (ev) => this.onWCDEventChange(ev));

    }

    //-------COMPONENT---------------------

    createRenderRoot() {
        return this;
    }

    disconnectedCallback() {

        super.disconnectedCallback();
    }

    updated(changedProperties: any) {

        super.updated(changedProperties);
        if (!this.elMain || !this.myParent) return;

    }

    render() {

        if (this.mode === 'loading') {
            return html`<div>Loading</div>`;
        } else if (this.mode === 'notFound') {
            return html`<h2>Not found ica</h2>`
        }

        return this.renderAttr();

    }

    renderAttr() {

        if (this.attrs.length === 0) {
            return html`<h3>Any attributes</h3>`;
        }

        return html`
            <div class="sidebar">
                ${repeat(this.attrs, ((key: IAttr) => key.attr) as any, ((k: IAttr, index: any) => { return this.renderIten(k)}) as any)}
            </div>
        `;
        
    }

    renderIten(info: IAttr) {
        return html`
            <div class="atributo">
                <label for="label">${info.attr}</label>
                <input type="text" id="label" value="${info.vl}">
                
                <details>
                    <summary>Variações</summary>
                    ${repeat(info.variations, ((key: IVariation) => key.attr) as any, ((k: IVariation, index: any) => { return this.renderVariation(k)}) as any)}
                </details>
            </div>
        `
    }

    renderVariation(v: IVariation) {
        return html`
            <attrvariations>
                <label for="${v.attr}">${v.attr}</label>
                <input type="text" id="${v.attr}" value="${v.vl}">
            </attrvariations>
        `;
    }

    //---------IMPLEMENTATION-----------------

    private getMyAtributtes() {

        try {

            const preview = window.preview?.iframe as HTMLIFrameElement;
            if (!preview) {
                this.mode = 'notFound';
                return;
            }

            const state = (preview.contentWindow as any)?.wcdState;
            if (!state) {
                this.mode = 'notFound';
                return;
            }

            const elIca = state.elICA as HTMLElement;
            if (!elIca) {
                this.mode = 'notFound';
                return;
            }

            const order: { vl: IAttr[], nvl: IAttr[] } = { vl: [], nvl: [] };
            const objAllAttr: { [key: string]: string } = {};
            const mainAttrs = getAtributtesByTag(elIca.tagName);

            mainAttrs.forEach((a) => {

                const vl = elIca.getAttribute(a);
                objAllAttr[a] = vl || '';

            });

            const elAttrs = elIca.getAttributeNames();
            elAttrs.forEach((a) => {

                const vl = elIca.getAttribute(a);
                if (!vl) return;
                objAllAttr[a] = vl;

            });

            mainAttrs.forEach((a) => {

                const vr = this.findVariation(objAllAttr, a);
                const vl = objAllAttr[a];
                const obj:IAttr = {
                    attr: a,
                    vl: vl || '',
                    variations: []
                }

                vr.forEach((v) => {

                    const vlr = objAllAttr[v];
                    const vari:any = {
                        attr: v,
                        vl: vlr
                    }
                    obj.variations.push(vari);
                });

                if (!vl) order.nvl.push(obj);
                else order.vl.push(obj);

            });

            const ret = [...order.vl, ...order.nvl];
            this.attrs = ret;
            this.mode = 'show';

        } catch (e) {
            console.info(e);
            this.mode = 'notFound';
        }

    }

    private findVariation(obj: any, keyBase: string) {
        return Object.keys(obj)
            .filter(key => key.startsWith(keyBase + '-') && key !== keyBase);
    }

    private onWCDEventChange(ev: mls.events.IEvent) {

        this.forceUpdate();

    }

    public forceUpdate(): void {

        this.getMyAtributtes();
        this.requestUpdate();

    }

}

interface IAttr{
    attr: string,
    vl: string,
    variations:IVariation[]
}

interface IVariation {
    attr: string,
    vl: string,
}