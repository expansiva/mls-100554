/// <mls shortName="pluginStyleSpacing" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, svg, repeat, TemplateResult } from 'lit';
import { customElement, property, query, queryAll } from 'lit/decorators.js';
import { CollabLitElement, getMessageKey } from './_100554_collabLitElement';
import './_100554_collabDsInputSelectColor';
import './_100554_collabDsInputRange';

import {
    collab_lock,
    collab_lock_open,
    collab_margin_bottom,
    collab_margin_top,
    collab_margin_left,
    collab_margin_right,
    collab_padding_bottom,
    collab_padding_top,
    collab_padding_left,
    collab_padding_right,


} from './_100554_collabIcons'

/// **collab_i18n_start**
const message_pt = {
    all: 'Group',
    margin: 'Margin',
    padding: 'Padding',
    top: 'Superior',
    left: 'Esquerda',
    bottom: 'Inferior',
    right: 'Direita',
    description: 'Este plugin permite ajustar margens e preenchimentos (margin e padding) de maneira simples e intuitiva. Ideal para desenvolvedores que buscam precisão no espaçamento dos elementos, ele facilita a definição de distâncias internas e externas para garantir um layout consistente e bem estruturado.'

}

const message_en = {
    all: 'Group',
    margin: 'Margin',
    padding: 'Padding',
    top: 'Top',
    left: 'Left',
    bottom: 'Bottom',
    right: 'Right',
    description: 'This plugin enables easy and intuitive adjustments of margins and paddings. Ideal for developers seeking precise element spacing, it streamlines the setup of inner and outer distances to ensure a consistent and well-structured layout.'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**


export const tags = ['margin*', 'padding*'];
export function getDescription() {
    const lang = getMessageKey(messages);
    return messages[lang].description;
}


@customElement('plugin-style-spacing-100554')
export class PluginStyleSpacing extends CollabLitElement {

    private msg: MessageType = messages['en'];

    @property() showFull: string = 'true';

    @property() marginLocked: boolean = false;
    @property() paddingLocked: boolean = false;

    @query('#helper-border-radius-lock') inputLockP: HTMLInputElement | undefined;
    @query('#helper-border-lock') inputLockM: HTMLInputElement | undefined;
    @queryAll('collab-ds-input-range-100554[group="margin"]') marginInputs: HTMLInputElement[] | undefined;
    @queryAll('collab-ds-input-range-100554[group="padding"]') paddingInputs: HTMLInputElement[] | undefined;

    private tpMeasures = ['px', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax', 'ex', 'ch', 'auto'];


    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`

        ${this.showFull === 'true' ?
                html`
                ${this.renderGallery()}
                ${this.renderMargin()}
                ${this.renderPadding()}
            ` :
                html`
                ${this.renderGallery()}
            `
            }
        `;
    }

    renderMargin() {
        return html`
            <h5 class="helper-group-title" >${this.msg.margin}</h5>
            <div class="helper-group-lock">
                <input id="helper-border-lock" type="checkbox" @change=${this.handleChangeLockMargin}>
                <label for="helper-border-lock"> ${this.msg.all}</label>
                <i>${this.marginLocked ? collab_lock : collab_lock_open}</i>
            </div>

            <div class="group">

                <div class="group-edit">
                    <i data-tooltip="${this.msg.top}">${collab_margin_top}</i>
                    <collab-ds-input-range-100554
                        prop="margin-top"
                        value="0px"
                        .arraySelect=${this.tpMeasures} 
                        group="margin"
                        @onchange="${(e: KeyboardEvent) => this.handleChangeMargin(e)}"
                    ></collab-ds-input-range-100554>
                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.left}" >${collab_margin_left}</i>
                    <collab-ds-input-range-100554
                        prop="margin-left"
                        value="0px"
                        .arraySelect=${this.tpMeasures} 
                        group="margin" 
                        @onchange="${(e: KeyboardEvent) => this.handleChangeMargin(e)}"
                    ></collab-ds-input-range-100554>   
                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.bottom}">${collab_margin_bottom}</i>
                    <collab-ds-input-range-100554
                        prop="margin-bottom"
                        value="0px"
                        .arraySelect=${this.tpMeasures} 
                        group="margin" 
                        @onchange="${(e: KeyboardEvent) => this.handleChangeMargin(e)}"
                    ></collab-ds-input-range-100554>
                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.right}">${collab_margin_right}</i>
                    <collab-ds-input-range-100554
                        prop="margin-right"
                        value="0px"
                        .arraySelect=${this.tpMeasures} 
                        group="margin" 
                        @onchange="${(e: KeyboardEvent) => this.handleChangeMargin(e)}"
                    ></collab-ds-input-range-100554>

                </div>
            </div>

        `
    }

    renderPadding() {
        return html`
            <h5 class="helper-group-title" >${this.msg.padding}</h5>
                <div class="helper-group-lock">
                <input id="helper-border-radius-lock" type="checkbox" @change=${this.handleChangeLockPadding}>
                <label for="helper-border-radius-lock"> ${this.msg.all}</label>
                <i>${this.paddingLocked ? collab_lock : collab_lock_open}</i>
            </div>

            <div class="group">

                <div class="group-edit">
                    <i data-tooltip="${this.msg.top}">${collab_padding_top}</i>
                    <collab-ds-input-range-100554
                        prop="padding-top"
                        value="0px"
                        .arraySelect=${this.tpMeasures}  
                        group="padding"
                        @onchange="${(e: KeyboardEvent) => this.handleChangePadding(e)}"
                    ></collab-ds-input-range-100554>
                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.left}">${collab_padding_left}</i>
                    <collab-ds-input-range-100554
                        prop="padding-left"
                        value="0px"
                        .arraySelect=${this.tpMeasures} 
                        group="padding"
                        @onchange="${(e: KeyboardEvent) => this.handleChangePadding(e)}"
                    ></collab-ds-input-range-100554>    

                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.bottom}">${collab_padding_bottom}</i>
                    <collab-ds-input-range-100554
                        prop="padding-bottom"
                        value="0px"
                        .arraySelect=${this.tpMeasures} 
                        group="padding"
                        @onchange="${(e: KeyboardEvent) => this.handleChangePadding(e)}"
                    ></collab-ds-input-range-100554> 

                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.right}">${collab_padding_right}</i>
                    <collab-ds-input-range-100554
                        prop="padding-right"
                        value="0px"
                        .arraySelect=${this.tpMeasures} 
                        group="padding"
                        @onchange="${(e: KeyboardEvent) => this.handleChangePadding(e)}"
                    ></collab-ds-input-range-100554> 
                </div>
            </div>

        `
    }

    renderGallery() {
        return html`
            <div class="gallery">
                ${repeat(this.gallery, ((key: string) => key) as any,
            ((css: string, index: number) => {
                return html`
                <div class="box">
                    <div style="${css}" .gallery=${css}></div>
                </div>`;
            }) as any
        )}
            </div>
        
        `
    }

    private timeonChangeMargin = -1;
    private handleChangeMargin(e: KeyboardEvent) {
        clearTimeout(this.timeonChangeMargin);
        this.timeonChangeMargin = setTimeout(() => {
            const el = (e.detail as any).target as HTMLInputElement;
            if (!this.marginLocked) return;
            this.marginInputs?.forEach((inp) => {
                if (inp === el) return;
                inp.value = el.value;
            });
        }, 100);
    }

    private timeonChangePadding = -1;
    private handleChangePadding(e: KeyboardEvent) {
        clearTimeout(this.timeonChangePadding);
        this.timeonChangePadding = setTimeout(() => {
            const el = (e.detail as any).target as HTMLInputElement;
            if (!this.paddingInputs) return;
            this.paddingInputs?.forEach((inp) => {
                if (inp === el) return;
                inp.value = el.value;
            });
        }, 100);
    }

    private handleChangeLockPadding() {

        if (!this.inputLockP) return;
        console.info(this.inputLockP.checked)
        this.paddingLocked = this.inputLockP.checked;

    }

    private handleChangeLockMargin() {

        if (!this.inputLockM) return;
        this.marginLocked = this.inputLockM.checked;
    }



    private gallery = [
        'margin: 10px',
        'margin: 10px 0',
        'margin: 0 10px',
        'margin-left:10px',
        'margin-right:10px',
        'margin-top:10px',
        'margin-bottom:10px',

    ];

}