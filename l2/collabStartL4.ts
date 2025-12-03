/// <mls shortName="collabStartL4" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';

/// **collab_i18n_start**
const message_pt = {
    desc: 'Descrição',
    news: 'Novidades',
    inDevelopment: 'Em desenvolvimento...',
    details1: 'Sobre esse level',
    module1Title: 'Módulo L4 - Business: Descrição e Funcionalidades',
    module1Text: 'O módulo L4 é voltado para o usuário responsável por entender do negócio e montar as páginas do projeto. Ele serve como uma ponte entre a visão do negócio e a implementação técnica, permitindo que o usuário crie, teste e publique páginas de forma eficiente.',
    module1List1: 'Desenhar Página no Modo Wireframe',
    module1List1_1: 'Permite criar o layout inicial da página em modo wireframe, que pode ser adaptado para vários dispositivos (desktop, mobile, tablet), e também permite criar várias variações , com ideias para serem apresentadas e aprovadas.',
    module1List2: 'Usar Design System (UI)',
    module1List2_1: 'Oferece a opção de utilizar elementos do Design System existente ou solicitar alterações que serão tratadas no módulo L3.',
    module1List3: 'Usar Componentes',
    module1List3_1: 'Permite utilizar componentes prontos disponíveis no sistema ou solicitar a inclusão de novos componentes, que serão desenvolvidos no módulo L2.Mostra uma lista de todas as pessoas envolvidas no projeto e métricas sobre sua colaboração, como tarefas concluídas, horas trabalhadas, etc.',
    module1List4: 'Usar Funcionalidades de Back-End',
    module1List4_1: 'Oferece a opção de utilizar APIs prontas ou solicitar a inclusão de novas funcionalidades que serão desenvolvidas no módulo L1.',
    module1List5: 'Programar funcionalidades da Página',
    module1List5_1: 'Permite ao Analista Business ou Programador Web ou Programador Back-end, implementar as funcionalidades da página.',
    module1List6: 'Testar e Liberar para Homologação/Publish',
    module1List6_1: 'Permite testar as páginas criadas e, uma vez aprovadas, liberá-las para a fase de homologação ou publicação direta.',

    module2Title: 'Fluxo de Uso',
    module2List1: 'O usuário inicia criando o layout da página em modo wireframe, ajustando para diferentes dispositivos.',
    module2List2: 'Seleciona elementos do Design System ou solicita alterações para adequar à estética do projeto.',
    module2List3: 'Incorpora componentes prontos ou solicita novos, conforme a necessidade.',
    module2List4: 'Integra APIs prontas ou solicita novas funcionalidades de back-end.',
    module2List5: 'Realiza testes e, se tudo estiver conforme o esperado, libera a página para homologação ou publicação.',

    module3Title: 'Exemplos de Prompts para Iniciar Projetos via IA',
    module3List1: 'Prompt: Preciso de um painel de administração para gerenciar usuários e conteúdo.',
    module3List2: 'Prompt: Quero uma página de checkout otimizada para conversão, com opções de pagamento múltiplo.',
    module3List3: 'Prompt: Necessito de uma interface de usuário para visualizar relatórios e métricas em tempo real.',
    module3List4: 'Prompt: Gostaria de criar uma página de perfil de usuário com opções para editar informações pessoais.',
    module3List5: 'Prompt: Preciso de uma página de FAQ interativa para ajudar os usuários a encontrar respostas rapidamente.',


    moduleExplain: 'O módulo L4 é essencial para transformar ideias de negócio em realidade, fornecendo as ferramentas necessárias para criar, ajustar e publicar páginas de forma ágil e alinhada com os objetivos do projeto.',
}

const message_en = {
    desc: 'Description',
    news: 'News',
    inDevelopment: 'In development...',
    details1: 'About this level',
    module1Title: 'Module L4 - Business: Description and Features',
    module1Text: 'The L4 module is designed for users responsible for understanding the business and assembling project pages. It acts as a bridge between business vision and technical implementation, enabling users to create, test, and publish pages efficiently.',
    module1List1: 'Design Page in Wireframe Mode',
    module1List1_1: 'Allows the creation of an initial page layout in wireframe mode, adaptable to various devices (desktop, mobile, tablet) and supports multiple variations for presentation and approval.',
    module1List2: 'Use Design System (UI)',
    module1List2_1: 'Provides the option to use existing Design System elements or request changes handled in module L3.',
    module1List3: 'Use Components',
    module1List3_1: 'Enables the use of ready-made components available in the system or requests for new ones to be developed in module L2. Displays a list of all project collaborators and metrics on their contributions, such as completed tasks and hours worked.',
    module1List4: 'Use Back-End Features',
    module1List4_1: 'Provides the option to use ready-made APIs or request the addition of new features to be developed in module L1.',
    module1List5: 'Program Page Features',
    module1List5_1: 'Allows a Business Analyst, Web Developer, or Back-End Programmer to implement page functionalities.',
    module1List6: 'Test and Release for Approval/Publish',
    module1List6_1: 'Allows testing of created pages and, once approved, releasing them for the approval phase or direct publication.',

    module2Title: 'Usage Flow',
    module2List1: 'The user starts by creating the page layout in wireframe mode, adjusting for different devices.',
    module2List2: 'Selects Design System elements or requests changes to match the project’s aesthetics.',
    module2List3: 'Incorporates ready-made components or requests new ones as needed.',
    module2List4: 'Integrates ready-made APIs or requests new back-end features.',
    module2List5: 'Performs tests and, if everything is as expected, releases the page for approval or publication.',

    module3Title: 'Prompt Examples to Start Projects via AI',
    module3List1: 'Prompt: I need an admin panel to manage users and content.',
    module3List2: 'Prompt: I want a checkout page optimized for conversion with multiple payment options.',
    module3List3: 'Prompt: I need a user interface to view reports and metrics in real-time.',
    module3List4: 'Prompt: I’d like to create a user profile page with options to edit personal information.',
    module3List5: 'Prompt: I need an interactive FAQ page to help users find answers quickly.',

    moduleExplain: 'The L4 module is essential for turning business ideas into reality, providing the tools necessary to create, adjust, and publish pages quickly and aligned with project goals.',
};

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('collab-start-l4-100554')
export class CollabStartL4100554 extends StateLitElement {

    private msg: MessageType = messages['en'];

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
        <section class="collab-codes-start">
            <div class="collab-codes-banner">
                <img id="serviceStartL4ImageBanner" src="./l3/_100529_/images/startl4.avif" height="250" width="800" alt="banner">
            </div>
            <div class="collab-codes-content">
                <details id="serviceStartL4DetailsAbout" open="open">
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
                                    <li>
                                        <span>${this.msg.module1List4}</span>
                                        <ul>
                                            <li>${this.msg.module1List4_1}</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <span>${this.msg.module1List5}</span>
                                        <ul>
                                            <li>${this.msg.module1List5_1}</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <span>${this.msg.module1List6}</span>
                                        <ul>
                                            <li>${this.msg.module1List6_1}</li>
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
                                <li>${this.msg.module2List5}</li>

                            </ol>
                        </div>
                          <div class="separator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div>
                            <h3>${this.msg.module3Title}</h3>
                            <ol>
                                <li>${this.msg.module3List1}</li>
                                <li>${this.msg.module3List2}</li>
                                <li>${this.msg.module3List3}</li>
                                <li>${this.msg.module3List4}</li>
                            </ol>
                            <span>${this.msg.moduleExplain}</span>
                        </div>
                    </div>
                </details>
                <details id="serviceStartL4DetailsNews" open="open">
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
