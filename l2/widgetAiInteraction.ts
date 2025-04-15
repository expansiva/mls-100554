/// <mls shortName="widgetAiInteraction" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { IcaLitElement } from './_100554_icaLitElement';
import { AIInteraction, AIStep, AIPayload, AIAgentStep, AIClarificationStep, AIFinalResultStep, AIToolStep, AIFlexibleResultStep } from './_100554_iaChatInterfaces';
import { collab_chevron_right } from './_100554_collabIcons';
import { getInteractionByStep } from './_100554_iaChatBase';

@customElement('widget-ai-interaction-100554')
export class WidgetAiInteraction100554 extends IcaLitElement {

    @property() interaction: AIInteraction | undefined = undefined;
    @property() payload: AIPayload | undefined = undefined;

    @property() stepid: string = '';
    @property({ attribute: false }) seen = new Set<string>();
    @property() breadcrumb: IBreadCrumb[] = [];

    firstUpdated(a: any) {
        super.firstUpdated(a);
        if (this.stepid && this.interaction) {
            this.payload = getInteractionByStep(this.interaction, Number.parseInt(this.stepid));
        }
    }

    render() {

        if (this.payload) {
            return html`
                <div class="payload-content">
                    ${this.renderPayload(this.payload, true)}
                </div>`;
        }


        if (!this.interaction) return html``;
        if (this.breadcrumb.length === 0) {
            this.breadcrumb = [
                { data: this.interaction, title: 'root' }
            ];
        }

        return html`        
        <div class="breadcrumb">
            ${this.breadcrumb.map((step, index) => html`
                <span @click=${() => this.onBreadcrumbClick(index)}>${step.title}</span>
               
            `)}
        </div>

        <details>
            <summary>Inputs</summary>
            <div>
                <div class="prompts-content">
                    ${this.interaction?.input.map(
            (result, index) => html`
                            <div class="prompts-input-item">
                                <span class="prompts-input-type">${result.type}</span>
                                <span class="prompts-input-content"><pre>${result.content}</pre></span>
                            </details>
                        `
        )}
                </div>
            </div>
        </details>

        <details>
            <summary>Trace</summary>
            <div>
                <div class="trace-content">
                    <pre>${this.interaction?.trace?.join('\n')}</pre>
                </div>
            </div>
        </details>

        <details>
            <summary>Payload</summary>
            <div>
                <div class="payload-content">
                    ${this.interaction?.payload?.map((payload) => {
            return this.renderPayload(payload)
        })}
                </div>
            </div>
        </details>`;
    }


    private renderPayload(payload: AIPayload, isDirect: boolean = false) {
        switch (payload.type) {
            case 'agent':
                return html`
                    <details ?open=${isDirect} class="payload-details-item">
                        <summary>${payload.type}</summary>
                        ${this.renderAgent(payload)}
                    </details>`
            case 'tool':
                return html`
                    <details ?open=${isDirect} class="payload-details-item">
                        <summary>${payload.type}</summary>
                        ${this.renderTool(payload)}
                    </details>`

            case 'clarification':
                return html`
                    <details ?open=${isDirect} class="payload-details-item">
                        <summary>${payload.type}</summary>
                        <div class="clarification">
                            ${this.renderClarification(payload)}
                        </div>
                    </details>
                    ${payload.interaction ? this.renderInteration(payload.interaction, payload.stepId) : ''}
                    ${payload.nextSteps ? this.renderNextSteps(payload.nextSteps, payload.stepId) : ''}

                    `
            case 'result':
                return html`
                    <details ?open=${isDirect} class="payload-details-item">
                        <summary>${payload.type}</summary>
                        ${this.renderResult(payload)}
                    </details>
                    ${payload.interaction ? this.renderInteration(payload.interaction, payload.stepId) : ''}
                    ${payload.nextSteps ? this.renderNextSteps(payload.nextSteps, payload.stepId) : ''}
                    `

            default:
                return html`<p>Tipo de resultado desconhecido.</p>`;
        }
    }

    private renderInteration(interaction: AIInteraction, stepId: number) {
        return html` 
            <div class="payload-details-item-link" @click=${() => this.onInteractionClick(interaction, stepId)}>
                <span>Interactions</span> 
                <span>${collab_chevron_right}</span> 
            </div>`
    }

    private renderNextSteps(steps: AIStep[], stepId: number) {
        return html` 
            <details class="payload-details-item">
                <summary>Next Steps</summary>
                <div>
                    <ul>
                        ${steps.map((step) => {
            return html`<li> ${step.title}</li>`
        })
            }
                    </ul>
                </div> 
            </details>`
    }

    private onInteractionClick(interaction: AIInteraction, stepId: number) {
        this.interaction = interaction;
        this.breadcrumb = [...this.breadcrumb, { title: `Interaction: ${stepId}`, data: interaction }];
        this.requestUpdate();
    }

    private onBreadcrumbClick(index: number) {
        this.breadcrumb = this.breadcrumb.slice(0, index + 1);
        this.interaction = this.breadcrumb[this.breadcrumb.length - 1].data;
    }

    private renderAgent(payload: AIAgentStep) {
        return html``;

    }

    private renderTool(payload: AIToolStep) {
        return html``;

    }

    private renderClarification(payload: AIClarificationStep) {
        return html`
        <p><strong>Clarification:</strong> ${payload.clarificationMessage}</p>
        ${payload.htmlForm
            ? html`<div .innerHTML=${payload.htmlForm}></div>`
            : html`<form>
                <textarea></textarea>
                <button>Enviar<button>
            </form>`}
      `;

    }

    private renderResult(payload: AIFinalResultStep) {
        return html`<pre>${payload.result}</pre>`;

    }

}


interface IBreadCrumb {
    title: string,
    data: AIInteraction
}