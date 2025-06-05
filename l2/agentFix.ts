/// <mls shortName="agentFix" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { preferModelType } from './_100554_aiPrompts';
import { getNextPendingStepByAgentName, getNextInProgressStepByAgentName, updateStepStatus, getNextPendentStep, updateTaskTitle } from "./_100554_aiAgentHelper";
import { startNewInteractionInAiTask, startNewAiTask, executeNextStep } from "./_100554_aiAgentOrchestration";
import { forceServiceInstance } from './_100554_libCommom';
import { globalState, getState } from './_100554_collabState';
import { ServiceSource100554 } from './_100554_serviceSource';

const agentName = "agentFix";

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Responsavel por corrigir erros",
        visibility: "public",
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        },
    }
};

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {

    const taskTitle = "Planning";

    if (!context || !context.message) throw new Error("Invalid context");
    if (!context.task) {
        let pp = context.message.content.replace(`@@ ${agentName}`, '').replace(`@@${agentName}`, '').trim();

        const inputs = await getPrompts(JSON.parse(pp));
        await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt);

        return;
    }

    const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
    context.task = await updateStepStatus(context.task, step.stepId, "in_progress");

    if (!step.prompt) throw new Error(`[${agentName}] beforePrompt: No prompt found in step for this agent.`);
    const data: IDataPrompt = JSON.parse(step.prompt);
    if (!('page' in data) || !('prompt' in data)) throw new Error(`[${agentName}] beforePrompt: Invalid prompt structure missing page and prompt`);

    const inputs = await getPrompts(data);
    await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);

}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {

    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No pending interaction found.`);
    context.task = await updateStepStatus(context.task, step.stepId, "completed");
    await updateFile(context);
    context.task = await updateTaskTitle(context.task, "Widget fixed");
    await executeNextStep(context);

}

async function getPrompts(data: IDataPrompt): Promise<mls.msg.IAMessageInputType[]> {

    if (!('page' in data) || !data.page) throw new Error(`[${agentName}] getPrompts: No 'page' in data prompt.`);
    if (!('position' in data) || !data.position) throw new Error(`[${agentName}] getPrompts: No 'position' in data prompt.`);
    if (!['left', 'right'].includes(data.position)) throw new Error(`[${agentName}] getPrompts: Invalid 'position' in data prompt: ${data.position}`);
    if (!('mode' in data) || !data.mode) throw new Error(`[${agentName}] getPrompts: No 'mode' in data prompt.`);
    if (!['typescript', 'html', 'less'].includes(data.mode)) throw new Error(`[${agentName}] getPrompts: Invalid 'mode' in data prompt: ${data.mode}`);

    const prompts: mls.msg.IAMessageInputType[] = [];
    prompts.push(systemMainInstruction());
    prompts.push(systemTaskInstruction());
    prompts.push(systemRulesInstruction());
    prompts.push(systemKnownErrors());

    if (data.mode === 'typescript') {
        prompts.push(await systemDefinitionTypescript(data));
        prompts.push(await systemDefinitionErrorsTs(data));
    }

    if (data.mode === 'html') {
        prompts.push(await systemDefinitionHTML(data));
    }

    if (data.mode === 'less') {
        prompts.push(await systemDefinitionLess(data));
        prompts.push(await systemDefinitionErrorsLess(data));
    }

    prompts.push(systemOutInstruction());
    prompts.push(systemUserInstruction(data));
    return prompts;
}


function systemMainInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `${preferModelType("code")}
Você é um agente especializado em corrigir erros de componentes web desenvolvidos com o framework Lit. Você receberá um arquivo typescript ou html ou less:
- Arquivo '.ts' com a lógica do componente
- Arquivo '.html' com a pagina em que o componente esta sendo usado.
- Arquivo '.less' com os estilos
`
    }
}

function systemTaskInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `##Task

O arquivo do source seria fornecido, juntamente com um resumo dos erros encontrados no arquivo. Sua tarefa é:

1. Ver os erros e identificar quais alterações precisam ser realizadas
2. Executar apenas as alterações necessárias
3. Retornar somente os arquivos que você modificou
`
    }
}

function systemRulesInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `##Rules
Regras que devem ser respeitadas na atualização dos arquivos.

1. Não se deve remover ou renomear atributos sem a solicitação do usuario
2. Não se deve adicionar novos tokens no less
3. *Não remover e não alterar*, a primeira linha com tripleslash : /// <mls ... />
`
    }
}

function systemKnownErrors(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `##Erros conhecidos
Segue erros conhecidos e como solucionar:

1. Erro na tipagem do *repeat* no lit: is not assignable to parameter of type 'RepeatFunction'.
    *Erro de tipagem:*
        \${repeat(
                this.history,
                item => item.shortName,
                file, index => this.render(file, index, true)
        )}
    *Correção do erro:* => A função repeat espera 3 parametros( array: unknown[], func?: RepeatFunction | undefined, func2?: RepeatFunction | undefined), para corrigir o erro de tipagem, é necessario tipar func e func2, conforme exemplo abaixo:

        func1: tipar como: as ()=> string
        func2: tipar como: as ()=> TemplateResult<1

        \${repeat(
            this.history,
            ((item: mls.stor.IFileInfo) => item.shortName as ()=> string ),
            ((file: mls.stor.IFileInfo, index: any) => this.renderLiItem(file, index, true)) as ()=> TemplateResult<1>)
        }

2. Erros de nomes de tokens Less: 
ex margin: @space-4   =>  NameError: variable @space-4 is undefined
Nesse caso analisar e utilizar um token existente ou não usar os tokens nessa situação
`
    }
}

async function systemDefinitionTypescript(data: IDataPrompt): Promise<mls.msg.IAMessageInputType> {

    try {
        const content = await getContentByExtension(data.page, 'ts');
        if (!content) throw new Error(`[${agentName}][systemDefinitionTypescript]: not found content:` + data.page);
        return {
            type: 'system',
            content: `## DEFINIÇÕES DO TYPESCRIPT \n\n ${content}`
        }
    } catch (e: any) {
        throw new Error(`[${agentName}][systemDefinitionTypescript]: ${e.message}`);
    }

}
async function systemDefinitionHTML(data: IDataPrompt): Promise<mls.msg.IAMessageInputType> {

    try {
        const content = await getContentByExtension(data.page, 'html');
        if (!content) throw new Error(`[${agentName}][systemDefinitionHTML]: not found content:` + data.page);
        return {
            type: 'system',
            content: `## DEFINIÇÕES DO HTML \n\n ${content}`
        }
    } catch (e: any) {
        throw new Error(`[${agentName}][systemDefinitionHTML]: ${e.message}`);
    }

}

async function systemDefinitionLess(data: IDataPrompt): Promise<mls.msg.IAMessageInputType> {

    try {
        const content = await getContentByExtension(data.page, 'style');
        if (!content) throw new Error(`[${agentName}][systemDefinitionLess]: not found content:` + data.page);
        return {
            type: 'system',
            content: `## DEFINIÇÕES DO LESS \n\n ${content}`
        }
    } catch (e: any) {
        throw new Error(`[${agentName}][systemDefinitionLess]: ${e.message}`);
    }

}

async function systemDefinitionErrorsTs(data: IDataPrompt): Promise<mls.msg.IAMessageInputType> {

    try {
        const models = mls.editor.models[data.page];
        if (!models || !models.ts) throw new Error(`[${agentName}][systemDefinitionErrorsTs]: not found models for file:` + data.page);
        const markersTs = models.ts ? monaco.editor.getModelMarkers({ resource: models.ts.model.uri }) : [];
        const errors = models.ts.compilerResults?.errors || [];
        const errorsMonaco = markersTs.filter(marker => marker.severity === monaco.MarkerSeverity.Error);
        const warningsMonaco = markersTs.filter(marker => marker.severity === monaco.MarkerSeverity.Warning);

        return {
            type: 'system',
            content: `
## DEFINIÇÕES DE ERROS DE COMPILAÇÃO TYPESCRIPT \n\n ${JSON.stringify(errors)} \n\n
## DEFINIÇÕES DE ERROS DO MONACO TYPESCRIPT  \n\n ${JSON.stringify(errorsMonaco)} \n\n 
## DEFINIÇÕES DE WARNINGS DO MONACO TYPESCRIPT  \n\n ${JSON.stringify(warningsMonaco)} \n\n 
`
        }
    } catch (e: any) {
        throw new Error(`[${agentName}][systemDefinitionErrorsTs]: ${e.message}`);
    }

}

async function systemDefinitionErrorsLess(data: IDataPrompt): Promise<mls.msg.IAMessageInputType> {

    try {
        const models = mls.editor.models[data.page];
        if (!models || !models.style) throw new Error(`[${agentName}][systemDefinitionErrorsLess]: not found models for file:` + data.page);
        const markersStyle = models.style ? monaco.editor.getModelMarkers({ resource: models.style.model.uri }) : [];

        await mls.l2.less.compileStyle(models.style);

        const errors = models.style.styleResults?.errors || [];
        const errorsMonaco = markersStyle.filter(marker => marker.severity === monaco.MarkerSeverity.Error);
        const warningsMonaco = markersStyle.filter(marker => marker.severity === monaco.MarkerSeverity.Warning);

        return {
            type: 'system',
            content: `
## DEFINIÇÕES DE ERROS DE COMPILAÇÃO LESS \n\n ${JSON.stringify(errors)} \n\n
## DEFINIÇÕES DE ERROS DO MONACO LESS  \n\n ${JSON.stringify(errorsMonaco)} \n\n 
## DEFINIÇÕES DE WARNINGS DO MONACO LESS  \n\n ${JSON.stringify(warningsMonaco)} \n\n 
`
        }
    } catch (e: any) {
        throw new Error(`[${agentName}][systemDefinitionErrorsLess]: ${e.message}`);
    }

}

function systemOutInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## Formato de saida
Você deve retornar um array de objetos no formato JSON. Cada objeto representa uma subtarefa, com **apenas um dos seguintes formatos**:
\`\`\` json
[{{
    "type": "flexible",
    "result": { 
        html: string, 
        ts: string, 
        less: string, 
        page:string, // retornar o mesmo nome de page recebido *obrigatório*,
        position: 'left' | 'right'  // retornar o mesmo position recebido *obrigatório*,
        mode: 'typescript' | 'html' | 'less' // retornar o mesmo mode recebido *obrigatório*,

    }
  },
  {
    "type": "result",
    "result": string
  }}]
\`\`\`
`
    }
}

function systemUserInstruction(data: IDataPrompt): mls.msg.IAMessageInputType {
    return {
        type: 'human',
        content: `##Solicitação do usuário

${JSON.stringify(data)}
`
    }
}

async function getContentByExtension(fullName: string, ext: 'html' | 'ts' | 'style') {
    try {
        const models = mls.editor.models[fullName];
        if (!models) throw new Error(`[${agentName}][getContentByExtension]:Not found models for file:` + fullName);
        if (!models[ext]) return '';
        return models[ext]?.model.getValue();
    } catch (e: any) {
        throw new Error(`[${agentName}][getContentByExtension]: ${e.message}`);
    }
}

function getInfoPage(fullName: string): { project: number, shortName: string } {
    let pr = fullName.substring(1).split("_")[0];
    let prID: number = Number(pr);
    if (isNaN(prID)) prID = 0; // error
    const shortName = fullName.substring(pr.length + 2);
    return { project: prID, shortName }
}

function getModel(info: { project: number, shortName: string }): mls.editor.IModels | undefined {
    const key = mls.editor.getKeyModel(info.project, info.shortName);
    return mls.editor.models[key];
}

async function updateFile(context: mls.msg.ExecutionContext) {

    if (!context || !context.task) throw new Error('Not found context to updateFile');
    const step = getNextPendentStep(context.task);

    if (!step || step.type !== 'flexible') throw new Error('Invalid step in updateFile');
    const result: IDataResult = step.result;

    if (!result || !result.page) throw new Error('Not found "page" in updateFile files');
    if (!result || !result.mode) throw new Error('Not found "mode" in updateFile files');

    await forceServiceInstance(2, '_100554_serviceSource');

    const info = getInfoPage(result.page);
    const mode = result.mode;
    const contentHTML = result.html ? result.html : undefined;
    const contentTS = result.ts ? result.ts : undefined;
    const contentLess = result.less ? result.less : undefined;
    const position = result.position || 'left';
    const serviceSource: ServiceSource100554 = globalState._ica?.serviceSource[position]?.service;
    if (!serviceSource) throw new Error('Not found service source instance');

    const models = getModel(info);
    if (!models) throw new Error('Not found model:' + agentName)

    if (contentHTML && models.html && mode === 'html') {
        serviceSource.setValueInModeKeepingUndo(models.html.model, contentHTML, false);
        (models.html.model as any).needFormat = true;
    }

    if (contentTS && models.ts && mode === 'typescript') {
        serviceSource.setValueInModeKeepingUndo(models.ts.model, contentTS, false);
        (models.ts.model as any).needFormat = true;
    }

    if (contentLess && models.style && mode === 'less') {
        serviceSource.setValueInModeKeepingUndo(models.style.model, contentLess, false);
        (models.style.model as any).needFormat = true;
    }

    const lockMap: Map<string, boolean> = getState(`serviceSource.${position}.lockMap`);
    const newMap = new Map(lockMap);
    newMap.set(result.page, false);
    globalState.globalStateManagment.setState(`serviceSource.${position}.lockMap`, newMap);
    serviceSource.formatMonaco();

}

interface IDataResult {
    html: string,
    ts: string,
    less: string,
    page: string,
    position: 'left' | 'right',
    mode: 'typescript' | 'html' | 'less'
}

interface IDataPrompt {
    page: string,
    prompt: string,
    position: 'left' | 'right',
    mode: 'typescript' | 'html' | 'less'
}