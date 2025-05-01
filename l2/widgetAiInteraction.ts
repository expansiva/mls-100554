/// <mls shortName="widgetAiInteraction" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, TemplateResult, unsafeHTML } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { IcaLitElement } from './_100554_icaLitElement';
import { getNextResultStep, getNextPendentStep, getNextClarificationStep, getInteractionStepId, getStepById } from './_100554_aiAgentHelper';
import { getClarification } from './_100554_aiAgentOrchestration';

@customElement('widget-ai-interaction-100554')
export class WidgetAiInteraction100554 extends IcaLitElement {

    @property() payloads: mls.msg.AIPayload[] | undefined = undefined;
    @property() task: mls.msg.TaskData | undefined = undefined;
    @property() stepid: string = '';
    @property({ attribute: false }) seen = new Set<string>();

    @property() interactionClarification: mls.msg.AIAgentStep | undefined;
    @query('.direct-clarification') directClarification: HTMLElement | undefined;
    @query('.direct-clarification .content') directClarificationContent: HTMLElement | undefined;

    async firstUpdated(changedProperties: Map<PropertyKey, unknown>) {
        super.firstUpdated(changedProperties);
        if (this.interactionClarification) {
            this.setClarification();
        }
    }

    render() {

        if (!this.payloads) return html``;

        let isClarificationPending: boolean = false;
        if (this.task) {
            const nextStepPending = getNextPendentStep(this.task);
            if (nextStepPending?.type === 'clarification') isClarificationPending = true;
        }
        return html`        
            <details class="details-task">
                <summary>Details</summary>
                <div>
                    ${this.renderTaskInfo()}
                    ${this.renderlLongMemory()}
                    ${this.renderTaskInteractions()}
                </div>
            </details>
            
            ${this.task?.status === "done"
                    ? this.renderDirectResult()
                    : html``
                }

            ${isClarificationPending
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
        return html`<div class="direct-clarification">${this.renderClarification(payload)}</div>`
    }

    private renderlLongMemory() {
        if (!this.task || !this.task.iaCompressed?.longMemory) return html``
        return html`
            <h4>LongMemory</h4>
            <ul>
                ${Object.keys(this.task.iaCompressed?.longMemory).map((key) => {
            return html`<li>${key}:${this.task?.iaCompressed?.longMemory[key]}</li>`
        })}
            </ul>
        `
    }

    private renderTaskInfo() {
        return html`
            <div class="task-info">
                <ul>
                    <li>
                        <span>Id:</span>
                        <span>${this.task?.PK}</span>
                    </li>
                    <li>
                        <span>Status:</span>
                        <span>${this.task?.status}</span>
                    </li>
                </ul>                
            </div>
        `
    }

    private renderTaskInteractions() {
        return html`
            <div class="payload-content">
                ${this.payloads?.map((payload) => {
            return html`
                                    <div>
                                        ${this.renderPayload(payload)}
                                    </div>`
        })}
            </div>
        `
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
                return html`
                    <details ?open=${isDirect} >
                        <summary>${payload.type}</summary>
                        ${this.renderTool(payload)}
                    </details>
                `
            case 'clarification':
                return html`
                    <details ?open=${isDirect} >
                        <summary>${payload.type}</summary>
                        ${this.renderClarificationDetails(payload)}
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
        <div>
            <details>
                <summary>Next Steps</summary>
                <div>
                    <ul>
                        ${steps.map((step) => {
            return html`<li @click=${this.onNextStepClick(step.interaction, step.stepId)}> ${step.stepId}</li>`
        })}       
                    </ul>
                </div> 
            </details>
        </div> 
            `
    }

    private onNextStepClick(interaction: mls.msg.AIInteraction | null | undefined, stepId: number) {
        if (!interaction || !interaction.payload) return;
        this.requestUpdate();
    }

    private renderAgent(payload: mls.msg.AIAgentStep) {
        return html`
            ${payload.interaction ? this.renderInteration(payload.interaction, payload.stepId) : html``}
            ${payload.nextSteps && payload.nextSteps.length > 0 ? this.renderNextSteps(payload.nextSteps, payload.stepId) : html``}
        `;
    }

    private renderTool(payload: mls.msg.AIToolStep) {
        return html`
            <div class="clarification-details">
                <pre>${JSON.stringify(payload)}</pre>
            </div>`;

    }

    private renderClarificationDetails(payload: mls.msg.AIClarificationStep) {
        return html`
            <div class="clarification-details">
                <pre>${JSON.stringify(payload)}</pre>
            </div>`;

    }

    private renderClarification(payload: mls.msg.AIClarificationStep) {

        if (!this.task) return html`Invalid task`;
        const parentInteraction = getInteractionStepId(this.task, payload.stepId);
        if (!parentInteraction) return html`No found parentInteraction ${payload.stepId} on task: ${this.task.PK} `;
        const interaction = getStepById(this.task, parentInteraction) as mls.msg.AIAgentStep;
        this.interactionClarification = interaction;
        if (!interaction) return html`Invalid interaction id:${parentInteraction} on task: ${this.task.PK} `
        if (!interaction.agentName) return html`Invalid agent name for step id:${interaction.stepId} on task: ${this.task.PK} `
        return html`<div class="content"> Processing...</div>`

    }
    private renderResult(payload: mls.msg.AIResultStep) {
        return html`
            <div class="result">
                <pre>${typeof payload.result === 'object' ? JSON.stringify(payload.result) : payload.result}</pre>
            </div>`;
    }

    private async setClarification(): Promise<void> {
        if (!this.directClarificationContent || !this.task) return;
        const clarification = await getClarification(this.task.PK);
        if (!clarification) return;
        this.directClarificationContent.innerHTML = '';
        this.directClarificationContent.appendChild(clarification);
        this.executeHTMLClarificationScript();
    }

    private executeHTMLClarificationScript() {
        this.directClarification?.querySelectorAll('script').forEach(oldScript => {

            const newScript = document.createElement('script');
            newScript.type = oldScript.type || 'text/javascript';
            if (!newScript.type) {
                newScript.type = 'text/javascript';
            }

            if (oldScript.hasAttribute('type') && oldScript.getAttribute('type') === 'module') {
                newScript.type = 'module';
            }

            if (oldScript.src) {
                newScript.src = oldScript.src;
            } else {
                newScript.textContent = oldScript.textContent;
            }
            oldScript.replaceWith(newScript);
        });
    }

}
