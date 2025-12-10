/// <mls shortName="agentCreateNewPrototypePage4" project="100554" enhancement="_blank" />

import { IAgent, svg_agent } from '/_100554_/l2/aiAgentBase.js';
import { getPromptByHtml } from '/_100554_/l2/aiPrompts.js';
import { createModel } from '/_100554_/l2/collabLibModel.js';

import {
    startNewInteractionInAiTask,
    startNewAiTask,
    executeNextStep,
    addNewStep
} from "/_100554_/l2/aiAgentOrchestration.js";

import {
    getNextFlexiblePendingStep,
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    updateStepStatus,
    updateTaskTitle,
    getNextPendentStep,
    appendLongTermMemory
} from "/_100554_/l2/aiAgentHelper.js";

const agentName = "agentCreateNewPrototypePage4";

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Responsavel por fazer identificar os organismos que precisam ser alterados",
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
            { project: data.project.toString(), shortName: data.shortName, folder: data.folder, link: data.link }
        );
        return;
    }

    const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);

    if (!step) throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);

    context = await updateStepStatus(context, step.stepId, "in_progress");

    if (!step.prompt) throw new Error(`[${agentName}] beforePrompt: No prompt found in step for this agent.`);

    const data = JSON.parse(step.prompt);
    await appendLongTermMemory(context, { project: data.project.toString(), shortName: data.shortName, folder: data.folder, link: data.link });
    
    const inputs = await getPrompts(data);
    await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);

}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {

    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No pending interaction found.`);
    context = await updateStepStatus(context, step.stepId, "completed");

    if (!context.task) throw new Error("Invalid context 2");
    const payload = getNextFlexiblePendingStep(context.task) as mls.msg.AIPayload | null;

    await updateFiles(context, payload);
    if(payload) context = await updateStepStatus(context, payload.stepId, "completed");
    if (!context.task) throw new Error("Invalid context task");
    context.task = await updateTaskTitle(context.task, "Updating links");
    //await verifyNeedNewStep(context, payload);
    await executeNextStep(context);

}

const _replayForSupport = async (context: mls.msg.ExecutionContext, payload: mls.msg.AIPayload[]): Promise<void> => {
    const step = payload[0] as mls.msg.AIPayload;
    if (!step || step.type !== 'flexible') throw new Error('Invalid step for replay');
    await updateFiles(context, step);
}


async function getPrompts(info: any): Promise<mls.msg.IAMessageInputType[]> {

    if (!info || !info.project || !info.shortName || !info.folder) throw new Error(`Erro [${agentName}] getPrompts: invalid info`);

    const { project, folder, link, shortName } = info;
    
    /*const obj = typeof organism === 'string' ? JSON.parse(organism) : JSON.parse(JSON.stringify(organism));
    
    let shortName = obj.shift();*/

    const key = mls.stor.getKeyToFiles(project, 2, shortName, folder, '.ts');

    if (!mls.stor.files[key]) throw new Error(`Erro [${agentName}] getPrompts: not found stor`);

    const ts = await mls.stor.files[key].getContent() as string;

    const data = {
        link,
        ts
    };

    const prompts = await getPromptByHtml({ project: 100554, shortName: agentName, folder: '', data })
    return prompts;
}

async function updateFiles(context: mls.msg.ExecutionContext, step: mls.msg.AIPayload | null) {

    if (!step || step.type !== 'flexible' || !step.result) throw new Error('Invalid step in update defs, type: "' + step?.type + '"');

    if (typeof step.result === 'string') return;

    const pageMemory = context.task?.iaCompressed?.longMemory as any;

    if (!pageMemory.project || !pageMemory.shortName || !pageMemory.folder || !step.result) throw new Error(`[${agentName}]Invalid step in update defs, type: ${step?.type} `);

    const { project, folder, shortName } = pageMemory;
    const result = step.result;
    /*const obj = typeof organism === 'string' ? JSON.parse(organism) : JSON.parse(JSON.stringify(organism));
    const shortName = obj.shift();*/

    const key = mls.stor.getKeyToFiles(project, 2, shortName, folder, '.ts');
    const keyless = mls.stor.getKeyToFiles(project, 2, shortName, folder, '.less');
    const keyhtml = mls.stor.getKeyToFiles(project, 2, shortName, folder, '.html');

    if (!mls.stor.files[key]) throw new Error(`Erro [${agentName}] updateFiles: not found stor `);

    if (!result.ts) throw new Error(`Erro [${agentName}] updateFiles: not found ts`);


    let models = mls.editor.getModels(project, shortName, folder);
    if (!models || !models.ts) {

        if (mls.stor.files[keyless]) await createModel(mls.stor.files[keyless], true, false);

        await createModel(mls.stor.files[key], true, false);

        if (mls.stor.files[keyhtml]) await createModel(mls.stor.files[keyhtml], true, false);
        
        models = mls.editor.getModels(project, shortName, folder);

    }

    if (!models || !models.ts) throw new Error(`Erro [${agentName}] updateFiles: not found models`);

    models.ts.model.setValue(result.ts);


}

async function verifyNeedNewStep(context: mls.msg.ExecutionContext, step: mls.msg.AIPayload | null) {

    if (!step || step.type !== 'flexible' || !step.result) throw new Error('Invalid step in update defs, type: "' + step?.type + '"');

    const pageMemory = context.task?.iaCompressed?.longMemory as any;

    if (!pageMemory.project || !pageMemory.shortName || !pageMemory.folder ) throw new Error(`[${agentName}]Invalid step in update defs, type `);

    const { project, folder, organism } = pageMemory;
    const obj = typeof organism === 'string' ? JSON.parse(organism) : JSON.parse(JSON.stringify(organism));
    obj.shift();


    if (obj.length > 0) {
        const newStep: mls.msg.AIPayload = {
            agentName: 'agentCreateNewPrototypePage4',
            prompt: JSON.stringify({ project, shortName:pageMemory.shortName, folder, organism:obj, link:pageMemory.link }),
            status: 'pending',
            stepId: step.stepId + 1,
            interaction: null,
            nextSteps: null,
            rags: null,
            type: 'agent'
        }

        context = await addNewStep(context, step.stepId, [newStep]) as mls.msg.ExecutionContext;
    }

}
