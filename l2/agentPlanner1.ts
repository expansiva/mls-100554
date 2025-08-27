/// <mls shortName="agentPlanner1" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';

import {
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    calculateStepsStatistics,
    updateStepStatus,
    getStepById,
    updateTaskTitle,
    notifyTaskChange
} from "./_100554_aiAgentHelper";

import {
    systemAgentsAvailable,
    systemRagsAvailable,
    systemToolsAvailable,
    addRAGAdditionalInformation,
    preferModelType,
    getPromptByHtml
} from "./_100554_aiPrompts";


import {
    startNewAiTask,
    executeNextStep,
    startNewInteractionInAiTask,
} from "./_100554_aiAgentOrchestration";

const agentName = "agentPlanner1";

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "first agent for general prompts",
        visibility: "private",
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        },
        async beforeClarification(context: mls.msg.ExecutionContext, stepId: number): Promise<HTMLDivElement | null> {
            return _beforeClarification(context, stepId);
        }
    }
};

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    const taskTitle = "Planning";
    if (!context || !context.message) throw new Error("Invalid context");
    if (!context.task) {
        // using temporary context, create a new task
        const inputs = await getPrompts(context.message.content, null);
        await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt);
    } else {
        const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
        if (!step) {
            throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
        }
        context = await updateStepStatus(context, step.stepId, "in_progress");
        const inputs = await getPrompts(step.prompt, step.rags);
        await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);
    }
}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {

    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No pending interaction found.`);
    const { flexible, result } = calculateStepsStatistics([step], true);
    if (flexible > 0) throw new Error(`[${agentName}] afterPrompt: error, Flexible step found.`);
    context =  await updateStepStatus(context, step.stepId, "completed");
    await executeNextStep(context);

}

const _beforeClarification = async (context: mls.msg.ExecutionContext, stepId: number): Promise<HTMLDivElement | null> => {
    if (!context.task) throw new Error("[_beforeClarification] Invalid context.task");
    const step = getStepById(context.task, stepId) as mls.msg.AIClarificationStep;
    if (!step) throw new Error(`[_beforeClarification] Invalid step: ${stepId} on task: ${context.task.PK}`);
    const msg = `Invalid return from agent: ${agentName} not supported return of type clarification`
    await updateStepStatus(context, stepId, 'failed', msg);
    const task = await updateTaskTitle(context.task, msg);
    context.task = task;
    notifyTaskChange(context);
    const element = prepareHtmlClarification();
    return element;
}

function prepareHtmlClarification(
): HTMLDivElement {
    const div: HTMLDivElement = document.createElement('div');
    div.innerHTML = `Invalid return from LLM, ${agentName} don't use payload of type Clarification, please try again!`;
    return div;
}

export async function getPrompts(prompt: string | undefined, rags: string[] | null): Promise<mls.msg.IAMessageInputType[]> {
    if (!prompt || prompt.length < 3) throw new Error("Invalid Prompt");

    const agents = systemAgentsAvailable();
    const ragsA = systemRagsAvailable();
    const tools = await systemToolsAvailable();

    const data = {
        mode: preferModelType("cost"),
        agentsAvailable: agents.content,
        ragsAvailable: ragsA.content,
        toolsAvailable: tools.content,
        humanPrompt: prompt
    };
    const prompts = await getPromptByHtml({ project: 100554, shortName: 'agentPlanner1', folder: '', data })

    addRAGAdditionalInformation(rags, prompts);

    return prompts;
}