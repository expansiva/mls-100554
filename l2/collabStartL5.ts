/// <mls fileReference="_100554_/l2/collabStartL5.ts" enhancement="_100554_enhancementLit" />

import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';

/// **collab_i18n_start**
const message_pt = {
    desc: 'Descrição',
    news: 'Novidades',
    inDevelopment: 'Em desenvolvimento...',
    details1: 'Sobre esse level',
    module1Title: 'Módulo L5 - Management: Descrição e Funcionalidades',
    module1Text: 'O módulo L5 é voltado para o gerenciamento do projeto. Ele oferece uma série de ferramentas que permitem ao usuário coordenar as tarefas, visualizar o progresso e gerenciar a infraestrutura e recursos humanos.',
    module1List1: 'Visualização de Páginas do Projeto',
    module1List1_1: 'Um quadro Kanban que mostra todas as páginas do projeto categorizadas por status: "Todo", "Planning", "In Progress", "Review" e "Complete".',
    module1List1_2: 'Uma lista simples que exibe todas as páginas do projeto, permitindo uma visão rápida do que está em desenvolvimento.',

    module1List2: 'Infraestrutura',
    module1List2_1: 'Permite definir configurações de hospedagem, banco de dados, plugins, módulos externos e outras opções técnicas para a publicação do aplicativo.',
    module1List3: 'Visualização de Recursos',
    module1List3_1: 'Mostra uma lista de todas as pessoas envolvidas no projeto e métricas sobre sua colaboração, como tarefas concluídas, horas trabalhadas, etc.',
    
    module2Title: 'Fluxo de Uso',
    module2List1: 'O usuário acessa o módulo L5 e tem uma visão geral através dos dashboards e listas.',
    module2List2: 'Utiliza o Board de Páginas para mover páginas entre diferentes status e acompanhar o progresso.',
    module2List3: 'Acessa a seção Infraestrutura para configurar detalhes técnicos do projeto.',
    module2List4: 'Utiliza a Visualização de Recursos para monitorar a eficácia da equipe e fazer ajustes conforme necessário.',

    moduleExplain: 'Este módulo é crucial para manter o projeto organizado e assegurar que todos os recursos estejam sendo utilizados de forma eficiente. Ele oferece uma visão 360 graus do projeto, permitindo um gerenciamento eficaz.',
}

const message_en = {
    desc: 'Description',
    news: 'News',
    inDevelopment: 'In development...',
    details1: 'About this level',
    module1Title: 'Module L5 - Management: Description and Features',
    module1Text: 'The L5 module focuses on project management. It provides a set of tools enabling users to coordinate tasks, monitor progress, and manage infrastructure and human resources.',
    module1List1: 'Project Pages Overview',
    module1List1_1: 'A Kanban board displaying all project pages categorized by status: "Todo," "Planning," "In Progress," "Review," and "Complete."',
    module1List1_2: 'A simple list view showing all project pages, offering a quick overview of ongoing development.',

    module1List2: 'Infrastructure',
    module1List2_1: 'Allows configuration of hosting, database, plugins, external modules, and other technical options for application deployment.',
    module1List3: 'Resource Overview',
    module1List3_1: 'Displays a list of all project contributors with metrics on their collaboration, such as completed tasks, hours worked, and more.',
    
    module2Title: 'Usage Flow',
    module2List1: 'The user accesses the L5 module and gets an overview via dashboards and lists.',
    module2List2: 'Uses the Pages Board to move pages across different statuses and track progress.',
    module2List3: 'Accesses the Infrastructure section to configure technical project details.',
    module2List4: 'Utilizes the Resource Overview to monitor team effectiveness and make necessary adjustments.',

    moduleExplain: 'This module is critical to keeping the project organized and ensuring all resources are used efficiently. It provides a 360-degree view of the project for effective management.',
};


type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('collab-start-l5-100554')
export class CollabStartL5100554 extends StateLitElement {

    private msg: MessageType = messages['en'];

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
        <section class="collab-codes-start">
            <div class="collab-codes-banner">
                <img id="serviceStartL5ImageBanner" src="./l3/_100529_/images/startl5.avif" height="250" width="800" alt="banner">
            </div>
            <div class="collab-codes-content">
                <details id="serviceStartL5DetailsAbout" open="open">
                    <summary>${this.msg.details1}</summary>
                    <div>
                        <h1>${this.msg.module1Title}</h1>
                        <div>
                            <h2>${this.msg.desc}</h2>
                            <span>${this.msg.module1Text}

                                <ol>
                                    <li>
                                        <span>${this.msg.module1List1}</span>
                                        <ul>
                                            <li>${this.msg.module1List1_1}</li>
                                            <li>${this.msg.module1List1_2}</li>

                                        </ul>
                                    </li>
                                    <li>
                                        <span>${this.msg.module1List2}</span>
                                        <ul>
                                            <li>${this.msg.module1List2_1}</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <span>${this.msg.module1List3}</span>
                                        <ul>
                                            <li>${this.msg.module1List3_1}</li>
                                        </ul>
                                    </li>
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
                <details id="serviceStartL5DetailsNews" open="open">
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
