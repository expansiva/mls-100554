/// <mls fileReference="_100554_/l2/agentCompareAgents2.ts" enhancement="_102027_/l2/enhancementAgent.ts"/>

import { IAgentAsync, IAgentMeta } from '/_102027_/l2/aiAgentBase.js';
import { appendLongTermMemory, getStepById } from '/_102027_/l2/aiAgentHelper.js';

export function createAgent(): IAgentAsync {
    return {
        agentName: "agentCompareAgents2",
        agentProject: 100554,
        agentFolder: "",
        agentDescription: "New agent",
        visibility: "public",
        beforePromptImplicit,
        beforePromptStep,
        afterPromptStep
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

async function beforePromptStep(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    parentStep: mls.msg.AIAgentStep,
    step: mls.msg.AIAgentStep,
    hookSequential: number,
    args?: string
): Promise<mls.msg.AgentIntent[]> {

    if (!args) throw new Error(`(${agent.agentName})[beforePromptStep] args invalid`);

    const info: any = JSON.parse(args);
    const steps: mls.msg.AgentIntentAddStep[] = [];

    await appendLongTermMemory(context, { "afterPromptProxy": step.stepId.toString() });
    await appendLongTermMemory(context, { "totAgents": info.agentNames.length.toString() });
    await appendLongTermMemory(context, { "promptCompare": info.promptCompare });
    await appendLongTermMemory(context, { "stepIdOri": step.stepId.toString() });
    await appendLongTermMemory(context, { "parentIdOri": parentStep.stepId.toString() });

    //Clear variable parameter.
    (window as any).agentCompareAgents2 = [];

    // Add steps for each agents
    info.agentNames.forEach((agName: string) => {
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
                agentName: agName.trim(),
                prompt: info.promptUser,
                rags: [],
            }
        };

        steps.push(newStep)
    });

    return steps;


}


async function afterPromptStep(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    parentStep: mls.msg.AIAgentStep,
    step: mls.msg.AIAgentStep,
    hookSequential: number,
): Promise<mls.msg.AgentIntent[]> {

    if (!agent || !context || !step) throw new Error(`[afterPromptStep] invalid params, agent:${!!agent}, context:${!!context}, step:${!!step}`);

    // In this mode afterPromptProxy the current step send in parentStep.
    const intents = processOutput(context, parentStep.stepId, hookSequential);

    return intents;

}

async function processOutput(context: mls.msg.ExecutionContext, agentStep: number,  hookSequential: number): Promise<mls.msg.AgentIntent[]> {

    const intents: mls.msg.AgentIntent[] = []

    let totAgents = +(context.task?.iaCompressed?.longMemory['totAgents'] || '0');
    let finishedAgent: number[] = (window as any).agentCompareAgents2 || [];
    finishedAgent.push(agentStep);

    if (!context.task) throw new Error('Not found task');

    // Complete current step;
    const updateStatus: mls.msg.AgentIntentUpdateStatus = {
        type: 'update-status',
        hookSequential,
        messageId: context.message.orderAt,
        threadId: context.message.threadId,
        taskId: context.task?.PK || '',
        parentStepId: 1,
        stepId: agentStep,
        status: 'completed'
    };

    intents.push(updateStatus);

    // Verify finished all agents
    if (finishedAgent.length === totAgents) {

        let toCompare = '#Compare the results';

        for (let idStep of finishedAgent) {

            const step = getStepById(context.task, idStep) as mls.msg.AIAgentStep;
            if (!step) throw new Error('[agentCompareAgents2] Not found step:' + step);

            const payload = (step.interaction?.payload?.[0]);

            toCompare += `\n\n//--------------------\n##Agent:${step.agentName}\n\n${JSON.stringify(payload)}\n//--------------------`;

        }

        // Add step to Compare
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
                agentName: "agentCompareAgents3",
                prompt: toCompare,
                rags: null,
            }
        };

        intents.push(newStep);

    } if (finishedAgent.length > totAgents) {

        // Finishe compare
        const updateStatus: mls.msg.AgentIntentUpdateStatus = {
            type: 'update-status',
            hookSequential,
            messageId: context.message.orderAt,
            threadId: context.message.threadId,
            taskId: context.task?.PK || '',
            parentStepId: +(context.task?.iaCompressed?.longMemory['parentIdOri'] || '0'),
            stepId: +(context.task?.iaCompressed?.longMemory['stepIdOri'] || '0'),
            status: 'completed'
        };

        intents.push(updateStatus)
        
    } else {

        (window as any).agentCompareAgents2 = finishedAgent;

    }

    return intents;
}


const system1 = `
<!-- modelType: code-->
<!-- modelTypeList: geminiChat (2.5 pro), code (grok), deepseekchat, codeflash (gemini), deepseekreasoner, mini (4.1) ou nano (openai), codeinstruct (4.1), codereasoning(gpt5), code2 (kimi 2.5) -->

Your instructions here


## Output format
You must return the object strictly as JSON
[[OutputSection]]

`

//#region OutputSection
export type Output =
    {
        type: "flexible";
        result: any;
    }
//#endregion 


