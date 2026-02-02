/// <mls fileReference="_100554_/l2/collabStartL6.ts" enhancement="_100554_enhancementLit" />

import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';

/// **collab_i18n_start**
const message_pt = {
    desc: 'Descrição',
    news: 'Novidades',
    inDevelopment: 'Em desenvolvimento...',
    details1: 'Sobre esse level',
    module1Title: 'Módulo L6 - Owner: Funcionalidades',

    module1List1: 'Dashboard de Projetos: Visão geral de todos os projetos, seu status e métricas relevantes.',
    module1List2: 'Dashboard do Uso do Aplicativo: Métricas de uso do aplicativo, como número de usuários ativos, funil de conversão, etc',
    module1List3: 'Dashboard do Custo de Desenvolvimento: Informações financeiras relacionadas ao custo de desenvolvimento do projeto.',
    module1List4: 'Dashboard do Custo de Hospedagem: Custos associados à infraestrutura e hospedagem do aplicativo.',

    module2Title: 'Fluxo de Uso',
    module2List1: 'O usuário acessa o módulo L6 e visualiza os dashboards.',
    module2List2: 'Utiliza um dos prompts para iniciar um novo projeto ou funcionalidade.',
    module2List3: 'Monitora métricas e custos através dos dashboards.',

    module3Title: 'Exemplos de Prompts para Iniciar Projetos via IA',
    module3List1: 'Sistema de Farmácia',
    module3List1_1: 'Prompt: Preciso de um sistema para controlar o estoque e vendas da minha farmácia.',
    module3List1_2: 'Ação: A IA inicia a criação de um projeto focado em um sistema de gestão para farmácias, incluindo módulos como controle de estoque, vendas e integração com fornecedores.',


    module3List2: 'Site de Vendas',
    module3List2_1: 'Prompt: Preciso de um site para vendas e controle de funil.',
    module3List2_2: 'A IA começa a esboçar um projeto de site de e-commerce com funcionalidades de controle de funil de vendas.',

    module3List3: 'Aplicativo de Entrega',
    module3List3_1: 'Prompt: Quero um aplicativo para gerenciar entregas e rastreamento em tempo real.',
    module3List3_2: 'Ação: A IA propõe um projeto de aplicativo móvel focado em logística e rastreamento de entregas.',

    module3List4: 'Sistema Financeiro.',
    module3List4_1: 'Prompt: Necessito de um sistema para gerenciar as finanças da minha empresa, incluindo contas a pagar e receber.',
    module3List4_2: 'Ação: A IA inicia o desenvolvimento de um projeto que inclui módulos para contas a pagar, contas a receber, erelatórios financeiros.',

}

const message_en = {
    desc: 'Description',
    news: 'News',
    inDevelopment: 'In development...',
    details1: 'About this level',
    module1Title: 'Module L6 - Owner: Features',

    module1List1: 'Project Dashboard: Overview of all projects, their status, and relevant metrics.',
    module1List2: 'Application Usage Dashboard: Metrics related to app usage, such as the number of active users, conversion funnel, etc.',
    module1List3: 'Development Cost Dashboard: Financial information about the project’s development costs.',
    module1List4: 'Hosting Cost Dashboard: Costs associated with the application’s infrastructure and hosting.',

    module2Title: 'Usage Flow',
    module2List1: 'The user accesses the L6 module and views the dashboards.',
    module2List2: 'Uses one of the prompts to start a new project or functionality.',
    module2List3: 'Monitors metrics and costs through the dashboards.',

    module3Title: 'Examples of Prompts to Start Projects via AI',
    module3List1: 'Pharmacy System',
    module3List1_1: 'Prompt: I need a system to manage the inventory and sales of my pharmacy.',
    module3List1_2: 'Action: The AI starts creating a project focused on a pharmacy management system, including modules such as inventory control, sales, and supplier integration.',

    module3List2: 'Sales Website',
    module3List2_1: 'Prompt: I need a website for sales and funnel control.',
    module3List2_2: 'Action: The AI begins drafting an e-commerce website project with sales funnel management features.',

    module3List3: 'Delivery Application',
    module3List3_1: 'Prompt: I want an app to manage deliveries and real-time tracking.',
    module3List3_2: 'Action: The AI proposes a mobile application project focused on logistics and delivery tracking.',

    module3List4: 'Financial System',
    module3List4_1: 'Prompt: I need a system to manage my company’s finances, including accounts payable and receivable.',
    module3List4_2: 'Action: The AI begins developing a project that includes modules for accounts payable, accounts receivable, and financial reporting.',
};


type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('collab-start-l6-100554')
export class CollabStartL6100554 extends StateLitElement {

    private msg: MessageType = messages['en'];

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
        <section class="collab-codes-start">
            <div class="collab-codes-banner">
                <img id="serviceStartL6ImageBanner" src="./l3/_100529_/images/startl6.avif" height="250" width="800" alt="banner">
            </div>
            <div class="collab-codes-content">
                <details id="serviceStartL6DetailsAbout" open="open">
                    <summary>${this.msg.details1}</summary>
                    <div>
                        <h1>${this.msg.module1Title}</h1>
                        <div>
                            <h2>${this.msg.desc}</h2>
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
                                </ol>
                        </div>
                        </div>
                          <div class="separator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div>
                            <h3>${this.msg.module3Title}</h3>
                                <ol>
                                    <li>
                                        <span>${this.msg.module3List1}</span>
                                        <ul>
                                            <li>${this.msg.module3List1_1}</li>
                                            <li>${this.msg.module3List1_2}</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <span>${this.msg.module3List2}</span>
                                        <ul>
                                            <li>${this.msg.module3List2_1}</li>
                                            <li>${this.msg.module3List2_2}</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <span>${this.msg.module3List3}</span>
                                        <ul>
                                            <li>${this.msg.module3List3_1}</li>
                                            <li>${this.msg.module3List3_2}</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <span>${this.msg.module3List4}</span>
                                        <ul>
                                            <li>${this.msg.module3List4_1}</li>
                                            <li>${this.msg.module3List4_2}</li>
                                        </ul>
                                    </li>
                                </ol>
                        </div>
                </details>
                <details id="serviceStartL6DetailsNews" open="open">
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
