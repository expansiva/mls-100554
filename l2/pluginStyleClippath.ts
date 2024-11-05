/// <mls shortName="pluginStyleClippath" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, svg, repeat, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement,getMessageKey } from './_100554_collabLitElement'

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


export const tags = ['clip-path'];

export function getDescription() {
    const lang = getMessageKey(messages);
    return messages[lang].description;
}

@customElement('plugin-style-clippath-100554')
export class PluginStyleClipath extends CollabLitElement {

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
                            <div .gallery=${css.css}>
                                <div class="gallery-item" style="${css.css}" .gallery=${css.css}></div>
                                <div .gallery=${css.css}></div>
                            </div>
                        `;
            }) as any
        )}
            </div>
        
        `
    }

    private arrayGallery = [
        { css: '', name: 'none' },
        { css: 'clip-path: polygon(50% 0%, 0% 100%, 100% 100%);', name: 'triangle' },
        { css: 'clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)', name: 'trapezoid' },
        { css: 'clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)', name: 'parallelogram' },
        { css: 'clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', name: 'rhombus' },
        { css: 'clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)', name: 'pentagon' },
        { css: 'clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', name: 'hexagon' },
        { css: 'clip-path: polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)', name: 'heptagon' },
        { css: 'clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)', name: 'octagon' },
        { css: 'clip-path: polygon(50% 0%, 83% 12%, 100% 43%, 94% 78%, 68% 100%, 32% 100%, 6% 78%, 0% 43%, 17% 12%)', name: 'nonagon' },
        { css: 'clip-path: polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)', name: 'decagon' },
        { css: 'clip-path: polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)', name: 'bevel' },
        { css: 'clip-path: polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%)', name: 'rabbet' },
        { css: 'clip-path: polygon(40% 0%, 40% 20%, 100% 20%, 100% 80%, 40% 80%, 40% 100%, 0% 50%)', name: 'left-arrow' },
        { css: 'clip-path: polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)', name: 'right-arrow' },
        { css: 'clip-path: polygon(25% 0%, 100% 1%, 100% 100%, 25% 100%, 0% 50%)', name: 'left-poin' },
        { css: 'clip-path: polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%)', name: 'right-point' },
        { css: 'clip-path: polygon(100% 0%, 75% 50%, 100% 100%, 25% 100%, 0% 50%, 25% 0%)', name: 'left-chevron' },
        { css: 'clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)', name: 'right-chevron' },
        { css: 'clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', name: 'star' },
        { css: 'clip-path: polygon(10% 25%, 35% 25%, 35% 0%, 65% 0%, 65% 25%, 90% 25%, 90% 50%, 65% 50%, 65% 100%, 35% 100%, 35% 50%, 10% 50%)', name: 'cross' },
        { css: 'clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)', name: 'message' },
        { css: 'clip-path: polygon(0% 0%, 0% 100%, 25% 100%, 25% 25%, 75% 25%, 75% 75%, 25% 75%, 25% 100%, 100% 100%, 100% 0%)', name: 'frame' },
        { css: 'clip-path: polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)', name: 'close' },
        { css: 'clip-path: circle(40% at 50% 50%)', name: 'circle' },
        { css: 'clip-path: ellipse(25% 40% at 50% 50%)', name: 'ellipse' },


    ];
}