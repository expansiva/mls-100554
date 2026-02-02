/// <mls fileReference="_100554_/l2/agentBotInstall.ts" enhancement="_blank" />

import { IAgent, svg_agent } from '/_100554_/l2/aiAgentBase.js';
import { getNextInProgressStepByAgentName, updateStepStatus, notifyMessageSendChange } from "/_100554_/l2/aiAgentHelper.js";
import { executeNextStep, loadAgent } from "/_100554_/l2/aiAgentOrchestration.js";
import { addMessage } from '/_102025_/l2/collabMessagesHelper.js';

const agentName = "agentBotInstall";

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Install Bot in a thread",
        visibility: "public",
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        },
    }
};

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {

    if (!context || !context.message) throw new Error("Invalid context");
    if (context.task) {
        throw new Error(`[${agentName}] beforePrompt: Invalid agent call, in tasks`);
    }
    const args = mls.common.safeParseArgs(context.message.content.split(" ").slice(1).join(" "));
    mls.common.argsValidator(args, { projectId: { type: "number" }, shortName: { type: "string" }, folder: { type: "string" , optional: true }, disable: { type: "boolean", optional: true } });
    const { projectId, shortName, disable, folder } = args;
    if (disable === true) {
        disableBot(context, projectId, shortName, folder || '');
        return;
    }
    const agent = await loadAgent(shortName);
    if (!agent) throw new Error(`[${agentName}] beforePrompt: Invalid Agent, check projectID and shortName: _${projectId}_${shortName}`);
    if (!agent.installBot) throw new Error(`[${agentName}] beforePrompt: Invalid Agent, is not a Bot: _${projectId}_${shortName}, ${JSON.stringify(agent)}`);
    notifyMessageSendChange({ message: context.message, task: undefined });
    const rc = await agent.installBot(context);
    if (!rc) throw new Error(`[${agentName}] beforePrompt: Agent not instaled, error`);
    return;
}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No pending interaction found.`);
    context = await updateStepStatus(context, step.stepId, "completed");
    await executeNextStep(context);
}

export async function disableBot(context: mls.msg.ExecutionContext, projectId: number, shortName: string, folder:string): Promise<boolean> {
    const rc = await mls.api.msgAddOrUpdateThreadBot({
        botId: agentName,
        llmPrompt: "",
        status: "disabled",
        threadId: context.message.threadId,
        userId: context.message.senderId,
        config: undefined
    });
    if (rc.statusCode === 200) {
        await addMessage(context.message.threadId, `Bot ${agentName} disabled OK!`);
        return true;
    };
    console.error("error on disable bot", rc);
    return false;
}