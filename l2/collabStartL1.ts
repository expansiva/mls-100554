/// <mls fileReference="_100554_/l2/collabStartL1.ts" enhancement="_100554_enhancementLit" />

import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';

/// **collab_i18n_start**
const message_pt = {
    desc: 'Descrição',
    news: 'Novidades',
    inDevelopment: 'Em desenvolvimento...',
    details1: 'Sobre esse level',
    module1Title: 'Módulo L1 - Back-End: Descrição e Funcionalidades',
    module1Text: 'O módulo L1 é voltado para o programador back-end e foca na lógica do servidor, incluindo autoridades, regras de negócio e persistência de dados. Este módulo também é responsável por testar as rotinas em um ambiente de testes e gerenciar o layout das tabelas no banco de dados.',
    module1List1: 'Programar Rotinas no Servidor',
    module1List1_1: 'Desenvolvimento de APIs que serão utilizadas em várias páginas para consultas comuns.',
    module1List1_2: 'Programação de rotinas que serão responsáveis pela validação da página e pela hidratação, ou seja, o envio de dados para a página após um post back.',

    module1List2: 'Testar em Ambiente de Testes',
    module1List2_1: 'Ferramentas e processos para testar as rotinas programadas em um ambiente isolado antes de serem implementadas no ambiente de produção.',

    module1List3: 'Verificar e Implementar Layouts das Tabelas no Banco de Dados',
    module1List3_1: 'Processos para verificar e implementar os layouts das tabelas no banco de dados, garantindo que os dados sejam armazenados de forma eficiente e segura.',

    module2Title: 'Fluxo de Uso',
    module2List1: 'O usuário começa programando as rotinas que serão executadas no servidor, focando em autoridades, regras de negócio e persistência de dados.',
    module2List2: 'Desenvolve APIs para consultas comuns que serão usadas em várias páginas do projeto.',
    module2List3: 'Programa rotinas específicas para validação e hidratação de páginas.',
    module2List4: 'Testa todas as rotinas em um ambiente de testes para garantir que funcionem como esperado.',
    module2List5: 'Verifica e implementa os layouts das tabelas no banco de dados para garantir a eficiência e segurança no armazenamento de dados.',


    moduleExplain: 'O módulo L1 é fundamental para o funcionamento correto e seguro do projeto. Ele garante que todas as regras de negócio sejam implementadas corretamente e que os dados sejam armazenados de forma segura e eficiente.',
}

const message_en = {
    desc: 'Description',
    news: 'News',
    inDevelopment: 'In development...',
    details1: 'About this level',
    module1Title: 'Module L1 - Back-End: Description and Features',
    module1Text: 'The L1 module is aimed at back-end developers and focuses on server logic, including authorities, business rules, and data persistence. This module is also responsible for testing routines in a testing environment and managing database table layouts.',
    module1List1: 'Program Server Routines',
    module1List1_1: 'Developing APIs to be used across multiple pages for common queries.',
    module1List1_2: 'Programming routines responsible for page validation and hydration, i.e., sending data to the page after a post-back.',

    module1List2: 'Test in a Testing Environment',
    module1List2_1: 'Tools and processes for testing programmed routines in an isolated environment before deployment to production.',

    module1List3: 'Verify and Implement Database Table Layouts',
    module1List3_1: 'Processes to verify and implement database table layouts, ensuring data is stored efficiently and securely.',

    module2Title: 'Usage Flow',
    module2List1: 'The user starts by programming routines to be executed on the server, focusing on authorities, business rules, and data persistence.',
    module2List2: 'Develops APIs for common queries to be used across multiple pages of the project.',
    module2List3: 'Programs specific routines for page validation and hydration.',
    module2List4: 'Tests all routines in a testing environment to ensure they work as expected.',
    module2List5: 'Verifies and implements database table layouts to ensure efficient and secure data storage.',

    moduleExplain: 'The L1 module is essential for the correct and secure operation of the project. It ensures that all business rules are properly implemented and that data is stored securely and efficiently.',
};


type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('collab-start-l1-100554')
export class CollabStartL1100554 extends StateLitElement {

    private msg: MessageType = messages['en'];

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
        <section class="collab-codes-start">
            <div class="collab-codes-banner">
                <img id="serviceStartL1ImageBanner" src="./l3/_100529_/images/startl1.avif" height="250" width="800" alt="banner">
            </div>
            <div class="collab-codes-content">
                <details id="serviceStartL1DetailsAbout" open="open">
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
                                            <li>${this.msg.module1List1_1}
                                            </li>
                                            <li>${this.msg.module1List1_2}</b>
                                            </li>
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
                <details id="serviceStartL1DetailsNews" open="open">
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
