/// <mls shortName="icaLitElementBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, unsafeHTML } from 'lit';
import { property } from 'lit/decorators.js';

import { collabState } from './_100554_collabLitElement';
import { IcaLitElement } from './_100554_icaLitElement';
import { convertFileNameToTag, convertTagToFileName } from './_100554_utilsLit';
import * as tps from './_100554_icaTypes';
import * as globalIca from './_100554_icaGlobal';
import * as myDefinition from './_100554_icaBaseDescription';


export abstract class IcaLitElementBase extends IcaLitElement implements tps.IcaLitElementBaseMethods {

    constructor() {
        super();
    }

    abstract mySymbol: string;
    abstract changeStateHtml(info: string): void;
    abstract allowCommand(cmd: 'move' | '', scope: HTMLElement, target: HTMLElement): tps.IAllowCommand;
    abstract getActionsTags(): tps.ActionTag[];

    public overlayRef: HTMLElement | undefined;

    public clickMenu: Function | undefined;

    @property({ type: String })
    @collabState(globalIca.CHANGESTATE)
    private changeState: string = '';

    @property({ type: String, reflect: true })
    public widget: string | undefined;

    @property({ type: String, reflect: true })
    public id: string = '';

    @property({ type: Boolean, reflect: true })
    public isICAGroup: boolean | undefined;

    @property({ type: String })
    public renderType: 'preview' | 'edit' | 'editactive' | undefined;

    @property({ type: String })
    public level: '1' | '2' | '3' | '4' | '5' | '6' | '7' | undefined;

    @property({ type: String })
    public styleel: string | undefined = '';

    public internalInnerHTML = '';

    private lastWidget: string = '';

    private styleElMain: CSSStyleDeclaration | undefined = undefined;

    //--------COMPONENT-----------------
    createRenderRoot() {
        return this;
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.setInitialConfigs();
    }

    shouldUpdate(changedProperties: Map<string, string>): boolean {

        if (changedProperties.get('changeState') !== undefined && this.changeState && this.renderType === 'editactive') {
            this.doChangeState(this.changeState);
            return false;
        }
        return true;

    }

    async firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(changedProperties);
        const tempeEl = document.createElement('span');
        tempeEl.style.cssText = this.styleel ? this.styleel : '';
        this.styleElMain = tempeEl.style;
        await this.performPreSlotAllocationOperations();

    }

    protected updated(changedProperties: Map<string | number | symbol, unknown>): void {
        super.updated(changedProperties);

        const hasLevel = changedProperties.has('level');
        const hasStyleEl = changedProperties.has('styleel');

        if (this.widget && this.lastWidget !== this.widget) {
            this.lastWidget = this.widget as string;
            customElements.whenDefined(this.lastWidget).then(() => {
                this.updateStyleDisplay();
            });
        }

        if (hasLevel) {
            const valLevel = changedProperties.get('level');
            if (this.level === valLevel) return;
            this.updateLevelIcas();
        }

        if (hasStyleEl) {
            const valStyleEl = changedProperties.get('styleel');
            if (this.styleel === valStyleEl) return;
            this.updateStyleEl();
        }

    }

    render() {

        this.style.display = 'block';
        if (!this.style.width) this.style.width = 'inherit';
        if (!this.style.height) this.style.height = 'inherit';

        const attrs = this.getAttributes();
        let code = `
            <${this.widget} ${attrs}>
            </${this.widget}>
        `;
        return html`${unsafeHTML(code)}`;
    }

    //---------IMPLEMENTATION-------------

    public changeStateStyle(style: {}): void {

        if (!this.styleElMain || !style) return;
        const el = this.querySelector(`${this.widget}:first-child`) as HTMLElement
        if (el) {
            this.styleElMain.cssText = el.style.cssText;
            Object.assign(this.styleElMain, style as CSSStyleDeclaration);
            el.style.cssText = this.styleElMain.cssText;
            this.styleel = el.style.cssText
        }
    }

    private updateStyleEl() {
        if (!this.widget) return;
        const widgetEl = this.querySelector(this.widget) as HTMLElement;
        if (!widgetEl) return;
        widgetEl.style.cssText = this.styleel || '';
    }

    private updateLevelIcas() {

        if (!this.level) return;

        const traverseShadowRoot = (element: HTMLElement) => {
            if (element.tagName.toLowerCase().startsWith('ica')) {
                element.setAttribute('level', this.level as any);
                return;
            }
            if (element.shadowRoot) {
                element.shadowRoot.querySelectorAll('*').forEach((item) => {
                    if (item.tagName.toLowerCase().startsWith('ica')) {
                        item.setAttribute('level', this.level as any);
                    }
                });
            } else {
                const children = Array.from(element.children);
                if (children.length > 0) {
                    children.forEach(child => {
                        if (child.tagName.toLowerCase().startsWith('ica')) {
                            child.setAttribute('level', this.level as any);
                        }
                    });
                }
            }
        }

        if (!this.widget) return;
        const widgetEl = this.querySelector(this.widget);
        if (!widgetEl) return;
        traverseShadowRoot(widgetEl as HTMLElement);

    }

    private updateStyleDisplay() {
        const el = this.querySelector(this.widget as string);
        if (el) {
            const d = window.getComputedStyle(el);
            this.style.display = d.display;
        }
    }


    private doChangeState(js: string): void {

        const info = JSON.parse(js);

        switch (info.tp) {
            case "menu":
                // console.info(info.menu);
                break;
            case "style":
                this.changeStateStyle(info.style);
                break;
            case "html":
                this.changeStateHtml(info.html);
                break;
            default:
                '';
                break;
        }

        //mls.events.fire((+(this.level as any)) as any, 'WCDEventChange' as any, `{"op":"Navigation"}`);
    }

    public getICAComponents(scope: HTMLElement): IcaLitElementBase[] {

        let ret: IcaLitElementBase[] = [];
        const reentrance = (el: IcaLitElementBase | HTMLElement) => {
            const tag = el.tagName.toLowerCase();
            if (tag.startsWith(`${globalIca.PREFIX}-`)) {
                ret.push(el as IcaLitElementBase);
            }

            const isGroup = el.getAttribute(`${globalIca.ATTRGROUP}`);
            if (!isGroup || isGroup === 'false') {
                Array.from(el.children).forEach(i => {
                    reentrance(i as HTMLElement);
                })
            }
        };

        Array.from(scope.children).forEach(i => {
            reentrance(i as HTMLElement);
        });
        return ret;

    }

    public getMyScope(): IcaLitElementBase | HTMLElement | undefined {
        let ret = this.closest(`${globalIca.ICAPAGE}`) as IcaLitElementBase;
        if (!ret) ret = this.closest('body') as any;
        return ret
    }

    public getIcaParent(target: HTMLElement): IcaLitElementBase | undefined {
        const parent = target.parentElement;
        if (!parent) return;
        const tag = parent.tagName.toLowerCase();
        if (!tag.startsWith(`${globalIca.PREFIX}-`)) return this.getIcaParent(parent);
        else if (tag.startsWith(`${globalIca.PREFIX}-`)) return parent as IcaLitElementBase;
    }

    async performPreSlotAllocationOperations() {

        if (!this.widget) return;
        const tag = convertFileNameToTag(this.widget);
        if (tag.startsWith(globalIca.PREFIX) || tag.startsWith(globalIca.PREFIXWCD)) return;

        Promise.all([tag].map((wc) => customElements.whenDefined(wc))).then(async () => {

            let childrens = Array.from(this.children).filter((child) => child.tagName !== tag.toUpperCase());
            const widgetElement = this.querySelector(tag) as IcaLitElementBase;
            if (!widgetElement || !childrens || childrens.length === 0) return;

            childrens.forEach((child) => {
                if (child.tagName.toLowerCase().startsWith(globalIca.PREFIXWCD)) return;
                child.remove();
                widgetElement.appendChild(child);
            });

            const slots = widgetElement.shadowRoot ?
                Array.from(widgetElement.shadowRoot.querySelectorAll(`slot`)) :
                Array.from(widgetElement.querySelectorAll(`slot`))

            if (!slots || slots.length === 0) return;
            const slotWithoutName = slots.find((slot) => !slot.getAttribute('name'));

            childrens.forEach(element => {
                const elementSlotName = element.getAttribute('slot');
                if (elementSlotName) {
                    const slotByName = slots.find((slot) => slot.getAttribute('name') === elementSlotName);
                    if (slotByName) slotByName.parentNode?.insertBefore(element, slotByName);
                } else if (slotWithoutName) {
                    slotWithoutName.parentNode?.insertBefore(element, slotWithoutName);
                }
            });
            slots.forEach((sl) => sl.remove());
        })
    }

    private async setInitialConfigs() {
        if (this.widget) {
            const fileName = convertTagToFileName(this.widget);
            await import('./' + fileName);
        }
    }

    getAttributes() {

        const excludesProps = ['rendertype', 'level', 'widget', 'style', 'styleel', 'id', globalIca.ATTRGROUP];
        const objVariations: any = {
            0: 'en',
            1: 'pt',
            2: 'es',
            3: 'ru'
        };

        const variation = objVariations[this.globalVariation || 0];

        const attributes = [];
        const attributeNames = this.getAttributeNames();

        for (let attrName of attributeNames) {
            if (excludesProps.includes(attrName)) continue;

            let attrValue = this.getAttribute(attrName);
            if (attrName === 'idel') attrName = 'id'

            if (attrValue !== null) {
                attributes.push({
                    name: attrName,
                    value: attrValue
                })
            }
        }


        const attrsByVariation = this.filterAttributes(attributes, variation);
        let attributesStr = '';
        attrsByVariation.forEach((item) => attributesStr += `${item.name}="${item.value}"`)

        //  console.info({ el: this, variation, attributes, attrsByVariation });

        return attributesStr;

    }

    private filterAttributes(attributes: { name: string, value: string }[], variation: string) {

        const variationSuffix = `-${variation}`; // -en
        const variationAttributes = attributes.filter(attr => attr.name.endsWith(variationSuffix));

        const nonVariationAttributes = attributes.filter(attr => {
            if (attr.name.includes('-') && attr.name.endsWith(variationSuffix)) return false;
            const split = attr.name.split('-');
            if (split.length > 1) split.pop();
            const attrBase = split.join('-');
            return !attributes.some(a => a.name.startsWith(attrBase) && a !== attr && variationAttributes.includes(a));
        });

        let aux = [...nonVariationAttributes, ...variationAttributes];
        aux.forEach(attr => {
            const split = attr.name.split('-');
            if (split.length > 0) {
                const language = split.pop();
                if (language === variation) attr.name = split.join('-');
            }
        });
        return aux;
    }


    private myInfos: { root: string, subGroup: string, finalGroup: string } | undefined;
    getMyInfos(): { root: string, subGroup: string, finalGroup: string } {

        // Remove os caracteres iniciais e finais não desejados
        let cleanedInput = this.tagName.toLocaleLowerCase().replace(/^ica-|-\d+$/g, '');

        let root: string, subgroup: string, finalgroup: string;

        // Divide a string em partes usando '-'
        let parts = cleanedInput.split('-');
        if (parts.length < 3) throw new Error('Invalid ica tag name');

        root = parts.shift() as string;
        subgroup = parts.shift() as string;
        finalgroup = parts.join(' ') as string;

        // Retorna o objeto mapeando as partes apropriadas
        return {
            root: root || '',
            subGroup: subgroup || '',
            finalGroup: finalgroup || ''
        };
    }

    getMyEvents(): string {
        if (!this.myInfos) this.myInfos = this.getMyInfos();
        return myDefinition.getFormComponentsEvents(this.myInfos.root, this.myInfos.subGroup, this.myInfos.finalGroup);
    }

    getDefinitionFromEvent(event: string): string {
        if (!this.myInfos) this.myInfos = this.getMyInfos();
        return myDefinition.getEventDescription(this.myInfos.root, this.myInfos.subGroup, this.myInfos.finalGroup, event);
    }

    getAtributtes(): string[] {

        if (!this.myInfos) this.myInfos = this.getMyInfos();
        return myDefinition.getAtributtes(this.myInfos.root, this.myInfos.subGroup, this.myInfos.finalGroup);
    }

}


