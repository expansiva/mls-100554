/// <mls shortName="agentGenerateStyle" project="100554" enhancement="_blank" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { getPromptByHtml } from './_100554_aiPrompts';
import { createAllModels } from './_100554_collabLibModel';
import { removeTokensFromSource } from './_100554_enhancementStyle';
import { getTokensLess, getGlobalLess } from './_100554_designSystemBase';

import {
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    getNextFlexiblePendingStep,
    appendLongTermMemory,
    notifyTaskChange,
    updateStepStatus,
} from "./_100554_aiAgentHelper";

import {
    startNewInteractionInAiTask,
    startNewAiTask,
    executeNextStep,
} from "./_100554_aiAgentOrchestration";

const agentName = "agentGenerateStyle";
const project = 100554;

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Agent for optimize style",
        visibility: "public",
        scope: ['l2_preview'],
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        },
    };
}

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {

    const taskTitle = "Planning Style....";
    if (!context || !context.message) throw new Error("Invalid context");
    if (!context.task) {
        let data: IDataPrompt | undefined;
        let pp = context.message.content
            .replace(`@@ ${agentName}`, '')
            .replace(`@@${agentName}`, '').trim()
            .replace(`@@GenerateStyle`, '');

        data = mls.common.safeParseArgs(pp) as IDataPrompt;
        if (!('page' in data)) throw new Error(`[${agentName}] beforePrompt: Invalid prompt structure`);
        let inputs = await getPrompts(data);

        await startNewAiTask(
            agentName,
            taskTitle,
            context.message.content,
            context.message.threadId,
            context.message.senderId,
            inputs,
            context,
            _afterPrompt,
            { 'fileName': data.page }

        ).catch((err) => {
            throw new Error(err.message)
        });
        return;
    }


    const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
    context = await updateStepStatus(context, step.stepId, "in_progress");
    if (!step.prompt) throw new Error(`[${agentName}] beforePrompt: No prompt found in step for this agent.`);

    const data: IDataPrompt = mls.common.safeParseArgs(step.prompt) as IDataPrompt;
    if (!('page' in data)) throw new Error(`[${agentName}] beforePrompt: Invalid prompt structure`);
    await appendLongTermMemory(context, { 'fileName': data.page });

    const inputs = await getPrompts(data);
    await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);

}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No in progress interaction found.`);
    context = await updateStepStatus(context, step.stepId, "completed");
    context = await updateFile(context);
    notifyTaskChange(context);
    await executeNextStep(context);
}

async function getPrompts(data: IDataPrompt): Promise<mls.msg.IAMessageInputType[]> {

    const info = mls.l2.getPath(data.page);
    const typescript = data.mode === 'organism' ? await getContentByExtension(info, 'ts') : '';
    const html = data.mode === 'page' ? await getContentByExtension(info, 'html') : '';
    let less = await getContentByExtension(info, 'style');
    if (less) less = removeTokensFromSource(less);

    const themeModule = await import(`./_${info.project}_${info.folder}/module`);
    let theme = 'Default';
    if (themeModule && themeModule.moduleConfig && themeModule.moduleConfig.theme && typeof themeModule.moduleConfig.theme === 'string') {
        theme = themeModule.moduleConfig.theme;
    }
    const tokens = await getTokensLess(info.project, theme);
    const globalCss = await getGlobalLess(info.project);
    const dataForReplace = {
        html,
        typescript,
        tokens,
        globalCss: globalCss.replace(/project-\d+\s*{([\s\S]*)}$/m, "$1"),
        less,
        promptUser: data.prompt || ""
    }

    console.info(dataForReplace)

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
    const key = mls.editor.getKeyModel(info.project, info.shortName, info.folder, mls.actualLevel);
    return mls.editor.models[key];
}

async function updateFile(context: mls.msg.ExecutionContext) {

    if (!context || !context.task) throw new Error(`[${agentName}] updateFile: Not found context`);
    const step = getNextFlexiblePendingStep(context.task);

    if (!step || step.type !== 'flexible') throw new Error(`[${agentName}] updateFile: Invalid step in updateFile`);
    const result: IDataResult = step.result;

    if (!result) throw new Error(`[${agentName}] updateFile: Not found "result"`);
    const fileName = context.task?.iaCompressed?.longMemory['fileName'];
    if (!fileName) throw new Error(`[${agentName}] updateFile: Invalid task memory arguments`);

    const { logs,  resultHtmlComponent, resultLessComponent, resultLessGlobal, resultTypescriptComponent } = result;

    const { folder, project, shortName } = mls.l2.getPath(fileName);

    const models = getModel({ folder, project, shortName });
    if (!models) throw new Error(`[${agentName}] updateFile: Not found models`);

    if (resultHtmlComponent && models.html) models.html.model.setValue(resultHtmlComponent);
    if (resultLessComponent && models.style) {
        const resultLessComponent2 = await prepareComponentCss(resultLessComponent, project, folder);
        models.style.model.setValue(resultLessComponent2);
    }
    if (resultTypescriptComponent && models.ts) {
        models.ts.model.setValue(resultTypescriptComponent);
        mls.editor.forceModelUpdate(models.ts.model);
    }

    if (resultLessGlobal) await updateGlobalCss(resultLessGlobal, project, folder);
    context = await updateStepStatus(context, step.stepId, "completed");
    return context;

}

async function updateGlobalCss(globalCss: string, project: number, theme: string) {
    const pathGlobal = mls.l2.getPath(`_${project}_project`);
    let modelsGlobal = getModel({ folder: pathGlobal.folder, project: pathGlobal.project, shortName: pathGlobal.shortName });
    if (!modelsGlobal) {
        const keyToStorFile = mls.stor.getKeyToFiles(pathGlobal.project, 2, 'project', pathGlobal.folder, '.ts');
        const storFile = mls.stor.files[keyToStorFile];
        if (!storFile) throw new Error(`[${agentName}] updateFile: Not found project file`);
        modelsGlobal = await createAllModels(storFile, true, true);
    }

    if (!modelsGlobal) throw new Error(`[${agentName}] updateFile: Not found models for project file`);
    const css = await prepareGlobalCss(globalCss, project, theme);
    if (css && modelsGlobal.style) {
        modelsGlobal.style.model.setValue(css);
        mls.editor.forceModelUpdate(modelsGlobal.style.model);
    }

}

async function prepareComponentCss(css: string, projectId: number, theme: string) {
    const tokens = await getTokensLess(projectId, theme)
    const resultCss = removeTokensFromSource(css);
    const tokensCss = `\n\n//Start Less Tokens\n${tokens}\n//End Less Tokens`;
    return `${resultCss}\n${tokensCss}`;
}

async function prepareGlobalCss(css: string, projectId: number, theme: string) {
    let lines = css.split("\n");

    if (lines[0].trim().startsWith("///")) {
        lines.shift();
    }

    let cssContent = lines.join("\n").trim();
    const tokens = await getTokensLess(projectId, theme)
    cssContent = removeTokensFromSource(cssContent);
    const tokensCss = `\n\n//Start Less Tokens\n${tokens}\n//End Less Tokens`;
    return `/// <mls shortName="project" project="${projectId}" enhancement="enhancementStyle" folder="" />\nproject-${projectId} {\n${cssContent}\n}${tokensCss}`;
}

interface IDataPrompt {
    page: string,
    prompt: string,
    mode: 'page' | 'organism' | 'widget'
}

interface IDataResult {
    resultLessGlobal: string,
    resultLessComponent: string,
    resultHtmlComponent: string,
    resultTypescriptComponent: string,
    logs: string[],
}
