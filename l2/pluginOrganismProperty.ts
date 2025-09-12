/// <mls shortName="pluginOrganismProperty" project="100554" enhancement="_blank" />

import { html } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';


/// **collab_i18n_start** 
const message_pt = {
    inDev: 'Em desenvolvimento!',
}

const message_en = {
    inDev: 'In develpoment',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**


@customElement('plugin-organism-property-100554')
export class PluginOrganisAdd extends CollabLitElement {

    render() {
        return html`In development`;
    }

}