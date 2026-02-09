/// <mls fileReference="_100554_/l2/agents/agentToBeConceptual3.ts" enhancement="_100554_enhancementAgent" />

import { IAgentAsync, IAgentMeta } from '/_100554_/l2/aiAgentBase.js';
import { outputPrompt, Output, ModuleToBe } from '/_100554_/l2/agents/agentToBeConceptual.js';

export function createAgent(): IAgentAsync {
  return {
    agentName: "agentToBeConceptual3", 
    agentProject: 100554,
    agentFolder: "agents",
    agentDescription: "Apply suggestions",
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

  const inTest = true;
  const addMessageAI: mls.msg.AgentIntentAddMessageAI = {
    type: "add-message-ai",
    request: {
      action: 'addMessageAI',
      agentName: agent.agentName,
      inputAI: [{
        type: "system",
        content: system3.replace("{{outputPrompt}}", outputPrompt)
      }, {
        type: "human",
        content: userPrompt
      }],
      taskTitle: agent.agentDescription,
      threadId: context.message.threadId,
      userMessage: inTest ? `test ${agent.agentName}` : agent.agentDescription,
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

  const payload = (step.interaction?.payload?.[0]) as Output || undefined;
  if (payload?.type === 'result') throw new Error(`[afterPromptStep] Error: #{payload?.result} `);
  if (payload?.type !== 'flexible' || !payload.result) throw new Error(`[afterPromptStep] invalid payload: ${payload}`)
  let status: mls.msg.AIStepStatus = 'completed';
  let intents: mls.msg.AgentIntent[] = [];
  try {
    const output = payload.result;
    intents = await processOutput4(output as ModuleToBe);
  } catch (e) {
    console.error(e);
    status = 'failed';
  }
  if (step.stepId === 1) intents = []; // test mode do not advance

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
  return [...intents, updateStatus];

}

async function processOutput4(moduleToBe: ModuleToBe): Promise<mls.msg.AgentIntent[]> {

  console.log("=== ModuleToBe")
  console.log(JSON.stringify(moduleToBe, null, 2));

  const inTest = true; // todo: define
  if (inTest) return [];

  const step: mls.msg.AIPayload = {
    type: 'agent',
    stepId: 0,
    interaction: null,
    status: 'pending',
    nextSteps: [],
    agentName: "agentNewModule5",
    prompt: "",
    rags: null,
  };
  // const rc: mls.msg.AgentIntentAddSteps = {
  //   type: 'add-steps',
  //   steps: [step]
  // }
  return [];

}

/**
"t1, grok-code-fast-1, 17s, $0.0070, 8.7/10",
"t2, gpt-5.2, 60s, $0.0800, 8.3/10, **json formatting issues**",
"t3, gemini-2.5-pro, 68s, $0.0291, 7.6/10"
 */
const system3 = `
<!-- modelType: code -->
<!-- modelTypeList: geminiChat ?/10 , code (grok) ?/10, deepseekchat ?/10, codeflash (gemini) ?/10, deepseekreasoner ?/10, mini (4.1) ou nano (openai) ?/10, codeinstruct (4.1) ?/10, codereasoning(gpt5) ?/10, code2 (kimi 2.5) ?/10 -->

You are a senior BUSINESS Analyst with 20+ years of experience in system design, requirements analysis, and business process optimization.

Your task is to UPDATE an existing TO-BE conceptual model by applying a list of user-provided suggestions.

You must:
- Apply ONLY suggestions that are relevant to the TO-BE model.
- Translate each valid suggestion into concrete changes in entities, rules, or capabilities.
- When a suggestion represents an optional or configurable feature, mark the related capability with isOptional = true.
- Do NOT introduce technical or implementation details.
- Do NOT remove existing capabilities unless explicitly required by a suggestion.
- Preserve all existing rules and constraints unless a suggestion clearly extends them.
- Apply only suggestions where yagni = "now".

If the suggestions are invalid, contradictory, or not applicable to the TO-BE model, return an explicit error.

{{outputPrompt}}
`