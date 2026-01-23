/// <mls shortName="aiAgentDefaultFeedback" project="100554" enhancement="_100554_enhancementLit" />

import { html, TemplateResult, nothing, svg } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { getTask } from '/_102025_/l2/collabMessagesIndexedDB.js';
import { StateLitElement } from '/_100554_/l2/stateLitElement.js';
import { collab_user, collab_clock_static, collab_terminal } from '/_100554_/l2/collabIcons.js';

@customElement('ai-agent-default-feedback-100554')
export class AiAgentDefaultFeedback100554 extends StateLitElement {

    @state() task?: mls.msg.TaskData;
    @state() selectedStep: mls.msg.AIPayload | null = null;
    @state() selectedTraceStep: mls.msg.AIPayload | null = null;

    async firstUpdated() {
        //this.task = await getTask('20250917143000.1001');
        //this.task = await getTask('20251205185425.1001');
        //this.task = await getTask('20251127123524.1001');      
        //console.info(this.task)
    }

    private getTitle(
        step:
            | mls.msg.AIAgentStep
            | mls.msg.AIToolStep
            | mls.msg.AIClarificationStep
            | mls.msg.AIResultStep
            | mls.msg.AIFlexibleResultStep
    ): string {
        return (
            step.stepTitle ||
            (step as mls.msg.AIAgentStep).agentName ||
            (step as mls.msg.AIToolStep).toolName ||
            step.type ||
            'step'
        );
    }

    private getIcon(status?: mls.msg.AIStepStatus) {

        const a = this.task?.iaCompressed?.nextSteps[0].status
        switch (status) {
            case 'completed': return '✅';
            case 'in_progress': return html`<div class="loader"></div>`;
            case 'failed': return '❌';
            case 'pending': return '⏳';
            case 'waiting_after_prompt': return html`${collab_terminal}${collab_clock_static}`;
            case 'waiting_human_input': return html`${collab_clock_static}`;

            default: return '•';
        }
    }

    private getChildren(step: mls.msg.AIPayload) {
        return [
            ...(step.nextSteps ?? []),
            ...(step.interaction?.payload ?? [])
        ];
    }

    private renderStep(step: mls.msg.AIPayload, depth = 0): TemplateResult {

        const children = this.getChildren(step);
        const hasChildren = children.length > 0;

        if (step.type === 'flexible' || step.type === 'result') {
            return html`
            ${hasChildren
                    ? children.map((s: mls.msg.AIPayload) =>
                        this.renderStep(s, depth)
                    )
                    : nothing}
            `
        }

        return html`
        <div class="step" style="padding-left:${depth + 15}px; ${depth !== 0 ? 'border-left:1px solid #cecece' : ''}" >

            <div class="row">
                <span class="icon">${this.getIcon(step.status)}</span>

                <span class="title">
                    ${this.getTitle(step)}
                </span>

                <span class="actions">
                    <a href="#" @click=${(e: MouseEvent) => { e.preventDefault(); this.selectedStep = step; }}>
                        details
                    </a>
                    <a href="#"
                        @click=${(e: MouseEvent) => {
                e.preventDefault();
                this.selectedTraceStep = step;
            }}>
                        trace
                    </a>
                </span>
            </div>

            ${hasChildren
                ? children.map((s: any) =>
                    this.renderStep(s, depth + 1)
                )
                : nothing}
        </div>
    `;
    }

    private renderTree() {
        const steps = this.task?.iaCompressed?.nextSteps ?? [];
        return html`
            <section class="tree">
                ${steps.map((s: any) => this.renderStep(s))}
            </section>
        `;
    }

    private renderDetails() {

        const step = JSON.parse(JSON.stringify(this.selectedStep)) as mls.msg.AIPayload;
        if (step && step.nextSteps) step.nextSteps = [];
        if (step && step.interaction && step.interaction.payload) {
            step.interaction.payload.forEach((pay) => {
                pay.nextSteps = [];
            });
        }

        return html`
            <section class="details">
                <a 
                    class="back"
                    href="#"
                    @click=${(e: MouseEvent) => { e.preventDefault(); this.selectedStep = null }}>
                    ← back
                </a>
                <h3>${this.getTitle(step)}</h3>
                <pre>${JSON.stringify(step, null, 2)}</pre>
            </section>
        `;
    }

    private renderTrace() {
        const step = this.selectedTraceStep;

        if (!step) return nothing;

        const logs = (step as mls.msg.AIPayload).interaction?.trace ?? [];

        return html`
        <section class="trace">
            <a
                class="back"
                href="#"
                @click=${(e: MouseEvent) => {
                e.preventDefault();
                this.selectedTraceStep = null;
            }}>
                ← back
            </a>

            <h3>Trace • ${this.getTitle(step)}</h3>

            ${logs.length === 0
                ? html`<div>No logs</div>`
                : html`
                    <ul class="log-list">
                        ${logs.map((l: any) => html`
                            <li class="log-item">
                                <pre>${JSON.stringify(l, null, 2)}</pre>
                            </li>
                        `)}
                    </ul>
                `}
        </section>
    `;
    }


    render() {

        if (!this.task) return html`No find task`;
        if (!this.task.iaCompressed) return html`No find Ai interaction in task`;
        return html`
                <section class="feedback-section">
                    ${this.selectedTraceStep
                ? this.renderTrace()
                : this.selectedStep
                    ? this.renderDetails()
                    : this.renderTree()}
                </section>
    `;
    }


}


