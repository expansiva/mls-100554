/// <mls shortName="bteste" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement'

@customElement('bteste-100554')
export class MeuTeste extends CollabLitElement {
    
    createRenderRoot() {
        return this;
    }

        
    @property() name: string = new Date(Date.now()).toString();
    
    handleConfirm(e: CustomEvent) {
        console.info(e.detail, 'no handleConfirm');
    }

    private texto() {
        return `
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus varius nec neque eu dictum. Nulla at tincidunt purus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce aliquam eros vitae condimentum posuere. Mauris at fermentum nisl. Integer consectetur placerat ligula, a pretium mauris accumsan eu. Fusce justo est, semper vel iaculis ac, lobortis nec ante. Nullam posuere ac magna non ultrices. Sed tempus ex at blandit rutrum. Pellentesque sit amet facilisis nulla. Maecenas eget nisi sed ligula dictum porta non sed nisi. Cras semper felis ac erat finibus hendrerit.

        Pellentesque orci nisi, viverra eget massa vel, cursus sodales lacus. Suspendisse sagittis est at vehicula mollis. Duis malesuada placerat nulla a placerat. Sed pharetra, libero vitae facilisis porta, neque justo fermentum nulla, tincidunt scelerisque massa quam ac ligula. Vivamus facilisis est arcu, quis feugiat arcu eleifend eu. Donec a hendrerit tellus, a lobortis libero. Mauris sit amet arcu sit amet sapien imperdiet imperdiet nec id ipsum.

        Duis pulvinar, nunc sed tincidunt sodales, lectus mi lobortis justo, sed tempor arcu odio in magna. Etiam quis odio ullamcorper mi ullamcorper finibus ac nec magna. Integer lectus dolor, dignissim vel pellentesque id, porttitor sit amet libero. Vestibulum metus ante, dapibus sed posuere varius, ornare quis sapien. Duis imperdiet fringilla ex sed efficitur. Mauris posuere lectus leo, et congue sem euismod at. Duis tincidunt turpis neque. Nam volutpat velit malesuada mauris sollicitudin, et congue dolor gravida. Nulla porta ut libero a accumsan. Aenean at cursus ex. Nulla pulvinar enim aliquam, varius nisl at, pellentesque justo.
        `;
    }
    render() {

        return html`<div class="cls1"><h1>Página do Lucas</h1><button id="btn1">clique aqui</button><p id="pg1">${this.texto()}</p></div>`;
        
    }


}
