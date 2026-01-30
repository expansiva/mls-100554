/// <mls shortName="aiAgentOrchestration" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import {
    calculateStepsByFilter,
    updateStepStatus,
    calculateStepsStatistics,
    getInteractionStepId,
    getNextPendentStep,
    appendLongTermMemory,
    getStepById,
    notifyTaskChange,
    dispatchDetailsTaskClose,
    updateTaskTitle,
    getNextStepIdAvaliable
} from "/_100554_/l2/aiAgentHelper.js";

import { collabImport } from '/_100554_/l2/collabImport.js';
import { getTask, getMessage, addOrUpdateTask, addPooling, deletePooling } from '/_102025_/l2/collabMessagesIndexedDB.js';
import { IAgent, IAgentAsync } from '/_100554_/l2/aiAgentBase.js';
import { getUserId } from '/_102025_/l2/collabMessagesHelper.js';
import { loadModuleFromProjectOrDependency } from '/_100554_/l2/libCommom.js';

const agentName = 'aiAgentOrchestration';

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

    const oldContextCreateAt = context.message.createAt;
    try {
        const args: mls.msg.RequestAddMessageAI = {
            action: "addMessageAI",
            threadId,
            userId,
            taskTitle,
            userMessage,
            agentName,
            inputAI,
            longTermMemory
        };

        const value = await mls.api.msgAddMessageAI(args);
        if (!value) throw new Error(`[${agentName}](startNewAiTask) Error on return addMessageAI`);
        if (value.statusCode !== 200) throw new Error(`[${agentName}](startNewAiTask) Error on addMessageAI: ${value.msg || ''})`);

        const ret = value as mls.msg.ResponseAddMessageAI;
        context.task = ret.task;
        if (context.task.iaCompressed) {
            context.task.iaCompressed.modeSingleStep = context.modeSingleStep;
        }
        context.message = ret.message;
        notifyTaskChange(context, oldContextCreateAt);

        if (mls.isTraceAgent) console.log(JSON.stringify(context, null, 2));
        if (longTermMemory) context.task = await appendLongTermMemory(context, longTermMemory);
        await afterPrompt(context);

    } catch (error: any) {
        onError(context, 1, error.message, oldContextCreateAt);
        throw new Error(`[${agentName}](startNewAiTask) ${error.message || error}`);
    }
}

export async function startNewAiTaskAsync(
    taskTitle: string,
    agent: IAgentAsync,
    userMessage: string,
    inputAI: mls.msg.IAMessageInputType[],
    context: mls.msg.ExecutionContext,
    longTermMemory?: Record<string, string>
): Promise<void> {
    const oldContextCreateAt = context.message.createAt;
    try {
        const args: mls.msg.RequestAddMessageAI = {
            action: "addMessageAI",
            threadId: context.message.threadId,
            userId: context.message.senderId,
            taskTitle,
            userMessage,
            agentName: agent.agentName,
            inputAI,
            longTermMemory
        };

        const value = await mls.api.msgAddMessageAI(args);
        if (!value) throw new Error(`[${agent.agentName}](startNewAiTaskAsync) Error on return addMessageAI`);
        if (value.statusCode !== 200) throw new Error(`[${agent.agentName}](startNewAiTaskAsync) Error on addMessageAI: ${value.msg || ''})`);
        0
        const ret = value as mls.msg.ResponseAddMessageAI;
        context.task = ret.task;
        context.message = ret.message;
        notifyTaskChange(context, oldContextCreateAt);

        if (mls.isTraceAgent) console.log(JSON.stringify(context, null, 2));
        //await afterPrompt(context);

    } catch (error: any) {
        onError(context, 1, error.message, oldContextCreateAt);
        throw new Error(`[${agentName}](startNewAiTask) ${error.message || error}`);
    }
}


type AfterPrompt = (context: mls.msg.ExecutionContext) => Promise<void>;

export async function startNewInteractionInAiTask(agentName: string, taskTitle: string, inputAI: mls.msg.IAMessageInputType[], context: mls.msg.ExecutionContext, afterPrompt: AfterPrompt, stepFather: number): Promise<void> {
    try {
        if (!context || !context.message || !context.task) throw new Error(`[${agentName}(startNewInteractionInAiTask) Invalid context`);
        if (!agentName) throw new Error(`[${agentName}(startNewInteractionInAiTask) agentName is null`);
        if (!context.task.messageid_created) throw new Error(`[${agentName}(startNewInteractionInAiTask)context.task.messageid_created is null`);
        const args: mls.msg.RequestAddTaskAIInteraction = {
            action: "addTaskAIInteraction",
            userId: getUserId() || context.task.owner,
            messageId: context.task.messageid_created,
            taskId: context.task.PK,
            parentStepId: stepFather,
            inputAI
        }

        const value = await mls.api.msgAddTaskAIInteraction(args);

        if (!value) throw new Error(`[${agentName}](startNewInteractionInAiTask) Error on return addTaskAIInteraction, no return`);
        if (value.statusCode !== 200) throw new Error(`[${agentName}](startNewInteractionInAiTask) Error on addTaskAIInteraction: ${value.msg || ''})`);

        const ret = value as mls.msg.ResponseAddTaskAIInteraction
        context.task = ret.task;
        if (context.task.iaCompressed) {
            context.task.iaCompressed.modeSingleStep = context.modeSingleStep;
        }
        notifyTaskChange(context);

        if (mls.isTraceAgent) console.log(JSON.stringify(context, null, 2));
        await afterPrompt(context);
    }
    catch (error: any) {
        const msg = `${error.message || ''}`;
        onError(context, stepFather, msg);
        console.error(msg);
    }
}

export async function addNewStep(context: mls.msg.ExecutionContext, parentStepId: number, steps: mls.msg.AIPayload[], newTaskTitle = "Pending"): Promise<mls.msg.ExecutionContext | undefined> {

    if (!context || !context.message || !context.task) throw new Error(`[${agentName}(addNewStep) Invalid context`);
    if (!context.task.messageid_created) throw new Error(`[${agentName}(addNewStep) context.task.messageid_created is null`);

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
        notifyTaskChange(context);
        executeNextStep(context);
        return context;

    } catch (error: any) {
        const msg = `${error.message || ''}`;
        onError(context, parentStepId, msg);
        console.error(msg);
    }

}

const maxCostByTask = 1.01; // 1.01 USD
const maxStepsByTask = 100;

export async function executeNextStep(context: mls.msg.ExecutionContext): Promise<void> {
    if (!context || !context.message || !context.task || !context.task.iaCompressed) throw new Error("Invalid context");
    if (context.task.status === "paused" || context.task.status === "done" || context.modeSingleStep === true) {
        notifyTaskChange(context);
        return;
    }
    const step = getNextPendentStep(context.task);
    if (!step) {
        notifyTaskChange(context);
        console.error("finished all steps");
        return;
    }

    const { totalCost, totalSteps } = calculateStepsStatistics(context.task.iaCompressed.nextSteps, false);

    if (totalCost > maxCostByTask) {
        notifyTaskChange(context);
        console.error("max cost reached");
        throw new Error(`[${agentName}(executeNextStep) max cost reached`);
    }

    if (totalSteps > maxStepsByTask) {
        notifyTaskChange(context);
        console.error("max steps reached");
        throw new Error(`[${agentName}(executeNextStep) max steps reached`);
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
        const traceMsg = `Error executing tool ${step.toolName}: ${rc.error} `;
        console.error(traceMsg);
        context = await updateStepStatus(context, step.stepId, "failed", traceMsg);
        if (mls.isTraceAgent) console.log(JSON.stringify(context.task, null, 2));
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
            prompt: `${oldPrompt?.content} \n\n Response from tool ${step.toolName}: ${rc.result} `,
            status: 'pending',
            stepId: getNextStepIdAvaliable(context.task),
            interaction: null,
            nextSteps: null,
            rags: null
        }

        if (mls.isTraceAgent) console.log(JSON.stringify(context.task, null, 2));
        await addNewStep(context, stepdIdToChangeStatus, [newStep]);
        return;

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

        const tool = await loadTool(toolName);
        if (!args) {
            // no args provided
            mls.common.argsValidator({}, tool.argsSchema);
            rc.result = await tool.execute();
        } else {
            const parsedArgs = mls.common.safeParseArgs(args);
            mls.common.argsValidator(parsedArgs, tool.argsSchema);
            rc.result = await tool.execute(parsedArgs);
        }
        rc.status = true;
    } catch (error: any) {
        console.error(`[executeTool] ${error.message || error} `);
        rc.error = error.message || error;
    }
    return rc;
}

async function executeNextAgent(context: mls.msg.ExecutionContext, step: mls.msg.AIAgentStep) {
    if (!context || !context.task) throw new Error(`[${agentName}](executeNextAgent) Invalid context`);
    if (!step.agentName) throw new Error(`[${agentName}](executeNextAgent) Agent name is missing`);

    try {
        const agent = await loadAgent(step.agentName);
        if (!agent) throw new Error(`[${agentName}](executeNextAgent) createAgent function not found in ${mls.actualProject} ${step.agentName} `);
        await executeBeforePrompt(agent, context);
    } catch (error: any) {
        const msg = `${error.message || ''}`;
        onError(context, step.stepId, msg);
        console.error(msg);
    }
}

export async function loadAgent(agentName: string): Promise<IAgent | IAgentAsync | undefined> {

    try {
        const agent = await getAgentInstanceByName(agentName);
        return agent;
    } catch (error: any) {
        console.error(`[loadAgent] ${error.message || error} `);
        return undefined;
    }

}

export async function loadTool(shortName: string): Promise<any | undefined> {

    try {
        const module = await loadModuleFromProjectOrDependency(shortName, '', '.ts');
        if (typeof module.createTool !== "function") throw new Error(`createTool function not found in ${shortName} `);
        const tool = module.createTool();
        return tool;
    } catch (error: any) {
        console.error(`[loadTool] ${error.message || error} `);
        return undefined;
    }

}

export async function executeBeforePrompt(agent: IAgent | IAgentAsync, context: mls.msg.ExecutionContext): Promise<void> {
    // execute one of this: beforePrompt, beforePromptAtomic, beforePromptImplicit
    if ((agent as IAgent).beforePrompt) return await (agent as IAgent).beforePrompt(context);
    agent = agent as IAgentAsync;
    let content = context.message.content;
    if (content.startsWith("@@")) content = content.split(" ").slice(1).join(" ").trim(); // remove agent name
    if (mls.isTraceAgent) console.log(`[executeBeforePrompt] content:"${content}"`)

    if (agent.beforePromptAtomic) {
        // file ref
        const { jsonText, rest } = splitJsonAndText(content)
        const file = mls.stor.getFileStorFromJson(jsonText, {});
        if (mls.isTraceAgent) console.log(`[executeBeforePrompt] isAtomic=${file ? "yes:" + JSON.stringify(file) : "no"}, userPromptAfterJson:${rest}`)
        if (file) {
            const intents = await agent.beforePromptAtomic(agent, context, file, rest);
            return await processIntents(agent, context, intents);
        }
    }
    if (agent.beforePromptImplicit) {
        // no structured args
        if (mls.isTraceAgent) console.log(`[executeBeforePrompt] implicit`)
        const intents = await agent.beforePromptImplicit(agent, context, content);
        return await processIntents(agent, context, intents);
    }
    throw new Error(`Invalid agent ${agent.agentName}, no beforePrompt`);
}

function splitJsonAndText(input: string): { jsonText: string; rest: string } {
    const start = input.indexOf("{");
    const end = input.indexOf("}");

    if (start === -1 || end === -1 || end < start) return { jsonText: input, rest: "" };

    const jsonText = input.slice(start, end + 1).trim();
    const rest = input.slice(end + 1).trim();

    return { jsonText, rest };
}


const MAX_HOOKS_PER_TURN = 5;
const runningTasks = new Set<string>();

export async function continuePoolingTask(context: mls.msg.ExecutionContext) {
    const { task } = context;
    if (!task) return;

    const taskId = task.PK;

    if (runningTasks.has(taskId)) {
        console.warn('Task already in pooling');
        return;
    }

    if (task.status !== 'in progress') throw new Error('Task not in progress');
    const ia = task.iaCompressed;
    if (!ia) throw new Error('Task has no AI interaction');
    if (!ia.queueFrontEnd) throw new Error('Task has no pending hooks');

    const firstStep = ia.nextSteps?.[0] as mls.msg.AIAgentStep | undefined;
    if (!firstStep) throw new Error('No next step available');

    const agentName = firstStep.agentName;
    const agent = await loadAgent(agentName);
    if (!agent) throw new Error(`[${agentName}] createAgent function not found`);


    runningTasks.add(taskId);
    await addPooling({
        taskId,
        userId: context.task?.owner ?? '',
        startAt: Date.now().toString()
    });


    const hooksToProcess = ia.queueFrontEnd
        .filter(h => h.type !== 'pooling')
        .slice(0, MAX_HOOKS_PER_TURN);

    const intentsFromHooks = (
        await Promise.all(
            hooksToProcess.map(async hook => [
                ...(await processIntents2(agent, context, hook)),
                ...getRemoveIntent(agent, context, hook),
            ])
        )
    ).flat();

    await addOrUpdateTask(task);
    let intents = intentsFromHooks;

    if (intents.length === 0) {
        intents = await processHookPooling(agent, context);
        if (intents.length === 0) {
            runningTasks.delete(taskId);
            await deletePooling(taskId);
            return;
        }
    }

    void processIntents(agent, context, intents);

}


async function processIntents(agent: IAgentAsync, context: mls.msg.ExecutionContext, intents: mls.msg.AgentIntent[]): Promise<void> {
    if (mls.isTraceAgent) console.log(`[processIntents] intents length: ${intents.length}`);
    const oldContextCreateAt = context.message.createAt;
    const value = await mls.api.msgApplyIntents({
        userId: context.message.senderId,
        intents
    });
    if (!value) throw new Error(`[${agentName}](startNewAiTask) Error on return msgApplyIntents`);
    if (value.statusCode !== 200) throw new Error(`[${agentName}](startNewAiTask) Error on msgApplyIntents: ${value.msg || ''})`);
    const ret = value as mls.msg.ResponseApplyIntents;

    context.task = ret.task;
    if (ret.message) context.message = ret.message;
    notifyTaskChange(context, oldContextCreateAt);
    if (!context.task?.iaCompressed) return;

    runningTasks.add(ret.task.PK);
    await addPooling({
        taskId: ret.task.PK,
        userId: context.task?.owner ?? '',
        startAt: Date.now().toString()
    });

    let _hooks = context.task.iaCompressed.queueFrontEnd || [];
    const hooksToProcess = _hooks
        .filter(h => h.type !== 'pooling')
        .slice(0, 5); // max 5 hooks by turn
    let newIntents: mls.msg.AgentIntent[] = [];
    for (const hook of hooksToProcess) {
        newIntents.push(...await processIntents2(agent, context, hook), ...getRemoveIntent(agent, context, hook));
    }
    await addOrUpdateTask(context.task); // UI feedback, update task in indexedDB
    if (newIntents.length < 1) {
        newIntents = await processHookPooling(agent, context);
        if (newIntents.length < 1) {
            runningTasks.delete(ret.task.PK);
            await deletePooling(ret.task.PK);
            return; // just leave
        }
    }
    processIntents(agent, context, newIntents); // reentrance processIntents, fire and forget to fast UI feedback 
}

async function processIntents2(agent: IAgentAsync, context: mls.msg.ExecutionContext, hook: mls.msg.AgentHooks): Promise<mls.msg.AgentIntent[]> {
    try {
        if (hook.type === "beforePromptStep") return await processHookBeforePromptStep(agent, context, hook);
        if (hook.type === "afterPromptStep") return await processHookAfterPromptStep(agent, context, hook);
        throw new Error(`not implemented processIntents process hooks, type:${hook.type}`);
    } catch (e: any) {
        console.error(`error processing taskid:${context.task?.PK}, hook:${hook.type}, message:${e.message || e} `)
        return [];
    }
}

async function processHookPooling(agent: IAgentAsync, context: mls.msg.ExecutionContext): Promise<mls.msg.AgentIntentRemoveHook[]> {
    const hook: mls.msg.AgentHookPooling | undefined = (context.task?.iaCompressed?.queueFrontEnd.find(f => f.type === 'pooling')) as mls.msg.AgentHookPooling;
    if (!hook || !hook.afterMs || hook.afterMs < 1000) return [];
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(getRemoveIntent(agent, context, hook));
        }, hook.afterMs);
    });
}

function getRemoveIntent(agent: IAgentAsync, context: mls.msg.ExecutionContext, hook: mls.msg.AgentHooks): mls.msg.AgentIntentRemoveHook[] {
    return [{
        type: 'remove-hook',
        hookSequential: hook.hookSequential,
        threadId: context.message.threadId,
        messageId: context.message.orderAt,
        taskId: context.task?.PK || ''
    }];
}
async function processHookBeforePromptStep(agent: IAgentAsync, context: mls.msg.ExecutionContext, hook: mls.msg.AgentHookBeforePromptStep): Promise<mls.msg.AgentIntent[]> {
    if (!agent.beforePromptStep) throw new Error(`Agent ${agent.agentName} do not have beforePromptStep`);
    if (!context.task) throw new Error('[processHookBeforePromptStep] invalid task');
    const step = getStepById(context.task, hook.stepId) as mls.msg.AIAgentStep;
    const parentStep = getStepById(context.task, hook.parentStepId) as mls.msg.AIAgentStep;
    if (!step || !parentStep) throw new Error('[processHookBeforePromptStep] invalid stepId or parentStepId');
    const rc = await agent.beforePromptStep(agent, context, parentStep, step, hook.hookSequential, hook.args);
    return rc;
}

async function processHookAfterPromptStep(agent: IAgentAsync, context: mls.msg.ExecutionContext, hook: mls.msg.AgentHookAfterPromptStep): Promise<mls.msg.AgentIntent[]> {
    if (!agent.afterPromptStep) throw new Error(`Agent ${agent.agentName} do not have afterPromptStep`);
    if (!context.task) throw new Error('[processHookBeforePromptStep] invalid task');
    const step = getStepById(context.task, hook.stepId) as mls.msg.AIAgentStep;
    const parentStep = getStepById(context.task, hook.parentStepId) as mls.msg.AIAgentStep;
    return await agent.afterPromptStep(agent, context, parentStep, step, hook.hookSequential);
}

async function executeAgentFunction(context: mls.msg.ExecutionContext, step: mls.msg.AIAgentStep, functionName: string, stepId: number, args?: object): Promise<any> {
    if (!context || !context.task) throw new Error(`[${agentName}](executeAgentFunction) Invalid context`);
    if (!step.agentName) throw new Error(`[${agentName}](executeAgentFunction) Agent name is missing`);

    try {
        const agent = await loadAgent(step.agentName);
        if (!agent) throw new Error(`[${agentName}](executeAgentFunction) invalid agent`);
        const fn = (agent as any)[functionName];
        if (typeof fn !== "function") throw new Error(`[${agentName}](executeAgentFunction) ${functionName} function not found in ${step.agentName} `);
        return await fn(context, stepId, args);
    } catch (error: any) {
        console.error(`[${agentName}](executeAgentFunction)  ${error.message || error} `);
    }

}

async function executeNextResult(context: mls.msg.ExecutionContext, step: mls.msg.AIResultStep) {
    if (!context || !context.task) throw new Error(`[${agentName}](executeNextResult) Invalid context`);
    if (mls.isTraceAgent) console.log("result:", step.result);
    context = await updateStepStatus(context, step.stepId, "completed");
    notifyTaskChange(context);
    return executeNextStep(context);

}

async function executeNextFlexible(context: mls.msg.ExecutionContext, step: mls.msg.AIFlexibleResultStep) {
    if (!context || !context.task) throw new Error(`[${agentName}](executeNextFlexible) Invalid context`);
    if (mls.isTraceAgent) console.log("Flexible:", step.result);
    context = await updateStepStatus(context, step.stepId, "completed");
    notifyTaskChange(context);
    return executeNextStep(context);

}

async function executeNextClarification(context: mls.msg.ExecutionContext, step: mls.msg.AIClarificationStep) {
    if (!context || !context.task) throw new Error(`[${agentName}](executeNextClarification) Invalid context`);
    // if (!step.clarificationMessage) throw new Error("clarification message is missing");
    // notifyTaskChange(context);
    // if (mls.istraceAgent) console.log("clarification:", step.clarificationMessage);
    // context.task = await updateStepStatus(context.task, step.stepId, "waiting_for_user");

}

export async function getAgentContext(taskId: string): Promise<{
    context: mls.msg.ExecutionContext,
    interaction: mls.msg.AIAgentStep,
    step: mls.msg.AIPayload
}> {
    const task: mls.msg.TaskData | undefined = await getTask(taskId);
    if (!task || !task.messageid_created) throw new Error(`[${agentName}](getAgentContext) Invalid taskId ${taskId}`);
    const step = getNextPendentStep(task);
    if (!step) throw new Error("[getAgentContext] No pending step")
    if (step.type !== "clarification" && step.type !== "tool") throw new Error("[getAgentContext] No pending clarification or tool step");
    const interactionId: number | null = getInteractionStepId(task, step.stepId);
    if (!interactionId) throw new Error("[getAgentContext] Not found interactionId in pending step")
    const interaction: mls.msg.AIPayload | null = getStepById(task, interactionId);
    if (!interaction || interaction.type !== "agent") throw new Error("[getAgentContext] Clarification or tool step not bellow a agent");

    const messageId: string = task.messageid_created;

    const message: mls.msg.Message | undefined = await getMessage(messageId);
    if (!message) throw new Error(`[${agentName}](getAgentContext) Message not found: ${messageId}`)
    const context: mls.msg.ExecutionContext = {
        message,
        task,
        modeSingleStep: task.iaCompressed?.modeSingleStep || undefined
    }
    return { context, interaction, step };
}

export async function getClarification(taskId: string): Promise<HTMLDivElement | null> {
    const ret = await getAgentContext(taskId);
    if (ret.step.type !== "clarification") throw new Error(`[${agentName}](getClarification) Clarification step not not found`);
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
    if (!taskId) throw new Error(`[${agentName}](postBackClarification) Invalid call arguments, no taskId`);
    const ret = await getAgentContext(taskId);

    if (action === "cancel") {

        const messageId: string | undefined = ret.context.task?.messageid_created;
        if (!messageId) throw new Error(`[${agentName}](postBackClarification) Invalid messageId`);

        const resp = await mls.api.msgUpdateStepStatus({
            messageId,
            status: "failed",
            stepId: ret.step.stepId,
            taskId,
            userId: getUserId() || ret.context.message.senderId,
            traceMsg: "user cancel the task"
        });

        ret.context.task = resp.task;
        notifyTaskChange(ret.context);
        dispatchDetailsTaskClose(taskId);
        return;
    }
    if (ret.step.type !== "clarification") throw new Error(`[${agentName}](postBackClarification) Clarification step not not found`);
    dispatchDetailsTaskClose(taskId);
    return await executeAgentFunction(ret.context, ret.interaction, "afterClarification", ret.step.stepId, clarification);

}

export async function startClarification(context: mls.msg.ExecutionContext, stepId: number, modeReadOnly?: boolean): Promise<HTMLDivElement | null> {
    // called after agent . beforeClarification

    if (!context.task) throw new Error(`[${agentName}](startClarification) Invalid context.task`);

    const step = getStepById(context.task, stepId) as mls.msg.AIClarificationStep;
    if (!step || step.type !== "clarification") throw new Error(`[${agentName}](startClarification) Invalid step: ${stepId} on task: ${context.task.PK}`);
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
        throw new Error(`[${agentName}](startClarification) Invalid step: ${stepId} on task: ${context.task.PK}, json clarification invalid`);
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
    if (!taskId) throw new Error(`[${agentName}](endClarification) Invalid call arguments, no taskId`);
    const ret = await getAgentContext(taskId);
    if (ret.step.type !== "clarification") throw new Error(`[${agentName}](endClarification)  Clarification step not not found`);

    if (action === "continue") {
        await executeAgentFunction(ret.context, ret.interaction, "afterClarification", clarification.stepId, clarification);
        dispatchDetailsTaskClose(taskId);
        return;
    }

    // cancel the task
    const messageId: string | undefined = ret.context.task?.messageid_created;
    if (!messageId) throw new Error(`[${agentName}](endClarification) Invalid messageId`);
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
    dispatchDetailsTaskClose(taskId);

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
    if (!context.task) throw new Error(`[${agentName}](setFailedStatus) Invalid context task`);
    context = await updateStepStatus(context, step, "failed");
    notifyTaskChange(context);
}

async function onError(context: mls.msg.ExecutionContext, stepId: number, messageError: string, oldContextCreateAt?: string) {
    try {
        if (context && context.task) {
            const msg = 'Error: ' + messageError || 'addNewStep ';
            context.task = await updateTaskTitle(context.task, msg.substring(0, 100));
            await setFailedStatus(context, stepId);
            const step = getNextPendentStep(context.task);
            if (step) setFailedStatus(context, step.stepId);
        }
    } catch (err) {
        if (context.task) context.task.status = 'failed';
        notifyTaskChange(context, oldContextCreateAt);
    }
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

/**
 * agentName, ex: 'agentXX1' or '_100554_/l2/agents/agentXX1'
 */
async function getAgentInstanceByName(agentNameOrPath: string): Promise<IAgent | IAgentAsync | undefined> {

    const projectActual = mls.actualProject;
    if (!projectActual) throw new Error('Not found project actual!');
    let projectsToSearch: number[];
    const fileInfo = mls.stor.getPathToFile(agentNameOrPath)
    if (fileInfo.project > 0) {
        // full path
        projectsToSearch = [fileInfo.project];
    } else {
        projectsToSearch = mls.l5.getProjectDependencies(projectActual, true);
    }

    function searchInProject(projectId: number) {
        let foundInFolder: mls.stor.IFileInfo | undefined;

        for (const file of Object.values(mls.stor.files)) {
            if (file.project !== projectId
                || file.extension !== ".ts"
                || !file.shortName.startsWith('agent')
                || file.shortName !== fileInfo.shortName) continue;
            if (file.folder === '' || file.folder === fileInfo.folder) {
                return file;
            }
            foundInFolder = file;
        }
        return foundInFolder;
    };

    for (const projId of projectsToSearch) {
        const agentInfo = searchInProject(projId);
        if (!agentInfo) continue;
        try {
            const moduleAgent = await collabImport({ project: agentInfo.project, shortName: agentInfo.shortName, folder: agentInfo.folder.trim() });
            if (typeof moduleAgent.createAgent !== "function") throw new Error(`[getAgentInstanceByName] createAgent function not found in ${agentName}`);
            const agentInstance = moduleAgent.createAgent();
            return agentInstance;
        } catch (error: any) {
            console.error(`[loadAgent] ${error.message || error} `);
            return undefined;
        };
    }
    return undefined;
}
