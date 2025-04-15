/// <mls shortName="widgetChatExample" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { IcaLitElement } from './_100554_icaLitElement';
import { collab_chevron_left } from './_100554_collabIcons';
import { tasks } from './_100554_chatJson';
import './_100554_widgetAiTask';
import { TaskData } from './_100554_iaChatInterfaces';
import './_100554_widgetAiInteraction';
import { startPrompt, afterPrompt } from './_100554_agentPlanner1';
import { execAddTask, execGetTaskUpdate } from './_100554_iaChatBase';

@customElement('widget-chat-example-100554')
export class WidgetChatExample100554 extends IcaLitElement {

    @state() actualTasks: TaskData[] = [];
    @property() panel: 'Chat' | 'Details' = 'Chat';
    @property() actualTaskDetails: TaskData | undefined;
    @property() stepIdSelected: number | undefined;
    @query('#prompt_textarea') textarea: HTMLTextAreaElement | undefined;

    async firstUpdated() {

        const task = await execGetTaskUpdate('20250304200000.1000/20250415175538.1000', "task#1744739738653");
        this.actualTasks = [task];
    }

    render() {

        return html`
        <div @click=${this.handleClickHeader} class="header">    
            <span>${collab_chevron_left}</span>
            <span>${this.panel === 'Chat' ? 'Chat' : `Details: ${this.actualTaskDetails?.PK}`}</span>
        </div>


        ${this.panel === 'Chat'
                ? html`<div class="chat-container">
                        <div class="message-time">10/04/2024</div>
                        ${this.actualTasks.map((taskItem) => {


                    return html` 
                                <div class="message user">
                                    <div class="message-group">
                                        <div class="message-row">
                                        <div class="message-card user">
                                            <div class="message-title">@${taskItem.owner}</div>
                                            <div class="message-content">${taskItem.title}</div>
                                            <div class="message-footer">10:00</div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                                ${taskItem.iaCompressed?.interaction
                            ? html`
                                    <div class="message system">
                                        <widget-ai-task-100554 
                                            @taskclick=${(ev: MouseEvent) => this.handleClickTask(ev, taskItem)}
                                            .task=${taskItem}>
                                        </widget-ai-task-100554>
                                    </div>
                                    `
                            : ''
                        }
                            `
                })}
                    </div>
                
                    <div class="message-prompt">
                        <textarea id="prompt_textarea"></textarea>
                        <button @click=${this.handleClickSend}>Enviar</button>
                    </div>
                    `
                : html`
                <widget-ai-interaction-100554 stepId=${this.stepIdSelected} taskId=${this.actualTaskDetails?.PK} .interaction=${this.actualTaskDetails?.iaCompressed?.interaction}></widget-ai-interaction-100554>

                `
            } 
        
    `;
    }

    handleClickHeader() {
        if (this.panel === 'Details') this.panel = 'Chat';
    }

    handleClickTask(ev: MouseEvent, task: TaskData) {

        if (ev.detail) this.stepIdSelected = (ev.detail as any).stepId;
        else this.stepIdSelected = undefined;
        this.actualTaskDetails = task;
        this.panel = 'Details';

    }

    handleClickTask2(task: TaskData) {

        this.actualTaskDetails = task;
        this.panel = 'Details';
    }

    async handleClickSend() {

        const prompt = this.textarea?.value;
        if (!prompt) return;
        const inputs = startPrompt(prompt);
        const task = await execAddTask(inputs, prompt);
        await afterPrompt(task, task.iaCompressed?.interaction?.payload);

    }

}
