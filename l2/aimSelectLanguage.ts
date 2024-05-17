/// <mls shortName="aimSelectLanguage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html, css } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
import { collab_ban } from './_100554_collabIcons';
import { ICollabLanguage, languages } from './_100554_collabLanguages'

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

@customElement('aim-select-language-100554')
export class AimSelectWidget100554 extends CollabLitElement {

    private msg: MessageType = messages['en'];

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    get value(): string[] {
        if (!this.listcontainer) return [];
        const all = this.listcontainer.querySelectorAll('input');
        const values = Array.from(all).map((inp) => inp.checked ? (inp as any)['langObj'] : undefined).filter((item) => !!item);
        return values;
    }

    @query('.select-grid') listcontainer: HTMLElement | undefined

    getLanguages():ICollabLanguage[] {
        return languages.sort((a, b) => a.name.localeCompare(b.name, 'pt', { sensitivity: 'base' }));
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
        this.dispatchEvent(new CustomEvent('select-language-confirm', {
            detail: val, bubbles: true, composed: true
        }));
    }

    private handleCancel() {
        this.dispatchEvent(new CustomEvent('select-language-cancel'));
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        const languages = this.getLanguages();
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
                ${languages.map((lang) => {
            return html`
            
        
                    <div class="select-grid-item">
                        <input id="sl_${lang.code}" .langObj=${lang} type="checkbox"></input>
                        <div class="flags ${lang.code}"></div>
                        <label for="sl_${lang.code}">${lang.name}</label>
                    </div>
                    `
        })}
            </div>
        </div>`;
    }
}
