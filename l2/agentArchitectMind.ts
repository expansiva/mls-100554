/// <mls fileReference="_100554_/l2/agentArchitectMind.ts" enhancement="_blank"/>

import { IAgent, svg_agent } from '/_100554_/l2/aiAgentBase.js';
import { getPromptByHtml } from '/_100554_/l2/aiPrompts.js';
import { getAllDefs } from '/_100554_/l2/libMindMap.js';

import {
    startNewInteractionInAiTask,
    startNewAiTask,
    executeNextStep,
} from "/_100554_/l2/aiAgentOrchestration.js";

import {
    getNextFlexiblePendingStep,
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    updateStepStatus,
    updateTaskTitle,
} from "/_100554_/l2/aiAgentHelper.js";

const agentName = "agentArchitectMind";

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Agente arquiteto",
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

        let data = pp;
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

    const data = step.prompt;
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

    const data = {
        defs: await getDefs(),
        prompt:info
    };

    const prompts = await getPromptByHtml({ project: 100554, shortName: agentName, folder: '', data })
    return prompts;
}


export async function getDefs():Promise<string> {

    const defs = await getAllDefs();
    const ret:any = {};
    Object.keys(defs).forEach((key) => {

        ret[key] = defs[key].defs.asIs;
        
    })

    return JSON.stringify(ret);

}