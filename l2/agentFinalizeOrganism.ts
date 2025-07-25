/// <mls shortName="agentFinalizeOrganism" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { getPromptByHtml } from './_100554_aiPrompts';

import {
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    getAgentStepByAgentName,
    getNextStepIdAvaliable,
    notifyTaskChange,
    updateStepStatus
} from "./_100554_aiAgentHelper";

import {
    startNewInteractionInAiTask,
    startNewAiTask,
    executeNextStep,
    addNewStep,
    ClarificationValue,
    startClarification
} from "./_100554_aiAgentOrchestration";

const agentName = "agentFinalizeOrganism";
const project = 100554;

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Agent for create a organism from wireframe",
        visibility: "public",
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        }
    };
}

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    const taskTitle = "Planning...";
    if (!context || !context.message) throw new Error("Invalid context");

    if (!context.task) {
        // const inputs: any = await getPrompts(context.message.content || getPromptMock());
        const inputs: any = await getPrompts(await getPromptMock());
        await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt);
        return;
    }
    // const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
    // if (!step) throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);

    // if (!step.prompt) throw new Error(`[${agentName}] beforePrompt: No prompt found in step for this agent.`);
    // const inputs = await getPrompts(step.prompt);
    // await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);
}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    // if (!context || !context.message || !context.task) throw new Error("Invalid context");
    // const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    // if (!step) throw new Error(`[${agentName}] afterPrompt: No in progress interaction found.`);
    // context.task = await updateStepStatus(context.task, step.stepId, "completed");
    // notifyTaskChange(context);
    // await executeNextStep(context);
}

async function getPrompts(data: { userPrompt: string, defs: string }): Promise<mls.msg.IAMessageInputType[]> {
    if (!data.userPrompt || !data.defs) throw new Error(`Erro [${agentName}] getPrompts: invalid userPrompt`);
    const prompts = await getPromptByHtml({ project, shortName: agentName, folder: '', data })
    return prompts;
}

export async function readDefs(): Promise<mls.l4.BaseDefs> {
    return {
        "meta": {
            "projectId": 100554,
            "folder": "",
            "shortName": "organismNav",
            "type": "widget",
            "group": "petshop",
            "tags": [
                "lit",
                "organism"
            ]
        },
        "references": {
            "widgets": [],
            "plugins": [
            ],
            "statesRO": [],
            "statesRW": [],
            "statesWO": [],
            "imports": [
                "tableUser",
                "tableLinks"
            ]
        },
        "planning": {
            "generalDescription": "Barra de navegação principal do site, visível para todos os usuários.",
            "goal": "Exibir logo, links principais e opções de login/logout.",
            "userStories": [
                {
                    "story": "Como visitante, quero navegar facilmente entre as páginas principais do site.",
                    "derivedRequirements": [
                        {
                            "description": "Exibir links para home, catálogo, agendamento, contato e login."
                        }
                    ]
                },
                {
                    "story": "Como usuário logado, quero ver meu nome e opção de logout.",
                    "derivedRequirements": [
                        {
                            "description": "Exibir nome do usuário e botão de logout quando autenticado."
                        }
                    ]
                }
            ],
            "userRequestsEnhancements": [],
            "constraints": []
        }
    };
}

async function getPromptMock(): Promise<{ userPrompt: string, defs: string }> {
    const defs = await readDefs();
    return {
        userPrompt: "@@agentFinalizeOrganism { shortName: 'OrganismNav', project: 100554 } definir cores vivas para o site",
        defs: JSON.stringify(defs, null, 2)
    }
}

export async function getPayload1(context: mls.msg.ExecutionContext): Promise<PayLoad1> {
    if (!context || !context.task) throw new Error(`[${agentName}] [getPayload] Invalid context`);
    const agentStep = getAgentStepByAgentName(context.task, agentName); // Only one agent execution must exist in this task
    if (!agentStep) throw new Error(`[${agentName}] [getPayload] no agent found`);

    // get result
    const resultStep = agentStep.interaction?.payload?.[0];
    if (!resultStep || resultStep.type !== "clarification" || !resultStep.json) throw new Error(`[${agentName}] [getPayload] No step clarification found for this agent.`);
    let payload1: PayLoad1 | string = resultStep.json;
    if (typeof payload1 === "string") payload1 = JSON.parse(payload1) as PayLoad1;

    // get userPrompt
    payload1.userPrompt = agentStep?.interaction?.input.find((input) => input.type === 'human')?.content || '';
    payload1.defs = await readDefs();
    return payload1;
}

export interface PayLoad1 {
    userPrompt: string,
    defs: mls.l4.BaseDefs,
    organismSummary: string,
    organismPurpose: "form" | "view" | "mixed" | "wizard" | "dashboard",
    widgetsGroups: string[], // to request more informations of this group
    additionalInformations: string[],
    tables: string[], // tables names
}
