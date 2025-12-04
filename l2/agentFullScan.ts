/// <mls shortName="agentFullScan" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent } from '/_100554_/l2/aiAgentBase.js';
import { preferModelType, getPromptByHtml } from '/_100554_/l2/aiPrompts.js';
import {
    getNextPendingStepByAgentName, getNextInProgressStepByAgentName, updateStepStatus, getNextPendentStep, updateTaskTitle, calculateStepsStatistics,
} from "/_100554_/l2/aiAgentHelper.js";
import { startNewInteractionInAiTask, startNewAiTask, executeNextStep } from "/_100554_/l2/aiAgentOrchestration.js";
import { addMessage } from '/_102025_/l2/collabMessagesHelper.js';


const agentName = "agentFullScan";

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svgFullScan,
        agentDescription: "Responsavel por analisar os arquivos do projeto de acordo com a solicitação do usuário",
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

    const taskTitle = "Planning";

    if (!context || !context.message) throw new Error("Invalid context");
    if (!context.task) {

        const inputs = await getPrompts(context.message.content);
        await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt).catch((err) => {
            throw new Error(err.message)
        });

        return;
    }

    const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);

    context = await updateStepStatus(context, step.stepId, "in_progress");
    if (!step.prompt) throw new Error(`[${agentName}] beforePrompt: No prompt found in step for this agent.`);
    const inputs = await getPrompts(step.prompt);
    await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId)

}


const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {

    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No pending interaction found.`);
    context = await updateStepStatus(context, step.stepId, "completed");
    if (!context || !context.message || !context.task) throw new Error("Invalid context");

    const { flexible, tools } = calculateStepsStatistics([step], true);
    if (tools > 0) {
        context.task = await updateTaskTitle(context.task, 'Tool exec');
        await executeNextStep(context);
    } else if (flexible > 0) {
        const msg = await prepareExecTasks(context);
        context.task = await updateTaskTitle(context.task, msg);
        await executeNextStep(context);
    }

}

async function getPrompts(prompt: string): Promise<mls.msg.IAMessageInputType[]> {

    const files = Object.keys(mls.stor.files)
        .filter((item) =>
            item.startsWith('100554_2') &&
            ['.html', '.ts', '.less'].includes(mls.stor.files[item].extension)
        )
        .map((item) => mls.stor.files[item]);

    const dataPrompt = {
        promptUser: prompt,
        files: JSON.stringify(files),
        date: new Date().toISOString()
    };

    const rc = await getPromptByHtml({ folder: '', project: 100554, shortName: agentName, data: dataPrompt });
    return rc;

}


async function prepareExecTasks(context: mls.msg.ExecutionContext) {

    if (!context || !context.task) throw new Error('Not found context to prepareExecTasks');
    const step = getNextPendentStep(context.task);

    if (!step || step.type !== 'flexible') throw new Error('Invalid step in prepareExecTasks');
    const result: INextsAgents[] = step.result;

    if (!Array.isArray(result)) throw new Error('Invalid result format in prepareExecTasks');

    if (result.length === 0) {
        return 'Analysis completed. No suitable agent was found for this request.'
    }

    const concurrency = 5;
    const errors: INextsAgents[] = [];
    const total = result.length;

    for (let i = 0; i < result.length; i += concurrency) {
        const batch = result.slice(i, i + concurrency);
        await Promise.all(
            batch.map(async task => {
                try {
                    const messageContent = `@@${task.agentName} ${task.prompt}`;
                    await addMessage(context.message.threadId, messageContent);
                } catch (err) {
                    console.error(`Error on execute task ${task.id} on agent ${task.agentName}, ${task.title}:`, err);
                    errors.push(task)
                }
            })
        );
    }

    return `Analyze completed, ${total} tasks executed: ${total - errors.length} succeeded, ${errors.length} failed.`;

}

const svgFullScan = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>`



interface INextsAgents {
    id: string,
    type: "agent",
    agentName: string,
    title: string,
    prompt: string,
}