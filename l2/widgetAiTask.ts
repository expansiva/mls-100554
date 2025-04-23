/// <mls shortName="widgetAiTask" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { IcaLitElement } from './_100554_icaLitElement';
import { getTask } from './_100554_msgDBController';

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

import { getTotalCost } from './_100554_iaChatBase';

@customElement('widget-ai-task-100554')
export class WidgetAiTask100554 extends IcaLitElement {

    // @property() status: 'todo' | 'in progress' | 'done' | 'paused' | 'waitingforuser' = 'in progress';

    @property() taskid: string = '';
    @property() messageid: string = '';
    @state() task: mls.msg.TaskData | undefined;

    async updated(changedProperties: Map<PropertyKey, unknown>) {
        super.updated(changedProperties);
        if (changedProperties.has('taskid') && changedProperties.get('taskid') !== '') {
            this.getTaskLocal(this.taskid);
        }
    }

    render() {

        const status = this.task ? this.task.status : 'in progress';
        const price = this.task ? getTotalCost(this.task) : '0.00';
        const title = this.task ? this.task.title : '...';

        return html`<div @click=${this.onCardClick} class="card"> 
            <div class="card-header">
                ${this.renderIconTask()}
                    <span class="card-status ${status.split(' ').join('-')}">${status}</span>
                    <span class="card-title"> ${title}</span>
                    <span class="card-price"> ${collab_money}${price}</span>
            </div>
         </div>`;
    }


    renderIconTask() {
        const taskObj = {
            'pending': collab_clock,
            'paused': collab_pause,
            'todo': collab_clock,
            'in progress': collab_clock,
            'done': collab_check,
            'failed': collab_bug,
            'waitingforuser': collab_triangle_exclamation
        }


        if (!this.task) return html`<spanclass="task-icon in progress ">${collab_clock}</span>`;
        return html`<span class="task-icon ${this.task.status.split(' ').join('-')} ">${taskObj[this.task.status]}</span>`;

        // const internalStatus = getInternalStatus(this.task);
        // if (!internalStatus) return '';

        // return html`<spanclass="task-icon ${internalStatus.status}">${taskObj[internalStatus.status]}</span>`
    }

    private async getTaskLocal(taskId: string) {
        const task = await getTask(taskId);
        if (task) this.task = task;
    }

    private onStatusClick(ev: MouseEvent, data: { status: mls.msg.AIStepStatus, stepId: number }) {

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
