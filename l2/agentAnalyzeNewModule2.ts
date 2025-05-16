/// <mls shortName="agentAnalyzeNewModule2" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { preferModelType } from './_100554_aiPrompts';
import { getNextPendingStepByAgentName, getNextInProgressStepByAgentName, getNextPendentStep, updateStepStatus, calculateStepsStatistics, getInteractionStepId, getStepById, appendLongTermMemory } from "./_100554_aiAgentHelper";
import { startNewAiTask, executeNextStep, startNewInteractionInAiTask, addNewStep } from "./_100554_aiAgentOrchestration";
import { IAgentCreateSitePrompt, ModuleDefinition } from './_100554_agentAnalyzeNewModuleBase';

const agentName = "agentAnalyzeNewModule2";
export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Analisador de novos modulos 2",
        visibility: "private",
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

    if (!context || !context.message) throw new Error("[${agentName}] Invalid context");

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
    if (flexible < 1) {
        throw new Error(`[${agentName}] afterPrompt: error, Flexible step found.`);
        //Atualizar task com erro de result
    }

    context.task = await updateStepStatus(context.task, step.stepId, "completed");
    await prepareNextStep(context);

}

async function prepareNextStep(context: mls.msg.ExecutionContext) {
    if (!context || !context.task) throw new Error(`[${agentName}] Not found context on _afterPrompt`);
    const step = getNextPendentStep(context.task) as any;
    if (!step || step.type !== 'flexible') throw new Error(`[${agentName}] Invalid next pendent step on _afterPrompt`);
    if (!step.content) throw new Error(`[${agentName}] Not found "content" in flexible result`);

    console.info({
        result: step.content,
    });

    const data: ModuleDefinition = step.content;
    if (!data.tasks) throw new Error(`[${agentName}] Not found "tasks" in flexible result`);

    const prompt: IAgentCreateSitePrompt = {
        data,
        response: undefined
    }

    const remainingTasks: string[] = getTaskIds(data);
    const task = await appendLongTermMemory(context, { remainingTasks: remainingTasks.join(',') });
    context.task = task;

    const newStep: mls.msg.AIPayload = {
        agentName: 'agentCreateSite',
        prompt: JSON.stringify(prompt),
        status: 'pending',
        stepId: step.stepId + 1,
        interaction: null,
        nextSteps: null,
        rags: null,
        type: 'agent'
    }

    await addNewStep(context, step.stepId, [newStep]);


}




export async function getPrompts(prompt: string | undefined, rags: string[] | null): Promise<mls.msg.IAMessageInputType[]> {
    if (!prompt || prompt.length < 3) throw new Error(`[${agentName}] Invalid User prompt in get prompts`);
    const prompts: mls.msg.IAMessageInputType[] = [];

    prompts.push(systemMainInstruction());
    prompts.push({
        type: 'human',
        content: `## JSON de análise \n\n ${prompt}`
    });
    return prompts;
}

function systemMainInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `${preferModelType("code")}
Você é um assistente de projeto.

Com base neste JSON de análise, gere um plano de alto nível que quebre o objetivo em tarefas ordenadas. Para cada tarefa, extraia:
  1. id (único)
  2. nome curto
  3. descrição
  4. outros campos

## Regras e orientações:

- Use o campo 'agentName' com base nos agentes disponíveis.
- Use 'urlName' apenas para tarefas do tipo 'agentCreateNewPage'.
- A lista 'useModels' deve conter apenas os modelos utilizados pela página ou tabela.
- Para 'navigation', **descreva apenas transições reais entre páginas diferentes.**
- O campo 'navigation/action' deve indicar claramente o que o usuário faz (ex: "Ver produtos", "Fazer login").

Para cada página, gere 2 a 5 user stories realistas:
- cobrindo o objetivo principal da página
- considerando diferentes perfis de usuário (ex: visitante, cliente, admin)

Formato de saída (JSON):

\`\`\` json
{
    "type": "flexible",
    "content": {
        "moduleGoal": "...",
        "stylePreferences" : {}, // manter o mesmo style preferences recebido, sem alterações 
        "models": {
            "modelName": {
            "prisma": "...",
            "fields": "..."
            }
        },
        "tasks":  [{
            "id": "t1",
            "name": "...",
            "agentName": "...",
            "urlName": "...", // ex: "/page1"
            "useModels": ["...","..."]
            "description": "...",
            "visibleTo"?: ["public" | "client" | "admin"],
            "businessRules: ["...", "..."],
            "userStories": [{ as: "...", "iWant": "...", "soThat": "..."}],
            "navigation": [{ to: "...", action: "..." }]
        }],
        "moduleConstrains": ["...","..."]
    }
}

\`\`\`

## Agentes disponíveis
- agentCreateNewPage


Não execute nada ainda—só monte o plano
`
    }

}

function getTaskIds(data: ModuleDefinition): string[] {
    if (!data.tasks) return [];
    return data.tasks.map(task => task.id);
}


