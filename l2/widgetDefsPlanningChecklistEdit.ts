/// <mls shortName="widgetDefsPlanningChecklistEdit" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement';
import { collab_file_pen, collab_message, collab_floppy_disk, collab_xmark, collab_trash } from '/_100554_/l2/collabIcons';

@customElement('widget-defs-planning-checklist-edit-100554')
export class WidgetDefsPlanningChecklistEdit100554 extends StateLitElement {

    @property({ type: String }) checkNumber: string = '';
    @property({ type: String }) index: string = '';


    @state() planningItem: mls.l4.Planning | undefined = {
        description: "Exibir detalhes do tipo de projeto selecionado.",
        done: true,
        comment: "Implementado na coluna direita do cenário 'select'."
    }

    @property() private isEditing = false;
    @state() private tempDescription = '';
    @state() private tempComment = '';
    @state() private tempDone = false;

    render() {
        if (!this.planningItem) return html``;

        return html`
        <div class="requirement">
            ${this.isEditing ? this.renderEditMode() : this.renderReadMode()}
        </div>`;
    }

    private renderReadMode() {
        return html`
        <div class="mode-read">
            <div class="check-row">
                <div class="check-container">
                    <input
                        class="checkbox"
                        type="checkbox"
                        .checked=${this.planningItem?.done}
                        disabled
                    />
                    <span>${this.checkNumber}.</span>
                    <div class="description ${this.planningItem!.done ? 'done' : ''}">
                         ${this.planningItem!.done ? '✔ Done' : 'Pending'}
                    </div>
                </div>
                <div class="check-actions">
                    <span @click=${() => this.enterEditMode()}>✎ Edit</span>
                    ${this.planningItem?.done === false ? html`<span @click=${() => this.improveWithLLM()}>⛏ Improve With LLM</span>` : ''}
                </div>
            </div>                
            <div class="info-row">
                <div class="description">
                    ${collab_file_pen}
                    Description: ${this.planningItem!.description}
                </div>
                <div class="comment">
                    ${collab_message}
                    Comment: ${this.planningItem!.comment}
                </div>
    
            </div>
        </div>
        
        `;
    }

    private renderEditMode() {
        return html`

        <div class="mode-edit">
                <div class="check-container">
                    <input
                        class="checkbox"
                        type="checkbox"
                        .checked=${this.tempDone}
                        @change=${(e: Event) => this.tempDone = (e.target as HTMLInputElement).checked}
                    />
                    <div>
                         ${this.tempDone ? 'Done' : 'Pending'}
                    </div>
                </div>

            <div>
                <div>
                    <label>Description:</label>
                    <input
                        type="text"
                        .value=${this.tempDescription}
                        @input=${(e: Event) => this.tempDescription = (e.target as HTMLInputElement).value}
                    />
                </div>
                <div class="comment">
                    <label>Comment:</label>
                    <textarea
                        .value=${this.tempComment}
                        @input=${(e: Event) => this.tempComment = (e.target as HTMLTextAreaElement).value}
                    ></textarea>
                </div>
                <div class="actions">
                    <button @click=${() => this.saveEdit()}>${collab_floppy_disk} Save</button>
                    <button @click=${() => this.deleteItem()}>${collab_trash} Delete</button>
                    <button @click=${() => this.cancelEdit()}>${collab_xmark} Cancel</button>
                </div>
            </div>
        </div>
        `;
    }

    private enterEditMode() {
        if (!this.planningItem) return;
        this.tempDescription = this.planningItem.description;
        this.tempComment = this.planningItem.comment || '';
        this.tempDone = this.planningItem.done || false;
        this.isEditing = true;
    }

    private cancelEdit() {
        this.isEditing = false;
    }

    private deleteItem() {

        this.dispatchEvent(new CustomEvent('onItemDelete', {
            detail: { index: +this.index },
            bubbles: true,
            composed: true,
        }));

        this.planningItem = undefined;
    }

    private saveEdit() {
        if (!this.planningItem) return;
        this.planningItem.description = this.tempDescription;
        this.planningItem.comment = this.tempComment;
        this.planningItem.done = this.tempDone;
        this.isEditing = false;
        this.dispatchEvent(new CustomEvent('onSaveEditClick', {
            detail: { item: this.planningItem },
            bubbles: true,
            composed: true,
        }));
        this.requestUpdate();
    }

    private improveWithLLM() {
        this.dispatchEvent(new CustomEvent('onImproveClick', {
            detail: { item: this.planningItem },
            bubbles: true,
            composed: true,
        }));
    }
}
