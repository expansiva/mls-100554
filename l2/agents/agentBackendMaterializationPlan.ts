/// <mls shortName="agentBackendMaterializationPlan" project="100554" enhancement="_100554_enhancementAgent" folder="agents" />

import { IAgentAsync, IAgentMeta } from '/_100554_/l2/aiAgentBase.js';

export function createAgent(): IAgentAsync {
  return {
    agentName: "agentBackendMaterializationPlan",
    agentProject: 100554,
    agentFolder: "agents",
    agentDescription: "Backend Materialization Plan",
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
        content: system3
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
  if (payload?.type !== 'flexible' || !payload.result) throw new Error(`[afterPromptStep] invalid payload: ${payload}`)
  let status: mls.msg.AIStepStatus = 'completed';
  let intents: mls.msg.AgentIntent[] = [];
  try {
    const output = payload.result;
    intents = await processOutput(output as BackendMaterializationPlan);
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

async function processOutput(backendMaterializationPlan: BackendMaterializationPlan): Promise<mls.msg.AgentIntent[]> {

  console.log("=== Materialization Plan")
  console.log(JSON.stringify(backendMaterializationPlan, null, 2));

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

const system3 = `
<!-- modelType: geminiChat -->
<!-- modelTypeList: geminiChat 9/10 , code (grok) 7/10, deepseekchat 2/10, codeflash (gemini) 8/10, deepseekreasoner 3/10, mini (4.1) ou nano (openai) 4/10, codeinstruct (4.1) 4/10, codereasoning(gpt5) 3/10, code2 (kimi 2.5) -->

You are a senior BUSINESS ANALYST and SOLUTION ARCHITECT with 20+ years of experience in system design, domain modeling, and backend architecture.

Your task is to analyze:
- a TO-BE conceptual model
- a TO-BE normalized-by-domain model

And generate a MATERIALIZED BACKEND PLAN for a single Domain.

---

## Mandatory rules (do NOT ignore)

1. **Reuse first**
   Before creating any new entity, you MUST verify if it already exists in a known module such as:
   - MDM
   - Finance
   - Inventory
   - CRM

   If reused or extended, mark:
   - entity.source = "existing" or "extended"
   - add a decision of type "reuse-existing-module" or "extend-existing-module"

2. **Avoid unnecessary tables**
   Do NOT create separate entities or tables unless strictly necessary.

   Prefer:
   - document-oriented persistence
   - single aggregate roots with embedded structures
   - JSON-style storage (e.g. Order with embedded OrderItems)

3. **Explicit persistence decisions**
   For each entity, decide and justify:
   - flat vs aggregate
   - document-style vs separate entities

   All non-trivial choices MUST be recorded in "decisions".

4. **Commands are authoritative**
   - Commands represent real backend use-cases
   - Do not create commands without clear business intent
   - Each command must map to an action and optional rules

5. **No assumptions**
   If information is missing:
   - make a reasonable assumption
   - record it as a decision with clear reasoning

---

## Output format

You MUST return strictly valid JSON.
No explanations outside JSON.
No comments.
No markdown.

[[OutputSection]]
`;

//#region OutputSection
export type Output =
  {
    type: "flexible";
    result: BackendMaterializationPlan;
  }

/* =========================
 * Materialized Backend
 * ========================= */

export interface BackendMaterializationPlan {
  domains: Record<string, BackendMaterializationResult>; // key = domainId

  decisions?: MaterializationDecision[];
  warnings?: string[];
}

export interface BackendMaterializationResult {
  domainId: string;

  // New or updated backend artifacts
  entities: MaterializedEntity[];
  commands: MaterializedCommand[];
  events: MaterializedEvent[];
  readModels?: MaterializedReadModel[];

  // Metadata for orchestration and auditing
  warnings?: string[];
  decisions?: MaterializationDecision[];
}

export interface MaterializedEntity {
  entityId: string;

  // How this entity is persisted in the backend
  persistence: {
    kind: "derived" | "event-log" | string;
    storageShape: "aggregate" | "flat";
  };

  // Indicates reuse or change of existing backend structures
  source: "existing" | "extended" | "new";

  // Logical schema (not SQL / Dynamo syntax)
  schema: Record<string, string>;

  // Optional embedded entities (ex: Address inside Customer)
  embedded?: string[];
}

export interface MaterializedCommand {
  commandId: string; // same as actionId

  entityId: string; // aggregate root

  input: Record<string, string>;
  output?: Record<string, string>;

  // Validation and side effects
  validatesStates?: string[];
  emitsEvents?: string[];

  // relations
  rules: string[]; // rules name used in this command
  actions: string[]; // actions used in this command

  // Execution style
  execution: "sync" | "async";
}

export interface MaterializedEvent {
  eventId: string;

  entityId: string;

  // How the event is stored or published
  persistence: "append-only" | "derived-only";

  // Used by projections / BI / LLM
  payloadSchema?: Record<string, string>;
}

export interface MaterializedReadModel {
  modelId: string;

  sourceEvents: string[];

  fields: Record<string, string>;

  purpose: ("BI" | "llm-query")[];

  // How it is updated
  updateStrategy: "event-driven" | "scheduled";
}

export interface MaterializationDecision {
  type:
    | "reuse-existing-module"
    | "extend-existing-module"
    | "override-tobe-definition"
    | "constraint-adjustment";

  moduleName: string;
  target: string; // domainId | entityId | field | commandId | readModelId
  reason: string;
}

//#endregion 