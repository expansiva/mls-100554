/// <mls shortName="pageTestClient" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
import { BECollabClient } from './_100554_beCollabClient';

@customElement('page-test-client-100554')
export class PageTestClient2100554 extends CollabLitElement {

    @query('#resposta') resposta: HTMLElement | undefined;

    private client = new BECollabClient();

    render() {
        return html`
            <button @click="${this.clickPost}">Post</button>
            <div id="resposta" style="margin-top:10px"></div>
        `;
    }

    private async clickPost() {

        if (!this.resposta) return;

        try {
            this.clearLog();
            this.resposta.innerHTML = 'aguardando resposta...';
            let ret = await this.client.request("/api/test", "POST", { user: "Guilherme" }) as string;
            if (typeof ret === 'object') ret = JSON.stringify(ret);
            this.resposta.innerHTML = ret;

        } catch (e: any) {
            this.errorLog(e.message);
        }

    }

    private clearLog() {
        if (!this.resposta) return;
        this.resposta.style.color = '';
        this.resposta.innerHTML = '';
    }

    private errorLog(msg:string) {
        if (!this.resposta) return;
        this.resposta.style.color = 'red';
        this.resposta.innerHTML = msg;
    }

}