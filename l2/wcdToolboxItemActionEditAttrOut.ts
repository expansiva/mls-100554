/// <mls shortName="wcdToolboxItemActionEditAttrOut" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, repeat, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { WcdToolboxItemBase } from './_100554_wcdToolboxItemBase';
import { dispatchEventConciliate } from './_100554_wcdCommandBase';
import { getAtributtesByTag, checkAttributteHasVariation } from './_100554_icaBaseDescription';
import { getConfigProject } from './_100554_libProjectConfig';

@customElement('wcd-toolbox-item-action-edit-attr-out-100554')
export class WCDToolboxItemActionEditAttrOut extends WcdToolboxItemBase {

    @property({ type: Array, reflect: true }) attrs: IAttr[] = [];

    public args: string | undefined;
    private mode: 'loading' | 'notFound' | 'show' = 'loading';
    private elIca: HTMLElement | undefined;
    private languages: ILanguage = {}

    constructor() {
        super();
        this.setEvents();
        this.setLanguages();
        
        
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
                ${repeat(this.attrs, ((key: IAttr) => key.attr) as any, ((k: IAttr, index: any) => { return this.renderIten(k) }) as any)}
            </div>
        `;

    }

    renderIten(info: IAttr) {
        return html`
            <div class="atributo">
                <label for="label">${info.attr}</label>
                <input type="text" .info=${info} value="${info.vl}" @keydown="${this.onKeydown}">
                ${this.renderVariation(info)}
                
            </div>
        `
    }

    renderVariation(info: IAttr) {

        if (!info.hasVariation) return html``; 

        return html`
            <details>
                <summary><span>Variações</span> ${this.renderAddVariation(info)}</summary>
                ${repeat(info.variations, ((key: IVariation) => key.attr) as any, ((k: IVariation, index: any) => { return this.renderVariantItem(k) }) as any)}
            </details>
        `;
    }

    renderVariantItem(v: IVariation) {
        return html`
            <attrvariations>
                <label for="${v.attr}">${v.attr}</label>
                <input type="text" .info=${v} id="${v.attr}" value="${v.vl}" @keydown="${this.onKeydown}">
            </attrvariations>
        `;
    }

    renderAddVariation(info: IAttr) {
        const array = Object.keys(this.languages);
        return html`
            <addvariation .info=${info}>
                <span @click="${this.clickOptVariation}">+</span> 
                <addvariationitem>
                    <select>
                        ${repeat(array, ((key: string) => key) as any, ((k: string, index: any) => { return this.renderOptVariant(k) }) as any)}
                    </select>
                    <button @click="${this.clickAddVariation}">+</button>
                <addvariationitem>
            </addvariation>
        
        `
    } 

    renderOptVariant(v: string) {
        const i = this.languages[v]; 
        return html`
            <option value="${v}">${i.name}</option>
        
        `
    }

    //---------IMPLEMENTATION-----------------

    private clickAddVariation(e: MouseEvent) {

        e.preventDefault();
        e.stopPropagation();

        const elBtn = e.target as HTMLElement;
        const father = elBtn.closest('addvariation') as any;
        const sel = father?.querySelector('select') as HTMLSelectElement;
        const info: IAttr = father.info;
        const l = this.languages[sel.value];

        if (!elBtn || !father || !sel || !info || !this.elIca) return;

        const key = info.attr + '-' + l.acronym;
        const vl = this.elIca.getAttribute(key);

        if (vl) {
            return;
        }

        this.elIca.setAttribute(key, l.name);
        dispatchEventConciliate();
        this.forceUpdate();        

    }

    private clickOptVariation(e: MouseEvent) {

        e.preventDefault();
        e.stopPropagation();

        const elBtn = e.target as HTMLElement;
        const father = elBtn.closest('addvariation') as HTMLElement;
 
        if (!elBtn || !father) return;
 
        const inAdd = father.classList.contains('active');
        if (!inAdd) {
            elBtn.innerText = 'x'; 
            father.classList.add('active');
        } else {
            elBtn.innerText = '+';
            father.classList.remove('active');
        }    
        
    }

    private getMyAtributtes() {

        try {

            const state = this.getState();
            if (!state) {
                this.mode = 'notFound';
                return;
            }

            this.elIca = state.elICA as HTMLElement;
            if (!this.elIca) {
                this.mode = 'notFound';
                return;
            }

            const order: { vl: IAttr[], nvl: IAttr[] } = { vl: [], nvl: [] };
            const objAllAttr: { [key: string]: string } = {};
            const mainAttrs = getAtributtesByTag(this.elIca.tagName);

            mainAttrs.forEach((a) => {

                const vl = this.elIca?.getAttribute(a);
                objAllAttr[a] = vl || '';

            });

            const elAttrs = this.elIca.getAttributeNames();
            elAttrs.forEach((a) => {

                const vl = this.elIca?.getAttribute(a);
                if (!vl) return;
                objAllAttr[a] = vl;

            });

            mainAttrs.forEach((a) => {

                const vr = this.findVariation(objAllAttr, a);
                const vl = objAllAttr[a];
                const obj: IAttr = {
                    attr: a,
                    vl: vl || '',
                    hasVariation: checkAttributteHasVariation(a),
                    variations: []
                }

                vr.forEach((v) => {

                    const vlr = objAllAttr[v];
                    const vari: any = {
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

    private getState(): any | undefined {

        if ((window as any).wcdState && !window.preview) {
            return (window as any).wcdState;
        }

        const preview = window.preview?.iframe as HTMLIFrameElement;
        if (!preview) {
            this.mode = 'notFound';
            return undefined;
        }

        return (preview.contentWindow as any)?.wcdState;

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

    private timeKeydown = -1;
    private onKeydown(e: KeyboardEvent) {

        e.stopPropagation();
        clearTimeout(this.timeKeydown);

        const el = e.target as HTMLInputElement;
        if (!el) return

        this.timeKeydown = setTimeout(() => {

            if (!this.elIca) return;
            const info: IAttr | IVariation = (el as any).info;
            this.elIca.setAttribute(info.attr, el.value);
            dispatchEventConciliate();
            (this.elIca as LitElement).requestUpdate();
        }, 500);


    }

    private async setLanguages() {
        const { project } = mls.actual[5];
        if (!project) {
            this.languages = {
                'English': { acronym: 'en', name: 'English' }
            }
        } else {
            const config = await getConfigProject(project);

            if (!config || !config.languages || config.languages.length === 0) {
                this.languages = {
                    'English': { acronym: 'en', name: 'English' }
                }
            } else {
                config.languages.forEach((entry, index) => {
                    this.languages[`${entry.name}`] = {
                        acronym: entry.language,
                        name: entry.name,
                    }
                });
            }
        }

        this.getMyAtributtes();
    }

}

interface IAttr {
    attr: string,
    vl: string,
    hasVariation: boolean;
    variations: IVariation[]
}

interface IVariation {
    attr: string,
    vl: string,
}

interface ILanguage {
    [key: string]: { acronym: string, name: string }
}