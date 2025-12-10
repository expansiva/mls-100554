/// <mls shortName="agentCreateNewPrototypeOrganism2" project="100554" enhancement="_blank" />

import { IAgent, svg_agent } from '/_100554_/l2/aiAgentBase.js';
import { getPromptByHtml } from '/_100554_/l2/aiPrompts.js';;
import { convertFileNameToTag } from '/_100554_/l2/utilsLit.js';
import { forceServiceInstance } from '/_100554_/l2/libCommom.js';
import { getTokensLess, getGlobalLess } from '/_100554_/l2/designSystemBase.js';

import {
    startNewInteractionInAiTask,
    startNewAiTask,
    addNewStep

} from "/_100554_/l2/aiAgentOrchestration.js";

import {
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    getNextFlexiblePendingStep,
    updateStepStatus,
    updateTaskTitle,
    appendLongTermMemory
} from "/_100554_/l2/aiAgentHelper.js";

const agentName = "agentCreateNewPrototypeOrganism2";

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Responsavel por fazer o arquivo ts de um novo organismo",
        visibility: "public",
        scope: [],
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        },
        async replayForSupport(context: mls.msg.ExecutionContext, payload: mls.msg.AIPayload[]): Promise<void> {
            return _replayForSupport(context, payload);
        }
    }
};

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    const taskTitle = "Planning";

    if (!context || !context.message) throw new Error("Invalid context");
    if (!context.task) {

        let pp = context.message.content
            .replace(`@@ ${agentName}`, '')
            .replace(`@@${agentName}`, '').trim();

        let data = JSON.parse(pp);
        const inputs = await getPrompts(data);

        await startNewAiTask(
            agentName,
            taskTitle,
            context.message.content,
            context.message.threadId,
            context.message.senderId,
            inputs, context,
            _afterPrompt,
            { project: data.project, shortName: data.shortName, folder: data.folder }
        );
        return;
    }

    const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);

    if (!step) throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);

    context = await updateStepStatus(context, step.stepId, "in_progress");

    if (!step.prompt) throw new Error(`[${agentName}] beforePrompt: No prompt found in step for this agent.`);

    const data = JSON.parse(step.prompt);
    await appendLongTermMemory(context, { project: data.project, shortName: data.shortName, folder: data.folder });
    const inputs = await getPrompts(data);
    await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);

}


const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {

    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const stepInProgress: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!stepInProgress) throw new Error(`[${agentName}] afterPrompt: No pending interaction found.`);
    const rc = await updateFiles(context);
    if (rc) context = rc;
    context = await updateStepStatus(context, stepInProgress.stepId, "completed");
    if (!context.task) throw new Error("Invalid context task");
    context.task = await updateTaskTitle(context.task, "Organism created sucessfully");

}

const _replayForSupport = async (context: mls.msg.ExecutionContext, payload: mls.msg.AIPayload[]): Promise<void> => {

}

async function getPrompts(info: any): Promise<mls.msg.IAMessageInputType[]> {

    if (!info || !info.project || !info.shortName || !info.folder) throw new Error(`Erro [${agentName}] getPrompts: invalid info`);
    const models = mls.editor.getModels(info.project, info.shortName, info.folder);
    if (!models || !models.ts || !models.style || !models.defs) throw new Error(`Erro [${agentName}] getPrompts: not found models`)

    let tokens = await getTokensLess(info.project, info.folder);
    const tag = convertFileNameToTag({ project: info.project, shortName: info.shortName, folder: info.folder, });
    const globalCss = await getGlobalLess(info.project);

    const data = {
        project: info.project,
        shortName: info.shortName,
        folder: info.folder,
        tag: tag,
        defs: models.defs.model.getValue(),
        globalCss,
        tokens
    };

    const prompts = await getPromptByHtml({ project: 100554, shortName: agentName, folder: '', data })
    return prompts;
}

async function updateFiles(context: mls.msg.ExecutionContext) {

    if (!context || !context.task) throw new Error(`[${agentName}] updateFile: Not found context`);

    const step = getNextFlexiblePendingStep(context.task);
    if (!step || step.type !== 'flexible') throw new Error(`[${agentName}] updateFile: Invalid step in updateFile`);

    const pageMemory = context.task?.iaCompressed?.longMemory as any;

    if (!pageMemory.project || !pageMemory.shortName || !pageMemory.folder || !step.result) throw new Error(`[${agentName}]Invalid step in update files, type: ${step?.type} `);

    const { project, shortName, folder } = pageMemory;
    const result = step.result;
    const tag = convertFileNameToTag({ project, shortName, folder });
    const models = mls.editor.getModels(project, shortName, folder);

    if (!models || !models.ts || !models.style || !models.defs || !models.html) throw new Error(`Erro [${agentName}] updateFiles: not found models`)

    if (!result.ts) throw new Error(`Erro [${agentName}] updateFiles: not found ts result`)

    models.ts.model.setValue(result.ts);

    if (result.less) {
        let text = models.style.model.getValue();
        let start = text.indexOf(tag);
        let end = text.indexOf('//Start Less Tokens');

        if (start !== -1 && end !== -1 && start < end) {
            const before = text.substring(0, start);
            const after = text.substring(end);

            const newContent = `\n${result.less}\n`;
            text = before + newContent + after;
            models.style.model.setValue(text);
        }

    }

    models.html.model.setValue(`<${tag}></${tag}>`);
    context = await updateStepStatus(context, step.stepId, "completed");
    const res = await fireAgenteImproveStyle(context, step);

    if (models.ts) {
        //mls.l2.typescript.compileAndPostProcess(models.ts, true, true);
        mls.editor.forceModelUpdate(models.ts.model);
    }
    if (models.html) mls.editor.forceModelUpdate(models.html.model);

    return res;

}


async function fireAgenteImproveStyle(
    context: mls.msg.ExecutionContext,
    step: mls.msg.AIFlexibleResultStep
) {
    await forceServiceInstance(2, '_100554_serviceSource');
    const pageMemory = context.task?.iaCompressed?.longMemory as any;

    if (!pageMemory.project || !pageMemory.shortName || !pageMemory.folder) throw new Error(`[${agentName}]Invalid argument in fireAgenteImproveStyle`);
    const { project, shortName, folder } = pageMemory;
    const page = folder ? `_${project}_${folder}/${shortName}` : `_${project}_${shortName}`

    const nextSteps = [];
    let nextStepId = step.stepId + 1;

    const data = { page, prompt: 'Improve style', mode: 'organism' }
    const newStep: mls.msg.AIPayload = {
        agentName: 'agentGenerateStyle',
        prompt: JSON.stringify(data),
        status: 'pending',
        stepId: nextStepId,
        interaction: null,
        nextSteps: null,
        rags: null,
        type: 'agent'
    };

    nextSteps.push(newStep);

    return await addNewStep(context, step.stepId, nextSteps);

}

