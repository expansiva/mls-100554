/// <mls fileReference="_100554_/l2/agentImprove.ts" enhancement="_102027_/l2/enhancementAgent" />

import { IAgentAsync, IAgentMeta } from '/_102027_/l2/aiAgentBase.js';
import { getState, setState } from '/_102027_/l2/collabState.js';
import { ServiceSource100554 } from '/_100554_/l2/serviceSource.js';
import { getPath } from '/_102027_/l2/utils.js';

export function createAgent(): IAgentAsync {
    return {
        agentName: "agentImprove",
        agentProject: 100554,
        agentFolder: "",
        agentDescription: "Responsible for improve the code.",
        avatar_url: svgImprove,
        visibility: "public",
        beforePromptImplicit,
        afterPromptStep,
        scope: ['l2_preview', 'collabMessages']
    };
}

async function beforePromptImplicit(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    userPrompt: string,
): Promise<mls.msg.AgentIntent[]> {

    if (!userPrompt || userPrompt.length < 5) throw new Error('invalid prompt');
    let data: IDataPrompt | undefined;

    let pp = context.message.content
        .replace(`@@ ${agent.agentName}`, '')
        .replace(`@@${agent.agentName}`, '').trim()
        .replace(`@@Improve`, '')
        .replace(`@@_100554_/l2/agentImprove`, '')

    data = mls.common.safeParseArgs(pp) as IDataPrompt;

    if (!('page' in data) || !('prompt' in data)) throw new Error(`[${agent.agentName}] beforePrompt: Invalid prompt structure missing page and prompt`);

    const system = await prepareSystemPrompt(data)

    const addMessageAI: mls.msg.AgentIntentAddMessageAI = {
        type: "add-message-ai",
        request: {
            action: 'addMessageAI',
            agentName: agent.agentName,
            inputAI: [{
                type: "system",
                content: system,
            }, {
                type: "human",
                content: data.prompt
            }],
            taskTitle: `New module`,
            threadId: context.message.threadId,
            userMessage: context.message.content,
            longTermMemory: { 'page': `${data.page}`, 'position': data.position },
        }
    };
    return [addMessageAI];

}

async function prepareSystemPrompt(data: IDataPrompt): Promise<string> {

    let system: string = system1;
    system = await systemTypescript(data, system);
    system = await systemHTML(data, system);
    system = await systemLess(data, system);
    return system;

}

async function systemTypescript(data: IDataPrompt, system: string): Promise<string> {
    const content = await getContentByExtension(data.page, 'ts');
    system = system.replace("{{typescriptSource}}", content);
    return system;
}

async function systemHTML(data: IDataPrompt, system: string): Promise<string> {
    const content = await getContentByExtension(data.page, 'html');
    system = system.replace("{{htmlSource}}", content);
    return system;
}

async function systemLess(data: IDataPrompt, system: string): Promise<string> {
    const content = await getContentByExtension(data.page, 'less');
    system = system.replace("{{styleSource}}", content);
    return system;
}

async function afterPromptStep(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    parentStep: mls.msg.AIAgentStep,
    step: mls.msg.AIAgentStep,
    hookSequential: number,
): Promise<mls.msg.AgentIntent[]> {
    if (!agent || !context || !step) throw new Error(`[afterPromptStep] invalid params, agent:${!!agent}, context:${!!context}, step:${!!step}`);

    const payload = (step.interaction?.payload?.[0]) as Output1 || undefined;
    if (payload?.type !== "flexible") {
        throw new Error(`Payload type invalid: ${payload?.type} must be flexible`);
    }
    if (payload?.type !== 'flexible' || !payload.result) throw new Error(`[afterPromptStep] invalid payload: ${payload}`)

    let status: mls.msg.AIStepStatus = 'completed';

    try {
        if (!context.isTest) {
            const result = payload.result;
            await updateFiles(context, result);
        } else {
            console.info(payload.result)
        }

    } catch (e) {
        console.error(e);
        status = 'failed';
    }

    const updateStatus: mls.msg.AgentIntentUpdateStatus = {
        type: 'update-status',
        hookSequential,
        messageId: context.message.orderAt,
        threadId: context.message.threadId,
        taskId: context.task?.PK || '',
        parentStepId: parentStep.stepId,
        stepId: step.stepId,
        status
    };
    return [updateStatus];

}

export async function updateFiles(context: mls.msg.ExecutionContext, result: IDataResult): Promise<void> {

    const pageMemory = context.task?.iaCompressed?.longMemory['page'];
    const positionMemory = context.task?.iaCompressed?.longMemory['position'];
    if (!pageMemory) throw new Error(`[updateFile]: invalid pageMemory`);

    const contentHTML = result.html ? result.html : undefined;
    const contentTS = result.ts ? result.ts : undefined;
    const contentLess = result.less ? result.less : undefined;
    const position = positionMemory || 'left';
    const serviceSource: ServiceSource100554 = getState(`serviceSource.${position}.service`);
    if (!serviceSource) throw new Error('Not found service source instance');

    if (contentTS) {
        const modelTs = await getModelByExtension(pageMemory, 'ts') as mls.editor.IModelTS;
        serviceSource.setValueInModeKeepingUndo(modelTs.model, contentTS, false);
        (modelTs.model as any).needFormat = true;

    }

    if (contentHTML) {
        const modelHtml = await getModelByExtension(pageMemory, 'html') as mls.editor.IModelHTML;
        serviceSource.setValueInModeKeepingUndo(modelHtml.model, contentHTML, false);
        (modelHtml.model as any).needFormat = true;
    }

    if (contentLess) {
        const modelLess = await getModelByExtension(pageMemory, 'less') as mls.editor.IModelStyle;
        serviceSource.setValueInModeKeepingUndo(modelLess.model, contentLess, false);
        (modelLess.model as any).needFormat = true;
    }

    refreshStateLock(pageMemory, position, false);
    serviceSource.formatMonaco();

}

async function getContentByExtension(fullName: string, ext: 'html' | 'ts' | 'less' | 'defs') {
    const info = getPath(fullName);
    if (!info) throw new Error('[getContentByExtension] Not found path:' + fullName);
    const storFileKey = mls.stor.getKeyToFile({ ...info, extension: `.${ext}`, level: 2 });
    const storFile = mls.stor.files[storFileKey];
    if (!storFile) return '';
    const models = await storFile.getOrCreateModel();
    return models.model.getValue();
}

async function getModelByExtension(fullName: string, ext: 'html' | 'ts' | 'less' | 'defs') {
    const info = getPath(fullName);
    if (!info) throw new Error('[getModelByExtension] Not found path:' + fullName);
    const storFileKey = mls.stor.getKeyToFile({ ...info, extension: `.${ext}`, level: 2 });
    const storFile = mls.stor.files[storFileKey];
    if (!storFile) return '';
    const models = await storFile.getOrCreateModel();
    return models
}

function refreshStateLock(page: string, position: string, value: boolean) {
    const lockMap: Map<string, boolean> = getState(`serviceSource.${position}.lockMap`);
    const newMap = new Map(lockMap);
    newMap.set(page, value);
    setState(`serviceSource.${position}.lockMap`, newMap);
}


const system1 = `
<!-- modelType: code -->
<!-- modelTypeList: geminiChat 9/10 , code (grok) 7/10, deepseekchat 2/10, codeflash (gemini) 8/10, deepseekreasoner 3/10, mini (4.1) or nano (openai) 4/10, codeinstruct (4.1) 4/10, codereasoning(gpt5) 3/10, code2 (kimi 2.5) -->

You are an agent specialized in adding new features to a component.
You will receive a TypeScript, HTML, and LESS file.
- A '.ts' file with the component logic
- A '.html' file with the HTML where the component is being used
- A '.less' file with the styles

## TYPESCRIPT DEFINITION
{{typescriptSource}}

## HTML DEFINITION
{{htmlSource}}

## LESS DEFINITION
{{styleSource}}

## STEP BY STEP
1. Analyze the improvement request.
2. Define which files will be changed.
3. Apply the necessary changes.
4. Add comments in English only in the TypeScript file and only for the new implementations.

## RULES
1. Return only the files that were changed. It can be one or more (.ts, .html, or .less).
2. Return the full content of the files, including the changes.
3. Do not add new tokens in the LESS file.
4. *Do not remove or modify* the first line with triple-slash: /// mls

## Output format
Return only valid JSON in the following structure:

[[OutputSection1]]

`;

//#region OutputSection1
export type Output1 =
    {
        type: "flexible";
        result: IDataResult
    }

interface IDataResult {
    html: string,
    ts: string,
    less: string,
}
//#endregion


const svgImprove = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M420.9 448C428.2 425.7 442.8 405.5 459.3 388.1C492 353.7 512 307.2 512 256C512 150 426 64 320 64C214 64 128 150 128 256C128 307.2 148 353.7 180.7 388.1C197.2 405.5 211.9 425.7 219.1 448L420.8 448zM416 496L224 496L224 512C224 556.2 259.8 592 304 592L336 592C380.2 592 416 556.2 416 512L416 496zM312 176C272.2 176 240 208.2 240 248C240 261.3 229.3 272 216 272C202.7 272 192 261.3 192 248C192 181.7 245.7 128 312 128C325.3 128 336 138.7 336 152C336 165.3 325.3 176 312 176z"/></svg>`



interface IDataPrompt {
    page: string,
    prompt: string,
    mode?: 'typescript' | 'html' | 'less'
    position: 'left' | 'right',
}

interface IDataResult {
    html: string,
    ts: string,
    less: string
}