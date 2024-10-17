/// <mls shortName="pluginCodelensFileReferences" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property, queryAll } from 'lit/decorators.js';
import { collab_check, collab_xmark, collab_lock } from './_100554_collabIcons';
import { CollabLitElement } from './_100554_collabLitElement';

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

@customElement('plugin-codelens-file-references-100554')
export class PluginCodelensFileReferences extends CollabLitElement {

    render() {
        return html``
    }

}