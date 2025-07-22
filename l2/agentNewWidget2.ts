/// <mls shortName="agentNewWidget2" project="100554" enhancement="_blank" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { forceServiceInstance } from './_100554_libCommom';
import { convertFileNameToTag } from './_100554_utilsLit';
import { createNewFile } from "./_100554_pluginNewFileBase";
import { descriptionForPrompt } from "./_100554_icaBaseDescription";
import { initCompileMonaco } from "./_100554_collabInit";
import { initState } from './_100554_collabState';
import { formatHtml } from './_100554_collabDOMSync';

import { preferModelType, systemComponentsInstruction, systemTokensLessInstruction, getPromptByHtml } from './_100554_aiPrompts';

import {
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    updateStepStatus,
    getNextPendentStep,
    updateTaskTitle
} from "./_100554_aiAgentHelper";

import {
    startNewAiTask,
    executeNextStep,
    startNewInteractionInAiTask,
    addNewStep
} from "./_100554_aiAgentOrchestration";

const agentName = "agentNewWidget2";
const project = 100554;
const enhancement = '_100554_enhancementLit';

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Responsável pela criação de um novo web componente (widget) para o sistema Collab Codes.",
        visibility: "private",
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        },
        async replayForSupport(context: mls.msg.ExecutionContext, payload: mls.msg.AIPayload[]): Promise<void> {
            return _replayForSupport(payload);
        },
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
        const data = mls.common.safeParseArgs(pp);
        if (!('json' in data) || !('prompt' in data)) throw new Error(`[${agentName}] beforePrompt: Invalid prompt structure missing json and prompt`);
        const inputs: any = await getPrompts(data.json, data.prompt, []);
        await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt);
    } else {

        const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
        if (!step) {
            throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
        }

        context = await updateStepStatus(context, step.stepId, "in_progress");

        if (!step.prompt) throw new Error(`[${agentName}] beforePrompt: No prompt found in step for this agent.`);
        const data = mls.common.safeParseArgs(step.prompt);
        if (!('json' in data) || !('prompt' in data)) throw new Error(`[${agentName}] beforePrompt: Invalid prompt structure missing json and prompt`);

        const inputs = await getPrompts(data.json, data.prompt, step.rags);

        await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);
    }
}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No pending interaction found.`);

    context = await updateStepStatus(context, step.stepId, "completed");
    await addFile(context);

    //await executeNextStep(context);
}


const _replayForSupport = async (payload: mls.msg.AIPayload[]): Promise<void> => {

    const step = payload[0] as mls.msg.AIPayload;
    if (!step || step.type !== 'flexible') throw new Error('Invalid step in create files');

    const content = (step as any).content ? (step as any).content : step.result;

    if (!content || !content.html || !content.ts || !content.less || !content.shortName) throw new Error('Not found "html" or "ts" or "less" or "shortName" in addFile files');

    const prj = mls.actual[5].project || 0;
    content.project = prj;

    await createNewFiles(content);


}

async function addFile(context: mls.msg.ExecutionContext) {

    if (!context || !context.task) throw new Error('Not found context to create files');
    const step = getNextPendentStep(context.task);

    if (!step || step.type !== 'flexible') throw new Error('Invalid step in create files');

    const content = (step as any).content ? (step as any).content : step.result;

    if (!content || !content.html || !content.ts || !content.less || !content.shortName) throw new Error('Not found "html" or "ts" or "less" or "shortName" in addFile files');

    const prj = mls.actual[5].project || 0;

    content.project = prj;

    await createNewFiles(content);

    const rc = { shortName: content.shortName, project:prj }

    const newStep: mls.msg.AIPayload = {
        agentName: 'agentNewWidget3',
        prompt: JSON.stringify(rc),
        status: 'pending',
        stepId: step.stepId + 1,
        interaction: null,
        nextSteps: null,
        rags: null,
        type: 'agent'
    }

    await addNewStep(context, step.stepId, [newStep]);

    let aux = '';
    const m = mls.editor.getModels(prj, content.pageName);
    if (m && m.ts && m.ts.compilerResults && m.ts.compilerResults.errors.length > 0) {
        aux = ', com ' + m.ts.compilerResults.errors.length + ' erros, favor verificar'

    }

    context.task = await updateTaskTitle(context.task, "Widget created " + content.pageName + aux);

}

async function createNewFiles(content: { shortName: string, html: string, ts: string, less: string, project:number }) {

    await forceServiceInstance(2, '_100554_serviceSource');

    if (content.project) await initCompileMonaco(content.project);

    const pageName = content.shortName;
    const fileHTML = formatHtml(content.html);
    const fileTS = content.ts;
    const fileLess = content.less;

    await createNewFile(
        { project: content.project, position: 'right', shortName: pageName, enhancement, sourceTS: fileTS, sourceHTML: fileHTML, sourceLess: fileLess, openPreview: false }
    );
}

export async function getPrompts(obj: any[], prompt: string | undefined, rags: string[] | null): Promise<mls.msg.IAMessageInputType[]> {
    if (!prompt || prompt.length < 3) throw new Error("Invalid Prompt");

    const tokens = await systemTokensLessInstruction();
    const data = {
        mode: preferModelType("code"),
        requirements: JSON.stringify(obj, null, 2),
        mdcontent: getDefinitionMD(obj),
        basets: await getBase(obj),
        tokens: tokens.content,
        humanPrompt: prompt
    }

    const prompts = await getPromptByHtml({ project: 100554, shortName: 'agentNewWidget2', folder: '', data })
    return prompts;
    
}

function getDefinitionMD(obj: any[]): string {

    try {

        const step = obj.find((i) => i.sectionName === 'parentClass');
        if (!step) throw new Error("[getDefinitionMD] Not found section: parentClass");
        if (!step.widgetName) throw new Error("[getDefinitionMD] Not found widget in parentClass");

        const shortName = firstLowercaseLetter(step.widgetName);
        let tag = convertFileNameToTag(`_100554_${shortName}`);
        tag = extractBaseComponentName(tag);

        const content = extractComponentMarkdown(descriptionForPrompt, tag);

        return content as string;


    } catch (e) {
        console.info(e);
        return '';
    }

}

async function getBase(obj: any[]): Promise<string> {

    try {

        const step = obj.find((i) => i.sectionName === 'parentClass');
        if (!step) throw new Error("[getBase] Not found section: parentClass");
        if (!step.widgetName) throw new Error("[getBase] Not found widget in parentClass");

        const shortName = firstLowercaseLetter(step.widgetName);

        const key = mls.stor.getKeyToFiles(project, 2, shortName, "", ".ts");
        if (!mls.stor.files[key]) throw new Error('[getBase] not found class base:' + shortName);

        let content = await mls.stor.files[key].getContent() as string;

        if (!content) throw new Error('[getBase] not found content:' + key);

        return content


    } catch (e) {
        console.info(e);
        return '';
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

function extractComponentMarkdown(md: string, componentName: string): string | null {

    const pattern = new RegExp(`(## ${componentName}\\n(?:.+\\n)*?)(?=\\n## |$)`, 'gm');
    const match = md.match(pattern);

    if (match) {
        const lines = match[0].split('##');
        return lines && lines[1] ? lines[1].trim() : '';
    }

    return '';
}

function extractBaseComponentName(input: string): string {
    const match = input.match(/^(.*?)(?:-base-\d+)?$/);
    return match ? match[1] : input;
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
