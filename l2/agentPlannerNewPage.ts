/// <mls shortName="agentPlannerNewPage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';

import {
  getNextPendingStepByAgentName,
  getNextInProgressStepByAgentName,
  calculateStepsStatistics,
  updateStepStatus,
  getInteractionStepId,
  getStepById
} from "./_100554_aiAgentHelper";

import {
  startNewAiTask,
  executeNextStep,
  startNewInteractionInAiTask,
  addNewStep
} from "./_100554_aiAgentOrchestration";

const agentName = "agentPlannerNewPage";

export function createAgent(): IAgent {
  return {
    agentName,
    avatar_url: svg_agent,
    agentDescription: "Responsável por definir os detalhes de criação de uma nova página no sistema",
    visibility: "private",
    async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
      return _beforePrompt(context);
    },
    async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
      return _afterPrompt(context);
    },
    async beforeClarification(context: mls.msg.ExecutionContext, stepId: number): Promise<HTMLDivElement | null> {
      return _beforeClarification(context, stepId);
    },
    async afterClarification(context: mls.msg.ExecutionContext, stepId: number, data: any): Promise<void> {
      return _afterClarification(context, stepId, data);
    }
  }
}

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
  const taskTitle = "Planning";

  if (!context || !context.message) throw new Error("Invalid context");

  if (!context.task) {
    // using temporary context, create a new task
    const inputs = await getPrompts(context.message.content, null);
    await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt);
  } else {

    const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
    if (!step) {
      throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
    }
    context.task = await updateStepStatus(context.task, step.stepId, "in_progress");
    const inputs = await getPrompts(step.prompt, step.rags);
    await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);
  }
}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
  if (!context || !context.message || !context.task) throw new Error("Invalid context");
  const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
  if (!step) throw new Error(`[${agentName}] afterPrompt: No pending interaction found.`);
  const { flexible } = calculateStepsStatistics([step], true);
  if (flexible > 0) throw new Error(`[${agentName}] afterPrompt: error, Flexible step found.`);
  context.task = await updateStepStatus(context.task, step.stepId, "completed");
  await executeNextStep(context);
}

const _beforeClarification = async (context: mls.msg.ExecutionContext, stepId: number): Promise<HTMLDivElement | null> => {

  if (!context.task) throw new Error("[_beforeClarification] Invalid context.task");
  const step = getStepById(context.task, stepId) as mls.msg.AIClarificationStep;
  if (!step) throw new Error(`[_beforeClarification] Invalid step: ${stepId} on task: ${context.task.PK}`);
  if (!step.json) throw new Error(`[_beforeClarification] Invalid step json on task: ${context.task.PK} step ${stepId}`);
  const project = 100554;
  const keyFile = mls.stor.getKeyToFiles(project, 2, agentName, '', '.html');
  const storFile = mls.stor.files[keyFile];
  if (!storFile) return null;
  const content = await storFile.getContent();
  if (!content || typeof content !== 'string') return null;
  const element = prepareHtmlClarification(content, step.json, context.task.PK, stepId, step.clarificationMessage);
  return element;
}

const _afterClarification = async (context: mls.msg.ExecutionContext, stepId: number, data: any): Promise<void> => {

  if (!context || !context.message || !context.task) throw new Error("Invalid context");
  if (!data.json) throw new Error("Invalid json after clarification");

  const newPrompt = JSON.stringify(data.json);
  const step: mls.msg.AIPayload | null = getStepById(context.task, stepId);
  if (!step) {
    throw new Error(`[${agentName}] beforePrompt: No found step: ${stepId} for this agent.`);
  }

  const interactionId: number | null = getInteractionStepId(context.task, step.stepId);
  if (!interactionId) throw new Error("[beforePrompt] Not found interactionId in pending step")
  const payload: mls.msg.AIPayload | null = getStepById(context.task, interactionId);
  if (!payload || payload.type !== "agent") throw new Error("[beforePrompt] Clarification or tool step not bellow a agent");

  const promptUser = payload.interaction?.input.find((input) => input.type === 'human')?.content || '';

  const newStep: mls.msg.AIPayload = {
    agentName,
    prompt: promptUser + '\n' + newPrompt,
    status: 'pending',
    stepId: step.stepId + 1,
    interaction: null,
    nextSteps: null,
    rags: null,
    type: 'agent',
    title: 'Executing',
  } as any

  await addNewStep(context, step.stepId, [newStep]);

}

function prepareHtmlClarification(
  content: string,
  json: string | object,
  taskId: string,
  stepId: number,
  clarificationMessage: string
): HTMLDivElement {
  const div: HTMLDivElement = document.createElement('div');
  const jsonStr = typeof json === 'object'
    ? JSON.stringify(json, null, 2)
    : json;
  const clarificationTemplate = `//**startClarificationData
  const clarificationData = {
    "type": "clarification",
    "taskId": '[TaskId]',
    "stepId": '[StepId]',
    "clarificationMessage": '[clarificationMessage]',
    "json": [Json]
  };
//**endClarificationData`;
  const updatedBlockContent = content.replace(
    /\/\/\*\*startClarificationData[\s\S]*?\/\/\*\*endClarificationData/,
    clarificationTemplate
  );
  const finalContent = updatedBlockContent
    .replace(/\[TaskId\]/g, taskId)
    .replace(/\[StepId\]/g, stepId.toString())
    .replace(/\[clarificationMessage\]/g, clarificationMessage)
    .replace(/\[Json\]/g, jsonStr);
  div.innerHTML = finalContent;
  return div;
}

export async function getPrompts(prompt: string | undefined, rags: string[] | null): Promise<mls.msg.IAMessageInputType[]> {
  if (!prompt || prompt.length < 3) throw new Error("Invalid Prompt");
  const prompts: mls.msg.IAMessageInputType[] = [];

  prompts.push(systemMainInstruction());
  prompts.push(systemRulesInstruction());
  prompts.push(systemOutInstruction());
  prompts.push({
    type: 'human',
    content: prompt
  });
  return prompts;
}

function systemMainInstruction(): mls.msg.IAMessageInputType {
  return {
    type: 'system',
    content: `
Você é um planejador responsável por definir os detalhes de criação de uma nova página no sistema.

Com base no prompt original do usuário, sua tarefa é:
1. Entender o propósito da página.
2. Escolher o nome da página.
3. Determinar o tipo da página, usando o enum \`PageType\`.
4. Verificar se há APIs, states ou dados existentes que podem ser usados. Caso não existam, deve sugerir o que precisa ser criado e aguardar uma confirmação ou complementação do usuário.
5. Especificar cada campo necessário (widgets), se o usuario não passar os campos, coloque os campos que você achar necessario para o funcionamento da pagina.
6. Definir restrições e requerimentos técnicos ou funcionais.
7. Se os dados forem suficientes, preparar a chamada para o agente \`agenteCreateHtml1\`.
8. Se necessário, peça mais informações ao usuário usando o tipo \`clarification\`. Sempre que possível, inclua um \`htmlForm\` com campos e respostas prontas (como botões, selects ou inputs) para facilitar a interação. O formulário será exibido ao usuário e os dados enviados serão incluídos automaticamente no próximo prompt.  Se for necessária uma \`clarification\`, retorne **apenas essa subtarefa**. Não crie outros agentes ou ferramentas até que a resposta do usuário seja recebida.
`
  }
}

function systemRulesInstruction(): mls.msg.IAMessageInputType {
  return {
    type: 'system',
    content: `## Regras adicionais:
  •	O campo widgets é obrigatório se for criar a página.
  •	O Nome da página que você criar deve ser no formato pageXxx , onde ‘page’ é o sufixo obrigatório.
  •	Cada widget deve conter:
  •	name: identificador curto
  •	binding: no formato "{{[pageName].[name]}}" (não confundir com bindings reais dos states)
  •	description: funcionalidade do componente
  •	Se o tipo da página estiver ambíguo, retorne uma clarificationMessage solicitando mais detalhes ao usuário.`
  }
}

function systemOutInstruction(): mls.msg.IAMessageInputType {
  return {
    type: 'system',
    content: `## Formato de saída 
Você deve retornar **apenas um dos seguintes formatos** no array JSON:

\`\`\`json
[
  {
    "type": "agent",
    "agentName": "agenteCreateHtml1",
    "taskTitle": string,
    "promptUser": string, // original do usuario,
    "rags": null,
    "prompt":{
      "pageName": string,
      "pageType": "crud" | "report" | "dashboard" | "form" | "search" | "workflow" | "config" | "association",
      "loadContext": false,
      "requirements": string,
      "widgets": [
        {
          "name": string,
          "binding": string,
          "description": string
        }
      ]
    }  
  }
]
ou
[
  {
    "type": "clarification",
    "clarificationMessage": string,
    "json": TClarification
  }
]
\`\`\`

definição de TClarification
\`\`\`json
[
    
  {
    "sectionName": "pageName",
    "description": "Nome da pagina",
    "value": "[nomedapagina]"
  },
  {
    "sectionName": "requirements",
    "description": "requisitos para esta pagina, altere se necessário",
    "value": [
      "[exemplo 1 - Suporte para autenticação de usuário]",
      "[exemplo 2 - Validação de campos de entrada]"
    ]
  }
]
\`\`\`

`
  }
}