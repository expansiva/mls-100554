/// <mls shortName="agentPlannerNewWidget" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { getListFilesStart, systemReturnJsonFormat, preferModelType } from './_100554_aiPrompts';
import { icaDescriptions } from './_100554_icaBaseDescription';
import { getNextPendingStepByAgentName, getNextInProgressStepByAgentName, calculateStepsStatistics, updateStepStatus } from "./_100554_aiAgentHelper";
import { startNewAiTask, executeNextStep, postBackClarification, startNewInteractionInAiTask } from "./_100554_aiAgentOrchestration";

const agentName = "agentPlannerNewWidget";
const widgetPrefix = "wc";

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
        async afterClarification(context: mls.msg.ExecutionContext, stepId: number): Promise<void> {
            return _afterClarification(context, stepId);
        }
    }
};

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    const taskTitle = "Planning";

    if (!context || !context.message) throw new Error("Invalid context");

    if (!context.task) {
        // using temporary context, create a new task
        const inputs = await getPrompts(context.message.content, null);
        console.log('before prompt', inputs);
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
    const resultStep: mls.msg.AIPayload | undefined = step.nextSteps?.[0];
    if (!resultStep) throw new Error(`[${agentName}] afterPromt: No payload found`);
    if (resultStep.type === "result") {
        return await executeNextStep(context);
    }
    if (resultStep.type !== "clarification") throw new Error(`[${agentName}] afterPromt: No clarification step found`);

    // o tool clarification devera pegar o htlm da aba H 
    // atualizar o json , incluindo taskId e stepId
    // mostar ao usuário, apos pressionar botão,
    // a função postBackClarification irá executar afterClarification
    // a função afterClarification abaixo irá continuar o afterPromt

    console.log("afterPrompt=>", JSON.stringify(step.nextSteps, null, 2))
    // context.task = await updateStepStatus(context.task, step.stepId, "completed");
    // await executeNextStep(context);
}

const _afterClarification = async (context: mls.msg.ExecutionContext, stepId: number): Promise<void> => {
}

export async function getPrompts(prompt: string | undefined, rags: string[] | null): Promise<mls.msg.IAMessageInputType[]> {
    if (!prompt || prompt.length < 3) throw new Error("Invalid Prompt");
    const prompts: mls.msg.IAMessageInputType[] = [];

    prompts.push(systemMainInstruction());
    prompts.push(systemICAComponentsList());
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
3. Escolha o grupo/base mais adequado na lista “Categorias de widgets”.
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
        "sectionName": "widgetName",
        "description": "Nome do Widget",
        "widgetName": "[Widgetname]"
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
        "requirements": [
            "[example 1 - Must support keyboard navigation]",
            "[example 2 - Return ISO-8601 date strings]"
        ]
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

function getICADescription(): string {
    const result: string[] = [];
    Object.entries(icaDescriptions).forEach(([key, value]) => {
        result.push(
            `"${key}": {\n  "attributes": ${JSON.stringify(value.attributes)},\n  "description": "${value.description}"\n}`
        );
    });
    return result.join("/n");
}

function systemICAComponentsList(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## Componentes Disponíveis
${getICADescription()}
`
    }
}
