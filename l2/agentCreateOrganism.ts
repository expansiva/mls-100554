/// <mls shortName="agentCreateOrganism" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { preferModelType, systemTokensLessInstruction } from './_100554_aiPrompts';
import { getNextPendingStepByAgentName, getNextInProgressStepByAgentName, updateStepStatus, getNextPendentStep, getAgentsStepByAgentName, getNextStepIdAvaliable } from "./_100554_aiAgentHelper";
import { startNewInteractionInAiTask, executeNextStep, addNewStep } from "./_100554_aiAgentOrchestration";
import { convertTagToFileName } from "./_100554_utilsLit";
import { forceServiceInstance } from './_100554_libCommom';
import { createNewFile } from "./_100554_pluginNewFileBase";

const agentName = "agentCreateOrganism";
const enhancement = '_100554_enhancementLit';

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Responsavel por criado arquivos tipo organismo e templates",
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

    if (!context || !context.message) throw new Error("Invalid context");
    if (!context.task) throw new Error("Invalid task");

    const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
    context.task = await updateStepStatus(context.task, step.stepId, "in_progress");
    const inputs = await getPrompts(step.prompt, step.rags);
    await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);

}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {

    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No pending interaction found.`);
    context.task = await updateStepStatus(context.task, step.stepId, "completed");
    await createMoleculesAndTemplates(context);
    await executeNextStep(context);

}

async function createMoleculesAndTemplates(context: mls.msg.ExecutionContext) {
    if (!context || !context.task) throw new Error(`[${agentName}] Not found context on execPrepareMolecules`);
    const step = getNextPendentStep(context.task) as any;
    if (!step || step.type !== 'flexible') throw new Error(`[${agentName}] Invalid next pendent step on execPrepareMolecules`);
    if (!step.content) throw new Error(`[${agentName}] Not found "content" in flexible result`);
    console.info({ widgetsToCreate: step.content });
    await createMoleculesAndTemplates2(step.content);
    execPrepareTokensLess(context);
}

async function execPrepareTokensLess(context: mls.msg.ExecutionContext) {

    if (!context || !context.task) throw new Error(`[${agentName}] Not found context on execPrepareTokensLess`);

    const step = getNextPendentStep(context.task);
    if (!step) throw new Error(`[${agentName}] Not found nextPendentStep on execPrepareMolecules`);

    const allStepsTasksComplete = getAgentsStepByAgentName(context.task, 'agentAnalyzeNewModule1', 'completed');
    const lastStep = allStepsTasksComplete.pop();
    if (!lastStep || !lastStep.interaction || !lastStep.interaction.payload) throw new Error(`[${agentName}] Not found lastStep completed with agent: agentAnalyzeNewModule1`);
    const json = ((lastStep.interaction.payload[0] as mls.msg.AIClarificationStep).json) as any;

    const newStep: mls.msg.AIPayload = {
        agentName: 'agentCreateTokens',
        prompt: JSON.stringify({
            goal: json.goal || '',
            pageFormat: json.pageFormat || '',
            websiteType: json.websiteType || '',
            stylePreferences: json.stylePreferences || {},
        }),
        status: 'pending',
        stepId: getNextStepIdAvaliable(context.task),
        interaction: null,
        nextSteps: null,
        rags: null,
        type: 'agent'
    }

    await addNewStep(context, step.stepId, [newStep]);

}

async function createMoleculesAndTemplates2(widgetsToCreate: ITemplateOrOrganismData[]) {

    await forceServiceInstance(2, '_100554_serviceSource');
    for (const widget of widgetsToCreate) {
        if (!('less' in widget) || !('tagName' in widget)) continue;
        if (widget.tagName.startsWith('template')) createTemplateOrOrganismWidget(widget, 'template');
        else if (widget.tagName.startsWith('organism')) createTemplateOrOrganismWidget(widget, 'organism');
    }
}

async function createTemplateOrOrganismWidget(widgetData: ITemplateOrOrganismData, model: 'template' | 'organism') {

    const modeExtends = {
        'template': 'IcaTemplateBase',
        'organism': 'IcaOrganismBase',
    }

    const imports = {
        'template': `import { IcaTemplateBase } from './_100554_icaTemplateBase';`,
        'organism': `import { IcaOrganismBase } from './_100554_icaOrganismBase';`,
    }

    const fileName = convertTagToFileName(widgetData.tagName);
    const { project, shortName } = mls.l2.getPath(fileName);
    const ts = `
/// <mls shortName="${shortName}" project="${project}" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
${imports[model]}

@customElement('${widgetData.tagName}')
export class ${fileName} extends ${modeExtends[model]} {

    render() {
        return html\`\`
    }

}`;

    console.info({
        createFile: {
            fileName,
            ts,
            less: widgetData.less
        }
    });

    await createNewFile(
        { project, position: 'right', shortName, enhancement, sourceTS: ts.trim(), sourceHTML: `<${widgetData.tagName}></${widgetData.tagName}>`, sourceLess: widgetData.less, openPreview: false }
    );
}


async function getPrompts(prompt: string | undefined, rags: string[] | null): Promise<mls.msg.IAMessageInputType[]> {
    if (!prompt || prompt.length < 3) throw new Error("Invalid Prompt");
    const prompts: mls.msg.IAMessageInputType[] = [];
    prompts.push(systemMainInstruction());
    prompts.push(await systemTokensLessInstruction())
    prompts.push(outputFormat());

    prompts.push({
        type: 'human',
        content: `## Definições dos widgets: \n\n ${prompt}`
    });

    return prompts;
}

function systemMainInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `${preferModelType("code")}
Você é um programador responsável pela criação do less de um web componente para o sistema Collab Codes.

## Requirements do Collab Codes:
1. Inclua o código LESS, onde o primeiro nível é a tag HTML do componente.
2. Analise cuidadosamente as seções fornecidas abaixo:
   - "Definições do componente"
   - "Formato de saida"
   - "LESS tokens- Design System"


## Definições do componente
 - Analisar a descrição de cada componente e gerar um less correspondente, usando as classe definidas.

`
    }

}

function outputFormat(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `
## Formato de saida
Você deve retornar um objetos no formato JSON. **no seguinte formato**:
- Para cada componente, gerar um objeto no array content
- Manter o tagName o mesmo valor do name
\`\`\` json
{{
    "type": "flexible",
    "content": [{ less: string, tagName:string }]
  },
 }
\`\`\`

`}
}


interface ITemplateOrOrganismData {
    less: string,
    tagName: string
}