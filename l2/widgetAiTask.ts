/// <mls shortName="widgetAiTask" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { IcaLitElement } from './_100554_icaLitElement';
import { TaskData, AIStepStatus } from './_100554_iaChatInterfaces';

import {
    collab_money,
    collab_pause,
    collab_stop,
    collab_play,
    collab_clock,
    collab_triangle_exclamation,
    collab_check,
    collab_bug
} from './_100554_collabIcons';

import { getTotalCost, getInternalStatus } from './_100554_iaChatBase';

@customElement('widget-ai-task-100554')
export class WidgetAiTask100554 extends IcaLitElement {

    // @property() status: 'todo' | 'in progress' | 'done' | 'paused' | 'waitingforuser' = 'in progress';

    @property() taskid: string = '';
    @property() taskTitle: string = '';
    @property() taskUserName: string = '';
    @property() taskTime: string = '';

    @state() task: TaskData | undefined;


    async updated(changedProperties: Map<PropertyKey, unknown>) {
        super.updated(changedProperties);
        if (changedProperties.has('taskid') && changedProperties.get('taskid') !== '') {
            this.getTask(this.taskid);
        }
    }

    render() {

        const statusFake = 'in progress';
        const priceFake = '0.0001'; ///<span class="card-price"> ${collab_money}${getTotalCost(this.task)}</span>

        return html`<div @click=${this.onCardClick} class="card"> 
            <div class="card-header">
                ${this.renderIconTask()}
                <span class="card-user">@${this.taskUserName}</span>
                <span class="card-title">${this.taskTitle}</span>
                <span class="card-status ${statusFake.split(' ').join('-')}">${statusFake}</span>
                <span class="card-price"> ${collab_money}${priceFake}</span>
                <span class="card-time"> ${this.taskTime}</span>

                <div class="card-actions">
                    ${['in progress', 'waitingforuser', 'todo'].includes(statusFake)
                ? html`
                    <i>${collab_pause}</i>
                    <i>${collab_stop}</i>`
                : ['paused'].includes(statusFake)
                    ? html`
                        <i>${collab_play}</i>
                        <i>${collab_stop}</i>`
                    : html``
            }
                    
                </div>

            </div>
         </div>`;
    }


    renderIconTask() {
        const taskObj = {
            'pending': collab_clock,
            'in_progress': collab_clock,
            'completed': collab_check,
            'failed': collab_bug,
            'waiting_for_user': collab_triangle_exclamation
        }

        if (!this.task) return;

        const internalStatus = getInternalStatus(this.task);
        if (!internalStatus) return '';

        return html`<span @click= ${(e: MouseEvent) => { e.stopPropagation(); this.onStatusClick(e, internalStatus) }} class="task-icon ${internalStatus.status}">${taskObj[internalStatus.status]}</span>`
    }

    private getTask(taskId: string) {
        
    }


    private onStatusClick(ev: MouseEvent, data: { status: AIStepStatus, stepId: number }) {

        const event = new CustomEvent('taskclick', {
            detail: { stepId: data.stepId },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    }

    private onCardClick() {
        const event = new CustomEvent('taskclick', {
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    }

}
