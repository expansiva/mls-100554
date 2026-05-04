/// <mls fileReference="_100554_/l2/agentDesignRef2Image2.ts" enhancement="_blank" />

import { IAgentAsync, IAgentMeta, svg_agent } from '/_102027_/l2/aiAgentBase.js';

export function createAgent(): IAgentAsync {
    return {
        agentName: "agentDesignRef2Image2",
        agentProject: 100554,
        agentFolder: "",
        agentDescription: "DesignRef 2 Image",
        visibility: "public",
        beforePromptImplicit,
        afterPromptStep,
        beforePromptStep
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
            taskTitle: `Creating`,
            threadId: context.message.threadId,
            userMessage: context.message.content,
        }
    };
    return [addMessageAI];

}

async function beforePromptStep(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    parentStep: mls.msg.AIAgentStep,
    step: mls.msg.AIAgentStep,
    hookSequential: number,
    args?: string
): Promise<mls.msg.AgentIntent[]> {

    if (!args) throw new Error(`(${agent.agentName})[beforePromptStep] args invalid`);

    const continueIntent: mls.msg.AgentIntentPromptReady = {
        type: "prompt_ready",
        args,
        messageId: context.message.orderAt,
        threadId: context.message.threadId,
        taskId: context.task?.PK || '',
        hookSequential,
        parentStepId: parentStep.stepId,
        humanPrompt: args || '',
        systemPrompt: await prepareSystemPrompt()
    }

    return [continueIntent];
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
    if (payload?.type !== 'flexible' || !payload.result) throw new Error(`[afterPromptStep] invalid payload: ${payload}`)

    let status: mls.msg.AIStepStatus = 'completed';
    let intents: mls.msg.AgentIntent[] = [];

    try {
        const output = payload.result;
        await processTResultRef2Image2(context, output);
    } catch (e) {
        console.error(e);
        status = 'failed';
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
    return [...intents, updateStatus];

}

async function processTResultRef2Image2(context: mls.msg.ExecutionContext, result: Object): Promise<mls.msg.AgentIntent[]> {

    console.log("=== processTResultRef2Image2")
    console.log(JSON.stringify(result, null, 2));
    return [];

}


async function prepareSystemPrompt(): Promise<string> {
    let system: string = system1;
    return system;
}

const system1 = `
<!-- modelType: imageGemini --> <!-- help1: "imageGptImage1" | "imageGemini" -->

<!-- size: 1024x1024 --> <!-- help2: (imageGptImage1) "1024x1024" | "1024x1536" | "1536x1024" -->

<!-- quality: high --> <!-- help3: (imageGptImage1) "low" | "medium" | "high" -->


`
