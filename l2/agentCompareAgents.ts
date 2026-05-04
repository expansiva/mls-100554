/// <mls fileReference="_100554_/l2/agentCompareAgents.ts" enhancement="_102027_/l2/enhancementAgent.ts"/>

import { IAgentAsync, IAgentMeta } from '/_102027_/l2/aiAgentBase.js';
import { finishClarification } from "/_102027_/l2/aiAgentOrchestration.js";

export function createAgent(): IAgentAsync {
    return {
        agentName: "agentCompareAgents",
        agentProject: 100554,
        agentFolder: "",
        agentDescription: "New agent",
        visibility: "public",
        beforePromptImplicit,
        afterPromptStep,
        beforeClarificationStep
    };
}

async function beforePromptImplicit(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    userPrompt: string,
): Promise<mls.msg.AgentIntent[]> {

    if (!userPrompt || userPrompt.length < 5) throw new Error('invalid prompt');

    const addMessageAI: mls.msg.AgentIntentAddMessageAI = {
        type: "add-message-ai",
        request: {
            action: 'addMessageAI',
            agentName: agent.agentName,
            inputAI: [{
                type: "system",
                content: system1,
            }, {
                type: "human",
                content: context.message.content
            }],
            taskTitle: `Test 1`,
            threadId: context.message.threadId,
            userMessage: context.message.content,
        }
    };
    return [addMessageAI];

}


async function afterPromptStep(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    parentStep: mls.msg.AIAgentStep,
    step: mls.msg.AIAgentStep,
    hookSequential: number,
): Promise<mls.msg.AgentIntent[]> {


    if (!agent || !context || !step) throw new Error(`[afterPromptStep] invalid params, agent:${!!agent}, context:${!!context}, step:${!!step}`);

    const payload = (step.interaction?.payload?.[0]);
    if (payload?.type === 'clarification') return [];
    if (payload?.type !== 'flexible' || !payload.result) throw new Error(`[afterPromptStep] invalid payload: ${payload}`)
    let status: mls.msg.AIStepStatus = 'completed';
    let intents: mls.msg.AgentIntent[] = [];

    const output = payload.result;
    intents = await processOutput(context, output);

    const updateStatus: mls.msg.AgentIntentUpdateStatus = {
        type: 'update-status',
        hookSequential,
        messageId: context.message.orderAt,
        threadId: context.message.threadId,
        taskId: context.task?.PK || '',
        parentStepId: parentStep.stepId,
        stepId: step.stepId,
        status
    };

    return [...intents, updateStatus];

}

async function processOutput(context: mls.msg.ExecutionContext, output: any): Promise<mls.msg.AgentIntent[]> {

    const newStep: mls.msg.AgentIntentAddStep = {
        type: "add-step",
        messageId: context.message.orderAt,
        threadId: context.message.threadId,
        taskId: context.task?.PK || '',
        parentStepId: 1,
        step:
        {
            type: 'agent',
            stepId: 0,
            interaction: null,
            stepTitle: 'Teste step title 2',
            status: 'waiting_human_input',
            nextSteps: [],
            agentName: "agentCompareAgents2",
            prompt: JSON.stringify(output),
            rags: null,
        }
    };

    return [newStep];
}

async function beforeClarificationStep(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    parentStep: mls.msg.AIAgentStep,
    step: mls.msg.AIClarificationStep,
    hookSequential: number,
    json: Suggestions
): Promise<HTMLElement> {

    if (!context.task) throw new Error(`[beforeClarificationStep] invalid task: undefined`)
    let status: mls.msg.AIStepStatus = 'completed';

    const updateStatus: mls.msg.AgentIntentUpdateStatus = {
        type: 'update-status',
        hookSequential,
        messageId: context.message.orderAt,
        threadId: context.message.threadId,
        taskId: context.task?.PK || '',
        parentStepId: parentStep.stepId,
        stepId: step.stepId,
        status
    };

    const newStep: mls.msg.AgentIntentAddStep = {
        type: "add-step",
        messageId: context.message.orderAt,
        threadId: context.message.threadId,
        taskId: context.task?.PK || '',
        parentStepId: 1,
        step:
        {
            type: 'agent',
            stepId: 0,
            interaction: null,
            stepTitle: 'Teste step title 2',
            status: 'waiting_human_input',
            nextSteps: [],
            agentName: "agentCompareAgents2",
            prompt: "{{clarification}}",
            rags: null,
        }
    };
    const intentsToClarification: mls.msg.AgentIntent[] = [updateStatus, newStep]
    await import('/_100554_/l2/agentCompareAgentsClarification.js');
    const clariEl = document.createElement('agent-compare-agents-clarification-100554');

    (clariEl as any).suggestions = json.suggestions;

    clariEl.addEventListener('clarification-finish', (e: Event) => {
        const { detail } = e as CustomEvent<{ value: unknown; action: "continue" | "cancel" }>;
        const { value, action } = detail;
    
        finishClarification(
            agent,
            step.stepId,
            parentStep.stepId,
            intentsToClarification,
            context,
            value as string,
            action
        );
    });

    return clariEl;

}


const system1 = `
<!-- modelType: code-->

You are responsible for gathering the necessary requirements for the future analysis.


## Output format
You must return the object strictly as JSON

If you have all the information to analize return
[[OutputSection]]

Else return
[[OutputSectionClari]]
`

//#region OutputSection
export type Output =
    {
        type: "flexible";
        result: Result;
    }

export type Result = {
    agentNames: string[],
    promptUser: string,
    promptCompare: string,
}
//#endregion 

//#region OutputSectionClari
export type Output3 =
    {
        type: "clarification";
        json: Suggestions;
    }

export interface Suggestions {
    suggestions: [
        "Please provide the names of the agents for analysis, separated by commas.",
        "Please provide the user prompt.",
        "Do you want me to analyze something specific?"
    ];
}

//#endregion

