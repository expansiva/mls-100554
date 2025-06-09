/// <mls shortName="agentGenerateDefs" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { forceServiceInstance } from './_100554_libCommom';
import { preferModelType, systemComponentsInstruction } from './_100554_aiPrompts';

import {
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    updateStepStatus,
    getNextPendentStep,
    updateTaskTitle,
    notifyTaskCompleted,
    notifyTaskChange
} from "./_100554_aiAgentHelper";

import {
    startNewInteractionInAiTask,
    startNewAiTask,
    executeNextStep
} from "./_100554_aiAgentOrchestration";

const agentName = "agentGenerateDefs";
const project = 100554;
const enhancement = '_100554_enhancementLit';

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

// todo: fazer html com explicações

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
    const payload = getNextPendentStep(context.task) as mls.msg.AIPayload | null;
    context = await updateDefs(context, payload);
    notifyTaskChange(context, "Def updated");
    // await executeNextStep(context);
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
    if (!result.meta.projectId || !result.meta.shortName || result.meta.folder === null) throw new Error("Invalid step in update defs, incorrect meta: '" + result?.meta?.projectId + "', '" + result?.meta?.shortName + "', '" + result?.meta?.folder + "'");

    if ('compileEmbedding' in result) delete result.compileEmbedding;

    const models = getModel({ project: result.meta.projectId, shortName: result.meta.shortName });
    const template = `/// <mls shortName="${result.meta.shortName}" project="${result.meta.projectId}" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = ${JSON.stringify(result, null, 2)}
    `;
    if (models && models.defs) models.defs.model.setValue(template);
    else await createStorFile(result.meta.projectId, result.meta.shortName, result.meta.folder, template, '.defs.ts');

    if (models && models.defs) mls.editor.forceModelUpdate(models.defs.model);

    context.task = await updateTaskTitle(context.task, "Def updated");
    context.task = await updateStepStatus(context.task, step.stepId, "completed");
    return context;
}

export async function getPrompts(info: any): Promise<mls.msg.IAMessageInputType[]> {

    if (!info || !info.project || !info.shortName) throw new Error(`Erro [${agentName}] getPrompts: invalid info`);

    const prompts: mls.msg.IAMessageInputType[] = [];

    const files = await mls.stor.getFiles({ project: info.project, shortName: info.shortName, folder: info.folder || '', loadContent: true });
    if (!files || !files.ts) throw new Error(`Erro [${agentName}] getPrompts: files not found`);
    const folder: string = files.ts.folder;

    prompts.push(systemMainInstruction(folder));
    prompts.push(systemFileTS(files.tsContent || ''));
    prompts.push(systemFileHtml(files.htmlContent || ''));
    prompts.push(systemFileLess(files.lessContent || ''));
    prompts.push(systemFileDef(files.defsContent || ''));
    prompts.push(systemOutInstruction());
    prompts.push(systemUserInstruction());
    return prompts;
}

function systemMainInstruction(folder: string): mls.msg.IAMessageInputType {
    // models types: code, claude37
    const modelType: mls.msg.ModelType = "claude";
    const model: string = preferModelType(modelType);

    // const thinking = `Para cada step processado abaixo, grave no field 'thinking' no "formato de saida" as informações sobre o raciocíneo usado, exemplo: "step 1.1 xxx"`;

    return {
        type: 'system',
        content: `${model}
Você é um especialista em desenvolvimento front-end e análise de componentes, com foco em gerar definições .defs para sistemas do tipo Collab.codes. Seu papel é processar o código fornecido passo a passo, aplicar boas práticas, identificar riscos e gerar a saída no formato especificado.

O objeto '.defs' que será gerado, será usado para:
- Documentação do componente
- Suporte à IA copiloto e RAG
- Construção de mapas mentais e relacionamentos
- Análise técnica e organizacional do sistema Collab.codes
- Análise da qualidade do software

## Regras específicas para cada seção no "formato de saida".

1. na seção 'meta':
1.1. copie a seção 'meta' do '.defsOld' se existir.
1.2. verifique a seção 'meta':
  - se existir, copie os dados desta seção, atualize algumas informações se o usuário solicitar.
  - se não existir, preencha os campos após uma análise profunda.

2. na seção 'references', preencha os dados após uma análise no .ts,
2.1 Extraia 'states' somente dos seguintes padrões:
  - Comandos 'getState(...)', 'setState(...)'
  - Bindings no HTML como '{{db.produto.nome}}'
  - Atributos com 'value="{{...}}"', 'checked="{{...}}"' etc.

3. na seção 'codeInsights', analise os arquivos .ts, .html e .less e preencha os fields:
3.1. field 'todos': inicie esta field limpo, e inclua novos registros se tiver comentários 'todo:' no '.ts'.
3.2. field 'securityWarnings': inicie esta field limpo, detecte padrões inseguros, como innerHTML, acesso direto ao window, tokens hardcoded, etc.
3.3. field 'unusedImports': inicie esta field limpo, identifique imports no .ts que não são usados.
3.4. field 'deadCodeBlocks': inicie esta field limpo, identifique blocos de código que nunca serão executados.
3.5. field 'accessibility': revise atributos como aria-*, contraste, foco via teclado, uso de tabindex, e comente boas práticas ou problemas.
3.6. field 'i18nWarnings': se o .ts tiver seção i18n, verifique se há strings que deveriam estar internacionalizadas, exceto termos genéricos como 'stop', 'cancel', etc.
3.7. field 'correctness': nota de 0 a 10 para o typecript.
3.8. field 'errorHandling': nota de 0 a 10 para o typescript,
3.9. field 'readability': nota de 0 a 10 para o typescript,
3.10. field 'maintainability': nota de 0 a 10 para o typescript,


4. na seção 'auth', preencha **somente** se houver **evidência direta** no código (ex: 'if user.role === 'admin'').

5. na seção 'planning':
5.1. copia a seção 'planning' do '.defsOld', se existir, somente copie esta seção.
5.2. Se a seção 'planning' **já existir**:
  - Atualize os campos 'done' e 'comment' de cada item (interface Planning), mesmo sem solicitação do usuário. Para isto analise o campo 'description' e verifique se já foi feito ou não, inclua um comentário caso necessário.
  - Não altere ou adicione novos itens (description) a menos que o usuário solicite.
5.3. Se a seção 'planning' **não existir**:
  - Gere uma seção completa com base na análise profunda do código.

## Dados complementares, YAML.
folder: ${folder}
modelType: ${modelType}

---
`
    }
}

function systemOutInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## formato de saida 
Você deve retornar o objeto JSON conforme abaixo.

\`\`\`json
{
  "type": "flexible",
  "result": BaseDefs
}
\`\`\`

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
    correctness: number; // 0-10, 10 is best
    errorHandling: number;
    readability: number;
    maintainability: number;
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
    userStories?: UserStories[]; // User stories that describe the functionality from the user's perspective
    userRequestsFeatures?: Planning[]; // User feature requests
    userRequestsBugs?: Planning[]; // User bug reports
    userRequestsEnhancements?: Planning[]; // // User suggestions for improvements
  };

  embedding?: string; // Base64 vector embedding (generated post-analysis)
  embeddingVersion?: string; // Version of the embedding model used, e.g., "text-embedding-3-small"
}

export interface UserStories {
  story: string; // User story description
  derivedRequirements: Planning[]; // Functional or technical requirements derived from the user story
}

export interface Planning {
  description: string; // Description of the planning
  done?: boolean; // Whether the planning is done, default = false
  comment?: string; // Optional comment or notes for done = false
}

export type UserRole = string;
`
    }
}

function systemUserInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'human',
        content: `##Solicitação do usuário

Por favor, analise os arquivos .ts, .html, .less e gere o objeto .defs conforme o formato especificado.
`
    }
}

function systemFileTS(content: string): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## arquivo .ts
\`\`\`typescript
${content}
\`\`\`` }
}

function systemFileHtml(content: string): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## arquivo .html
\`\`\`html
${content}
\`\`\``}
}

function systemFileLess(content: string): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## arquivo .less
\`\`\`less
${content}
\`\`\`` }
}

function systemFileDef(content: string): mls.msg.IAMessageInputType {

    function removeLine(source: string, startsWith: string) {
        return source
            .split('\n')
            .filter((line: string) => !line.trimStart().startsWith(startsWith))
            .join('\n');
    }
    content = removeLine(content, '"embedding":')
    content = removeLine(content, '"embeddingVersion":')

    return {
        type: 'system',
        content: `## arquivo .defsOld
\`\`\`typescript
${content}
\`\`\`` }
}

function getModel(info: { project: number, shortName: string }): mls.editor.IModels | undefined {

    return mls.editor.getModels(info.project, info.shortName);

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

async function createStorFile(project: number, shortName: string, folder: string, content: string, extension: string) {
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
