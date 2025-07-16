/// <mls shortName="agentGeneratePrototypeOrganism" project="100554" enhancement="_blank" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { getPromptByHtml } from './_100554_aiPrompts';
import { getPayload3, PayLoad3 } from './_100554_agentGeneratePrototype3';
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
    ClarificationQuestions,
} from "./_100554_aiAgentOrchestration";

const agentName = "agentGeneratePrototypeOrganism";
const project = 100554;
const taskId = "task#1752623963952";

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
    const taskTitle = "Planning 3...";
    if (!context || !context.message) throw new Error("Invalid context");

    if (!context.task) {
        // use mock
        const organismIndex = 0;
        const inputs: any = await getPrompts(await getPayload3Mock(), organismIndex);
        await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt);
        return;
    }

    const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
    if (!step) {
        throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
    }
    const organismIndex = Number(step.prompt);
    if (organismIndex < 0 || Number.isNaN(organismIndex)) throw new Error('invalid prompt, must be a organism index');
    const inputs = await getPrompts(getPayload3(context), organismIndex);
    await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);
}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No in progress interaction found.`);
    context = await updateStepStatus(context, step.stepId, "completed", "no more agents");
    notifyTaskChange(context);
    // todo: create organism prototype
    if (!context.task) throw new Error("Invalid context task");
    context.task = await updateTaskTitle(context.task, "Ok, see mind map");
    await executeNextStep(context);
}

const _replayForSupport = async (context: mls.msg.ExecutionContext, payload: mls.msg.AIPayload[]): Promise<void> => {
    throw new Error("[replayForSupport] not implemented");
}

async function getPrompts(payload3: PayLoad3, organismIndex: number): Promise<mls.msg.IAMessageInputType[]> {
    if (!payload3 || !payload3.organism[organismIndex]) throw new Error(`Erro [${agentName}] getPrompts: invalid userPrompt`);

    const data: Record<string, string> = {
        finalModuleDetails: JSON.stringify(payload3.finalModuleDetails, null, 2),
        organismDetails: JSON.stringify(payload3.organism[organismIndex], null, 2),
        tokens: payload3.tokens.join("\n")
    }

    const prompts = await getPromptByHtml({ project, shortName: agentName, folder: '', data })
    return prompts;
}

async function getPayload3Mock(): Promise<PayLoad3> {
    const task = await getTask(taskId);
    if (!task) throw new Error(`// invalid taskid selected`);
    const context: mls.msg.ExecutionContext = {
        message: {
            threadId: "",
            orderAt: "",
            createAt: "",
            senderId: "",
            content: "",
        },
        task,
        modeSingleStep: true,
    }
    const payload3 = getPayload3(context);
    return payload3;
}
