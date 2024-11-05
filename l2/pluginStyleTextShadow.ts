/// <mls shortName="pluginStyleTextShadow" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, svg, repeat, TemplateResult } from 'lit';
import { customElement, property, query, queryAll } from 'lit/decorators.js';
import { CollabLitElement, getMessageKey } from './_100554_collabLitElement';
import './_100554_collabDsInputSelectColor';
import './_100554_collabDsInputRange';

/// **collab_i18n_start**
const message_pt = {
    advanced: 'Avançado',
    xOffset: 'X Offset',
    yOffset: 'Y Offset',
    blur: 'Desfoque',
    color: 'Cor',
    gallery: 'Galeria',
    description: 'Um plugin abrangente para gerenciar e personalizar propriedades de sombra de texto. Aplique sombras sem esforço com deslocamentos ajustáveis, desfoque e opções de cores para melhorar a aparência e a legibilidade do texto.'

}

const message_en = {
    advanced: 'Advanced',
    xOffset: 'X Offset',
    yOffset: 'Y Offset',
    blur: 'Blur',
    color: 'Color',
    gallery: 'Galeria',
    description: 'A comprehensive plugin for managing and customizing text-shadow properties. Effortlessly apply shadows with adjustable offsets, blur, and color options to enhance text appearance and readability.'


}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**


export const tags = ['text-shadow'];

export function getDescription() {
    const lang = getMessageKey(messages);
    return messages[lang].description;
}

@customElement('plugin-style-text-shadow-100554')
export class PluginStyleTextShadow extends CollabLitElement {

    @property() showFull: string = 'false';

    private msg: MessageType = messages['en'];

    private tpMeasures = ['px', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax', 'ex', 'ch', 'auto'];

    private arrayGallery = [
        '',
        'text-shadow: 2px 2px;',
        'text-shadow: 2px 2px 5px;',
        'text-shadow: 0 0 3px',
        'text-shadow: 3px 3px 3px;',
        'text-shadow: 3px -3px 3px;',
        'text-shadow: 1px 1px 2px #000;',
        'text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);',
        'text-shadow: -2px 2px 4px #333;',
        'text-shadow: 0 0 5px #f00;',
        'text-shadow: 4px 4px 6px rgba(50, 50, 50, 0.75);',
        'text-shadow: -3px -3px 4px #888;',
        'text-shadow: 5px 5px 10px #ff6347;',
        'text-shadow: 1px 2px 0 #000, 2px 3px 0 #ff0;',
        'text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);',
        'text-shadow: 2px 2px 8px #006400;',
        'text-shadow: 6px 6px 10px #0000ff;',
        'text-shadow: 0 0 2px #ccc, 2px 2px 4px #000;',
        'text-shadow: -1px -1px 3px #555;',
        'text-shadow: 2px 2px 5px rgba(100, 100, 100, 0.5);',
        'text-shadow: 0px 1px 1px #999, 0px 2px 2px #666;',
    ];

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return html`
             ${this.showFull === 'true' ?
                html`
                ${this.renderGallery()}
                ${this.renderColumn()}
            ` :
                html`
                ${this.renderGallery()}
            `
            }
        `;
    }

    renderColumn() {
        return html`
            <div>
                <div class="group">
                    <span>${this.msg.xOffset}</span>
                    <div class="group-edit">
                        <collab-ds-input-range-100554 prop="x" value="0px" .arraySelect=${this.tpMeasures}  ></collab-ds-input-range-100554>
                    </div>

                    <span>${this.msg.yOffset}</span>
                    <div class="group-edit">
                        <collab-ds-input-range-100554 prop="y" value="0px" .arraySelect=${this.tpMeasures}  ></collab-ds-input-range-100554>
                    </div>

                    <span>${this.msg.blur}</span>
                    <div class="group-edit">
                        <collab-ds-input-range-100554 prop="blur" value="0px" .arraySelect=${this.tpMeasures}  ></collab-ds-input-range-100554>
                    </div>
                    
                    <span>${this.msg.color}</span>
                    <div class="group-edit">
                        <collab-ds-input-select-color-100554 prop="color" useInput="false" useSelect="false" ></collab-ds-input-select-color-100554>
                    </div>
                </div>
            </div>
        `;
    }

    renderGallery() {

        return html`
            <div class="gallery">
                ${repeat(this.arrayGallery, ((key: any) => key) as any,
            ((css: any, index: any) => {
                return html`
                        <h5 style="${css}" .gallery=${css}>Text</h5>
                        `;
            }) as any
        )}
            </div>
        
        `
    }

}
