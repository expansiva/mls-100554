/// <mls shortName="wcSelectOne" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IcaFormsInputSelectOneBase } from './_100554_icaFormsInputSelectOneBase';
import { propertyDataSource, propertyCompositeDataSource, OptionItem } from './_100554_collabDecorators';

@customElement('wc-select-one-100554')
export class WcSelectOne extends IcaFormsInputSelectOneBase {
    
    @propertyDataSource({ type: String }) hint: string | undefined;
    @property({ type: Boolean }) required: boolean = false;
    @property({ type: Boolean }) disabled: boolean = false;
    @propertyCompositeDataSource({ type: String }) label: string | undefined;
    @propertyDataSource() options: OptionItem[] | undefined;
    @propertyDataSource() selectedvalue: string | undefined;


    render() {
        return html`
        <label>${this.label}</label>
        <br>
        <select
            class="select_control" 
            ?disabled=${this.disabled} 
            ?required=${this.required}
            .value=${this.selectedvalue} 
            @change=${this.handleChange}
        >
            ${this.renderOpt()}
        </select>
        <small> ${this.hint || ''}</small>
    `;
    }

    renderOpt() {

        if (this.options) {
            return html`
                ${this.options.map((opt: OptionItem) => {
                return html`<option value=${opt.key}>${opt.value}</option>`
            })}
        `;
        }
    }

    handleChange(event: Event) {
        const selectElement = event.target as HTMLSelectElement;
        this.selectedvalue = selectElement.value;
    }
}

