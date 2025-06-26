/// <mls shortName="widgetDefsListEdit" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';

@customElement('widget-defs-list-edit-100554')
export class WidgetDefsListEdit100554 extends StateLitElement {

    @state() listItem: string[] = [];
    @state() private isEditing = false;

    render() {
        if (!this.listItem) return html``;

        return html`
        <div class="requirement">
            ${this.isEditing ? this.renderEditMode() : this.renderReadMode()}
        </div>`;
    }

    private renderReadMode() {
        return html`
            <div>
                <ul>
                    ${this.listItem.map((item) => {
                        return html`<li>${item}</li>`
                    })}
                </ul>

            </div>
        `
    }

    private renderEditMode() {

    }
}
