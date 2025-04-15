/// <mls shortName="iaChatBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import * as iaChat from './_100554_iaChatInterfaces';


async function callAPI<T = any>(
    url: string,
    body: Record<string, any>,
    method: 'POST' | 'GET' = 'POST'
): Promise<T> {
    const response = await fetch(url, {
        method,
        credentials: 'omit',
        headers: {
            'Content-Type': 'application/json',
        },
        body: method === 'POST' ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro na requisição: ${response.status} - ${errorText}`);
    }

    return await response.json();
}


export async function execAddTask(
    inputAI: iaChat.IAMessageInputType[],
    message: string
): Promise<iaChat.ResponseAddMessageAI['task']> {
    const result = await callAPI<iaChat.ResponseAddMessageAI>('https://collab.codes/msg', {
        action: 'addMessageAI',
        userId: '20250306212720.1000',
        threadId: '20250304200000.1000',
        message,
        inputAI,
    });

    return result.task;
}

export async function execGetTaskUpdate(
    messageId: string,
    taskId: string,
): Promise<iaChat.TaskData> {
    const result = await callAPI<iaChat.ResponseGetTaskUpdate>('https://collab.codes/msg', {
        action: "getTaskUpdate",
        userId: "20250306212720.1000",
        messageId,
        taskId,
    });

    return result.task;
}

export async function execAddTaskAIInteraction(
    inputAI: iaChat.IAMessageInputType[],
    messageId: string,
    taskId: string,
    parentStepId: number,
) {
    const result = await callAPI<any>('https://collab.codes/msg', {
        action: "addTaskAIInteraction",
        userId: "20250306212720.1000",
        messageId,
        taskId,
        parentStepId,
        inputAI,
    });

    return result;
}

export async function execAddTaskAISteps(
    steps: iaChat.AIPayload[],
    messageId: string,
    taskId: string,
    parentStepId: number,
) {
    const result = await callAPI<any>('https://collab.codes/msg', {
        action: "addTaskAISteps",
        userId: "20250306212720.1000",
        messageId,
        taskId,
        parentStepId,
        steps
    });

    return result;
}

export async function execUpdateStepStatus(
    messageId: string,
    taskId: string,
    stepId: number,
    status: iaChat.AIStepStatus
) {
    const result = await callAPI<any>('https://collab.codes/msg', {
        action: "updateStepStatus",
        userId: "20250306212720.1000",
        messageId,
        taskId,
        stepId,
        status
    });

    return result;
}

export function getTotalCost(task: iaChat.TaskData): string {
    let tot = 0;
    const interaction = task.iaCompressed?.interaction;
    if (!interaction || !interaction.payload) return tot.toFixed(4);

    const sumCosts = (interaction: iaChat.AIInteraction) => {
        tot += interaction.cost ? interaction.cost : 0;
        if (interaction.payload && interaction.payload.length > 0) {
            interaction.payload.forEach((p) => {
                if (p.interaction) sumCosts(p.interaction)
            })
        }
    };

    sumCosts(interaction);
    return tot.toFixed(4);
}

export function getInternalStatus(task: iaChat.TaskData): { status: iaChat.AIStepStatus; stepId: number } | undefined {
    const interaction = task.iaCompressed?.interaction;
    if (!interaction || !interaction.payload) return;

    const priority: iaChat.AIStepStatus[] = [
        'failed',
        'waiting_for_user',
        'pending',
        'in_progress',
        'completed',
    ];

    const found: Partial<Record<iaChat.AIStepStatus, number[]>> = {};
    const collectStatuses = (interaction: iaChat.AIInteraction) => {
        if (!interaction.payload) return;

        for (const step of interaction.payload) {
            if (!found[step.status]) found[step.status] = [];
            found[step.status]!.push(step.stepId);

            if (step.interaction) {
                collectStatuses(step.interaction);
            }

            if (step.nextSteps?.length) {
                for (const next of step.nextSteps) {
                    if (!found[next.status]) found[next.status] = [];
                    found[next.status]!.push(next.stepId);

                    if (next.interaction) {
                        collectStatuses(next.interaction);
                    }
                }
            }
        }
    };

    collectStatuses(interaction);

    for (const status of priority) {
        const stepIds = found[status];
        if (stepIds && stepIds.length > 0) {
            return { status, stepId: stepIds[0] };
        }
    }

    return;
}


export function getInteractionByStep(interaction: iaChat.AIInteraction, stepId: number) {

    let item: iaChat.AIPayload | undefined

    const getPayload = (interaction: iaChat.AIInteraction) => {
        if (interaction.payload && interaction.payload.length > 0) {
            interaction.payload.forEach((p) => {
                if (p.stepId === stepId) {
                    item = p;
                    return;
                }
                if (p.interaction) getPayload(p.interaction);

            });
        }
    };

    getPayload(interaction);
    return item;
}
