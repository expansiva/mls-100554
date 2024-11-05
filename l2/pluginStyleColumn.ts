/// <mls shortName="pluginStyleColumn" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, svg, repeat, TemplateResult } from 'lit';
import { customElement, property, query, queryAll } from 'lit/decorators.js';
import { CollabLitElement, getMessageKey } from './_100554_collabLitElement';
import './_100554_collabDsInputSelectColor';
import './_100554_collabDsInputRange';

/// **collab_i18n_start**
const message_pt = {
    columnsCount: 'Contagem de coluna',
    columnsWidth: 'Largura das colunas',
    columnsGap: 'Lacuna de colunas',
    columnsRule: 'Regra de Coluna',
    columnSpan: 'Espanço da coluna',
    breakInside: 'Quebre por dentro',
    description: 'Este plugin permite criar e ajustar colunas de texto de forma prática e eficiente. Com ele, é possível definir o número de colunas, o espaçamento entre elas e outros detalhes de formatação, proporcionando um layout organizado e facilitando a leitura.'
}

const message_en = {
    columnsCount: 'Columns Count',
    columnsWidth: 'Columns Width',
    columnsGap: 'Columns Gap',
    columnsRule: 'Columns Rule',
    columnSpan: 'Column Span',
    breakInside: 'Break Inside',
    description: 'This plugin allows for easy and efficient creation and adjustment of text columns. It lets you set the number of columns, spacing between them, and other formatting details, providing an organized layout and enhancing readability.'

}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**


export const tags = ['column*'];

export function getDescription() {
    const lang = getMessageKey(messages);
    return messages[lang].description;
}

@customElement('plugin-style-column-100554')
export class PluginStyleColumn extends CollabLitElement {

    @property() showFull: string = 'true';

    private msg: MessageType = messages['en'];

    private tpMeasures = ['px', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax', 'ex', 'ch', 'auto'];

    private tpBorder = ['none', 'solid', 'dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset', 'hidden', 'inherit', 'initial', 'unset'];

    private arrayGallery = [
        '',
        'column-count: 2;',
        'column-count: 2; column-gap: 20px; column-rule-width: 1px; column-rule-style: dashed;',
        'column-count: 3;',
        'column-count: 2; column-rule-width: 1px; column-rule-style: solid;'

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
                    <span>${this.msg.columnsCount}</span>
                    <div class="group-edit">
                        <collab-ds-input-range-100554 prop="column-count" value="0px" useSelect="false" ></collab-ds-input-range-100554>
                    </div>

                    <span>${this.msg.columnsWidth}</span>
                    <div class="group-edit">
                        <collab-ds-input-range-100554 prop="column-width" value="0px" .arraySelect=${this.tpMeasures}  ></collab-ds-input-range-100554>
                    </div>

                    <span>${this.msg.columnsGap}</span>
                    <div class="group-edit">
                        <collab-ds-input-range-100554 prop="column-gap" value="0px" .arraySelect=${this.tpMeasures}  ></collab-ds-input-range-100554>
                    </div>

                    <span>${this.msg.columnsRule}</span>
                    <div class="group-edit">
                        <collab-ds-input-select-color-100554 prop="column-rule" valueInput="0px" .arrayInputSelect=${this.tpMeasures} .arraySelect=${this.tpBorder} valueSelect="none" group="border" ></collab-ds-input-select-color-100554>
                    </div>

                    <span>${this.msg.columnSpan}</span>
                    <div class="group-edit">
                        <select class="group-select"  prop="column-span">
                            <option value=""></option>
                            <option value="row">Row</option>
                            <option value="row-reverse">Row Reverse</option>
                            <option value="column">Column</option>
                            <option value="column-reverse">Column Reverse</option>
                        </select>   
                    </div>
                    
                    <span>${this.msg.breakInside}</span>
                    <div class="group-edit">
                        <select class="group-select"  prop="break-inside">
                            <option value=""></option>
                            <option value="none">none</option>
                            <option value="auto">auto</option>
                            <option value="avoid">avoid</option>
                            <option value="avoid-page">avoid-page</option>
                            <option value="avoid-column">avoid-column</option>
                            <option value="avoid-region">avoid-region</option>
                            <option value="inherit">inherit</option>
                            <option value="initial">initial</option>
                            <option value="unset">unset</option>
                        </select>   
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
                        <h5 class="gallery-item" style="${css}" .gallery=${css}>Lorem ipsum dolor sit amet, consectetur adipisicing elit,sed do eiusmod tempor incididunt ut labore et dolore.</h5>
                        `;
            }) as any
        )}
            </div>
        
        `
    }

}
