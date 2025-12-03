/// <mls shortName="pluginPageAIVerify" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, svg, repeat, TemplateResult } from 'lit';
import { property, queryAll } from 'lit/decorators.js';
import { PluginBaseModule } from '/_100554_/l2/pluginBaseModule.js'; 

/// **collab_i18n_start**
const message_pt = {
    msg: 'Em desenvolvimento'
}

const message_en = {
    msg: 'In development',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

export const pluginData: mls.plugin.IPluginData = {
    title: "Page verify",
    getSvg(): TemplateResult {
        return svg`
     <svg height="22px" width="22px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
    `;
    }
};

export class PluginPageAIVerify extends PluginBaseModule {

    private msg: MessageType = messages['en'];

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return html`<div>${this.msg.msg}</div>`;
    }

}

if (!customElements.get('plugin-page-a-i-verify-100554')) {
    customElements.define('plugin-page-a-i-verify-100554', PluginPageAIVerify);
}