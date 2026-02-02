/// <mls fileReference="_100554_/l2/agentReview.ts" enhancement="_blank" />

import { IAgent, svg_agent } from '/_100554_/l2/aiAgentBase.js';
import {  getPromptByHtml } from '/_100554_/l2/aiPrompts.js';
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
import { getState } from '/_100554_/l2/collabState.js';
import { ServiceSource100554 } from '/_100554_/l2/serviceSource.js';
import { createAllModels } from '/_100554_/l2/collabLibModel.js';

const agentName = "agentReview";

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svgReview,
        agentDescription: "Responsavel por fazer review do código",
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
        let data;

        let pp = context.message.content
            .replace(`@@ ${agentName}`, '')
            .replace(`@@${agentName}`, '').trim()
            .replace(`@@Review`, '');

        data = JSON.parse(pp);
        if (!('page' in data) || !('prompt' in data)) throw new Error(`[${agentName}] beforePrompt: Invalid prompt structure missing page and prompt`);
        const mode = data.mode ? data.mode : 'all';
        const inputs = await getPrompts(data, mode);
        await startNewAiTask(
            agentName,
            taskTitle,
            context.message.content,
            context.message.threadId,
            context.message.senderId,
            inputs, context,
            _afterPrompt,
            { 'page': `${data.page}`, 'position': data.position, "mode": mode }
        );
        return;
    }

    const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
    context = await updateStepStatus(context, step.stepId, "in_progress");
    if (!step.prompt) throw new Error(`[${agentName}] beforePrompt: No prompt found in step for this agent.`);

    const data: IDataPrompt = JSON.parse(step.prompt);
    if (!('page' in data) || !('prompt' in data)) throw new Error(`[${agentName}] beforePrompt: Invalid prompt structure missing page and prompt`);

    const mode = data.mode ? data.mode : 'all';
    await appendLongTermMemory(context, { 'page': `${data.page}`, 'position': data.position, "mode": mode });
    const inputs = await getPrompts(data, mode);
    await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);

}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {

    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No pending interaction found.`);
    context = await updateStepStatus(context, step.stepId, "completed");
    await updateFile(context);
    if (!context.task) throw new Error("Invalid context task");
    context.task = await updateTaskTitle(context.task, "Review completed");
    await executeNextStep(context);

}


async function getPrompts(data: IDataPrompt, mode: 'typescript' | 'html' | 'less' | 'all'): Promise<mls.msg.IAMessageInputType[]> {

    const obj = {
        html: (mode === 'all' || mode === 'html') ? await getContentByExtension(data.page, 'html', data.position) : '',
        typescript: (mode === 'all' || mode === 'typescript') ? await getContentByExtension(data.page, 'ts', data.position) : '',
        style: (mode === 'all' || mode === 'less') ? await getContentByExtension(data.page, 'style', data.position) : '',
        promptUser: JSON.stringify(data)
    }

    const rc = await getPromptByHtml({ folder: '', project: 100554, shortName: agentName, data: obj });
    return rc;

}

async function getContentByExtension(fullName: string, ext: 'html' | 'ts' | 'style' | 'defs', position: string) {
    const info = mls.l2.getPath(fullName);

    try {
        let models = getModel(info);

        if (!models) {
            models = await getModels(fullName, position);
        }
        if (!models) throw new Error(`[${agentName}][getContentByExtension]:Not found models for file:` + fullName);
        if (!models[ext]) return '';
        return models[ext]?.model.getValue();
    } catch (e: any) {
        throw new Error(`[${agentName}][getContentByExtension]: ${e.message}`);
    }
}

async function getModels(fullName: string, position: string) {
    const { project, shortName } = mls.l2.getPath(fullName);
    await forceServiceInstance(2, '_100554_serviceSource');
    const key = mls.stor.getKeyToFiles(project, 2, shortName, '', '.ts');
    const storFile = mls.stor.files[key];
    if (!storFile) throw new Error(`Invalid stor file for key: ${key}`);
    await createAllModels(storFile);
    return mls.editor.models[fullName];
}

async function updateFile(context: mls.msg.ExecutionContext) {

    if (!context || !context.task) throw new Error('Not found context to updateFile');
    const step = getNextPendentStep(context.task);

    if (!step || step.type !== 'flexible') throw new Error('Invalid step in updateFile');
    const result: IDataResult = step.result;

    if (!result) throw new Error('Not found "result" in updateFile files');

    const pageMemory = context.task?.iaCompressed?.longMemory['page'];
    const positionMemory = context.task?.iaCompressed?.longMemory['position'];
    if (!pageMemory) throw new Error(`[${agentName}][updateFile]: invalid pageMemory`);

    await forceServiceInstance(2, '_100554_serviceSource');

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

    serviceSource.formatMonaco();

}

function getModel(info: { project: number, shortName: string, folder: string }): mls.editor.IModels | undefined {
    const key = mls.editor.getKeyModel(info.project, info.shortName, info.folder, 2);
    return mls.editor.models[key];
}

const svgReview = `<svg fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.3 6.74a.75.75 0 01-.04 1.06l-2.908 2.7 2.908 2.7a.75.75 0 11-1.02 1.1l-3.5-3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 011.06.04zm3.44 1.06a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.908-2.7-2.908-2.7z"/><path fill-rule="evenodd" d="M1.5 4.25c0-.966.784-1.75 1.75-1.75h17.5c.966 0 1.75.784 1.75 1.75v12.5a1.75 1.75 0 01-1.75 1.75h-9.69l-3.573 3.573A1.457 1.457 0 015 21.043V18.5H3.25a1.75 1.75 0 01-1.75-1.75V4.25zM3.25 4a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h2.5a.75.75 0 01.75.75v3.19l3.72-3.72a.75.75 0 01.53-.22h10a.25.25 0 00.25-.25V4.25a.25.25 0 00-.25-.25H3.25z"/></svg>`



interface IDataPrompt {
    page: string,
    prompt: string,
    mode?: 'typescript' | 'html' | 'less'
    position: 'left' | 'right',
}

interface IDataResult {
    html: string,
    ts: string,
    less: string
}
