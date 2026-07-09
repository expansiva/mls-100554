/// <mls fileReference="_100554_/l2/agentBotInstall.ts" enhancement="_102027_/l2/enhancementAgent" />

import { IAgentAsync, IAgentMeta } from '/_102027_/l2/aiAgentBase.js';
import { loadAgent } from '/_102027_/l2/aiAgentOrchestration.js';
import { addMessage } from '/_102025_/l2/collabMessagesHelper.js';
import { msgAddOrUpdateThreadBot } from '/_102036_/l2/shared/api.js';

export function createAgent(): IAgentAsync {
    return {
        agentName: "agentBotInstall",
        agentProject: 100554,
        agentFolder: "",
        agentDescription: "Install Bot in a thread",
        visibility: "public",
        beforePromptImplicit,
        afterPromptStep
    };
}

const agentName = 'agentBotInstall'

async function beforePromptImplicit(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    userPrompt: string,
): Promise<mls.msg.AgentIntent[]> {

    if (!userPrompt || userPrompt.length < 5) throw new Error('invalid prompt');

    const args = mls.common.safeParseArgs(context.message.content.split(" ").slice(1).join(" "));
    mls.common.argsValidator(args, { projectId: { type: "number" }, shortName: { type: "string" }, folder: { type: "string" , optional: true }, disable: { type: "boolean", optional: true } });
    const { projectId, shortName, disable, folder } = args;
    if (disable === true) {
        disableBot(context, projectId, shortName, folder || '');
        return [];
    }
    const agent2 = await loadAgent(shortName);
    if (!agent2) throw new Error(`[${agentName}] beforePrompt: Invalid Agent, check projectID and shortName: _${projectId}_${shortName}`);
    if (!agent2.installBot) throw new Error(`[${agentName}] beforePrompt: Invalid Agent, is not a Bot: _${projectId}_${shortName}, ${JSON.stringify(agent)}`);
    //notifyMessageSendChange({ message: context.message, task: undefined });
    const rc = await agent2.installBot(context);
    if (!rc) throw new Error(`[${agentName}] beforePrompt: Agent not instaled, error`);
    return [];
}

async function afterPromptStep(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    parentStep: mls.msg.AIAgentStep,
    step: mls.msg.AIAgentStep,
    hookSequential: number,
): Promise<mls.msg.AgentIntent[]> {

    return [];

}

export async function disableBot(context: mls.msg.ExecutionContext, projectId: number, shortName: string, folder:string): Promise<boolean> {
    const rc = await msgAddOrUpdateThreadBot({
        botId: agentName,
        llmPrompt: "",
        status: "disabled",
        threadId: context.message.threadId,
        userId: context.message.senderId,
        config: undefined
    });
    if (rc.success) {
        await addMessage(context.message.threadId, `Bot ${agentName} disabled OK!`);
        return true;
    };
    console.error("error on disable bot", rc);
    return false;
}