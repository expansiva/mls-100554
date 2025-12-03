/// <mls shortName="wcdAddItemDel" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { globalWcd } from '/_100554_/l2/wcdState.js';
import { CollabLitElement } from "/_100554_/l2/collabLitElement.js";
import { execute as excCommandDel } from '/_100554_/l2/wcdCommandDel.js';

/// **collab_i18n_start**
const message_pt = {
    code: 'Deletar widget',
}
const message_en = {
    code: 'Delete widget',
}

type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('wcd-add-item-del-100554')
export class WcdAddItemDel100554 extends CollabLitElement {

    private msg: MessageType = messages['en'];

    static styles = css``;

    createRenderRoot() {
        return this;
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return html`
        <wcd-add-button @keydown=${this.handleKeyDown} @click=${this.handleClick} data-tooltip=${this.msg.code} ><span><svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></span></wcd-add-button>

    `;
    }

    private async handleClick(e: MouseEvent) {
        e.stopPropagation();
        this.handleCodeClick();
    }

    private async handleKeyDown(e: KeyboardEvent) {
        e.stopPropagation();
        if (e.key === 'Enter') {
            this.handleClick(new MouseEvent('click'));
        }
    }

    private async handleCodeClick() {
        if (!globalWcd.myParent) throw new Error('Invalid window.wcdState.myParent');
        if (!globalWcd.elICA  || !globalWcd.elICA.overlayRef) throw new Error('Invalid window.wcdState.elICA');

        const param = {
            args: new KeyboardEvent('keydown', {
                key: 'Del',
                code: 'Del',
                keyCode: 13,
                bubbles: true,
                cancelable: true,
                composed: true,
            }),
            overlay: globalWcd.elICA.overlayRef.parentElement as any,
            selectedIca: globalWcd.elICA
        }

        excCommandDel(param);
    }

}