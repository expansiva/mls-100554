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
    @state() isAgentParallelMode: boolean = false;


    async firstUpdated() {
        //this.task = await getTask('20250917143000.1001');
        //this.task = await getTask('20251205185425.1001');
        //this.task = await getTask('20251127123524.1001');
        // this.task = await getTask('20260126134300.1001');
        // this.task = await getTask('20260126125152.1001');
        this.isAgentParallelMode = !!this.task?.iaCompressed?.nextSteps[0].progress;
        // console.info({ task: this.task, parallel: this.isAgentParallelMode })
    }

    updated(_changedProperties: Map<PropertyKey, unknown>) {
        super.updated(_changedProperties);
        if (_changedProperties.has('task')) {
            this.isAgentParallelMode = !!this.task?.iaCompressed?.nextSteps[0].progress;
        }
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

    private getIconStep(status?: mls.msg.AIStepStatus) {

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


    private getIconTask(status?: mls.msg.TaskStatus) {

        switch (status) {
            case 'done': return '✅';
            case 'in progress': return html`<div class="loader"></div>`;
            case 'failed': return '❌';
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
                <span class="icon">${this.getIconStep(step.status)}</span>

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

    private renderTaskRootDetails() {
        if (!this.task) return html``;
        return html`
            <div class="row">
                <span class="icon">${this.getIconTask(this.task.status)}</span>
                <div>${this.task?.title}</div>
            </div>
            <hr></hr>

        `
    }

    private renderTaskProgress() {
        if (!this.task) return html``;

        const root = this.task.iaCompressed?.nextSteps[0];
        if (!root?.progress) return html``;

        const { completed, failed, total } = root.progress;

        const percent = total ? Math.round((completed / total) * 100) : 0;

        const stateClass =
            failed > 0
                ? 'failed'
                : percent === 100
                    ? 'done'
                    : 'running';

        return html`
            <div class="progress">
                <div class="progress-info">
                    <span>Progress</span>
                    <span>
                        ${completed}/${total}
                        ${failed > 0 ? html` • ❌ ${failed}` : nothing}
                    </span>
                </div>

                <div class="bar">
                    <div
                        class="fill ${stateClass}"
                        style="width:${percent}%"
                    ></div>
                </div>
            </div>
        `;
    }

    private renderTree() {
        const steps = this.task?.iaCompressed?.nextSteps ?? [];
        return html`
        <section class="tree">
                ${this.renderTaskRootDetails()}
                ${this.isAgentParallelMode ? this.renderTaskProgress() : ''}
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
                    href = "#"
                    @click=${(e: MouseEvent) => { e.preventDefault(); this.selectedStep = null }}>
                    ← back
                </a>
                <h3> ${this.getTitle(step)} </h3>
                <pre> ${JSON.stringify(step, null, 2)} </pre>
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
                    href = "#"
                    @click=${(e: MouseEvent) => {
                e.preventDefault();
                this.selectedTraceStep = null;
            }
            }>
                ← back
            </a>

            <h3> Trace • ${this.getTitle(step)} </h3>

            ${logs.length === 0
                ? html`<div>No logs</div>`
                : html`
                    <ul class="log-list">
                        ${logs.map((l: unknown) => html`
                        <li class="log-item">
                            ${this.renderLogItem(l)}
                        </li>
                    `)}
                    </ul>
                `}
        </section>
            `;
    }

    private renderLogItem(raw: unknown) {

        const data = this.tryParseJSON(raw);

        if (typeof data === 'object' && data !== null) {
            const obj = data as any;

            return html`
            <div class="log-card">
                ${obj.title ? html`<strong>${obj.title}</strong>` : nothing}

                ${Array.isArray(obj.trace)
                    ? html`
                        <ul class="trace-steps">
                            ${obj.trace.map((t: string) =>
                        html`<li>${t}</li>`
                    )}
                        </ul>
                    `
                    : html`<pre>${JSON.stringify(obj, null, 2)}</pre>`}
            </div>
        `;
        }

        return html`<pre>${String(data)}</pre>`;
    }


    private tryParseJSON(value: unknown) {
        if (typeof value !== 'string') return value;

        try {
            return JSON.parse(value);
        } catch {
            return value; // continua string normal
        }
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
                    : this.renderTree()
            }
        </section>
            `;
    }


}


