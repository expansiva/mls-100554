/// <mls shortName="aiAgentOrchestration" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import {
    argsValidator,
    calculateStepsByFilter,
    updateStepStatus,
    calculateStepsStatistics,
    getInteractionStepId,
    getNextPendentStep,
    safeParseArgs,
    appendPromptToInteraction,
    appendLongTermMemory,
    getStepById,
    notifyTaskChange,
    dispatchDetailsTaskClose,
    updateTaskTitle,
    getNextStepIdAvaliable,
} from "./_100554_aiAgentHelper";

import { getTask, getMessage } from "./_100554_msgDBController";
import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { getUserId } from "./_100554_collabMessageHelper";
import { loadModuleFromProjectOrDependency} from './_100554_libCommom';

export async function startNewAiTask(
    agentName: string,
    taskTitle: string,
    userMessage: string,
    threadId: string,
    userId: string,
    inputAI: mls.msg.IAMessageInputType[],
    context: mls.msg.ExecutionContext,
    afterPrompt: (context: mls.msg.ExecutionContext) => Promise<void>,
    longTermMemory?: Record<string, string>

): Promise<void> {
    try {
        const args: mls.msg.RequestAddMessageAI = {
            action: "addMessageAI",
            threadId,
            userId,
            taskTitle,
            userMessage,
            agentName,
            inputAI,
        };

        const oldContextCreateAt = context.message.createAt;
        const value = await mls.api.msgAddMessageAI(args);
        if (!value) throw new Error("Error on return addMessageAI, no return");
        if (value.statusCode !== 200) throw new Error("Error on addMessageAI: " + (value.msg || ''));

        const ret = value as mls.msg.ResponseAddMessageAI;
        context.task = ret.task;
        if (context.task.iaCompressed) {
            context.task.iaCompressed.modeSingleStep = context.modeSingleStep;
        }
        context.message = ret.message;
        notifyTaskChange(context, oldContextCreateAt);

        if ((mls as any).istraceAgent) console.log(JSON.stringify(context, null, 2));
        if (longTermMemory) await appendLongTermMemory(context, longTermMemory);
        await afterPrompt(context);

    } catch (error: any) {
        if (context && context.task && 1) {
            const msg = 'Error: ' + error.message || 'addNewStep ';
            context.task = await updateTaskTitle(context.task, msg.substring(0, 100));
            await setFailedStatus(context, 1);
            const step = getNextPendentStep(context.task);
            if (step) setFailedStatus(context, step.stepId);
        }
        throw new Error(`[startNewAiTask] ${error.message || error}`);
    }
}

type AfterPrompt = (context: mls.msg.ExecutionContext) => Promise<void>;

export async function startNewInteractionInAiTask(agentName: string, taskTitle: string, inputAI: mls.msg.IAMessageInputType[], context: mls.msg.ExecutionContext, afterPrompt: AfterPrompt, stepFather: number): Promise<void> {
    try {
        if (!context || !context.message || !context.task) throw new Error("Invalid context");
        if (!agentName) throw new Error("addNewInteractionInAiTask: agentName is null");
        if (!context.task.messageid_created) throw new Error("addNewInteractionInAiTask: context.task.messageid_created is null");
        const args: mls.msg.RequestAddTaskAIInteraction = {
            action: "addTaskAIInteraction",
            userId: getUserId() || context.task.owner,
            messageId: context.task.messageid_created,
            taskId: context.task.PK,
            parentStepId: stepFather,
            inputAI
        }

        const value = await mls.api.msgAddTaskAIInteraction(args);

        if (!value) {
            throw new Error("Error on return addTaskAIInteraction, no return");
        }
        if (value.statusCode !== 200) {
            throw new Error("Error on addTaskAIInteraction: " + (value.msg || ''));
        }

        const ret = value as mls.msg.ResponseAddTaskAIInteraction
        context.task = ret.task;
        if (context.task.iaCompressed) {
            context.task.iaCompressed.modeSingleStep = context.modeSingleStep;
        }
        notifyTaskChange(context);

        if ((mls as any).istraceAgent) console.log(JSON.stringify(context, null, 2));
        await afterPrompt(context);
    }
    catch (error: any) {
        if (context && context.task && stepFather) {
            const msg = 'Error: ' + error.message || 'startNewInteractionInAiTask ';
            context.task = await updateTaskTitle(context.task, msg.substring(0, 100));
            await setFailedStatus(context, stepFather);
            const step = getNextPendentStep(context.task);
            if (step) setFailedStatus(context, step.stepId);
        }
        console.error(`[startNewInteractionInAiTask] ${error.message || error}`);
    }
}

export async function addNewStep(context: mls.msg.ExecutionContext, parentStepId: number, steps: mls.msg.AIPayload[], newTaskTitle = "Pending") {

    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    if (!context.task.messageid_created) throw new Error("addNewInteractionInAiTask: context.task.messageid_created is null");

    try {

        const response = await mls.api.msgAddTaskAISteps({
            userId: getUserId() || context.message.senderId,
            parentStepId,
            steps,
            taskId: context.task.PK,
            messageId: context.task.messageid_created,
            newStatus: 'completed',
            newTaskTitle,
            stepdIdToChangeStatus: parentStepId,
            traceMsg: 'adding new step'
        });

        context.task = response.task;
        // context.task = await updateStepStatus(context.task, parentStep, "completed");
        notifyTaskChange(context);
        executeNextStep(context);

    } catch (error: any) {
        if (context && context.task && parentStepId) {
            const msg = 'Error: ' + error.message || 'addNewStep ';
            context.task = await updateTaskTitle(context.task, msg.substring(0, 100));
            setFailedStatus(context, parentStepId);
        }
        console.error(`[startNewInteractionInAiTask] ${error.message || error}`);
    }

}

const maxCostByTask = 1.01; // 1.01 USD
const maxStepsByTask = 100;

export async function executeNextStep(context: mls.msg.ExecutionContext): Promise<void> {
    if (!context || !context.message || !context.task || !context.task.iaCompressed) throw new Error("Invalid context");
    if (context.task.status === "paused" || context.task.status === "done" || context.modeSingleStep === true) return;
    const step = getNextPendentStep(context.task);
    if (!step) {
        console.error("finished all steps");
        return;
    }

    const { totalCost, totalSteps } = calculateStepsStatistics(context.task.iaCompressed.nextSteps, false);
    if (totalCost > maxCostByTask) {
        console.error("max cost reached");
        return;
    }
    if (totalSteps > maxStepsByTask) {
        console.error("max steps reached");
        return;
    }

    switch (step.type) {
        case "agent": return executeNextAgent(context, step);

        case "tool":
            const st: mls.msg.AIToolStep = step;
            const totalSimilarTools = calculateStepsByFilter(context.task, { toolName: st.toolName, args: st.args })
            if (totalSimilarTools > 1) {
                console.error("max similar tools reached");
                return;
            }
            return executeNextTool(context, step);

        case "clarification": return executeNextClarification(context, step);

        case "result": return executeNextResult(context, step);

        case "flexible": return executeNextFlexible(context, step);

        default:
            throw new Error(`Unknown step type: ${(step as { type: string }).type}`);
    }
}

export interface IExecuteToolReturn {
    status: boolean;
    error: string;
    result: any;
}

async function executeNextTool(context: mls.msg.ExecutionContext, step: mls.msg.AIToolStep) {

    if (!context || !context.task) throw new Error("Invalid context");

    const rc: IExecuteToolReturn = await executeTool(step.toolName, step.args);

    if (rc.status !== true) {
        const traceMsg = `Error executing tool ${step.toolName}: ${rc.error}`;
        console.error(traceMsg);
        context = await updateStepStatus(context, step.stepId, "failed", traceMsg);

        if ((mls as any).istraceAgent) console.log(JSON.stringify(context.task, null, 2));
        return;
    }

    if (typeof rc.result !== "string") throw new Error(`Tool ${step.toolName} did not return a string`);
    const existResults = rc.result.length > 0;
    if (existResults) {

        const interactionStepId = getInteractionStepId(context.task, step.stepId);
        if (!interactionStepId) throw new Error(`[executeNextTool] Interaction step not found for stepId ${step.stepId}`);

        const stepdIdToChangeStatus = step.stepId;
        if (!interactionStepId) throw new Error(`[executeNextTool] Interaction step not found for stepId ${step.stepId}`);
        const stepInteraction = getStepById(context.task, interactionStepId);
        if (!stepInteraction || stepInteraction.type !== 'agent') throw new Error('Interaction must be type: agent');
        const oldPrompt = stepInteraction.interaction?.input.find((item) => item.type === 'human');

        const newStep: mls.msg.AIPayload = {
            type: 'agent',
            agentName: stepInteraction.agentName,
            prompt: `${oldPrompt?.content} \n\n Response from tool ${step.toolName}: ${rc.result}`,
            status: 'pending',
            stepId: getNextStepIdAvaliable(context.task),
            interaction: null,
            nextSteps: null,
            rags: null
        }

        if ((mls as any).istraceAgent) console.log(JSON.stringify(context.task, null, 2));
        return await addNewStep(context, stepdIdToChangeStatus, [newStep]);

    }

    return executeNextStep(context);
}

export async function executeTool(toolName: string, args: string): Promise<IExecuteToolReturn> {
    const rc: IExecuteToolReturn = {
        status: false,
        error: "",
        result: []
    };
    if (!toolName) {
        rc.error = "Tool name is missing";
        return rc;
    };
    try {
        /*//const fileJS = `./${toolName}.js`;
        const fileJS = `./_100554_${toolName}`;
        const module = await import(fileJS);
        if (typeof module.createTool !== "function") throw new Error(`createTool function not found in ${fileJS}`);
        const tool = module.createTool();*/
        const tool = await loadTool(toolName);
        if (!args) {
            // no args provided
            argsValidator({}, tool.argsSchema);
            rc.result = await tool.execute();
        } else {
            const parsedArgs = safeParseArgs(args);
            argsValidator(parsedArgs, tool.argsSchema);
            rc.result = await tool.execute(parsedArgs);
        }
        rc.status = true;
    } catch (error: any) {
        console.error(`[executeTool] ${error.message || error}`);
        rc.error = error.message || error;
    }
    return rc;
}

async function executeNextAgent(context: mls.msg.ExecutionContext, step: mls.msg.AIAgentStep) {
    if (!context || !context.task) throw new Error("Invalid context");
    if (!step.agentName) throw new Error("Agent name is missing");

    try {
        const agent = await loadAgent(step.agentName);
        if (!agent) throw new Error(`createAgent function not found in ${mls.actualProject} ${step.agentName}`);
        await agent.beforePrompt(context);
    } catch (error: any) {
        const msg = 'Error: ' + error.message || 'beforePrompt ' + step.agentName;
        context.task = await updateTaskTitle(context.task, msg.substring(0, 100));
        setFailedStatus(context, step.stepId);
        console.error(`[executeNextAgent] ${error.message || error}`);
    }
}

export async function loadAgent( shortName: string): Promise<IAgent | undefined> {

    try {
        const module = await loadModuleFromProjectOrDependency(shortName, '', '.ts');
        if (typeof module.createAgent !== "function") throw new Error(`createAgent function not found in ${shortName}`);
        const agent = module.createAgent();
        if (typeof agent.beforePrompt !== "function") throw new Error(`beforePrompt function not found in ${shortName}`);
        if (typeof agent.afterPrompt !== "function") throw new Error(`afterPrompt function not found in ${shortName}`);
        return agent;
    } catch (error: any) {
        console.error(`[loadAgent] ${error.message || error}`);
        return undefined;
    }

}

export async function loadTool( shortName: string): Promise<any | undefined> {

    try {
        const module = await loadModuleFromProjectOrDependency(shortName, '', '.ts');
        if (typeof module.createTool !== "function") throw new Error(`createTool function not found in ${shortName}`);
        const tool = module.createTool();
        return tool;
    } catch (error: any) {
        console.error(`[loadTool] ${error.message || error}`);
        return undefined;
    }

}

async function executeAgentFunction(context: mls.msg.ExecutionContext, step: mls.msg.AIAgentStep, functionName: string, stepId: number, args?: object): Promise<any> {
    if (!context || !context.task) throw new Error("[executeAgentFunction] Invalid context");
    if (!step.agentName) throw new Error("[executeAgentFunction] Agent name is missing");

    try {
        /*//const fileJS = `./${step.agentName}.js`;
        const fileJS = `./_100554_${step.agentName}`;
        const module = await import(fileJS);
        if (typeof module.createAgent !== "function") throw new Error(`[executeAgentFunction] createAgent function not found in ${fileJS}`);
        const agent = module.createAgent();*/
        const agent = await loadAgent(step.agentName) as any;
        if (typeof agent[functionName] !== "function") throw new Error(`[executeAgentFunction] ${functionName} function not found in ${step.agentName}`);
        return await agent[functionName](context, stepId, args);
    } catch (error: any) {
        console.error(`[executeAgentFunction] ${error.message || error}`);
    }
}

async function executeNextResult(context: mls.msg.ExecutionContext, step: mls.msg.AIResultStep) {
    if (!context || !context.task) throw new Error("Invalid context");
    if ((mls as any).istraceAgent) console.log("result:", step.result);
    context = await updateStepStatus(context, step.stepId, "completed");
    notifyTaskChange(context);
    return executeNextStep(context);
}

async function executeNextFlexible(context: mls.msg.ExecutionContext, step: mls.msg.AIFlexibleResultStep) {
    if (!context || !context.task) throw new Error("Invalid context");

    if ((mls as any).istraceAgent) console.log("Flexible:", step.result);
    context = await updateStepStatus(context, step.stepId, "completed");

    notifyTaskChange(context);
    return executeNextStep(context);

}

async function executeNextClarification(context: mls.msg.ExecutionContext, step: mls.msg.AIClarificationStep) {
    if (!context || !context.task) throw new Error("Invalid context");
    // if (!step.clarificationMessage) throw new Error("clarification message is missing");
    // notifyTaskChange(context);
    // if ((mls as any).istraceAgent) console.log("clarification:", step.clarificationMessage);
    // context.task = await updateStepStatus(context.task, step.stepId, "waiting_for_user");

}

export async function getAgentContext(taskId: string): Promise<{
    context: mls.msg.ExecutionContext,
    interaction: mls.msg.AIAgentStep,
    step: mls.msg.AIPayload
}> {
    const task: mls.msg.TaskData | undefined = await getTask(taskId);
    if (!task || !task.messageid_created) throw new Error("[getAgentContext] Invalid taskId" + taskId);
    const step = getNextPendentStep(task);
    if (!step) throw new Error("[getAgentContext] No pending step")
    if (step.type !== "clarification" && step.type !== "tool") throw new Error("[getAgentContext] No pending clarification or tool step");
    const interactionId: number | null = getInteractionStepId(task, step.stepId);
    if (!interactionId) throw new Error("[getAgentContext] Not found interactionId in pending step")
    const interaction: mls.msg.AIPayload | null = getStepById(task, interactionId);
    if (!interaction || interaction.type !== "agent") throw new Error("[getAgentContext] Clarification or tool step not bellow a agent");
    //const messageId: string = task.messageid_created.split("/")[1].trim();
    // const parts = task.messageid_created.split("/");
    // const messageId: string = `${parts[1].trim()}[${parts[0].trim()}]`;
    const messageId: string = task.messageid_created;

    const message: mls.msg.Message | undefined = await getMessage(messageId);
    if (!message) throw new Error("[getAgentContext] Message not found:" + messageId)
    const context: mls.msg.ExecutionContext = {
        message,
        task,
        modeSingleStep: task.iaCompressed?.modeSingleStep || undefined
    }
    return { context, interaction, step };
}

export async function getClarification(taskId: string): Promise<HTMLDivElement | null> {
    const ret = await getAgentContext(taskId);
    if (ret.step.type !== "clarification") throw new Error("[getClarification] Clarification step not not found");
    return await executeAgentFunction(ret.context, ret.interaction, "beforeClarification", ret.step.stepId);
}

export async function postBackClarification(
    action: "continue" | "cancel",
    clarification: object
) {
    if (typeof clarification !== "object" ||
        !clarification) throw new Error("[postBackClarification] Invalid call arguments");

    function findTaskId(obj: any): string | null {
        if (typeof obj !== "object" || obj === null) return null;
        if ("taskId" in obj && typeof obj.taskId === "string") return obj.taskId;

        for (const key in obj) {
            const result = findTaskId(obj[key]);
            if (result) return result;
        }

        return null;
    }

    const taskId: string | null = findTaskId(clarification);
    if (!taskId) throw new Error("[postBackClarification] Invalid call arguments, no taskId");
    const ret = await getAgentContext(taskId);

    if (action === "cancel") {

        const messageId: string | undefined = ret.context.task?.messageid_created;
        if (!messageId) throw new Error("[postBackClarification] Invalid messageId");

        const resp = await mls.api.msgUpdateStepStatus({
            messageId,
            status: "failed",
            stepId: ret.step.stepId,
            taskId,
            userId: getUserId() || ret.context.message.senderId,
            traceMsg: "user cancel the task"
        });

        ret.context.task = resp.task;
        await notifyTaskChange(ret.context);

        dispatchDetailsTaskClose();
        return;
    }
    if (ret.step.type !== "clarification") throw new Error("[getClarification] Clarification step not not found");
    dispatchDetailsTaskClose();
    return await executeAgentFunction(ret.context, ret.interaction, "afterClarification", ret.step.stepId, clarification);

}

export async function startClarification(context: mls.msg.ExecutionContext, stepId: number, modeReadOnly?: boolean): Promise<HTMLDivElement | null> {
    // called after agent . beforeClarification

    if (!context.task) throw new Error("[startClarification] Invalid context.task");

    const step = getStepById(context.task, stepId) as mls.msg.AIClarificationStep;
    if (!step || step.type !== "clarification") throw new Error(`[startClarification] Invalid step: ${stepId} on task: ${context.task.PK}`);
    let clarification: ClarificationValue;
    try {
        let ret: any = step.json;
        if (typeof step.json === "string") ret = JSON.parse(step.json || '') as any;
        clarification = {
            taskId: context.task.PK,
            stepId,
            title: ret.title,
            legends: ret.legends || [],
            userLanguage: ret.userLanguage || '',
            questions: ret.questions
        }
    }
    catch (e) {
        console.error(e);
        throw new Error(`[startClarification] Invalid step: ${stepId} on task: ${context.task.PK}, json clarification invalid`);
    }

    const div: HTMLDivElement = document.createElement('div');
    const clariEl = document.createElement('widget-questions-for-clarification-100554');
    (clariEl as any).value = clarification;
    if (modeReadOnly === true) clariEl.setAttribute("readonly", "true")
    div.appendChild(clariEl);
    return div;
}

export async function endClarification(clarification: ClarificationValue, action: "continue" | "cancel"): Promise<void> {
    // called after press button cancel or continue on clarification
    // call agent afterClarification

    const taskId: string | null = clarification.taskId || '';
    if (!taskId) throw new Error("[startClarification] Invalid call arguments, no taskId");
    const ret = await getAgentContext(taskId);
    if (ret.step.type !== "clarification") throw new Error("[getClarification] Clarification step not not found");

    dispatchDetailsTaskClose();
    if (action === "continue") {
        await executeAgentFunction(ret.context, ret.interaction, "afterClarification", clarification.stepId, clarification);
        return;
    }

    // cancel the task
    const messageId: string | undefined = ret.context.task?.messageid_created;
    if (!messageId) throw new Error("[postBackClarification] Invalid messageId");
    const resp = await mls.api.msgUpdateStepStatus({
        messageId,
        status: "failed",
        stepId: ret.step.stepId,
        taskId,
        userId: getUserId() || ret.context.message.senderId,
        traceMsg: "user cancel the task",
        newTaskStatus: 'failed',
        newTaskTitle: "User canceled task"
    });
    ret.context.task = resp.task;
    notifyTaskChange(ret.context);
}

export function toLLMClarification(value: ClarificationValue) {
    // remove unnecessary values
    return {
        title: value.title,
        userLanguage: value.userLanguage,
        questions: Object.fromEntries(
            Object.entries(value.questions).map(([key, q]) => [
                key,
                {
                    type: q.type,
                    question: q.question,
                    answer: q.answer
                }
            ])
        )
    };
}

async function setFailedStatus(context: mls.msg.ExecutionContext, step: number) {
    if (!context.task) throw new Error("[setFailedStatus] Invalid context task");
    context = await updateStepStatus(context, step, "failed");
    notifyTaskChange(context);
}

// Types for the JSON structure
export interface ClarificationValue {
    taskId: string;
    stepId: number;
    title: string;
    userLanguage: string;
    questions: ClarificationQuestions;
    legends: string[];
}

export interface ClarificationQuestions {
    [key: string]: Question;
}

export interface Question {
    type: 'open' | 'select' | 'boolean' | 'MoSCoW' | 'range';
    question: string;
    answer?: string | boolean;
    options?: QuestionOption[];
}

export interface QuestionOption {
    id: string;
    label: string;
}
