/// <mls shortName="aimSelectWidget" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
import { collab_ban } from './_100554_collabIcons';

/// **collab_i18n_start**
const message_pt = {
    "btn_cancel": "Cancelar",
    "btn_confirm": "Confirmar",
    "label_select_all": "Selecionar todos",
    "clear_all": "Limpar seleção"
}

const message_en = {
    "btn_cancel": "Cancel",
    "btn_confirm": "Confirm",
    "label_select_all": "Select all",
    "clear_all": "Clear selection"
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('aim-select-widget-100554')
export class AimSelectWidget100554 extends CollabLitElement {

    private msg: MessageType = messages['en'];

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    get value(): string[] {
        if (!this.listcontainer) return [];
        const all = this.listcontainer.querySelectorAll('input');
        const values = Array.from(all).map((inp) => inp.checked ? (inp as any)['file'] : undefined).filter((item) => !!item);
        return values;
    }

    @query('.select-grid') listcontainer: HTMLElement | undefined

    getFilesNames() {
        const { project } = mls.actual[5];
        if (project === undefined) throw new Error('Invalid project selected');
        const filesInProject = Object.keys(mls.stor.files).filter((key) => key.startsWith(`${project}_2`) && key.endsWith('.ts'))

        return filesInProject.map((item) => item.substring(9, item.length - 3));
    }

    private handleSelectAll(e: MouseEvent) {
        const inp = e.target as HTMLInputElement;
        if (!this.listcontainer) return;
        const all = this.listcontainer.querySelectorAll('input');
        if (inp.checked) all.forEach((inp) => inp.checked = true);
        else all.forEach((inp) => inp.checked = false);
    }

    private handleClearAll(e: MouseEvent) {
        const all = this.shadowRoot?.querySelectorAll('input');
        if (all) all.forEach((inp) => inp.checked = false);
    }

    private handleConfirm() {
        const val = this.value;
        this.dispatchEvent(new CustomEvent('select-widget-confirm', {
            detail: val, bubbles: true, composed: true
        }));
    }

    private handleCancel() {
        this.dispatchEvent(new CustomEvent('select-widget-cancel'));
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        const files = this.getFilesNames();
        return html`
        <div> 
            <div class="select-btn">
                <div class="select-btn-group">
                    <div class="select-check-all">
                        <button>
                            <input id="select-check-all" type="checkbox" @change=${this.handleSelectAll}></input>
                            <label for="select-check-all">${this.msg.label_select_all}</label>
                        </button>
                    </div>
                    <div class="select-clear-all">
                        <button @click=${this.handleClearAll}>
                            <div>${collab_ban}</div>
                            <span>${this.msg.clear_all}</span>
                        </button>
                    </div>
                </div>
                <div class="select-btn-actions">
                    <button @click=${this.handleConfirm}>${this.msg.btn_confirm}</button>
                    <button  @click=${this.handleCancel}>${this.msg.btn_cancel}</button>
                </div>
            </div>
            <hr>

            <div class="select-grid">
                ${files.map((filename) => {
            return html`
                    <div class="select-grid-item">
                        <input id="sl_${filename}" .file=${filename} type="checkbox"></input>
                        <label for="sl_${filename}">${filename}</label>
                    </div>
                    `
        })}
            </div>
        </div>`;
    }
}
