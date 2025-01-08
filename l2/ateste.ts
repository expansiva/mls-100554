/// <mls shortName="ateste" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, LitElement,repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';
 

@customElement('ateste-100554')
export class SimpleGreeting extends LitElement {
    
    createRenderRoot() {
        return this;
    } 

        
    @property() tot: number = 10;
    @property() list: string[] = [];
    
    handleConfirm(e: CustomEvent) {
        console.info(e.detail)
    }

    connectedCallback() {
        super.connectedCallback();
        this.prepareList();
    }

    render() {

        return html`
        <ul>
            ${this.list.map((i) => html`<li>${i}</li>`)}
        </ul>
        `;
        
    }

    /*render() {

        return html`
        <ul>
            ${repeat(this.list, (
                (key: string) => key) as any,
                ((k: any, index: any) => { return html`<li>${k}</li>` }) as any)
            }
        </ul>
        `; 
        
    }*/

    private prepareList() {

        const newList = [];
        for (let i = 0; i < this.tot; i++){
            newList.push(i.toString());
        }

        this.list = newList;
        
    }




}
