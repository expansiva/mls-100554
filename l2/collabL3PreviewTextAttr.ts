/// <mls shortName="collabL3PreviewTextAttr" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';
import { propertyDataSource } from './_100554_collabDecorators';

@customElement('collab-l3-preview-text-attr-100554')
export class CollabL3PreviewText extends StateLitElement {

    @propertyDataSource({ type: String }) value: string | undefined;

    render() {
        this.onclick = this.handleClick.bind(this);
        this.onblur = this.handleChange.bind(this);
        this.setAttribute('contenteditable', 'true');
        return html`${this.value}`;
    }

    handleChange(event: Event) {
        this.value = this.innerText;
        event.stopPropagation();
        event.preventDefault();
    }

    handleClick(event: Event) {
        event.stopPropagation();
        event.preventDefault();
    }

}