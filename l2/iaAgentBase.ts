/// <mls shortName="iaAgentBase" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

export interface IAgentBase {

    visibility: 'public' | 'private';
    getPrompt(prompt: string | undefined): mls.msg.IAMessageInputType[];
    afterPrompt(payload: mls.msg.AIPayload[] | null | undefined): Promise<void>
}


export class AgentBase {

    public task: mls.msg.TaskData | undefined;
    private threadId: string | undefined;
    private userId: string | undefined;

    constructor(_threadId: string, _userId: string) {
        this.threadId = _threadId;
        this.userId = _userId;
    }


    public async executeAgent(agentName: string, prompt: string, step: number): Promise<void> {

        if (!this.userId) throw new Error('Not found userId')
        if (!this.threadId) throw new Error('Not found threadId')

        const instanceModule = await import(`./_100554_${agentName}`) as any;
        if (!instanceModule) throw new Error(`Invalid module for agent : ${agentName}, step: ${step} `);

        const instanceClass = instanceModule[agentName];
        if (!instanceClass) throw new Error(`Invalid class name for agent : ${agentName}, step: ${step} `);

        const instanceAgent = new instanceClass(this.threadId, this.userId);
        if (!instanceAgent) throw new Error(`Invalid instance for agent : ${agentName}, step: ${step} `);

        const inputs = instanceAgent.getPrompt(prompt);
        if (!inputs) throw new Error('Invalid inputs');

        const task = await this.executeInteraction(step, inputs);
        this.task = task;
        const payload = this.getPayloadByStep(task, step + 1);

        await instanceAgent.afterPrompt(payload);

    }

    public getPayloadByStep(task: mls.msg.TaskData, step: number): mls.msg.AIPayload[] | undefined {


        let ret: mls.msg.AIPayload[] | undefined = undefined;

        const getPayload = (interaction: mls.msg.AIInteraction | undefined | null) => {
            if (!interaction || ret !== undefined) return;
            if (interaction.payload && interaction.payload.length > 0) {
                interaction.payload.forEach((p) => {
                    if (ret === undefined && p.stepId === step) ret = [p];
                    getPayload(p.interaction);
                })
            }
        };

        getPayload(task.iaCompressed?.interaction)
        return ret;

    }

    public async executePrompt(prompt: string, inputs: mls.msg.IAMessageInputType[]): Promise<mls.msg.TaskData> {

        if (!this.userId) throw new Error('Not found userId')
        if (!this.threadId) throw new Error('Not found threadId')

        const args: mls.msg.RequestAddMessageAI = {
            action: 'addMessageAI',
            userId: this.userId,
            threadId: this.threadId,
            message: prompt,
            inputAI: inputs,
        }

        const ret = await mls.api.msgAddMessageAI(args);
        this.task = ret.task;
        return ret.task;
    }

    public async executeInteraction(parentStepId: number, inputs: mls.msg.IAMessageInputType[]): Promise<mls.msg.TaskData> {

        if (!this.userId) throw new Error('Not found userId')
        if (!this.threadId) throw new Error('Not found threadId')
        if (!this.task) throw new Error('Not found task')

        const args: mls.msg.RequestAddTaskAIInteraction = {
            action: 'addTaskAIInteraction',
            userId: this.userId,
            messageId: this.task.messageid_created || '',
            taskId: this.task.PK,
            parentStepId,
            inputAI: inputs,
        }

        const ret = await mls.api.msgAddTaskAIInteraction(args);
        this.task = ret.task;
        return ret.task;
    }

    public async executeUpdateStepStatus(status: mls.msg.AIStepStatus, stepId: number): Promise<mls.msg.TaskData> {

        if (!this.userId) throw new Error('Not found userId')
        if (!this.threadId) throw new Error('Not found threadId')
        if (!this.task) throw new Error('Not found task')

        const args: mls.msg.RequestUpdateStepStatus = {
            action: 'updateStepStatus',
            userId: this.userId,
            messageId: this.task.messageid_created || '',
            taskId: this.task.PK,
            stepId,
            status

        }

        const ret = await mls.api.msgUpdateStepStatus(args);
        return ret.task;
    }

    public async executeGetTask(messageId: string, taskId: string,): Promise<mls.msg.TaskData> {

        if (!this.userId) throw new Error('Not found userId')
        if (!this.threadId) throw new Error('Not found threadId')

        const args: mls.msg.RequestGetTaskUpdate = {
            action: 'getTaskUpdate',
            userId: this.userId,
            messageId,
            taskId
        }

        const ret = await mls.api.msgGetTaskUpdate(args);
        return ret.task;
    }

}