/// <mls fileReference="_100554_/l2/collabStartL3.ts" enhancement="_100554_enhancementLit" />

import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';

/// **collab_i18n_start**
const message_pt = {
    desc: 'Descrição',
    news: 'Novidades',
    inDevelopment: 'Em desenvolvimento...',
    details1: 'Sobre esse level',
    module1Title: 'Módulo L3 - Design System: Descrição e Funcionalidades',
    module1Text: 'O módulo L3 é voltado para o usuário responsável por estabelecer e manter o sistema de design do projeto. Este módulo permite a seleção e personalização de componentes de interface, bem como a documentação de regras e boas práticas.',
    module1List1: 'Selecionar Componentes de Interface (Widgets): permite escolher widgets e componentes de interface que serão usados nas páginas do projeto.',

    module1List2: 'Selecionar ou Criar Interfaces de Componentes e Páginas (CSS):oferece a opção de utilizar estilos CSS pré-definidos ou criar novos, de acordo com as necessidades específicas do projeto.',
    module1List3: 'Selecionar Ícones e Imagens: permite escolher ícones e imagens que se alinham com a estética e os objetivos do projeto.',
    module1List4: 'Editar Documentação do Projeto: espaço para documentar regras de design, boas práticas e outros guidelines que devem ser seguidos pela equipe.',
    module1List5: 'Ajustar Layout e visual da Página: espaço para o Designer deixar a página de uma forma agradável para o usuário.',

    module2Title: 'Fluxo de Uso',
    module2List1: 'O usuário começa selecionando os componentes de interface que serão utilizados nas páginas.',
    module2List2: 'Em seguida, ajusta ou cria novos estilos CSS para esses componentes e para as páginas em geral.',
    module2List3: 'Seleciona ícones e imagens que complementam o design.',
    module2List4: 'Finaliza documentando as escolhas de design, regras e boas práticas para garantir consistência ao longo do projeto.',

    moduleExplain: 'O módulo L3 é fundamental para garantir que o projeto tenha uma aparência e sensação consistentes, alinhadas com a visão de negócios e as expectativas do usuário. Ele serve como um guia para todos os outros membros da equipe sobre como os elementos de design devem ser implementados e utilizados.',
}

const message_en = {
    desc: 'Description',
    news: 'News',
    inDevelopment: 'In development...',
    details1: 'About this level',
    module1Title: 'Module L3 - Design System: Description and Features',
    module1Text: 'The L3 module is designed for users responsible for establishing and maintaining the project’s design system. This module allows the selection and customization of interface components, as well as the documentation of rules and best practices.',
    module1List1: 'Select Interface Components (Widgets): Enables the selection of widgets and interface components to be used on project pages.',

    module1List2: 'Select or Create Component and Page Interfaces (CSS): Offers the option to use predefined CSS styles or create new ones to meet specific project needs.',
    module1List3: 'Select Icons and Images: Allows the selection of icons and images that align with the project’s aesthetics and goals.',
    module1List4: 'Edit Project Documentation: Provides space to document design rules, best practices, and other guidelines for the team to follow.',
    module1List5: 'Adjust Page Layout and Visuals: Provides space for designers to create a user-friendly and visually appealing page.',

    module2Title: 'Usage Flow',
    module2List1: 'The user begins by selecting the interface components to be used on the pages.',
    module2List2: 'Next, they adjust or create new CSS styles for these components and the pages overall.',
    module2List3: 'Selects icons and images that complement the design.',
    module2List4: 'Finally, they document the design choices, rules, and best practices to ensure consistency throughout the project.',

    moduleExplain: 'The L3 module is crucial for ensuring the project has a consistent look and feel aligned with the business vision and user expectations. It serves as a guide for all team members on how design elements should be implemented and utilized.',
};


type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('collab-start-l3-100554')
export class CollabStartL3100554 extends StateLitElement {

    private msg: MessageType = messages['en'];

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
        <section class="collab-codes-start">
            <div class="collab-codes-banner">
                <img id="serviceStartL3ImageBanner" src="./l3/_100529_/images/startl3.avif" height="250" width="800" alt="banner">
            </div>
            <div class="collab-codes-content">
                <details id="serviceStartL3DetailsAbout" open="open">
                    <summary>${this.msg.details1}</summary>
                    <div>
                        <h1>${this.msg.module1Title}</h1>
                        <div>
                            <h2>${this.msg.desc}</h2>
                            <span>${this.msg.module1Text}

                                <ol>
                                    <li>
                                        <span>${this.msg.module1List1}</span>
                                    </li>
                                    <li>
                                        <span>${this.msg.module1List2}</span>
                                    </li>
                                    <li>
                                        <span>${this.msg.module1List3}</span>
                                    </li>
                                    <li>
                                        <span>${this.msg.module1List4}</span>
                                    </li>
                                    <li>
                                        <span>${this.msg.module1List5}</span>
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
                <details id="serviceStartL3DetailsNews" open="open">
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
