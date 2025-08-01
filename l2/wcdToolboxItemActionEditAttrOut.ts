/// <mls shortName="wcdToolboxItemActionEditAttrOut" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, repeat, LitElement, render } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { WcdToolboxItemBase } from './_100554_wcdToolboxItemBase';
import { convertFileNameToTag } from './_100554_utilsLit';
import { dispatchEventConciliate } from './_100554_wcdCommandBase';
import { loadPluginProject } from './_100554_libCommom';
import { getAtributtesByEl, checkAttributteHasVariation, getDescriptionAttr } from './_100554_icaBaseDescription';
import "./_100554_wcdToolboxItemActionEditVariation";

@customElement('wcd-toolbox-item-action-edit-attr-out-100554')
export class WCDToolboxItemActionEditAttrOut extends WcdToolboxItemBase {

    @query('blockplugins') blockplugins: HTMLElement | undefined;
    @property({ type: Array, reflect: true }) attrs: IAttr[] = [];
    @property() attrSelect: IAttr = {
        attr: '',
        vl: '',
        hasVariation: false,
        description: '',
        variations: []
    };

    public args: string | undefined;
    private mode: 'loading' | 'notFound' | 'show' = 'loading';
    private elIca: HTMLElement | undefined;
    private plugins: IPluginAttr[] = [];
    private pluginActive: string | undefined;
    private forceLastPlugin = false;

    constructor() {
        super();
        this.setEvents();
        this.init();
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
        if (!this.elICA || !this.myParent) return;

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
                <small>${info.description}</small>
                ${this.renderToolbar(info)}
                
            </div>
            
        `
    }

    renderToolbar(info: IAttr) {

        return html`
            <toolbareditt>
                <blockplugins>
                    <pluginitem title="variations" .info=${info} @click="${(e: MouseEvent) => this.activeVariations(e, info)}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 128C0 92.7 28.7 64 64 64l192 0 48 0 16 0 256 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64l-256 0-16 0-48 0L64 448c-35.3 0-64-28.7-64-64L0 128zm320 0l0 256 256 0 0-256-256 0zM178.3 175.9c-3.2-7.2-10.4-11.9-18.3-11.9s-15.1 4.7-18.3 11.9l-64 144c-4.5 10.1 .1 21.9 10.2 26.4s21.9-.1 26.4-10.2l8.9-20.1 73.6 0 8.9 20.1c4.5 10.1 16.3 14.6 26.4 10.2s14.6-16.3 10.2-26.4l-64-144zM160 233.2L179 276l-38 0 19-42.8zM448 164c11 0 20 9 20 20l0 4 44 0 16 0c11 0 20 9 20 20s-9 20-20 20l-2 0-1.6 4.5c-8.9 24.4-22.4 46.6-39.6 65.4c.9 .6 1.8 1.1 2.7 1.6l18.9 11.3c9.5 5.7 12.5 18 6.9 27.4s-18 12.5-27.4 6.9l-18.9-11.3c-4.5-2.7-8.8-5.5-13.1-8.5c-10.6 7.5-21.9 14-34 19.4l-3.6 1.6c-10.1 4.5-21.9-.1-26.4-10.2s.1-21.9 10.2-26.4l3.6-1.6c6.4-2.9 12.6-6.1 18.5-9.8l-12.2-12.2c-7.8-7.8-7.8-20.5 0-28.3s20.5-7.8 28.3 0l14.6 14.6 .5 .5c12.4-13.1 22.5-28.3 29.8-45L448 228l-72 0c-11 0-20-9-20-20s9-20 20-20l52 0 0-4c0-11 9-20 20-20z"/></svg>
                    </pluginitem>
                    ${this.renderPlugins(info)}
                </blockplugins>
                <toolbaredittbody style="display:none">
                </toolbaredittbody>
            </toolbareditt>
        
        `

    }

    renderPlugins(info: IAttr) {

        if (this.plugins.length <= 0) return html``;

        return html`    
            ${repeat(this.plugins, ((key: IPluginAttr) => key.tag) as any, ((k: IPluginAttr, index: any) => { return this.renderPluginItem(k, info) }) as any)}    
        
        `
    }

    renderPluginItem(p: IPluginAttr, info: IAttr) {
        return html`
            <pluginitem title="${p.pluginData.title}" .info=${info} .plugin=${p} @click="${(e: MouseEvent) => this.activePlugin(e, info, p)}">
                ${p.pluginData.getSvg()}
            </pluginitem>
        
        `
    }


    //---------IMPLEMENTATION-----------------

    private async init() {

        await this.getPlugins();
        this.getMyAtributtes();

    }

    private activeVariations(e: MouseEvent, info: IAttr) {
        const body = this.getBodyToolbarAndSetActive(e, this.forceLastPlugin);
        if (!body) {
            this.pluginActive = undefined;
            return;
        }

        this.attrSelect = info;

        body.style.display = '';
        const elP = document.createElement('wcd-toolbox-item-action-edit-variation-100554') as any;
        elP.addEventListener('setconfig', (e: MouseEvent) => this.setConfig(e));
        elP.info = info;
        elP.elIca = this.elIca;
        body.appendChild(elP);
        this.pluginActive = 'variations';

    }

    private activePlugin(e: MouseEvent, info: IAttr, p: IPluginAttr) {

        const body = this.getBodyToolbarAndSetActive(e, this.forceLastPlugin);
        if (!body) {
            this.pluginActive = undefined;
            return;
        }

        this.attrSelect = info;

        body.style.display = '';
        const elP = document.createElement(p.tag);
        elP.addEventListener('setconfig', (e) => this.setConfig(e));
        body.appendChild(elP);
        this.pluginActive = p.pluginData.title;


    }

    private setConfig(e: any) {

        if (!this.elIca || !this.attrSelect || !e.detail || !e.detail.vl) return;

        const v = e.detail.vl;

        if (v === 'fatherforceUpdate') {
            (this.elIca as LitElement).requestUpdate();
            this.forceLastPlugin = true;
            this.forceUpdate();
            return;
        }

        this.elIca.setAttribute(this.attrSelect.attr, v);
        dispatchEventConciliate();
        (this.elIca as LitElement).requestUpdate();
        this.forceUpdate();

    }

    private getBodyToolbarAndSetActive(e: MouseEvent, force: boolean): HTMLElement | undefined {

        let el = e.target as HTMLElement;
        let main = e.target as HTMLElement;

        if (main.tagName.toLocaleLowerCase() !== 'pluginitem') main = main.closest('pluginitem') as HTMLElement;

        if (el.tagName.toLocaleLowerCase() !== 'toolbareditt') el = el.closest('toolbareditt') as HTMLElement;

        if (!el || !main) return;

        let ret: HTMLElement | undefined = el.querySelector('toolbaredittbody') as HTMLElement;
        if (ret) {
            ret.innerHTML = '';
            ret.style.display = 'none';
        }

        if (main.classList.contains('active') && ret && !force) {
            main.classList.remove('active');
            ret = undefined;
        } else {

            const active = el.querySelector('pluginitem.active') as HTMLElement;
            if (active) active.classList.remove('active');
            main.classList.add('active');
        }


        return ret;

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
            const mainAttrs = getAtributtesByEl(this.elIca as any);

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
                    description: getDescriptionAttr(a),
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
        setTimeout(() => {
            if (this.pluginActive && this.forceLastPlugin && this.blockplugins) {

                const pl = this.blockplugins.querySelector(`pluginitem[title="${this.pluginActive}"]`) as HTMLElement;

                if (!pl) {
                    this.forceLastPlugin = false;
                    return;
                }

                pl.click();
                this.forceLastPlugin = false;

            }
        }, 500)


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

    private async getPlugins() {

        const filePlugin = await this.loadPlugins();

        for await (const nP of filePlugin) {

            try {

                const mP = await import('/' + nP);
                const p: IPluginAttr = {} as any;

                if (!mP.pluginData) continue;

                p.file = nP;
                const infoNp = mls.l2.getPath(nP)
                p.tag = convertFileNameToTag(infoNp);
                p.pluginData = mP.pluginData;
                this.plugins.push(p);

            } catch (e) {
                continue;
            }


        }

    }

    private async loadPlugins(): Promise<string[]> {

        const project  = mls.actualProject;
        if (!project) return [];
        const plgs = await loadPluginProject(project, 'l3PreviewAttr');

        const ret: string[] = [];
        plgs.forEach((p) => {

            ret.push(p.widget);
        });

        return ret;
    }

}

interface IAttr {
    attr: string,
    vl: string,
    hasVariation: boolean;
    description: string,
    variations: IVariation[]
}

interface IVariation {
    attr: string,
    vl: string,
}

interface IPluginAttr {
    pluginData: mls.plugin.IPluginData,
    file: string,
    tag: string,
}
