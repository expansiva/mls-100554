/// <mls shortName="agentImprovePrototypeOrganism" project="100554" enhancement="_100554_enhancementLit" groupName="other" folder="" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { getPromptByHtml } from './_100554_aiPrompts';
import { convertTagToFileName } from './_100554_utilsLit';
import { createAllModels } from './_100554_collabLibModel';
import { getImages } from './_100554_libUnsplash';
import { getTokensLess } from './_100554_designSystemBase';
import { removeTokensFromSource } from './_100554_enhancementStyle';

import {
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    getNextFlexiblePendingStep,
    getNextPendentStep,
    appendLongTermMemory,
    updateTaskTitle,
    updateStepStatus
} from "./_100554_aiAgentHelper";

import {
    startNewInteractionInAiTask,
    startNewAiTask,
    executeNextStep,
    addNewStep,
    ClarificationValue,
    startClarification
} from "./_100554_aiAgentOrchestration";

const agentName = "agentImprovePrototypeOrganism";
const project = 100554;

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Agent for prototype improve on organism",
        visibility: "public",
        scope: ['l3_preview'],
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        },
    };
}

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    if (!context || !context.message) throw new Error("Invalid context");


    if (!context.task) {

        let messageReplace = context.message.content
            .replace(`@@ ${agentName}`, '')
            .replace(`@@${agentName}`, '').trim()
            .replace(`@@ImprovePrototypeOrganism`, '');
        let data: IDataMessage | undefined;
        data = mls.common.safeParseArgs(messageReplace) as IDataMessage;

        if (!('page' in data) || !('prompt' in data)) throw new Error(`[${agentName}] beforePrompt: Invalid prompt structure missing page and prompt`);

        try {

            const infoOrganism = mls.l2.getPath(data.page);
            if (!infoOrganism) throw new Error(`[${agentName}] beforePrompt: Invalid organism file info`);
            const { folder, project, shortName } = infoOrganism;
            const inputs = await getPrompts(data, infoOrganism);
            const title = `Improve ${infoOrganism.shortName}`
            await startNewAiTask(
                agentName,
                title,
                context.message.content,
                context.message.threadId,
                context.message.senderId,
                inputs,
                context,
                _afterPrompt,
                { 'shortName': `${shortName}`, 'project': `${project}`, 'folder': `${folder}` }
            ).catch((err) => {
                throw new Error(err.message)
            });
        } catch (err: any) {
            throw new Error(err.message)
        }


        return;
    }

    const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
    context = await updateStepStatus(context, step.stepId, "in_progress");
    if (!step.prompt) throw new Error(`[${agentName}] beforePrompt: No prompt found in step for this agent.`);

    const data: IDataMessage = mls.common.safeParseArgs(step.prompt) as IDataMessage;
    if (!('page' in data) || !('prompt' in data)) throw new Error(`[${agentName}] beforePrompt: Invalid prompt structure missing page and prompt`);

    try {
        const infoOrganism = mls.l2.getPath(data.page);
        if (!infoOrganism) throw new Error(`[${agentName}] beforePrompt: Invalid organism file info`);
        const { folder, project, shortName } = infoOrganism;
        const title = `Improve ${infoOrganism.shortName}`

        await appendLongTermMemory(context, { 'shortName': `${shortName}`, 'project': `${project}`, 'folder': `${folder}` });
        const inputs = await getPrompts(data, infoOrganism);
        await startNewInteractionInAiTask(agentName, title, inputs, context, _afterPrompt, step.stepId);
    } catch (err: any) {
        throw new Error(err.message)
    }

}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {

    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No pending interaction found.`);
    const rc = await updateFile(context);
    if (rc.context) context = rc.context;
    context = await updateStepStatus(context, step.stepId, "completed");
    if (!context.task) throw new Error("Invalid context task");
    context.task = await updateTaskTitle(context.task, "Organism improved");
    if (!rc.hasNewSteps) await executeNextStep(context);

}

async function updateFile(context: mls.msg.ExecutionContext) {

    if (!context || !context.task) throw new Error(`[${agentName}] updateFile: Not found context`);
    const step = getNextFlexiblePendingStep(context.task);

    if (!step || step.type !== 'flexible') throw new Error(`[${agentName}] updateFile: Invalid step in updateFile`);
    const result: IDataResult = step.result;

    if (!result) throw new Error(`[${agentName}] updateFile: Not found "result"`);

    const shortNameMemory = context.task?.iaCompressed?.longMemory['shortName'];
    const projectMemory = context.task?.iaCompressed?.longMemory['project'];
    const folderMemory = context.task?.iaCompressed?.longMemory['folder'];

    if (!shortNameMemory || !projectMemory) throw new Error(`[${agentName}] updateFile: Invalid task memory arguments`);

    const contentHTML = result.html ? result.html : undefined;
    let contentTS = result.ts ? result.ts : undefined;
    const contentLess = result.less ? result.less : undefined;

    const models = getModel({ folder: folderMemory || '', project: +projectMemory, shortName: shortNameMemory });
    if (!models) throw new Error(`[${agentName}] updateFile: Not found models`);

    if (contentTS) {
        const resolvedImages = await getAllImages(result.images);
        for (const [key, url] of Object.entries(resolvedImages)) {
            contentTS = replaceByPriority(contentTS, key, url);
        }
    }

    let hasErrorLess: boolean = false;
    let hasErrorTypescript: boolean = false;

    if (contentHTML && models.html) models.html.model.setValue(contentHTML);
    if (contentTS && models.ts) {
        models.ts.model.setValue(contentTS);
        const ok = await mls.l2.typescript.compileAndPostProcess(models.ts, true, false);
        hasErrorTypescript = ok === false;
    }
    if (contentLess && models.style) {
        models.style.model.setValue(contentLess);
        const ok = await mls.l2.less.compileStyle(models.style);
        hasErrorLess = ok === false;
    }

    context = await updateStepStatus(context, step.stepId, "completed");

    if ((hasErrorLess || hasErrorTypescript)) {
        const res = await fireAgentFix(context, hasErrorLess, hasErrorTypescript, +projectMemory, folderMemory, shortNameMemory, step.stepId);
        if (res) context = res;
        return {
            hasNewSteps: true,
            context
        }
    }

    return {
        hasNewSteps: false,
        context
    };

}

async function fireAgentFix(
    context: mls.msg.ExecutionContext,
    hasErrorLess: boolean,
    hasErrorTypescript: boolean,
    project: number,
    folder: string | undefined,
    shortName: string,
    stepId: number
) {

    const page = folder ? `_${project}_${folder}/${shortName}` : `_${project}_${shortName}`

    const nextStepsFix = [];
    let nextStepId = stepId + 1;
    if (hasErrorLess) {
        const data = { page, prompt: 'Fix errors in files', position: 'left', mode: 'less' }
        const newStep: mls.msg.AIPayload = {
            agentName: 'agentFix',
            prompt: JSON.stringify(data),
            status: 'pending',
            stepId: nextStepId,
            interaction: null,
            nextSteps: null,
            rags: null,
            type: 'agent'
        };

        nextStepId = nextStepId + 1;
        nextStepsFix.push(newStep);
    }

    if (hasErrorTypescript) {
        const data = { page, prompt: 'Fix errors in files', position: 'left', mode: 'typescript' }
        const newStep: mls.msg.AIPayload = {
            agentName: 'agentFix',
            prompt: JSON.stringify(data),
            status: 'pending',
            stepId: nextStepId,
            interaction: null,
            nextSteps: null,
            rags: null,
            type: 'agent'
        };
        nextStepsFix.push(newStep);
    }

    return await addNewStep(context, stepId, nextStepsFix);

}


async function getPrompts(data: IDataMessage, info: mls.cbe.IPath): Promise<mls.msg.IAMessageInputType[]> {

    const typescript = await getContentByExtension(info, 'ts');
    let less = await getContentByExtension(info, 'style');
    if (less) less = removeTokensFromSource(less);

    const themeModule = await import(`./_${info.project}_${info.folder}/module`);
    let theme = 'Default';
    if (themeModule && themeModule.moduleConfig && themeModule.moduleConfig.theme && typeof themeModule.moduleConfig.theme === 'string') {
        theme = themeModule.moduleConfig.theme;
    }
    const tokens = await getTokensLess(info.project, theme);
    const dataForReplace = {
        typescript,
        tokens,
        less,
        promptUser: data.prompt
    }

    const prompts = await getPromptByHtml({ project, shortName: agentName, folder: '', data: dataForReplace })
    return prompts;
}

async function getContentByExtension(info: mls.cbe.IPath, modelType: 'html' | 'ts' | 'style' | 'defs') {

    try {
        let models = getModel(info);

        if (!models) {
            const keyToStorFile = mls.stor.getKeyToFiles(info.project, 2, info.shortName, info.folder, '.ts');
            const stotFile = mls.stor.files[keyToStorFile];
            if (!stotFile) throw new Error(`[${agentName}][getContentByExtension]: Invalid storFile`);
            models = await createAllModels(stotFile);
        }

        if (!models) throw new Error(`[${agentName}][getContentByExtension]:Not found models for file:` + info.shortName);
        if (!models[modelType]) return '';
        return models[modelType]?.model.getValue();
    } catch (e: any) {
        throw new Error(`[${agentName}][getContentByExtension]: ${e.message}`);
    }
}

function getModel(info: { project: number, shortName: string, folder: string }): mls.editor.IModels | undefined {
    const key = mls.editor.getKeyModel(info.project, info.shortName, info.folder);
    return mls.editor.models[key];
}

async function getAllImages(
    images: Images[]
): Promise<Record<string, string>> {
    const resolved: Record<string, string> = {};


    for (const img of images) {
        try {
            const result = await getImages(img.searchText, 1, 1);
            if (result.images && result.images.length > 0) {
                const image = result.images[0];
                resolved[img.key] = image.urls[img.type];
            } else {
                resolved[img.key] = `https://source.unsplash.com/800x600/?${encodeURIComponent(img.key)}`;
            }
        } catch (err) {
            console.warn(`Failed to get image for "${img.key}":`, err);
            resolved[img.key] = `https://source.unsplash.com/800x600/?${encodeURIComponent(img.key)}`;
        }
    }

    return resolved;
}

function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceByPriority(source: string, key: string, value: string): string {
    const escapedKey = escapeRegex(key);

    const pattern1 = new RegExp(`\\{{2}${escapedKey}\\}{2}`, 'g'); // {{key}}
    const pattern2 = new RegExp(`\\$\\{${escapedKey}\\}`, 'g');     // ${key}
    const pattern3 = new RegExp(escapedKey, 'g');                   // key

    if (pattern1.test(source)) {
        return source.replace(pattern1, value);
    } else if (pattern2.test(source)) {
        return source.replace(pattern2, value);
    } else if (pattern3.test(source)) {
        return source.replace(pattern3, value);
    }

    return source;
}


interface IDataMessage {
    page: string,
    prompt: string,
    position: 'left' | 'right',
}

interface IDataResult {
    html?: string,
    ts?: string,
    less?: string,
    images: []
}

interface Images {
    key: string;
    searchText: string;
    type: 'raw' | 'full' | 'regular' | 'small' | 'thumb';
    height: number;
    width: number;
}

