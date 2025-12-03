/// <mls shortName="pluginCodelensCustomElement" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';
import '/_100554_/l2/widgetTextCode.js';

/// **collab_i18n_start**
const message_pt = {
    p1: 'É um recurso poderoso fornecido pelo Lit, uma biblioteca JavaScript para construir interfaces de usuário web eficientes e reativas. É usado para definir e registrar elementos personalizados com a API customElements do navegador. Elementos personalizados permitem que você crie componentes reutilizáveis e autocontidos que podem ser usados como elementos HTML padrão dentro de sua aplicação web.  Uso Para criar um elemento personalizado usando o decorador @customElement no Lit, você precisa definir uma classe que estende LitElement, a classe base fornecida pelo Lit. Esta classe encapsulará o comportamento, a renderização e a lógica de atualização para o seu elemento personalizado.',
    usage: 'Uso',
    p2: 'O decorador @customElement registra automaticamente seu elemento personalizado com a API customElements do navegador usando o nome da tag especificado. No exemplo acima, o elemento personalizado é registrado com o nome da tag "my-custom-element". Isso permite que você use o elemento personalizado como se fosse um elemento HTML padrão dentro de sua aplicação.'
}

const message_en = {
    p1: 'Is a powerful feature provided by Lit, a JavaScript library for building efficient and reactive web user interfaces. It is used to define and register custom elements with the browsers customElements API. Custom elements allow you to create reusable and self-contained components that can be used like standard HTML elements within your web application.  Usage To create a custom element using the @customElement decorator in Lit, you need to define a class that extends LitElement, the base class provided by Lit. This class will encapsulate the behavior, rendering, and updating logic for your custom element.',
    usage: 'Usage',
    p2: 'The @customElement decorator automatically registers your custom element with the browsers customElements API using the specified tag name. In the example above, the custom element is registered with the tag name "my-custom-element". This allows you to use the custom element as if it were a standard HTML element within your application.'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('plugin-codelens-custom-element-100554')
export class PluginCodelensCustomElement extends CollabLitElement {

    private msg: MessageType = messages['en'];
    
    textCode2= `
import { customElement, LitElement, html } from 'lit';
@customElement('my-custom-element')
class MyCustomElement extends LitElement {

    [...]
    
}
    `
    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
            <h1> @customElement</h1>
            <p> ${this.msg.p1}</p>
            <hr>
            <h2>${this.msg.usage}:</h2>
            <widget-text-code-100554
                text=${this.textCode2}
                language="typescript">
            </widget-text-code-100554>
            <div>
                <p>${this.msg.p2}</p>
            </div>
            <hr>

            <a href="https://lit.dev/docs/components/overview/" target="_blank" data-mlsline="12">see more</a>
        `;
    }

}