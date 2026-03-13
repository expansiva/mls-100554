/// <mls fileReference="_100554_/l2/agentReview.ts" enhancement="_100554_/l2/enhancementAgent" />

import { IAgentAsync, IAgentMeta } from '/_100554_/l2/aiAgentBase.js';
import { getState, setState } from '/_100554_/l2/collabState.js';
import { ServiceSource100554 } from '/_100554_/l2/serviceSource.js';
import { getPath } from '/_102027_/l2/utils.js';

export function createAgent(): IAgentAsync {
    return {
        agentName: "agentReview",
        agentProject: 100554,
        agentFolder: "",
        agentDescription: "Responsible for reviewing the code.",
        avatar_url: svgReview,
        visibility: "public",
        beforePromptImplicit,
        beforePromptStep,
        afterPromptStep,
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
        .replace(`@@Review`, '')
        .replace(`@@_100554_/l2/agentReview`, '')

    data = mls.common.safeParseArgs(pp) as IDataPrompt;

    if (!('page' in data) || !('prompt' in data)) throw new Error(`[${agent.agentName}] beforePrompt: Invalid prompt structure missing page and prompt`);
    const mode = data.mode ? data.mode : 'all';

    const system = await prepareSystemPrompt(data, mode)

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
            longTermMemory: { 'page': `${data.page}`, 'position': data.position, "mode": mode },
        }
    };
    return [addMessageAI];

}

async function beforePromptStep(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    parentStep: mls.msg.AIAgentStep,
    step: mls.msg.AIAgentStep,
    hookSequential: number,
    args?: string
): Promise<mls.msg.AgentIntent[]> {

    if (!args) throw new Error(`(${agent.agentName})[beforePromptStep] args invalid`);
    let data: IDataPrompt | undefined;
    data = mls.common.safeParseArgs(args) as IDataPrompt;
    const mode = data.mode ? data.mode : 'all';
    const system = await prepareSystemPrompt(data, mode)

    const continueIntent: mls.msg.AgentIntentPromptReady = {
        type: "prompt_ready",
        args,
        messageId: context.message.orderAt,
        threadId: context.message.threadId,
        taskId: context.task?.PK || '',
        hookSequential,
        parentStepId: parentStep.stepId,
        humanPrompt: args || '',
        systemPrompt: system
    }

    return [continueIntent];
}

async function prepareSystemPrompt(data: IDataPrompt, mode: string): Promise<string> {

    let system: string = system1;
    system = await systemTypescript(data, system, data.mode === 'typescript' || mode === 'all');
    system = await systemHTML(data, system, data.mode === 'html' || mode === 'all');
    system = await systemLess(data, system, data.mode === 'less' || mode === 'all');
    return system;

}

async function systemTypescript(data: IDataPrompt, system: string, addTs: boolean): Promise<string> {
    if (!addTs) {
        system = system.replace("{{typescriptSource}}", '');
        return system;
    }
    const content = await getContentByExtension(data.page, 'ts');
    system = system.replace("{{typescriptSource}}", content);
    return system;
}

async function systemHTML(data: IDataPrompt, system: string, addHtml: boolean): Promise<string> {
    if (!addHtml) {
        system = system.replace("{{htmlSource}}", '');
        return system;
    }
    const content = await getContentByExtension(data.page, 'html');
    system = system.replace("{{htmlSource}}", content);
    return system;
}

async function systemLess(data: IDataPrompt, system: string, addLess: boolean): Promise<string> {
    if (!addLess) {
        system = system.replace("{{styleSource}}", '');
        return system;
    }
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

    // refreshStateLock(pageMemory, position, false);
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



const system1 = `
<!-- modelType: code -->
<!-- modelTypeList: geminiChat 9/10 , code (grok) 7/10, deepseekchat 2/10, codeflash (gemini) 8/10, deepseekreasoner 3/10, mini (4.1) or nano (openai) 4/10, codeinstruct (4.1) 4/10, codereasoning(gpt5) 3/10, code2 (kimi 2.5) -->

You are an agent specialized in performing technical and stylistic reviews of .ts, .html, and .less files, checking best practices, errors, inconsistencies, improvement opportunities, and security.
Your goal is to **insert review comments directly into the lines of code**, without altering or removing any line of the original code.

**Important instructions**:
1. Add annotations directly on the lines of code where the issue or suggestion occurs.
2. Use **inline comments**, always on the same line as the related code.
3. Never place comments at the end of the file or grouped together. They must be inserted where they apply.
4. Use the following pattern:
   - 'REVIEW: Error - <message>' for critical errors that affect functionality, security, or violate fundamental standards.
   - 'REVIEW: Warning - <message>' for bad practices, confusing code, or potential issues.
5. Avoid duplicate or vague annotations. Be specific and objective.
6. DO NOT alter the original code content.
7. DO NOT remove code sections, even if they are incorrect.
8. DO NOT rewrite functions, variables, or structures.
9. Return the result according to the ##OUTPUT FORMAT section.
10. For TypeScript and LESS files, use comments in the format:
    // REVIEW: Error - <message>
    // REVIEW: Warning - <message>
11. For HTML files, use comments in the format:
    <!-- REVIEW: Error - <message> -->
    <!-- REVIEW: Warning - <message> -->

## TYPESCRIPT
Keep in mind that you are reviewing TypeScript code that will run in a browser environment.

Review checklist:
- Explicit and appropriate typing
- Unnecessary use of "any"
- Pure and reusable functions
- Dead or unused code
- Good naming practices
- Excessive cyclomatic complexity
- Proper error handling
- Correct use of async/await and promises
- Separation of concerns
- Appropriate use of const, let, var

Example:

function process(data: any) {
  // REVIEW: Error - Use of 'any'. Replace with a more specific type.
  return data.value;
}

Review the following TypeScript code based on the checklist:
\`\`\`typescript
{{typescriptSource}}
\`\`\`

## HTML

Review checklist:
- Correct use of semantic tags (section, article, button, etc.)
- Accessibility (use of aria-*, alt attributes on images, contrast, focus)
- Proper hierarchical structure (headings, containers)
- Unnecessary or duplicated classes
- Visual organization and consistent indentation
- Dead or unused code

Example:
<section>
  <div><li>Text</li></div> <!-- REVIEW: Error - <li> outside of <ul>/<ol>/<menu> -->
</section>
<!-- REVIEW: Warning - Proper use of the <section> tag to structure content. -->

Review the following HTML code based on the checklist:
\`\`\`html
{{htmlSource}}
\`\`\`

## LESS

Review checklist:
- Proper use of variables and mixins
- Excessive nesting
- Overly specific or long selectors
- Duplicated or unused code
- Property organization (order, grouping)
- Separation of visual responsibilities (layout, style, color)

Example:
.button {
  color: blue;
  .nested {
    font-weight: bold; // REVIEW: Warning - Nesting deeper than two levels may hinder maintainability.
  }
}

Review the following LESS code based on the checklist:
\`\`\`less
{{styleSource}}
\`\`\`

## RULES
1. Return only the files that were reviewed. It may be one or more (.ts, .html, or .less).
2. Return the full content of the files, with review comments added.
3. *Do not remove or modify* the first line with triple-slash: /// mls

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


const svgReview = `<svg fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.3 6.74a.75.75 0 01-.04 1.06l-2.908 2.7 2.908 2.7a.75.75 0 11-1.02 1.1l-3.5-3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 011.06.04zm3.44 1.06a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.908-2.7-2.908-2.7z"/><path fill-rule="evenodd" d="M1.5 4.25c0-.966.784-1.75 1.75-1.75h17.5c.966 0 1.75.784 1.75 1.75v12.5a1.75 1.75 0 01-1.75 1.75h-9.69l-3.573 3.573A1.457 1.457 0 015 21.043V18.5H3.25a1.75 1.75 0 01-1.75-1.75V4.25zM3.25 4a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h2.5a.75.75 0 01.75.75v3.19l3.72-3.72a.75.75 0 01.53-.22h10a.25.25 0 00.25-.25V4.25a.25.25 0 00-.25-.25H3.25z"/></svg>`



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
