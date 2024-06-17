/// <mls shortName="collabSelectOneWithDescription" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { propertyDataSource, propertyCompositeDataSource } from './_100554_icaLitElement';
import { IcaLitElement } from './_100554_icaLitElement';

@customElement('collab-select-one-with-description-100554')
export class CollabSelectOneWithDescription100554 extends IcaLitElement {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    @propertyDataSource({ type: String }) hint: string | undefined;
    @property({ type: Boolean }) required: boolean = false;
    @property({ type: Boolean }) disabled: boolean = false;
    @propertyCompositeDataSource({ type: String }) label: string | undefined;
    @propertyDataSource() options: IOptionItem[] | undefined;
    @propertyDataSource() selectedvalue: string | undefined;

    render() {
        return html`
        <label>${this.label}<label>
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
                ${this.options.map((opt: IOptionItem) => {
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

export interface IOptionItem {
    key: string,
    value: string,
    description: string
}