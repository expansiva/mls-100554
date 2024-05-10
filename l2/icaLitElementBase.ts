/// <mls shortName="icaLitElementBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { collabState } from './_100554_collabLitElement';
import { IcaLitElement } from './_100554_icaLitElement';

import * as icaGlobal from './_100554_icaGlobal';
import * as states from './_100554_icaCollabStore';
import { convertFileNameToTag, convertTagToFileName } from './_100554_utilsLit';
import { initWCDToolbox, WCDToolbox } from './_100554_wcdToolbox'
import { html, unsafeHTML } from 'lit';
import { property } from 'lit/decorators.js';


export abstract class IcaLitElementBase extends IcaLitElement implements IcaLitElementBaseMethods {

    constructor() {
        super();
        initWCDToolbox();
    }

    abstract mySymbol: string;
    abstract actions: icaGlobal.IActionLevels;
    abstract setActions(level: string): Promise<void>;
    abstract changeStateHtml(info: string): void;
    abstract allowCommand(cmd: 'move' | '', scope: HTMLElement, target: HTMLElement): IAllowCommand;

    @property({ type: String })
    @collabState(states.CHANGESTATE)
    private changeState: string = '';

    @property({ type: String, reflect: true })
    public widget: string | undefined;

    @property({ type: Boolean, reflect: true })
    public isICAGroup: boolean | undefined;

    @property({ type: String })
    public renderType: 'preview' | 'edit' | 'editactive' | undefined;

    @property({ type: String })
    public level: '1' | '2' | '3' | '4' | '5' | '6' | '7' | undefined;

    @property({ type: String })
    public styleel: string | undefined = '';

    public internalInnerHTML = '';

    private isLoadMyAction: any = {};
    private lastWidget: string = '';
    private styleElMain: CSSStyleDeclaration | undefined = undefined;

    createRenderRoot() {
        return this;
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.setInitialConfigs();
    }

    async firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(changedProperties);
        const tempeEl = document.createElement('span');
        tempeEl.style.cssText = this.styleel ? this.styleel : '';
        this.styleElMain = tempeEl.style;
    }

    protected updated(changedProperties: Map<string | number | symbol, unknown>): void {
        super.updated(changedProperties);

        if (this.lastWidget !== this.widget) {
            this.lastWidget = this.widget as string;
            this.updateStyleDisplay();
        }
        if (this.renderType === 'edit') {
            this.setEventsIfRenderTypeEdit();
        }
        if (this.renderType === 'editactive') {
            this.addWCDToolbox();
        }

        this.performPreSlotAllocationOperations();

    }

    public changeStateStyle(style: {}): void {
        debugger
        if (!this.styleElMain || !style) return;
        const el = this.querySelector(`${this.widget}:first-child`) as HTMLElement
        if (el) {
            this.styleElMain.cssText = el.style.cssText;
            Object.assign(this.styleElMain, style as CSSStyleDeclaration);
            el.style.cssText = this.styleElMain.cssText;
            this.styleel = el.style.cssText
        }
    }

    private addWCDToolbox() {
        const wcd: WCDToolbox = document.createElement('wcd-toolbox-100554') as WCDToolbox;
        if (this.level) wcd.setAttribute('level', this.level.toString());
        if (this.widget) wcd.setAttribute('widget', this.widget);
        let act = (this.actions as any)[this.level as any];
        if (!act) act = [];
        wcd.actions = act;
        this.appendChild(wcd);
    }

    private updateStyleDisplay() {
        const el = this.querySelector(this.widget as string);
        if (el) {
            const d = window.getComputedStyle(el);
            this.style.display = d.display;
        }
    }

    private setEventsIfRenderTypeEdit() {

        this.onclick = async (e: MouseEvent) => {

            //When clicking on an "edit" item I return the old "editactive" to "edit" and set the new "editactive"
            e.stopPropagation();
            if ((e.target as HTMLElement).tagName.startsWith('WCD-')) return;

            // const all = document.querySelectorAll('*[renderType]');
            const all = this.findElementsStartingWithIca();

            Array.from(all).forEach((i) => {
                const wcd = i.querySelector('wcd-toolbox-100554');
                if (wcd) wcd.remove();
                i.setAttribute('renderType', 'edit')
            });

            const inGroup = this.closest(`*[${icaGlobal.ATTRGROUP}]`) as HTMLElement;
            if (inGroup && inGroup !== this && inGroup.getAttribute(`${icaGlobal.ATTRGROUP}`) === 'true') {
                inGroup.click();
                return;
            }

            this.onclick = undefined as any;
            if (!this.isLoadMyAction[this.level as any] || this.isLoadMyAction[this.level as any] === false) {
                this.isLoadMyAction[this.level as any] = true;
                await this.setActions(this.level as any);
            }

            this.setAttribute('renderType', 'editactive');
            if (this.level !== '4') return;
            mls.events.fire(4, 'WCDEvent' as any, `{"op":"Navigation"}`);
            mls.events.fire((+(this.level as any)) as any, 'WCDEventChange' as any, `{"op":"Navigation"}`);
        }

    }

    private findElementsStartingWithIca(): Element[] {
        let elements: Element[] = [];
        // Function to traverse shadow DOM
        function traverseShadowRoot(element: Element) {
            if (element.tagName.toLowerCase().startsWith('ica')) {
                elements.push(element);
                return;
            }

            if (element.shadowRoot) {
                element.shadowRoot.querySelectorAll('*').forEach((item) => {
                    traverseShadowRoot(item);
                })
            } else {
                const children = Array.from(element.children);
                if (children.length > 0) {
                    children.forEach(child => traverseShadowRoot(child));
                }
            }
        }

        document.body.querySelectorAll('*').forEach((item) => {
            traverseShadowRoot(item);
        });
        return elements;
    }

    shouldUpdate(changedProperties: Map<string, string>): boolean {

        // shouldUpdate determinar se o componente deve ser renderizado novamente true = executa, false = não executa o render().
        const oldValue = changedProperties.get('renderType');
        if (oldValue === 'editactive' && this.renderType !== 'editactive') {
            super.setCollabState(states.CHANGESTATE, '');

        } else if (changedProperties.get('changeState') !== undefined && this.changeState) {
            // this.doChangeState(this.changeState);
            return false;
        }

        if (changedProperties.get('level') && !this.isLoadMyAction[this.level as any] && this.renderType === 'editactive') {
            this.auxSetMyActions();
        }
        return true;

    }

    private async auxSetMyActions() {

        await this.setActions(this.level as any);
        this.isLoadMyAction[this.level as any] = true;
        this.renderType = 'edit';
        setTimeout(() => { this.click(); }, 200);

    }

    public async importAction(imports: string, actions: icaGlobal.IActionLevels, level: string, mode: string = '', position: string = '') {

        try {
            if (!imports.startsWith('./')) imports = './' + imports;
            const { getTemplate } = await import(imports);
            const temp = getTemplate(mode, position);
            (actions as any)[level].push(temp);
        } catch (e) {
            console.info(e);
        }

    }

    public getICAComponents(scope: HTMLElement): IcaLitElementBase[] {

        let ret: IcaLitElementBase[] = [];
        const reentrance = (el: IcaLitElementBase | HTMLElement) => {
            const tag = el.tagName.toLowerCase();
            if (tag.startsWith(`${icaGlobal.PREFIX}-`)) {
                ret.push(el as IcaLitElementBase);
            }

            const isGroup = el.getAttribute(`${icaGlobal.ATTRGROUP}`);
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
        let ret = this.closest(`${icaGlobal.ICAPAGE}`) as IcaLitElementBase;
        if (!ret) ret = this.closest('body') as any;
        return ret
    }

    public getIcaParent(target: HTMLElement): IcaLitElementBase | undefined {
        const parent = target.parentElement;
        if (!parent) return;
        const tag = parent.tagName.toLowerCase();
        if (!tag.startsWith(`${icaGlobal.PREFIX}-`)) return this.getIcaParent(parent);
        else if (tag.startsWith(`${icaGlobal.PREFIX}-`)) return parent as IcaLitElementBase;
    }

    private doChangeState(js: string): void {

        const info = JSON.parse(js);
        if (this.renderType === 'editactive') {
            switch (info.tp) {
                case "menu":
                    console.info(info.menu);
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
        }

        mls.events.fire((+(this.level as any)) as any, 'WCDEventChange' as any, `{"op":"Navigation"}`);

    }


    async performPreSlotAllocationOperations() {

        if (!this.widget) return;
        const tag = convertFileNameToTag(this.widget);
        if (tag.startsWith(icaGlobal.PREFIX) || tag.startsWith(icaGlobal.PREFIXWCD)) return;

        Promise.all([tag].map((wc) => customElements.whenDefined(wc))).then(async () => {

            let childrens = Array.from(this.children).filter((child) => child.tagName !== tag.toUpperCase());
            const widgetElement = this.querySelector(tag) as IcaLitElementBase;
            if (!widgetElement || !childrens || childrens.length === 0) return;

            childrens.forEach((child) => {
                if (child.tagName.toLowerCase().startsWith(icaGlobal.PREFIXWCD)) return;
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

    render() {

        this.style.display = 'block';

        const attrs = this.getAttributes();
        let code = `
            <${this.widget} ${attrs}>
            </${this.widget}>
        `;
        return html`${unsafeHTML(code)}`;
    }

    getAttributes() {

        const excludesProps = ['rendertype', 'level', 'widget'];
        let attributes = '';
        const attributeNames = this.getAttributeNames();
        for (const attrName of attributeNames) {
            if (excludesProps.includes(attrName)) continue;
            let attrValue = this.getAttribute(attrName);
            if (attrName === 'style') attrValue = this.styleel || null;
            if (attrValue !== null) {
                attributes += `${attrName}="${attrValue}" `;
            }
        }
        return attributes;
    }

}

interface IcaLitElementBaseMethods {
    mySymbol: string;
    actions: icaGlobal.IActionLevels;
    setActions(level: string): Promise<void>;
    changeStateStyle(info: {}): void;
    changeStateHtml(info: string): void;
    allowCommand(cmd: 'move' | '', scope: HTMLElement, target: HTMLElement): IAllowCommand;
}

export interface IAllowCommand {
    inside: boolean,
    before: boolean,
    after: boolean
}
