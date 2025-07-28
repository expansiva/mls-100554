/// <mls shortName="collabPageElement" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, PropertyValueMap } from 'lit';
import { property } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';
import { WCDOverlayMethods  } from './_100554_wcdTypes';
import { IICADepths, IcaLitElementBaseMethods } from './_100554_icaTypes'
import { convertTagToFileName } from './_100554_utilsLit'

export const PREFIX_ICA_ID = 'ica_';

export function toPascalCase(str: string) {
    return str.replace(/(^\w|-\w)/g, match => match.replace('-', '').toUpperCase());
}

export abstract class CollabPageElement extends StateLitElement {

    abstract initPage(): void

    @property({ type: String, reflect: true }) modeoverlay: string = '';

    @property() initPageComplete: boolean = false;

    @property({ type: String, reflect: true }) level: string = window.mls && mls.actualLevel ? mls.actualLevel.toString() :  '7';

    public overlay: WCDOverlayMethods | undefined;

    public isPage = true;

    public recreateOverlay() {
        this.overlay?.remove();
        this.overlay = undefined;
        this.createOverlay();
    }

    public refreshOverlay() {
        this.checkToAddOverlay();
    }

    constructor() {
        super();
    }

    //--------COMPONENT------------

    createRenderRoot() {
        return this; // dont use shadow root
    }

    async firstUpdated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
        super.firstUpdated(changedProperties);
        setTimeout(() => {
            this.checkToAddOverlay();
        }, 500);

        //this.setupIds();
        // this.setupEvents();
        await this.initPage();
        this.initPageComplete = true;

    }

    updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
        super.updated(changedProperties);
        if (changedProperties.has('level') && changedProperties.get('level') !== undefined) {
            this.checkToAddOverlay();
        }
    }

    render() {
        this.style.position = 'relative';
        return html``;
    }

    //--------IMPLEMENTS------------


    private setupIds(): void {
        const icas = this.findAllElementsIca(this);
        icas.forEach((item) => {
            const oldId = item.element.id;
            const icaId = `${PREFIX_ICA_ID}${item.element.id}`;
            item.element.setAttribute('id', icaId);
            item.element.setAttribute('idel', oldId);
        });

    }

    private checkToAddOverlay(): void {

        if (this.level === '7') {
            this.overlay?.remove();
            this.overlay = undefined;
            return;
        }

        if (this.overlay) {
            this.overlay.setAttribute('level', this.level)
            this.overlay.changeOverlayItemsLevel();
            return;
        }

        this.createOverlay();
    }

    private async createOverlay() {

        if (!this.modeoverlay) return;
        const ok = await this.importWCDOverlay(this.modeoverlay);
        if (!ok) return;
        this.overlay = document.createElement(this.modeoverlay) as WCDOverlayMethods;
        this.overlay.myItens = this.findAllElementsIca(this);
        this.overlay.createOverlayItems();
        this.appendChild(this.overlay as HTMLElement);
        mls.events.fire(3, 'WCDEventChange' as any,JSON.stringify({op:'recreateOverlay'}));

    }

    private hasImport: string[] = [];
    private async importWCDOverlay(imports: string) {

        try {

            if (this.hasImport.includes(imports)) return true;
            const info = convertTagToFileName(imports);
            imports = `_${info.project}_${info.shortName}`;
            if (!imports.startsWith('./')) {
                imports = './' + imports;
                /*if (mls && (mls as any).modePreview && (mls as any).modePreview === 'singlePage') imports = '/' + imports;
                else imports = './' + imports;*/
                
            }
            await import(imports);
            this.hasImport.push(imports);
            return true;

        } catch (e) {
            console.info(e);
            return false
        }

    }

    private findAllElementsIca(el: HTMLElement): IICADepths[] {
        let elements: IICADepths[] = [];
        let elToSearch: Element | ShadowRoot = el;

        const arrayEls: HTMLElement[] = [];

        function traverseShadowRoot(element: HTMLElement, depth: number) {

            if (element.getAttribute('mls_origin') && !arrayEls.includes(element)) {
                const { x, y, height, width } = element.getBoundingClientRect();
                elements.push({ element: element as IcaLitElementBaseMethods, depth, x, y, height, width, opacity: element.style.opacity });
                arrayEls.push(element);
                return;
            }
            if (element.shadowRoot) {
                element.shadowRoot.querySelectorAll('*').forEach((item) => {
                    traverseShadowRoot(item as HTMLElement, depth + 1);
                });
            } else {
                const children = Array.from(element.children);
                if (children.length > 0) {
                    children.forEach(child => traverseShadowRoot(child as HTMLElement, depth + 1));
                }
            }
        }



        if (el.shadowRoot)
            elToSearch = el.shadowRoot;
        elToSearch.querySelectorAll('*').forEach((item) => {
            traverseShadowRoot(item as HTMLElement, 0); // Inicializar com profundidade 0
        });

        return elements;

    }

}

