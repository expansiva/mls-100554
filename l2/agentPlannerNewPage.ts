/// <mls shortName="agentPlannerNewPage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent } from './_100554_aiAgentBase';

import {
  getNextPendingStepByAgentName,
  getNextInProgressStepByAgentName,
  calculateStepsStatistics,
  updateStepStatus
} from "./_100554_aiAgentHelper";

import {
  startNewAiTask,
  executeNextStep,
  startNewInteractionInAiTask
} from "./_100554_aiAgentOrchestration";

const agentName = "agentPlannerNewPage";

export function createAgent(): IAgent {
  return {
    agentName,
    agentDescription: "Responsável por definir os detalhes de criação de uma nova página no sistema",
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
   "htmlForm?": string // Optional HTML form shown to the user. The submitted data will be included in the prompt of the next interaction.
  }
]
\`\`\``
  }
}