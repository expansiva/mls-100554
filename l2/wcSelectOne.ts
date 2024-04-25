/// <mls shortName="wcSelectOne" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IcaFormsInputSelectOne } from './_100554_icaFormsInputSelectOne';
import { propertyDataSource, OptionItem } from './_100554_icaLitElement';

@customElement('wc-select-one-100554')
export class WcSelectOne extends IcaFormsInputSelectOne {

        static styles = css`
    :host {
        display: block;
    }

    .select_control {
        display: block;
        width:100%;
        padding: 0.375rem 0.75rem;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: #212529;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid #ced4da;
        border-radius: 0.25rem;
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
        outline:none;
    }
    `

    @property({ type: String }) hint: string | undefined; 
    @property({ type: String }) label: string | undefined; 
    @property({ type: Boolean }) required: boolean = false;
    @property({ type: Boolean }) disabled: boolean = false; 

    @propertyDataSource() options: OptionItem[] | undefined;

    @propertyDataSource() selectedvalue: string | undefined;

    @propertyDataSource() username: string | undefined;

    render() {
        return html`
        <label>O usuario ${this.username} é ${this.options && this.selectedvalue && this.options.find((item)=> item.key === this.selectedvalue)?.value}<label>
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

