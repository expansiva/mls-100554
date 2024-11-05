/// <mls shortName="pluginStyleTransform" project="100554" enhancement="_100554_enhancementLit" groupName="other" />


import { html, css, svg, repeat, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement, getMessageKey } from './_100554_collabLitElement'

/// **collab_i18n_start**
const message_pt = {
    advanced: 'Avançado',
    scaleX: 'Escala x',
    scaleY: 'Escala y',
    skewX: 'Inclinar x',
    skewY: 'Inclinar y',
    translateX: 'Transladar x',
    translateY: 'Transladar y',
    rotate: 'Rotacionar',
    description: 'Um plugin versátil para manter e aplicar propriedades de transformação CSS. Gerencie facilmente transformações de escala, rotação, inclinação e tradução para criar elementos de UI dinâmicos e interativos com precisão'
}

const message_en = {
    advanced: 'Advanced',
    scaleX: 'Scale x',
    scaleY: 'Scale y',
    skewX: 'Skew x',
    skewY: 'Skew Y',
    translateX: 'Translate x',
    translateY: 'Translate y',
    rotate: 'Rotate',
    description: 'A versatile plugin for maintaining and applying CSS transform properties. Easily manage scale, rotate, skew, and translate transformations to create dynamic and interactive UI elements with precision.'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**


export const tags = ['transform'];

export function getDescription() {
    const lang = getMessageKey(messages);
    return messages[lang].description;
}

@customElement('plugin-style-transform-100554')
export class PluginStyleTransform extends CollabLitElement {

    @property() showFull: string = 'false';

    private msg: MessageType = messages['en'];

    private arrayGallery = [
        '',
        'transform: scale(1.5);',
        'transform: rotate(90deg);',
        'transform: rotate(181deg);',
        'transform: rotate(270deg);',
        'transform: skew(50deg);',
        'transform: skew(50deg, -50deg);',
        'transform: skew(-50deg, 0deg);',
        'transform: skew(-50deg, 50deg);',
        'transform: translateX(20px);',
        'transform: scale(0.75);',
        'transform: scaleX(1.2);',
        'transform: scaleY(1.8);',
        'transform: rotate(45deg);',
        'transform: rotate(-45deg);',
        'transform: rotate3d(1, 1, 0, 60deg);',
        'transform: skewX(30deg);',
        'transform: skewY(-15deg);',
        'transform: rotate3d(0, 1, 0, 180deg);',

    ];

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
            ${this.showFull === 'true' ?
                html`
                    ${this.renderGallery()}
                    ${this.renderTransform()}

                ` :
                html`
                    ${this.renderGallery()}
                `
            }
        `;

    }

    renderTransform() {
        return html`
            <div class="group">
                <span>${this.msg.scaleX}</span>
                <div class="group-edit">
                    <collab-ds-input-range-100554 prop="scaleX" value="0px" useSelect="false"></collab-ds-input-range-100554>
                </div>
                <span>${this.msg.scaleY}</span>
                <div class="group-edit">
                    <collab-ds-input-range-100554 prop="scaleY" value="0px" useSelect="false"></collab-ds-input-range-100554>
                </div>
                <span>${this.msg.skewX}</span>
                <div class="group-edit">
                    <collab-ds-input-range-100554 prop="skewX" value="0px" useSelect="false"></collab-ds-input-range-100554>
                </div>
                <span>${this.msg.skewY}</span>
                <div class="group-edit">
                    <collab-ds-input-range-100554 prop="skewY" value="0px" useSelect="false"></collab-ds-input-range-100554>
                </div>
                <span>${this.msg.translateX}</span>
                <div class="group-edit">
                    <collab-ds-input-range-100554 prop="translateX" value="0px" useSelect="false"></collab-ds-input-range-100554>
                </div>
                <span>${this.msg.translateY}</span>
                <div class="group-edit">
                    <collab-ds-input-range-100554 prop="translateY" value="0px" useSelect="false"></collab-ds-input-range-100554>
                </div>
                <span>${this.msg.rotate}</span>
                <div class="group-edit">
                    <collab-ds-input-range-100554 prop="rotate" value="0px" useSelect="false"></collab-ds-input-range-100554>
                </div>
            </div>
        `;
    }

    renderGallery() {
        return html`
            <div class="gallery">
                ${repeat(this.arrayGallery, ((key: any) => key) as any,
            ((css: any, index: any) => {
                return html`<h5 style="${css}" .gallery=${css}>Item</h5>`;
            }) as any
        )}
            </div>
        
        `
    }

}