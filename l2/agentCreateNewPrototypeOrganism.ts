/// <mls shortName="agentCreateNewPrototypeOrganism" project="100554" enhancement="_blank" />

import { html, TemplateResult } from 'lit';
import { IAgent, svg_agent } from '/_100554_/l2/aiAgentBase.js';
import { getPromptByHtml } from '/_100554_/l2/aiPrompts.js';
import { loadModuleFromProjectOrDependency } from '/_100554_/l2/libCommom.js';
import { createAllModels } from '/_100554_/l2/collabLibModel.js';
import { convertFileNameToTag } from '/_100554_/l2/utilsLit.js'; 
import '/_100554_/l2/agentCreateNewPrototypeOrganismFeedback.js';

import {
    startNewInteractionInAiTask,
    startNewAiTask,
    addNewStep 
} from "/_100554_/l2/aiAgentOrchestration.js";

import {
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    updateStepStatus,
    updateTaskTitle,
    getNextPendentStep,
    appendLongTermMemory
} from "/_100554_/l2/aiAgentHelper.js";

const agentName = "agentCreateNewPrototypeOrganism";

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Responsavel por fazer o arquivo defs de um novo organismo",
        visibility: "private",
        scope: [],
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        },
        async replayForSupport(context: mls.msg.ExecutionContext, payload: mls.msg.AIPayload[]): Promise<void> {
            return _replayForSupport(context, payload);
        },
        async getFeedBack(task: mls.msg.TaskData): Promise<TemplateResult> {
            return _getFeedBack(task);
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
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No pending interaction found.`);
    context = await updateStepStatus(context, step.stepId, "completed");

    if (!context.task) throw new Error("Invalid context 2");
    const payload = getNextPendentStep(context.task) as mls.msg.AIPayload | null;

    await updateDefs(context, payload);
    if (!context.task) throw new Error("Invalid context task");
    context.task = await updateTaskTitle(context.task, "Defs completed");
    // await executeNextStep(context);

}

const _replayForSupport = async (context: mls.msg.ExecutionContext, payload: mls.msg.AIPayload[]): Promise<void> => {
    const step = payload[0] as mls.msg.AIPayload;
    if (!step || step.type !== 'flexible') throw new Error('Invalid step for replay');
    await updateDefs(context, step);
}

const _getFeedBack = async (task: mls.msg.TaskData): Promise<TemplateResult> => {
    if (!task) throw new Error(`[${agentName}](getFeedBack) Invalid task`);
    return html`<agent-create-new-prototype-organism-feedback-100554 .task=${task}></agent-create-new-prototype-organism-feedback-100554>`
}

async function getPrompts(info: any): Promise<mls.msg.IAMessageInputType[]> {

    if (!info || !info.project || !info.shortName || !info.folder) throw new Error(`Erro [${agentName}] getPrompts: invalid info`);
    const mm = await loadModuleFromProjectOrDependency('module', info.folder, '.ts');

    if (!mm || !mm.payload3) throw new Error(`Erro [${agentName}] getPrompts: invalid module`);
    const context = JSON.stringify(mm.payload3.finalModuleDetails);
    const data = {
        context,
        userPrompt: info.userPrompt
    };

    const prompts = await getPromptByHtml({ project: 100554, shortName: agentName, folder: '', data })
    return prompts;
}

async function updateDefs(context: mls.msg.ExecutionContext, step: mls.msg.AIPayload | null) {
    if (!step || step.type !== 'flexible' || !step.result) throw new Error('Invalid step in update defs, type: "' + step?.type + '"');
    if (typeof step.result === 'string') return;

    const pageMemory = context.task?.iaCompressed?.longMemory as any;

    if (!pageMemory.project ||
        !pageMemory.shortName ||
        !pageMemory.folder ||
        !step.result) throw new Error(`[${agentName}]Invalid step in update defs, type: ${step?.type} `);

    const { project, shortName, folder } = pageMemory;
    const result = step.result;
    const models = mls.editor.getModels(project, shortName, folder);
    if (!models || !models.defs) throw new Error(`[${agentName}]updateDefs not found models`)

    let modelsMM = mls.editor.getModels(project, 'module', folder);
    if (!modelsMM || !modelsMM.ts) {
        const key = mls.stor.getKeyToFiles(project, 2, 'module', folder, '.ts');
        const st = mls.stor.files[key];
        if (!st) throw new Error(`[${agentName}]updateDefs not found stor module`);
        await createAllModels(st, true, false, false);
        modelsMM = mls.editor.getModels(project, 'module', folder);
    }

    if (!modelsMM || !modelsMM.ts) throw new Error(`[${agentName}]updateDefs not found models module`);

    const defs: mls.l4.BaseDefs = {
        meta: {
            projectId: +project,
            folder: folder,
            shortName: shortName,
            type: "organism",
            scope: 'app',
            devFidelity: "scaffold",
            group: folder,
        },
        references: {
            widgets: [],
            plugins: [],
            statesRO: [],
            statesRW: [],
            statesWO: [],
            imports: []
        },
        planning: result.planning
    }

    const oldText = models.defs.model.getValue().split('/>');
    const newText = `${oldText[0]}/>
export const defs: mls.l4.BaseDefs = ${JSON.stringify(defs, null, 2)}
    `;
    models.defs.model.setValue(newText);

    const tag = convertFileNameToTag({ project, shortName, folder });
    const newStep: mls.msg.AIPayload = {
        agentName: 'agentCreateNewPrototypeOrganism2',
        prompt: JSON.stringify({ project, shortName, folder, tag }),
        status: 'pending',
        stepId: step.stepId + 1,
        interaction: null,
        nextSteps: null,
        rags: null,
        type: 'agent'
    }

    await addNewStep(context, step.stepId, [newStep]);

}
