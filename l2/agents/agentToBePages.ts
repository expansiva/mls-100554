/// <mls fileReference="_100554_/l2/agents/agentToBePages.ts" enhancement="_100554_enhancementAgent" />

import { IAgentAsync, IAgentMeta } from '/_100554_/l2/aiAgentBase.js';

export function createAgent(): IAgentAsync {
  return {
    agentName: "agentToBePages", 
    agentProject: 100554,
    agentFolder: "agents",
    agentDescription: "Generate Page List", 
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
        content: system1.replace("{{systemExperienceConstraints}}", systemExperienceConstraints)
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

  const payload = (step.interaction?.payload?.[0]) as Output || undefined;
  if (payload?.type !== 'flexible' || !payload.result) throw new Error(`[afterPromptStep] invalid payload: ${payload}`)
  let status: mls.msg.AIStepStatus = 'completed';
  let intents: mls.msg.AgentIntent[] = [];
  try {
    const output = payload.result;
    intents = await processOutput(output as ToBePages);
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

async function processOutput(experienceModel: ToBePages): Promise<mls.msg.AgentIntent[]> {

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

/*
"agentToBePages",
"t1, gemini-2.5-pro, 42s, $0.0192, 7.1/10",
"t2, gpt-5.2, 40s, $0.0477, 8.8/10",
"t3, grok-code-fast-1, 26s, $0.0036, 6.2/10",
"t4, moonshotai/kimi-k2.5, 61s, $0.0156, 5.8/10 - double deffinition of staff pages, json formatting issues, loop"*/
const system1 = `
<!-- modelType: codereasoning -->
<!-- modelTypeList: geminiChat ?/10 , code (grok) ?/10, deepseekchat ?/10, codeflash (gemini) ?/10, deepseekreasoner ?/10, mini (4.1) ou nano (openai) ?/10, codeinstruct (4.1) ?/10, codereasoning(gpt5) ?/10, code2 (kimi 2.5) ?/10 -->

You are a senior BUSINESS Analyst.

Task: Generate ToBePages from the given 'Experience Model' and 'Capabilities Summary'.

Step-by-step (MANDATORY):
1) Read screens[] from the Experience Model.
2) For each screens[i], create exactly one pages[i].
3) pages[i].screenId MUST equal screens[i].screenId (same order, 1:1).
4) Do not create extra pages and do not skip screens.

Rules:
- Do NOT invent screens/pages that are not in screens[].
- Navigation is handled by the AppShell; pages must NOT include menus/tabs/navigation controls.
- Sections are content containers. If a section uses tabs/panels, set mode="exclusive" (only one organism visible at a time).
- Organisms are layout containers with a single purpose (no business logic).
- Do NOT define molecules or atoms yet.
- Do NOT define technical implementation.
- You MUST follow experienceConstraints when deciding organisms and interaction patterns.

{{systemExperienceConstraints}}

## Output format
You must return the object strictly as JSON, no spaces, no indent, minified
[[OutputSection]]
`
export const systemExperienceConstraints = `
## Experience Constraints
[[ExperienceConstraints]]
`

//#region ExperienceConstraints 
const experienceConstraints = {
  navigationMode: "state-driven",
  listLoadingPattern: "infinite-scroll",
  // pagination | load-more | infinite-scroll
  dialogPattern: "modal",
  // modal | inline | none
  allowPopups: false,

  allowMultiplePanels: false,
  // false -> Prefer tab-based layout for complex entity screens (identification, relationships, contracts, incidents).
  // true  -> Allow multiple panels visible at the same time (modern stacked layout).

  preferInlineEditing: true,
  preferOptimisticUpdates: true,
  navigationContainer: "appShell",
  screenPersistence: "keep-alive",
  layoutStructure: {
    separateContextSection: true,
    // true = create "header" section for contextual organisms
    // false = allow context organisms inside "main"
    preferSingleMainSection: false,
    // true = collapse all organisms into "main"
    allowedSections: ["header", "main", "aside", "footer"],
    contextSectionName: "header",
    mainSectionName: "main"
  }
}
//#endregion


//#region OutputSection
export type Output = {
  type: "flexible";
  result: ToBePages;
};
export interface ToBePages {
  pages: Page[];
}
export interface Page {
  screenId: string;
  pageName: string; // ex: listProducts
  actor: string;
  purpose: string;
  sections: Section[];
}
export interface Section {
  sectionName: string; // main, aside, header, footer, ...
  mode: "stack" | "exclusive";
  organisms: Organism[];
}
export interface Organism { 
  organismName: string;  // e.g. "listProductsTop5", always prefixed with pageName in camelCase
  purpose: string;       // Short description of the organism's single responsibility
  fieldsets?: string[];  // Optional: list of thematic groups inside this organism (e.g. ["Personal Data", "Addresses", "Preferences"])
                         // Each string represents a <fieldset> + <legend> grouping of related form fields.
                         // Used only when the organism contains a complex form that benefits from semantic grouping.
}
//#endregion


