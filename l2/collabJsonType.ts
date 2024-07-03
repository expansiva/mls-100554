/// <mls shortName="collabJsonType" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, LitElement, repeat } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('collab-json-type-100554')
export class CollabFCATree extends LitElement {

    @property() json: any;
    @property() jsonInfo: any ;

    //-------- COMPONENT --------------
    connectedCallback() {
        super.connectedCallback();
        this.init();
    }

    createRenderRoot() {
        return this;
    }

    render() {
        if (!this.jsonInfo) {
            return html`Not json`
        } else {
            return html`${this.renderJson()}`
        }
        
    }

    renderJson() {
        return html`
        <ul>
        ${repeat(this.jsonInfo, ((key: any, idx: number) => key.field + idx) as any, ((item: any, index: any) => {

            return this.renderItem(item, index);

        }) as any
        )}</ul>`
    }

    renderItem(item:any, idx:number) {
        return html`<li>
            field:${item.field}, type:${item.type}
            <ul>
                ${repeat(item.children, ((key: any, idx2: number) => key.field + idx2) as any, ((item2: any, index: any) => {

                    return this.renderItem(item2, index);

                    }) as any
                )}
            </ul>
        </li>`
    }


    //-------- IMPLEMENTATION --------------

    private init() {

        this.json = this.exemploUsuario;   
        this.jsonInfo = this.generateJsonFromInterface(this.json); 
        console.info(this.jsonInfo)
    }

    private generateJsonFromInterface(obj: any): any[] {
        const result: any[] = [];

        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                const field: any = { field: key };

                if (Array.isArray(value)) {
                    field.type = 'array';
                    if (value.length > 0 && typeof value[0] === 'object') {
                        field.children = this.generateJsonFromInterface(value[0]);
                    } else {
                        field.children = [{field:"arrayItem", type: typeof value[0], children: []}] 
                    }
                } else if (typeof value === 'object') {
                    field.type = 'object';
                    field.children = this.generateJsonFromInterface(value);
                } else {
                    field.type = typeof value;
                    field.children = []
                }

                result.push(field);
            }
        }

        return result;
    }

    private exemploUsuario = {
        nome: "Marcos",
        idade: 55,
        filhos: [{ nome: "João" }],
        animals: ["gato"],
        parentes:[1]
    };

}