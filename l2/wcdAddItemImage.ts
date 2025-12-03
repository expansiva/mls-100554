/// <mls shortName="wcdAddItemImage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { collab_image } from '/_100554_/l2/collabIcons.js';
import { CollabLitElement } from "/_100554_/l2/collabLitElement.js";
import { globalWcd } from '/_100554_/l2/wcdState.js';
/// **collab_i18n_start**
const message_pt = {
    image: 'Adicionar uma imagem',
}
const message_en = {
    image: 'Add an image',
}
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('wcd-add-item-image-100554')
export class WcdAddItemImage100554 extends CollabLitElement {

    private msg: MessageType = messages['en'];

    static styles = css``;

    createRenderRoot() {
        return this;
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return html`
        <wcd-add-button @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e)} @click=${this.handleImageClick} data-tooltip=${this.msg.image} ><span>${collab_image}</span></wcd-add-button>

    `;
    }

    private async handleImageClick(e: MouseEvent) {
        e.stopPropagation();
        this.showHelper();
    }

    private async handleKeyDown(e: KeyboardEvent) {
        e.stopPropagation();
        if (e.key === 'Enter') {
            this.handleImageClick(new MouseEvent('click'));
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
                    name: '_100554_wcdDialogImage',
                    args: '',
                    position: 'p-l1',
                    level: [1,2,3,4,5,6,7],
                    toolboxOptions: { border: 'none' }
                },

            ],
            false,
            'size'
        );

    }

}
