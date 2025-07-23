/// <mls shortName="agentBotWeddingGifts" project="100554" enhancement="_blank" />


import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { getPromptByHtml } from './_100554_aiPrompts';
import './_100554_widgetQuestionsForClarification';

import {
    getNextInProgressStepByAgentName,
    notifyTaskChange,
    notifyThreadChange,
    updateStepStatus,
} from "./_100554_aiAgentHelper";
import { addMessage } from "./_100554_collabMessageHelper";

import {
    startNewAiTask,
    executeNextStep,
} from "./_100554_aiAgentOrchestration";

const agentName = "agentBotWeddingGifts";
const project = 100554;

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Agent Bot, for gifts management",
        visibility: "public",
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        },
        async installBot(context: mls.msg.ExecutionContext): Promise<boolean> {
            return _installBot(context);
        },
        async beforeBot(context: mls.msg.ExecutionContext, msg: string, toolsBeforeSendMessage: mls.bots.ToolsBeforeSendMessage[]): Promise<Record<string, any>> {
            return _beforeBot(context, msg, toolsBeforeSendMessage);
        }
    };
}

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    const taskTitle = "Planning...";
    if (!context || !context.message) throw new Error("Invalid context");
    if (context.task) throw new Error("this agent cannot execute with anothers agentes")

    const inputs: any = await getPrompts(getPromptMock(), getOriginalRecord());
    await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt);
    return;
}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No in progress interaction found.`);
    context = await updateStepStatus(context, step.stepId, "completed");
    notifyTaskChange(context);
    await executeNextStep(context);
}

const _installBot = async (context: mls.msg.ExecutionContext): Promise<boolean> => {
    const inputs = await getPromptByHtml({ project, shortName: agentName, folder: '', data: undefined });
    const llmPrompt: string = inputs
        .filter(i => i.type === "system")
        .map(i => i.content)
        .join("\n\n");
    const rc = await mls.api.msgAddOrUpdateThreadBot({
        botId: agentName,
        llmPrompt,
        status: "active",
        threadId: context.message.threadId,
        userId: context.message.senderId,
        config: undefined
    });
    if (rc.statusCode === 200) {
        await addMessage(context.message.threadId, `Bot ${agentName} instaled OK!`);
        notifyThreadChange(rc.thread);
        return true;
    };
    console.error("error on install bot", rc);
    return false;
}

async function _beforeBot(context: mls.msg.ExecutionContext, msg: string, toolsBeforeSendMessage: mls.bots.ToolsBeforeSendMessage[]): Promise<Record<string, any>> {
    // prepare config to send in 
    const contextToBot: Record<string, any> = {};
    return contextToBot;
}


async function getPrompts(userPrompt: string, botRecord: string): Promise<mls.msg.IAMessageInputType[]> {
    if (!userPrompt) throw new Error(`Erro [${agentName}] getPrompts: invalid userPrompt`);
    const dataForReplace = {
        userPrompt,
        botRecord
    }
    const prompts = await getPromptByHtml({ project, shortName: agentName, folder: '', data: dataForReplace })
    return prompts;
}

function getPromptMock(): string {
    return "me retorne a lista dos presentes";
}

function getOriginalRecord(): string {
    const gifts: GiftItem[] = [
        {
            "name": "geladeira",
            "originalNames": [
                "geladeira"
            ],
            "status": "available"
        },
        {
            "name": "chaleira elétrica",
            "originalNames": [
                "chaleira elétrica"
            ],
            "status": "available"
        },
        {
            "name": "filtro de barro",
            "originalNames": [
                "filtro de barro"
            ],
            "status": "reserved",
            "reservedBy": "Wagner",
            "date": "2025-07-19"
        }
    ];
    return JSON.stringify(gifts);
}

export interface GiftItem {
  name: string;                         // Normalized gift name
  originalNames: string[];             // List of similar names used by users
  status: "available" | "reserved" | "purchased" | "declined";
  reservedBy?: string;                  // Optional userId or name
  date?: string;                        // ISO format date
  message?: string;                     // Optional message from the user
  purchaseUrl?: string;                 // Optional URL for where to buy the gift
}
