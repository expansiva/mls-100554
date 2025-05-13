/// <mls shortName="agentAnalyzeNewModule1" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { preferModelType } from './_100554_aiPrompts';
import { getNextPendingStepByAgentName, getNextInProgressStepByAgentName, getStepById, updateStepStatus, calculateStepsStatistics, getInteractionStepId, } from "./_100554_aiAgentHelper";
import { startNewAiTask, executeNextStep, startNewInteractionInAiTask, addNewStep } from "./_100554_aiAgentOrchestration";
import './_100554_wcClarificationAnalyzeNewModule1';

const agentName = "agentAnalyzeNewModule1";

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "criação de novos projetos, sites",
        visibility: "public",
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        },
        async afterClarification(context: mls.msg.ExecutionContext, stepId: number, data: object): Promise<void> {
            return _afterClarification(context, stepId, data as ClarificationData);
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
    const { flexible } = calculateStepsStatistics([step], true);
    if (flexible > 0) throw new Error(`[${agentName}] afterPrompt: error, Flexible step found.`);
    context.task = await updateStepStatus(context.task, step.stepId, "completed");
    await executeNextStep(context);

}


const _afterClarification = async (context: mls.msg.ExecutionContext, stepId: number, data: ClarificationData): Promise<void> => {

    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    if (!data.json) throw new Error("Invalid json after clarification");

    const step: mls.msg.AIPayload | null = getStepById(context.task, stepId);
    if (!step) {
        throw new Error(`[${agentName}] _afterClarification: No found step: ${stepId} for this agent.`);
    }

    const interactionId: number | null = getInteractionStepId(context.task, step.stepId);
    if (!interactionId) throw new Error("[_afterClarification] Not found interactionId in pending step")
    const payload: mls.msg.AIPayload | null = getStepById(context.task, interactionId);
    if (!payload || payload.type !== "agent") throw new Error("[_afterClarification] Clarification or tool step not bellow a agent");

    const promptUser = payload.interaction?.input.find((input) => input.type === 'human')?.content || '';

    if (!data.promptUser) {
        console.info('[_afterClarification] TODO: chamar proximo prompt para continuar');

        const newStep: mls.msg.AIPayload = {
            agentName: 'agentAnalyzeNewModule2',
            prompt: JSON.stringify(data.json),
            status: 'pending',
            stepId: step.stepId + 1,
            interaction: null,
            nextSteps: null,
            rags: null,
            type: 'agent'
        }
        await addNewStep(context, step.stepId, [newStep]);
        return;
    }

    const rc = {
        prompt: data.promptUser,
        json: data.json
    }

    const newStep: mls.msg.AIPayload = {
        agentName: 'agentAnalyzeNewModule1',
        prompt: JSON.stringify(rc),
        status: 'pending',
        stepId: step.stepId + 1,
        interaction: null,
        nextSteps: null,
        rags: null,
        type: 'agent'
    }

    await addNewStep(context, step.stepId, [newStep]);

    console.info('[_afterClarification]' + rc)

}

const _beforeClarification = async (context: mls.msg.ExecutionContext, stepId: number): Promise<HTMLDivElement | null> => {

    if (!context.task) throw new Error("[_beforeClarification] Invalid context.task");
    const step = getStepById(context.task, stepId) as mls.msg.AIClarificationStep;
    if (!step) throw new Error(`[_beforeClarification] Invalid step: ${stepId} on task: ${context.task.PK}`);
    if (!step.json) throw new Error(`[_beforeClarification] Invalid step json on task: ${context.task.PK} step ${stepId}`);
    const element = prepareHtmlClarification(step.json, context.task.PK, stepId, step.clarificationMessage);
    return element;

}

export async function getPrompts(prompt: string | undefined, rags: string[] | null): Promise<mls.msg.IAMessageInputType[]> {
    if (!prompt || prompt.length < 3) throw new Error("Invalid Prompt");
    const prompts: mls.msg.IAMessageInputType[] = [];

    prompts.push(systemMainInstruction());
    prompts.push({
        type: 'human',
        content: prompt
    });
    return prompts;
}

function systemMainInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `${preferModelType("translate")}
Você é um assistente de projeto. Sua tarefa é analisar este pedido e extrair:

1. Objetivo principal.
2. Entidades e possíveis atributos.
3. Funcionalidades chave.
4. Perguntas em aberto 
5. Restrições ou dependências
6. Preferências de estilo e comunicação (personalidade da marca e tom de voz), defina valores que mais se adequam para este tipo de site / módulo.

### INSTRUÇÕES IMPORTANTES:

Se um JSON preenchido for enviado:
- **Nunca repita** perguntas já respondidas. Verifique cuidadosamente se a resposta já está presente no JSON antes de sugerir qualquer nova questão.
-  Analisar prompt de alteração e cada pergunta e reposta do usuario e verificar se é necessário adicionar/remover restrições, características e entidades.
- Se as respostas forem suficientes, e nenhuma nova pergunta for necessária, retorne um JSON completo sem perguntas abertas.

Formato de saída (JSON):

\`\`\` json
[
  {
    "type": "clarification",
    "clarificationMessage": string,
    "json": {
        "goal": string,
        "entities": {name: string; fields: string[]}[],
        "features": string[]
        "openQuestions": {id: string; question: string}[]
        "constraints":  string[],
        "stylePreferences": {
            "brandPersonality": {
                "sincerity": {
                    "value": number, // 0-100
                    "description": "Indicates warmth, honesty, and trust. High values suggest soft colors, friendly language, and empathetic tone."
                },
                "excitement": {
                    "value": number, // 0-100
                    "description": "Measures energy and boldness. Higher values lead to vibrant palettes, fast animations, and youthful aesthetics."
                },
                "competence": {
                    "value": number, // 0-100
                    "description": "Reflects professionalism and efficiency. High scores imply clean layout, technical precision, and trustworthy tone."
                },
                "sophistication": {
                    "value": number, // 0-100
                    "description": "Captures elegance and exclusivity. Higher values suggest premium feel, serif fonts, generous spacing, and refined visuals."
                },
                "ruggedness": {
                    "value": number, // 0-100
                    "description": "Conveys strength and robustness. High values suggest bold fonts, textured backgrounds, and strong visual contrast."
                }
                },
                "toneOfVoice": {
                    "funny_serious": {
                        "value": number, // 0-100
                        "description": "Low values use humor and playfulness; high values use a formal, authoritative tone in texts and CTAs."
                    },
                    "formal_casual": {
                        "value": number, // 0-100
                        "description": "Controls the vocabulary and sentence structure. Low = formal and structured; high = relaxed and conversational."
                    },
                    "respectful_irreverent": {
                        "value": number, // 0-100
                        "description": "Defines politeness level. Low = traditional and polite; high = informal, bold, possibly sarcastic copy."
                    },
                    "enthusiastic_matterOfFact": {
                        "value": number, // 0-100
                        "description": "Low values are objective and neutral; high values use expressive, motivational tone and dynamic CTAs."
                    }
                }
            }
        }
    },
]

Não planeje etapas nem gere código ainda—só analise.
`
    }
}


function prepareHtmlClarification(
    json: string | Object,
    taskId: string,
    stepId: number,
    clarificationMessage: string
): HTMLDivElement {
    const div: HTMLDivElement = document.createElement('div');

    if (typeof json === 'string') {
        div.innerHTML = json;
        return div;
    }

    const clarificationData: ClarificationData = {
        clarificationMessage,
        stepId: stepId,
        taskId: taskId,
        promptUser: '',
        json: json
    }

    const clariEl = document.createElement('wc-clarification-analyze-new-module1-100554');
    (clariEl as any).data = clarificationData;
    div.appendChild(clariEl);
    return div;
}

interface ClarificationData {
    json: Object,
    taskId: string,
    stepId: number,
    clarificationMessage: string,
    promptUser: string,
}