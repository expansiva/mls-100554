/// <mls shortName="agentCreateNewPrototypePage3" project="100554" enhancement="_blank" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { getPromptByHtml } from './_100554_aiPrompts';
import { loadModuleFromProjectOrDependency } from './_100554_libCommom';

import {
    startNewInteractionInAiTask,
    startNewAiTask,
    executeNextStep,
    addNewStep
} from "./_100554_aiAgentOrchestration";

import {
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    updateStepStatus,
    updateTaskTitle,
    getNextPendentStep,
    appendLongTermMemory
} from "./_100554_aiAgentHelper";

const agentName = "agentCreateNewPrototypePage3";

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Responsavel por fazer identificar os organismos que precisam ser alterados",
        visibility: "public",
        scope: ['l2_preview'],
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
            { project: data.project.toString(), shortName: data.shortName, folder: data.folder }
        );
        return;
    }

    const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);

    if (!step) throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);

    context = await updateStepStatus(context, step.stepId, "in_progress");

    if (!step.prompt) throw new Error(`[${agentName}] beforePrompt: No prompt found in step for this agent.`);

    const data = JSON.parse(step.prompt);
    await appendLongTermMemory(context, { project: data.project.toString(), shortName: data.shortName, folder: data.folder });
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

    await updateFiles(context, payload);
    if(payload) context = await updateStepStatus(context, payload.stepId, "completed");
    if (!context.task) throw new Error("Invalid context task");
    context.task = await updateTaskTitle(context.task, "Checking links");
    //await executeNextStep(context);

}

const _replayForSupport = async (context: mls.msg.ExecutionContext, payload: mls.msg.AIPayload[]): Promise<void> => {
    const step = payload[0] as mls.msg.AIPayload;
    if (!step || step.type !== 'flexible') throw new Error('Invalid step for replay');
    await updateFiles(context, step);
}


async function getPrompts(info: any): Promise<mls.msg.IAMessageInputType[]> {

    if (!info || !info.project || !info.shortName || !info.folder) throw new Error(`Erro [${agentName}] getPrompts: invalid info`);

    const mm = await loadModuleFromProjectOrDependency('module', info.folder, '.ts');

    if (!mm || !mm.payload3) throw new Error(`Erro [${agentName}] getPrompts: invalid module`);

    const clone = JSON.parse(JSON.stringify(mm.payload3));
    if (clone.finalModuleDetails) delete clone.finalModuleDetails;
    if (clone.pages) delete clone.pages;
    if (clone.plugins) delete clone.plugins;
    if (clone.pagesWireframe) delete clone.pagesWireframe;
    if (clone.visualIdentity) delete clone.visualIdentity;
    if (clone.tokens) delete clone.tokens;

    const context = JSON.stringify(clone);

    const data = {
        context
    };

    const prompts = await getPromptByHtml({ project: 100554, shortName: agentName, folder: '', data })
    return prompts;
}

async function updateFiles(context: mls.msg.ExecutionContext, step: mls.msg.AIPayload | null) {

    if (!step || step.type !== 'flexible' || !step.result) throw new Error('Invalid step in update defs, type: "' + step?.type + '"');

    if (typeof step.result === 'string') return;

    const pageMemory = context.task?.iaCompressed?.longMemory as any;

    if (!pageMemory.project || !pageMemory.shortName || !pageMemory.folder || !step.result) throw new Error(`[${agentName}]Invalid step in update defs, type: ${step?.type} `);

    const { project, shortName, folder } = pageMemory;
    const result = step.result;

    if (!result.organismsToUpdate) return;
    
    //const organism = [];
    let nextStep = step.stepId;
    for await (const org of result.organismsToUpdate) {

        const name = toCamelCase(org);
        nextStep = nextStep + 1;
        const newStep: mls.msg.AIPayload = {
            agentName: 'agentCreateNewPrototypePage4',
            prompt: JSON.stringify({ project, shortName:name, folder, link: shortName }),
            status: 'pending',
            stepId: nextStep,
            interaction: null,
            nextSteps: null,
            rags: null,
            type: 'agent'
        }

        await addNewStep(context, step.stepId, [newStep]);

    }

    /*const newStep: mls.msg.AIPayload = {
        agentName: 'agentCreateNewPrototypePage4',
        prompt: JSON.stringify({project, shortName, folder, organism, link:shortName}),
        status: 'pending',
        stepId: step.stepId + 1,
        interaction: null,
        nextSteps: null,
        rags: null,
        type: 'agent'
    }

    await addNewStep(context, step.stepId, [newStep]);*/

}

function toCamelCase(input: string): string {
    return input
        .split('-')
        .map((word, index) =>
            index === 0
                ? word.toLowerCase()
                : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join('');
}
