/// <mls shortName="agenteCreateHtml1" project="100554" enhancement="_100554_enhancementLit" groupName="other" />


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

const agentName = "agenteCreateHtml1";

export function createAgent(): IAgent {
  return {
    agentName,
    agentDescription: "Entender a intenção da página com base nos requisitos e no prompt do usuário..",
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
    const inputs = await getPrompts(JSON.stringify(step.prompt), step.rags);
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
  prompts.push(systemRules2Instruction());
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
Você é um analista de interface. Sua tarefa é entender a intenção da página com base nos requisitos e no prompt do usuário.

Seu objetivo é gerar uma estrutura conceitual da interface, sem mapear componentes técnicos nem definir estados, bindings ou web components. Apenas descreva o que a página deve conter e qual o propósito de cada elemento.
`
  }
}

function systemRulesInstruction(): mls.msg.IAMessageInputType {
  return {
    type: 'system',
    content: `##Diretrizes para a Resposta
-Para cada seção da interface, defina:
-Nome da seção
-Descrição (opcional)
-Lista de campos ou ações
-Nome lógico (ex: nome, email, botaoSalvar)
-Intenção (ex: capturar nome do cliente, permitir salvar o formulário)
`
  }
}

function systemRules2Instruction(): mls.msg.IAMessageInputType {
  return {
    type: 'system',
    content: `##Descreva o comportamento geral da página, incluindo:

-Nome da página
-Modo inicial (ex: visualizacao ou edicao)
-Regras de fluxo (ex: salvar somente após clicar em “editar”)

*Importante: Não inclua nomes de web components, atributos HTML, bindings ou lógica de estado.
`
  }
}

function systemOutInstruction(): mls.msg.IAMessageInputType {
  return {
    type: 'system',
    content: `##Saída Esperada 
A resposta deve ser um JSON estruturado contendo as informações da interface.

\`\`\`json
[
  {
    "type": "agent",
    "agentName": "agenteCreateHtml2",
    "taskTitle": string,
    "promptUser": string, // original do usuario,
    "rags": null,
    "prompt":{
      "pageName": string,
      "pageType": "crud" | "report" | "dashboard" | "form" | "search" | "workflow" | "config" | "association",
      "loadContext": false,    
      "modoInicial": "visualizacao",
      "fluxo": "Permite visualizar os dados inicialmente. O botão 'Editar' ativa os campos para edição. A alteração só é salva após clicar em 'Salvar'.",
      "secoes": [
        {
          "nome": "dadosPessoais",
          "descricao": "Campos principais do cliente",
          "campos": [
            {
              "nome": "nome",
              "intencao": "capturar nome completo do cliente"
            },
            {
              "nome": "email",
              "intencao": "capturar e-mail para contato"
            },
            {
              "nome": "telefone",
              "intencao": "capturar telefone de contato"
            },
            {
              "nome": "dataNascimento",
              "intencao": "registrar a data de nascimento do cliente"
            },
            {
              "nome": "idadeTexto",
              "intencao": "exibir idade atual calculada com base na data de nascimento"
            }
          ]
        },
        {
          "nome": "acoes",
          "descricao": "Botões de interação com o formulário",
          "campos": [
            {
              "nome": "botaoEditar",
              "intencao": "ativar edição dos campos"
            },
            {
              "nome": "botaoSalvar",
              "intencao": "salvar os dados do cliente após edição"
            }
          ]
        }
      ]
    }
  }
]

\`\`\``
  }
}
