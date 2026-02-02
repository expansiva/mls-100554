/// <mls fileReference="_100554_/l2/pluginCodelensServiceDetails.ts" group="other" enhancement="_100554_enhancementLit" />

import { html, unsafeHTML, LitElement } from 'lit';
import { customElement, } from 'lit/decorators.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';

/// **collab_i18n_start**
const message_pt = {
    title: 'Detalhes do serviço',
    p1: 'Para que seu service esteja disponivel para uso, é preciso configurar corretamente o service details, assim definindo o nome, icone, posições, level entre outras definições.',
    icon: 'Icone',
    p2: 'Para definir o icone, você precisa primeiro escolher um que mais representa ao seu service, no <a href="https://fontawesome.com/icons" target="_blank">FontAwesome </a>. Após escolher, copie o seu unicode e preencha na propriedade icon.',
    example: 'Exemplo',
    state: 'Estado',
    p3: ' É possivel escolher entre o state "foreground" e "background". No caso do foreground, o seu service será executado somente quando chamado em tela pelo usuário. No caso do background, seu service é instanciado, assim que inicia o level em que ele executa. ',
    exampleCustom: 'Exemplo Personalizado por posição:',
    p4: 'Também é possivel customizar, determinadas propriedades para cada level/position',
    exampleLevel: 'Exemplo Personalizado por nível:',
    p5: 'Também é possivel customizar, determinadas propriedades para cada level, nesse caso as configurações serão aplicadas tanto para a posição left e right'
}

const message_en = {
    title: 'Service Details',
    p1: 'For your service to be available for use, it is necessary to properly configure the service details, thus defining the name, icon, positions, level, among other settings.',
    icon: 'Icon',
    p2: 'To set the icon, you first need to choose one that best represents your service, on <a href="https://fontawesome.com/icons" target="_blank">FontAwesome</a>. After choosing, copy its unicode and fill in the icon property.',
    example: 'Example',
    state: 'State',
    p3: 'You can choose between the states "foreground" and "background". In the case of foreground, your service will only be executed when called on screen by the user. In the case of background, your service is instantiated as soon as the level it executes on starts.',
    exampleCustom: 'Custom Example by Position:',
    p4: 'It is also possible to customize certain properties for each level/position.',
    exampleLevel: 'Custom Example by Level:',
    p5: 'It is also possible to customize certain properties for each level; in this case, the settings will be applied to both the left and right positions.'
}


type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('plugin-codelens-service-details-100554')
export class PluginCodelensServiceDetails extends CollabLitElement {

    private msg: MessageType = messages['en'];

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return html`
        <h1> ${this.msg.title} </h1>
        <p> ${this.msg.p1}</p>
        <h2>${this.msg.icon}</h2>
        <p> ${unsafeHTML(this.msg.p2)} </p>
        <p>${this.msg.example}:</p>
         <wc-code-100554
            text=${this.textExampleIcon}
            language="typescript">
        </wc-code-100554>

        <h2>${this.msg.state}</h2>
        <p>${this.msg.p3}</p>
        <h2>${this.msg.example}:</h2>
        <wc-code-100554
            text=${this.textExampleNormal}
            language="typescript">
        </wc-code-100554>
        
        <h2>${this.msg.exampleCustom}</h2>
        <p>${this.msg.p4}</p>
        <wc-code-100554
            text=${this.textExampleCustom}
            language="typescript">
        </wc-code-100554>
        
        <h2>${this.msg.exampleLevel}</h2>
        <p>${this.msg.p5}</p>
        <wc-code-100554
            text=${this.textExampleCustomLevel}
            language="typescript">
        </wc-code-100554>
    
        `
    }

    textExampleIcon = `public details: IService = {
    icon: '&#x[seu unicode]',
    ...
}
`
    textExampleNormal = `public details: IService = {
    icon:'&#x[seu unicode]',
    state: 'background',
    tooltip: 'My service',
    visible: true,
    position: "right",
    level: [3]
}
    `

    textExampleCustom = `public details: IService = {
    icon:'&#x[seu unicode]',
    state: 'background',
    tooltip: 'My service',
    visible: true,
    position: "all",
    level: [4,5]
    customConfiguration: {
        4: {
            left: {
                tooltip: 'My title 1'
            },
            right: {
                show: false
            }
        },

        5: {
            right: {
                tooltip: 'My title 2',
                classname: 'separator-left'
            }
        }
    }
}
`

    textExampleCustomLevel = `public details: IService = {
    icon:'&#x[seu unicode]',
    state: 'background',
    tooltip: 'My service',
    visible: true,
    position: "all",
    level: [3,4,5]
    customConfiguration: {
        4: {
            tooltip: 'My service title left and right'
    
        }
    }
}
`

}