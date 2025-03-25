/// <mls shortName="collabConsoleL1" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';

@customElement('collab-console-l1-100554')
export class CollabConsoleL1100554 extends CollabLitElement {

    @query('#output') output: HTMLElement | undefined;
    @query('#inputBox') inputBox: HTMLInputElement | undefined;

    @property() file: string | undefined;


    //-----COMPOENENT-----------
    render() {
        return html`
        <div class="console">  
            <div class="header">Collab Server: ${this.file}</div>
            <div class="output" id="output"></div>
            <div class="input-area">
                <span class="prompt">$</span>
                <input type="text" autocomplete="off" @keydown="${this.onKeyDown}" class="input-box" id="inputBox" autofocus>
                <button @click="${this.execute}">&gt;</button>
            </div>
        </div>
        `;
    }

    //-------IMPLEMENTS----------

    private onKeyDown(event: KeyboardEvent) {
        console.info('a')
        if (event.key === "Enter") this.execute();
    }

    private execute() {

        if (!this.inputBox || !this.output) return;
        const command = this.inputBox.value.trim();
        this.inputBox.value = "";

        if (command) {
            this.output.innerHTML += `<div><span class="prompt">$</span> ${command}</div>`;

            try {
                let result = eval(command);
                this.output.innerHTML += `<div><span class="prompt">&lt;</span> ${result}</div>`;

            } catch (error: any) {
                this.output.innerHTML += `<div style="color: red;">Erro: ${error.message}</div>`;
            }
            this.output.scrollTop = this.output.scrollHeight;
        }
    }


}
