/// <mls shortName="pluginTaskPreviewClarification" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, unsafeHTML } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
import { convertFileNameToTag } from './_100554_utilsLit';

@customElement('plugin-task-preview-clarification-100554')
export class PluginTaskPreviewClarification extends CollabLitElement {

    @property({ type: Object }) task: mls.msg.TaskData | null = null;
    @property({ type: Object }) step: mls.msg.AIClarificationStep | null = null;
    @state() private mode: string = 'info';
    @state() private tag: string = 'pre';
    @query('#clarificationid') clarificationid: HTMLElement | undefined;

    firstUpdated() {

        this.getFile();
    }

    render() {

        if (!this.step) {
            return html`<p>Step not Found.</p>`;
        }

        return html`
            <div style="height: calc(100% - 85px);">
                <div class="tab-header">
                    <div class="tab-group-left">
                        <button
                            class="tab-button ${this.mode === 'info' ? 'active' : ''}" @click=${() => this.selectTabInfo()} >
                            Info                            
                        </button>
                        <button
                            class="tab-button ${this.mode === 'clarification' ? 'active' : ''}" @click=${() => this.selectTabClarification()} >
                            Clarification                            
                        </button>
                        <button
                            class="tab-button ${this.mode === 'result' ? 'active' : ''}" @click=${() => this.selectTabResult()} >
                            Results                            
                        </button>
                    </div>
                </div>
                <div class="tab-content">
                    ${this.renderMode()}
                    
                </div>
            </div>
        `;
    }

    renderMode() {

        switch (this.mode) {
            case 'clarification': return this.renderClarification();
            case 'info': return this.renderInfo();
            case 'result': return this.renderResults();
            default: return this.renderInfo();
        }

    }

    renderInfo() {

        if (!this.step) return html`Not found!`;


        return html`
            <ul>
                <li>
                    #${this.step.stepId} - ${this.step.type} - ${this.step.status}
                </li>
            </ul>
        `;
    }

    renderClarification() {

        if (!this.step || !this.task)
            return html`
            <div class="containerinputs">
                <h3>No input found!</h3>
            </div>
        `;

        setTimeout(() => {

            if (!this.clarificationid || !this.step || !this.task) return;
            const dt = {
                clarificationMessage: '',
                stepId: this.step.stepId,
                taskId: this.task.PK,
                json: this.step.json
            };

            (this.clarificationid as any).data = dt;
            
        }, 300)


        return unsafeHTML(`
        <${this.tag} id="clarificationid">
        </${this.tag}>
        `)
    }

    renderResults() {

        if (!this.step) return html`Not found step`;

        const nextOptions: any[] = [];
        if (this.step.interaction?.payload) {
            nextOptions.push(...this.step.interaction.payload);
        }
        if (this.step.nextSteps) {
            nextOptions.push(...this.step.nextSteps);
        }

        return html`
        <ul>
            ${nextOptions.length === 0 ? html`<li><em>Not next step</em></li>`
                : nextOptions.map((ns) => html` <li> [${ns.stepId}] ${ns.type} - ${ns.agentName} </li> `)}
        </ul>
        `
    }

    //------IMPLEMENTATION----------




    private selectTabClarification() {
        this.mode = 'clarification';
    }

    private selectTabInfo() {
        this.mode = 'info';
    }

    private selectTabResult() {
        this.mode = 'result';
    }

    private async getFile() {

        if (!this.step || !this.step.templateWidget) return;

        const url = './' + this.step.templateWidget;
        await import(url);
        this.tag = convertFileNameToTag(this.step.templateWidget)

    }
}