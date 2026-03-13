/// <mls fileReference="_100554_/l2/agents/agentToBeOrganism.ts" enhancement="_100554_/l2/enhancementAgent" />

import { IAgentAsync, IAgentMeta } from '/_100554_/l2/aiAgentBase.js';
import { systemExperienceConstraints } from '/_100554_/l2/agents/agentToBePages.js';
import { systemSkillAura, OrganismToCreate } from '/_100554_/l2/agents/agentToBePage.js';
import { getModuleToBeInfo } from '/_100554_/l2/moduleToBeAST.js';
import { ModuleToBe, RulesRegistry } from '/_100554_/l2/agents/agentToBeConceptual.js';

const templateReference = "_100554_/l2/agents/agentToBeOrganismTemplate.ts";
const templateReferenceTest = "_100554_/l2/agents/agentToBeOrganismTemplate.test.ts";

export function createAgent(): IAgentAsync {
  return {
    agentName: "agentToBeOrganism",
    agentProject: 100554,
    agentFolder: "agents",
    agentDescription: "Implement Organism",
    visibility: "private",
    beforePromptImplicit,
    beforePromptStep,
    afterPromptStep
  };
}

async function beforePromptImplicit(
  agent: IAgentMeta,
  context: mls.msg.ExecutionContext,
  userPrompt: string,
): Promise<mls.msg.AgentIntent[]> {

  if (!userPrompt) throw new Error('invalid prompt');

  let userData: { pageFileInfo?: mls.stor.IFileInfoBase, organismsToCreate?: OrganismToCreate[], moduleName?: string } = {};

  if (userPrompt === 'test') {
    userData.pageFileInfo = { "project": 100554, "level": 2, "shortName": "homePage", "folder": "petShop", "extension": ".ts" }
    userData.moduleName = 'petShop'
    userData.organismsToCreate = [{ "organismName": "homeHeroHighlights", "imports": ["import{html,HTMLTemplateResult}from'lit';", "import{customElement}from'lit/decorators.js';", "import{StateLitElement}from'/_100554_/l2/stateLitElement.js';", "import{getState}from'/_100554_/l2/collabState.js';", "import{pageState}from'/_100554_/l2/petShop/homePage.js';"], "states": ["pageState.home.hero"], "purpose": "Renderizar o hero da home com título/subtítulo e CTA para levar o usuário ao catálogo/campanhas em destaque.", "supportsCapabilities": ["CATALOG_BROWSING"], "rulesApplied": ["RULE-LANGUAGE-PTBR-001", "RULE-TONE-VOICE-001", "RULE-DESIGN-STYLE-001"] }, { "organismName": "homeQuickSearchEntry", "imports": ["import{html,HTMLTemplateResult}from'lit';", "import{customElement,state}from'lit/decorators.js';", "import{StateLitElement}from'/_100554_/l2/stateLitElement.js';", "import{setState}from'/_100554_/l2/collabState.js';"], "states": [], "purpose": "Exibir um campo de busca rápida (texto livre) e disparar navegação state-driven para resultados do catálogo.", "supportsCapabilities": ["CATALOG_BROWSING"], "rulesApplied": ["RULE-LANGUAGE-PTBR-001", "RULE-TONE-VOICE-001"] }, { "organismName": "homeFeaturedProducts", "imports": ["import{html,HTMLTemplateResult,repeat}from'lit';", "import{customElement}from'lit/decorators.js';", "import{StateLitElement}from'/_100554_/l2/stateLitElement.js';", "import{getState,setState}from'/_100554_/l2/collabState.js';", "import{pageState,Consistency,ProductCardVM}from'/_100554_/l2/petShop/homePage.js';"], "states": ["pageState.home.featured.items", "pageState.home.featured.hasMore", "pageState.home.featured.consistency", "pageState.ui.loading", "pageState.ui.error"], "purpose": "Renderizar a vitrine de produtos em destaque com cards e gatilho de carregamento incremental (infinite scroll).", "supportsCapabilities": ["CATALOG_BROWSING"], "rulesApplied": ["RULE-ECOMMERCE-CORE-001", "RULE-INVENTORY-CONTROL-001", "RULE-DESIGN-STYLE-001"] }, { "organismName": "homeMainCategories", "imports": ["import{html,HTMLTemplateResult,repeat}from'lit';", "import{customElement}from'lit/decorators.js';", "import{StateLitElement}from'/_100554_/l2/stateLitElement.js';", "import{getState}from'/_100554_/l2/collabState.js';", "import{pageState,CategoryVM}from'/_100554_/l2/petShop/homePage.js';"], "states": ["pageState.home.categories"], "purpose": "Exibir grid/lista de categorias principais para entrada rápida no catálogo filtrado.", "supportsCapabilities": ["CATALOG_BROWSING"], "rulesApplied": ["RULE-PRODUCT-CATEGORIES-001", "RULE-DESIGN-STYLE-001"] }, { "organismName": "homeLatestBlogPosts", "imports": ["import{html,HTMLTemplateResult,repeat,when}from'lit';", "import{customElement}from'lit/decorators.js';", "import{StateLitElement}from'/_100554_/l2/stateLitElement.js';", "import{getState}from'/_100554_/l2/collabState.js';", "import{pageState,BlogPostVM}from'/_100554_/l2/petShop/homePage.js';"], "states": ["pageState.home.blog.enabled", "pageState.home.blog.posts"], "purpose": "Exibir uma lista curta com os últimos posts do blog, apenas quando habilitado.", "supportsCapabilities": ["INSTITUTIONAL_CONTENT"], "rulesApplied": ["RULE-LANGUAGE-PTBR-001", "RULE-TONE-VOICE-001"] }, { "organismName": "homeStoreInfoTeaser", "imports": ["import{html,HTMLTemplateResult,when}from'lit';", "import{customElement}from'lit/decorators.js';", "import{StateLitElement}from'/_100554_/l2/stateLitElement.js';", "import{getState}from'/_100554_/l2/collabState.js';", "import{pageState,StoreInfoVM}from'/_100554_/l2/petShop/homePage.js';"], "states": ["pageState.home.storeInfo"], "purpose": "Renderizar um teaser com informações institucionais da loja (endereço/horário/contato) e link para a página completa de contato.", "supportsCapabilities": ["INSTITUTIONAL_CONTENT"], "rulesApplied": ["RULE-INSTITUTIONAL-PAGES-001", "RULE-TONE-VOICE-001"] }, { "organismName": "homeFooterTrustBar", "imports": ["import{html,HTMLTemplateResult,repeat,when}from'lit';", "import{customElement}from'lit/decorators.js';", "import{StateLitElement}from'/_100554_/l2/stateLitElement.js';", "import{getState}from'/_100554_/l2/collabState.js';", "import{pageState,TrustMessageVM}from'/_100554_/l2/petShop/homePage.js';"], "states": ["pageState.home.trustBar.enabled", "pageState.home.trustBar.messages"], "purpose": "Exibir uma barra de confiança no rodapé (ex.: pagamento seguro, entrega rápida) e, quando aplicável, links para políticas do site.", "supportsCapabilities": ["INSTITUTIONAL_CONTENT"], "rulesApplied": ["RULE-POLICIES-PAGES-001", "RULE-TONE-VOICE-001", "RULE-DESIGN-STYLE-001"] }]
  } else {
    userData = JSON.parse(userPrompt);
  }

  if (!userData.pageFileInfo || !userData.organismsToCreate || !userData.moduleName) throw new Error(`[beforePromptImplicit] invalid params from prompt`);

  const templateOrganism: string = await loadTemplate(templateReference);
  const templateTest: string = await loadTemplate(templateReferenceTest);

  const paths = userData.organismsToCreate.map((organism) => JSON.stringify({ ...organism, pageFileInfo: userData.pageFileInfo }))//slice(0, 1);

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
          .replace("{{templateOrganism}}", templateOrganism)
          .replace("{{templateTest}}", templateTest)
      }],
      taskTitle: agent.agentDescription,
      threadId: context.message.threadId,
      userMessage: `test ${agent.agentName}`,
      longTermMemory: { moduleName: userData.moduleName },
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

  if (!args) throw new Error(`[beforePromptStep] args invalid`);

  const actualOrganism: OrganismToCreate & { pageFileInfo: mls.stor.IFileInfoBase } =
    JSON.parse(args);

  const moduleName = context.task?.iaCompressed?.longMemory['moduleName'];
  if (!moduleName) throw new Error(`[getInfoModuleToBe] invalid module name: ${moduleName}`);

  const pageDefs: string = await getDefsPage(actualOrganism.pageFileInfo);

  const data = await getModuleToBeInfo(mls.actualProject as number, moduleName);
  if (!data.ok) throw new Error(`[beforePromptImplicit] error on getModuleToBeInfo: ${data.message || ''}`);
  const rulesForActualOrganism: RulesRegistry = {};
  const toBeRules = (data.toBe as ModuleToBe).rules
  if (toBeRules) {
    actualOrganism.rulesApplied?.forEach((ruleName) => {
      const rule = toBeRules[ruleName];
      if (rule) rulesForActualOrganism[ruleName] = rule;
    })
  }

  console.info({ actualOrganism, args, pageDefs, rulesForActualOrganism });

  const continueParallel: mls.msg.AgentIntentPromptReady = {
    type: "prompt_ready",
    args,
    messageId: context.message.orderAt,
    threadId: context.message.threadId,
    taskId: context.task?.PK || '',
    hookSequential,
    parentStepId: parentStep.stepId,
    humanPrompt: `
## Experience Model Organism
\`\`\`json
${JSON.stringify(actualOrganism)}
\`\`\`

## Rules Definition
\`\`\`json
${JSON.stringify(rulesForActualOrganism)}
\`\`\`

## Page Defs
\`\`\`json
${pageDefs}
\`\`\`
    `
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
  let intents: mls.msg.AgentIntent[] = [];
  try {
    const output = payload.result;
    intents = await processOutput(context, output as ImplementOrganism);
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

async function getDefsPage(pageFileInfo: mls.stor.IFileInfoBase): Promise<string> {
  const key = mls.stor.getKeyToFile(pageFileInfo);
  const storFile = mls.stor.files[key];
  if (!storFile) throw new Error(`[getDefsPage] invalid stor file: ${key}`);
  const models = await storFile.getOrCreateModel() as mls.editor.IModelTS;
  if (!models.compilerResults) {
    await mls.l2.typescript.compileAndPostProcess(models, true, true);
  }
  const definition = models.compilerResults?.prodDTS || '';
  return definition;
}

async function loadTemplate(fileReference: string): Promise<string> {
  const info = mls.stor.convertFileReferenceToFile(fileReference);
  const key = mls.stor.getKeyToFile(info);
  let template = await mls.stor.files[key]?.getContent('');
  if (typeof template !== 'string' || !template) throw new Error(`Template not found: ${fileReference}`);
  template = "\n```typescript\n" + template.replace(/```/g, "'''") + "\n```\n"
  return template;
}

async function processOutput(context: mls.msg.ExecutionContext, implementOrganism: ImplementOrganism): Promise<mls.msg.AgentIntent[]> {

  console.log("=== Page ");
  console.log(implementOrganism?.organismSource);
  if (context.isTest) return [];
  await updateFiles(context, implementOrganism);
  return [];

}

async function updateFiles(context: mls.msg.ExecutionContext, implementOrganism: ImplementOrganism): Promise<void> {

  const fileReference = implementOrganism?.organismSource.trim().split('\n')[0];
  const tripleSlash = mls.common.tripleslash.parseXMLTripleSlash(fileReference);
  let fileInfo = mls.stor.convertFileReferenceToFile(tripleSlash.variables['fileReference']);
  if (!fileReference || fileInfo.project < 1) throw new Error(`Invalid step in create file, incorrect meta fileRecerence: ${fileReference}`);

  const paramsTs = { ...fileInfo, content: implementOrganism?.organismSource, versionRef: new Date().toISOString(), extension: ".ts" };
  //const paramsTestTs = { ...fileInfo, content: implementOrganism?.testSource, versionRef: new Date().toISOString(), extension: ".test.ts" };

  await updateStorFile(paramsTs);
  // await updateStorFile(paramsTestTs);

}

async function updateStorFile(params: { project: number, shortName: string, level: number, folder: string, content: string, extension: string, versionRef: string }): Promise<void> {
  const file = await mls.stor.addOrUpdateFile(params);
  if (!file) throw new Error('[updateStorFile] Invalid storFile');
  const modelDefs = await file.getOrCreateModel();
  modelDefs.model.setValue(params.content);

}

/*

*/
const system1 = `
<!-- modelType: codereasoning -->
<!-- modelTypeList: geminiChat ?/10 , code (grok) ?/10, deepseekchat ?/10, codeflash (gemini) ?/10, deepseekreasoner ?/10, mini (4.1) ou nano (openai) ?/10, codeinstruct (4.1) ?/10, codereasoning(gpt5) ?/10, code2 (kimi 2.5) ?/10 -->

You are a senior Frontend Architect and Staff Software Engineer with 20+ years of experience building large-scale web applications using TypeScript, Lit, and state-driven architectures.

You must generate production-ready code that compiles without errors.

Task: Generate a organism given 'Experience Model Organism' and 'PageDefs' and 'Template Organism'. 

{{systemExperienceConstraints}}

{{systemSkillAura}}

## Template Organism
{{templateOrganism}}

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
  result: ImplementOrganism;
};
export interface ImplementOrganism {
  organismSource: string;
  // follow 'Template Organism'

  testSource: string;
  // follow 'Template Test'

  codeInsights?: {
    todos?: string[];
    securityWarnings?: string[];
    unusedImports?: string[];
    accessibilityIssues?: string[];
    i18nWarnings?: string[]; // strings that should be translated, only if i18n is enabled and if string is essential
    performanceHints?: string[];
  };

}

//#endregion



// moleculesToCreate: MoleculesToCreate[];

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

