/// <mls shortName="aiAgentOrchestration" project="100554" enhancement="_100554_enhancementLit" groupName="other" />
import * as helper from "./_100554_aiAgentHelper";

export async function startNewAiTask(
    agentName: string,
    taskTitle: string,
    userMessage: string,
    threadId: string,
    userId: string,
    inputAI: mls.msg.IAMessageInputType[],
    afterPrompt: (context: mls.msg.ExecutionContext, userId: string, threadId: string) => Promise<void>
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

        const value = await mls.api.msgAddMessageAI(args);

        if (!value) {
            throw new Error("Error on return addMessageAI, no return");
        }
        if (value.statusCode !== 200/*mls.msg.StatusCodeOk*/) {
            throw new Error("Error on addMessageAI: " + (value.msg || ''));
        }

        const ret = value as mls.msg.ResponseAddMessageAI;

        const context: mls.msg.ExecutionContext = {
            message: ret.message,
            task: ret.task
        };
        console.log(JSON.stringify(context, null, 2));

        await afterPrompt(context, userId, threadId);
    } catch (error: any) {
        console.error(`[startNewAiTask] ${error.message || error}`);
    }
}

type AfterPrompt = (context: mls.msg.ExecutionContext, userId: string, threadId: string) => Promise<void>;

export async function startNewInteractionInAiTask(agentName: string, taskTitle: string, inputAI: mls.msg.IAMessageInputType[], context: mls.msg.ExecutionContext, afterPrompt: AfterPrompt): Promise<void> {
    try {
        if (!context || !context.message || !context.task) throw new Error("Invalid context");
        if (!agentName) throw new Error("addNewInteractionInAiTask: agentName is null");
        if (!context.task.messageid_created) throw new Error("addNewInteractionInAiTask: context.task.messageid_created is null");

        const args: mls.msg.RequestAddTaskAIInteraction = {
            action: "addTaskAIInteraction",
            userId: context.task.owner,
            messageId: context.task.messageid_created,
            taskId: context.task.PK,
            parentStepId: 0,
            inputAI
        }

        const value = await mls.api.msgAddTaskAIInteraction(args);

        if (!value) {
            throw new Error("Error on return addTaskAIInteraction, no return");
        }
        if (value.statusCode !== 200/*mls.msg.StatusCodeOk*/) {
            throw new Error("Error on addTaskAIInteraction: " + (value.msg || ''));
        }

        const ret = value as mls.msg.ResponseAddMessageAI;

        context = {
            message: ret.message,
            task: ret.task
        };
        console.log(JSON.stringify(context, null, 2));

        if (!context.task || !context.task.owner) throw new Error("addNewInteractionInAiTask: context.task.owner is null");

        await afterPrompt(context, context.task.owner, '');


    }
    catch (error: any) {
        console.error(`[startNewInteractionInAiTask] ${error.message || error}`);
    }
}

const maxCostByTask = 1.01; // 1.01 USD
const maxStepsByTask = 100;

export async function executeNextStep(context: mls.msg.ExecutionContext, userId: string): Promise<void> {
    if (!context || !context.message || !context.task || !context.task.iaCompressed) throw new Error("Invalid context");
    if (context.task.status === "paused" || context.task.status === "done") return;
    const step = helper.getNextPendentStep(context.task);
    if (!step) {
        console.error("finished all steps");
        return;
    }

    const { totalCost, totalSteps } = helper.calculateStepsStatistics(context.task.iaCompressed.nextSteps, false);
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

        case "tool": return executeNextTool(context, step, userId);

        case "clarification": return executeNextClarification(context, step, userId);

        case "result": return executeNextResult(context, step, userId);

        case "flexible":
            // flexible step type must be processed by the agent
            throw new Error(`Flexible step type is not supported: ${JSON.stringify(step)}`);

        default:
            throw new Error(`Unknown step type: ${(step as { type: string }).type}`);
    }
}

export interface IExecuteToolReturn {
    status: boolean;
    error: string;
    result: string[];
}

async function executeNextTool(context: mls.msg.ExecutionContext, step: mls.msg.AIToolStep, userId: string,) {
    if (!context || !context.task) throw new Error("Invalid context");
    const rc: IExecuteToolReturn = await executeTool(step.toolName, step.args);

    if (rc.status !== true) {
        console.error(`Error executing tool ${step.toolName}: ${rc.error}`);
        const args: mls.msg.RequestUpdateStepStatus = {
            action: 'updateStepStatus',
            status: "failed",
            taskId: context.task.PK,
            messageId: context.task.messageid_created || '',
            stepId: step.stepId,
            userId
        }
        //context.task = await mls.api.msgUpdateStepStatus(context.task, step.stepId, "failed");
        context.task = (await mls.api.msgUpdateStepStatus(args)).task;
        return;
    }

    const args: mls.msg.RequestUpdateStepStatus = {
        action: 'updateStepStatus',
        status: "completed",
        taskId: context.task.PK,
        messageId: context.task.messageid_created || '',
        stepId: step.stepId,
        userId
    }
    //context.task = await updateStepStatus(context.task, step.stepId, "completed");
    context.task = (await mls.api.msgUpdateStepStatus(args)).task;

    if (rc.result.length > 0) {
        // todo: put content in memory
    }
    return executeNextStep(context, userId);
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
        const fileJS = `./${toolName}.js`;
        const module = await import(fileJS);
        if (typeof module.createTool !== "function") throw new Error(`createTool function not found in ${fileJS}`);
        const tool = module.createTool();
        if (!args) {
            // no args provided
            helper.argsValidator({}, tool.argsSchema);
            rc.result = await tool.execute();
        } else {
            const parsedArgs = helper.safeParseArgs(args);
            helper.argsValidator(parsedArgs, tool.argsSchema);
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
        const fileJS = `./${step.agentName}.js`;
        const module = await import(fileJS);
        if (typeof module.createAgent !== "function") throw new Error(`createAgent function not found in ${fileJS}`);
        const agent = module.createAgent();
        if (typeof agent.beforePrompt !== "function") throw new Error(`beforePrompt function not found in ${fileJS}`);
        if (typeof agent.afterPrompt !== "function") throw new Error(`afterPrompt function not found in ${fileJS}`);
        await agent.beforePrompt(context);
    } catch (error: any) {
        console.error(`[executeNextAgent] ${error.message || error}`);
    }
}

async function executeNextResult(context: mls.msg.ExecutionContext, step: mls.msg.AIResultStep, userId: string) {
    if (!context || !context.task) throw new Error("Invalid context");

    console.log("result:", step.result);
    const args: mls.msg.RequestUpdateStepStatus = {
        action: 'updateStepStatus',
        status: "completed",
        taskId: context.task.PK,
        messageId: context.task.messageid_created || '',
        stepId: step.stepId,
        userId
    }

    //context.task = await updateStepStatus(context.task, step.stepId, "completed");
    context.task = (await mls.api.msgUpdateStepStatus(args)).task;
    return executeNextStep(context, userId);

}

async function executeNextClarification(context: mls.msg.ExecutionContext, step: mls.msg.AIClarificationStep, userId: string) {
    if (!context || !context.task) throw new Error("Invalid context");
    if (!step.clarificationMessage) throw new Error("clarification message is missing");

    console.log("clarification:", step.clarificationMessage);
    const args: mls.msg.RequestUpdateStepStatus = {
        action: 'updateStepStatus',
        status: "waiting_for_user",
        taskId: context.task.PK,
        messageId: context.task.messageid_created || '',
        stepId: step.stepId,
        userId
    }

    //context.task = await updateStepStatus(context.task, step.stepId, "waiting_for_user");
    context.task = (await mls.api.msgUpdateStepStatus(args)).task;

}
