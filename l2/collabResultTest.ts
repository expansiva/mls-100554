/// <mls shortName="collabResultTest" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { IcaLitElement } from './_100554_icaLitElement';
import { collab_spinner_clock, collab_check, collab_xmark } from './_100554_collabIcons'

@customElement('collab-result-test-100554')
export class CollabConsole100554 extends IcaLitElement {

    @property({ type: String }) testName = '';
    @property({ type: String }) status: 'pending' | 'running' | 'finished' = 'pending';
    @property({ type: String }) resultStatus: 'pass' | 'failed' = 'pass';
    @property({ type: String }) result = '';

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
    }

    private renderRunning() {
        return html`
                <span class="loading">${collab_spinner_clock}</span>
                <span>${this.testName}</span>
        `
    }

    private renderFinished() {
        return html`
                <details open class="result">
                    <summary>${this.testName}</summary>
                    <div>
                        <div>
                            <i class="result ${this.resultStatus}">${this.resultStatus === 'pass' ? collab_check : collab_xmark}</i>
                            <span>Result: ${this.result}</span>
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
