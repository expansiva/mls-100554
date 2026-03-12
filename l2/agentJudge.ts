/// <mls fileReference="_100554_/l2/agentJudge.ts" enhancement="_100554_/l2/enhancementLit" />

import { IAgentAsync, IAgentMeta, svg_agent } from '/_100554_/l2/aiAgentBase.js';

export function createAgent2(): IAgentAsync {
    return {
        agentName: "agentJudge",
        agentProject: 100554,
        agentFolder: "",
        agentDescription: "Responsible for judge agents payloads.",
        avatar_url: svg_agent,
        visibility: "public",
        beforePromptImplicit,
        afterPromptStep,
    };
}

async function beforePromptImplicit(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    userPrompt: string,
): Promise<mls.msg.AgentIntent[]> {

    if (!userPrompt || userPrompt.length < 5) throw new Error('invalid prompt');
    let pp = context.message.content
        .replace(`@@ ${agent.agentName}`, '')
        .replace(`@@_100554_${agent.agentName}`, '')
        .replace(`@@ _100554_${agent.agentName}`, '')
        .replace(`@@ _100554_/l2/${agent.agentName}`, '')
        .replace(`@@_100554_/l2/${agent.agentName}`, '')
        .replace(`@@${agent.agentName}`, '').trim();

    let data = JSON.parse(pp);

    const system = await prepareSystemPrompt(data)

    const addMessageAI: mls.msg.AgentIntentAddMessageAI = {
        type: "add-message-ai",
        request: {
            action: 'addMessageAI',
            agentName: agent.agentName,
            inputAI: [{
                type: "system",
                content: system,
            }, {
                type: "human",
                content: data.prompt
            }],
            taskTitle: `New module`,
            threadId: context.message.threadId,
            userMessage: context.message.content,
            longTermMemory: { 'page': `${data.page}`, 'position': data.position },
        }
    };
    return [addMessageAI];

}

async function afterPromptStep(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    parentStep: mls.msg.AIAgentStep,
    step: mls.msg.AIAgentStep,
    hookSequential: number,
): Promise<mls.msg.AgentIntent[]> {
    if (!agent || !context || !step) throw new Error(`[afterPromptStep] invalid params, agent:${!!agent}, context:${!!context}, step:${!!step}`);

    const payload = (step.interaction?.payload?.[0]) as Output1 || undefined;
    if (payload?.type !== "flexible") throw new Error(`Payload type invalid: ${payload?.type} must be flexible`);
    if (payload?.type !== 'flexible' || !payload.result) throw new Error(`[afterPromptStep] invalid payload: ${payload}`)

    let status: mls.msg.AIStepStatus = 'completed';
    const updateStatus: mls.msg.AgentIntentUpdateStatus = {
        type: 'update-status',
        hookSequential,
        messageId: context.message.orderAt,
        threadId: context.message.threadId,
        taskId: context.task?.PK || '',
        parentStepId: parentStep.stepId,
        stepId: step.stepId,
        status
    };
    return [updateStatus];

}

async function prepareSystemPrompt(data: any): Promise<string> {
    let system: string = system1;
    system = system.replace('{{title1}}', data.title1);
    system = system.replace('{{title2}}', data.title2);
    system = system.replace('{{context1}}', data.context1);
    system = system.replace('{{context2}}', data.context2);
    return system;
}

const system1 = `
<!-- modelType: code -->
<!-- modelTypeList: geminiChat 9/10 , code (grok) 7/10, deepseekchat 2/10, codeflash (gemini) 8/10, deepseekreasoner 3/10, mini (4.1) or nano (openai) 4/10, codeinstruct (4.1) 4/10, codereasoning(gpt5) 3/10, code2 (kimi 2.5) -->

Você é um avaliador. Recebe dois contextos, cada um com um título e texto.

## RULES
Avalie qual contexto apresenta a **melhor resposta** considerando:

- **Qualidade da resposta**: precisão, completude, clareza, relevância  
- **Comportamento do modelo**: segurança, consistência, raciocínio  

Dê uma nota de **0 a 10** para o melhor contexto.  
Explique brevemente o motivo da escolha.

## ENTRADAS
--- Título: {{title1}} ---
{{context1}}

--- Título: {{title2}} ---
{{context2}}


## Output format
Return only valid JSON in the following structure:

[[OutputSection1]]

`
//#region OutputSection1
export type Output1 =
    {
        type: "flexible",
        result: IDataResult
    }

interface IDataResult {
    title: "A", // ou outro
    points: 10, // número de 0 a 10
    desc: string  // "sua justificativa"
}
//#endregion
