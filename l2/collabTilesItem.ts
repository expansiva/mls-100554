/// <mls shortName="collabTilesItem" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement, unsafeHTML } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';


@customElement('collab-tiles-item-100554')
export class CollabTilesItem extends LitElement {

    @property({ type: String, reflect: true }) position = '';
    @property({ type: String, reflect: true }) plugin = '';

    //---------COMPONENT-------------
    createRenderRoot() {
        return this;
    }

    render() {
        //let [ row, col ] = this.position.split(' ');
        //this.style.gridColumn =  (col ? col : '1')
        //this.style.gridRow =  (row ? row : '1');

        this.style.gridArea = this.position;
        return html`${unsafeHTML(this.plugin)}`;
    }



}