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

    @state() task: TaskData = {
        PK: "task#1744287679401",
        SK: "metadata",
        title: "@@ criar widget de data , com inicio e final, sem horas",
        owner: "20250306212720.1000",
        team: "unassigned",
        status: "done",
        last_updated: 1744287681703,
        last_update_log: "Task started by  at 2025-04-10T12:21:20.244Z",
        source: "",
        iaCompressed: {
            interaction: {
                input: [
                    {
                        type: "system",
                        content: "Você é um planejador que irá coordenar agentes e ferramentas para executar tarefas complexas com base no prompt do usuário.\n\nSeu objetivo é analisar o prompt do usuário e decidir o próximo passo.\n\n1. Se faltar informações importantes para continuar, retorne apenas uma subtarefa do tipo `clarification`. Sempre que possível, inclua um `htmlForm` com campos e opções para facilitar a resposta do usuário.\n2. Se a tarefa puder ser resolvida diretamente com uma resposta, retorne uma subtarefa do tipo `result`.\n3. Decida qual agente, ferramenta ou base de conhecimento (RAG) será executado no próximo passo.\n4. Nunca retorne múltiplas subtarefas. Retorne **apenas uma subtarefa por vez** neste passo inicial."
                    },
                    {
                        type: "system",
                        content: "Agentes disponíveis:\n\t•\tagentPlannerNewPage: planejamento para a criação de novas páginas no sistema, será pedido mais informações ao usuário se necessário.\n\t•\tagentPlannerNewWidget: planejamento para a criação de componentes/widgets, será pedido mais informações ao usuário se necessário.\n\t•\tagentPlannerNewAPI: criação de endpoints ou APIs, será pedido mais informações ao usuário se necessário.\n\t•\tagentSupportExternal: suporte para usuários externos. Executar rag1 antes de enviar o prompt.\n\t•\tagentSupportInternal: suporte para usuários internos. Executar os RAGs rag1 e rag2 antes de enviar o prompt."
                    },
                    {
                        type: "human",
                        content: "criar widget de data , com inicio e final, sem horas"
                    }
                ],
                cost: 0.0011,
                trace: [
                    "provider: openai model:gpt-4o inputTokens:317 outputTokens:29 inputCost:2.50/1M outputCost:10.00/1M total:$0.0011 llmTime: 1242ms"
                ],
                payload: [
                    {
                        type: "clarification",
                        clarificationMessage: "Preciso de mais informações, é um web component ?",
                        status: "completed",
                        stepId: 1,
                        interaction: null,
                        nextSteps: null,
                        title: "Error, step type not recognized"
                    },
                    {
                        type: "clarification",
                        clarificationMessage: "Preciso de mais informações, é um web component ?",
                        status: "completed",
                        stepId: 2,
                        interaction: {
                            input: [],
                            cost: 0.001,
                            payload: [
                                {
                                    type: "clarification",
                                    clarificationMessage: "Preciso de mais informações, é um web component 2 ?",
                                    status: "waiting_for_user",
                                    stepId: 3,
                                    interaction: null,
                                    nextSteps: null,
                                    title: ""
                                },
                            ],
                            trace: []
                        },
                        nextSteps: null,
                        title: ''
                    }
                ]
            }
        }
    }

    renderIconTask() {
        const taskObj = {
            'pending': collab_clock,
            'in_progress': collab_clock,
            'completed': collab_check,
            'failed': collab_bug,
            'waiting_for_user': collab_triangle_exclamation
        }

        const internalStatus = getInternalStatus(this.task);
        console.info(internalStatus)
        if (!internalStatus) return '';

        return html`<span @click= ${(e: MouseEvent) => { e.stopPropagation(); this.onStatusClick(e, internalStatus) }} class="task-icon ${internalStatus.status}">${taskObj[internalStatus.status]}</span>`
    }

    render() {

        return html`<div @click=${this.onCardClick} class="card"> 
            <div class="card-header">
                ${this.renderIconTask()}
                <span class="card-title">${this.task.PK}</span>
                <span class="card-status ${this.task.status.split(' ').join('-')}">${this.task.status}</span>
                <span class="card-price"> ${collab_money}${getTotalCost(this.task)}</span>
                <div class="card-actions">
                    ${['in progress', 'waitingforuser', 'todo'].includes(this.task.status)
                ? html`
                    <i>${collab_pause}</i>
                    <i>${collab_stop}</i>`
                : ['paused'].includes(this.task.status)
                    ? html`
                        <i>${collab_play}</i>
                        <i>${collab_stop}</i>`
                    : html``
            }
                    
                </div>

            </div>
         </div>`;
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
