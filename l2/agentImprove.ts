/// <mls shortName="agentImprove" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { preferModelType, getPromptByHtml } from './_100554_aiPrompts';
import { getNextPendingStepByAgentName, getNextInProgressStepByAgentName, updateStepStatus, getNextPendentStep, updateTaskTitle } from "./_100554_aiAgentHelper";
import { startNewInteractionInAiTask, startNewAiTask, executeNextStep } from "./_100554_aiAgentOrchestration";
import { forceServiceInstance } from './_100554_libCommom';
import { setState, getState } from './_100554_collabState';
import { ServiceSource100554 } from './_100554_serviceSource';

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
        let data:any;
        try {
            let pp = context.message.content
                .replace(`@@ ${agentName}`, '')
                .replace(`@@${agentName}`, '').trim()
                .replace(`@@Improve`, '');

            data = mls.common.safeParseArgs(pp) as IDataPrompt;
            if (!('page' in data) || !('prompt' in data)) throw new Error(`[${agentName}] beforePrompt: Invalid prompt structure missing page and prompt`);
            const inputs = await getPrompts(data);
            await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt).catch((err) => {
                throw new Error(err.message)
            });

        } catch (err) {
            refreshStateLock(data.page, data.position, false);
        }
        return;
    }



    const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
    context = await updateStepStatus(context, step.stepId, "in_progress");
    if (!step.prompt) throw new Error(`[${agentName}] beforePrompt: No prompt found in step for this agent.`);

    const data: IDataPrompt = mls.common.safeParseArgs(step.prompt) as IDataPrompt;
    if (!('page' in data) || !('prompt' in data)) throw new Error(`[${agentName}] beforePrompt: Invalid prompt structure missing page and prompt`);
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
        mode: preferModelType('code'),
        html: await getContentByExtension(data.page, 'html'),
        typescript: await getContentByExtension(data.page, 'ts'),
        style: await getContentByExtension(data.page, 'style'),
        promptUser: JSON.stringify(data)
    };

    const rc = await getPromptByHtml({ folder: '', project: 100554, shortName: 'agentImprove', data: dataPrompt });
    return rc;

}

async function getContentByExtension(fullName: string, ext: 'html' | 'ts' | 'style' | 'defs') {
    try {
        const models = mls.editor.models[fullName];
        if (!models) throw new Error(`[${agentName}][getContentByExtension]:Not found models for file:` + fullName);
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

    if (!result || !result.page) throw new Error('Not found "page" in updateFile files');
    await forceServiceInstance(2, '_100554_serviceSource');

    const info = getInfoPage(result.page);
    const contentHTML = result.html ? result.html : undefined;
    const contentTS = result.ts ? result.ts : undefined;
    const contentLess = result.less ? result.less : undefined;
    const position = result.position || 'left';
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

    refreshStateLock(result.page, position, false);
    serviceSource.formatMonaco();

}

function getInfoPage(fullName: string): { project: number, shortName: string } {
    let pr = fullName.substring(1).split("_")[0];
    let prID: number = Number(pr);
    if (isNaN(prID)) prID = 0; // error
    const shortName = fullName.substring(pr.length + 2);
    return { project: prID, shortName }
}

function getModel(info: { project: number, shortName: string }): mls.editor.IModels | undefined {
    const key = mls.editor.getKeyModel(info.project, info.shortName);
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
    page: string,
    position: 'left' | 'right',
}

