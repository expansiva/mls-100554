/// <mls shortName="agentNewModule" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { forceServiceInstance } from './_100554_libCommom';
import { preferModelType, getPromptByHtml } from './_100554_aiPrompts';
import { initState } from './_100554_collabState';

import {
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    updateStepStatus,
    getNextPendentStep,
    updateTaskTitle,
    notifyTaskCompleted,
    notifyTaskChange
} from "./_100554_aiAgentHelper";

import {
    startNewInteractionInAiTask,
    startNewAiTask,
    executeNextStep
} from "./_100554_aiAgentOrchestration";

const agentName = "agentNewModule";
const project = 100554;
const enhancement = '_100554_enhancementLit';

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Agente especializado em manutenção de componentes",
        visibility: "public",
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

// todo: fazer html com explicações

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    const taskTitle = "Creating.";
    if (!context || !context.message) throw new Error("Invalid context");

    if (!context.task) {
        const inputs: any = await getPrompts(context.message.content); /// passei string default
        await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt);
    } else {
        const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
        if (!step) {
            throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
        }
        context.task = await updateStepStatus(context.task, step.stepId, "in_progress");

        if (!step.prompt) throw new Error(`[${agentName}] beforePrompt: No prompt found in step for this agent.`);

        const inputs = await getPrompts(step.prompt); /// passei string default

        await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);
    }
}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No pending interaction found.`);

    context.task = await updateStepStatus(context.task, step.stepId, "completed");
    const payload = getNextPendentStep(context.task) as mls.msg.AIPayload | null;

    // TODO: implemntar o que vai ser preciso fazer

    notifyTaskChange(context);
    await executeNextStep(context);
}

const _replayForSupport = async (context: mls.msg.ExecutionContext, payload: mls.msg.AIPayload[]): Promise<void> => {
    const step = payload[0] as mls.msg.AIPayload;
    if (!step || step.type !== 'flexible') throw new Error('Invalid step for replay');
    if (!step.result || !step.result.meta) throw new Error('Invalid step result for replay');

    // TODO: implemntar o que vai ser preciso fazer

}


export async function getPrompts(info: string): Promise<mls.msg.IAMessageInputType[]> {

    if (!info ) throw new Error(`Erro [${agentName}] getPrompts: invalid info`);

    initState('agentNewModule', {
        model: preferModelType('code'),
        teste: 'teste de texto',        
    });

    const prompts = await getPromptByHtml({ project: 100554, shortName: 'agentGenerateDefs', folder: '', state: 'agentNewModule' })
    
    return prompts;
}
