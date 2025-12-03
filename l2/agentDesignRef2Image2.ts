/// <mls shortName="agentDesignRef2Image2" project="100554" enhancement="_blank" />

import { IAgent, svg_agent } from '/_100554_/l2/aiAgentBase.js';
import { getPromptByHtml } from '/_100554_/l2/aiPrompts.js';
import {
    getNextInProgressStepByAgentName,
    updateStepStatus,
    updateTaskTitle,
    getNextPendingStepByAgentName,
    getAgentStepByAgentName    
} from "/_100554_/l2/aiAgentHelper.js";

import { getPayload1 } from '/_100554_/l2/agentDesignRef2Image.js';

import { startNewAiTask, executeNextStep, startNewInteractionInAiTask } from "/_100554_/l2/aiAgentOrchestration.js";

const agentName = "agentDesignRef2Image2";

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "DesignRef 2 Image",
        visibility: "public",
        scope: [],
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        },
    }
};

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {

    const taskTitle = "Creating";
    if (!context || !context.message) throw new Error(`[${agentName}.beforePrompt] Invalid context`);
    if (!context.task) {
        const inputs = await getPrompts(context.message.content);
        await startNewAiTask(
            agentName,
            taskTitle,
            context.message.content,
            context.message.threadId,
            context.message.senderId,
            inputs,
            context,
            _afterPrompt
        ).catch((err) => {
            throw new Error(err.message)
        });
        return;
    }

    const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
    if (!step) {
        throw new Error(`[${agentName}](beforePrompt) No pending step found for this agent.`);
    }
    const inputs = await getPrompts(getPayload1(context).prompt);
    await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);
}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    if (!context || !context.message || !context.task) throw new Error(`[${agentName}.afterPrompt] Invalid context`);
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}.afterPrompt] No pending interaction found.`);
    context = await updateStepStatus(context, step.stepId, "completed");
    if (!context.task) throw new Error(`[${agentName}.afterPrompt]Invalid context task`);
    context.task = await updateTaskTitle(context.task, "Hero Image created");

    const stepIdPayLoad = step.interaction?.payload?.[0]?.stepId || -1;
    if (stepIdPayLoad > 0) {
        context = await updateStepStatus(context, stepIdPayLoad, "completed");
    }
    await executeNextStep(context);
}

async function getPrompts(data: string): Promise<mls.msg.IAMessageInputType[]> {
    const dataPrompt = {
        userPrompt: JSON.stringify(data)
    };
    const rc = await getPromptByHtml({ folder: '', project: 100554, shortName: agentName, data: dataPrompt });
    return rc;
}

export interface PayLoad2 {
    dataUrl: string;
}

export function getPayload2(context: mls.msg.ExecutionContext): PayLoad2 {
    if (!context || !context.task) throw new Error(`[${agentName}] [getPayload] Invalid context`);
    const agentStep = getAgentStepByAgentName(context.task, agentName); // Only one agent execution must exist in this task
    if (!agentStep) throw new Error(`[${agentName}] [getPayload] no agent found`);

    // get result
    const resultStep = agentStep.interaction?.payload?.[0];
    if (!resultStep || resultStep.type !== "flexible" || !resultStep.result) throw new Error(`[${agentName}] [getPayload] No step flexible found for this agent.`);
    return { dataUrl: resultStep.result?.dataUrl || "" };
}