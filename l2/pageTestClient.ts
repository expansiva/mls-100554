/// <mls shortName="pageTestClient" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import { html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
import { BECollabClient } from './_100554_beCollabClient';

@customElement('page-test-client-100554')
export class PageTestClient2100554 extends CollabLitElement {

    @query('#resposta') resposta: HTMLElement | undefined;
    @query('#body') body: HTMLInputElement | undefined;

    private client = new BECollabClient();

    render() {
        return html`
            <div style="margin-bottom:5px">
                <label>Body requisição</label>
                <input id="body" style="width:99%;padding:3px;outline:none"></input>
            </div>
            <button @click="${this.clickPost}">Post</button>
            <button @click="${this.clickPut}">Put</button>
            <button @click="${this.clickGet}">Get</button>
            <button @click="${this.clickDel}">Del</button>
            <div id="resposta" style="margin-top:10px; border:1px solid gray; padding:1rem"></div>
        `;
    }

    //{"nome":"GUILHERME", "senha":"123"}
    private async clickPost() {

        if (!this.resposta || !this.body) return;

        try {
            this.clearLog();
            this.resposta.innerHTML = 'aguardando resposta...';
            const bd = JSON.parse(this.body.value);
            let ret = await this.client.request("/api/user", "POST", bd) as string;
            if (typeof ret === 'object') ret = JSON.stringify(ret);
            this.resposta.innerHTML = ret;

        } catch (e: any) {
            this.errorLog(e.message);
        }

    }

    //{"id":1, "nome":"GUILHERME", "senha":"123"}
    private async clickPut() {

        if (!this.resposta || !this.body) return;

        try {
            this.clearLog();
            this.resposta.innerHTML = 'aguardando resposta...';
            const bd = JSON.parse(this.body.value);
            let ret = await this.client.request("/api/user", "PUT", bd) as string;
            if (typeof ret === 'object') ret = JSON.stringify(ret);
            this.resposta.innerHTML = ret;

        } catch (e: any) {
            this.errorLog(e.message);
        }

    }

    private async clickGet() {

        if (!this.resposta || !this.body) return;

        try {
            this.clearLog();
            this.resposta.innerHTML = 'aguardando resposta...';
            let ret = await this.client.request("/api/user", "GET", this.body.value) as string;
            if (typeof ret === 'object') ret = JSON.stringify(ret);
            this.resposta.innerHTML = ret;

        } catch (e: any) {
            this.errorLog(e.message);
        }

    }

    private async clickDel() {

        if (!this.resposta || !this.body) return;

        try {
            this.clearLog();
            this.resposta.innerHTML = 'aguardando resposta...';
            let ret = await this.client.request("/api/user", "DELETE", this.body.value) as string;
            if (typeof ret === 'object') ret = JSON.stringify(ret);
            this.resposta.innerHTML = ret;

        } catch (e: any) {
            this.errorLog(e.message);
        }

    }

    private clearLog() {
        if (!this.resposta || !this.body) return;
        this.resposta.style.color = '';
        this.resposta.innerHTML = '';
    }

    private errorLog(msg:string) {
        if (!this.resposta) return;
        this.resposta.style.color = 'red';
        this.resposta.innerHTML = msg;
    }

}