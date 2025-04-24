/// <mls shortName="widgetAiInteraction" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { IcaLitElement } from './_100554_icaLitElement';
import { getNextResultStep, getNextClarificationStep, getInteractionStepId, getStepById } from './_100554_aiAgentHelper';

@customElement('widget-ai-interaction-100554')
export class WidgetAiInteraction100554 extends IcaLitElement {

    @property() payloads: mls.msg.AIPayload[] | undefined = undefined;
    @property() task: mls.msg.TaskData | undefined = undefined;
    @property() stepid: string = '';
    @property({ attribute: false }) seen = new Set<string>();
    @property() breadcrumb: IBreadCrumb[] = [];

    render() {

        if (!this.payloads) return html``;

        if (this.breadcrumb.length === 0) {
            this.breadcrumb = [
                { data: this.payloads, title: 'root' }
            ];
        }

        console.info({
            payloads: this.payloads,
            task: this.task
        })

        return html`        
        <div class="breadcrumb">
            ${this.breadcrumb.map((step, index) => html`
                <span @click=${() => this.onBreadcrumbClick(index)}>${step.title}</span>   
            `)}
        </div>


        <div class="payload-content">
            ${this.payloads.map((payload) => {
            return html`
                <div>
                    ${this.renderPayload(payload)}
                </div>
                        `
        })}
        </div>

        ${this.task?.status === "done"
                ? this.renderDirectResult()
                : html``
            }

        ${this.task?.status === "waitingforuser"
                ? this.renderDirectClarification()
                : html``
            }

        `
    }

    private renderDirectResult() {
        if (!this.task) throw new Error('Invalid task');
        const payload = getNextResultStep(this.task);
        if (!payload) return html``;
        return this.renderResult(payload)
    }

    private renderDirectClarification() {
        if (!this.task) throw new Error('Invalid task');
        const payload = getNextClarificationStep(this.task);
        if (!payload) return html``;
        return this.renderClarification(payload)
    }

    private renderPayload(payload: mls.msg.AIPayload, isDirect: boolean = false): TemplateResult<1> {

        switch (payload.type) {
            case 'agent':
                return html`
                    <details ?open=${isDirect}>
                        <summary>${payload.type}(${payload.agentName})</summary>
                        ${this.renderAgent(payload)}
                    </details>`
            case 'tool':
                return html``
            case 'clarification':
                return html`
                    <details ?open=${isDirect} >
                        <summary>${payload.type}</summary>
                        ${this.renderClarification(payload)}
                    </details>
                `
            case 'result':
                return html`
                    <details ?open=${isDirect} >
                        <summary>${payload.type}</summary>
                        ${this.renderResult(payload)}
                    </details>
                `
            default:
                return html`<p>Tipo de resultado desconhecido.</p>`;
        }
    }

    private renderInteration(interaction: mls.msg.AIInteraction, stepId: number) {

        return html` 
            <div class="interactions">
                <details>
                    <summary>Inputs</summary>
                    <div>
                        <div class="prompts-content">
                            ${interaction.input.map((result, index) => html`
                                <div class="prompts-input-item">
                                    <span class="prompts-input-type">${result.type}</span>
                                    <span class="prompts-input-content"><pre>${result.content}</pre></span>
                                </details>
                            `)}
                        </div>
                    </div>
                </details>

                <details>
                    <summary>Trace</summary>
                    <div>
                        <div class="trace-content">
                            <pre>${interaction?.trace?.join('\n')}</pre>
                        </div>
                    </div>
                </details>

                ${interaction.payload && interaction.payload.length > 0
                ? html`
                        <details>
                            <summary>Payload</summary>
                            <div>
                                <div class="payload-content">
                                    ${interaction.payload?.map((payl) => { return this.renderPayload(payl) })}
                                </div>
                            </div>
                        </details>`
                : html``

            }
                
            </div>`
    }

    private renderNextSteps(steps: mls.msg.AIStep[], stepId: number) {
        return html` 
            <details>
                <summary>Next Steps</summary>
                <div>
                    <ul>
                        ${steps.map((step) => {
            return html`<li @click=${this.onNextStepClick(step.interaction, step.stepId)}> ${step.stepId}</li>`
        })}       
                    </ul>
                </div> 
            </details>`
    }

    private onNextStepClick(interaction: mls.msg.AIInteraction | null | undefined, stepId: number) {
        if (!interaction || !interaction.payload) return;
        this.breadcrumb = [...this.breadcrumb, { title: `Interaction: ${stepId}`, data: interaction.payload }];
        this.requestUpdate();
    }

    private onBreadcrumbClick(index: number) {
        // this.breadcrumb = this.breadcrumb.slice(0, index + 1);
        // this.interaction = this.breadcrumb[this.breadcrumb.length - 1].data;
    }

    private renderAgent(payload: mls.msg.AIAgentStep) {
        return html`
            ${payload.interaction ? this.renderInteration(payload.interaction, payload.stepId) : html``}
            ${payload.nextSteps ? this.renderNextSteps(payload.nextSteps, payload.stepId) : html``}
        `;

    }

    private renderTool(payload: mls.msg.AIToolStep) {
        return html``;

    }

    private renderClarification(payload: mls.msg.AIClarificationStep) {

        if (!this.task) return;
        const parentInteraction = getInteractionStepId(this.task, payload.stepId);
        if (parentInteraction) {
            const interaction = getStepById(this.task, parentInteraction);
            console.info({
                parentInteraction,
                interaction
            })

        }

        return html`
            <div class="clarification">
                <p><strong>Clarification:</strong> ${payload.clarificationMessage}</p>
                ${payload.htmlForm
                ? html`<div .innerHTML=${payload.htmlForm}></div>`
                : html`<form>
                        <textarea></textarea>
                        <button>Enviar<button>
                    </form>
            </div>
            
            `}
      `;

    }

    private renderResult(payload: mls.msg.AIResultStep) {
        return html`

        <div class="result">
            <pre>${payload.result}</pre>
        </div>
        

        `;

    }

}


interface IBreadCrumb {
    title: string,
    data: mls.msg.AIPayload[]
}