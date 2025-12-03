/// <mls shortName="wcdDialogEmbedLink" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { execute } from '/_100554_/l2/wcdCommandAddEmbedLink.js';
import { WCDOverlayMethods } from '/_100554_/l2/wcdTypes.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';
import { globalWcd } from '/_100554_/l2/wcdState.js';

/// **collab_i18n_start**
const message_pt = {
    placeholder: 'cole um link para incorporar conteúdo de outro site e pressione Enter'

}
const message_en = {
    placeholder: 'paste a link to embed content from another site and press Enter'
}
type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('wcd-dialog-embed-link-100554')
export class WcdDialogEmbedLink100554 extends CollabLitElement {

    private link: string = '';

    private msg: MessageType = messages['en'];

    @query('#prompt-input') prompt: HTMLInputElement | undefined;

    private async handleKeyDown(event: KeyboardEvent) {
        event.stopPropagation();
        if (!globalWcd) throw new Error('Invalid window.wcdState');
        if (!globalWcd.myParent) throw new Error('Invalid window.wcdState.myParent');
        if (!globalWcd.elICA) throw new Error('Invalid window.wcdState.elICA');

        if (event.key === 'Enter') {
            await execute({
                args: { url: this.link },
                overlay: globalWcd.myParent?.parentElement?.parentElement as WCDOverlayMethods,
                selectedIca: globalWcd.elICA as any,
            });
        }

    }

    private handleInput(event: KeyboardEvent) {
        event.stopPropagation();
        this.link = (event.target as HTMLInputElement)?.value || '';
    }

    firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(changedProperties);
        if (this.prompt) this.prompt.focus();
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return html`

            <div class="container">
                <div class="prompt-content">
                    <input
                    @input=${this.handleInput.bind(this)} 
                    @keydown=${this.handleKeyDown.bind(this)} 
                    type="text" 
                    id="prompt-input"
                    placeholder=${this.msg.placeholder}
                    />
                </div>
        `;
    }

    static styles = css`
        :host{
            display:block;
            width:100%;
        }
        .container{
            padding:1rem;
        }

        .prompt-content{
            padding: 10px;
            display:flex;
            margin-bottom:1rem;
        }

        .prompt-content input {
            border:none;
            border-bottom: 1px solid var(--grey-color);
            outline:none;
            width: 100%;
            display: block;
            font-size: 1rem;
            line-height: 1.5;
            color: #000000;
            background-color: #fff;
            background-clip: padding-box;
            border-radius: 0.25rem;
            transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }
    `;
}

