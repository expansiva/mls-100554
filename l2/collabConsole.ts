/// <mls shortName="collabConsole" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { IcaLitElement } from './_100554_icaLitElement';

@customElement('collab-console-100554')
export class CollabConsole100554 extends IcaLitElement {

    @state() logs: Array<{ type: string; message: string }> = [];
    @property({ type: String }) height: string = '200px';

    @property() scope: Window & typeof globalThis = window;

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        if (changedProperties.has('logs')) {
            this.scrollTop = this.scrollHeight;
        }
        if (changedProperties.has('scope')) {
            this.logs = [];
            this.interceptConsole();
        }

    }

    interceptConsole() {
        if (!this.scope) return;
        const originalLog = this.scope.console.log;
        const originalWarn = this.scope.console.warn;
        const originalError = this.scope.console.error;
        const originalInfo = this.scope.console.info;


        this.scope.console.log = (...args: unknown[]) => {
            this.addLog('log', args);
            originalLog.apply(this.scope.console, args);
        };

        this.scope.console.warn = (...args: unknown[]) => {
            this.addLog('warn', args);
            originalWarn.apply(this.scope.console, args);
        };

        this.scope.console.error = (...args: unknown[]) => {
            this.addLog('error', args);
            originalError.apply(this.scope.console, args);
        };

        this.scope.console.info = (...args: unknown[]) => {
            this.addLog('info', args);
            originalInfo.apply(this.scope.console, args);
        };
    }

    addLog(type: string, args: unknown[]) {
        const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' ');
        this.logs = [...this.logs, { type, message }];
    }

    render() {
        this.style.height = this.height;
        return html`
      <div class="log-container">
        ${this.logs.map(
            log => html`
            <div class="log ${log.type}">
              [${log.type.toUpperCase()}] ${log.message}
            </div>
          `
        )}
      </div>
    `;
    }
}
