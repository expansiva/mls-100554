/// <mls shortName="widgetDefsPluginListEdit" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';
import { collab_floppy_disk, collab_xmark, collab_trash, collab_plus } from './_100554_collabIcons';

@customElement('widget-defs-plugin-list-edit-100554')
export class WidgetDefsPluginListEdit extends StateLitElement {

    @state() private list: mls.l4.DefsPlugin[] = [];
    @property() private isEditing = false;
    @state() private tempList: mls.l4.DefsPlugin[] = [];

    render() {
        return html`
            <div class="plugin-list">
                ${this.isEditing ? this.renderEditMode() : this.renderReadMode()}
            </div>
        `;
    }

    private renderReadMode() {
        return html`
            <div class="mode-read">
                <div class="check-actions">
                    <span @click=${() => this.enterEditMode()}>✎ Edit</span>
                </div>
                <ul>
                    ${this.list.map(plugin => html`
                        <li>
                            <strong>${plugin.name}</strong>
                            ${plugin.usedFor ? html`<em> - ${plugin.usedFor}</em>` : ''}
                        </li>
                    `)}
                </ul>
            </div>
        `;
    }
    private renderEditMode() {
        return html`
        <div class="mode-edit">
            ${this.tempList.map((plugin, index) => html`
                <div class="plugin-entry">
                    <input
                        type="text"
                        placeholder="Name"
                        .value=${plugin.name}
                        @input=${(e: Event) => this.updateField(index, 'name', (e.target as HTMLInputElement).value)}
                    />
                    <input
                        type="text"
                        placeholder="Used For"
                        .value=${plugin.usedFor || ''}
                        @input=${(e: Event) => this.updateField(index, 'usedFor', (e.target as HTMLInputElement).value)}
                    />
                    <button class="remove-btn" @click=${() => this.removePlugin(index)} title="Remover">
                        ${collab_trash}
                    </button>
                </div>
            `)}

            <div class="actions add">
                <button @click=${this.addPlugin}>${collab_plus} Add Plugin</button>
            </div>

            <div class="actions">
                <button @click=${this.saveEdit}>${collab_floppy_disk} Save</button>
                <button @click=${this.cancelEdit}>${collab_xmark} Cancel</button>
            </div>
        </div>
    `;
    }

    private addPlugin() {
        this.tempList = [...this.tempList, { name: '', usedFor: '' }];
    }

    private removePlugin(index: number) {
        this.tempList = this.tempList.filter((_, i) => i !== index);
    }

    private updateField(index: number, field: keyof mls.l4.DefsPlugin, value: string) {
        const updated = [...this.tempList];
        updated[index] = { ...updated[index], [field]: value };
        this.tempList = updated;
    }

    private enterEditMode() {
        this.tempList = this.list.map(p => ({ ...p }));
        this.isEditing = true;
    }

    private saveEdit() {
        this.list = this.tempList.map(p => ({ ...p }));
        this.isEditing = false;

        this.dispatchEvent(new CustomEvent('onSaveEditClick', {
            detail: { plugins: this.list },
            bubbles: true,
            composed: true
        }));

        this.requestUpdate();
    }

    private cancelEdit() {
        this.isEditing = false;
    }
}
