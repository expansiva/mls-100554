/// <mls fileReference="_100554_/l2/agentFix.ts" enhancement="_100554_enhancementAgent" />

import { IAgentAsync, IAgentMeta } from '/_100554_/l2/aiAgentBase.js';
import { getState, setState } from '/_100554_/l2/collabState.js';
import { ServiceSource100554 } from '/_100554_/l2/serviceSource.js';
import { getPath } from '/_102027_/l2/utils.js';

export function createAgent(): IAgentAsync {
    return {
        agentName: "agentFix",
        agentProject: 100554,
        agentFolder: "",
        avatar_url: svgFixBug,
        agentDescription: "Fix source file based on compile errors",
        visibility: "public",
        beforePromptImplicit,
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
        .replace(`@@Fix`, '')
        .replace(`@@_100554_/l2/agentFix`, '');

    data = mls.common.safeParseArgs(pp) as IDataPrompt;
    if (!('page' in data) || !('prompt' in data)) throw new Error(`[${agent.agentName}] beforePrompt: Invalid prompt structure missing page and prompt`);
    data = consistDataParams(data, agent.agentName);

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
            longTermMemory: { 'page': `${data.page}`, 'position': data.position, "mode": data.mode },
        }
    };
    return [addMessageAI];

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
        const result = payload.result;
        await updateFiles(context, result);
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

    const modeMemory = context.task?.iaCompressed?.longMemory['mode'];
    const pageMemory = context.task?.iaCompressed?.longMemory['page'];
    const positionMemory = context.task?.iaCompressed?.longMemory['position'];
    if (!pageMemory) throw new Error(`[updateFile]: invalid pageMemory`);

    const info = getPath(pageMemory);
    const mode = modeMemory;
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


function consistDataParams(data: IDataPrompt, agentName: string): IDataPrompt {

    if (!('page' in data) || !data.page) throw new Error(`[${agentName}] getPrompts: No 'page' in data prompt.`);
    if (!('position' in data) || !data.position) throw new Error(`[${agentName}] getPrompts: No 'position' in data prompt.`);
    if (!['left', 'right'].includes(data.position)) throw new Error(`[${agentName}] getPrompts: Invalid 'position' in data prompt: ${data.position}`);
    if (!('mode' in data) || !data.mode) data.mode = 'typescript';
    if (!['typescript', 'html', 'less'].includes(data.mode)) throw new Error(`[${agentName}] getPrompts: Invalid 'mode' in data prompt: ${data.mode}`);
    return data;
}

async function prepareSystemPrompt(data: IDataPrompt): Promise<string> {

    let system: string = system1;
    system = await systemTypescript(data, system, data.mode === 'typescript');
    system = await systemHTML(data, system, data.mode === 'html');
    system = await systemLess(data, system, data.mode === 'less');
    system = await systemDefs(data, system);
    return system;

}

async function systemTypescript(data: IDataPrompt, system: string, isTs: boolean): Promise<string> {

    if (!isTs) {
        system = system.replace("{{typescriptSource}}", '');
        system = system.replace("{{typescriptImportsDefinition}}", '');
        system = system.replace("{{typescriptCompileErrors}}", '');
        system = system.replace("{{typescriptMonacoErrors}}", '');
        system = system.replace("{{typescriptMonacoWarnings}}", '');
        return system;
    }

    const content = await getContentByExtension(data.page, 'ts');
    const modelTs = await getModelByExtension(data.page, 'ts') as mls.editor.IModelTS;
    const imports = modelTs.compilerResults?.imports || [];
    const defs = await getDefinitonsByImports(imports);
    const str = defs.map((def) => ` **importName: ${def.importName}**\n${def.definition}`)
    const markersTs = modelTs ? monaco.editor.getModelMarkers({ resource: modelTs.model.uri }) : [];
    const errors = modelTs.compilerResults?.errors || [];
    const errorsMonaco = markersTs.filter(marker => marker.severity === monaco.MarkerSeverity.Error);
    const warningsMonaco = markersTs.filter(marker => marker.severity === monaco.MarkerSeverity.Warning);

    system = system.replace("{{typescriptSource}}", content);
    system = system.replace("{{typescriptImportsDefinition}}", str.join('\n'));
    system = system.replace("{{typescriptCompileErrors}}", JSON.stringify(errors));
    system = system.replace("{{typescriptMonacoErrors}}", JSON.stringify(errorsMonaco));
    system = system.replace("{{typescriptMonacoWarnings}}", JSON.stringify(warningsMonaco));
    return system;


}

async function systemHTML(data: IDataPrompt, system: string, isHtml: boolean): Promise<string> {
    if (!isHtml) {
        system = system.replace("{{htmlSource}}", '');
        return system;
    }
    const content = await getContentByExtension(data.page, 'html');
    system = system.replace("{{htmlSource}}", content);
    return system;
}

async function systemLess(data: IDataPrompt, system: string, isStyle: boolean): Promise<string> {

    if (!isStyle) {
        system = system.replace("{{lessSource}}", '');
        system = system.replace("{{lessCompileErrors}}", '');
        system = system.replace("{{lessMonacoErrors}}", '');
        system = system.replace("{{lessMonacoWarnings}}", '');
        return system;
    }

    const content = await getContentByExtension(data.page, 'less');
    const modelStyle = await getModelByExtension(data.page, 'less') as mls.editor.IModelStyle;

    const markersStyle = modelStyle ? monaco.editor.getModelMarkers({ resource: modelStyle.model.uri }) : [];
    await mls.l2.less.compileStyle(modelStyle);
    const errors = modelStyle.styleResults?.errors || [];
    const errorsMonaco = markersStyle.filter(marker => marker.severity === monaco.MarkerSeverity.Error);
    const warningsMonaco = markersStyle.filter(marker => marker.severity === monaco.MarkerSeverity.Warning);

    system = system.replace("{{lessSource}}", content);
    system = system.replace("{{lessCompileErrors}}", JSON.stringify(errors));
    system = system.replace("{{lessMonacoErrors}}", JSON.stringify(errorsMonaco));
    system = system.replace("{{lessMonacoWarnings}}", JSON.stringify(warningsMonaco));
    return system;

}

async function systemDefs(data: IDataPrompt, system: string): Promise<string> {
    const content = await getContentByExtension(data.page, 'defs');
    system = system.replace("{{defsSource}}", content);
    return system;
}

async function getContentByExtension(fullName: string, ext: 'html' | 'ts' | 'less' | 'defs') {
    const info = getPath(fullName);
    if (!info) throw new Error('[getContentByExtension] not found path:' + fullName);
    const storFileKey = mls.stor.getKeyToFile({ ...info, extension: `.${ext}`, level: 2 });
    const storFile = mls.stor.files[storFileKey];
    if (!storFile) return '';
    const models = await storFile.getOrCreateModel();
    return models.model.getValue();
}

async function getModelByExtension(fullName: string, ext: 'html' | 'ts' | 'less' | 'defs') {
    const info = getPath(fullName);
    if (!info) throw new Error('[getModelByExtension] not found path:' + fullName);
    const storFileKey = mls.stor.getKeyToFile({ ...info, extension: `.${ext}`, level: 2 });
    const storFile = mls.stor.files[storFileKey];
    if (!storFile) return '';
    const models = await storFile.getOrCreateModel();
    return models
}

async function getDefinitonsByImports(imports: string[]) {

    const definitionsData: { importName: string, definition: string }[] = [];
    for await (let importName of imports) {
        if (!importName.startsWith('./')) continue;
        const fullPath = importName.replace('./', '');
        const iPath = getPath(fullPath);
        if (!iPath) throw new Error('[getDefinitonsByImports] not found path:' + fullPath);
        const keyToStorFile = mls.stor.getKeyToFiles(iPath.project, 2, iPath.shortName, iPath.folder, '.ts');
        const storFile = mls.stor.files[keyToStorFile];
        if (!storFile) continue;
        const modelTs = await storFile.getOrCreateModel() as mls.editor.IModelTS;
        if (!modelTs) continue;
        await mls.l2.typescript.compileAndPostProcess(modelTs, false, false);
        const definition = modelTs.compilerResults?.prodDTS || '';
        if (definition) {
            definitionsData.push({
                definition,
                importName
            })
        }

    }

    return definitionsData;

}

function refreshStateLock(page: string, position: string, value: boolean) {
    const lockMap: Map<string, boolean> = getState(`serviceSource.${position}.lockMap`);
    const newMap = new Map(lockMap);
    newMap.set(page, value);
    setState(`serviceSource.${position}.lockMap`, newMap);
}



const system1 = `
<!-- modelType: codeflash -->
<!-- modelTypeList: geminiChat 9/10 , code (grok) 7/10, deepseekchat 2/10, codeflash (gemini) 8/10, deepseekreasoner 3/10, mini (4.1) or nano (openai) 4/10, codeinstruct (4.1) 4/10, codereasoning(gpt5) 3/10, code2 (kimi 2.5) -->

You are an agent specialized in fixing errors in web components developed with the Lit framework.  
You will receive a TypeScript, HTML, or LESS file, along with a JSON definition (style metadata with general information):

- A '.ts' file containing the component logic  
- A '.html' file where the component is being used  
- A '.less' file with the styles  

The source file will be provided together with a summary of the errors found in the file. Your task is to:

1. Review the errors and identify which changes need to be made  
2. Apply only the necessary changes  
3. Return only the files that you modified  

Rules that must be respected when updating the files:

1. Do not remove or rename attributes unless explicitly requested by the user  
2. Do not add new tokens in the LESS file  
3. *Do not remove* the first line with the triple-slash, e.g.:  
   /// <mls fileReference="_100554_/l2/agentFix.ts" enhancement="_blank" />
4. Do not change the values of the triple-slash items (fileReference, enhancement)

The .ts and .less files are controlled by the first line being a triple-slash. This line is mandatory and must not be removed.
- Valid attributes are: fileReference, enhancement  
- Fix attribute names if necessary  
- Do not add new attributes  
- Do not change attribute values  
- Attribute values must always be wrapped in double quotes "", e.g.:  
  /// <mls fileReference="xxx" enhancement="yyy" />

## Known Errors
Below are known errors and how to solve them:

1. Typing error in Lit's *repeat*:  
   "is not assignable to parameter of type 'RepeatFunction'."

   *Typing error example:*
   \${repeat(
        this.history,
        item => item.shortName,
        file, index => this.render(file, index, true)
   )}

   *Error fix:*  
   The repeat function expects 3 parameters  
   (array: unknown[], func?: RepeatFunction | undefined, func2?: RepeatFunction | undefined).  
   To fix the typing error, you must explicitly type func and func2, as shown below:

   - func1: type as: as () => string  
   - func2: type as: as () => TemplateResult<1>  

   \${repeat(
        this.history,
        ((item: mls.stor.IFileInfo) => item.shortName as () => string),
        ((file: mls.stor.IFileInfo, index: any) =>
            this.renderLiItem(file, index, true)
        ) as () => TemplateResult<1>
   )}

2. LESS token name errors:  
   Example:  
   margin: @space-4   => NameError: variable @space-4 is undefined  

   In this case, analyze and use an existing token or avoid using tokens in this situation.

## FILE TYPESCRIPT
### Source
{{typescriptSource}}

### Imports Definitions
{{typescriptImportsDefinition}}

### Compilation Errors
{{typescriptCompileErrors}}

### Monaco Errors
{{typescriptMonacoErrors}}

### Monaco Warnings
{{typescriptMonacoWarnings}}

----------

## FILE HTML
### Source
{{HtmlSource}}

----------

## FILE LESS
### Source
{{LessSource}}

### LESS Compilation Errors
{{lessCompileErrors}}

### LESS Monaco Errors
{{lessMonacoErrors}}

### LESS Monaco Warnings
{{lessMonacoWarnings}}

## FILE DEFINITIONS JSON
{{defsSource}}

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

interface IDataPrompt {
    page: string,
    prompt: string,
    position: 'left' | 'right',
    mode: 'typescript' | 'html' | 'less'
}


const svgFixBug = `<svg fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 viewBox="0 0 512.602 512.602" xml:space="preserve">
<g>
	<g>
		<g>
			<path d="M501.9,356.616l0.28-0.151L283.582,136.702l-0.324-103.41L177.54,4.969l-11.282,11.303l56.257,56.106l-54.79,54.919
				l-56.257-56.149l-11.26,11.174l28.344,105.654l100.563,0.388l-0.669,0.539l220.065,221.144l0.28-0.259
				c14.733,14.323,38.267,14.323,52.719-0.28C516.201,395.012,516.266,371.435,501.9,356.616z M487.663,395.551
				c-6.536,6.558-17.106,6.558-23.555,0c-6.514-6.493-6.558-16.976-0.043-23.512c6.493-6.536,17.084-6.536,23.62-0.043
				C494.134,378.489,494.22,389.037,487.663,395.551z"/>
			<path d="M47.101,232.67c1.79,0.345,43.638,8.693,52.633,55.911c-11.368,12.058-18.465,28.905-18.465,47.607
				c0,0.216,0.043,0.367,0.043,0.475h119.286c0-0.173,0-0.324,0-0.475c0-18.702-7.097-35.549-18.443-47.607
				c8.995-47.197,50.821-55.566,52.59-55.911c3.904-0.755,6.558-4.487,5.846-8.434c-0.712-3.904-4.465-6.536-8.413-5.846
				c-0.496,0.108-48.75,9.426-62.534,59.988c-8.52-5.134-18.314-8.089-28.732-8.089c-10.376,0-20.169,2.977-28.711,8.132
				c-13.827-50.605-62.016-59.88-62.555-59.988c-3.904-0.69-7.636,1.941-8.348,5.846C40.522,228.184,43.175,231.915,47.101,232.67z"
				/>
			<path d="M275.083,290.696c-5.069-1.596-10.462,1.273-12.08,6.363c0,0-11.799,38.051-14.301,46.226
				c-5.112,1.381-20.751,5.803-31.536,8.779c-0.41-1.726-0.712-3.43-1.122-5.112H65.781c-0.367,1.683-0.712,3.387-1.079,5.112
				c-10.785-3.041-26.446-7.399-31.536-8.779c-2.545-8.175-14.323-46.248-14.323-46.248c-1.553-5.069-6.967-7.96-12.036-6.363
				c-5.112,1.532-7.96,6.924-6.363,12.036l17.408,56.257l44.069,12.274c-0.28,4.055-0.539,8.175-0.539,12.382
				c0,5.134,0.324,10.246,0.777,15.229L18.11,418.567L4.348,496.309c-0.906,5.22,2.588,10.268,7.852,11.174
				c5.22,0.928,10.246-2.524,11.152-7.787c0,0,10.462-58.91,11.972-67.711c4.249-1.92,18.184-8.175,30.091-13.417
				c10.419,44.479,40.316,76.663,75.562,76.663c35.225,0,65.165-32.14,75.606-76.663c11.842,5.242,25.799,11.497,30.048,13.417
				c1.488,8.736,11.95,67.711,11.95,67.711c0.928,5.263,5.932,8.715,11.217,7.787c5.263-0.906,8.693-5.889,7.809-11.174
				l-13.784-77.741l-44.004-19.651c0.453-4.983,0.755-10.095,0.755-15.207c0-4.206-0.259-8.348-0.539-12.425l44.048-12.252
				l17.429-56.278C283.021,297.642,280.152,292.249,275.083,290.696z"/>
		</g>
</g>
</svg>`
