/// <mls fileReference="_100554_/l2/collabConsoleL1.ts" enhancement="_100554_enhancementLit" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';

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

    private async execute() {
        if (!this.inputBox || !this.output) return;

        let command = this.inputBox.value.trim();
        this.inputBox.value = "";

        if (!command) return;

        this.output.innerHTML += `<div><span class="prompt">$</span> ${command}</div>`;

        try {
            if (!(window as any).consoleScope) (window as any).consoleScope = {};

            let result;

            // Função que executa async e com variáveis persistentes
            const runAsync = async (code: string, scope: any) => {
                const keys = Object.keys(scope);
                const values = Object.values(scope);

                const fn = new Function(...keys, `
                return (async () => {
                    return (${code});
                })();
            `);

                return fn(...values);
            };

            // Detecta let/const/var
            const isDeclaration = /^(let|const|var)\s+/.test(command);

            if (isDeclaration) {
                const match = command.match(/^(?:let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(.*)$/);

                if (!match) throw new Error("Declaração inválida");

                const varName = match[1];
                const expr = match[2];

                result = await runAsync(expr, (window as any).consoleScope);
                (window as any).consoleScope[varName] = result;

            } else {
                result = await runAsync(command, (window as any).consoleScope);
            }

            if (typeof result === 'object') result = JSON.stringify(result);

            if (result !== undefined)
                this.output.innerHTML += `<div><span class="prompt">&lt;</span> ${result}</div>`;

        } catch (error: any) {
            this.output.innerHTML += `<div style="color: red;">Erro: ${error.message}</div>`;
        }

        this.output.scrollTop = this.output.scrollHeight;
    }

    private configLog() {

        const originalLog = console.log;
        const originalInfo = console.info;

        const writeToConsole = (...args: any[]) => {
            if (!this.inputBox || !this.output) return;
            const message = args
                .map(arg => typeof arg === "object" ? JSON.stringify(arg) : String(arg))
                .join(" ");
            this.output.innerHTML += `<div><span class="prompt">&lt;</span> ${message}</div>`;
            this.output.scrollTop = this.output.scrollHeight;
        };

        console.log = (...args) => {
            writeToConsole(...args);
            originalLog.apply(console, args);
        };

        console.info = (...args) => {
            writeToConsole(...args);
            originalInfo.apply(console, args);
        };
    }

}
