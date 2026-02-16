/// <mls fileReference="_100554_/l2/agents/agentToBePage.ts" enhancement="_100554_enhancementAgent" />

import { IAgentAsync, IAgentMeta } from '/_100554_/l2/aiAgentBase.js';
import { systemExperienceConstraints } from '/_100554_/l2/agents/agentToBePages.js';

const templateReference = "_100554_/l2/agents/agentToBePageTemplate.ts";
const templateReferenceTest = "_100554_/l2/agents/agentToBePageTemplate.test.ts";

export function createAgent(): IAgentAsync {
  return {
    agentName: "agentToBePage",
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

Task: Generate a page and descriptions to organisms given 'Experience Model Page' and 'ToBe Summary' and 'Template Page'.

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

export const systemSkillAura = `
## Skill — Frontend Architecture — Collab Aurea

This document defines the official frontend architecture, design principles, and responsibilities for building applications using Collab Aurea.
All components, pages, and integrations MUST follow these rules.

## Core Architecture Principles
### Atomic Design Structure
The frontend follows Atomic Design, with the following hierarchy:
- Page → Top-level screen and orchestration layer
- Organism → Complex UI sections composed of molecules and plugins
- Molecule → Reusable UI components, presentation-only
- Plugin → Integration components that communicate with external services
Each level has a strict responsibility and separation of concerns.

### Technology Stack
- Use Lit 3 to build Web Components
- Do NOT use Shadow DOM
- Use Tailwind CSS for styling
- Use SPA (Single Page Application) architecture
- Each page corresponds to a URL entry point

### Backend Communication Model
Follow the BFF (Backend for Frontend) pattern.
Frontend MUST communicate with backend routines using the BFF abstraction layer.
All backend communication MUST go through the frontend backend gateway (beInvoke or equivalent).
Direct backend calls outside this abstraction are NOT allowed.

### Data Fetching Strategy
Use Stale-While-Revalidate (SWR) strategy for optimal perceived performance.
This means:
- First attempt to load data from local IndexedDB (fast response)
- Mark data consistency as "stale"
- Then fetch fresh data from backend
- Update state and IndexedDB when backend responds
- Mark data consistency as "fresh"
This improves performance and user experience.

## State Management
Global state is used by pages and organisms.
State naming:
ui.[pageName].[stateName]
Examples:
ui.productDetail.product  
ui.productDetail.productConsistency  
ui.productDetail.onLoadMore  
State types:
- Data state → holds UI data
- Event state → triggers actions (example: onUpdateUser)
Rules:
- Pages MUST NOT pass data to organisms via properties, prefer states.
- Molecules MUST NOT access global state.

## Page Definitions
A Page is a Web Component responsible for orchestrating the entire screen.
Responsibilities:
- Entry point of the user interface
- Each page corresponds to a URL
- Render the overall layout
- Render organisms and plugins
- Own business logic
- Communicate with backend using BFF
- Manage state lifecycle
- Define state contracts for child organisms
- Implement data fetching using SWR pattern
Pages MUST:
- Follow business rules
- Render SPA-compatible HTML
- Render organisms and sections inside a root <div>
- Orchestrate tabs and conditional content if needed
- Update state based on backend responses
Pages MUST NOT:
- Contain reusable UI logic that belongs in organisms
- Contain reusable UI components that belong in molecules
Testing:
Each page MUST have a corresponding test file:
pageName.test.ts
Tests MUST verify:
- Business logic
- State transitions
- Backend communication behavior

## Organism Definitions
Organisms are Web Components responsible for rendering complex UI sections.
Responsibilities:
- Render layout sections
- Combine molecules and plugins
- Receive data via global states
- Emit events via state updates
Organisms MUST:
- Follow defined property contracts
- Be reusable within the project
Organisms MUST NOT:
- Communicate directly with backend
- Own business logic
- Fetch data
Testing:
Each organism MUST have:
organismName.test.ts
Tests MUST verify:
- Layout rendering
- Property handling
- State-driven rendering behavior

## Molecule Definitions
Molecules are reusable UI components.
Responsibilities:
- Render UI elements
- Be highly reusable
- Be presentation-only
Molecules MUST:
- Receive data only via properties
- Be stateless regarding global application state
Molecules MUST NOT:
- Access global state
- Communicate with backend
- Contain business logic

## Plugin Definitions
Plugins are Web Components responsible for integrating with external services.
Examples:
- Payment platforms
- External APIs
- Third-party integrations
- Analytics services
Plugins MAY:
- Communicate with external services
- Provide integration functionality
Plugins MUST NOT:
- Contain core business logic of the application
- Own application state

## Folder and File Organization
All frontend files MUST follow this structure:
_[projectId]_/l2/[moduleName]/[componentName].[extension]
Definitions:
- projectId → numeric project identifier (example: 100111)
- l2 → frontend layer
- moduleName → module name or folder
- componentName → component name using camelCase
- extension → file type (ts, test.ts, defs.ts, css, etc.)
Import rules:
- Always use absolute project-based imports 
Example:
import "/_100111_/l2/user/userProfileOrganism.js";

All generated frontend code MUST strictly follow this architecture.
`;

//   pageTestSource: string; // follow template Page Test

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

  organismsToCreate: OrganismToCreate[];
  pluginsToCreate?: PluginToCreate[];
}
export interface OrganismToCreate {

  organismName: string;
  // Must be prefixed with the pageName in camelCase.

  imports: string[];
  // List of modules or types the organism must import.

  states: string[];
  // List of all global state keys the organism will access.
  // Must use the pageState type, ex: 'page.user.name'

  purpose: string;
  // Short, single-responsibility description of what the organism renders or controls.
  // Must describe UI responsibility, not business logic.

  supportsCapabilities: string[];
  // List of capability IDs supported by this organism.

  rulesApplied?: string[];
  // List of rule IDs that influence this organism's behavior or presentation.

  fieldsets?: string[];
  // Optional: list of thematic groups inside this organism
  // (e.g. ["Personal Data", "Addresses", "Preferences"])
  // Each string represents a <fieldset> + <legend> grouping of related form fields.
  // Used only when the organism contains a complex form that benefits from semantic grouping.

}
export interface PluginToCreate {

  pluginName: string;
  // Example: pluginWhatsAppConsultation

  contractName: string;
  // Example: whatsapp

  purpose: string;
  // What the plugin does

  methods: PluginMethod[];

  supportsCapabilities: string[];

  rulesApplied?: string[];

}
export interface PluginMethod {

  methodName: string;
  // Example: openConsultation
  // pluginInvoke("whatsapp.openConsultation", {...})

  params: string[];

  returnType: string;

}

//#endregion


