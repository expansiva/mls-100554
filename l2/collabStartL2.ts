/// <mls fileReference="_100554_/l2/collabStartL2.ts" enhancement="_100554_enhancementLit" />

import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';

/// **collab_i18n_start**
const message_pt = {
    desc: 'Descrição',
    news: 'Novidades',
    inDevelopment: 'Em desenvolvimento...',
    details1: 'Sobre esse level',
    module1Title: 'Módulo L2 - Components: Descrição e Funcionalidades',
    module1Text: 'O módulo L2 é destinado ao programador front-end responsável por desenvolver os componentes visuais e de gerenciamento que serão utilizados nas páginas do projeto. Este módulo também envolve a documentação, teste e gerenciamento de dependências dos componentes.',
    module1List1: 'Programar Componentes Visuais',
    module1List1_1: 'Permite criar componentes visuais, como botões, cards e formulários, que serão incluídos nas páginas do projeto.',
    module1List2: 'Documentação e Descrição',
    module1List2_1: 'Espaço para documentar o componente, descrevendo suas funcionalidades, casos de uso e como integrá-lo ao projeto.',
    module1List3: 'Testar em Vários Dispositivos e Tamanhos de Tela',
    module1List3_1: 'Ferramentas para testar o componente em diferentes dispositivos e tamanhos de tela, garantindo a responsividade.',
    module1List4: 'Incluir Dependências do Componente',
    module1List4_1: 'Permite especificar e gerenciar as dependências necessárias para o funcionamento do componente, incluindo aquelas específicas para determinados dispositivos.',
    module1List5: 'Programar Componentes Internos do Collab.codes',
    module1List5_1: 'Desenvolvimento de componentes específicos para o gerenciamento e operação da plataforma Collab.codes, sejam eles visuais ou de backend.',

}

const message_en = {
    desc: 'Description',
    news: 'News',
    inDevelopment: 'In development...',
    details1: 'About this level',
    module1Title: 'Module L2 - Components: Description and Features',
    module1Text: 'The L2 module is aimed at front-end developers responsible for creating the visual and management components used in project pages. This module also includes component documentation, testing, and dependency management.',
    module1List1: 'Program Visual Components',
    module1List1_1: 'Enables the creation of visual components, such as buttons, cards, and forms, to be included in project pages.',
    module1List2: 'Documentation and Description',
    module1List2_1: 'A space to document the component, describing its features, use cases, and how to integrate it into the project.',
    module1List3: 'Test Across Devices and Screen Sizes',
    module1List3_1: 'Tools to test the component on various devices and screen sizes, ensuring responsiveness.',
    module1List4: 'Include Component Dependencies',
    module1List4_1: 'Allows specifying and managing the dependencies required for the component to function, including those specific to certain devices.',
    module1List5: 'Program Internal Components for Collab.codes',
    module1List5_1: 'Development of components specific to the management and operation of the Collab.codes platform, whether visual or backend.',
};



type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('collab-start-l2-100554')
export class CollabStartL2100554 extends StateLitElement {

    private msg: MessageType = messages['en'];

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
        <section class="collab-codes-start">
            <div class="collab-codes-banner">
                <img id="serviceStartL2ImageBanner" src="./l3/_100529_/images/startl2.avif" height="250" width="800" alt="banner">
            </div>
            <div class="collab-codes-content">
                <details id="serviceStartL2DetailsAbout" open="open">
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
                                </ol>

                            </span>
                        </div>
                    </div>
                </details>
                <details id="serviceStartL2DetailsNews" open="open">
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
