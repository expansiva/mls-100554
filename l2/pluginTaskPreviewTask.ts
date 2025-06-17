/// <mls shortName="pluginTaskPreviewTask" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, repeat } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { CollabLitElement } from './_100554_collabLitElement';
  
@customElement('plugin-task-preview-task-100554') 
export class PluginTaskPreviewTask extends CollabLitElement {

    @property({ type: Object }) task: mls.msg.TaskData | null = null;
    @state() private mode: string = 'info';
 
    render() {

        if (!this.task) {
            return html`<p>Task not Found.</p>`;
        }
 
        return html`
            <div style="height: calc(100% - 85px);">
                <div class="tab-header">
                    <div class="tab-group-left">
                        <button
                            class="tab-button ${this.mode === 'info' ? 'active' : ''}" @click=${() => this.selectTabInfo()} >
                            Info                            
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
            case 'info': return this.renderInfo();
            default: return this.renderInfo();
        }

    }

    renderInfo() {

        if (!this.task) return html``;


        return html`
            <header>
                <h2>${this.task.PK}</h2>
                <small>Status: ${this.task.status} | Última atualização: ${new Date(
            this.task.last_updated
        ).toLocaleString()}</small>
            </header>
        `;
    }



    //------IMPLEMENTATION----------

    private selectTabInfo() {
        this.mode = 'info';
    }


}