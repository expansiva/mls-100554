/// <mls shortName="widgetDefsObjectListEdit" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement';
import { collab_floppy_disk, collab_xmark, collab_trash, collab_plus } from '/_100554_/l2/collabIcons';

@customElement('widget-defs-object-list-edit-100554')
export class WidgetDefsObjectListEdit100554 extends StateLitElement {
    @state() listItem: mls.l4.DefsWidget[] = [];
    @property() private isEditing = false;
    @state() private tempListItem: mls.l4.DefsWidget[] = [];

    render() {
        return html`
      <div class="widget-edit">
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
          ${this.listItem.map((item) => html`
            <li>
              <strong>${item.tag}</strong> - ${item.purpose ?? '—'}
              ${item.used ? '✔️' : ''}
            </li>
          `)}
        </ul>
      </div>
    `;
    }

    private renderEditMode() {
        return html`
      <div class="mode-edit">
        ${this.tempListItem.map((item, index) => html`
          <div class="widget-block">
            <input
              type="text"
              placeholder="Tag"
              .value=${item.tag}
              @input=${(e: Event) => this.updateField(index, 'tag', (e.target as HTMLInputElement).value)}
            />
            <input
              type="text"
              placeholder="Purpose"
              .value=${item.purpose ?? ''}
              @input=${(e: Event) => this.updateField(index, 'purpose', (e.target as HTMLInputElement).value)}
            />
            <input
              type="text"
              placeholder="Bindings (comma separated)"
              .value=${item.bindings?.join(',') ?? ''}
              @input=${(e: Event) => this.updateField(index, 'bindings', (e.target as HTMLInputElement).value.split(',').map(s => s.trim()))}
            />
            <label>
              <input
                type="checkbox"
                .checked=${item.used ?? false}
                @change=${(e: Event) => this.updateField(index, 'used', (e.target as HTMLInputElement).checked)}
              />
              Used
            </label>
            <button @click=${() => this.removeItem(index)}>${collab_trash} Remove</button>
            <hr/>
          </div>
        `)}

        <div class="actions add">
            <button @click=${this.addItem}>${collab_plus} Add Widget</button>
        </div>
        

        <div class="actions">
          <button @click=${this.saveEdit}>${collab_floppy_disk} Save</button>
          <button @click=${this.cancelEdit}>${collab_xmark} Cancel</button>
        </div>
      </div>
    `;
    }

    private enterEditMode() {
        this.tempListItem = JSON.parse(JSON.stringify(this.listItem)); // deep clone
        this.isEditing = true;
    }

    private updateField(index: number, field: keyof mls.l4.DefsWidget, value: any) {
        this.tempListItem[index] = {
            ...this.tempListItem[index],
            [field]: value,
        };
        this.requestUpdate();
    }

    private removeItem(index: number) {
        this.tempListItem.splice(index, 1);
        this.tempListItem = [...this.tempListItem];
    }

    private addItem() {
        this.tempListItem = [...this.tempListItem, { tag: '' }];
    }

    private saveEdit() {
        this.listItem = this.tempListItem;
        this.isEditing = false;
        this.dispatchEvent(new CustomEvent('onSaveEditClick', {
            detail: { widgets: this.listItem },
            bubbles: true,
            composed: true,
        }));
    }

    private cancelEdit() {
        this.isEditing = false;
    }
}



