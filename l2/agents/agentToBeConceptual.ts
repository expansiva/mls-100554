/// <mls shortName="agentToBeConceptual" project="100554" enhancement="_100554_enhancementAgent" folder="agents" />

import { IAgentAsync, IAgentMeta } from '/_100554_/l2/aiAgentBase.js';

export function createAgent(): IAgentAsync {
  return {
    agentName: "agentToBeConceptual",
    agentProject: 100554,
    agentFolder: "agents",
    agentDescription: "Create New ToBe Conceptual",
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

  const inTest = true; // todo: resolve
  const addMessageAI: mls.msg.AgentIntentAddMessageAI = {
    type: "add-message-ai",
    request: {
      action: 'addMessageAI',
      agentName: agent.agentName,
      inputAI: [{
        type: "system",
        content: system2.replace("{{outputPrompt}}", outputPrompt)
      }, {
        type: "human",
        content: userPrompt
      }],
      taskTitle: agent.agentDescription,
      threadId: context.message.threadId,
      userMessage: inTest ? `test ${agent.agentName}` : 'defining ToBe conceptual',
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
  if (payload?.type === "result") {
    throw new Error(payload?.result);
  }
  if (payload?.type !== 'flexible' || !payload.result) throw new Error(`[afterPromptStep] invalid payload: ${payload}`)
  let status: mls.msg.AIStepStatus = 'completed';
  let intents: mls.msg.AgentIntent[] = [];
  try {
    const output = payload.result;
    intents = await processToBe(output as ModuleToBe);
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
  return [... intents, updateStatus];

}

async function processToBe(moduleToBe: ModuleToBe): Promise<mls.msg.AgentIntent[]> {

  console.log("=== processToBe")
  console.log(JSON.stringify(moduleToBe, null, 2));

  const step: mls.msg.AIPayload = {
    type: 'agent',
    stepId: 0,
    interaction: null,
    status: 'pending',
    nextSteps: [],
    agentName: "agentToBeConceptual2",
    prompt: "",
    rags: null,
  };
  // const rc: mls.msg.AgentIntentAddSteps = {
  //   type: 'add-steps',
  //   steps: [step]
  // }
  return [];

}

const system2 = `
<!-- modelType: claude -->
<!-- modelTypeList: geminiChat 9/10 , code (grok) 7/10, deepseekchat 2/10, codeflash (gemini) 8/10, deepseekreasoner 3/10, mini (4.1) ou nano (openai) 4/10, codeinstruct (4.1) 4/10, codereasoning(gpt5) 3/10, code2 (kimi 2.5) -->

You are a Senior Software Engineer at Collab.codes, with 25 years of hands-on experience building scalable, maintainable systems in production environments. You have led architecture decisions, code reviews, and refactors in multiple companies, always prioritizing clean design, performance, security, and long-term maintainability over quick hacks.

You will receive a user request to create a new module, followed by a clarification section containing questions and answers that provide additional context, constraints, requirements, or refinements to the original request.

Task:
Generate an ToBeFactual JSON object that strictly follows the provided JSON schema.

## Details
[[Constraints]]

{{outputPrompt}}

[[Defs1]]
`

export const outputPrompt = `
## Output format
You must return the object strictly as JSON
[[OutputSection]]
`;

//#region Constraints
const constraints = [
  'Output MUST be valid JSON only.',
  'NO indentation, NO newlines except when strictly required by JSON syntax.',
  'NO extra spaces or whitespace.',
];
//#endregion

//#region OutputSection
export type Output =
  {
    type: "flexible";
    result: ModuleToBe;
  } | {
    type: "result"; // for errors
    result: string;
  };
//#endregion 

//#region Defs1
export interface ModuleToBe {
  ontology?: OntologyDefinition;
  rules?: RulesRegistry;
  capabilities?: CapabilityMap;
}

/* =========================
 * Ontology / Domain model
 * ========================= */

export interface OntologyDefinition {
  entities: Record<string, EntityDefinition>;
}

export interface EntityDefinition {
  description?: string;

  fields: Record<string, EntityField>;

  // References business/platform rules that apply to this entity
  rules?: string[];
}

export interface EntityField {
  type: string;
  required?: boolean; // default = true
  values?: string[]; // Closed set, used for validation, DB schema and UI generation
  constraints?: string; // Free-text helper for LLMs and humans (never executable)
}

/* =========================
 * Business / Platform Rules
 * ========================= */

export interface RulesRegistry {
  [ruleId: string]: RuleDefinition;
}

export interface RuleDefinition {
  kind: "domain" | "platform" | "policy";

  description: string;

  // Declares where this rule is applicable (entities, capabilities, or global)
  scope?: string[];

  // Declarative expectations used by LLMs and humans
  acceptanceCriteria?: string[];

}

/* =========================
 * Capability Map / Use Cases
 * ========================= */

export interface CapabilityMap {
  [capabilityId: string]: CapabilityDefinition;
}

export interface CapabilityDefinition {
  description?: string;

  // References rule IDs used by this capability
  usesRules?: string[];

  // Indicates whether this capability is optional and can be enabled or disabled via admin configuration
  isOptional?: boolean; // default false

  // High-level actions exposed by this capability
  actions?: CapabilityAction[];
}

export interface CapabilityAction {
  actionId: string;
  description?: string;
}
//#endregion

