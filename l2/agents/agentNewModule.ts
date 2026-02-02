/// <mls shortName="agentNewModule" project="100554" enhancement="_100554_enhancementAgent" folder="agents" />

import { IAgentAsync, IAgentMeta } from '/_100554_/l2/aiAgentBase.js';
import { getAgentStepByAgentName } from "/_100554_/l2/aiAgentHelper.js";

export function createAgent(): IAgentAsync {
  return {
    agentName: "agentNewModule",
    agentProject: 100554,
    agentFolder: "agents",
    agentDescription: "Create New Module on current project",
    visibility: "public",
    beforePromptImplicit,
    afterPromptStep
  };
}

async function beforePromptImplicit(
  agent: IAgentMeta,
  context: mls.msg.ExecutionContext,
  userPrompt: string,
): Promise<mls.msg.AgentIntent[]> {

  if (!userPrompt || userPrompt.length < 5) throw new Error('invalid prompt');

  const folders = Array.from(new Set(
    Object.values(mls.stor.files)
      .filter(f => f.project === mls.actualProject && f.level !== 3 && f.folder)
      .map(f => f.folder)
  ));

  const addMessageAI: mls.msg.AgentIntentAddMessageAI = {
    type: "add-message-ai",
    request: {
      action: 'addMessageAI',
      agentName: agent.agentName,
      inputAI: [{
        type: "system",
        content: system1.replace("{{folders}}", folders.join(", "))
      }, {
        type: "human",
        content: userPrompt
      }],
      taskTitle: `New module`,
      threadId: context.message.threadId,
      userMessage: context.message.content,
      longTermMemory: {},
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
  if (payload?.type === "result") {
    throw new Error(payload?.result);
  }
  if (payload?.type !== 'clarification' || !payload.json) throw new Error(`[afterPromptStep] invalid payload: ${payload}`)
  let status: mls.msg.AIStepStatus = 'completed';
  console.log("afterPrompt", payload.json);
  // todo: call clarification, pass intents 
  // intent[0] -> set prompt to next agent
  // intent[1] -> update status
  // intent[2] -> add new step (next agent)

  const isTest = true;
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
  const newStep: mls.msg.AgentIntentAddSteps = {
    type: "add-steps",
    steps: [{
      type: 'agent',
      stepId: 0,
      interaction: null,
      status: 'pending',
      nextSteps: [],
      agentName: "agentToBeConceptual",
      prompt: "{{clarification}}", // response 
      rags: null,
    }]
  };
  const intentsToClarification: mls.msg.AgentIntent[] = [updateStatus];
  if (!isTest) intentsToClarification.push(newStep);
  // todo: call showClarification(intentsToClarification, payload.json)
 
  return [];

}

const system1 = `
<!-- modelType: codeflash -->

You are an assistant responsible for helping create a new module in the current project for collab.codes. Your task is to analyze the user's request and return a JSON object in the format specified under 'Output format'. Use the same language as the user in the prompt.

Analyze the user's request:
- If invalid or not about creating a new system/module → return error
- If valid → return a clarification

## Already existing modules
{{folders}}

## Output format
Return only valid JSON in the following structure:
[[OutputSection1]]
`;

//#region OutputSection1
export type Output1 =
  {
    type: "clarification";
    json: Clarification1
  } | {
    type: "result"; // for errors or invalid user prompt
    result: string;
  };

export interface Clarification1 {
 userLanguage: string; // language detected in prompt, iso, ex: 'en'
  title: "Clarification 1/2";
  userPrompt: string; // put the userPrompt here, no syntax error
 questions: {
   roles: Question; // roles - e.g. 'admin', 'public', 'client', 'operator', 'financial'
   publicTarget: Question; // publicTarget
   tone: Question; // tone - e.g. Friendly, professional, and concise. Always aim to clarify without assuming.
   languages: Question; // languages - use default language from prompt, default is only one languages
   moduleName: Question; // moduleName - suggest a module name , search in "Already existing modules"
   openQuestion1: Question; // open question to clarify features,
   openQuestion2: Question; // open question to clarify features,
   openQuestion3: Question; // open question to clarify features,
  },
  legends:[ // translate
    "This is the first clarification ",
    "before creating somethings"
  ];
}

export interface Question {
 type: "open";
 question: string;
 answer: string; // AI-suggested default answer. This answer simulates how a real user would respond. Write in first person and with a natural tone.
}

//#endregion

export function getPayload1(agent: IAgentMeta, context: mls.msg.ExecutionContext): Clarification1 {
    if (!agent || !context || !context.task) throw new Error(`[${agent.agentName}](getPayload1) Invalid context or agent`);
    const agentStep = getAgentStepByAgentName(context.task, agent.agentName); // Only one agent execution must exist in this task
    if (!agentStep) throw new Error(`[${agent.agentName}](getPayload1) no agent found`);

    // get result
    const resultStep = agentStep.interaction?.payload?.[1]; // [0]-> original clarification, [1]->final clarification
    if (!resultStep || resultStep.type !== "clarification" || !resultStep.json) throw new Error(`[${agent.agentName}] [getPayload] No step clarification found for this agent.`);
    let payload1: Clarification1 = (resultStep as any).json;
    if (!payload1 || (typeof payload1 === "string") || !payload1.legends) throw new Error(`[${agent.agentName}] (getPayload1) Invalid clarification response`);

    // get userPrompt
    // payload1.userPrompt = agentStep?.interaction?.input.find((input) => input.type === 'human')?.content || '';

    return payload1;
}


