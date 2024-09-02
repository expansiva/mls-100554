/// <mls shortName="wcdMenuItemImage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement} from 'lit/decorators.js';
import { WcdToolboxItemBase } from './_100554_wcdToolboxItemBase';

@customElement('wcd-menu-item-image-100554')
export class WcdAdd100554 extends WcdToolboxItemBase {

    public args: string | undefined;
    
    //---------------COMPONENT----------------

    render() {

        switch(this.args) {
            case ('big'):
                return this.renderBig();
            default:
                return html`Invalid args`
        }
    }

    renderBig() {

        this.onclick = (e) => this.clickBig();
        return html`
            A
        `
    }

    //---------------IMPLEMENTS----------------

    clickBig() {
        console.info('clicou em big');
    }

}