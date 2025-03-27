/// <mls shortName="collabConsoleL1" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';

@customElement('collab-console-l1-100554')
export class CollabConsoleL1100554 extends CollabLitElement {

    @query('#output') output: HTMLElement | undefined;
    @query('#inputBox') inputBox: HTMLInputElement | undefined;

    @property() file: string | undefined;

    firstUpdated() {
        this.configLog();
    }

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
        if (event.key === "Enter") this.execute();
    }

    private execute() {

        if (!this.inputBox || !this.output) return;
        let command = this.inputBox.value.trim();
        this.inputBox.value = "";

        if (command) {
            this.output.innerHTML += `<div><span class="prompt">$</span> ${command}</div>`;

            try {
                if (!(window as any).consoleScope) (window as any).consoleScope = {};
                let result;
                if (command.startsWith("let ") || command.startsWith("const ") || command.startsWith("var ")) {

                    const varName = command.split(/\s+/)[1].split("=")[0].trim();
                    command = command.split("=")[1].trim();
                    const res = eval(command);
                    (window as any).consoleScope[varName] = res
                    result = res;

                } else result = new Function("with (window.consoleScope) { return " + command + "; }")();

                if (typeof result === 'object') result = JSON.stringify(result);
                this.output.innerHTML += `<div><span class="prompt">&lt;</span> ${result}</div>`;

            } catch (error: any) {
                this.output.innerHTML += `<div style="color: red;">Erro: ${error.message}</div>`;
            }
            this.output.scrollTop = this.output.scrollHeight;
        }
    }

    private configLog() {

        const originalLog = console.log;

        console.log =  (...args) => {

            if (!this.inputBox || !this.output) return;

            const message = args.map(arg => typeof arg === "object" ? JSON.stringify(arg) : arg).join(" ");

            this.output.innerHTML += `<div><span class="prompt">&lt;</span> ${message}</div>`;
            originalLog.apply(console, args);
        };
    }

}
