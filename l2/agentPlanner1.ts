/// <mls fileReference="_100554_/l2/agentPlanner1.ts" enhancement="_100554_enhancementAgent" />

import { IAgentAsync, IAgentMeta } from '/_100554_/l2/aiAgentBase.js';

import {
    getAgentsList,
    getRagsList,
    getToolsList,
} from "/_100554_/l2/aiPrompts.js";

export function createAgent(): IAgentAsync {
    return {
        agentName: "agentPlanner1",
        agentProject: 100554,
        agentFolder: "",
        agentDescription: "First agent for general prompts",
        visibility: "public",
        beforePromptImplicit,
        afterPromptStep
    };
}

async function beforePromptImplicit(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    userPrompt: string,
): Promise<mls.msg.AgentIntent[]> {

    if (!userPrompt || userPrompt.length < 5) throw new Error('invalid prompt');

    const system = await prepareSystemPrompt()

    const addMessageAI: mls.msg.AgentIntentAddMessageAI = {
        type: "add-message-ai",
        request: {
            action: 'addMessageAI',
            agentName: agent.agentName,
            inputAI: [{
                type: "system",
                content: system,
            }, {
                type: "human",
                content: context.message.content
            }],
            taskTitle: `New module`,
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
    if (!payload || !payload.type) throw new Error(`Payload invalid`);
    if (!['agent', 'tool', 'result'].includes(payload?.type)) throw new Error(`Payload type invalid: ${payload?.type}`);

    let status: mls.msg.AIStepStatus = 'completed';
    let intents: mls.msg.AgentIntent[] = [];

    if (payload.type === 'tool') {
        throw new Error(`Payload type tool not prepared yet`);
    }

    if (payload.type === 'agent') {
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
                status: 'waiting_human_input',
                nextSteps: [],
                agentName: payload.agentName,
                prompt: payload.prompt,
                rags: payload.rags,
            }
        };

        intents.push(newStep);
    }

    if (payload.type === 'result') {
        const updateStatusAgent: mls.msg.AgentIntentUpdateStatus = {
            type: 'update-status',
            hookSequential,
            messageId: context.message.orderAt,
            threadId: context.message.threadId,
            taskId: context.task?.PK || '',
            parentStepId: 1,
            stepId: parentStep.stepId,
            status: 'completed'
        };
        intents.push(updateStatusAgent);
    }

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

    intents = [...intents, updateStatus];
    return intents;

}

async function prepareSystemPrompt(): Promise<string> {

    let system: string = system1;
    system = system1.replace('{{agentsAvaliables}}', getAgentsList().join('\n'));
    system = system1.replace('{{ragsAvaliables}}', getRagsList());
    system = system1.replace('{{toolsAvaliables}}', (await getToolsList()).join('\n'));
    return system;

}

const system1 = `
<!-- modelType: codeflash -->
<!-- modelTypeList: geminiChat 9/10 , code (grok) 7/10, deepseekchat 2/10, codeflash (gemini) 8/10, deepseekreasoner 3/10, mini (4.1) or nano (openai) 4/10, codeinstruct (4.1) 4/10, codereasoning(gpt5) 3/10, code2 (kimi 2.5) -->

You are a coordinator of agents and tools responsible for executing tasks based on the user's prompt.  
Your only goal at this moment is to classify the type of action required from the prompt.

RULES:
1. Return **exactly one subtask** of one of the following types: 'agent' or 'result'.
2. If the prompt is vague, ambiguous, or does not contain enough information to decide between 'agent' or 'result', return a 'result' with an invalid prompt message.
4. Use 'result' when the system can **respond directly to the user** without involving agents.
5. Use 'agent' when the task requires **active action or execution by an agent or an external tool**.
   - In this case, include the original user prompt in the 'prompt' field.
6. Do not modify the content of the original prompt.
7. Do not elaborate responses or explain your choices — only classify.

EXAMPLES:
User: "Create a landing page for a fitness product"  
Response: Agent

User: "What is the capital of Germany?"  
Response: Result

User: "Help me"  
Response: Result


## Available Agents
{{agentsAvaliables}}

## Available RAGs
{{ragsAvaliables}}

## Available Tools
{{toolsAvaliables}}


## Output format
Return only valid JSON in the following structure:

[[OutputSection1]]

`

//#region OutputSection1
export type Output1 =
    {
        type: "result";
        result: string
    } |

    {
        type: "agent",
        agentName: string,
        title: string,
        prompt: string,
        rags: string[] | null
    } |
    {
        type: "agent",
        agentName: string,
        title: string,
        prompt: string,
        rags: string[] | null
    }

//#endregion
