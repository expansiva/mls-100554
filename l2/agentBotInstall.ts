/// <mls shortName="agentBotInstall" project="100554" enhancement="_blank" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { getNextInProgressStepByAgentName, updateStepStatus } from "./_100554_aiAgentHelper";
import { executeNextStep, loadAgent } from "./_100554_aiAgentOrchestration";
import { addMessage } from "./_100554_collabMessageHelper";

const agentName = "agentBotInstall";

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Intall Bot in a thread",
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
    mls.common.argsValidator(args, { projectId: { type: "number" }, shortName: { type: "string" }, disable: { type: "boolean", optional: true } });
    const { projectId, shortName, disable } = args;
    if (disable === true) {
        disableBot(context, projectId, shortName);
        return;
    }
    const agent = await loadAgent(projectId, shortName);
    if (!agent) throw new Error(`[${agentName}] beforePrompt: Invalid Agent, check projectID and shortName: _${projectId}_${shortName}`);
    if (!agent.installBot) throw new Error(`[${agentName}] beforePrompt: Invalid Agent, is not a Bot: _${projectId}_${shortName}, ${JSON.stringify(agent)}`);
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

export async function disableBot(context: mls.msg.ExecutionContext, projectId: number, shortName: string): Promise<boolean> {
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