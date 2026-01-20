/// <mls shortName="agentDefs" project="100554" enhancement="_100554_enhancementAgent" folder="agents" />

import { IAgentAsync, IAgentMeta } from '/_100554_/l2/aiAgentBase.js';
import { getSource } from '/_100554_/l2/aiPrompts.js'

export function createAgent(): IAgentAsync {
  return {
    agentName: "agentDefs",
    agentProject: 100554,
    agentFolder: "agents",
    agentDescription: "Create or Update Defs",
    visibility: "public",
    beforePromptAtomic,
    beforePromptImplicit,
    beforePromptStep,
    afterPromptStep
  };
}

async function beforePromptAtomic(
  agent: IAgentMeta,
  context: mls.msg.ExecutionContext,
  file: mls.stor.IFileInfo,
  userPrompt: string,
): Promise<mls.msg.AgentIntent[]> {

  if (!userPrompt) throw new Error(`[beforePromptAtomic] invalid args: '${userPrompt}'`);
  const source = (await file.getContent()) as string | null;
  if (typeof source !== 'string' || !source) throw new Error(`[beforePromptAtomic] invalid source`)

  const inputs: mls.msg.IAMessageInputType[] = [
    { type: "system", content: system1 },
    { type: "human", content: source }
  ]

  const addMessageAI: mls.msg.AgentIntentAddMessageAI = {
    type: "add-message-ai",
    request: {
      action: 'addMessageAI',
      agentName: agent.agentName,
      inputAI: inputs,
      taskTitle: `Generating defs file ${mls.stor.getShortPath(file)}`,
      threadId: context.message.threadId,
      userMessage: context.message.content,
      longTermMemory: {}
    }
  }
  return [addMessageAI];

};

async function beforePromptImplicit(
  agent: IAgentMeta,
  context: mls.msg.ExecutionContext,
  userPrompt: string,
): Promise<mls.msg.AgentIntent[]> {

  if (userPrompt !== "update") throw new Error(`[afterPromptImplicit] Use one of this commands: "update"`)

  const paths: string[] = mls.stor.findFilesNeedingDefsUpdate({ project: mls.actualProject || 0, level: 2 })
    .map(f => mls.stor.getKeyToFile(f))
    .filter(Boolean)
    .slice(0, 5); // only 5 first, test

  const inputs: mls.msg.IAMessageInputType[] = [
    { type: "system", content: system1 },
  ];

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
  if (!args) throw new Error(`[beforePromptStep] args invalid`)
  const file = mls.stor.files[args];
  if (!file) throw new Error(`[beforePromptStep] invalid args, file dont exists: ${args}`)
  const source = (await file.getContent()) as string | null;
  if (typeof source !== 'string' || !source) throw new Error(`[beforePromptAtomic] invalid source`)

  const continueParallel: mls.msg.AgentIntentContinueParallelStep = {
    type: "continue-parallel-step",
    args,
    messageId: context.message.orderAt,
    threadId: context.message.threadId,
    taskId: context.task?.PK || '',
    hookSequential,
    parentStepId: parentStep.stepId,
    humanPrompt: source
  }
  return [continueParallel];

}

async function afterPromptStep(
  agent: IAgentMeta,
  context: mls.msg.ExecutionContext,
  step: mls.msg.AIAgentStep
): Promise<mls.msg.AgentIntent[]> {
  if (!agent || !context || !step) throw new Error(`[afterPromptStep] invalid args`);
  const updateStatus: mls.msg.AgentIntentUpdateStatus = {
    type: 'update-status',
    step,
    status: "completed"
  };
  return [updateStatus];

}

const system1 = `
<!-- modelType: code -->
<!-- modelTypeList: geminiChat, code (grok), deepseekchat, codeflash, deepseekreasoner, mini (4.1) ou nano (openai), codeinstruct -->

You are a Senior Software Engineer at Collab.codes.

Your task is to analyze the TypeScript code provided in the user message and generate structured documentation (BaseDefs) for the component.

This documentation will be used for search, filtering, and AI-driven development workflows.

## Details
[[SudoLang]]

## Output format
You must return the object strictly as JSON
[[OutputSection]]

[[Defs1]]
[[Defs2]]
[[Defs3]]
`

//#region SudoLang
const constraints = [
  'Always output valid JSON only.',
  'NO indentation, NO newlines except when strictly required by JSON syntax.',
  'NO extra spaces or whitespace.',
  'Only include data that can be directly and confidently derived from the code',
  'Only include states that start with "db." or "ui." prefix, as these are the global states',
  'Only declare imports and dependencies that are ACTUALLY present in the code. Do NOT invent or assume any imports/dependencies.'
]
//#endregion

//#region OutputSection
export type Output =
  {
    type: "flexible";
    result: BaseDefs;
  };
//#endregion

//#region Defs1
export interface BaseDefs {

  meta: {
    projectId: number;
    folder: string;
    shortName: string;
    componentType: ComponentType;
    componentScope: ComponentScope;
    executionRegions?: string[]; // ['BR', 'PT']
    languages?: string[]; // ['en', 'pt', 'es']
    group?: string; // Ex: module group, 'CRM', 'CA'

    /**
     * Development fidelity level, indicating the stage of development.
     * - 'draft': Initial concept, not functional.
     * - 'wireframe': Basic layout, no functionality.
     * - 'scaffold': Functional skeleton, minimal features.
     * - 'final': Fully functional, ready for production.
     */
    devFidelity?: 'draft' | 'wireframe' | 'scaffold' | 'final';
  };

  references?: {
    webComponents?: string[]; // ex: ["molecule-selectone-dropdown"]
    imports?: DefsImports[];
    statesRO?: string[]; // ex: "db.table1.field1", "ui.page1.name"
    statesRW?: string[];
    statesWO?: string[];
  };

  codeInsights?: {
    todos?: string[];
    securityWarnings?: string[];
    unusedImports?: string[];
    deadCodeBlocks?: string[];
    accessibilityIssues?: string[];
    i18nWarnings?: string[]; // strings that should be translated, only if i18n is enabled and if string is essential
    performanceHints?: string[];
  };

  auth?: {
    view?: UserRole[];
    edit?: UserRole[];
    use?: UserRole[];
    restrictReason?: string;
  };

  asIs: {
    generalDescription?: string;
    goal?: string;
    businessCapabilities: string[]; // all business already implemented
    implementedFeatures: string[];
    constraints?: string[]; // functional + non-functional constraints
  };

  toBe?: {
    pendingEnhancements?: string[];
    userRequestsFeatures?: string[]; // User feature requests
    userRequestsBugs?: string[]; // User bug reports
    userRequestsEnhancements?: string[]; // User suggestions for improvements
  };

}
//#endregion

//#region Defs2
export type ComponentScope =
  'appFrontEnd' | // shipped to customer application
  'appBackEnd' | // shipped to customer application
  'editor'; // internal to Collab.codes only

export type ComponentType =
  'page' | // (appFrontEnd) Full-screen view with its own route (e.g. /petshop/dashboard). Contains front-end business logic and calls back-end services.
  'organism' | // (appFrontEnd) Sections inside page. Contains front-end business logic and calls back-end services.
  'molecule' | // (appFrontEnd) reusable web component. Used inside organisms.
  'miniapp' | // (appFrontEnd) Self-contained application with its own navigation, usually one page, e.g., temperature converter, calculator.

  // === PLUGIN SYSTEM ===
  'pluginUI' | // (appFrontEnd) Front-end part of a plugin (buttons, widgets, config pages visible to the customer)
  'pluginSettings' | // (editor) Editor panel to configure a plugin (icon in toolbar, never shipped)

  // === BACK-END PURE ===
  'entity' | // (appBackEnd) data model (DB schema, ORM entity). Defines tables, fields, relations.
  'controller' | // (appBackEnd) Handles API endpoint requests: validates input and authorization, then executes the appropriate use case.
  'useCase' | // (appBackEnd) business logic unit. Encapsulates specific operations, called by controllers.
  'repository' | // (appBackEnd) data access layer. Interfaces with the database, performs CRUD operations.
  'hook' | // (appBackEnd) event handler or middleware (e.g., webhooks, auth guards).

  // === EDITOR ===
  'editorService' | // (editor) Editor-only panel or toolbar.
  'agent' | // (editor) Specialized LLM orchestrator (prepares prompts, chains tools, etc.).
  'tool' | // (editor) Reusable function or module (e.g., data processing, integrations).

  'other'; // Miscellaneous, does not fit other types.

//#endregion

//#region Defs3
export interface DefsImports {
  ref: string; // ex: "/_100111_/page1.js"
  dependencies: DefsDependency[]
}

/**
 * Represents a shared service, helper or reusable logic dependency.
 */
export interface DefsDependency {
  name: string; // ex: "formatCurrency"
  type?: DependencyType;
  purpose?: string; // Functional role of this dependency
}

export type DependencyType =
  | "function"
  | "service"
  | "constant"
  | "interface"
  | "type"
  | "class"
  | "hook"
  | "component";

export type UserRole = string;
//#endregion