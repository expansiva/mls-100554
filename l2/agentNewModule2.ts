/// <mls shortName="agentNewModule2" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { forceServiceInstance } from './_100554_libCommom';
import { preferModelType, getPromptByHtml } from './_100554_aiPrompts';
import { initState } from './_100554_collabState';
import './_100554_widgetQuestionsForClarification';

import {
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    updateStepStatus,
    getNextPendentStep,
    getStepById,
    updateTaskTitle,
    notifyTaskCompleted,
    getInteractionStepId,
    getNextStepIdAvaliable,
    notifyTaskChange
} from "./_100554_aiAgentHelper";

import {
    startNewInteractionInAiTask,
    startNewAiTask,
    executeNextStep,
    addNewStep,
    ClarificationValue,
    toLLMClarification,
    startClarification
} from "./_100554_aiAgentOrchestration";

const agentName = "agentNewModule2";
const project = 100554;

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Agent for create a new Module - 2",
        visibility: "private",
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        },
        async replayForSupport(context: mls.msg.ExecutionContext, payload: mls.msg.AIPayload[]): Promise<void> {
            return _replayForSupport(context, payload);
        },
        async beforeClarification(context: mls.msg.ExecutionContext, stepId: number): Promise<HTMLDivElement | null> {
            return _beforeClarification(context, stepId);
        },
        async afterClarification(context: mls.msg.ExecutionContext, stepId: number, clarification: ClarificationValue): Promise<void> {
            return _afterClarification(context, stepId, clarification);
        }
    };
}

export interface DataForPrompt {
    userPrompt: string;
    clarification: ClarificationValue;
}

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    const taskTitle = "Planning 2...";
    if (!context || !context.message) throw new Error("Invalid context");

    if (!context.task) {
        throw new Error(`[${agentName}] [beforePrompt]: no context task.`);
    }
    const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
    if (!step) {
        throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
    }
    context.task = await updateStepStatus(context.task, step.stepId, "in_progress");
    if (!step.prompt) throw new Error(`[${agentName}] beforePrompt: No prompt found in step for this agent.`);
    try {
        const prompt: DataForPrompt = JSON.parse(step.prompt);
        console.log(`[${agentName}] [beforePrompt]:`, prompt)
        const inputs = await getPrompts(prompt);
        await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);
    } catch (e: any) {
        throw new Error(`[${agentName}] [beforePrompt]: Invalid prompt: ` + e.message || '?');
    }
}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No in progress interaction found.`);
    notifyTaskChange(context);
    await executeNextStep(context);
}

const _replayForSupport = async (context: mls.msg.ExecutionContext, payload: mls.msg.AIPayload[]): Promise<void> => {
    const step = payload[0] as mls.msg.AIPayload;
    if (!step || step.type !== 'flexible') throw new Error('Invalid step for replay');
    if (!step.result || !step.result.meta) throw new Error('Invalid step result for replay');

    // TODO: implemntar o que vai ser preciso fazer

}

const _beforeClarification = async (context: mls.msg.ExecutionContext, stepId: number): Promise<HTMLDivElement | null> => {
    return startClarification(context, stepId);
}


const _afterClarification = async (context: mls.msg.ExecutionContext, stepId: number, clarification: ClarificationValue): Promise<void> => {
    if (!context || !context.message || !context.task) throw new Error("[${agentName}] [afterClarification] Invalid context");
    if (!clarification) throw new Error("[${agentName}] [afterClarification] Invalid json after clarification");

    const step: mls.msg.AIPayload | null = getStepById(context.task, stepId);
    if (!step || step.type !== "clarification") {
        throw new Error(`[${agentName}] [afterClarification] No found step: ${stepId} for this agent.`);
    }

    // add step for agentNewModule2

    const interactionId: number | null = getInteractionStepId(context.task, step.stepId);
    if (!interactionId) throw new Error("[${agentName}] [afterClarification] Not found interactionId in pending step")
    const payload: mls.msg.AIPayload | null = getStepById(context.task, interactionId);
    if (!payload || payload.type !== "agent") throw new Error("[${agentName}] [afterClarification] Clarification or tool step not bellow a agent");

    const promptUser = payload.interaction?.input.find((input) => input.type === 'human')?.content || '';

    const dataForNextAgent = {
        prompt: promptUser,

    }

    const newStep: mls.msg.AIPayload = {
        type: 'agent',
        agentName: 'agentNewModule3',
        prompt: JSON.stringify(dataForNextAgent),
        status: 'pending',
        stepId: getNextStepIdAvaliable(context.task),
        interaction: null,
        nextSteps: null,
        rags: null
    }
    // complete this step (payload) and push another step
    await addNewStep(context, step.stepId, [newStep]);
}

async function getPrompts(prompt: DataForPrompt): Promise<mls.msg.IAMessageInputType[]> {
    if (!prompt || !prompt.clarification || !prompt.userPrompt) throw new Error(`Erro [${agentName}] getPrompts: invalid userPrompt`);
    (prompt as any).ResumeClarification = toLLMClarification(prompt.clarification);
    const prompts = await getPromptByHtml({ project, shortName: agentName, folder: '', data: prompt })
    return prompts;
}
