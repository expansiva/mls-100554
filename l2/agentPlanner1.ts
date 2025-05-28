/// <mls shortName="agentPlanner1" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';

import {
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    calculateStepsStatistics,
    updateStepStatus,
    notifyTaskCompleted,
    getStepById,
    updateTaskTitle,
    notifyTaskChange
} from "./_100554_aiAgentHelper";

import {
    systemAgentsAvailable,
    systemRagsAvailable,
    systemToolsAvailable,
    addRAGAdditionalInformation,
    preferModelType
} from "./_100554_aiPrompts";


import {
    startNewAiTask,
    executeNextStep,
    startNewInteractionInAiTask,
} from "./_100554_aiAgentOrchestration";

const agentName = "agentPlanner1";

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "first agent for general prompts",
        visibility: "private",
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        },
        async beforeClarification(context: mls.msg.ExecutionContext, stepId: number): Promise<HTMLDivElement | null> {
            return _beforeClarification(context, stepId);
        }
    }
};

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
    const { flexible, result } = calculateStepsStatistics([step], true);
    if (flexible > 0) throw new Error(`[${agentName}] afterPrompt: error, Flexible step found.`);
    context.task = await updateStepStatus(context.task, step.stepId, "completed");
    await executeNextStep(context);
    if (result > 0) await addMessageResponse(context, step);

}

const _beforeClarification = async (context: mls.msg.ExecutionContext, stepId: number): Promise<HTMLDivElement | null> => {
    if (!context.task) throw new Error("[_beforeClarification] Invalid context.task");
    const step = getStepById(context.task, stepId) as mls.msg.AIClarificationStep;
    if (!step) throw new Error(`[_beforeClarification] Invalid step: ${stepId} on task: ${context.task.PK}`);
    const msg = `Invalid return from agent: ${agentName} not supported return of type clarification`
    await updateStepStatus(context.task, stepId, 'failed', msg);
    const task = await updateTaskTitle(context.task, msg);
    context.task = task;
    notifyTaskChange(context);
    const element = prepareHtmlClarification();
    return element;
}

function prepareHtmlClarification(
): HTMLDivElement {
    const div: HTMLDivElement = document.createElement('div');
    div.innerHTML = `Invalid return from LLM, ${agentName} don't use payload of type Clarification, please try again!`;
    return div;
}

async function addMessageResponse(context: mls.msg.ExecutionContext, step: mls.msg.AIAgentStep) {

    const payload = step?.interaction?.payload;
    if (!payload) return;
    const [pay1] = payload;
    if (!pay1 || pay1.type !== 'result') return;
    const value = typeof pay1.result === 'object' ? JSON.stringify(pay1.result) : pay1.result;
    if (!value || typeof value !== 'string') return;
    notifyTaskCompleted(context, value);
}

export async function getPrompts(prompt: string | undefined, rags: string[] | null): Promise<mls.msg.IAMessageInputType[]> {
    if (!prompt || prompt.length < 3) throw new Error("Invalid Prompt");
    const prompts: mls.msg.IAMessageInputType[] = [];
    prompts.push(systemMainInstruction());
    prompts.push(systemAgentsAvailable());
    prompts.push(systemRagsAvailable());
    prompts.push(await systemToolsAvailable());
    addRAGAdditionalInformation(rags, prompts); // optional
    prompts.push(systemReturnJsonFormat());
    prompts.push({
        type: 'human',
        content: prompt
    });
    return prompts;
}

function systemReturnJsonFormat(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `
Você deve retornar um array de objetos no formato JSON. Cada objeto representa uma subtarefa, com **apenas um dos seguintes formatos**:
\`\`\` json
[
  {
    "type": "agent",
    "agentName": string,
    "title": string,
    "prompt": string,
    "rags": string[] | null
  },
  {
    "type": "tool",
    "toolName": string,
    "title": string,
    "args": string
  },
  {
    "type": "result",
    "result": string
  }
]
\`\`\`
`
    };
}


function systemMainInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `${preferModelType("cost")}
Você é um coordenador de agentes e ferramentas para executar tarefas com base no prompt do usuário.
Seu único objetivo neste momento é classificar o tipo de ação necessária a partir do prompt.

REGRAS:
1. Retorne **exatamente uma subtarefa** de um dos seguintes tipos: 'agent' ou 'result'.
2. Se o prompt for vago ou ambíguo ou não contiver informação suficiente para decidir entre 'agent' ou 'result', retorne um result com mensagem de prompt inválido.
4. Use 'result' quando o sistema puder **responder diretamente ao usuário** sem envolver agentes.
5. Use 'agent' quando a tarefa requerer **ação ativa ou execução por parte de um agente ou ferramenta externa**.
   - Neste caso, inclua o prompt original do usuário no campo 'prompt'.
6. Não modifique o conteúdo do prompt original.
7. Não elabore respostas nem explique suas escolhas – apenas classifique.

EXEMPLOS:

Usuário: "Criar uma landing page para um produto fitness"
Resposta: Agente

Usuário: "Qual é a capital da Alemanha?"
Resposta: Result

Usuário: "Me ajude"
Resposta: Result

`
    };
}

export function systemMainInstruction2(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `${preferModelType("cost")}
Você é um coordenador de agentes e ferramentas para executar tarefas complexas com base no prompt do usuário.
Seu único objetivo é analisar o prompt do usuário e decidir qual agente chamar.
1. Se faltar informações apenas para decidir o agente ou a resposta, retorne apenas uma subtarefa do tipo \`clarification\`.
2. Se a tarefa puder ser resolvida diretamente com uma resposta, retorne uma subtarefa do tipo \`result\`.
3. Decida qual agente, ferramenta ou base de conhecimento (RAG) será executado no próximo passo.
4. Nunca retorne múltiplas subtarefas. Retorne **apenas uma subtarefa por vez** neste passo inicial.
5. Se retornar um agent, no atributo prompt, deve repetir o prompt original do usuário.
6. Lembre: seu único objetivo é identificar qual agente chamar, não elaborar mais conteúdos.
7. Lembre-se não altere o prompt do usuário.
`
    };
}