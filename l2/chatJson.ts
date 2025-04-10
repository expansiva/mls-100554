/// <mls shortName="chatJson" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { TaskData } from './_100554_iaChatInterfaces';

interface IChatUser {
    type: 'user',
    user: string,
    time: string,
    message: string
}

interface IChatTask {
    type: 'task',
    task: TaskData
}

let exampleHtmlReturn = `/// <mls shortName="wcDateRangePicker" project="100554" enhancement="_100554_enhancementLit" groupName="calendar" />

import { html, LitElement, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('wc-date-range-picker-100554')
export class WCDateRangePicker extends LitElement {

    @property({ type: String }) startDate: string | undefined; // Data inicial no formato YYYY-MM-DD
    @property({ type: String }) endDate: string | undefined;   // Data final no formato YYYY-MM-DD
    @property({ type: String }) errorMessage: string | undefined = 'A data final deve ser maior que a data inicial';

    @query('#start-date') startDateInput!: HTMLInputElement;
    @query('#end-date') endDateInput!: HTMLInputElement;

    render() {
        return html\`
        <div>
            <label for="start-date">Data de Início:</label>
            <input
                id="start-date"
                type="date"
                .value=\${this.startDate || ''}
                @change=\${this.handleStartDateChange}
            />

            <label for="end-date">Data Final:</label>
            <input
                id="end-date"
                type="date"
                .value=\${this.endDate || ''}
                @change=\${this.handleEndDateChange}
            />
            
            <div class="form_error_message" ?hidden=\${!this.errorMessage}>
                \${this.errorMessage}
            </div>
        </div>
        \`;
    }

    private handleStartDateChange() {
        const newStartDate = this.startDateInput.value;
        const endDateValue = this.endDate ? new Date(this.endDate).getTime() : undefined;

        if (endDateValue && new Date(newStartDate).getTime() > endDateValue) {
            this.errorMessage = 'A data inicial deve ser menor ou igual à data final';
        } else {
            this.errorMessage = '';
            this.startDate = newStartDate;
        }

        this.requestUpdate();
    }

    private handleEndDateChange() {
        const newEndDate = this.endDateInput.value;
        const startDateValue = this.startDate ? new Date(this.startDate).getTime() : undefined;

        if (startDateValue && new Date(newEndDate).getTime() < startDateValue) {
            this.errorMessage = 'A data final deve ser maior ou igual à data inicial';
        } else {
            this.errorMessage = '';
            this.endDate = newEndDate;
        }

        this.requestUpdate();
    }
}`


export type IChat = (IChatUser | IChatTask)[]

export const chat: IChat = [
    {
        user: 'Guilherme',
        message: 'Criar um widget',
        time: '09:21',
        type: 'user'
    },
    {
        type: 'task',
        task: {
            PK: "task#1744287679401",
            SK: "metadata",
            title: "@@ criar widget",
            owner: "20250306212720.1000",
            team: "unassigned",
            status: 'waitingforuser',
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
                            content: "criar um widget"
                        }
                    ],
                    cost: 0.0011,
                    trace: [
                        "provider: openai model:gpt-4o inputTokens:317 outputTokens:29 inputCost:2.50/1M outputCost:10.00/1M total:$0.0011 llmTime: 1242ms"
                    ],
                    payload: [
                        {
                            type: "clarification",
                            clarificationMessage: "Poderia fornecer mais detalhes sobre o widget que você deseja criar? Por exemplo, o tipo de widget, características específicas, funcionalidades desejadas e qualquer outro detalhe que considere relevante.",
                            htmlForm: "<form> <label for='widgetType'>Tipo de Widget:</label> <input type='text' id='widgetType' name='widgetType'><br><br> <label for='features'>Características Específicas:</label> <textarea id='features' name='features'></textarea><br><br> <label for='functionalities'>Funcionalidades Desejadas:</label> <textarea id='functionalities' name='functionalities'></textarea><br><br> <label for='otherDetails'>Outros Detalhes:</label> <textarea id='otherDetails' name='otherDetails'></textarea><br><br> <input type='submit' value='Enviar'> </form>",
                            status: "completed",
                            stepId: 1,
                            interaction: {
                                cost: 0.0002,
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
                                payload: [
                                    {
                                        type: "result",
                                        interaction: null,
                                        nextSteps: [],
                                        result: exampleHtmlReturn,

                                        status: 'completed',
                                        stepId: 2,
                                        title: ''
                                    }

                                ],
                                trace: ["provider: openai model:gpt-4o inputTokens:617 outputTokens:49 inputCost:2.50/1M outputCost:10.00/1M total:$0.0002 llmTime: 1345ms"]
                            },
                            nextSteps: null,
                            title: "Error, step type not recognized"
                        }
                    ]
                }
            }
        }
    }
]


