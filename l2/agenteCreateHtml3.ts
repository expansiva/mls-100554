/// <mls shortName="agenteCreateHtml3" project="100554" enhancement="_100554_enhancementLit" groupName="other" />


import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { systemComponentsInstruction, systemRulesComponentsInstruction } from './_100554_aiPrompts';

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

const agentName = "agenteCreateHtml3";

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url:svg_agent,
        agentDescription: "Gerar o HTML completo da página com base no modelo técnico da interface (JSON enriquecido).",
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
    prompts.push(systemTaskInstruction());
    prompts.push(systemExampleInstruction());
    prompts.push(systemComponentsInstruction());
    prompts.push(systemRulesComponentsInstruction());
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
Você é responsável por gerar o HTML completo da página com base no modelo técnico da interface (JSON enriquecido).
`
    }
}

function systemTaskInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `##TAREFA

Sua tarefa é transformar esse modelo em uma estrutura HTML usando exclusivamente os web components definidos no JSON. Para cada componente:
	•	Use o nome do webComponent
	•	Aplique o id informado
	•	Adicione os atributos conforme especificado (ex: value="{{...}}", visible="{{...}}")
    •	O atributo "widget" é obrigatorio, deve ser preenchido conforme o json dos componentes.
    •	No atributo "widget" preencha conforme o campo "widgetDefault" caso esteja preenchido.
	•	Quando um atributo tiver computed: true, adicione um comentário no HTML informando que esse valor depende de lógica implementada no .ts
	•	Se existir um campo comentario, adicione-o como comentário acima do elemento
	•	Estruture a página em um container principal, seções, colunas e linhas conforme a separação por seções
    •	Siga a regra fornecida na descrição dos componentes
    •	Todo o lugar que for setado o state deve se usar duas "{{" para abrir e fechar o comando
    •	Nas tags dos elementos "ica" se deve adicionar o sufixo -100554 exemplo: 'ica-layout-flow-section' = 'ica-layout-flow-section-100554'
`
    }
}

function systemExampleInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `##Exemplo

Exemplo de como o HTML deve ser gerado:

<ica-layout-flow-section-100554 id="section1" class="inset" widget="wc-section-100554">
	<ica-apresentation-text-text-100554 id="apText1" widget="wc-text-100554" text="Solicitação de Compra de Materiais" type="h2">
	</ica-apresentation-text-text-100554>
	<ica-layout-flow-divider-100554 widget="wc-divider-line-100554" id="apDivider1">
	</ica-layout-flow-divider-100554>
<ica-layout-flow-section-100554>
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
    "agentName": "agentCreateTs",
    "taskTitle": string,
    "promptUser": string, // original do usuario,
    "rags": null,
    "prompt":{
      "pageName": string,
      "pageType": "crud" | "report" | "dashboard" | "form" | "search" | "workflow" | "config" | "association",
      "loadContext": false,    
      "modoInicial": "visualizacao",
      "fluxo": "Permite visualizar os dados inicialmente. O botão 'Editar' ativa os campos para edição. A alteração só é salva após clicar em 'Salvar'.",
      "fileHTML":"{html gerado}"
    }
  }
]

\`\`\``
  }
}