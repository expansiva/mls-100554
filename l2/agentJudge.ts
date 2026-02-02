/// <mls fileReference="_100554_/l2/agentJudge.ts" enhancement="_blank" />

import { IAgent, svg_agent } from '/_100554_/l2/aiAgentBase.js';
import { getPromptByHtml } from '/_100554_/l2/aiPrompts.js';
import { createModel } from '/_100554_/l2/collabLibModel.js';

import {
    startNewInteractionInAiTask,
    startNewAiTask,
    executeNextStep,
    addNewStep
} from "/_100554_/l2/aiAgentOrchestration.js";

import {
    getNextFlexiblePendingStep,
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    updateStepStatus,
    updateTaskTitle,
    getNextPendentStep,
    appendLongTermMemory
} from "/_100554_/l2/aiAgentHelper.js";

const agentName = "agentJudge";

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Agente de teste",
        visibility: "public",
        scope: [],
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        },
        async replayForSupport(context: mls.msg.ExecutionContext, payload: mls.msg.AIPayload[]): Promise<void> {
            return _replayForSupport(context, payload);
        }
    }
};

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    const taskTitle = "Planning";

    if (!context || !context.message) throw new Error("Invalid context");
    if (!context.task) {



        let pp = context.message.content
            .replace(`@@ ${agentName}`, '')
            .replace(`@@_100554_${agentName}`, '')
            .replace(`@@ _100554_${agentName}`, '')
            .replace(`@@ _100554_/l2/${agentName}`, '')
            .replace(`@@_100554_/l2/${agentName}`, '')
            .replace(`@@${agentName}`, '').trim();
        
        let data = JSON.parse(pp);
        const inputs = await getPrompts(data);

        await startNewAiTask(
            agentName,
            taskTitle,
            context.message.content,
            context.message.threadId,
            context.message.senderId,
            inputs, context,
            _afterPrompt
        );
        return;
    }

    const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);

    if (!step) throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);

    context = await updateStepStatus(context, step.stepId, "in_progress");

    if (!step.prompt) throw new Error(`[${agentName}] beforePrompt: No prompt found in step for this agent.`);

    const data = JSON.parse(step.prompt);
    const inputs = await getPrompts( data);
    await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);

}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {

    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No pending interaction found.`);
    context = await updateStepStatus(context, step.stepId, "completed");

    if (!context.task) throw new Error("Invalid context 2");
    const payload = getNextFlexiblePendingStep(context.task) as mls.msg.AIPayload | null;

    if (payload) context = await updateStepStatus(context, payload.stepId, "completed");
    if (!context.task) throw new Error("Invalid context task");
    context.task = await updateTaskTitle(context.task, "Updating links");

    await executeNextStep(context);

}

const _replayForSupport = async (context: mls.msg.ExecutionContext, payload: mls.msg.AIPayload[]): Promise<void> => {
    const step = payload[0] as mls.msg.AIPayload;
    if (!step || step.type !== 'flexible') throw new Error('Invalid step for replay');
}


export async function getPrompts(info: any): Promise<mls.msg.IAMessageInputType[]> {

    if (!info) throw new Error(`Erro [${agentName}] getPrompts: invalid info`);

    const data = {
        title1: info.title1,
        context1: info.context1,
        title2: info.title2,
        context2: info.context2,
    };

    const prompts = await getPromptByHtml({ project: 100554, shortName: agentName, folder: '', data })
    return prompts;
}