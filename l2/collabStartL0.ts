/// <mls fileReference="_100554_/l2/collabStartL0.ts" enhancement="_blank" />

import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';

/// **collab_i18n_start**
const message_pt = {
    desc: 'Descrição',
    news: 'Novidades',
    inDevelopment: 'Em desenvolvimento...',
    details1: 'Sobre esse level',
    module1Title: 'Módulo L0 - User: Descrição e Funcionalidades',
    module1Text: 'O módulo L0 é voltado para o usuário geral da plataforma Collab.codes. Este módulo oferece uma visão geral dos projetos em que o usuário está envolvido, além de permitir a gestão de autoridades, escolha de planos e personalização visual da ferramenta.',
    module1List1: 'Visualizar e ver projetos: permite ao usuário uma visão geral e detalhada dos projetos em que está envolvido, facilitando o acompanhamento do progresso',
    module1List2: 'Dar autoridades a outros: oferece a opção de conceder diferentes níveis de autoridade a outros membros da equipe, como administrador, editor ou visualizador',
    module1List3: 'Escolher o plano atual: permite ao usuário selecionar o plano de assinatura mais adequado às suas necessidades e, se necessário, incluir informações de faturamento.',
    module1List4: 'Selecionar preferências visuais: oferece opções para personalizar a aparência da ferramenta, como temas, layout e configurações de exibição.',

    module2Title: 'Fluxo de Uso',
    module2List1: 'O usuário acessa o módulo L0 e tem uma visão geral dos projetos em que está envolvido.',
    module2List2: 'Se necessário, concede autoridades a outros membros da equipe para facilitar a colaboração.',
    module2List3: 'Escolhe o plano de assinatura que melhor atende às suas necessidades e inclui informações de faturamento, se aplicável..',
    module2List4: 'Personaliza a interface da ferramenta de acordo com suas preferências visuais para uma experiência de usuário mais agradável.',

    moduleExplain: 'O módulo L0 serve como um hub central para o usuário, permitindo uma gestão eficaz de projetos, equipes e preferências pessoais. É uma parte crucial para garantir que o usuário tenha controle e visibilidade sobre todos os aspectos relevantes da plataforma.',
}

const message_en = {
    desc: 'Description',
    news: 'News',
    inDevelopment: 'In development...',
    details1: 'About this level',
    module1Title: 'Module L0 - User: Description and Features',
    module1Text: 'The L0 module is designed for the general user of the Collab.codes platform. This module provides an overview of the projects the user is involved in, while enabling authority management, plan selection, and visual customization of the tool.',
    module1List1: 'View and monitor projects: allows the user to have an overview and detailed insight into the projects they are involved in, facilitating progress tracking.',
    module1List2: 'Grant authorities to others: offers the option to assign different levels of authority to other team members, such as administrator, editor, or viewer.',
    module1List3: 'Select the current plan: enables the user to choose the subscription plan that best suits their needs and, if necessary, include billing information.',
    module1List4: 'Choose visual preferences: provides options to customize the tool’s appearance, such as themes, layout, and display settings.',

    module2Title: 'Usage Flow',
    module2List1: 'The user accesses the L0 module and gets an overview of the projects they are involved in.',
    module2List2: 'If needed, grants authority to other team members to facilitate collaboration.',
    module2List3: 'Selects the subscription plan that best meets their needs and includes billing information, if applicable.',
    module2List4: 'Customizes the tool’s interface according to their visual preferences for a more pleasant user experience.',

    moduleExplain: 'The L0 module serves as a central hub for the user, enabling effective management of projects, teams, and personal preferences. It is a crucial part of ensuring that the user has control and visibility over all relevant aspects of the platform.',
};


type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('collab-start-l0-100554')
export class CollabStartL0100554 extends StateLitElement {

    private msg: MessageType = messages['en'];

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
        <section class="collab-codes-start">
            <div class="collab-codes-banner">
                <img id="serviceStartL0ImageBanner" src="./l3/_100529_/images/startl0.avif" height="250" width="800" alt="banner">
            </div>
            <div class="collab-codes-content">
                <details id="serviceStartL0DetailsAbout" open="open">
                    <summary>${this.msg.details1}</summary>
                    <div>
                        <h1>${this.msg.module1Title}</h1>
                        <div>
                            <h2>${this.msg.desc}</h2>
                            <span>${this.msg.module1Text}
                                <ol>
                                    <li>${this.msg.module1List1}</li>
                                    <li>${this.msg.module1List2}</li>
                                    <li>${this.msg.module1List3}</li>
                                    <li>${this.msg.module1List4}</li>
                                </ol>
                            </span>
                        </div>
                        <div class="separator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div>
                            <h3>${this.msg.module2Title}</h3>
                            <ol>
                                <li>${this.msg.module2List1}</li>
                                <li>${this.msg.module2List2}</li>
                                <li>${this.msg.module2List3}</li>
                                <li>${this.msg.module2List4}</li>
                            </ol>
                            <span>${this.msg.moduleExplain}</span>
                        </div>
                    </div>
                </details>
                <details id="serviceStartL0DetailsNews" open="open">
                    <summary>${this.msg.news}</summary>
                    <div>
                        <span>${this.msg.inDevelopment}</span>
                    </div>
                </details>
            </div>
        </section>
        <img class="collab_marca" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSJ0cmFuc3BhcmVudCIgLz4KICA8dGV4dCB4PSIzMCIgeT0iNTYiIGZvbnQtZmFtaWx5PSJWZXJkYW5hIiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzQyODVGNCI+QzwvdGV4dD4KICA8dGV4dCB4PSI0MCIgeT0iNDAiIGZvbnQtZmFtaWx5PSJWZXJkYW5hIiBmb250LXNpemU9IjM4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0VBNDMzNSI+YzwvdGV4dD4KPC9zdmc+Cg==" height="140" width="140" alt="collab codes">
         `;
    }
}
