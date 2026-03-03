/// <mls fileReference="_100554_/l2/agents/agentToBePageDefs.ts" enhancement="_blank"/>

import { IAgentAsync, IAgentMeta } from '/_100554_/l2/aiAgentBase.js';
import { getSource, updateDefs, Output, system1 } from '/_100554_/l2/agents/agentDefs.js';
import { ImplementPages } from '/_100554_/l2/agents/agentToBePage.js';
import { executeBeforePrompt, loadAgent } from '/_100554_/l2/aiAgentOrchestration.js';
import { getTemporaryContext } from '/_100554_/l2/aiAgentHelper.js';


export function createAgent(): IAgentAsync {
    return {
        agentName: "agentToBePageDefs",
        agentProject: 100554,
        agentFolder: "agents",
        agentDescription: "Create or Update Defs",
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

    const implementPages = JSON.parse(userPrompt)
    const fileReference = implementPages?.pageSource?.join("\n").trim().split('\n')[0];
    const tripleSlash = mls.common.tripleslash.parseXMLTripleSlash(fileReference);
    let fileInfo = mls.stor.convertFileReferenceToFile(tripleSlash.variables['fileReference']);
    const key = mls.stor.getKeyToFile(fileInfo);
    const storFile = mls.stor.files[key]

    if (!userPrompt) throw new Error('invalid prompt');
    const inputs: mls.msg.IAMessageInputType[] = [{
        type: "system",
        content: system1
    },
    {
        type: "human",
        content: await getSource(storFile)
    }];


    const addMessageAI: mls.msg.AgentIntentAddMessageAI = {
        type: "add-message-ai",
        request: {
            action: 'addMessageAI',
            agentName: agent.agentName,
            inputAI: inputs,
            taskTitle: agent.agentDescription,
            threadId: context.message.threadId,
            userMessage: context.message.content,
            longTermMemory: {},
        },
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
    const payload = (step.interaction?.payload?.[0]) as Output || undefined;
    if (payload?.type !== 'flexible' || !payload.result) throw new Error(`[afterPromptStep] invalid payload: ${payload}`)
    let status: mls.msg.AIStepStatus = 'completed';
    try {
        const asIs = payload.result;
        await updateDefs(asIs);
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
    return [updateStatus];
}


