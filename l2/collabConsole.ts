/// <mls fileReference="_100554_/l2/collabConsole.ts" enhancement="_100554_enhancementLit" />

import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';

@customElement('collab-console-100554')
export class CollabConsole100554 extends StateLitElement {

    @state() logs: Array<{ type: string; message: string }> = [];
    @property({ type: String }) height: string = '200px';
    @property({ type: String }) mode: 'enabled' | 'disabled' = 'disabled';


    @property() scope: Window & typeof globalThis = window;

    private oldLog?: (...data: any[]) => void;

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        if (changedProperties.has('logs')) {
            this.scrollTop = this.scrollHeight;
        }
        if (changedProperties.has('scope')) {
            this.logs = [];
            this.changeMode(this.mode);
        }

        if (changedProperties.has('mode')) {
            this.changeMode(this.mode);
        }

    }

    private changeMode(mode: 'enabled' | 'disabled') {
        if (mode === 'enabled') {
            this.interceptConsole();
        } else if (this.oldLog) {
            this.scope.console.log = this.oldLog;
        }
    }

    private interceptConsole() {
        this.oldLog = console.log;
        let _scope = this.scope;
        let _this = this;

        let t0 = performance.now();

        _scope.console.log = function newLog(message: any, ...args: any) {
            (_scope.console as any)["collab"](message, args);
        };

        (_scope.console as any)["collab"] = function newLog(message: string, ...args: any) {
            const t2 = performance.now();
            const ms = Math.round(t2 - t0);
            t0 = t2;
            const newMessage = '[' + ms.toString().padStart(3) + 'ms] ' + (message ? message : "");
            let obj: any = {};
            (Error as any).captureStackTrace(obj, newLog);
            console.groupCollapsed(newMessage);
            console.info(message);
            console.trace();
            console.groupEnd();
            _this.addLog.bind(_this)('log', message);

        }

    }

    addLog(type: string, args: any) {
        const message = typeof args === 'object' ? JSON.stringify(args) : String(args);
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
