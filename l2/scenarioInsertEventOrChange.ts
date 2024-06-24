/// <mls shortName="scenarioInsertEventOrChange" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property, query, queryAll } from 'lit/decorators.js';

import { IScenaryDetails } from './_100554_collabLitElement';

export function _100554_scenarioInsertEventOrChange_getScenaryDetails(): IScenaryDetails {
    const html = document.createElement('scenario-insert-event-or-change-100554');
    return {
        description: 'Insert or Change Event',
        html
    }
}



export const initCollabSelectOneWithDescription = '';

/// **collab_i18n_start**
const message_pt = {
    defaultMsg: 'Em desenvolvimento inserir ou alterar Eventos',
}

const message_en = {
    defaultMsg: 'In development insert or change Events',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**
@customElement('scenario-insert-event-or-change-100554')
export class ScenarioInsertEventOrChange extends LitElement {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    private msg: MessageType = messages['en'];

    //---------- COMPONENT---------

    render() {
        html`
            <h3>${this.msg.defaultMsg}</h3>
        `
    }

}