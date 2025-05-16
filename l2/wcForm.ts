/// <mls shortName="wcForm" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IcaFormsContentFormBase } from './_100554_icaFormsContentFormBase';

@customElement('wc-form-100554')
export class WcForm100554 extends IcaFormsContentFormBase {
    validateonchange: boolean = true;

    @property({ type: String }) action: string | undefined;

    @property({ type: String }) name: string | undefined;

    @property({ type: String }) method: string | undefined;

    @property({ type: String }) novalidate: string | undefined;

    @property({ type: Boolean }) autocomplete: boolean = false;

    @property({ type: Boolean }) disabled: boolean = false;

    @property({ type: Boolean }) validateOnChange: boolean = false;

    @property({ type: Boolean }) autosave: boolean = false;

    @property({ type: String }) enctype: string | undefined;

    @property({ type: String }) target: string | undefined;


    render() {
        return html`<form><slot></slot></form>`;
    }



}