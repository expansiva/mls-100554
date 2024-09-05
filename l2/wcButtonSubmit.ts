/// <mls shortName="wcButtonSubmit" project="100554" enhancement="_100554_enhancementLit" groupName="FormsSubmitSubmit" />

import { html, css, ifDefined } from 'lit';
import { customElement, property,  } from 'lit/decorators.js';
import { IcaFormsSubmitSubmitBase } from './_100554_icaFormsSubmitSubmitBase';

@customElement('wc-button-submit-100554')
export class WcButtonSubmit extends IcaFormsSubmitSubmitBase {

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
                form=${ifDefined(this.form)}>
                ${this.text || ''}
            </button>
        `;
    }


}