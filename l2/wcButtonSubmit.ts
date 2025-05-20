/// <mls shortName="wcButtonSubmit" project="100554" enhancement="_100554_enhancementLit" groupName="FormsSubmitSubmit" />

import { html,  ifDefined, LitElement } from 'lit';
import { customElement, property, } from 'lit/decorators.js';
import { propertyDataSource } from './_100554_collabDecorators';

@customElement('wc-button-submit-100554')
export class WcButtonSubmit extends LitElement {

    @propertyDataSource({ type: String, attribute: 'clicked-value' }) clickedValue: string | undefined;
    @propertyDataSource({ type: String, attribute: 'clicked-action' }) clickedAction: string | undefined;

    @property({ type: String }) name: string | undefined;
    @property({ type: String }) title: string = '';
    @property({ type: String }) icon: string | undefined;
    @property({ type: String }) text: string | undefined;
    @property({ type: Boolean }) disabled: boolean = false; // Whether the field is ready for input or disabled
    @property({ type: String }) form: string | undefined; // The form element that the button is associated with (it is the owning form).   

    render() {
        return html`
            <button 
                name=${ifDefined(this.name)} 
                title=${ifDefined(this.title)} 
                ?disabled=${this.disabled} 
                form=${ifDefined(this.form)}
                @click=${this.handleClick}
                >
                ${this.text || ''}
            </button>
        `;
    }

    handleClick() {
        this.clickedAction = this.clickedValue;
    }

}