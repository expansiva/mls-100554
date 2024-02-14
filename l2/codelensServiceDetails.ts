/// <mls shortName="codelensServiceDetails" project="100554" enhancement="_100554_enhancementLit" groupName="internal" />


import { html, css, LitElement, unsafeHTML } from 'lit';
import { customElement } from 'lit/decorators.js';

export function initCodelensServiceDetails() {
    return true;
}

@customElement('codelens-service-details-100554')
export class CodeLensServiceDetails100554 extends LitElement {

    static styles = css`[[mls_getDefaultDesignSystem]]`;

    render() {
        return html`
        <h1> Service Details </h1>
        <p> Para que seu service esteja disponivel para uso, é preciso configurar corretamente o service details, assim definindo o nome, icone, posições, level entre outras definições.
        </p>
        <h2>Icone</h2>
        <p> Para definir o icone, você precisa primeiro escolher um que mais representa ao seu service, no 
            <a href="https://fontawesome.com/icons" target="_blank">FontAwesome </a>. Após escolher, copie o seu unicode e preencha na propriedade icon.
        </p>
        <p>Exemplo:</p>
        <div style="    border: 1px solid #c3c3c3;padding: 1rem;">
            <code>${unsafeHTML(this.textExampleIcon)}</code>
        </div>
        <h2>State</h2>
        <p> É possivel escolher entre o state <b>"foreground"</b> e <b>"background"</b>. No caso do foreground, o seu service será executado somente quando chamado em tela pelo usuário. No caso do background, seu service é instanciado, assim que inicia o level em que ele executa.
        </p>
        <h2>Exemplo:</h2>
        <div style="    border: 1px solid #c3c3c3;padding: 1rem;">
            <code>${unsafeHTML(this.textExampleNormal)}</code>
        </div>
        <h2>Exemplo Custom by position:</h2>
        <p>Também é possivel customizar, determinadas propriedades para cada level/position</p>
        <div style="    border: 1px solid #c3c3c3;padding: 1rem;">
            <code>${unsafeHTML(this.textExampleCustom)}</code>
        </div>
        <h2>Exemplo Custom by level :</h2>
        <p>Também é possivel customizar, determinadas propriedades para cada level, nesse caso as configurações serão aplicadas tanto para a posição left e right</p>
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
