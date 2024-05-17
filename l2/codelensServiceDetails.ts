/// <mls shortName="codelensServiceDetails" project="100554" enhancement="_100554_enhancementLit" groupName="internal" />


import { html, css, LitElement, unsafeHTML } from 'lit';
import { customElement } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';

export function initCodelensServiceDetails() {
    return true;
}

/// **collab_i18n_start**
const message_pt = {
    title: 'Detalhes do serviço',
    p1: 'Para que seu service esteja disponivel para uso, é preciso configurar corretamente o service details, assim definindo o nome, icone, posições, level entre outras definições.',
    icon: 'Icone',
    p2: 'Para definir o icone, você precisa primeiro escolher um que mais representa ao seu service, no <a href="https://fontawesome.com/icons" target="_blank">FontAwesome </a>. Após escolher, copie o seu unicode e preencha na propriedade icon.',
    example: 'Exemplo',
    state: 'Estado',
    p3: ' É possivel escolher entre o state <b>"foreground"</b> e <b>"background"</b>. No caso do foreground, o seu service será executado somente quando chamado em tela pelo usuário. No caso do background, seu service é instanciado, assim que inicia o level em que ele executa. ',
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
    p3: 'You can choose between the states <b>"foreground"</b> and <b>"background"</b>. In the case of foreground, your service will only be executed when called on screen by the user. In the case of background, your service is instantiated as soon as the level it executes on starts.',
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

@customElement('codelens-service-details-100554')
export class CodeLensServiceDetails100554 extends CollabLitElement {

    private msg: MessageType = messages['en'];
    
    static styles = css`[[mls_getDefaultDesignSystem]]`;

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
        <h1> ${this.msg.title} </h1>
        <p> ${this.msg.p1}
        </p>
        <h2>${this.msg.icon}</h2>
        <p> ${this.msg.p2} </p>
        <p>${this.msg.example}:</p>
        <div style="    border: 1px solid #c3c3c3;padding: 1rem;">
            <code>${unsafeHTML(this.textExampleIcon)}</code>
        </div>
        <h2>${this.msg.state}</h2>
        <p>${this.msg.p3}</p>
        <h2>${this.msg.example}:</h2>
        <div style="    border: 1px solid #c3c3c3;padding: 1rem;">
            <code>${unsafeHTML(this.textExampleNormal)}</code>
        </div>
        <h2>${this.msg.exampleCustom}</h2>
        <p>${this.msg.p4}</p>
        <div style="    border: 1px solid #c3c3c3;padding: 1rem;">
            <code>${unsafeHTML(this.textExampleCustom)}</code>
        </div>
        <h2>${this.msg.exampleLevel}</h2>
        <p>${this.msg.p5}</p>
        <div style="    border: 1px solid #c3c3c3;padding: 1rem;">
            <code>${unsafeHTML(this.textExampleCustomLevel)}</code>
        </div>
    
        
        `;
    }

    textExampleIcon = `
    public details: IService = {
        <br>
        &nbsp;&nbsp;icon: '&#x[seu unicode]',
        <br>
        &nbsp;&nbsp;...
        <br>
    }
    `
    textExampleNormal = `
    public details: IService = {
        <br>
        &nbsp;&nbsp;icon:'&#x[seu unicode]',
        <br>
        &nbsp;&nbsp;state: 'background',
        <br>
        &nbsp;&nbsp;tooltip: 'My service',
        <br>
        &nbsp;&nbsp;visible: true,
        <br>
        &nbsp;&nbsp;position: "right",
        <br>
        &nbsp;&nbsp;level: [3]
        <br>
    }
    `

    textExampleCustom = `
    public details: IService = {
        <br>
        &nbsp;&nbsp;icon:'&#x[seu unicode]',
        <br>
        &nbsp;&nbsp;state: 'background',
        <br>
        &nbsp;&nbsp;tooltip: 'My service',
        <br>
        &nbsp;&nbsp;visible: true,
        <br>
        &nbsp;&nbsp;position: "all",
        <br>
        &nbsp;&nbsp;level: [4,5]
        <br>
        &nbsp;&nbsp;customConfiguration: {
            <br>
            &nbsp;&nbsp&nbsp;&nbsp4: {
                <br>
                &nbsp;&nbsp&nbsp;&nbsp&nbsp;&nbspleft: {
                    <br>
                    &nbsp;&nbsp&nbsp;&nbsp&nbsp;&nbsp&nbsp;&nbsptooltip: 'My title 1'
                    <br>
                &nbsp;&nbsp&nbsp;&nbsp&nbsp;&nbsp},
                <br>
                &nbsp;&nbsp&nbsp;&nbsp&nbsp;&nbspright: {
                    <br>
                    &nbsp;&nbsp&nbsp;&nbsp&nbsp;&nbsp&nbsp;&nbspshow: false
                    <br>
                &nbsp;&nbsp&nbsp;&nbsp&nbsp;&nbsp}
                <br>
            &nbsp;&nbsp&nbsp;&nbsp},
            <br>
            &nbsp;&nbsp&nbsp;&nbsp5: {
                <br>
                &nbsp;&nbsp&nbsp;&nbsp&nbsp;&nbspright: {
                    <br>
                    &nbsp;&nbsp&nbsp;&nbsp&nbsp;&nbsp&nbsp;&nbsptooltip: 'My title 2',
                    <br>
                    &nbsp;&nbsp&nbsp;&nbsp&nbsp;&nbsp&nbsp;&nbspclassname: 'separator-left'
                    <br>
                &nbsp;&nbsp&nbsp;&nbsp&nbsp;&nbsp}
                <br>
            &nbsp;&nbsp&nbsp;&nbsp}
            <br>
        &nbsp;&nbsp}
        <br>
    }
    `

    textExampleCustomLevel = `
    public details: IService = {
        <br>
        &nbsp;&nbsp;icon:'&#x[seu unicode]',
        <br>
        &nbsp;&nbsp;state: 'background',
        <br>
        &nbsp;&nbsp;tooltip: 'My service',
        <br>
        &nbsp;&nbsp;visible: true,
        <br>
        &nbsp;&nbsp;position: "all",
        <br>
        &nbsp;&nbsp;level: [3,4,5]
        <br>
        &nbsp;&nbsp;&nbsp;&nbsp;customConfiguration: {
            <br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4: {
                <br>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tooltip: 'My service title left and right'
                  <br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}
            <br>
        &nbsp;&nbsp;&nbsp;&nbsp;}
        <br>
    }
    `
}
