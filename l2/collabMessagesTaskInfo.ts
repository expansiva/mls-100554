/// <mls shortName="collabMessagesTaskInfo" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';
import { getClarification } from './_100554_aiAgentOrchestration';
import { getNextPendentStep, getNextClarificationStep, getInteractionStepId, getStepById } from './_100554_aiAgentHelper'; 

import './_100554_collabMessagesTaskDetails';
import './_100554_pluginTaskPreview';
@customElement('collab-messages-task-info-100554')
export class WidgetAiInteraction100554 extends StateLitElement {

    @property() task: mls.msg.TaskData | undefined = undefined;
    @property() stepid: string = '';
    @property({ attribute: false }) seen = new Set<string>();

    @property() interactionClarification: mls.msg.AIAgentStep | undefined;
    @query('.direct-clarification') directClarification: HTMLElement | undefined;
    @query('.direct-clarification .content') directClarificationContent: HTMLElement | undefined;

    @state() private activeTab: 'workflow' | 'step' | 'raw' = 'workflow';

    async firstUpdated(changedProperties: Map<PropertyKey, unknown>) {
        super.firstUpdated(changedProperties);
        if (this.interactionClarification) {
            this.setClarification();
        }
    }

    render() {

        if (!this.task) return html`No task.`;

        let isClarificationPending: boolean = false;
        if (this.task) {
            const nextStepPending = getNextPendentStep(this.task);
            if (nextStepPending?.type === 'clarification') isClarificationPending = true;
        }

        if (isClarificationPending) return this.renderDirectClarification();
        return this.renderTab();
    }

    renderTab() {
        return html`
            <div style="height: calc(100% - 3rem);">
                <div class="tabs">
                <div
                    class="tab ${this.activeTab === 'workflow' ? 'active' : ''}"
                    @click=${() => this.setTab('workflow')}
                >Workflow</div>
                <div
                    class="tab ${this.activeTab === 'step' ? 'active' : ''}"
                    @click=${() => this.setTab('step')}
                >Step</div>
                <div
                    class="tab ${this.activeTab === 'raw' ? 'active' : ''}"
                    @click=${() => this.setTab('raw')}
                >Raw</div>
                </div>

                <div class="content">
                    ${this.renderTabContent()}
                </div>
            </div>
        `;

        
    }

    renderTabContent() {
        switch (this.activeTab) {
            case 'workflow': return html`workflow`;
            case 'step': return this.renderStep();
            case 'raw': return this.renderRaw();
            default: return html`workflow`;
        }
    }

    renderRaw() {
        return html`<collab-messages-task-details-100554 .task=${this.task} taskId=${this.task?.PK}></collab-messages-task-details-100554>`
    }

    renderStep() {
        return html`<plugin-task-preview-100554 .task=${this.task}></plugin-task-preview-100554>`
    }

    renderDirectClarification() {
        if (!this.task) throw new Error('Invalid task');
        const payload = getNextClarificationStep(this.task);
        if (!payload) return html``;
        return html`<div class="direct-clarification">${this.renderClarification(payload)}</div>`
    }

    renderClarification(payload: mls.msg.AIClarificationStep) {

        if (!this.task) return html`Invalid task`;
        const parentInteraction = getInteractionStepId(this.task, payload.stepId);
        if (!parentInteraction) return html`No found parentInteraction ${payload.stepId} on task: ${this.task.PK} `;
        const interaction = getStepById(this.task, parentInteraction) as mls.msg.AIAgentStep;
        this.interactionClarification = interaction;
        if (!interaction) return html`Invalid interaction id:${parentInteraction} on task: ${this.task.PK} `
        if (!interaction.agentName) return html`Invalid agent name for step id:${interaction.stepId} on task: ${this.task.PK} `
        return html`<div class="content"> Processing...</div>`

    }


    //---------IMPLEMENTATION -----------

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


    private setTab(tab: 'workflow' | 'step' | 'raw') {
        this.activeTab = tab;
    }

}