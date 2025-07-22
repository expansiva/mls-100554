/// <mls shortName="agentFix" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent } from './_100554_aiAgentBase';
import { preferModelType } from './_100554_aiPrompts';
import { getNextPendingStepByAgentName, getNextInProgressStepByAgentName, updateStepStatus, getNextPendentStep, updateTaskTitle } from "./_100554_aiAgentHelper";
import { startNewInteractionInAiTask, startNewAiTask, executeNextStep } from "./_100554_aiAgentOrchestration";
import { forceServiceInstance } from './_100554_libCommom';
import { getState, setState } from './_100554_collabState';
import { ServiceSource100554 } from './_100554_serviceSource';
import { descriptionForPrompt } from "./_100554_icaBaseDescription";
import { convertFileNameToTag } from './_100554_utilsLit';

const agentName = "agentFix";

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svgFixBug,
        agentDescription: "Responsavel por corrigir erros",
        visibility: "public",
        scope: ["l2_preview"],
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
        let data:any;
        try {
            let pp = context.message.content
                .replace(`@@ ${agentName}`, '')
                .replace(`@@${agentName}`, '').trim()
                .replace(`@@Fix`, '');

            data = mls.common.safeParseArgs(pp) as IDataPrompt;
            if (!('page' in data) || !('prompt' in data)) throw new Error(`[${agentName}] beforePrompt: Invalid prompt structure missing page and prompt`);
            const inputs = await getPrompts(data);
            await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt).catch((err) => {
                throw new Error(err.message)
            });

        } catch (err) {
            refreshStateLock(data.page, data.position, false);
        }
        return;
    }



    const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
    context = await updateStepStatus(context, step.stepId, "in_progress");    
    if (!step.prompt) throw new Error(`[${agentName}] beforePrompt: No prompt found in step for this agent.`);

    const data: IDataPrompt = mls.common.safeParseArgs(step.prompt) as IDataPrompt;
    if (!('page' in data) || !('prompt' in data)) throw new Error(`[${agentName}] beforePrompt: Invalid prompt structure missing page and prompt`);
    const inputs = await getPrompts(data);
    await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId).catch((err) => {
        refreshStateLock(data.page, data.position, false);
    });

}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {

    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No pending interaction found.`);

    context = await updateStepStatus(context, step.stepId, "completed");

    await updateFile(context);
    if (!context.task) throw new Error("Invalid context task");
    context.task = await updateTaskTitle(context.task, "Widget fixed");
    await executeNextStep(context);

}

async function getPrompts(data: IDataPrompt): Promise<mls.msg.IAMessageInputType[]> {

    if (!('page' in data) || !data.page) throw new Error(`[${agentName}] getPrompts: No 'page' in data prompt.`);
    if (!('position' in data) || !data.position) throw new Error(`[${agentName}] getPrompts: No 'position' in data prompt.`);
    if (!['left', 'right'].includes(data.position)) throw new Error(`[${agentName}] getPrompts: Invalid 'position' in data prompt: ${data.position}`);
    if (!('mode' in data) || !data.mode) data.mode = 'typescript';
    if (!['typescript', 'html', 'less'].includes(data.mode)) throw new Error(`[${agentName}] getPrompts: Invalid 'mode' in data prompt: ${data.mode}`);

    const prompts: mls.msg.IAMessageInputType[] = [];
    prompts.push(systemMainInstruction());
    prompts.push(systemTaskInstruction());
    prompts.push(systemRulesInstruction());
    prompts.push(systemRulesTripleSlash());
    prompts.push(systemKnownErrors());

    if (data.mode === 'typescript') {
        prompts.push(await systemDefinitionTypescript(data));
        prompts.push(await systemImportsDefinitionTs(data));
        prompts.push(systemWidgetsDescriptionsInstruction(data));
        prompts.push(await systemDefinitionErrorsTs(data));
    }

    if (data.mode === 'html') {
        prompts.push(await systemDefinitionHTML(data));
    }

    if (data.mode === 'less') {
        prompts.push(await systemDefinitionLess(data));
        prompts.push(await systemDefinitionErrorsLess(data));
    }

    prompts.push(await systemDefinitionDefs(data));
    prompts.push(systemOutInstruction());
    prompts.push(systemUserInstruction(data));
    return prompts;
}


function systemMainInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `${preferModelType("code")}
Você é um agente especializado em corrigir erros de componentes web desenvolvidos com o framework Lit. Você receberá um arquivo typescript ou html ou less, e um json de definição(estilo metadata com informaçoes gerais):
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
3. *Não remover*, a primeira linha com tripleslash ex: /// <mls shortName="xxx" project="yyy" enhancement="yyy" groupName="zzzz" />
4. Não alterar o valor dos itens do tripleslash(shortName,project,enhancement,groupName)
`
    }
}


function systemRulesTripleSlash(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `##Rules
Os arquivos .ts e .less tem como controle a primeira linha sendo um tripleslash. Essa linha é obrigatória, não remover.
- Os atributos válidos são : shortName,project,enhancement,groupName.
- Corrigir o nome dos atributos se necessário.
- Não adicionar novos atributos.
- Não alterar o value dos atributos
- O value deverá ser sempre entre aspas duplas "" ex: /// <mls shortName="xxx" project="yyy" enhancement="yyy" groupName="zzzz" />

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

async function systemDefinitionDefs(data: IDataPrompt): Promise<mls.msg.IAMessageInputType> {

    try {
        const content = await getContentByExtension(data.page, 'defs');
        if (!content) return { type: 'system', content: '' };
        return {
            type: 'system',
            content: `## JSON DE DEFINITIONS \n\n ${content}`
        }
    } catch (e: any) {
        throw new Error(`[${agentName}][systemDefinitionDefs]: ${e.message}`);
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

async function systemImportsDefinitionTs(data: IDataPrompt): Promise<mls.msg.IAMessageInputType> {

    try {

        const models = mls.editor.models[data.page];
        if (!models || !models.ts) throw new Error(`[${agentName}][systemImportsDefinitionTs]: not found models for file:` + data.page);
        const imports = models.ts.compilerResults?.imports || [];

        const defs = await getDefinitonsByImports(imports, data.position);
        const str = defs.map((def) => ` **importName: ${def.importName}**\n${def.definition}`)

        return {
            type: 'system',
            content: ` ## IMPORTS DEFINITIONS \n\n ${str.join('\n')}
`
        }
    } catch (e: any) {
        throw new Error(`[${agentName}][systemImportsDefinitionTs]: ${e.message}`);
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

function systemWidgetsDescriptionsInstruction(data: IDataPrompt): mls.msg.IAMessageInputType {

    const models = mls.editor.models[data.page];
    if (!models || !models.ts) throw new Error(`[${agentName}][systemImportsDefinitionTs]: not found models for file:` + data.page);
    const imports = models.ts.compilerResults?.imports || [];

    const hasBaseIca = imports.find((item) => item.startsWith('./_100554_ica') && item.endsWith('Base'));
    if (!hasBaseIca) {
        return {
            type: 'system',
            content: ''
        }
    }

    const tagWidgetBase = hasBaseIca.replace('./', '').replace('Base', '');
    let tag = convertFileNameToTag(tagWidgetBase);
    tag = extractBaseComponentName(tag);
    const content = extractComponentMarkdown(descriptionForPrompt, tag.replace('-100554', ''));

    return {
        type: 'system',
        content: `## DEFINIÇÕES DE COMPONENTE ICA
        
Em caso de componentes extends Ica.....Base, se necessário analisar o arquivo description abaixo para melhor definir as correções:
Para definição de qual decorator usar em cada tipo de atributo, levar em consideração:   

- Se necessário fazer o import:  { propertyCompositeDataSource, propertyDataSource } from './_100554_collabDecorators';
- @propertyDataSource: Propriedade ligada a um único state dinâmico. Exemplo de binding: "{{page1.name}}".
- @propertyCompositeDataSource: Propriedade composta por múltiplos states dinâmicos. Exemplo: "Olá {{page1.userId}} - {{page1.userName}}".
- para atributos na classe 'Text', use '@propertyCompositeDataSource'.
- para atributos na classe 'Bind', use '@propertyDataSource'.
- para atributos na classe 'Cfg', use '@propertyDataSource'.
- Propriedade autofocus deve ser definida conforme lit "@propertyDataSource({{ type: Boolean }}) autofocus: boolean = false;"
- Propriedade name deve ser definida conforme lit "@propertyCompositeDataSource({{ type: String }}) name: string | undefined;"
- Atributos A11y (optional): role, ariaLabel, ariaDescribedBy, ariaExpanded, ariaSelected ect. O mesmo deve ser definido da seguinte forma ex: "@propertyDataSource({{ type: String }}) ariaLabel: string = '';"
- Todo atributo aria é string e não string | undefined, sempre iniciar com '';

Segue as definições do componente baseado na classe extends Ica.....Base :

${content}


`
    }
}

function systemOutInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## Formato de saida:
\`\`\` json
{
    "type": "flexible",
    "result": { 
        html: string, 
        ts: string, 
        less: string, 
        page:string, // retornar o mesmo nome de page recebido *obrigatório*,
        position: 'left' | 'right'  // retornar o mesmo position recebido *obrigatório*,
        mode: 'typescript' | 'html' | 'less' // retornar o mesmo mode recebido *obrigatório*,
    }
  }
\`\`\`
`
    }
}

function systemUserInstruction(data: IDataPrompt): mls.msg.IAMessageInputType {
    return {
        type: 'human',
        content: `##Solicitação do usuário:

${JSON.stringify(data)}
`
    }
}

async function getContentByExtension(fullName: string, ext: 'html' | 'ts' | 'style' | 'defs') {
    try {
        const models = mls.editor.models[fullName];
        if (!models) throw new Error(`[${agentName}][getContentByExtension]:Not found models for file:` + fullName);
        if (!models[ext]) return '';
        return models[ext]?.model.getValue();
    } catch (e: any) {
        throw new Error(`[${agentName}][getContentByExtension]: ${e.message}`);
    }
}

async function getDefinitonsByImports(imports: string[], position: 'left' | 'right') {

    const serviceSource: ServiceSource100554 = getState(`serviceSource.${position}.service`);
    if (!serviceSource) throw new Error('Not found service source instance');

    const definitionsData: { importName: string, definition: string }[] = [];
    for await (let importName of imports) {
        if (!importName.startsWith('./')) continue;
        const fullPath = importName.replace('./', '');
        const iPath = mls.l2.getPath(fullPath);
        const keyToStorFile = mls.stor.getKeyToFiles(iPath.project, 2, iPath.shortName, '', '.ts');
        const storFile = mls.stor.files[keyToStorFile];
        if (!storFile) continue;
        await serviceSource.createModels(storFile);
        const models = mls.editor.models[fullPath];
        if (!models || !models.ts) continue;
        await mls.l2.typescript.compileAndPostProcess(models.ts, false, false);
        const definition = models.ts.compilerResults?.prodDTS || '';
        if (definition) {
            definitionsData.push({
                definition,
                importName
            })
        }

    }

    return definitionsData;


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
    const serviceSource: ServiceSource100554 = getState(`serviceSource.${position}.service`);
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

    refreshStateLock(result.page, position, false);
    serviceSource.formatMonaco();

}

function extractBaseComponentName(input: string): string {
    const match = input.match(/^(.*?)(?:-base-\d+)?$/);
    return match ? match[1] : input;
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

function refreshStateLock(page: string, position: string, value: boolean) {
    const lockMap: Map<string, boolean> = getState(`serviceSource.${position}.lockMap`);
    const newMap = new Map(lockMap);
    newMap.set(page, value);
    setState(`serviceSource.${position}.lockMap`, newMap);
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