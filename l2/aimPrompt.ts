/// <mls shortName="aimPrompt" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
import { collab_arrow_up_long } from './_100554_collabIcons'

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

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return html
            `<div class="aim-prompt-search-container">
                <input
                    type="text"
                    autocomplete="off"
                    placeholder=${this.msg.placeHolder}
                    class="aim-prompt-search-input"
                    id="searchInput"
                />
                <button class="search-button">${collab_arrow_up_long}</button>
            </div>`;
    }

    static styles = css`
        .aim-prompt-search-container {
            display: flex;
            align-items: center;
            background-color: var(--grey-color-light);
            padding: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .aim-prompt-search-input {
            padding: 10px 15px;
            border: none;
            background-color: var(--grey-color-light);
            font-size: 16px;
            outline: none;
            transition: background-color 0.3s ease;
            width:100%;
        }

        .search-button {
            margin-left: 10px;
            padding: 10px 12px;
            border: none;
            border-radius: 9999px;
            background-color: #000;
            color: #fff;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .search-button svg{
            fill: #fff;
        }

        .aim-prompt-search-input:not(:placeholder-shown) + .search-button:hover{
            opacity:.6;
        }

        .aim-prompt-search-input:placeholder-shown + .search-button {
            background-color: var(--grey-color-darker); 
            cursor: not-allowed;
        }
    
    `;


}