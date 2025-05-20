/// <mls shortName="wcImage" project="100554" enhancement="_100554_enhancementLit" groupName="_100554_IcaApresentationImagesImages" />

import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';

@customElement('wc-image-100554')
export class WcImage100554 extends StateLitElement {

    @property() src: string | undefined; 
    @property() alt: string | undefined;
    @property() width: string | undefined;
    @property() height: string | undefined;
    
    render() {
        return html`
            <div class="image-container">
                    <img
                        src="${this.src}" 
                        alt="${this.alt || ''}" 
                        width="${this.width || 'auto'}"
                        height="${this.height || 'auto'}
                    "></img>                
            </div>
    `;
    }

}
