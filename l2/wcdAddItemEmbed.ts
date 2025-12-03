/// <mls shortName="wcdAddItemEmbed" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { collab_link } from '/_100554_/l2/collabIcons.js';
import { CollabLitElement } from "/_100554_/l2/collabLitElement.js";
import { globalWcd } from '/_100554_/l2/wcdState.js';

/// **collab_i18n_start**
const message_pt = {
    embed: 'Adicionar um link incorporado',
}
const message_en = {
    embed: 'Add an embed',
}
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('wcd-add-item-embed-100554')
export class WcdAddItemEmbed100554 extends CollabLitElement {

    private msg: MessageType = messages['en'];

    static styles = css``;

    createRenderRoot() {
        return this;
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return html`
        <wcd-add-button @keydown=${this.handleKeyDown} @click=${this.handleClick} data-tooltip=${this.msg.embed} ><span>${collab_link}</span></wcd-add-button>

    `;
    }

    private async handleClick(e: MouseEvent) {
        e.stopPropagation();
        this.showHelper();
    }

    private async handleKeyDown(e: KeyboardEvent) {
        e.stopPropagation();
        if (e.key === 'Enter') {
            this.handleClick(new MouseEvent('click'));
        }
    }

    private showHelper() {
        if (!globalWcd) throw new Error('Invalid window.wcdState');
        if (!globalWcd.myParent) throw new Error('Invalid window.wcdState.myParent');

        (globalWcd.myParent as any).onclick = null;
        globalWcd.myParent?.setIconsWcdToolbox(
            [
                {
                    name: 'backButton'
                },
                {
                    name: '_100554_wcdDialogEmbedLink',
                    args: '',
                    position: 'p-l1',
                    level: [1,2,3,4,5,6,7],
                    toolboxOptions: { background: '#fff', border: 'none' }
                },

            ],
            false,
            'size'
        );

    }

}
