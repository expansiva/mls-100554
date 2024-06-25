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
    noIten: 'Nenhum elemento selecionado!',
    helpYou: 'Como podemos te ajudar?',
    card1: 'Faça você mesmo',
    card1Desc: 'Codifique manualmente e desenvolva o seu próprio evento.',
    card2: 'Rotinas pré-prontas',
    card2Desc: 'Utilize rotinas pré-prontas para facilitar o desenvolvimento do seu evento.',

}

const message_en = {
    defaultMsg: 'In development insert or change Events',
    noIten: 'No elements selected!',
    helpYou: 'How can we help you?',
    card1: 'Do it yourself',
    card1Desc: 'Manually code and develop your own event.',
    card2: 'Pre-ready routines',
    card2Desc: 'Use pre-made routines to facilitate the development of your event.'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**
@customElement('scenario-insert-event-or-change-100554')
export class ScenarioInsertEventOrChange extends LitElement {

    private msg: MessageType = messages['en'];

    private myInfos:{id:string, event:string} | undefined

    //---------- COMPONENT---------


    connectedCallback() {
        super.connectedCallback();
        this.init();
    }

    render() {

        if (!this.myInfos) {
            return this.renderNoSelected();
        }
        return html`${this.renderScenarioHowDo()}`;
    }

    renderNoSelected() {
        return html`<h3 style="text-align:center">${this.msg.noIten}</h3>`;
    }

    renderScenarioHowDo(){
        return html`
            <div class="scenarioHowDo">
                <h3 style="text-align:center">${this.msg.helpYou
                }</h3>
                <div class="container">
                    <div class="card">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M246.9 23.7C242.3 6.6 224.8-3.5 207.7 1.1s-27.2 22.1-22.6 39.2L238 237.8c2.5 9.2-4.5 18.2-14 18.2c-6.4 0-12-4.2-13.9-10.3L166.6 102.7c-5.1-16.9-23-26.4-39.9-21.3s-26.4 23-21.3 39.9l62.8 206.4c2.4 7.9-7.2 13.8-13.2 8.1L99.6 283c-16-15.2-41.3-14.6-56.6 1.4s-14.6 41.3 1.4 56.6L156.8 448c43.1 41.1 100.4 64 160 64h10.9 8.2c.1 0 .1-.1 .1-.1s.1-.1 .1-.1c58.3-3.5 108.6-43.2 125.3-99.7l81.2-275c5-16.9-4.7-34.7-21.6-39.8s-34.7 4.7-39.8 21.6L443.5 247.1c-1.6 5.3-6.4 8.9-12 8.9c-7.9 0-13.8-7.3-12.2-15.1l36-170.3c3.7-17.3-7.4-34.3-24.7-37.9s-34.3 7.4-37.9 24.7L355.1 235.1c-2.6 12.2-13.3 20.9-25.8 20.9c-11.9 0-22.4-8-25.4-19.5l-57-212.8z"/></svg>
                        <h2>${this.msg.card1}</h2>
                        <p>${this.msg.card1Desc}</p>
                    </div>
                    <div class="card">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M320 0c17.7 0 32 14.3 32 32V96H472c39.8 0 72 32.2 72 72V440c0 39.8-32.2 72-72 72H168c-39.8 0-72-32.2-72-72V168c0-39.8 32.2-72 72-72H288V32c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H208zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H304zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H400zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224H64V416H48c-26.5 0-48-21.5-48-48V272c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H576V224h16z"/></svg>
                        <h2>${this.msg.card2}</h2>
                        <p>${this.msg.card2Desc}</p>
                    </div>
                </div>
            </div>
        
        `
}

    //------------IMPLEMETNATION---------

    private init(){
        this.setInfos();
    }

    private setInfos() {

        //(window as any).infoScenarioInsertOrCreateEvent = { id: 'teste', event: 'click' };

        if (!(window as any).infoScenarioInsertOrCreateEvent) {
            this.requestUpdate();
            return;
        }

        this.myInfos = Object.assign({},(window as any).infoScenarioInsertOrCreateEvent);

        delete (window as any).infoScenarioInsertOrCreateEvent;

        this.requestUpdate();

    }

    //---------------CSS----------------

    static styles = css`

        .scenarioHowDo .container {
            display: flex;
            gap: 20px;
            justify-content:center;
            padding:3rem;
        }

        .scenarioHowDo .card {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 20px;
            text-align: center;
            cursor:pointer;
            width: 300px;
        }

        .scenarioHowDo .card:hover {
            box-shadow: 0 5px 9px rgba(0, 0, 0, 0.5);
        }

        .scenarioHowDo .card svg {
            width: 50px;
            height: 50px;
            margin-bottom: 20px;
        }

        .scenarioHowDo .card h2 {
            font-size: 24px;
            margin-bottom: 10px;
        }

        .scenarioHowDo .card p {
            font-size: 16px;
            color: #666;
        }


    `;

}

