/// <mls shortName="workflowAgentManager" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import * as iaChat from './_100554_iaChatInterfaces';
import * as plannermain from './_100554_agentPlanner1';

export let url = 'https://collab.codes/msg'; 
export let userId = '20250417120844.1000';
export let threadId = '20250417133813.1000'; 

export async function getTask(messageId: string, taskId: string,): Promise<iaChat.TaskData> {
    return execGetTaskUpdate(messageId, taskId);
}

/*export async function execNewPrompt(prompt: string): Promise<iaChat.TaskData> {
    return _execNewPrompt(prompt);
}*/

export async function execPromptByTaskStep(msgId:string, taskPK:string, agenteName:string, step:number, prompt: any): Promise<iaChat.TaskData> {
    return _execPromptByTaskStep(msgId,taskPK, agenteName, step, prompt);
}

//--------IMPLEMENTS---------

/*async function _execNewPrompt(prompt: string): Promise<iaChat.TaskData> {
    const inputs = plannermain.startPrompt(prompt);
    const tagInitial = await execAddTask(inputs, prompt);
    if (!tagInitial) throw new Error('Error create tag');
    const after = await plannermain.afterPrompt(tagInitial, tagInitial.iaCompressed?.interaction?.payload)
    console.info({ executou: 'agentPlanner1', resultado: tagInitial.iaCompressed?.interaction?.payload });
    return await _execNextPass(tagInitial, after);

}*/

async function _execPromptByTaskStep(msgId: string, taskPK: string, agenteName: string, step: number, prompt: any): Promise<iaChat.TaskData> {

    const task = await execGetTaskUpdate(msgId, taskPK); 
    const after: iaChat.AIAfterPrompt[] = [{
        agent: agenteName,
        nextprompt: prompt,
        stepFather: step
    }];
    return await _execNextPass(task, after);
}

async function _execNextPass(task: iaChat.TaskData, steps: iaChat.AIAfterPrompt[]): Promise<iaChat.TaskData> {

    for await (let step of steps) {

        try {

            const instanceAgent = await import(`./_100554_${step.agent}`);
            if (!instanceAgent) {
                console.info(`Invalid instance for agent : ${step.agent}, step: ${step.stepFather} `);
                continue;
            }

            if (!instanceAgent.beforePrompt) {
                console.info('Invalid function beforePrompt');
                continue;
            }

            const inputs = instanceAgent.beforePrompt(task, step.nextprompt);
            if (!inputs || !task.messageid_created) {
                console.info('Invalid inputs or task messageid');
                continue;
            }

            const taskUpdt = await execAddTaskAIInteraction(inputs, task.messageid_created, task.PK, step.stepFather);

            const payload = getPayloadByStep(taskUpdt, step.stepFather + 1);
            console.info({ executou: step.agent, resultado: payload });

            if (payload && payload.type && ['clarification', 'result', 'tool'].includes(payload.type)){

                if (payload.type === 'clarification') {
                    await execUpdateStepStatus(task.messageid_created || '', task.PK, step.stepFather, 'waiting_for_user');
                }

                continue;
                
            }else {

                const after = await instanceAgent.afterPrompt(task, payload);
                await _execNextPass(task, after);
            }

        } catch (e: any) {
            console.info(e.message);
            await execUpdateStepStatus(task.messageid_created || '', task.PK, step.stepFather, 'failed');
        }



    }

    return await execGetTaskUpdate(task.messageid_created || '', task.PK);

}

function getPayloadByStep(task: iaChat.TaskData, step: number): iaChat.AIPayload | undefined {


    let ret: iaChat.AIPayload | undefined = undefined;

    const getPayload = (interaction: iaChat.AIInteraction | undefined | null) => {
        if (!interaction || ret !== undefined) return;
        if (interaction.payload && interaction.payload.length > 0) {
            interaction.payload.forEach((p) => {
                if (ret === undefined && p.stepId === step) ret = p;
                getPayload(p.interaction);
            })
        }
    };

    getPayload(task.iaCompressed?.interaction)
    return ret;

}

//--------CALL IO------------

async function execUpdateStepStatus(
    messageId: string,
    taskId: string,
    stepId: number,
    status: iaChat.AIStepStatus
) {
    const result = await mls.api.msgUpdateStepStatus( {
        action: "updateStepStatus",
        userId,
        messageId,
        taskId,
        stepId,
        status
    });

    return result;
}

async function execGetTaskUpdate(
    messageId: string,
    taskId: string,
): Promise<iaChat.TaskData> {
    const result = await  mls.api.msgGetTaskUpdate({
        action: "getTaskUpdate",
        userId,
        messageId,
        taskId,
    });

    return result.task;
}

async function execAddTask(
    inputAI: iaChat.IAMessageInputType[],
    message: string
): Promise<iaChat.ResponseAddMessageAI['task']> {
    const result = await mls.api.msgAddMessageAI({
        action: 'addMessageAI',
        userId,
        threadId,
        message,
        inputAI,
    });

    return result.task;
}

async function execAddTaskAIInteraction(
    inputAI: iaChat.IAMessageInputType[],
    messageId: string,
    taskId: string,
    parentStepId: number,
): Promise<iaChat.ResponseAddMessageAI['task']> {

    const result = await mls.api.msgAddTaskAIInteraction({
        action: "addTaskAIInteraction",
        userId,
        messageId,
        taskId,
        parentStepId,
        inputAI,
    });

    return result.task;
}