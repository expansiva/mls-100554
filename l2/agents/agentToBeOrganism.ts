/// <mls fileReference="_100554_/l2/agents/agentToBeOrganism.ts" enhancement="_100554_enhancementAgent" />

import { IAgentAsync, IAgentMeta } from '/_100554_/l2/aiAgentBase.js';
import { systemExperienceConstraints } from '/_100554_/l2/agents/agentToBePages.js';
import { systemSkillAura } from '/_100554_/l2/agents/agentToBePage.js';

const templateReference = "_100554_/l2/agents/agentToBeOrganismTemplate.ts";
const templateReferenceTest = "_100554_/l2/agents/agentToBeOrganismTemplate.test.ts";

export function createAgent(): IAgentAsync {
  return {
    agentName: "agentToBeOrganism",
    agentProject: 100554,
    agentFolder: "agents",
    agentDescription: "Implement Page",
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

  const templatePage: string = await loadTemplate(templateReference);
  const templateTest: string = await loadTemplate(templateReferenceTest);

  const addMessageAI: mls.msg.AgentIntentAddMessageAI = {
    type: "add-message-ai",
    request: {
      action: 'addMessageAI',
      agentName: agent.agentName,
      inputAI: [{
        type: "system",
        content: system1
          .replace("{{systemExperienceConstraints}}", systemExperienceConstraints)
          .replace("{{systemSkillAura}}", systemSkillAura)
          .replace("{{templatePage}}", templatePage)
          .replace("{{templateTest}}", templateTest)
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
    intents = await processOutput(output as ImplementPages);
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
  return [...intents, updateStatus];

}

async function loadTemplate(fileReference: string): Promise<string> {
  const info = mls.stor.convertFileReferenceToFile(fileReference);
  const key = mls.stor.getKeyToFile(info);
  let templatePage = await mls.stor.files[key]?.getContent('');
  if (typeof templatePage !== 'string' || !templatePage) throw new Error(`Template not found: ${fileReference}`);
  templatePage = "\n```typescript\n" + templatePage.replace(/```/g, "'''") + "\n```\n"
  return templatePage;
}

async function processOutput(implementPages: ImplementPages): Promise<mls.msg.AgentIntent[]> {

  const inTest = true; // todo: define
  console.log("=== Page ");
  console.log(implementPages?.pageSource?.join("\n"));
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

*/
const system1 = `
<!-- modelType: codereasoning -->
<!-- modelTypeList: geminiChat ?/10 , code (grok) ?/10, deepseekchat ?/10, codeflash (gemini) ?/10, deepseekreasoner ?/10, mini (4.1) ou nano (openai) ?/10, codeinstruct (4.1) ?/10, codereasoning(gpt5) ?/10, code2 (kimi 2.5) ?/10 -->

You are a senior Frontend Architect and Staff Software Engineer with 20+ years of experience building large-scale web applications using TypeScript, Lit, and state-driven architectures.

You must generate production-ready code that compiles without errors.

Task: Generate a organism given 'Experience Model Organism' and 'PageDefs' and 'Template Page'.

{{systemExperienceConstraints}}

{{systemSkillAura}}

## Template Page
{{templatePage}}

## Template Test
{{templateTest}}

## Output format
You must return the object strictly as JSON, no spaces, no indent, minified
[[OutputSection]]
`
// You MUST remove all comments between LLM_REMOVE_START and LLM_REMOVE_END.

//#region OutputSection
export type Output = {
  type: "flexible";
  result: ImplementPages;
};
export interface ImplementPages {
  pageSource: string[];
  // follow 'Template Page'

  testSource: string[];
  // follow 'Template Test'

  codeInsights?: {
    todos?: string[];
    securityWarnings?: string[];
    unusedImports?: string[];
    accessibilityIssues?: string[];
    i18nWarnings?: string[]; // strings that should be translated, only if i18n is enabled and if string is essential
    performanceHints?: string[];
  };

  moleculesToCreate: MoleculesToCreate[];
}
export interface MoleculesToCreate {

  moleculeName: string;
  // Must be prefixed with "molecule", in camelCase.

  purpose: string;
  // Short, description of what the molecule renders or controls.

  businessCapabilities: string[];
  technicalCapabilities: string[];
  implementedFeatures: string[];
  constrains: string[];

  properties?: string[];
}
//#endregion
