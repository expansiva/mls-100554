/// <mls shortName="agentNewWidget" project="100554" enhancement="_blank" groupName="other" />

import { IAgent, svg_agent } from '/_100554_/l2/aiAgentBase.js';
import { getListFilesStart, systemReturnJsonFormat, preferModelType, systemComponentsInstruction, getPromptByHtml } from '/_100554_/l2/aiPrompts.js';
import { getNextPendingStepByAgentName, getNextInProgressStepByAgentName, getStepById, updateStepStatus, notifyTaskChange, calculateStepsStatistics, getInteractionStepId, } from "/_100554_/l2/aiAgentHelper.js";
import { startNewAiTask, executeNextStep, startNewInteractionInAiTask, addNewStep } from "/_100554_/l2/aiAgentOrchestration.js";
import { initState } from '/_100554_/l2/collabState.js';

import '/_100554_/l2/widgetClarificationNewWidget.js';

const agentName = "agentNewWidget";
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
        async beforeClarification(context: mls.msg.ExecutionContext, stepId: number): Promise<HTMLDivElement | null> {
            return _beforeClarification(context, stepId);
        },
        async afterClarification(context: mls.msg.ExecutionContext, stepId: number, data: object): Promise<void> {
            return _afterClarification(context, stepId, data as ClarificationData);
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
        context = await updateStepStatus(context, step.stepId, "in_progress");
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
    context = await updateStepStatus(context, step.stepId, "completed");
    await executeNextStep(context);

}

const _beforeClarification = async (context: mls.msg.ExecutionContext, stepId: number): Promise<HTMLDivElement | null> => {

    if (!context.task) throw new Error("[_beforeClarification] Invalid context.task");
    const step = getStepById(context.task, stepId) as mls.msg.AIClarificationStep;
    if (!step) throw new Error(`[_beforeClarification] Invalid step: ${stepId} on task: ${context.task.PK}`);
    
    const element = prepareHtmlClarification(step.json, context.task.PK, stepId, '');
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
        agentName: 'agentNewWidget2',
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


    const comp = systemComponentsInstruction();
    const data = {
        mode: preferModelType("translate"),
        widgetPrefix: widgetPrefix,
        componentDef: comp.content,
        widgets: await getWidgetsPrompt(),
        humanPrompt: prompt
    }

    const prompts = await getPromptByHtml({ project: 100554, shortName: 'agentNewWidget', folder: '', data });

    return prompts;
}

async function getWidgetsPrompt(): Promise<string> {
    return "## Widgets existentes\n" + await getWidgetList()
}

async function getWidgetList(): Promise<string> {
    const widgets = await getListFilesStart(widgetPrefix);
    return widgets.join('\n');
}

function prepareHtmlClarification(
    json: string | ClarificationJson[] | undefined,
    taskId: string,
    stepId: number,
    clarificationMessage: string
): HTMLDivElement {
    const div: HTMLDivElement = document.createElement('div');

    const clarificationData: ClarificationData = {
        clarificationMessage,
        stepId: stepId,
        taskId: taskId,
        json: json as ClarificationJson[]
    }

    const clariEl = document.createElement('widget-clarification-new-widget-100554');
    if (json && typeof json === 'object') (clariEl as any).data = clarificationData;
    else clariEl.setAttribute('error', 'Invalid clarification return');
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
