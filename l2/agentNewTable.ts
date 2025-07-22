/// <mls shortName="agentNewTable" project="100554" enhancement="_blank" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { forceServiceInstance } from './_100554_libCommom';
import { convertFileNameToTag } from './_100554_utilsLit';
import { createNewFile } from "./_100554_pluginNewFileBase";
import { descriptionForPrompt } from "./_100554_icaBaseDescription";
import { initCompileMonaco } from "./_100554_collabInit";
import { initState } from './_100554_collabState';

import { preferModelType, systemComponentsInstruction, systemTokensLessInstruction, getPromptByHtml } from './_100554_aiPrompts';

import {
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    updateStepStatus,
    getNextPendentStep,
    updateTaskTitle
} from "./_100554_aiAgentHelper";

import {
    startNewAiTask,
    executeNextStep,
    startNewInteractionInAiTask,
    addNewStep
} from "./_100554_aiAgentOrchestration";

const agentName = "agentNewTable";
const project = 100554;
const enhancement = '_100554_enhancementLit';

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Responsável pela criação de um driver para uma tabela de banco de dados no sistema Collab Codes.",
        visibility: "private",
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        },
        async replayForSupport(context: mls.msg.ExecutionContext, payload: mls.msg.AIPayload[]): Promise<void> {
            return _replayForSupport(payload);
        },
    };
}

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    const taskTitle = "Creating table.";

    if (!context || !context.message) throw new Error("Invalid context");

    if (!context.task) {
        const inputs: any = await getPrompts();
        await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt);
    } else {

        const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
        if (!step) {
            throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
        }

        context = await updateStepStatus(context, step.stepId, "in_progress");

        if (!step.prompt) throw new Error(`[${agentName}] beforePrompt: No prompt found in step for this agent.`);
        const data =  mls.common.safeParseArgs(step.prompt);
        if (!('json' in data) || !('prompt' in data)) throw new Error(`[${agentName}] beforePrompt: Invalid prompt structure missing json and prompt`);

        const inputs = await getPrompts();

        await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);
    }
}


const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No pending interaction found.`);

    context = await updateStepStatus(context, step.stepId, "completed");
    // await addFile(context);

    //await executeNextStep(context);
}



const _replayForSupport = async (payload: mls.msg.AIPayload[]): Promise<void> => {

    const step = payload[0] as mls.msg.AIPayload;
    if (!step || step.type !== 'flexible') throw new Error('Invalid step in create files');

    const content = (step as any).content ? (step as any).content : step.result;

    if (!content || !content.html || !content.ts || !content.less || !content.shortName) throw new Error('Not found "html" or "ts" or "less" or "shortName" in addFile files');
    // await createNewFiles(content);
}

export async function getPrompts(): Promise<mls.msg.IAMessageInputType[]> {
    initState(agentName, {
        mode: preferModelType("code"),
    });
    
    return await getPromptByHtml({ project: 100554, shortName: agentName, folder: '' })
}





