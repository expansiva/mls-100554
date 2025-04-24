/// <mls shortName="agentPlannerNewWidget" project="100554" enhancement="_100554_enhancementLit" groupName="other" />


import { IAgent, svg_agent } from './_100554_aiAgentBase';

import { systemComponentsInstruction } from './_100554_aiPrompts';

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

const agentName = "agentPlannerNewWidget";

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Planejador responsável por definir os detalhes de criação de um novo widget",
        visibility: "public",
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
    prompts.push(systemComponentsInstruction());
    prompts.push(systemRulesInstruction());
    prompts.push(systemRules2Instruction());
    prompts.push(systemRules3Instruction());
    prompts.push(systemRules4Instruction());
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
Você é um planejador responsável por definir os detalhes de criação de um novo componente (widget) no sistema.

Com base no prompt original do usuário, sua tarefa é:
1. Entender o propósito do widget.
2. Escolher o nome do widget.
3. Determinar o tipo do widget, usando um item do icaDescriptions.
4. Determinar o componente BASE, que será usado para estender as propriedades.
5. Especificar cada atributo adicional necessário.
6. Definir restrições e requerimentos técnicos ou funcionais.
7. Se os dados forem suficientes, preparar a chamada para o agente "agentCreateNewWidget".
8. Se faltar qualquer informação, retornar uma "clarificationMessage".
`
    }
}

function systemRulesInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## Definição do icaBase
Após identificar o icaDescription, o icaBase será definido adicionando o sufixo Base. Segue um exemplo abaixo:

    "icaDescription": "ica-forms-input-number",
    "icaBase": "icaFormsInputNumberBase",
`
    }
}

function systemRules2Instruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## Obrigatoriedade para os atributos

Os atributos informados no campo "attributes" são obrigatórios, e devem ser todos declarados explicitamente. 

Exemplos

- "ica-forms-input-number":

        attributes: ["name", "value", "placeholder", "label", "pattern", "errormessage", "maxvalue", "minvalue", "step", "required", "disabled", "readonly", "autofocus", "hint", "inputmode", "eventBinding"]

- "ica-forms-input-string":

        attributes: ["name", "hint", "label", "required", "disabled", "readonly", "maxlength", "minlength", "placeholder", "pattern", "errormessage", "autofocus", "autoCapitalize", "autocorrect", "autocomplete", "value", "validationMessage", "debounce", "eventBinding"]
`
    }
}

function systemRules3Instruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## Definições dos atributos do componente

Os campos definition e variations devem ser preenchidos conforme a configuração abaixo.

const attributeDefinitions = [
    { path: "eventBinding", lit: "@propertyDataSource() eventBinding: EventBinding | undefined;" },
    { path: "name", lit: "@property({ type: String }) name: string | undefined;" },
    { path: "hint", lit: "@property({ type: String }) hint: string | undefined;", variations: true },
    { path: "label", lit: "@property({ type: String }) label: string | undefined;", variations: true },
    { path: "required", lit: "@property({ type: Boolean }) required: boolean;" },
    { path: "disabled", lit: "@property({ type: Boolean }) disabled: boolean;" },
    { path: "maxvalue", lit: "@property({ type: Number }) maxvalue: number | undefined;" },
    { path: "minvalue", lit: "@property({ type: Number }) minvalue: number | undefined;" },
    { path: "step", lit: "@property({ type: Number }) step: number | undefined;" },
    { path: "placeholder", lit: "@property({ type: String }) placeholder: string| undefined;", variations: true },
    { path: "pattern", lit: "@property({ type: String }) pattern: string| undefined;" },
    { path: "errormessage", lit: "@property({ type: String }) errormessage: string| undefined;", variations: true },
    { path: "autofocus", lit: "@property({ type: Boolean }) autofocus: boolean;" },
    { path: "maxlength", lit: "@property({ type: Number }) maxlength: number | undefined;" },
    { path: "minlength", lit: "@property({ type: Number }) minlength: number | undefined;" },
    { path: "autoCapitalize", lit: "@property({ type: String }) autoCapitalize: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters';" },
    { path: "autocorrect", lit: "@property({ type: String }) autocorrect: 'off' | 'on';" },
    { path: "autocomplete", lit: "@property({ type: String }) autocomplete: string | undefined;" },
    { path: "validationMessage", lit: "@property({ type: String}) validationMessage: string | undefined" },
    { path: "debounce", lit: "@property({ type: Number}) debounce: number | undefined" },
    { path: "value", lit: "@property({ type: String }) value: string | undefined;", variations: true },
    { path: "options", lit: "@property() options: OptionItem[] | undefined; // Optional path in the global JSON or a valid JSON for a list of options " },
    { path: "selectedvalue", lit: "@property() selectedvalue: string | undefined;" },
    { path: "inputmode", lit: " @property({ type: String }) inputmode: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url' = 'none';" },
    { path: "title", lit: "@property({ type: String }) title: string;", variations: true },
    { path: "icon", lit: "@property({ type: String }) icon: string | undefined;" },
    { path: "form", lit: "@property({ type: String }) form: string | undefined;" },
    { path: "text", lit: "@property({ type: String }) text: string | undefined;", variations: true },
    { path: "src", lit: "@property({ type: String }) src: string | undefined;" },
    { path: "alt", lit: "@property() alt: string | undefined;", variations: true },
    { path: "width", lit: "@property() width: string | undefined;" },
    { path: "height", lit: "@property() height: string | undefined;" },
    { path: "autoplay", lit: "@property() autoplay: boolean = false;" },
    { path: "controls", lit: "@property() controls: boolean = true;" },
    { path: "loop", lit: "@property() loop: boolean = false;" },
    { path: "preload", lit: "@property() loop: 'auto' | 'metadata' | 'none' = 'auto';" },
    { path: "open", lit: "@property({ type: Boolean }) open = false;" },
    { path: "language", lit: "@property({ type: String ) language: string | undefined;" },
    { path: "languages", lit: "@property({ type: Array ) languages: string[] | undefined;" },
    { path: "framework", lit: "@property({ type: String }) framework: string | undefined;" },
    { path: "renderer", lit: "@property({ type: String }) renderer: string | undefined;" },
    { path: "readonly", lit: "@property({ type: Boolean }) readonly: boolean | undefined;" },
    { path: "clicked-action", lit: "@propertyDataSource({ type: String, attribute: 'clicked-action' }) clickedAction: string | undefined;" },
    { path: "clicked-value", lit: "@propertyDataSource({ type: String, attribute: 'clicked-value' }) clickedValue: string | undefined;" }
];


Exemplo:
[
{"name": "eventBinding", "litDefinition": "@propertyDataSource() eventBinding: EventBinding | undefined;", "variations": false},
{"name": "hint", "litDefinition": "@property({ type: String }) hint: string | undefined;", "variations": true},
]
`
    }
}

function systemRules4Instruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## Regras adicionais:
- O Nome do widget deve ser no formato wcXxx , onde ‘wc’ é o prefixo obrigatório.
- Se o tipo do widget estiver ambíguo, retorne uma clarificationMessage solicitando mais detalhes ao usuário.
- O campo requirements, deve conter o máximo de informações possíveis, recebidos pelo prompt do usuário
`
    }
}

function systemOutInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## Formato de saida
Você deve retornar **apenas um dos seguintes formatos** no array JSON:

json
[
  {
    "agentName": "agentCreateNewWidget",
    "taskTitle": string,
    "prompt": string,
    "widgetName": string,
    "icaDescription": string,
    "icaBase": string,
    "loadContext": false,
    "rags": null,
    "requirements": string,
    "attributes": [{"name": string, "litDefinition": string, "variations": boolean}]
  },
  {
    "clarificationMessage": string
  }
]
`
    }
}