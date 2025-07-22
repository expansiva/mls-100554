/// <mls shortName="widgetDefsListEdit" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';
import { collab_file_pen, collab_message, collab_floppy_disk, collab_xmark, collab_trash } from './_100554_collabIcons';

@customElement('widget-defs-list-edit-100554')
export class WidgetDefsListEdit100554 extends StateLitElement {

    @state() listItem: string[] = ['item1', 'item2', 'item3'];
    @property() private isEditing = false;
    @state() private tempListItem: string[] = []

    render() {
        if (!this.listItem) return html``;

        return html`
        <div class="requirement">
            ${this.isEditing ? this.renderEditMode() : this.renderReadMode()}
        </div>`;
    }

    private renderReadMode() {
        return html`
            <div class="mode-read">
                <div class="check-actions">
                    <span @click=${() => this.enterEditMode()}>✎ Edit</span>
                </div>
                <ul>
                    ${this.listItem.map((item) => {
                        return html`<li>${item}</li>`
                    })}
                </ul>

            </div>
        `
    }

    private renderEditMode() {

        return html`
            <div class="mode-edit">
                <textarea
                    .value=${this.tempListItem.join('\n')}
                    rows=${this.tempListItem.length}
                    @input=${(e: Event) => this.tempListItem = (e.target as HTMLInputElement).value.split('\n')}
                ></textarea>
                <div class="actions">
                    <button @click=${() => this.saveEdit()}>${collab_floppy_disk} Save</button>
                    <button @click=${() => this.cancelEdit()}>${collab_xmark} Cancel</button>

                </div>
            </div>
        `
    }

    private enterEditMode() {
        if (!this.listItem) return;
        this.tempListItem = [...this.listItem];
        this.isEditing = true;
    }

    private saveEdit() {
        if (!this.listItem) return;
        this.listItem = this.tempListItem;
        this.isEditing = false;
        this.dispatchEvent(new CustomEvent('onSaveEditClick', {
            detail: { item: this.listItem },
            bubbles: true,
            composed: true,
        }));
        this.requestUpdate();
    }

    private cancelEdit() {
        this.isEditing = false;
    }
}
