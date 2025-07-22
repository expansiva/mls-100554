/// <mls shortName="agentNewWidget3" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { preferModelType, getPromptByHtml } from './_100554_aiPrompts';
import { initState } from './_100554_collabState';
import { formatHtml } from './_100554_collabDOMSync';

import {
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    updateStepStatus,
    getNextPendentStep,
    updateTaskTitle
} from "./_100554_aiAgentHelper";

import {
    executeNextStep,
    startNewInteractionInAiTask,
    startNewAiTask
} from "./_100554_aiAgentOrchestration";

const agentName = "agentNewWidget3";

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Especialista em frontend com foco em marketing visual e persuasivo, com a tarefa de criar uma “página” de apresentação para um Web Component fornecido.",
        visibility: "private",
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        }
    };
}

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    const taskTitle = "Creating.";

    if (!context || !context.message) throw new Error("Invalid context");

    if (!context.task) {

        let pp = context.message.content
                .replace(`@@ ${agentName}`, '')
                .replace(`@@${agentName}`, '').trim()

        pp = extJson(context.message.content).trim();

        const data = mls.common.safeParseArgs(pp)
        if (!('shortName' in data) || !('project' in data)) throw new Error(`[${agentName}] beforePrompt: Invalid prompt structure missing json and prompt`);

        const inputs: any = await getPrompts(data.shortName, data.project);
        await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt);

    } else {

        const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);

        if (!step) {
            throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
        }

        context = await updateStepStatus(context, step.stepId, "in_progress");

        if (!step.prompt) throw new Error(`[${agentName}] beforePrompt: No prompt found in step for this agent.`);

        const data = mls.common.safeParseArgs(step.prompt);

        if (!('shortName' in data) || !('project' in data)) throw new Error(`[${agentName}] beforePrompt: Invalid prompt structure missing json and prompt`);

        const inputs = await getPrompts(data.shortName, data.project);
        await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);
    }
}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No pending interaction found.`);

    context = await updateStepStatus(context, step.stepId, "completed");
    await updateFile(context);
    await executeNextStep(context);
}

async function updateFile(context: mls.msg.ExecutionContext) {
    if (!context || !context.task) throw new Error('Not found context to create files');

    const step = getNextPendentStep(context.task) as mls.msg.AIFlexibleResultStep;

    if (!step || step.type !== 'flexible') throw new Error('Invalid step in create files');

    if (!step.result || !step.result.html) throw new Error('Not found "html"  in addFile files');


    const pageName = step.result.shortName;
    const project = step.result.project;
    const fileHTML = formatHtml(step.result.html);

    const m = mls.editor.getModels(project, pageName);
    if (m && m.html) m.html.model.setValue(fileHTML)

    let aux = '';
    if (m && m.ts && m.ts.compilerResults && m.ts.compilerResults.errors.length > 0) {
        aux = ', com ' + m.ts.compilerResults.errors.length + ' erros, favor verificar'

    }

    context.task = await updateTaskTitle(context.task, "Widget created" + aux);

}

export async function getPrompts(shortName: string, project: number): Promise<mls.msg.IAMessageInputType[]> {

    if (!shortName || !project) throw new Error("Invalid Prompt");

    const data = {
        mode: preferModelType("code"),
        ts: await getDefinitionsBaseTSInstruction(shortName, project)
    }

    const prompts = await getPromptByHtml({ project: 100554, shortName: 'agentNewWidget3', folder: '', data });
    prompts.push({ type: 'human', content: 'Crie um html conforme as regras' })
    return prompts;
}

async function getDefinitionsBaseTSInstruction(shortName: string, project: number): Promise<string> {

    shortName = firstLowercaseLetter(shortName);

    const key = mls.stor.getKeyToFiles(project, 2, shortName, "", ".ts");
    if (!mls.stor.files[key]) throw new Error("[systemDefinitionsBaseTSInstruction]Not found class base:" + project + "_" + shortName);

    let content = await mls.stor.files[key].getContent() as string;

    if (!content) throw new Error("[systemDefinitionsBaseTSInstruction]Not found content:" + project + "_" + shortName);
    return content
}

function extJson(str: string): string {
    const start = str.indexOf('{');
    const end = str.lastIndexOf('}');

    if (start !== -1 && end !== -1 && end > start) {
        return (str.substring(start, end + 1)).replace(/\\"/g, '"');
    } else {
        return ''; // ou lançar erro, dependendo do caso
    }
}


function firstLowercaseLetter(str: string): string {

    if (str.length === 0) return str;

    const first = str[0];
    const rest = str.slice(1);

    if (first === first.toLowerCase()) {
        return str;
    }

    return first.toLowerCase() + rest;

}
