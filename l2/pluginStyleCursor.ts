/// <mls shortName="pluginStyleCursor" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IcaLitElement, propertyDataSource } from './_100554_icaLitElement';
import { getMessageKey } from './_100554_collabLitElement'
import { ICSSState } from './_100554_lessCSS';
import { globalState } from './_100554_icaState';

/// **collab_i18n_start**
const message_pt = {
    description: 'Um plugin versátil para manter e personalizar propriedades de clip-path CSS. Crie facilmente formas complexas e aplique-as a elementos, permitindo designs de UI exclusivos e criativos com precisão.'
}

const message_en = {
    description: 'A versatile plugin for maintaining and customizing CSS clip-path properties. Easily create complex shapes and apply them to elements, enabling unique and creative UI designs with precision.'

}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**


export const tags = ['cursor'];

export function getDescription() {
    const lang = getMessageKey(messages);
    return messages[lang].description;
}

@customElement('plugin-style-cursor-100554')
export class PluginStyleClipath extends IcaLitElement {

    @propertyDataSource() state: ICSSState | undefined;
    @property() position: 'left' | 'right' = 'left';
    @property() showFull: string = 'false';

    render() {
        return html`${this.renderGallery()}`;
    }

    renderGallery() {

        return html`
            <div class="gallery">
                ${repeat(this.arrayGallery, ((key: any) => key) as any,
            ((css: any, index: any) => {
                return html`
                            <div class="itemgallery" style=${css.css} .gallery=${css.css} .name= ${css.name} @click="${this.handleChangeCss}">
                                ${css.name}
                            </div>
                        `;
            }) as any
        )}
            </div>
        
        `
    }

    private timeonChange = -1;
    private handleChangeCss(e: KeyboardEvent) {

        e.stopPropagation();
        let el = e.target as HTMLElement;
        if (!el.classList.contains('itemgallery')) {
            el = el.closest('.itemgallery') as HTMLElement;
        }

        let css = (el as any).gallery;
        let name = (el as any).name;
        if (!el || !css && !name) return;
        css = css.replace('cursor:', '').trim();

        clearTimeout(this.timeonChange);
        this.timeonChange = setTimeout(() => {
            this.setState(css);

        }, 100);
    }

    private setState(css: string) {
        globalState._ica.less[this.position].emitter = 'helper';
        const styles = globalState._ica.less[this.position].lessCSS.styles;
        styles.cursor = css;
    }

    private arrayGallery = [
        { "css": "cursor: alias", "name": "alias" },
        { "css": "cursor: all-scroll", "name": "all-scroll" },
        { "css": "cursor: auto", "name": "auto" },
        { "css": "cursor: cell", "name": "cell" },
        { "css": "cursor: col-resize", "name": "col-resize" },
        { "css": "cursor: context-menu", "name": "context-menu" },
        { "css": "cursor: copy", "name": "copy" },
        { "css": "cursor: crosshair", "name": "crosshair" },
        { "css": "cursor: default", "name": "default" },
        { "css": "cursor: e-resize", "name": "e-resize" },
        { "css": "cursor: ew-resize", "name": "ew-resize" },
        { "css": "cursor: grab", "name": "grab" },
        { "css": "cursor: grabbing", "name": "grabbing" },
        { "css": "cursor: help", "name": "help" },
        { "css": "cursor: move", "name": "move" },
        { "css": "cursor: n-resize", "name": "n-resize" },
        { "css": "cursor: ne-resize", "name": "ne-resize" },
        { "css": "cursor: nesw-resize", "name": "nesw-resize" },
        { "css": "cursor: ns-resize", "name": "ns-resize" },
        { "css": "cursor: nw-resize", "name": "nw-resize" },
        { "css": "cursor: nwse-resize", "name": "nwse-resize" },
        { "css": "cursor: no-drop", "name": "no-drop" },
        { "css": "cursor: none", "name": "none" },
        { "css": "cursor: not-allowed", "name": "not-allowed" },
        { "css": "cursor: pointer", "name": "pointer" },
        { "css": "cursor: progress", "name": "progress" },
        { "css": "cursor: row-resize", "name": "row-resize" },
        { "css": "cursor: s-resize", "name": "s-resize" },
        { "css": "cursor: se-resize", "name": "se-resize" },
        { "css": "cursor: sw-resize", "name": "sw-resize" },
        { "css": "cursor: text", "name": "text" },
        { "css": "cursor: w-resize", "name": "w-resize" },
        { "css": "cursor: wait", "name": "wait" },
        { "css": "cursor: zoom-in", "name": "zoom-in" },
        { "css": "cursor: zoom-out", "name": "zoom-out" }
    ]
}