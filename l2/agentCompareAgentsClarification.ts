/// <mls fileReference="_100554_/l2/agentCompareAgentsClarification.ts" enhancement="_100554_/l2/enhancementLit"/>

import { html, nothing, unsafeHTML } from 'lit';
import { customElement, state, property, query } from 'lit/decorators.js';
import { CollabLitElement } from '/_100554_/l2/collabLitElement.js';


@customElement('agent-compare-agents-clarification-100554')
export class AgentToBeConceptual2Clarification extends CollabLitElement {

    @property({ type: Number }) entitiesCount = 0;
    @property({ type: Number }) rulesCount = 0;
    @property({ type: Number }) capabilitiesCount = 0;
    @property({ type: Array }) suggestions: string[] = [];


    firstUpdated(changed: Map<string, any>) {

    }

    updated(changed: Map<string, any>) {

    }


    /* ---------------------------
     * Render
     * --------------------------- */

    render() {
        return html`
            <div class="container">

                
                    ${this.suggestions.map((s, idx) => {

            let aux = `<input type="text" id="ipt${idx}" class="valueIpt"/>`;
            if (idx > 0) aux = `<textarea type="text" id="ipt${idx}" class="valueIpt"/></textarea>`;
            return html`
                            <div class="card">
                                <div class="body">
                                    <div class="title">${s}</div>
                                    ${unsafeHTML(aux)}
                                </div>
                            </div>
                        `
        })}
                

                <div class="content">
                    ${this.renderContentSuggestions()}
                </div>

            </div>
        `;
    }



    private renderContentSuggestions() {

        return html`
        <div class="suggestions">

            <div class="actions">
                <button type="button" class="action-btn cancel" @click=${() => { this.onAction('cancel') }}>Cancel</button>
                <button type="button" class="action-btn continue" @click=${() => { this.onAction('continue') }} >Continue</button>
            </div>
    
        </div>
    `;
    }

    private onAction(action: 'cancel' | 'continue') {

        const inputs = this.querySelectorAll('.valueIpt');
        const args = {
            agentNames: [] as string[],
            promptUser: '',
            promptCompare: '',
        };

        Array.from(inputs).forEach((i) => {

            const ipt = i as HTMLInputElement;

            if (ipt.id === 'ipt0' && ipt.value !== '') {
                args.agentNames = ipt.value.trim().split(',') || [];
            }

            if (ipt.id === 'ipt1' && ipt.value !== '') {
                args.promptUser = ipt.value.trim();
            }

            if (ipt.id === 'ipt2' && ipt.value !== '') {
                args.promptCompare = ipt.value.trim();
            }

        });

        const value = JSON.stringify(args);

        this.dispatchEvent(
            new CustomEvent('clarification-finish', {
                detail: {
                    value,
                    action
                },
                bubbles: true,
                composed: true
            })
        );
    }


}
