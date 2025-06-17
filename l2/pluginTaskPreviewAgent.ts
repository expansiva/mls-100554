/// <mls shortName="pluginTaskPreviewAgent" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, repeat } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
  
@customElement('plugin-task-preview-agent-100554')
export class PluginTaskPreviewAgent extends CollabLitElement { 

    @property({ type: Object }) step: mls.msg.AIAgentStep | null = null;
    @state() private prompts: mls.msg.IAMessageInputType[] = [];
    @state() private mode: string = 'info'; 

    private lastKey: number = -1;

    firstUpdated() {

        this.init();

    }

    update(changedProperties:any) {
        super.update(changedProperties);
        this.init();
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
                            class="tab-button ${this.mode === 'input' ? 'active' : ''}" @click=${() => this.selectTabInput()} >
                            Inputs                            
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
            case 'input': return this.renderInputs();
            case 'info': return this.renderInfo();
            case 'result': return this.renderResults();
            default: return this.renderInputs();
        }
 
    }

    renderInfo() { 

        if (!this.step || !this.step.interaction) return html`Not found!`;

        return html`
            <ul>
                <li>
                    #${this.step.stepId} - ${this.step.agentName} - ${this.step.status} - ${this.step.interaction.cost}
                </li>
                <li>
                    ${this.step.interaction.trace}
                </li>
            </ul>
        `;
    }

    renderInputs() {

        if (!this.prompts || this.prompts.length === 0)
            return html`
            <div class="containerinputs">
                <h3>No input found!</h3>
            </div>
        `;

        return html`
        <div class="containerinputs containerdraganddrop">
            ${repeat(this.prompts, ((key: mls.msg.IAMessageInputType) => key.type + Date.now()) as any, ((p: mls.msg.IAMessageInputType, idx: number) => { return this.renderPrompt(p, idx) }) as any)}
        </div>
        `
    }

    renderPrompt(prompt: mls.msg.IAMessageInputType, idx: number) {

        let pp = prompt.content.trim();
        return html`
            <details class="prompt ${prompt.type}" >
                <summary>
                    <div class="pheader">
                        <div class="type" style="display:flex; align-items: center;gap:.5rem">
                            <span class="typeMode">${prompt.type}</span>
                            <span class="title">
                                ${pp.substring(0, 50)}...
                            </span>
                        </div>
                        <div style="display:flex; gap:.5rem">
                            <div class="chevron">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style="width:10px"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>
                            </div>
                        </div>
                    </div>
                </summary>
                <div>
                    <pre class="content">${pp}</pre>
                </div>
            </details>
        `;
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
                : nextOptions.map( (ns) => html` <li> [${ns.stepId}] ${ns.type} - ${ns.agentName} </li> ` )}
        </ul>
        `
    }//<li @click=${() => this.navigateToStep(ns.stepId)}> [${ns.stepId}] ${ns.type} - ${ns.agentName} </li>



    //------IMPLEMENTATION----------

    private init() {

        if (this.step && this.step.stepId === this.lastKey) return;

        this.lastKey = this.step?.stepId || -1;

        this.getPrompts()
    }

    private getPrompts() {

        if (this.step && this.step.interaction && this.step.interaction.input){
            this.prompts = this.step.interaction.input;
        } else {
            this.prompts = [];
        }


    }

    private selectTabInput() {
        this.mode = 'input';
    }

    private selectTabInfo() {
        this.mode = 'info';
    }

    private selectTabResult() {
        this.mode = 'result';
    }

}