/// <mls shortName="agentGenerateReferencesDraft" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { getPromptByHtml } from './_100554_aiPrompts';
import { getTask } from './_100554_msgDBController';

import {
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    getAgentStepByAgentName,
    notifyTaskChange,
    updateTaskTitle,
    updateStepStatus
} from "./_100554_aiAgentHelper";

import {
    startNewInteractionInAiTask,
    startNewAiTask,
    executeNextStep,
} from "./_100554_aiAgentOrchestration";

const agentName = "agentGenerateReferencesDraft";
const project = 100554;

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Agent for create a new Organism",
        visibility: "private",
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        },
        async replayForSupport(context: mls.msg.ExecutionContext, payload: mls.msg.AIPayload[]): Promise<void> {
            return _replayForSupport(context, payload);
        }
    };
}

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    const taskTitle = "Analyzing...";
    if (!context || !context.message) throw new Error("Invalid context");

    if (!context.task) {
        const organismFullName = '_100554_organismServicosDestaque';
        const inputs: any = await getPrompts(organismFullName);
        await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt, { 'organismFullName': organismFullName.toString() });
        return;
    }

    const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
    if (!step) {
        throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
    }
    const organismFullName = String(step.prompt);
    if (!organismFullName) throw new Error('invalid prompt, must be a organism index');
    const inputs: any = await getPrompts(organismFullName);
    await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);

}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {

    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No in progress interaction found.`);
    context = await updateStepStatus(context, step.stepId, "completed", "no more agents");
    notifyTaskChange(context);
    if (!context.task) throw new Error("Invalid context task");
    context.task = await updateTaskTitle(context.task, "Ok, see result");
    await executeNextStep(context);

}

const _replayForSupport = async (context: mls.msg.ExecutionContext, payload: mls.msg.AIPayload[]): Promise<void> => {
    throw new Error("[replayForSupport] not implemented");
}

async function getPrompts(organismFullName: string): Promise<mls.msg.IAMessageInputType[]> {

    const data: Record<string, string> = {
        organismDetails: await getContentByExtension(organismFullName, 'ts') || '',
    }

    const prompts = await getPromptByHtml({ project, shortName: agentName, folder: '', data })
    return prompts;

}

async function getContentByExtension(fullName: string, ext: 'html' | 'ts' | 'style' | 'defs') {
    try {
        const models = mls.editor.models[fullName];
        if (!models) throw new Error(`[${agentName}][getContentByExtension]:Not found models for file:` + fullName);
        if (!models[ext]) return '';
        return models[ext]?.model.getValue();
    } catch (e: any) {
        throw new Error(`[${agentName}][getContentByExtension]: ${e.message}`);
    }
}

