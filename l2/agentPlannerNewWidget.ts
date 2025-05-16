/// <mls shortName="agentPlannerNewWidget" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { getListFilesStart, systemReturnJsonFormat, preferModelType, systemComponentsInstruction } from './_100554_aiPrompts';
import { icaDescriptions } from './_100554_icaBaseDescription';
import { getNextPendingStepByAgentName, getNextInProgressStepByAgentName, getStepById, updateStepStatus, notifyTaskChange, calculateStepsStatistics, getInteractionStepId,  } from "./_100554_aiAgentHelper";
import { startNewAiTask, executeNextStep, startNewInteractionInAiTask, addNewStep } from "./_100554_aiAgentOrchestration";

import './_100554_wcClarificationPlannerNewWidget';

const agentName = "agentPlannerNewWidget";
const widgetPrefix = "widget";

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "criação de novos componentes UI, web components, widgets, estes widgets podem futuramente serem incluidos em uma página html",
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

const _beforeClarification = async (context: mls.msg.ExecutionContext, stepId: number): Promise<HTMLDivElement | null> => {

    if (!context.task) throw new Error("[_beforeClarification] Invalid context.task");
    const step = getStepById(context.task, stepId) as mls.msg.AIClarificationStep;
    if (!step) throw new Error(`[_beforeClarification] Invalid step: ${stepId} on task: ${context.task.PK}`);
    if (!step.json) throw new Error(`[_beforeClarification] Invalid step json on task: ${context.task.PK} step ${stepId}`);
    const element = prepareHtmlClarification(step.json, context.task.PK, stepId, step.clarificationMessage);
    return element;

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

    const rc = {
        prompt: promptUser,
        json: data.json
    }

    const newStep: mls.msg.AIPayload = {
        agentName: 'agentNewWidget',
        prompt: JSON.stringify(rc),
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
    if (!prompt || prompt.length < 3) throw new Error("Invalid Prompt");
    const prompts: mls.msg.IAMessageInputType[] = [];

    prompts.push(systemMainInstruction());
    prompts.push(systemComponentsInstruction());
    prompts.push(await systemWidgetsPrompt());
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
Você é um planejador responsável por definir os detalhes de criação de um novo web-componente (widget) que será incluído em uma página HTML.

Tarefas
1. Entenda o propósito do widget passando pelo prompt original do usuário.
2. Escolha o widgetName, evitando colisões com a lista “Widgets existentes”, o widgetName deve iniciar com o prefixo "${widgetPrefix}".
3. Escolha o parentClass base mais adequado na lista “Categorias de widgets”.
4. Cruze os atributos do grupo escolhido com as necessidades do widget:
   • Liste apenas os atributos relevantes que já existirem no grupo.  
   • Para cada necessidade sem atributo correspondente, gere um novo atributo
     e adicione “(essencial)” na descrição.
5. Defina restrições e requisitos técnicos/funcionais.
6. Se o prompt original não tratar da criação de web-componente, retorne um erro pedindo ao usuário refazer o pedido.
7. Caso contrário, devolva um bloco **clarification** com o json base abaixo, usando textos na linguagem do usuário.

## Formato de saida
Você deve retornar um array de objetos no formato JSON. Cada objeto representa uma subtarefa, com **apenas um dos seguintes formatos**:

\`\`\` json
[
  {
    "type": "clarification",
    "clarificationMessage": string,
    "json": TClarification
  },
  {
    "type": "result",
    "result": string
  }
]
\`\`\`

definição de TClarification
\`\`\`json
[
    {
        "sectionName": "resume",
        "description": "[Breve descrição do widget]"
    },
    {
        "sectionName": "parentClass",
        "description": "Component for selecting date ranges, useful for period filters."
        "widgetName": "IcaFormsInputDateRangeBase"
    },
    {
        "sectionName": "widgetName",
        "description": "Nome do Widget",
        "widgetName": "[WidgetName ex: wcDatePickerRangeCustom]"
        "tagName": "[WidgetTagName ex: wc-date-picker-range-custom-100554]"
    },
    {
        "sectionName": "properties",
        "description": "Propriedades do widget",
        "properties": [
            { "propertyName": "[propertyName]", "description": "[description]", "isEssencial": "true|false" }
        ]
    },
    {
        "sectionName": "requirements",
        "description": "requisitos para este widget, altere se necessário",
        "functionalRequirements": [
            "[example 1 - Must support keyboard navigation]",
            "[example 2 - Return ISO-8601 date strings]"
        ],
        "visualRequirements": [
            "[example 1 - Must render two consecutive months side by side]",
            "[example 2 - Must clearly differentiate between selected, hovered, and disabled dates]"
        ],
    }
]
\`\`\`
`
    }
}

async function getWidgetList(): Promise<string> {
    const widgets = await getListFilesStart(widgetPrefix);
    return widgets.join('\n');
}

async function systemWidgetsPrompt(): Promise<mls.msg.IAMessageInputType> {
    return {
        type: 'system',
        content: "## Widgets existentes\n" + await getWidgetList()
    }
}

function prepareHtmlClarification(
    json: string | ClarificationJson[],
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
        json: json as ClarificationJson[]
    }

    const clariEl = document.createElement('wc-clarification-planner-new-widget-100554');
    (clariEl as any).data = clarificationData;
    div.appendChild(clariEl);
    return div;
}



interface ClarificationData {
    json: ClarificationJson[],
    taskId: string,
    stepId: number,
    clarificationMessage: string
}

type ClarificationJson = ClarificationResume | ClarificationWidgetName | ClarificationParentName | ClarificationProperties | ClarificationRequirements;

interface ClarificationBase {
    sectionName: string;
    description: string;
}

interface ClarificationResume extends ClarificationBase {
}

interface ClarificationWidgetName extends ClarificationBase {
    widgetName: string;
    tagName: string;
}

interface ClarificationParentName extends ClarificationBase {
    widgetName: string;
}

interface ClarificationProperties extends ClarificationBase {
    properties: {
        propertyName: string;
        description: string;
        isEssencial: string;
    }[];
}

interface ClarificationRequirements extends ClarificationBase {
    functionalRequirements: string[];
    visualRequirements?: string[];
}
