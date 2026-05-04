/// <mls fileReference="_100554_/l2/agentBotWeddingGifts.ts" enhancement="_blank" />

import { IAgentAsync, IAgentMeta } from '/_102027_/l2/aiAgentBase.js';

export function createAgent(): IAgentAsync {
    return {
        agentName: "agentBotWeddingGifts",
        agentProject: 100554,
        agentFolder: "",
        agentDescription: "Agent Bot, for gifts management",
        visibility: "public",
        installBot,
        beforeBot,
        beforePromptImplicit,
        // beforePromptStep,
        afterPromptStep
    };
}

import { notifyThreadChange } from "/_102027_/l2/aiAgentHelper.js";
import { addMessage } from '/_102025_/l2/collabMessagesHelper.js';
const agentName = "agentBotWeddingGifts";

async function beforePromptImplicit(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    userPrompt: string,
): Promise<mls.msg.AgentIntent[]> {

    if (!userPrompt || userPrompt.length < 5) throw new Error('invalid prompt');

    const prompts = await getPrompts(getPromptMock(), getOriginalRecord());

    const addMessageAI: mls.msg.AgentIntentAddMessageAI = {
        type: "add-message-ai",
        request: {
            action: 'addMessageAI',
            agentName: agent.agentName,
            inputAI: [{
                type: "system",
                content: prompts,
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

    return [updateStatus];

}

const installBot = async (context: mls.msg.ExecutionContext): Promise<boolean> => {

    const llmPrompt = system1
        .replace('{{userPrompt}}', '')
        .replace('{{botRecord}}', '')

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

async function beforeBot(context: mls.msg.ExecutionContext, msg: string, toolsBeforeSendMessage: mls.bots.ToolsBeforeSendMessage[]): Promise<Record<string, any>> {
    // prepare config to send in 
    const contextToBot: Record<string, any> = {};
    return contextToBot;
}


async function getPrompts(userPrompt: string, botRecord: string): Promise<string> {
    if (!userPrompt) throw new Error(`Erro [${agentName}] getPrompts: invalid userPrompt`);
    const prompts = system1
        .replace('{{userPrompt}}', userPrompt)
        .replace('{{botRecord}}', botRecord)

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

const system1 = `
<!-- modelType: mini -->
<!-- modelContext: CollabMessageBot -->
<!-- trigger: [{"type":"onNewMessage", "conditions":[] }] -->
<!-- threadFeature: summary -->
<!-- threadPermissionLevel: all -->

You are an assistant responsible for managing a wedding gift list.

Each message is a user input from the Collab.Messages thread.  
Your job is to analyze the message, identify if it refers to the wedding list, and take appropriate action.

If the message is NOT related to the wedding gift list, simply return the previous context (unchanged) in the "flexible" format.

If the message is a gift suggestion, add it to the list.

If the message indicates a user will buy or reserve a gift, mark the item accordingly with the user's name or ID.

If the message requests to view the current gift list or a summary of it, return it using the "result" format (in the user’s language if possible).

You should normalize gift names to group similar items (e.g., "coffee maker" and "espresso machine" may refer to the same concept).

Include the user language (e.g., \`en\`, \`pt\`, \`es\`) in the summary result for multilingual support.

---

## Context
### Old WeddingGifts
\`\`\`json
{{botRecord}}
\`\`\`

## Output Format (JSON)

`;

//#region OutputSection
export type Output = {
    type: "flexible";
    result: WeddingGifts;
} | {
    type: "result";
    result: string[];
};

interface WeddingGifts {
    gifts: GiftItem[];
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
//#endregion


