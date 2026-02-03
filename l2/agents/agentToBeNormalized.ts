/// <mls shortName="agentToBeNormalized" project="100554" enhancement="_100554_enhancementAgent" folder="agents" />

import { IAgentAsync, IAgentMeta } from '/_100554_/l2/aiAgentBase.js';
import { ModuleToBe } from '/_100554_/l2/agents/agentToBeConceptual.js';

export function createAgent(): IAgentAsync {
  return {
    agentName: "agentToBeNormalized",
    agentProject: 100554,
    agentFolder: "agents",
    agentDescription: "Normalize ToBe conceptual",
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

  const isTest = true;
  const addMessageAI: mls.msg.AgentIntentAddMessageAI = {
    type: "add-message-ai",
    request: {
      action: 'addMessageAI',
      agentName: agent.agentName,
      inputAI: [{
        type: "system",
        content: system1
      }, {
        type: "human",
        content: userPrompt
      }],
      taskTitle: agent.agentDescription,
      threadId: context.message.threadId,
      userMessage: isTest ? `test ${agent.agentName}` : agent.agentDescription,
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
  if (payload?.type !== 'flexible' || !payload.result) throw new Error(`[afterPromptStep] invalid payload: ${payload}`)
  let status: mls.msg.AIStepStatus = 'completed';
  let intents: mls.msg.AgentIntent[] = [];
  try {
    const output = payload.result;
    intents = await processOutput(output as ModuleToBe);
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

async function processOutput(moduleToBe: ModuleToBe): Promise<mls.msg.AgentIntent[]> {

  console.log("=== ModuleToBe Normalized")
  console.log(JSON.stringify(moduleToBe, null, 2));

  const isTest = true; // todo: define
  if (isTest) return [];

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

const system1 = `
<!-- modelType: geminiChat -->
<!-- modelTypeList: geminiChat 9/10 , code (grok) 7/10, deepseekchat 2/10, codeflash (gemini) 8/10, deepseekreasoner 3/10, mini (4.1) ou nano (openai) 4/10, codeinstruct (4.1) 4/10, codereasoning(gpt5) 3/10, code2 (kimi 2.5) -->


You are a senior BUSINESS Analyst with 20+ years of experience in system design,
requirements analysis, and business process optimization.

Your task is to analyze an existing TO-BE conceptual model and generate a
TO-BE NORMALIZED representation.

The TO-BE Normalized model is a NEUTRAL DOMAIN CONTRACT.
It must NOT contain UI concepts, API concepts, database technologies, or frameworks.

You must:

- Identify BOUNDED CONTEXTS and define them as domains (DDD-oriented).
- Identify AGGREGATE ROOT entities and mark them explicitly.
- Use "dataShape: aggregate" when an entity represents a composed business object.
- Use "event-derived" ONLY when data is clearly derived from domain events.
- Assign ownership using MDM semantics (system, user, shared).

Actions:
- Define DOMAIN ACTIONS (business intents), not UI or CRUD actions.
- Prefer verbs that express behavior (e.g. confirmOrder, cancelAppointment).
- Do NOT list read or search actions as domain actions.

States:
- Define only BUSINESS STATES that affect lifecycle.
- Avoid technical or UI states.

Events:
- Define DOMAIN EVENTS as immutable facts.
- Prefer specific events (e.g. OrderConfirmed) over generic ones (e.g. StatusUpdated).

Read Models:
- Define read models ONLY when they serve BI or LLM queries.
- Mark their purpose explicitly (BI, llm-query).

General rules:
- Do NOT invent functionality not present in the TO-BE model.
- Do NOT introduce technical or implementation details.
- Keep the model minimal, explicit, and semantically correct.
- Write all descriptions in the language specified in the "userLanguage" field.
- Write all domain IDs in English.

## Output format
Return only valid JSON in the following structure:
[[OutputSection]]

[[Types]]
`

//#region OutputSection
export type Output =
  {
    type: "flexible";
    result: FeatureNormalizedByDomain
  };
//#endregion

//#region Types
/* =========================
 * TO-BE Normalized (neutral contract)
 * ========================= */

export interface FeatureNormalizedByDomain {
  domains: Record<string, FeatureNormalized>; // key=domainId
}

export interface FeatureNormalized {
  domainId: string;
  description?: string;
  entities: NormalizedEntity[];
  actions: NormalizedAction[];
  states: NormalizedState[];
  events: NormalizedEvent[];
  readModels?: NormalizedReadModel[];
}

export interface NormalizedEntity {
  entityId: string;
  aggregateRoot?: boolean;
  dataShape?: DataShape;
  ownership?: EntityOwnership;
}

export type DataShape =
  | "aggregate" // one column with nested objects/arrays
  | "flat" // all columns at root level
  | "event-derived"; // data built from event sourcing

export type EntityOwnership =
  | "system" // master data owned by the system
  | "user" // user-generated data
  | "shared"; // synchronized across systems

export interface NormalizedAction {
  actionId: string;
  description?: string;
  kind?: "command" | "query"; // optional, default command
}

export interface NormalizedState {
  statePath: string; // ex: "appointment.status"
// allowedTransitions currently represents possible values,
// not explicit transitions (v0 acceptable)
  allowedTransitions?: string[];
}

export interface NormalizedEvent {
  eventId: string;
}

export interface NormalizedReadModel {
  modelId: string;
  fields: string[];
  purpose?: ('BI' | 'llm-query')[];
}
//#endregion