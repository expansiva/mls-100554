/// <mls fileReference="_100554_/l2/agentTest/agent2.ts" enhancement="_100554_/l2/enhancementLit" />

import { IAgentAsync, IAgentMeta } from '/_100554_/l2/aiAgentBase.js';

export function createAgent(): IAgentAsync {
    return {
        agentName: "agent2",
        agentProject: 100554,
        agentFolder: "",
        agentDescription: "Agente para teste 2",
        visibility: "public",
        beforePromptImplicit,
        beforePromptStep,
        afterPromptStep
    };
}

// Only for local test
async function beforePromptImplicit(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    userPrompt: string,
): Promise<mls.msg.AgentIntent[]> {

    const paths: string[] = JSON.parse(userPrompt);
    const inputs: mls.msg.IAMessageInputType[] = [{ type: "system", content: system1 }];

    const addMessageAI: mls.msg.AgentIntentAddMessageAI = {
        type: "add-message-ai",
        request: {
            action: 'addMessageAI',
            agentName: agent.agentName,
            inputAI: inputs,
            taskTitle: `Generating defs for ${paths.length} files`,
            threadId: context.message.threadId,
            userMessage: context.message.content,
            longTermMemory: {},
        },
        executionMode: {
            type: 'parallel',
            args: paths
        }
    };

    return [addMessageAI];

}

async function beforePromptStep(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    parentStep: mls.msg.AIAgentStep,
    step: mls.msg.AIAgentStep,
    hookSequential: number,
    args?: string
): Promise<mls.msg.AgentIntent[]> {

    if (!args) throw new Error(`[beforePromptStep] args invalid`);
    const info = extractInfoFromPrompt(args);
    console.info({ args, info });


    // Primera vez vai passar aqui para preparar os inputs, após add step
    if (info.agentName === 'agent1') {

        const continueParallel1: mls.msg.AgentIntentPromptReady = {
            type: "prompt_ready",
            args,
            messageId: context.message.orderAt,
            threadId: context.message.threadId,
            taskId: context.task?.PK || '',
            hookSequential,
            parentStepId: parentStep.stepId,
            humanPrompt: '',
            systemPrompt: system1
        }
        return [continueParallel1];

    }

    // Para cada args, passará aqui
    const continueParallel: mls.msg.AgentIntentPromptReady = {
        type: "prompt_ready",
        args,
        messageId: context.message.orderAt,
        threadId: context.message.threadId,
        taskId: context.task?.PK || '',
        hookSequential,
        parentStepId: parentStep.stepId,
        humanPrompt: `${args}`
    }
    return [continueParallel];

}

async function afterPromptStep(
    agent: IAgentMeta,
    context: mls.msg.ExecutionContext,
    parentStep: mls.msg.AIAgentStep,
    step: mls.msg.AIAgentStep,
    hookSequential: number,
): Promise<mls.msg.AgentIntent[]> {


    if (!agent || !context || !step) throw new Error(`[afterPromptStep] invalid params, agent:${!!agent}, context:${!!context}, step:${!!step}`);

    const payload = (step.interaction?.payload?.[0]);
    if (payload?.type !== 'flexible' || !payload.result) throw new Error(`[afterPromptStep] invalid payload: ${payload}`)
    let status: mls.msg.AIStepStatus = 'completed';
    let intents: mls.msg.AgentIntent[] = [];

    const output = payload.result;
    console.log("=== Output ");
    console.info(output);

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

function extractInfoFromPrompt(text: string) {

    const match = text.match(/^\[([^\]]+)\]\s*([\s\S]*)$/);
    const agentName = match?.[1];
    const prompt = match?.[2];

    return {
        agentName,
        prompt
    }

}

const system1 = `
<!-- modelType: code -->
<!-- modelTypeList: geminiChat ?/10 , code (grok) ?/10, deepseekchat ?/10, codeflash (gemini) ?/10, deepseekreasoner ?/10, mini (4.1) ou nano (openai) ?/10, codeinstruct (4.1) ?/10, codereasoning(gpt5) ?/10, code2 (kimi 2.5) ?/10 -->

You are a geography and international data assistant.

Your task is to receive the name of a country and return structured information about it.

Rules:
- Always return the result in valid JSON
- Do not include explanations outside the JSON
- If some information is unavailable, return null
- All text must be in Portuguese
- Numbers should not contain formatting (no commas)


## Output format
You must return the object strictly as JSON, no spaces, no indent, minified
[[OutputSection]]
`

//#region OutputSection
export type Output = {
    type: "flexible";
    result: IInfo;
};

interface IInfo {
    "country": {
        "name": "",
        "officialName": "",
        "capital": "",
        "continent": "",
        "region": "",
        "language": [],
        "currency": {
            "name": "",
            "code": "",
            "symbol": ""
        },
        "population": number,
        "area_km2": number,
        "gdp_usd": number,
        "governmentType": "",
        "president_or_leader": "",
        "timezones": [],
        "callingCode": "",
        "internetTLD": "",
        "flagDescription": ""
    },

    "geography": {
        "borderCountries": [],
        "majorCities": [],
        "climate": "",
        "biomes": [],
        "highestPoint": "",
        "majorRivers": []
    },

    "culture": {
        "demonym": "",
        "traditionalFoods": [],
        "famousFestivals": [],
        "mainReligions": [],
        "sportsPopularity": []
    },

    "economy": {
        "mainIndustries": [],
        "topExports": [],
        "topImports": [],
        "humanDevelopmentIndex": number,
        "minimumWage_usd": number
    },

    "tourism": {
        "famousLandmarks": [],
        "naturalAttractions": [],
        "bestTimeToVisit": "",
        "visaRequiredForBrazil": ""
    }
}
//#endregion