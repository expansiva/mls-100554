/// <mls shortName="agentImage2DesignRef" project="100554" enhancement="_blank" />

import { IAgent, svg_agent } from '/_100554_/l2/aiAgentBase.js';
import { getPromptByHtml } from '/_100554_/l2/aiPrompts.js';
import {
    getNextInProgressStepByAgentName,
    updateStepStatus,
    updateTaskTitle,
} from "/_100554_/l2/aiAgentHelper.js";

import { startNewAiTask, executeNextStep } from "/_100554_/l2/aiAgentOrchestration.js";

const agentName = "agentImage2DesignRef";

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Image 2 design",
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
    }
}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    if (!context || !context.message || !context.task) throw new Error(`[${agentName}.afterPrompt] Invalid context`);
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}.afterPrompt] No pending interaction found.`);
    context = await updateStepStatus(context, step.stepId, "completed");
    if (!context.task) throw new Error(`[${agentName}.afterPrompt]Invalid context task`);
    context.task = await updateTaskTitle(context.task, "Svg created");
    await executeNextStep(context);
}

async function getPrompts(data: string): Promise<mls.msg.IAMessageInputType[]> {
    const dataPrompt = {
        userPrompt: JSON.stringify(data)
    };
    const rc = await getPromptByHtml({ folder: '', project: 100554, shortName: agentName, data: dataPrompt });
    return rc;
}

