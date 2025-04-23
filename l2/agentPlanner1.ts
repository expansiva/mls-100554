/// <mls shortName="agentPlanner1" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent } from './_100554_aiAgentBase';

import {
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    calculateStepsStatistics,
    updateStepStatus
} from "./_100554_aiAgentHelper";

import {
    systemAgentsAvailable,
    systemRagsAvailable,
    systemToolsAvailable,
    systemReturnJsonFormat,
    addRAGAdditionalInformation,
    preferModelType
} from "./_100554_aiPrompts";


import {
    startNewAiTask,
    executeNextStep,
    startNewInteractionInAiTask
} from "./_100554_aiAgentOrchestration";

const agentName = "agentPlanner1";

export function createAgent(): IAgent {
    return {
        agentName,
        agentDescription: "first agent for general prompts",
        visibility: "private",
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        }
    };
}

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    const taskTitle = "Planning";
    if (!context || !context.message) throw new Error("Invalid context");
    if (!context.task) {
        // using temporary context, create a new task
        const inputs = getPrompts(context.message.content, null);
        await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt);
    } else {
        const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
        if (!step) {
            throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
        }
        context.task = await updateStepStatus(context.task, step.stepId, "in_progress");
        const inputs = getPrompts(step.prompt, step.rags);
        await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt);
    }
}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No pending interaction found.`);
    const { flexible } = calculateStepsStatistics([step], true);
    if (flexible > 0) throw new Error(`[${agentName}] afterPrompt: error, Flexible step found.`);
    context.task = await updateStepStatus(context.task, step.stepId, "completed");
    await executeNextStep(context);
}

export function getPrompts(prompt: string | undefined, rags: string[] | null): mls.msg.IAMessageInputType[] {
    if (!prompt || prompt.length < 3) throw new Error("Invalid Prompt");
    const prompts: mls.msg.IAMessageInputType[] = [];
    prompts.push(systemMainInstruction());
    prompts.push(systemAgentsAvailable());
    prompts.push(systemRagsAvailable());
    prompts.push(systemToolsAvailable());
    addRAGAdditionalInformation(rags, prompts); // optional
    prompts.push(systemReturnJsonFormat());
    prompts.push({
        type: 'human',
        content: prompt
    });
    return prompts;
}

export function systemMainInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `${preferModelType("cost")}
Você é um coordenador de agentes e ferramentas para executar tarefas complexas com base no prompt do usuário.
Seu único objetivo é analisar o prompt do usuário e decidir qual agente chamar.
1. Se faltar informações apenas para decidir o agente ou a resposta, retorne apenas uma subtarefa do tipo \`clarification\`.
2. Se a tarefa puder ser resolvida diretamente com uma resposta, retorne uma subtarefa do tipo \`result\`.
3. Decida qual agente, ferramenta ou base de conhecimento (RAG) será executado no próximo passo.
4. Nunca retorne múltiplas subtarefas. Retorne **apenas uma subtarefa por vez** neste passo inicial.
5. Se retornar um agent, no atributo prompt, deve repetir o prompt original do usuário.
6. Lembre: seu único objetivo é identificar qual agente chamar, não elaborar mais conteúdos.
`
    };
}