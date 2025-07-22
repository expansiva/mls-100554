/// <mls shortName="agentGenerateDefs" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { forceServiceInstance } from './_100554_libCommom';
import { getPromptByHtml } from './_100554_aiPrompts';
import { getState } from './_100554_collabState';
import { ServiceSource100554 } from './_100554_serviceSource';


import {
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    updateStepStatus,
    getNextPendentStep,
    updateTaskTitle,
    notifyTaskChange
} from "./_100554_aiAgentHelper";

import {
    startNewInteractionInAiTask,
    startNewAiTask,
    executeNextStep
} from "./_100554_aiAgentOrchestration";

const agentName = "agentGenerateDefs";

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Agente especializado em manutenção de componentes",
        visibility: "public",
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        },
        async replayForSupport(context: mls.msg.ExecutionContext, payload: mls.msg.AIPayload[]): Promise<void> {
            return _replayForSupport(context, payload);
        }
    };
}

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    const taskTitle = "Creating.";
    if (!context || !context.message) throw new Error("Invalid context");

    let pp = context.message.content
        .replace(`@@ ${agentName}`, '')
        .replace(`@@${agentName}`, '').trim();
        
    pp = extJson(context.message.content).trim();

    if (!context.task) {
        const inputs: any = await getPrompts(mls.common.safeParseArgs(pp));
        await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt);
    } else {
        const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
        if (!step) {
            throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
        }
        context = await updateStepStatus(context, step.stepId, "in_progress");

        if (!step.prompt) throw new Error(`[${agentName}] beforePrompt: No prompt found in step for this agent.`);

        const data: any = mls.common.safeParseArgs(extJson(step.prompt).trim());
        if (!('project' in data) || !('shortName' in data)) throw new Error(`[${agentName}] beforePrompt: Invalid prompt structure missing json and prompt`);

        const inputs = await getPrompts(data);

        await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);
    }
}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No step for this agent`);

    context = await updateStepStatus(context, step.stepId, "completed");
    if (!context.task) throw new Error("Invalid context task");
    const payload = getNextPendentStep(context.task) as mls.msg.AIPayload | null;
    context = await updateDefs(context, payload);
    notifyTaskChange(context);
    await executeNextStep(context);
}

const _replayForSupport = async (context: mls.msg.ExecutionContext, payload: mls.msg.AIPayload[]): Promise<void> => {
    const step = payload[0] as mls.msg.AIPayload;
    if (!step || step.type !== 'flexible') throw new Error('Invalid step for replay');
    if (!step.result || !step.result.meta) throw new Error('Invalid step result for replay');
    await updateDefs(context, step);
}

async function updateDefs(context: mls.msg.ExecutionContext, step: mls.msg.AIPayload | null): Promise<mls.msg.ExecutionContext> {
    if (!context || !context.task) throw new Error('Not found context to create files');
    if (step && step.type === 'result') throw new Error('Invalid result in update defs, "' + step.result + '"');
    if (!step || step.type !== 'flexible' || !step.result) throw new Error('Invalid step in update defs, type: "' + step?.type + '"');

    await forceServiceInstance(2, '_100554_serviceSource');

    const result = step.result as mls.l4.BaseDefs;
    if (!result.meta.projectId || !result.meta.shortName) throw new Error("Invalid step in update defs, incorrect meta: '" + result?.meta?.projectId + "', '" + result?.meta?.shortName + "'");

    if ('compileEmbedding' in result) delete result.compileEmbedding;

    const template = `/// <mls shortName="${result.meta.shortName}" project="${result.meta.projectId}" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = ${JSON.stringify(result, null, 2)}
    `;

    const keyDefsFile = mls.stor.getKeyToFiles(result.meta.projectId, 2, result.meta.shortName, result.meta.folder, '.defs.ts');
    const keyTsFile = mls.stor.getKeyToFiles(result.meta.projectId, 2, result.meta.shortName, result.meta.folder, '.ts');
    const storFileTs = mls.stor.files[keyTsFile];
    let storFileDefs = mls.stor.files[keyDefsFile];
    if (!storFileTs) throw new Error(`Invalid file .ts ${keyTsFile}`);
    if (!storFileDefs) {
        storFileDefs = await createStorFile(result.meta.projectId, result.meta.shortName, result.meta.folder || '', template, '.defs.ts');
        storFileDefs.updatedAt = new Date().toISOString();
    } else {
        let models = mls.editor.getModels(result.meta.projectId, result.meta.shortName);
        if (!models || !models.defs) {
            const position: string = 'left';
            const serviceSource: ServiceSource100554 = getState(`serviceSource.${position}.service`);
            if (!serviceSource) throw new Error('Not found service source instance');
            await serviceSource.createModels(storFileTs);
            models = mls.editor.getModels(result.meta.projectId, result.meta.shortName);
            if (!models || !models.defs) throw new Error('Erro, model error on AddModels, stoping');
            models.defs.model.setValue(template);
            storFileDefs.updatedAt = new Date().toISOString();
        }

    }
    
    context.task = await updateTaskTitle(context.task, "Def updated");
    context = await updateStepStatus(context, step.stepId, "completed");
    return context;
}

export async function getPrompts(info: any): Promise<mls.msg.IAMessageInputType[]> {

    if (!info || !info.project || !info.shortName) throw new Error(`Erro [${agentName}] getPrompts: invalid info`);

    const files = await mls.stor.getFiles({ project: info.project, shortName: info.shortName, folder: info.folder || '', loadContent: true });
    if (!files || !files.ts) throw new Error(`Erro [${agentName}] getPrompts: files not found`);
    const folder: string = files.ts.folder;

    const data = {
        ts: files.tsContent || '',
        html: files.htmlContent || '',
        less: files.lessContent || '',
        def: configFileDef(files.defsContent || ''),
        folder: folder,
    };

    const prompts = await getPromptByHtml({ project: 100554, shortName: agentName, folder: '', data })
    return prompts;
}

function configFileDef(content: string): string {

    function removeLine(source: string, startsWith: string) {
        return source
            .split('\n')
            .filter((line: string) => !line.trimStart().startsWith(startsWith))
            .join('\n');
    }
    content = removeLine(content, '"embedding":')
    content = removeLine(content, '"embeddingVersion":')

    return content;
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

async function createStorFile(project: number, shortName: string, folder: string, content: string, extension: string): Promise<mls.stor.IFileInfo> {
    const params = {
        project,
        level: 2,
        shortName,
        extension,
        versionRef: '0',
        folder
    };
    const file = await mls.stor.addOrUpdateFile(params);
    if (!file) throw new Error('Invalid storFile');
    file.status = 'new';
    const fileInfo: mls.stor.IFileInfoValue = {
        content,
        contentType: 'string',
    };
    await mls.stor.localStor.setContent(file, fileInfo);
    return file;
}
