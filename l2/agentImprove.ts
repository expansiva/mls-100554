/// <mls fileReference="_100554_/l2/agentImprove.ts" enhancement="_blank" />

import { IAgent, svg_agent } from '/_100554_/l2/aiAgentBase.js';
import { getPromptByHtml } from '/_100554_/l2/aiPrompts.js';
import {
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    updateStepStatus,
    getNextPendentStep,
    updateTaskTitle,
    appendLongTermMemory
} from "/_100554_/l2/aiAgentHelper.js";
import { startNewInteractionInAiTask, startNewAiTask, executeNextStep } from "/_100554_/l2/aiAgentOrchestration.js";
import { forceServiceInstance } from '/_100554_/l2/libCommom.js';
import { setState, getState } from '/_100554_/l2/collabState.js';
import { ServiceSource100554 } from '/_100554_/l2/serviceSource.js';

const agentName = "agentImprove";

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Responsavel por fazer novas implmentações",
        visibility: "public",
        scope: ['l2_preview'],
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
        let data: IDataPrompt | undefined;
        try {
            let pp = context.message.content
                .replace(`@@ ${agentName}`, '')
                .replace(`@@${agentName}`, '').trim()
                .replace(`@@Improve`, '');

            data = mls.common.safeParseArgs(pp) as IDataPrompt;
            if (!('page' in data) || !('prompt' in data)) throw new Error(`[${agentName}] beforePrompt: Invalid prompt structure missing page and prompt`);

            const inputs = await getPrompts(data);
            await startNewAiTask(
                agentName,
                taskTitle,
                context.message.content,
                context.message.threadId,
                context.message.senderId,
                inputs,
                context,
                _afterPrompt,
                { 'page': `${data.page}`, 'position': data.position }
            ).catch((err) => {
                throw new Error(err.message)
            });

        } catch (err) {
            if (data) refreshStateLock(data.page, data.position, false);
        }
        return;
    }



    const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
    context = await updateStepStatus(context, step.stepId, "in_progress");
    if (!step.prompt) throw new Error(`[${agentName}] beforePrompt: No prompt found in step for this agent.`);

    const data: IDataPrompt = mls.common.safeParseArgs(step.prompt) as IDataPrompt;
    if (!('page' in data) || !('prompt' in data)) throw new Error(`[${agentName}] beforePrompt: Invalid prompt structure missing page and prompt`);
    await appendLongTermMemory(context, { 'page': `${data.page}`, 'position': data.position });
    const inputs = await getPrompts(data);
    await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId).catch((err) => {
        refreshStateLock(data.page, data.position, false);
    });

}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {

    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No pending interaction found.`);
    context = await updateStepStatus(context, step.stepId, "completed");
    await updateFile(context);
    if (!context.task) throw new Error("Invalid context task");
    context.task = await updateTaskTitle(context.task, "Widget improved");
    await executeNextStep(context);

}


async function getPrompts(data: IDataPrompt): Promise<mls.msg.IAMessageInputType[]> {

    const dataPrompt = {
        mode: '<!-- modelType: code -->',
        html: await getContentByExtension(data.page, 'html'),
        typescript: await getContentByExtension(data.page, 'ts'),
        style: await getContentByExtension(data.page, 'style'),
        promptUser: JSON.stringify(data)
    };

    const rc = await getPromptByHtml({ folder: '', project: 100554, shortName: 'agentImprove', data: dataPrompt });
    return rc;

}

async function getContentByExtension(fullName: string, ext: 'html' | 'ts' | 'style' | 'defs') {

    const info = mls.l2.getPath(fullName);
    try {
        const models = getModel(info)
        if (!models) throw new Error(`[${agentName}][getContentByExtension]:Not found models for file:` + info.shortName);
        if (!models[ext]) return '';
        return models[ext]?.model.getValue();
    } catch (e: any) {
        throw new Error(`[${agentName}][getContentByExtension]: ${e.message}`);
    }
}

async function updateFile(context: mls.msg.ExecutionContext) {

    if (!context || !context.task) throw new Error('Not found context to updateFile');
    const step = getNextPendentStep(context.task);

    if (!step || step.type !== 'flexible') throw new Error('Invalid step in updateFile');
    const result: IDataResult = step.result;

    if (!result) throw new Error('Not found "result" in updateFile files');
    await forceServiceInstance(2, '_100554_serviceSource');

    const pageMemory = context.task?.iaCompressed?.longMemory['page'];
    const positionMemory = context.task?.iaCompressed?.longMemory['position'];
    if (!pageMemory) throw new Error(`[${agentName}][updateFile]: invalid pageMemory`);

    const info = mls.l2.getPath(pageMemory);
    const contentHTML = result.html ? result.html : undefined;
    const contentTS = result.ts ? result.ts : undefined;
    const contentLess = result.less ? result.less : undefined;
    const position = positionMemory || 'left';
    const serviceSource: ServiceSource100554 = getState(`serviceSource.${position}.service`);

    if (!serviceSource) throw new Error('Not found service source instance');

    const models = getModel(info);
    if (!models) throw new Error('Not found model:' + agentName)

    if (contentHTML && models.html) {
        serviceSource.setValueInModeKeepingUndo(models.html.model, contentHTML, false);
        (models.html.model as any).needFormat = true;
    }

    if (contentTS && models.ts) {
        serviceSource.setValueInModeKeepingUndo(models.ts.model, contentTS, false);
        (models.ts.model as any).needFormat = true;
    }

    if (contentLess && models.style) {
        serviceSource.setValueInModeKeepingUndo(models.style.model, contentLess, false);
        (models.style.model as any).needFormat = true;
    }

    refreshStateLock(pageMemory, position, false);
    serviceSource.formatMonaco();

}

function getModel(info: { project: number, shortName: string, folder: string }): mls.editor.IModels | undefined {
    const key = mls.editor.getKeyModel(info.project, info.shortName, info.folder, 2);
    return mls.editor.models[key];
}

function refreshStateLock(page: string, position: string, value: boolean) {
    const lockMap: Map<string, boolean> = getState(`serviceSource.${position}.lockMap`);
    const newMap = new Map(lockMap);
    newMap.set(page, value);
    setState(`serviceSource.${position}.lockMap`, newMap);
}

interface IDataPrompt {
    page: string,
    prompt: string,
    position: 'left' | 'right',
}

interface IDataResult {
    html: string,
    ts: string,
    less: string,
}

