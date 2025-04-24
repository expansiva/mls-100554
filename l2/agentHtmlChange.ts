/// <mls shortName="agentHtmlChange" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';

import {
    systemComponentsInstruction,
    systemRulesComponentsInstruction
} from "./_100554_aiPrompts";

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

const agentName = "agentHtmlChange";

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Responsável por definir os detalhes de criação de uma nova página html no sistema",
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
    prompts.push(systemComponentsInstruction());
    prompts.push(systemRulesComponentsInstruction());
    prompts.push(systemOutInstruction());
    prompts.push({
        type: 'system',
        content: `## HTML BASE { html base }`
    });
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
Você é um agente especializado na manutenção de HTML. Sua responsabilidade é modificar a estrutura de uma página apenas conforme solicitado pelo usuário, sem alterar sua organização original.
`
    }
}

function systemRulesInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `##REGRAS PRINCIPAIS
 
 - Nunca modifique a primeira linha do HTML, pois ela contém informações críticas da página.
 - Respeite a estrutura existente e realize somente as alterações especificadas pelo usuário.
 - Não introduza elementos ou remoções não solicitadas.
 - Somente usar componentes que estão especificados no JSON
 - Não adicionar atributos além dos que estão especificados em cada componente
 - Todo o lugar que for setado o state deve se usar duas "{{" para abrir e fechar o comando
`
    }
}

function systemOutInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: ` ##Saída esperada

Teremos duas opções de retorno, caso tudo esteja resolvido e a alteração seja possível ser realizada sem mais informações retorne de acordo com a opção 1, caso contrario faça o retorno conforme a opção 2.


Opção 1:
 -  HTML completo e limpo, utilizando apenas web components, com os atributos preenchidos e comentários para os estados computados ou observações específicas. 
Nada além de código HTML deve estar na resposta, nenhum comentário fora do HTML
Toda tag ica deve terminar com "-100554"

Opção 2:
 - Retorne  o json abaixo conforme especificado:

\`\`\`json
[
 {{
    "type": "clarification",
    "clarificationMessage": string,
   "htmlForm?": string // Optional HTML form shown to the user. The submitted data will be included in the prompt of the next interaction.
  }}
]
\`\`\`
        `
    }
}
