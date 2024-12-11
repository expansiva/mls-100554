/// <mls shortName="dteste" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

 import { html, css } from 'lit'; 
 import { customElement, property } from 'lit/decorators.js';
 import { IcaLitElement } from './_100554_icaLitElement';

 @customElement('dteste-100554')
 export class Dteste100554 extends IcaLitElement {
    
     @property() title: string = 'Titulo';
     @property() body: string = 'Corpo';

     render() {
        return html`
        <section>
            <h2>${this.title}</h2>
            <p>${this.body}</p>
        </section>`;
         
     }
 }
