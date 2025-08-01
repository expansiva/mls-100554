/// <mls shortName="wcdToolboxItemActionEditVariation" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, repeat, LitElement, render } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
import { dispatchEventConciliate } from './_100554_wcdCommandBase';
import { getConfigProject } from './_100554_libProjectConfig';

@customElement('wcd-toolbox-item-action-edit-variation-100554')
export class WCDToolboxItemActionEditAttrOut extends CollabLitElement {

    @property() info: IAttr | undefined;
    private languages: ILanguage = {}
    private elIca: HTMLElement | undefined;

    constructor() {
        super();
        this.init();
    }

    //-------COMPONENT---------------------


    render() {

        if (!this.info) return html``;
        if (!this.info.hasVariation) return html`This attribute has no variation`;

        return html`
            ${repeat(this.info.variations, ((key: IVariation) => key.attr) as any, ((k: IVariation, index: any) => { return this.renderVariantItem(k) }) as any)}  
            ${this.renderAddVariation(this.info)}  
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

        if (array.length <= 1) return;

        return html` 
            <addvariation .info=${info}>
                <addvariationitem>
                    <select>
                        ${repeat(array, ((key: string) => key) as any, ((k: string, index: any) => { return this.renderOptVariant(k, index) }) as any)}
                    </select>
                    <button @click="${this.clickAddVariation}">+</button>
                </addvariationitem>
            </addvariation>
        
        `
    }

    renderOptVariant(v: string, index: number) {

        let stl = '';
        const i = this.languages[v];
        let item = i.name;

        if (index === 0) {
            stl = 'display:none';
            item = '';
        }

        return html`
            <option value="${v}" style="${stl}">${item}</option>
        
        `
    }

    //---------IMPLEMENTATION-----------------

    private async init() {
        this.setLanguages();
    }

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

        const evento = new CustomEvent('setconfig', {
            detail: { vl: `fatherforceUpdate`, me: this },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(evento);


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
        const project = mls.actualProject;
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

interface IPluginAttr {
    pluginData: mls.plugin.IPluginData,
    file: string,
    tag: string,
}