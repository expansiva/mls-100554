/// <mls shortName="agentWebCare" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from '/_100554_/l2/aiAgentBase.js';
import { forceServiceInstance } from '/_100554_/l2/libCommom.js';
import { preferModelType, systemComponentsInstruction, getPromptByHtml } from '/_100554_/l2/aiPrompts.js';
import { initState } from '/_100554_/l2/collabState.js';

import {
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    updateStepStatus,
    getNextPendentStep,
    updateTaskTitle
} from "/_100554_/l2/aiAgentHelper.js";

import {
    startNewInteractionInAiTask,
    startNewAiTask
} from "/_100554_/l2/aiAgentOrchestration.js";

const agentName = "agentWebCare";
const project = 100554;
const enhancement = '_100554_enhancementLit';

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Agente especializado em manutenção de componentes",
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

    let pp = context.message.content.replace('@@ agentWebCare', '').replace('@@agentWebCare', '').trim();

    if (!context.task) {
        const inputs = await getPrompts(JSON.parse(pp));
        await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt);
    } else {

        const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
        if (!step) {
            throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
        }
        context = await updateStepStatus(context, step.stepId, "in_progress");

        if (!step.prompt) throw new Error(`[${agentName}] beforePrompt: No prompt found in step for this agent.`);
        
        const data = JSON.parse(step.prompt);
        if (!('page' in data) || !('prompt' in data)) throw new Error(`[${agentName}] beforePrompt: Invalid prompt structure missing json and prompt`);

        const inputs = await getPrompts(data);

        await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);
    }
}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No pending interaction found.`);

    context = await updateStepStatus(context, step.stepId, "completed");
    await updateFile(context);

}

async function updateFile(context: mls.msg.ExecutionContext) {

    if (!context || !context.task) throw new Error('Not found context to create files');
    const step = getNextPendentStep(context.task) as any;

    if (!step || step.type !== 'flexible') throw new Error('Invalid step in create files');

    if (!step.content || !step.content.page) throw new Error('Not found "page" in updateFile files');

    await forceServiceInstance(2, '_100554_serviceSource')

    const info =  getInfoPage(step.content.page)

    const contentHTML = step.content.html ? step.content.html : undefined;
    const contentTS = step.content.ts ? step.content.ts : undefined;
    const contentLess = step.content.less ? step.content.less : undefined;

    const models = getModel(info);
    if(!models) throw new Error('Not found model:'+agentName)

    if (contentHTML && models.html) {
        models.html.model.setValue(contentHTML);
        (models.html.model as any).needFormat = true;
    }

    if (contentTS && models.ts) {
        models.ts.model.setValue(contentTS);
        (models.ts.model as any).needFormat = true;
    }

    if (contentLess && models.style) {
        models.style.model.setValue(contentLess);
        (models.style.model as any).needFormat = true;
    }

    if(mls.editor.instances['l2_left'])(mls.editor.instances['l2_left'] as any).getAction('editor.action.formatDocument').run()

    context.task = await updateTaskTitle(context.task, "Widget updated");
    context = await updateStepStatus(context, step.stepId, "completed");

}

export async function getPrompts(json: any): Promise<mls.msg.IAMessageInputType[]> {
    
    /*const prompts: mls.msg.IAMessageInputType[] = [];

    prompts.push(systemMainInstruction());
    prompts.push(systemTaskInstruction());'
    prompts.push(systemRulesInstruction());
    prompts.push(systemOutInstruction());
    prompts.push(await systemDefinitionBaseInstruction(json));
    prompts.push(await systemDefinitionBaseHTMLInstruction(json));
    prompts.push(await systemDefinitionBaseLessInstruction(json));
    prompts.push(await systemUserInstruction(json));*/

    const fullName = json.page;
    if (!fullName) throw new Error('Not found page name:' + agentName);

    const info = getInfoPage(fullName);
        
    const files = await mls.stor.getFiles({ project: info.project, shortName: info.shortName, folder: '', loadContent: true });

    const data = {
        mode: preferModelType("mini"),
        ts: files.tsContent || '',
        html: files.htmlContent || '',
        less: files.lessContent || '',
        humanPrompt: JSON.stringify(json)
    }

    const prompts = await getPromptByHtml({ project: 100554, shortName: 'agentWebCare', folder: '', data });


    return prompts;
}

function systemMainInstruction(): mls.msg.IAMessageInputType {
    //code
    return {
        type: 'system',
        content: `${preferModelType("mini")}
Você é um agente especializado em manutenção de componentes web desenvolvidos com o framework Lit. Cada componente pode incluir até três arquivos interconectados:

- Um arquivo '.ts' com a lógica do componente
- Um arquivo '.html' com a pagina em que o componente esta sendo usado.
- Um arquivo '.less' com os estilos
`
    }
}

function systemTaskInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `##Task

Todos os arquivos de um componente serão fornecidos a você, juntamente com uma solicitação de modificação feita por um usuário. Sua tarefa é:

1. **Interpretar corretamente a solicitação do usuário.**
2. **Determinar quais dos arquivos precisam ser alterados** (pode ser mais de um, ou apenas um).
3. **Executar apenas as alterações necessárias** com base no pedido do usuário.
4. **Retornar somente os arquivos que você modificou**
`
    }
}

function systemRulesInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `##Rules
Regras que devem ser respeitadas na atualização dos arquivos.

1. **Não se deve remover ou renomear atributos sem a solicitação do usuario**
2. **Não se deve adicionar novos tokens no less**
`
    }
}

function systemOutInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `##Formato de saída:

A saída tem que ser em formato JSON com a seguinte estrutura:
\`\`\`json

{
  "type": "flexible",
  "content": {
    "page": "<nome-da-pagina>",
    "ts": "<novo-conteúdo-ts> (opcional)",
    "html": "<novo-conteúdo-html> (opcional)",
    "less": "<novo-conteúdo-less> (opcional)"
  }
}

\`\`\`
`
    }
}

function systemUserInstruction(json: any): mls.msg.IAMessageInputType {
    return {
        type: 'human',
        content: `##Solicitação do usuário

${JSON.stringify(json)}
`
    }
}

async function systemDefinitionBaseInstruction(json: any): Promise<mls.msg.IAMessageInputType> {

    try {

        const fullName = json.page;
        if (!fullName) throw new Error('Not found page name:' + agentName);

        const info = getInfoPage(fullName);

        const key = mls.stor.getKeyToFiles(info.project, 2, info.shortName, "", ".ts");
        if (!mls.stor.files[key]) throw new Error('[systemDefinitionBaseInstruction] not found class base:' + info.shortName);

        let content = await mls.stor.files[key].getContent() as string;

        if (!content) throw new Error('[systemDefinitionBaseInstruction] not found content:' + key);

        return {
            type: 'system',
            content: `## DEFINIÇÕES DA CLASSE \n\n ${content}`
        }


    } catch (e) {
        console.info(e);
        return systemComponentsInstruction();
    }

}

async function systemDefinitionBaseHTMLInstruction(json: any): Promise<mls.msg.IAMessageInputType> {

    try {

        const fullName = json.page;
        if (!fullName) throw new Error('Not found page name:' + agentName);

        const info = getInfoPage(fullName);

        const key = mls.stor.getKeyToFiles(info.project, 2, info.shortName, "", ".html");
        if (!mls.stor.files[key]) throw new Error('[systemDefinitionBaseHTMLInstruction] not found class base:' + info.shortName);

        let content = await mls.stor.files[key].getContent() as string;

        if (!content) throw new Error('[systemDefinitionBaseHTMLInstruction] not found content:' + key);

        return {
            type: 'system',
            content: `## DEFINIÇÕES DO HTML \n\n ${content}`
        }


    } catch (e) {
        console.info(e);
        return systemComponentsInstruction();
    }

}

async function systemDefinitionBaseLessInstruction(json: any): Promise<mls.msg.IAMessageInputType> {

    try {

        const fullName = json.page;
        if (!fullName) throw new Error('Not found page name:' + agentName);

        const info = getInfoPage(fullName);

        const key = mls.stor.getKeyToFiles(info.project, 2, info.shortName, "", ".less");
        if (!mls.stor.files[key]) throw new Error('[systemDefinitionBaseLessInstruction] not found class base:' + info.shortName);

        let content = await mls.stor.files[key].getContent() as string;

        if (!content) throw new Error('[systemDefinitionBaseLessInstruction] not found content:' + key);

        return {
            type: 'system',
            content: `## DEFINIÇÕES DO LESS \n\n ${content}`
        }


    } catch (e) {
        console.info(e);
        return systemComponentsInstruction();
    }

}

function getInfoPage(fullName: string): { project: number, shortName: string, folder:string } {

    let pr = fullName.substring(1).split("_")[0];
    let prID: number = Number(pr);
    if (isNaN(prID)) prID = 0; // error

    let shortName = fullName.substring(pr.length + 2);
    let folder = '';
    let split = shortName.split('/');
    if (split.length >= 2) {
        shortName = split.pop() || shortName;
        folder = split.join('/');
    }
    return {project:prID, shortName, folder}

}

function getModel(info: { project: number, shortName: string, folder:string }):mls.editor.IModels | undefined {
    
    const key = mls.editor.getKeyModel(info.project,  info.shortName, info.folder, 2);
    return mls.editor.models[key];

}


