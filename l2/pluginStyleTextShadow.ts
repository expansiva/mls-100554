/// <mls shortName="pluginStyleTextShadow" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, svg, repeat, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement'

/// **collab_i18n_start**
const message_pt = {

}

const message_en = {

}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**


export const tags = ['text-shadow'];

@customElement('plugin-style-text-shadow-100554')
export class PluginStyleTextShadow extends CollabLitElement {

    render() {
        return html`TextShadow helper`
    }

}
