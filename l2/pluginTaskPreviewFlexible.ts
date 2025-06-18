/// <mls shortName="pluginTaskPreviewFlexible" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, repeat } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
 
@customElement('plugin-task-preview-flexible-100554')
export class pluginTaskPreviewFlexible extends CollabLitElement {
 
    @property({ type: Object }) step: mls.msg.AIFlexibleResultStep | null = null;
    @state() private mode: string = 'info';

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
                            class="tab-button ${this.mode === 'flexible' ? 'active' : ''}" @click=${() => this.selectTabFlexible()} >
                            Flexible                            
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
            case 'flexible': return this.renderFlexible();
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

    renderFlexible() {

        if (!this.step)
            return html`
            <div class="containerinputs">
                <h3>No input found!</h3>
            </div>
        `;
    
        return html`<pre>${JSON.stringify(this.step.result, null, 2)}</pre>`
        
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
    }

    //------IMPLEMENTATION----------


    private selectTabFlexible() {
        this.mode = 'flexible';
    }

    private selectTabInfo() {
        this.mode = 'info';
    }

    private selectTabResult() {
        this.mode = 'result';
    }

}