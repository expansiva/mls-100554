/// <mls shortName="wcdAddItemCode" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { collab_code } from '/_100554_/l2/collabIcons.js';
import { CollabLitElement } from "/_100554_/l2/collabLitElement.js";
import * as commandCode from '/_100554_/l2/wcdCommandAddCodeBlock.js';
import { WCDOverlayMethods } from '/_100554_/l2/wcdTypes.js';
import { globalWcd } from '/_100554_/l2/wcdState.js';
/// **collab_i18n_start**
const message_pt = {
    code: 'Adicionar um novo bloco de código',
}
const message_en = {
    code: 'Add a new code block',
}

type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('wcd-add-item-code-100554')
export class WcdAddItemCode100554 extends CollabLitElement {

    private msg: MessageType = messages['en'];

    static styles = css``;

    createRenderRoot() {
        return this;
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return html`
        <wcd-add-button @keydown=${this.handleKeyDown} @click=${this.handleClick} data-tooltip=${this.msg.code} ><span>${collab_code}</span></wcd-add-button>

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
        if (!globalWcd.elICA) throw new Error('Invalid window.wcdState.elICA');

        await commandCode.execute({
            args: {},
            overlay: globalWcd.myParent?.parentElement?.parentElement as WCDOverlayMethods,
            selectedIca: globalWcd.elICA as any,
        });
    }

}
