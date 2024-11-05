/// <mls shortName="pluginStyleBorder" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, svg, repeat, TemplateResult } from 'lit';
import { customElement, property, query, queryAll } from 'lit/decorators.js';
import { CollabLitElement, getMessageKey } from './_100554_collabLitElement';
import './_100554_collabDsInputSelectColor';
import './_100554_collabDsInputRange';

import {
    collab_lock,
    collab_lock_open,
    collab_border_top,
    collab_border_left,
    collab_border_right,
    collab_border_bottom,
    collab_border_bottomLeft,
    collab_border_bottomRight,
    collab_border_topLeft,
    collab_border_topRight

} from './_100554_collabIcons'

/// **collab_i18n_start**
const message_pt = {
    advanced: 'Avançado',
    all: 'Todos os cantos',
    border: 'Borda',
    gallery: 'Galeria',
    top: 'Superior',
    left: 'Esquerda',
    bottom: 'Inferior',
    right: 'Direita',
    borderRadius: 'Raio da borda',
    topLeft: 'Superior/Esquerda',
    topRight: 'Superior/Direita',
    bottomLeft: 'Inferior/Esquerda',
    bottomRight: 'Inferior/Direita',
    description: 'Um plugin poderoso projetado para manter e personalizar as propriedades das bordas sem esforço. Modifique estilos, larguras e cores de bordas com facilidade, garantindo componentes de UI consistentes e visualmente atraentes.'

}

const message_en = {
    advanced: 'Advanced',
    all: 'All corners',
    border: 'Border',
    gallery: 'Gallery',
    top: 'Top',
    left: 'Left',
    bottom: 'Bottom',
    right: 'Right',
    borderRadius: 'Border Radius',
    topLeft: 'Top/Left',
    topRight: 'Top/Right',
    bottomLeft: 'Bottom/Left',
    bottomRight: 'Bottom/Right',
    description: 'A powerful plugin designed to maintain and customize border properties effortlessly. Modify border styles, widths, and colors with ease, ensuring consistent and visually appealing UI components.'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**


export const tags = ['border*'];
export function getDescription() {
    const lang = getMessageKey(messages);
    return messages[lang].description;
}


@customElement('plugin-style-border-100554')
export class PluginStyleBorder extends CollabLitElement {

    private msg: MessageType = messages['en'];

    @property() showFull: string = 'false';

    @property() borderLocked: boolean = false;
    @property() borderRadiusLocked: boolean = false;

    @query('#helper-border-radius-lock') inputLockRadius: HTMLInputElement | undefined;
    @query('#helper-border-lock') inputLock: HTMLInputElement | undefined;
    @queryAll('collab-ds-input-select-color-100554') borderInputs: HTMLInputElement[] | undefined;
    @queryAll('collab-ds-input-range-100554') borderRadiusInputs: HTMLInputElement[] | undefined;

    private tpMeasures = ['px', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax', 'ex', 'ch', 'auto'];

    private tpBorder = ['none', 'solid', 'dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset', 'hidden']


    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`

        ${this.showFull === 'true' ?
                html`
                ${this.renderBorderGallery()}
                ${this.renderBorder()}
                ${this.renderBorderRadius()}
            ` :
                html`
                ${this.renderBorderGallery()}
            `
            }
        `;
    }

    renderBorder() {
        return html`
            <h5 class="helper-group-title" >${this.msg.border}</h5>
            <div class="helper-group-lock">
                <input id="helper-border-lock" type="checkbox" @change=${this.handleChangeLockBorder}>
                <label for="helper-border-lock"> ${this.msg.all}</label>
                <i>${this.borderLocked ? collab_lock : collab_lock_open}</i>
            </div>

            <div class="group">

                <div class="group-edit">
                    <i data-tooltip="${this.msg.top}">${collab_border_top}</i>
                    <collab-ds-input-select-color-100554
                        prop="border-top"
                        valueInput="0px"
                        .arrayInputSelect=${this.tpMeasures} 
                        .arraySelect=${this.tpBorder} 
                        valueSelect="none" 
                        group="border"
                        @onchange="${(e: KeyboardEvent) => this.handleChangeBorder(e)}"
                    ></collab-ds-input-select-color-100554>
                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.left}" >${collab_border_left}</i>
                    <collab-ds-input-select-color-100554
                        prop="border-left"
                        valueInput="0px"
                        .arrayInputSelect=${this.tpMeasures} 
                        .arraySelect=${this.tpBorder} 
                        valueSelect="none" 
                        group="border" 
                        @onchange="${(e: KeyboardEvent) => this.handleChangeBorder(e)}"
                    ></collab-ds-input-select-color-100554>   
                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.bottom}">${collab_border_bottom}</i>
                    <collab-ds-input-select-color-100554
                        prop="border-bottom"
                        valueInput="0px"
                        .arrayInputSelect=${this.tpMeasures} 
                        .arraySelect=${this.tpBorder} 
                        valueSelect="none" group="border" 
                        @onchange="${(e: KeyboardEvent) => this.handleChangeBorder(e)}"
                    ></collab-ds-input-select-color-100554>
                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.right}">${collab_border_right}</i>
                    <collab-ds-input-select-color-100554
                        prop="border-right"
                        valueInput="0px"
                        .arrayInputSelect=${this.tpMeasures} 
                        .arraySelect=${this.tpBorder} 
                        valueSelect="none"
                        group="border" 
                        @onchange="${(e: KeyboardEvent) => this.handleChangeBorder(e)}"
                    ></collab-ds-input-select-color-100554>

                </div>
            </div>

        `
    }

    renderBorderRadius() {
        return html`
            <h5 class="helper-group-title" >${this.msg.borderRadius}</h5>
                <div class="helper-group-lock">
                <input id="helper-border-radius-lock" type="checkbox" @change=${this.handleChangeLockBorderRadius}>
                <label for="helper-border-radius-lock"> ${this.msg.all}</label>
                <i>${this.borderRadiusLocked ? collab_lock : collab_lock_open}</i>
            </div>

            <div class="group">

                <div class="group-edit">
                    <i data-tooltip="${this.msg.topLeft}">${collab_border_topLeft}</i>
                    <collab-ds-input-range-100554
                        prop="border-top-left-radius"
                        value="0px"
                        .arraySelect=${this.tpMeasures}  
                        group="radius"
                        @onchange="${(e: KeyboardEvent) => this.handleChangeBorderRadius(e)}"
                    ></collab-ds-input-range-100554>
                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.topRight}">${collab_border_topRight}</i>
                    <collab-ds-input-range-100554
                        prop="border-top-right-radius"
                        value="0px"
                        .arraySelect=${this.tpMeasures} 
                        group="radius"
                        @onchange="${(e: KeyboardEvent) => this.handleChangeBorderRadius(e)}"
                    ></collab-ds-input-range-100554>    

                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.bottomLeft}">${collab_border_bottomLeft}</i>
                    <collab-ds-input-range-100554
                        prop="border-bottom-left-radius"
                        value="0px"
                        .arraySelect=${this.tpMeasures} 
                        group="radius"
                        @onchange="${(e: KeyboardEvent) => this.handleChangeBorderRadius(e)}"
                    ></collab-ds-input-range-100554> 

                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.bottomRight}">${collab_border_bottomRight}</i>
                    <collab-ds-input-range-100554
                        prop="border-bottom-right-radius"
                        value="0px"
                        .arraySelect=${this.tpMeasures} 
                        group="radius"
                        @onchange="${(e: KeyboardEvent) => this.handleChangeBorderRadius(e)}"
                    ></collab-ds-input-range-100554> 
                </div>
            </div>

        `
    }

    renderBorderGallery() {
        return html`
            <div class="gallery">
                ${repeat(this.gallery, ((key: string) => key) as any,
            ((css: string, index: number) => {
                return html`<span style="${css}" .gallery=${css}> Item</span>`;
            }) as any
        )}
            </div>
        
        `
    }

    private timeonChangeBorder = -1;
    private handleChangeBorder(e: KeyboardEvent) {
        clearTimeout(this.timeonChangeBorder);
        this.timeonChangeBorder = setTimeout(() => {
            const el = (e.detail as any).target as HTMLInputElement;
            if (!this.borderLocked) return;
            this.borderInputs?.forEach((inp) => {
                if (inp === el) return;
                inp.value = el.value;
            });
        }, 100);
    }

    private timeonChangeBorderRadius = -1;
    private handleChangeBorderRadius(e: KeyboardEvent) {
        clearTimeout(this.timeonChangeBorderRadius);
        this.timeonChangeBorderRadius = setTimeout(() => {
            const el = (e.detail as any).target as HTMLInputElement;
            if (!this.borderRadiusLocked) return;
            this.borderRadiusInputs?.forEach((inp) => {
                if (inp === el) return;
                inp.value = el.value;
            });
        }, 100);
    }

    private handleChangeLockBorderRadius() {

        if (!this.inputLockRadius) return;
        console.info(this.inputLockRadius.checked)
        this.borderRadiusLocked = this.inputLockRadius.checked;

    }

    private handleChangeLockBorder() {

        if (!this.inputLock) return;
        this.borderLocked = this.inputLock.checked;
    }



    private gallery = [
        'border-left: 1px solid #000000; border-right: 1px solid #000000; border-top: 1px solid #000000;',
        'border-left: 1px solid #000000; border-right: 1px solid #000000; border-bottom: 1px solid #000000;',
        'border: 5px dashed #32557f;',
        'border: 4px solid transparent; background: linear-gradient(white, white) padding-box, repeating-linear-gradient(-45deg, #f69ec4 0, #f69ec4 12.5%, transparent 0, transparent 25%, #7eb4e2 0, #7eb4e2 37.5%, transparent 0, transparent 50%) 0 / 15px 15px;',
        'border: 10px solid transparent; border-width: 10px 0; background-color: #7eb4e2; background-color: hsla(0, 0%, 0%, 0); background-image: linear-gradient(#7eb4e2, #32557f), linear-gradient(to bottom right, transparent 50.5%, #7eb4e2 50.5%), linear-gradient(to bottom left, transparent 50.5%, #7eb4e2 50.5%), linear-gradient(to top right, transparent 50.5%, #32557f 50.5%), linear-gradient(to top left, transparent 50.5%, #32557f 50.5%); background-repeat: repeat, repeat-x, repeat-x, repeat-x, repeat-x; background-position: 0 0, 10px 0, 10px 0, 10px 100%, 10px 100%; background-size: auto auto, 20px 20px, 20px 20px, 20px 20px, 20px 20px; background-clip: padding-box, border-box, border-box, border-box, border-box; background-origin: padding-box, border-box, border-box, border-box, border-box;',
        'border: 4px solid transparent; background: linear-gradient(#000, #000) padding-box, radial-gradient(farthest-corner at 50% 50%, #00C9A7, #845EC2) border-box;',
        'border: 4px solid transparent; background: linear-gradient(#000, #000) padding-box, linear-gradient(to bottom left, #f83600, #f9d423) border-box;',
        'border: 4px solid transparent; background: linear-gradient(#000, #000) padding-box, linear-gradient(#f9f047, #0fd850) border-box;',
        'border-left: 4px solid #e85f99; border-right: 4px solid #f18867; border-top: 4px solid #65587f; border-bottom: 4px solid #50bda1;',
        'border: 5px dashed #FF5722; background: linear-gradient(to top, green, 5px, transparent 5px), linear-gradient(to right, green, 5px, transparent 5px), linear-gradient(to bottom, green, 5px, transparent 5px), linear-gradient(to left, green, 5px, transparent 5px); background-origin: border-box;',
        'box-shadow: 0 0 0 4px #009688;border: 4px solid #009688;outline: dashed 4px white;',
        'border: 8px groove;',
        'border-top: 2px solid #3C514D;border-bottom: 3px dashed #3C514D;border-left: 5px double #212410;border-right: 3px dotted rgb(223,112,0);',
        'border: 3px double #3498db;',
        'border: 6px outset #2ecc71;',
        'border: 2px solid #e74c3c;',
        'border-left: 8px ridge #8e44ad; border-right: 8px groove #16a085;',
        'border: 5px dotted #2980b9;',
        'border: 4px dashed rgba(255, 165, 0, 0.8);',
        'border: 10px solid transparent; background: linear-gradient(white, white) padding-box, linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%) border-box;',
        'border: 3px solid #f39c12; border-radius: 10px;',
        'border: 8px solid #34495e; border-top: 12px double #3498db;',
        'border-left: 1px solid #2c3e50; border-right: 3px solid #1abc9c;',
        'border: 6px inset #7f8c8d; border-radius: 15px;',
        'border: 5px solid transparent; background: linear-gradient(white, white) padding-box, linear-gradient(60deg, #abecd6 0%, #fbed96 100%) border-box;',
        'border: 4px solid #c0392b; box-shadow: 0 0 5px 2px rgba(192, 57, 43, 0.5);',
        'border-top: 3px dashed #8e44ad; border-bottom: 5px solid #f1c40f;',
        'border: 7px groove #2980b9; border-radius: 20px;',
        'border: 6px solid #f39c12; background: repeating-linear-gradient(45deg, #f39c12, #f39c12 10px, #f1c40f 10px, #f1c40f 20px);',
        'border: 4px solid transparent; background: radial-gradient(circle, #ff9a9e, #fad0c4) border-box;',
        'border: 4px solid #16a085; outline: 2px dashed #e74c3c;',
        'border: 5px double #8e44ad; border-width: 10px 5px 15px 5px;',
        'border: 3px solid #2c3e50; border-bottom: 6px groove #16a085;',


    ];

}