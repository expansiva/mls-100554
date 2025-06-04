/// <mls shortName="agentGenerateDefs" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { forceServiceInstance } from './_100554_libCommom';
import { preferModelType, systemComponentsInstruction } from './_100554_aiPrompts';

import {
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    updateStepStatus,
    getNextPendentStep,
    updateTaskTitle
} from "./_100554_aiAgentHelper";

import {
    startNewInteractionInAiTask,
    startNewAiTask
} from "./_100554_aiAgentOrchestration";

const agentName = "agentGenerateDefs";
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

    let pp = extJson(context.message.content).trim();

    if (!context.task) {
        const inputs: any = await getPrompts(JSON.parse(pp));
        await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt);
    } else {

        const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
        if (!step) {
            throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
        }
        context.task = await updateStepStatus(context.task, step.stepId, "in_progress");

        if (!step.prompt) throw new Error(`[${agentName}] beforePrompt: No prompt found in step for this agent.`);

        const data: any = JSON.parse(extJson(step.prompt).trim());
        if (!('project' in data) || !('shortName' in data) || !('folder' in data)) throw new Error(`[${agentName}] beforePrompt: Invalid prompt structure missing json and prompt`);

        const inputs = await getPrompts(data);

        await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);
    }
}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No pending interaction found.`);

    context.task = await updateStepStatus(context.task, step.stepId, "completed");
    await updateFile(context);

}

async function updateFile(context: mls.msg.ExecutionContext) {

    if (!context || !context.task) throw new Error('Not found context to create files');
    const step = getNextPendentStep(context.task) as any;

    if (!step || step.type !== 'flexible') throw new Error('Invalid step in create files');

    if (!step.content || !step.page) throw new Error('Not found "page" in updateFile files');

    await forceServiceInstance(2, '_100554_serviceSource')

    const info = typeof step.page === 'string' ? JSON.parse(step.page) : step.page;

    if ('compileEmbedding' in step.content) delete step.content.compileEmbedding;

    const models = getModel(info);
    const template = `/// <mls shortName="${info.shortName}" project="${info.project}" enhancement="_blank" />

    export const defs: mls.l4.BaseDefs = ${JSON.stringify(step.content, null, 2)}
    `
    if (models && models.defs) models.defs.model.setValue(template);
    else await createStorFile(info.project, info.shortName, info.folder, template, '.defs.ts');

    context.task = await updateTaskTitle(context.task, "Def updated");
    context.task = await updateStepStatus(context.task, step.stepId, "completed");

}

export async function getPrompts(info: any): Promise<mls.msg.IAMessageInputType[]> {

    if (!info) throw new Error(`Erro [${agentName}] getPrompts: info invalid`);

    const prompts: mls.msg.IAMessageInputType[] = [];

    const files = getFiles(info);

    prompts.push(systemMainInstruction());
    prompts.push(systemRulesInstruction());
    prompts.push(systemInstruction(info));
    prompts.push(await systemDefinitionBaseInstruction(files));
    prompts.push(await systemDefinitionBaseHTMLInstruction(files));
    prompts.push(await systemDefinitionBaseLessInstruction(files));
    prompts.push(await systemDefinitionBaseDefInstruction(files));
    prompts.push(systemOutInstruction());
    prompts.push(systemUserInstruction());
    return prompts;
}

function systemMainInstruction(): mls.msg.IAMessageInputType {
    //code
    return {
        type: 'system',
        content: `${preferModelType("code")}
Você irá analisar os arquivos fornecidos (.ts, .html, .less) e gerar ou atualizar um objeto de definição ('.defs') conforme o formato especificado na seção **"formato de saída"**.

Mesmo que **nenhuma alteração** seja identificada, o retorno deve conter o **objeto completo**, sempre no formato atualizado.

Este objeto será usado para:
- Documentação do componente
- Suporte à IA copiloto e RAG
- Construção de mapas mentais e relacionamentos
- Análise técnica e organizacional do sistema Collab.codes
`
    }
}

function systemRulesInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## Regras específicas para cada seção no "formato de saida".

1. na seção 'meta':
- verifique a seção 'meta':
  - se existir, somente atualize os dados caso o usuário solicite.
  - se não existir, preencha os campos após uma análise profunda.

2. na seção 'references', sempre atualize os dados,
- Extraia 'states' somente dos seguintes padrões:
  - Comandos 'getState(...)', 'setState(...)'
  - Bindings no HTML como '{{db.produto.nome}}'
  - Atributos com 'value="{{...}}"', 'checked="{{...}}"' etc.

3. na seção 'codeInsights', sempre atualize os dados.

4. na seção 'auth', sempre atualize os dados, preencha **somente** se houver **evidência direta** no código (ex: 'if user.role === 'admin'').

5. na seção 'planning':
- Sempre verifique se a seção 'planning' existe.
- Se a seção 'planning' **já existir**:
  - Atualize os campos 'done' e 'comment' de cada item (interface Planning), mesmo sem solicitação do usuário. Para isto analise o campo 'description' e verifique se já foi feito ou não, inclua um comentário caso necessário.
  - Não altere ou adicione novos itens (description) a menos que o usuário solicite.
- Se a seção 'planning' **não existir**:
  - Gere uma seção completa com base na análise profunda do código.

`
    }
}

function systemInstruction(info: any): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `### Dados do Componente
- **Page**: ${JSON.stringify(info)}
- **Data de hoje**: '${(new Date(Date.now())).toLocaleDateString()}'
- **Pasta do componente**: '""' (raiz)
- '.html' última edição: '2025-02-03 14:25:30'
- '.ts' última edição: '2025-02-03 14:25:30'
- '.less' última edição: '2025-01-05 11:05:00'
- '.defs' anterior: 'não existe'
        
        `
    }
}

function systemOutInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## formato de saida 

Você deve retornar um array de objetos no formato JSON, com o type "flexible" ou o type "result" em casos de erros ou warnings, segue formato de saida:

[
  {{
    "type": "flexible",
    "page" : {"project":number, "shortName":string, "folder":string}
   "content": BaseDefs
   },
  {
     "type": "result",
     “result”: string  }}
]

export interface BaseDefs {

  meta: {
    projectId: number;
    folder: string;
    shortName: string;
    type: 'page' | 'widget' | 'plugin' | 'module' | 'lib' | 'table';
    group?: string; // Ex: module group, 'CRM', 'CA'
    tags?: string[]; // tags for filtering, ex: ['obsolete', 'newversion2', 'urgent']
  };

  references?: {
    widgets?: string[]; // ['ica-cta-box']
    plugins?: string[]; // ['plugin-analytics']
    statesRO?: string[]; // ex: 'ui.enabled1', read only
    statesRW?: string[]; // ex: 'ui.enabled1', read write
    statesWO?: string[]; // ex: 'ui.enabled1', write only
    imports?: string[]; // ['utils/date', 'userHelper']
  };

  codeInsights?: {
    todos?: string[];
    securityWarnings?: string[];
    unusedImports?: string[];
    deadCodeBlocks?: string[];
    accessibility?: string[];
    i18nWarnings?: string[]; // strings that should be translated, only if i18n is enabled and if string is essential
  };

  auth?: {
    view?: UserRole[];
    edit?: UserRole[];
    use?: UserRole[];
    restrictReason?: string;
  };

  planning?: {    
    generalDescription?: string;
    goal?: string;
    userStories?: [{
      story: string;
      derivedRequirements: Planning[]; // Functional or technical requirements
    }];
    userRequestsFeatures?: Planning[]; // User feature requests
    userRequestsBugs?: Planning[]; // User bug reports
    userRequestsEnhancements?: Planning[]; // // User suggestions for improvements
  };

  compileEmbedding: true, // true if defs changed
}

interface Planning {
  description: string; // Description of the planning
  done?: boolean; // Whether the planning is done, default = false
  comment?: string; // Optional comment or notes for done = false
}

type UserRole = string;
`
    }
}

function systemUserInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'human',
        content: `##Solicitação do usuário

Por favor, analise os arquivos anexos e gere o objeto .defs conforme o formato especificado.
`
    }
}

async function systemDefinitionBaseInstruction(files: IInfo): Promise<mls.msg.IAMessageInputType> {

    try {

        const content = files.ts ? await files.ts.getContent() : 'não existe';
        return {
            type: 'system',
            content: `## arquivo .ts  \n\n ${content}`
        }


    } catch (e) {
        console.info(e);
        return systemComponentsInstruction();
    }

}

async function systemDefinitionBaseHTMLInstruction(files: IInfo): Promise<mls.msg.IAMessageInputType> {

    try {

        const content = files.html ? await files.html.getContent() : 'não existe';

        return {
            type: 'system',
            content: `## arquivo .html \n\n ${content}`
        }


    } catch (e) {
        console.info(e);
        return systemComponentsInstruction();
    }

}

async function systemDefinitionBaseLessInstruction(files: IInfo): Promise<mls.msg.IAMessageInputType> {

    try {

        const content = files.less ? await files.less.getContent() : 'não existe';

        return {
            type: 'system',
            content: `## arquivo .less \n\n ${content}`
        }


    } catch (e) {
        console.info(e);
        return systemComponentsInstruction();
    }

}

async function systemDefinitionBaseDefInstruction(files: IInfo): Promise<mls.msg.IAMessageInputType> {

    try {

        const content = files.def ? await files.def.getContent() : 'não existe';

        return {
            type: 'system',
            content: `## arquivo .defs json , opcional \n\n ${content}`
        }


    } catch (e) {
        console.info(e);
        return systemComponentsInstruction();
    }

}


function getFiles(info: { project: number, shortName: string, folder: string }): IInfo {
    const ret: IInfo = {
        ts: undefined,
        html: undefined,
        less: undefined,
        def: undefined
    };

    ['.ts', '.html', '.less', '.defs.ts'].forEach((ext: string) => {


        const key = mls.stor.getKeyToFiles(info.project, 2, info.shortName, info.folder, ext);

        if (!mls.stor.files[key]) return;

        if (ext === '.ts') ret.ts = mls.stor.files[key];
        if (ext === '.html') ret.html = mls.stor.files[key];
        if (ext === '.less') ret.less = mls.stor.files[key];
        if (ext === '.defs.ts') ret.def = mls.stor.files[key];

    });

    return ret;
}

function getModel(info: { project: number, shortName: string }): mls.editor.IModels | undefined {

    const key = mls.editor.getKeyModel(info.project, info.shortName);
    return mls.editor.models[key];

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

async function createStorFile(project: number, shortName: string, folder:string, content: string, extension: string) {
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
}

interface IInfo {
    ts: mls.stor.IFileInfo | undefined,
    html: mls.stor.IFileInfo | undefined,
    less: mls.stor.IFileInfo | undefined,
    def: mls.stor.IFileInfo | undefined
}
