/// <mls shortName="agentToBeConceptual2" project="100554" enhancement="_100554_enhancementAgent" folder="agents" />

import { IAgentAsync, IAgentMeta } from '/_100554_/l2/aiAgentBase.js';

export function createAgent(): IAgentAsync {
  return {
    agentName: "agentToBeConceptual2",
    agentProject: 100554,
    agentFolder: "agents",
    agentDescription: "Improve ToBe conceptual",
    visibility: "private",
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

  const addMessageAI: mls.msg.AgentIntentAddMessageAI = {
    type: "add-message-ai",
    request: {
      action: 'addMessageAI',
      agentName: agent.agentName,
      inputAI: [{
        type: "system",
        content: system3
      }, {
        type: "human",
        content: userPrompt
      }],
      taskTitle: agent.agentDescription,
      threadId: context.message.threadId,
      userMessage: `test ${agent.agentName}`,
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

  const payload = (step.interaction?.payload?.[0]) as Output3 || undefined;
  if (payload?.type !== 'flexible' || !payload.result) throw new Error(`[afterPromptStep] invalid payload: ${payload}`)
  let status: mls.msg.AIStepStatus = 'completed';
  let intents: mls.msg.AgentIntent[] = [];
  try {
    const output = payload.result;
    intents = await processOutput3(output as Suggestions);
  } catch (e) {
    console.error(e);
    status = 'failed';
  }

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
  return [];
  // return [...intents, updateStatus];

}

async function processOutput3(moduleToBe: Suggestions): Promise<mls.msg.AgentIntent[]> {

  console.log("=== Suggestions")
  console.log(JSON.stringify(moduleToBe, null, 2));

  const inTest = true; // todo: define
  if (inTest) return [];
  const step: mls.msg.AIPayload = {
    type: 'agent',
    stepId: 0,
    interaction: null,
    status: 'pending',
    nextSteps: [],
    agentName: "agentToBeConceptual3",
    prompt: "",
    rags: null,
  };
  // const rc: mls.msg.AgentIntentAddSteps = {
  //   type: 'add-steps',
  //   steps: [step]
  // }
  return [];

}

const system3 = `
<!-- modelType: geminiChat -->
<!-- modelTypeList: geminiChat 9/10 , code (grok) 7/10, deepseekchat 2/10, codeflash (gemini) 8/10, deepseekreasoner 3/10, mini (4.1) ou nano (openai) 4/10, codeinstruct (4.1) 4/10, codereasoning(gpt5) 3/10, code2 (kimi 2.5) -->

You are a senior BUSINESS Analyst with 20+ years of experience in system design, requirements analysis, and business process optimization.

Your task is to review a generated TO-BE conceptual model and identify between 1 and 20 business improvements.

Focus on gaps, enhancements, or opportunities related to:
- Business capabilities
- Policies and rules
- Customer experience
- Revenue, retention, or operational efficiency

## CRITICAL INSTRUCTIONS
- Each suggestion MUST be a short, business-focused command (imperative form).
- Keep each suggestion under 250 characters.
- Focus ONLY on business value.
- Do NOT mention technical implementation, frameworks, or architecture.
- Do NOT explain the suggestions.
- All suggestions must be written in the language specified by the "userLanguage" field.

## OPTIONAL SUGGESTIONS
- Some suggestions may represent OPTIONAL or CONFIGURABLE capabilities that can be enabled or disabled by the client via an admin interface.

## Output format
You must return the object strictly as JSON
[[OutputSection]]
`

//#region OutputSection
export type Output3 =
  {
    type: "flexible";
    result: Suggestions;
  };
export interface Suggestions {
  suggestions: Suggestion[];
}
export interface Suggestion {
  suggestion: string;
  customerPerception: string;
  businessImpact: string[];
  requiresConfiguration: boolean; // feature requires user setup in admin console
  yagni: "now" | "later" | "unknown"; // YAGNI (You Ain’t Gonna Need It)
}
//#endregion


