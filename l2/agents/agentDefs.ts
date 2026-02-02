/// <mls fileReference="_100554_/l2/agents/agentDefs.ts" enhancement="_blank" />

import { IAgentAsync, IAgentMeta } from '/_100554_/l2/aiAgentBase.js';
import { createModel } from '/_100554_/l2/collabLibModel.js';

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

  if (userPrompt) throw new Error(`[beforePromptAtomic] invalid args: '${userPrompt}'`);
  const inputs: mls.msg.IAMessageInputType[] = [
    { type: "system", content: system1 },
    { type: "human", content: await getSource(file) }
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

  let max = 20; // default max 20 files
  const match = userPrompt.trim().match(/^update\s*(\d+)?$/i);
  if (match) {
    max = match[1] ? Number(match[1]) : max;
  } else {
    throw new Error(`[afterPromptImplicit] Use one of this commands: "update" or "update 99"`)
  }

  const paths: string[] = mls.stor.findFilesNeedingDefsUpdate({ project: mls.actualProject || 0, level: 2, extension: ".ts", folder: "", shortName: "" }, new Date(2026, 0, 1))
    .map(f => mls.stor.getKeyToFile(f))
    .filter(Boolean)
    .slice(0, max); // only x first 
  if (paths.length < 1) throw new Error('no files to update defs');
  const inputs: mls.msg.IAMessageInputType[] = [{ type: "system", content: system1 }];

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

  const continueParallel: mls.msg.AgentIntentContinueParallelStep = {
    type: "continue-parallel-step",
    args,
    messageId: context.message.orderAt,
    threadId: context.message.threadId,
    taskId: context.task?.PK || '',
    hookSequential,
    parentStepId: parentStep.stepId,
    humanPrompt: await getSource(file)
  }
  return [continueParallel];

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
  try {
    const asIs = payload.result;
    await updateDefs(asIs);
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
  return [updateStatus];

}

async function getSource(file: mls.stor.IFileInfo): Promise<string> {
  // change first line to new pattern
  if (!file) throw new Error(`[beforePromptStep] invalid args, file dont exists`)
  const source = (await file.getContent()) as string | null;
  if (typeof source !== 'string' || !source) throw new Error(`[beforePromptAtomic] invalid source`)
  const array = source.split("\n");
  if (!array || array.length < 2) throw new Error('[beforePrompt] invalid source, no lines');
  const fileReference = mls.stor.convertFileToFileReference(file);
  if (!array[0].includes('fileReference')) {
    const tp = mls.common.tripleslash.parseXMLTripleSlash(array[0]).variables;
    array[0] = `/// <mls fileReference="${fileReference}" group=${tp.group || ""} enhancement=${tp.enhancemente || ""} />`
  }

  return `
FILE: ${fileReference}
LANG: typescript
BEGIN_CODE
${array.map(f => f.trim()).filter(Boolean).join("\n")}
END_CODE
`
}

async function updateDefs(defs: AsIs): Promise<void> {
  const fileReference: string = defs?.meta?.fileReference || "";
  let fileInfo = mls.stor.convertFileReferenceToFile(fileReference);
  if (!fileReference || fileInfo.project < 1) throw new Error(`Invalid step in update defs, incorrect meta fileRecerence: ${fileReference}`);

  const template = `/// <mls fileReference="${defs.meta.fileReference}" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = ${JSON.stringify(defs, null, 2)}
    `;

  const files = await mls.stor.getFiles({ ...fileInfo, loadContent: false });
  if (!files.ts) throw new Error(`[agentDefs] file .ts dont exists, defs: ${JSON.stringify(defs.meta)}`);
  const params = { ...fileInfo, content: template, versionRef: new Date().toISOString(), extension: ".defs.ts" };
  if (!files.defs) {
    await createStorFile(params);
  } else {
    await updateStorFile(params);
  }
}

async function createStorFile(params: { project: number, shortName: string, level: number, folder: string, content: string, extension: string, versionRef: string }): Promise<mls.stor.IFileInfo> {
  const file = await mls.stor.addOrUpdateFile(params);
  if (!file) throw new Error('[agentDefs] Invalid storFile');
  const path = mls.stor.getKeyToFile(params);
  console.log(`[agentDefs] creating new file: ${path}`)
  file.status = 'new';
  const fileInfo: mls.stor.IFileInfoValue = {
    content: params.content,
    contentType: 'string',
  };
  file.updatedAt = new Date().toISOString();
  await mls.stor.localStor.setContent(file, fileInfo);
  return file;
}

async function updateStorFile(params: { project: number, shortName: string, level: number, folder: string, content: string, extension: string, versionRef: string }): Promise<void> {
  const file = await mls.stor.addOrUpdateFile(params);
  if (!file) throw new Error('[agentDefs] Invalid storFile');
  const path = mls.stor.getKeyToFile(params);
  console.log(`[agentDefs] updating file: ${path}`);
  const models = mls.editor.getModels(params.project, params.shortName, params.folder, params.level);
  if (!models || !models.defs) {
    const modelDefs = await createModel(file, false, false);
    if (!modelDefs) throw new Error('[agentDefs] model .defs not created');
    modelDefs.model.setValue(params.content);
  } else {
    models.defs.model.setValue(params.content);
  }
  file.isLocalVersionOutdated = false;
  file.updatedAt = new Date().toISOString();
}

const system1 = `
<!-- modelType: code -->
<!-- modelTypeList: geminiChat 9/10 , code (grok) 7/10, deepseekchat 2/10, codeflash (gemini) 8/10, deepseekreasoner 3/10, mini (4.1) ou nano (openai) 4/10, codeinstruct (4.1) 4/10, codereasoning(gpt5) 3/10-->

You are a Senior Software Engineer at Collab.codes.

You will receive a user message containing:
FILE, LANG, and a code block delimited by BEGIN_CODE and END_CODE.

Task:
Generate an AsIsFactual JSON object that strictly follows the provided JSON schema.

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
  'Output MUST be valid JSON only.',
  'NO indentation, NO newlines except when strictly required by JSON syntax.',
  'NO extra spaces or whitespace.',
  'Any text outside JSON is a failure.',
  'Only extract information that appears literally in the provided code.',
  'No interpretation, no abstraction, no normalization.',
  'If something is not explicitly declared in code, it MUST NOT appear in the output.',
  'Do NOT create empty arrays or placeholder values.',
  'Do NOT populate optional fields unless data is explicitly present.',
  'Only list imports and dependencies that can be verified line-by-line in the code.',
  'Only list state paths that appear verbatim in the code and start with "db." or "ui.".',
  'If uncertain, omit.'
];
//#endregion

//#region OutputSection
export type Output =
  {
    type: "flexible";
    result: AsIs;
  };
//#endregion 

//#region Defs1
export interface AsIs {

  meta: {
    fileReference: string;
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
    semantic: {
      generalDescription: string; // short, like a head line
      businessCapabilities: string[]; // list all business or []
      technicalCapabilities: string[]; // list all technical or []
      implementedFeatures: string[]; // or []
      constraints?: string[]; // functional + non-functional constraints
    };
  }

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
  'service' | // (editor) tool UI

  'other'; // Miscellaneous, does not fit other types.

//#endregion

//#region Defs3
export interface DefsImports {
  ref: string; // ex: "/_100111_/page1.js"
  dependencies?: { // If an import has no named bindings, omit dependencies entirely.
    name: string; // ex: "formatCurrency"
    type?: "function" | "service" | "constant" | "interface" | "type" | "class" | "hook" | "component" | "?";
    purpose?: string; // Functional role of this dependency
  }[];
}

export type UserRole = string;
//#endregion