/// <mls shortName="ateste2" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
//import { CollabLitElement } from './_100554_/l2/collabLitElement';
//import { CollabLitElement } from './l2/collabLitElement'
// colocar no console: mls.modePreview = 'minimum'

const message_pt = {
    hello: 'Hello world!'
}

@customElement('ateste2-100554')
export class SimpleGreeting extends CollabLitElement {

    private pending: Record<string, any> = {};

    @property() frutas: string[] = [];
    @property() name: string = 'Roberto';

    firstUpdated() {
        this.configFetch();
    }

    handleConfirm(e: CustomEvent) {
        console.info(e.detail)
    }

    render() {
        return html`
        <div class="cls1">
            <button @click=${this.buscar}>Buscar</button>
            Frutas
            <ul>
                ${this.frutas.map((p) => html`<li>${p}</li>`)}
            </ul>
        </div>`;
    }

    buscar() {
        fetch("/produtos", {
            method: "GET",
            body: JSON.stringify({ user: "teste" })
        }).then(async res => {
            const json = await res.json();
            console.log("Resposta do servidor fake:", json);
            this.frutas = json.itens;
        });
    }


    configFetch() {


        if (!(top as any).previewL1) return;
        console.info('Setou');
        window.fetch = (url, options) => {
            return new Promise((resolve) => {
                const id: string = crypto.randomUUID();
                this.pending[id] = resolve;


                (top as any).previewL1.contentWindow.postMessage({
                    type: "fetch-request",
                    id,
                    url,
                    options
                }, "*");
            });
        };

        window.onmessage = (e) => {
            const data = e.data;
            if (data.type !== "fetch-response") return;

            const resolve = this.pending[data.id];
            if (!resolve) return;
            delete this.pending[data.id];

            resolve(new Response(data.body, {
                status: data.status,
                headers: data.headers
            }));
        };
    }

}