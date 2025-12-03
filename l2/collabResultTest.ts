/// <mls shortName="collabResultTest" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';
import { collab_spinner_clock, collab_check, collab_xmark } from '/_100554_/l2/collabIcons.js'

@customElement('collab-result-test-100554')
export class CollabConsole100554 extends StateLitElement {

    @property({ type: String }) testName = '';
    @property({ type: String }) status: 'pending' | 'running' | 'finished' = 'pending';
    @property({ type: String }) resultStatus: 'pass' | 'failed' = 'pass';
    @property({ type: String }) result = '';
    @property() timeResult: number = 0;

    timeStart: number = 0;
    timeEnd: number = 0;

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
    }

    private renderRunning() {
        this.timeStart = performance.now();
        return html`
                <span class="loading">${collab_spinner_clock}</span>
                <span>${this.testName}</span>
        `
    }


    private renderFinished() {
        this.timeEnd = performance.now();

        this.timeResult = this.timeEnd - this.timeStart;

        return html`
                <details style="width:100%" open class="result">
                    <summary>
                        ${this.testName} 
                        <small style="flex:1; text-align:end;">
                            ${this.timeResult >= 1000
                            ? `(${(this.timeResult / 1000).toFixed(2)}s)`
                            : `(${this.timeResult.toFixed(2)}ms)`}
                        </small>
                        <i class="result ${this.resultStatus}">${this.resultStatus === 'pass' ? collab_check : collab_xmark}</i>
                    </summary>
                    <div>
                        <div style="display:flex; align-items:center;">
                            <pre>${this.result}</pre>
                        </div>                    
                    </div>
                </details>
        `
    }

    render() {
        return html`
            <div class="test-container">
                ${this.status === 'running'
                ? this.renderRunning()
                : this.renderFinished()
            }
            </div>
        `;

    }
}
