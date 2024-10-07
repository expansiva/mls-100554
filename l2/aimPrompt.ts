/// <mls shortName="aimPrompt" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
import { collab_arrow_up_long } from './_100554_collabIcons';
import './_100554_aimPromptExample';

/// **collab_i18n_start**
const message_pt = {
    btnSend: 'Enviar',
    placeHolder: 'Digite sua pergunta...' 
}

const message_en = {
    btnSend: 'Send',
    placeHolder: 'Enter your question...'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**
@customElement('aim-prompt-100554')
export class CollabInputTag extends CollabLitElement {

    private msg: MessageType = messages['en'];
    @property({ type: "string" }) text = "";

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return html
            `<div class="aim-prompt-search-container">
                <textarea
                    rows="1"
                    autocomplete="off"
                    .value="${this.text}"
                    placeholder=${this.msg.placeHolder}
                    class="aim-prompt-search-input"
                    id="searchInput"
                    @focus="${this.handleFocus}"
                    @input="${this.handleInput}"
                ></textarea>
                <button class="search-button">${collab_arrow_up_long}</button>
            </div>`;
    }

    private isInIframe() {
        return window.self !== window.top;
    }

    private handleFocus(event: KeyboardEvent) {
        if (this.isInIframe()) return;
        const input = event.target as HTMLInputElement;
        // const text: string = input.value;
        const data: mls.events.IPluginDetail = {
            project: mls.actual[mls.actualLevel].project || 0,
            shortName: mls.actual[mls.actualLevel].path || ''
        }
        mls.events.fire(mls.actualLevel, 'PluginDetails', JSON.stringify(data))
    }

    private handleInput(event: Event) {
        const textarea = event.target as HTMLTextAreaElement;
        // Atualiza a propriedade 'text' com o valor do conteúdo do textarea
        this.text = textarea.value;

        // Ajusta a altura do textarea automaticamente conforme o conteúdo
        textarea.style.height = 'auto'; // Reseta a altura para calcular corretamente
        textarea.style.height = `${textarea.scrollHeight}px`; // Define a nova altura com base no conteúdo
    }    

    static styles = css`
        .aim-prompt-search-container {
            display: flex;
            align-items: center;
            background-color: var(--grey-color-light);
            padding: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
        }

        .aim-prompt-search-input {
            padding: 10px 15px;
            border: 1px solid #d1d1d1;
            background-color: #fff;
            color: #000;
            font-size: 14px;
            outline: none;
            transition: border-color 0.3s ease;
            width:100%;
            border-radius: 8px;
            outline: none;
        }
        .aim-prompt-search-input:focus {
           border-color: #0078d4; 
        }
        .search-button {
            margin-left: 8px;
            padding: 10px 12px;
            border: none;
            border-radius: 9999px;
            background-color: #ddd;
            color: #fff;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .search-button:hover {
            background-color: #005bb5;
        }        
        .search-button:disabled {
            background-color: #e0e0e0;
            cursor: not-allowed;
        }
    
    `;


}