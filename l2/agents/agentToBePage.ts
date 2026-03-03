/// <mls fileReference="_100554_/l2/agents/agentToBePage.ts" enhancement="_100554_enhancementAgent" />

import { IAgentAsync, IAgentMeta } from '/_100554_/l2/aiAgentBase.js';
import { systemExperienceConstraints } from '/_100554_/l2/agents/agentToBePages.js';
import { ModuleToBe } from '/_100554_/l2/agents/agentToBeConceptual.js';
import { ToBePages } from '/_100554_/l2/agents/agentToBePages.js';
import { getTemporaryContext } from '/_100554_/l2/aiAgentHelper.js';

import { executeBeforePrompt, loadAgent } from '/_100554_/l2/aiAgentOrchestration.js';
import { getModuleToBeInfo } from '/_100554_/l2/moduleToBeAST.js';

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

  let data: {
    toBePages: ToBePages | undefined,
    moduleToBe: ModuleToBe | undefined,
    moduleName: string | undefined,
  } = { moduleName: undefined, moduleToBe: undefined, toBePages: undefined };

  if (userPrompt.startsWith('test')) {
    const match = userPrompt.match(/^\S+\s+(\S+)$/);
    const moduleName = match ? match[1] : null;
    if (!moduleName) throw new Error(`[getInfoModuleToBe] invalid module name: ${moduleName}`);
    data = await getInfoModuleToBe(context, moduleName);
  } else {
    const dataFromPrompt = JSON.parse(userPrompt);
    data.toBePages = dataFromPrompt.moduleToBe;
    data.moduleName = dataFromPrompt.moduleName;
  }

  if (!data.moduleToBe || !data.toBePages) throw new Error(`[${agent.agentName}] [beforePromptStep] invalid moduleToBe/toBePages`);
  if (!data.moduleName) throw new Error(`[${agent.agentName}] [beforePromptStep] invalid moduleName: undefined`);

  const paths = data.toBePages.pages.map((page) => page.pageName).slice(0, 1);
  const templatePage: string = await loadTemplate(templateReference);
  const templateTest: string = await loadTemplate(templateReferenceTest);

  const inputs: mls.msg.IAMessageInputType[] = [{
    type: "system",
    content: system1
      .replace("{{systemExperienceConstraints}}", systemExperienceConstraints)
      .replace("{{systemSkillAura}}", systemSkillAura)
      .replace("{{templatePage}}", templatePage)
      .replace("{{templateTest}}", templateTest)
  }];

  const addMessageAI: mls.msg.AgentIntentAddMessageAI = {
    type: "add-message-ai",
    request: {
      action: 'addMessageAI',
      agentName: agent.agentName,
      inputAI: inputs,
      taskTitle: agent.agentDescription,
      threadId: context.message.threadId,
      userMessage: context.message.content,
      longTermMemory: { 'moduleName': data.moduleName },
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

  const moduleName = context.task?.iaCompressed?.longMemory['moduleName'];
  if (!moduleName) throw new Error(`[getInfoModuleToBe] invalid module name: ${moduleName}`);

  const { moduleToBe, toBePages } = await getInfoModuleToBe(context, moduleName);

  if (!toBePages || !moduleToBe) throw new Error(`[${agent.agentName}] [beforePromptStep] no toBePages/moduleToBe found`);

  const actualPage = toBePages.pages.find((page) => page.pageName === args)
  console.info({ toBePages, actualPage, moduleToBe, args });

  const continueParallel: mls.msg.AgentIntentPromptReady = {
    type: "prompt_ready",
    args,
    messageId: context.message.orderAt,
    threadId: context.message.threadId,
    taskId: context.task?.PK || '',
    hookSequential,
    parentStepId: parentStep.stepId,
    humanPrompt: `
## Experience Model Page
\`\`\`json
${JSON.stringify(actualPage)}

\`\`\`
## ToBe Summary
\`\`\`json
${JSON.stringify(moduleToBe)}
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
  const output = payload.result;

  try {
    intents = await processOutputToBePage(agent, context, parentStep, step, hookSequential, output as ImplementPages);
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

async function loadTemplate(fileReference: string): Promise<string> {
  const info = mls.stor.convertFileReferenceToFile(fileReference);
  const key = mls.stor.getKeyToFile(info);
  let templatePage = await mls.stor.files[key]?.getContent('');
  if (typeof templatePage !== 'string' || !templatePage) throw new Error(`Template not found: ${fileReference}`);
  templatePage = "\n```typescript\n" + templatePage.replace(/```/g, "'''") + "\n```\n"
  return templatePage;
}

async function processOutputToBePage(
  agent: IAgentMeta,
  context: mls.msg.ExecutionContext,
  parentStep: mls.msg.AIAgentStep,
  step: mls.msg.AIAgentStep,
  hookSequential: number,
  implementPages: ImplementPages
): Promise<mls.msg.AgentIntent[]> {

  console.log("=== Page ");
  console.info(implementPages)
  console.log(implementPages?.pageSource?.join("\n"));

  if (context.isTest) return [];

  const pageFileInfo = await updateFiles(context, implementPages);
  executeNewTask(context, implementPages, pageFileInfo)
  return [];

}

async function createStorFilesOrganism(context: mls.msg.ExecutionContext, organisms: OrganismToCreate[]) {

  const moduleName = context.task?.iaCompressed?.longMemory['moduleName'];
  if (!moduleName) throw new Error(`[getInfoModuleToBe] invalid module name: ${moduleName}`);
  const { moduleToBe } = await getInfoModuleToBe(context, moduleName);
  if (!moduleToBe) return;

  for (let organism of organisms) {
    const params = {
      level: 2,
      content: `/// <mls fileReference="_${mls.actualProject}_/l2/${moduleToBe.meta.moduleName}/${organism.organismName}.ts" enhancement="_blank" />

/* Organism definition: ${organism.organismName}

${JSON.stringify(organism, null, 2)}

*/
     `,
      extension: '.ts',
      folder: moduleToBe.meta.moduleName,
      project: mls.actualProject as number,
      shortName: organism.organismName,
      versionRef: new Date().toISOString()
    }

    const stor = await createStorFile(params);
    const modelTs: mls.editor.IModelTS = await stor.getOrCreateModel();
    await mls.l2.typescript.compileAndPostProcess(modelTs, true, true);

  }
}

async function getInfoModuleToBe(context: mls.msg.ExecutionContext, moduleName: string) {

  let toBePages: ToBePages | undefined;
  let moduleToBe: ModuleToBe | undefined;
  const data = await getModuleToBeInfo(mls.actualProject as number, moduleName);
  console.info({ data })
  if (!data.ok) {
    console.info('Using test toBe info')
    toBePages = pagesForTest;
    moduleToBe = toBeConceptualTest;
  } else {
    toBePages = data.toBePages;
    moduleToBe = data.toBe;
  }

  return {
    toBePages,
    moduleToBe,
    moduleName
  }

}

async function executeNewTask(context: mls.msg.ExecutionContext, implementPages: ImplementPages, pageFileInfo: mls.stor.IFileInfoBase) {

  const nextAgentInNewTask = 'agentToBePageDefs'
  const agentNew = await loadAgent(nextAgentInNewTask);
  if (!agentNew) throw new Error(`[processOutputToBePage] invalid agent: ${nextAgentInNewTask}`)
  const context2 = getTemporaryContext(context.message.threadId, context.message.senderId, `@@agentToBePageDefs ${JSON.stringify(implementPages)}`)
  // executeBeforePrompt(agentNew, context2)

  const nextAgentInNewTask2 = 'agentToBeOrganism'
  const agentNew2 = await loadAgent(nextAgentInNewTask2);
  if (!agentNew2) throw new Error(`[processOutputToBePage] invalid agent: ${nextAgentInNewTask2}`);
  
  const moduleName = context.task?.iaCompressed?.longMemory['moduleName'];
  if (!moduleName) throw new Error(`[getInfoModuleToBe] invalid module name: ${moduleName}`);

  const data = {
    pageFileInfo,
    organismsToCreate: implementPages.organismsToCreate,
    moduleName
  }

  console.info({organismsToCreate: implementPages.organismsToCreate})
  const prompt = `@@agentToBeOrganism ${JSON.stringify(data)}`
  const context3 = getTemporaryContext(context.message.threadId, context.message.senderId, prompt);
  executeBeforePrompt(agentNew2, context3);

}

async function updateFiles(context: mls.msg.ExecutionContext, implementPages: ImplementPages): Promise<mls.stor.IFileInfoBase> {

  const fileReference = implementPages?.pageSource?.join("\n").trim().split('\n')[0];
  const tripleSlash = mls.common.tripleslash.parseXMLTripleSlash(fileReference);
  let fileInfo = mls.stor.convertFileReferenceToFile(tripleSlash.variables['fileReference']);
  if (!fileReference || fileInfo.project < 1) throw new Error(`Invalid step in create file, incorrect meta fileRecerence: ${fileReference}`);

  await createStorFilesOrganism(context, implementPages.organismsToCreate);
  const paramsTs = { ...fileInfo, content: implementPages?.pageSource?.join("\n"), versionRef: new Date().toISOString(), extension: ".ts" };
  const paramsTestTs = { ...fileInfo, content: implementPages?.testSource?.join("\n"), versionRef: new Date().toISOString(), extension: ".test.ts" };

  await createStorFile(paramsTs);
  await createStorFile(paramsTestTs);
  return fileInfo;

}

async function createStorFile(params: { project: number, shortName: string, level: number, folder: string, content: string, extension: string, versionRef: string }): Promise<mls.stor.IFileInfo> {
  const file = await mls.stor.addOrUpdateFile(params);
  if (!file) throw new Error('[agentToBePage] Invalid storFile');
  const path = mls.stor.getKeyToFile(params);
  console.log(`[agentToBePage] creating new file: ${path}`)
  file.status = 'new';
  const fileInfo: mls.stor.IFileInfoValue = {
    content: params.content,
    contentType: 'string',
  };
  file.updatedAt = new Date().toISOString();
  await mls.stor.localStor.setContent(file, fileInfo);
  return file;
}

export async function getSystem() {

  const templatePage: string = await loadTemplate(templateReference);
  const templateTest: string = await loadTemplate(templateReferenceTest);

  return system1
    .replace("{{systemExperienceConstraints}}", systemExperienceConstraints)
    .replace("{{systemSkillAura}}", systemSkillAura)
    .replace("{{templatePage}}", templatePage)
    .replace("{{templateTest}}", templateTest)

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
  // organismName MUST be exactly the same identifier used in the import path.
  // Do NOT generate, concatenate, infer or modify this value.
  // Copy it verbatim from the import filename.
  // Example:
  // import '/_100554_/l2/advocacy/advocacyFooterOrganism.js'
  // organismName: 'advocacyFooterOrganism'

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


const pagesForTest: ToBePages = {
  "pages": [
    {
      "screenId": "HOME",
      "pageName": "home",
      "actor": "customer",
      "purpose": "Página inicial com destaques, categorias, conteúdos institucionais e acesso ao catálogo.",
      "sections": [
        {
          "sectionName": "header",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "homeHeroHighlights",
              "purpose": "Exibir destaques principais (campanhas/benefícios) e chamar para navegação do catálogo."
            },
            {
              "organismName": "homeQuickSearchEntry",
              "purpose": "Permitir iniciar busca por produto por texto livre a partir da home."
            }
          ]
        },
        {
          "sectionName": "main",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "homeFeaturedProducts",
              "purpose": "Listar produtos em destaque com acesso ao detalhe do produto e indicação de oferta quando aplicável."
            },
            {
              "organismName": "homeMainCategories",
              "purpose": "Exibir categorias principais para entrada rápida no catálogo filtrado."
            },
            {
              "organismName": "homeLatestBlogPosts",
              "purpose": "Exibir últimos posts publicados do blog quando a funcionalidade estiver habilitada."
            },
            {
              "organismName": "homeStoreInfoTeaser",
              "purpose": "Exibir resumo institucional (localização/horário/contato) com acesso à página completa."
            }
          ]
        },
        {
          "sectionName": "footer",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "homeFooterTrustBar",
              "purpose": "Exibir mensagens de confiança no rodapé quando habilitado."
            }
          ]
        }
      ]
    },
    {
      "screenId": "CATALOG_LIST",
      "pageName": "catalogList",
      "actor": "customer",
      "purpose": "Listar produtos com busca, filtros, ordenação e navegação por categorias.",
      "sections": [
        {
          "sectionName": "header",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "catalogListContextSummary",
              "purpose": "Exibir contexto atual do catálogo (categoria ativa/consulta) e contagem/estado geral dos resultados."
            }
          ]
        },
        {
          "sectionName": "main",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "catalogListSearchBar",
              "purpose": "Capturar texto livre para busca por nome de produto."
            },
            {
              "organismName": "catalogListFilters",
              "purpose": "Selecionar e ajustar filtros (categoria, marca, faixa de preço e atributos aplicáveis)."
            },
            {
              "organismName": "catalogListSortControl",
              "purpose": "Selecionar ordenação dos resultados (relevância, menor/maior preço e condicionais quando disponíveis)."
            },
            {
              "organismName": "catalogListResultsInfinite",
              "purpose": "Exibir grade/lista de produtos com carregamento em infinite-scroll e acesso ao detalhe do produto."
            }
          ]
        },
        {
          "sectionName": "footer",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "catalogListFooterTrustBar",
              "purpose": "Exibir mensagens de confiança no rodapé quando habilitado."
            }
          ]
        }
      ]
    },
    {
      "screenId": "PRODUCT_DETAIL",
      "pageName": "productDetail",
      "actor": "customer",
      "purpose": "Exibir detalhes do produto com mídia, descrição, preço/oferta, avaliações e ação de adicionar ao carrinho.",
      "sections": [
        {
          "sectionName": "header",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "productDetailContextHeader",
              "purpose": "Exibir identificação do produto (nome, marca/categoria quando aplicável) e estado de oferta."
            }
          ]
        },
        {
          "sectionName": "main",
          "mode": "exclusive",
          "organisms": [
            {
              "organismName": "productDetailOverviewPanel",
              "purpose": "Exibir fotos/galeria, descrição, atributos, preço (incluindo promocional) e chamada para adicionar ao carrinho."
            },
            {
              "organismName": "productDetailReviewsPanel",
              "purpose": "Exibir lista de avaliações aprovadas do produto e permitir envio de nova avaliação quando habilitado."
            }
          ]
        },
        {
          "sectionName": "footer",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "productDetailFooterTrustBar",
              "purpose": "Exibir mensagens de confiança no rodapé quando habilitado."
            }
          ]
        }
      ]
    },
    {
      "screenId": "CART",
      "pageName": "cart",
      "actor": "customer",
      "purpose": "Visualizar e gerenciar itens do carrinho, quantidades, subtotal e simulação de frete.",
      "sections": [
        {
          "sectionName": "header",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "cartContextSummary",
              "purpose": "Exibir resumo do carrinho (quantidade de itens e subtotal) e estado geral do pedido."
            }
          ]
        },
        {
          "sectionName": "main",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "cartItemsList",
              "purpose": "Listar itens do carrinho permitindo atualização inline de quantidades e remoção de itens com atualizações otimistas."
            },
            {
              "organismName": "cartShippingEstimator",
              "purpose": "Capturar CEP e exibir estimativa de frete e total estimado quando disponível."
            },
            {
              "organismName": "cartOrderSummary",
              "purpose": "Exibir resumo de valores (subtotal, frete estimado quando houver, total estimado) e ação para iniciar checkout."
            }
          ]
        },
        {
          "sectionName": "footer",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "cartFooterTrustBar",
              "purpose": "Exibir mensagens de confiança no rodapé quando habilitado."
            }
          ]
        }
      ]
    },
    {
      "screenId": "CHECKOUT",
      "pageName": "checkout",
      "actor": "customer",
      "purpose": "Finalizar compra com dados do cliente, endereço de entrega, resumo do pedido e mensagens de confiança.",
      "sections": [
        {
          "sectionName": "header",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "checkoutContextHeader",
              "purpose": "Exibir contexto do checkout (etapa atual/estado do pedido) e reforço de confiança quando aplicável."
            }
          ]
        },
        {
          "sectionName": "main",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "checkoutCustomerForm",
              "purpose": "Coletar/confirmar dados do cliente com pré-preenchimento quando autenticado.",
              "fieldsets": [
                "Identificação",
                "Contato"
              ]
            },
            {
              "organismName": "checkoutDeliveryAddressForm",
              "purpose": "Coletar/confirmar endereço de entrega e preferências relacionadas.",
              "fieldsets": [
                "Endereço",
                "Complemento/Referência"
              ]
            },
            {
              "organismName": "checkoutOrderReview",
              "purpose": "Exibir revisão do pedido (itens e valores) antes do envio."
            },
            {
              "organismName": "checkoutSubmitOrder",
              "purpose": "Consolidar validações e acionar envio do pedido (submit) com feedback de processamento e resultado."
            },
            {
              "organismName": "checkoutTrustMessages",
              "purpose": "Exibir mensagens de confiança durante o checkout quando habilitado."
            }
          ]
        },
        {
          "sectionName": "footer",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "checkoutFooterTrustBar",
              "purpose": "Exibir mensagens de confiança no rodapé quando habilitado."
            }
          ]
        }
      ]
    },
    {
      "screenId": "ORDER_CONFIRMATION",
      "pageName": "orderConfirmation",
      "actor": "customer",
      "purpose": "Confirmar pedido criado com resumo, número do pedido e próximos passos.",
      "sections": [
        {
          "sectionName": "header",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "orderConfirmationHeader",
              "purpose": "Exibir confirmação e identificação do pedido (número/status inicial)."
            }
          ]
        },
        {
          "sectionName": "main",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "orderConfirmationSummary",
              "purpose": "Exibir resumo do pedido (itens, valores, entrega) e instruções de próximos passos."
            },
            {
              "organismName": "orderConfirmationNextActions",
              "purpose": "Exibir ações pós-compra (ex.: acompanhar pedidos, voltar ao catálogo) conforme contexto de conta."
            }
          ]
        },
        {
          "sectionName": "footer",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "orderConfirmationFooterTrustBar",
              "purpose": "Exibir mensagens de confiança no rodapé quando habilitado."
            }
          ]
        }
      ]
    },
    {
      "screenId": "CUSTOMER_LOGIN",
      "pageName": "customerLogin",
      "actor": "customer",
      "purpose": "Autenticar cliente para acesso à conta e histórico de pedidos.",
      "sections": [
        {
          "sectionName": "header",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "customerLoginContextHeader",
              "purpose": "Exibir contexto da autenticação (benefícios de entrar e continuidade do fluxo)."
            }
          ]
        },
        {
          "sectionName": "main",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "customerLoginForm",
              "purpose": "Coletar credenciais do cliente e executar autenticação."
            },
            {
              "organismName": "customerLoginAssistance",
              "purpose": "Exibir ajuda e alternativas (ex.: link para cadastro) sem navegação embutida."
            }
          ]
        }
      ]
    },
    {
      "screenId": "CUSTOMER_REGISTER",
      "pageName": "customerRegister",
      "actor": "customer",
      "purpose": "Criar nova conta de cliente com dados básicos.",
      "sections": [
        {
          "sectionName": "header",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "customerRegisterContextHeader",
              "purpose": "Explicar criação de conta e vantagens para checkout/histórico."
            }
          ]
        },
        {
          "sectionName": "main",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "customerRegisterForm",
              "purpose": "Coletar dados básicos para criação da conta.",
              "fieldsets": [
                "Identificação",
                "Contato",
                "Credenciais"
              ]
            },
            {
              "organismName": "customerRegisterConfirmation",
              "purpose": "Exibir feedback de criação de conta e instruções do próximo passo."
            }
          ]
        }
      ]
    },
    {
      "screenId": "CUSTOMER_ACCOUNT",
      "pageName": "customerAccount",
      "actor": "customer",
      "purpose": "Painel da conta com acesso a dados pessoais e histórico de pedidos.",
      "sections": [
        {
          "sectionName": "header",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "customerAccountHeader",
              "purpose": "Exibir saudação e contexto da conta (nome, status de autenticação)."
            }
          ]
        },
        {
          "sectionName": "main",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "customerAccountOverviewCards",
              "purpose": "Exibir atalhos/resumos para dados do perfil e pedidos recentes."
            },
            {
              "organismName": "customerAccountRecentOrders",
              "purpose": "Listar pedidos recentes com acesso ao detalhe do pedido."
            },
            {
              "organismName": "customerAccountProfileSummary",
              "purpose": "Exibir resumo de dados pessoais e endereço padrão com acesso à edição."
            }
          ]
        }
      ]
    },
    {
      "screenId": "CUSTOMER_PROFILE_EDIT",
      "pageName": "customerProfileEdit",
      "actor": "customer",
      "purpose": "Editar dados pessoais e endereço padrão com edição inline e atualizações otimistas.",
      "sections": [
        {
          "sectionName": "header",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "customerProfileEditHeader",
              "purpose": "Exibir contexto da edição de perfil e estado de salvamento."
            }
          ]
        },
        {
          "sectionName": "main",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "customerProfileEditForm",
              "purpose": "Permitir edição inline dos dados do perfil e endereço padrão com agrupamento semântico.",
              "fieldsets": [
                "Dados Pessoais",
                "Contato",
                "Endereço Padrão"
              ]
            },
            {
              "organismName": "customerProfileEditSaveFeedback",
              "purpose": "Exibir feedback de atualização (otimista) e erros por campo quando ocorrerem."
            }
          ]
        }
      ]
    },
    {
      "screenId": "ORDER_HISTORY",
      "pageName": "orderHistory",
      "actor": "customer",
      "purpose": "Listar pedidos anteriores do cliente com status e acesso a detalhes.",
      "sections": [
        {
          "sectionName": "header",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "orderHistoryContextHeader",
              "purpose": "Exibir contexto do histórico (filtros/contagem/estado geral)."
            }
          ]
        },
        {
          "sectionName": "main",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "orderHistoryListInfinite",
              "purpose": "Listar pedidos do cliente com carregamento em infinite-scroll e acesso ao detalhe."
            },
            {
              "organismName": "orderHistoryStatusFilter",
              "purpose": "Filtrar visualização por status quando aplicável."
            }
          ]
        }
      ]
    },
    {
      "screenId": "ORDER_DETAIL_CUSTOMER",
      "pageName": "orderDetailCustomer",
      "actor": "customer",
      "purpose": "Visualizar detalhes de um pedido específico do cliente.",
      "sections": [
        {
          "sectionName": "header",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "orderDetailCustomerHeader",
              "purpose": "Exibir identificação do pedido, status atual e datas relevantes."
            }
          ]
        },
        {
          "sectionName": "main",
          "mode": "exclusive",
          "organisms": [
            {
              "organismName": "orderDetailCustomerSummaryPanel",
              "purpose": "Exibir itens, valores, entrega e informações principais do pedido."
            },
            {
              "organismName": "orderDetailCustomerActionsPanel",
              "purpose": "Exibir ações relacionadas ao pedido (ex.: acessar produtos para avaliar quando aplicável) sem lógica de negócio embutida."
            }
          ]
        },
        {
          "sectionName": "footer",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "orderDetailCustomerFooterTrustBar",
              "purpose": "Exibir mensagens de confiança no rodapé quando habilitado."
            }
          ]
        }
      ]
    },
    {
      "screenId": "STORE_INFO",
      "pageName": "storeInfo",
      "actor": "customer",
      "purpose": "Exibir informações institucionais da loja (localização, horário e contato).",
      "sections": [
        {
          "sectionName": "header",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "storeInfoHeader",
              "purpose": "Exibir título e contexto institucional da loja."
            }
          ]
        },
        {
          "sectionName": "main",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "storeInfoDetails",
              "purpose": "Exibir localização, horário de funcionamento e canais de contato."
            },
            {
              "organismName": "storeInfoContactCTA",
              "purpose": "Destacar principais canais de contato (ex.: telefone, email, redes) para facilitar acionamento."
            }
          ]
        },
        {
          "sectionName": "footer",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "storeInfoFooterTrustBar",
              "purpose": "Exibir mensagens de confiança no rodapé quando habilitado."
            }
          ]
        }
      ]
    },
    {
      "screenId": "BLOG_LIST",
      "pageName": "blogList",
      "actor": "customer",
      "purpose": "Listar posts do blog publicados com dicas de cuidados para pets.",
      "sections": [
        {
          "sectionName": "header",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "blogListHeader",
              "purpose": "Exibir contexto do blog e destaque editorial quando aplicável."
            }
          ]
        },
        {
          "sectionName": "main",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "blogListPostsInfinite",
              "purpose": "Listar posts publicados com carregamento em infinite-scroll e acesso ao post."
            },
            {
              "organismName": "blogListSearch",
              "purpose": "Permitir filtrar/buscar posts por texto quando aplicável."
            }
          ]
        }
      ]
    },
    {
      "screenId": "BLOG_POST",
      "pageName": "blogPost",
      "actor": "customer",
      "purpose": "Exibir leitura de post individual do blog com conteúdo completo.",
      "sections": [
        {
          "sectionName": "header",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "blogPostHeader",
              "purpose": "Exibir título, metadados (data/autor quando houver) e imagem de capa quando aplicável."
            }
          ]
        },
        {
          "sectionName": "main",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "blogPostContent",
              "purpose": "Exibir conteúdo completo do post com formatação e mídias."
            },
            {
              "organismName": "blogPostRelatedPosts",
              "purpose": "Exibir sugestões de posts relacionados/mais recentes para continuidade de leitura."
            }
          ]
        }
      ]
    },
    {
      "screenId": "ADMIN_LOGIN",
      "pageName": "adminLogin",
      "actor": "staff",
      "purpose": "Autenticar administrador para acesso ao painel de gestão.",
      "sections": [
        {
          "sectionName": "header",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "adminLoginHeader",
              "purpose": "Exibir contexto do acesso administrativo e aviso de perfil (staff)."
            }
          ]
        },
        {
          "sectionName": "main",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "adminLoginForm",
              "purpose": "Coletar credenciais administrativas e executar autenticação."
            },
            {
              "organismName": "adminLoginAccessNotice",
              "purpose": "Exibir políticas/avisos de segurança e acesso restrito."
            }
          ]
        }
      ]
    },
    {
      "screenId": "ADMIN_DASHBOARD",
      "pageName": "adminDashboard",
      "actor": "staff",
      "purpose": "Painel administrativo inicial com acesso às funcionalidades de gestão.",
      "sections": [
        {
          "sectionName": "header",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "adminDashboardHeader",
              "purpose": "Exibir contexto do painel (usuário, data/ambiente) e indicadores gerais."
            }
          ]
        },
        {
          "sectionName": "main",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "adminDashboardQuickActions",
              "purpose": "Exibir cards/atalhos para áreas de gestão (produtos, pedidos, blog, informações da loja, confiança, moderação)."
            },
            {
              "organismName": "adminDashboardOperationalSnapshot",
              "purpose": "Exibir resumo operacional (ex.: pedidos recentes/pendentes) para priorização."
            }
          ]
        }
      ]
    },
    {
      "screenId": "ADMIN_PRODUCTS_LIST",
      "pageName": "adminProductsList",
      "actor": "staff",
      "purpose": "Listar produtos para gestão com busca e filtros administrativos.",
      "sections": [
        {
          "sectionName": "header",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "adminProductsListContextHeader",
              "purpose": "Exibir contexto da gestão de produtos (contagem, status, filtros ativos)."
            }
          ]
        },
        {
          "sectionName": "main",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "adminProductsListSearch",
              "purpose": "Buscar produtos por nome/identificador para gestão."
            },
            {
              "organismName": "adminProductsListFilters",
              "purpose": "Filtrar por status (ativo/inativo), categoria, marca e atributos relevantes."
            },
            {
              "organismName": "adminProductsListResultsInfinite",
              "purpose": "Listar produtos com carregamento em infinite-scroll e acesso à edição/criação."
            }
          ]
        }
      ]
    },
    {
      "screenId": "ADMIN_PRODUCT_EDIT",
      "pageName": "adminProductEdit",
      "actor": "staff",
      "purpose": "Criar/editar produto com dados, imagens, preço promocional e atributos.",
      "sections": [
        {
          "sectionName": "header",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "adminProductEditHeader",
              "purpose": "Exibir contexto do produto (novo/edição), identificação e estado de salvamento."
            }
          ]
        },
        {
          "sectionName": "main",
          "mode": "exclusive",
          "organisms": [
            {
              "organismName": "adminProductEditBasicPanel",
              "purpose": "Editar dados principais do produto (nome, descrição, categoria, marca, status).",
              "fieldsets": [
                "Identificação",
                "Classificação",
                "Status"
              ]
            },
            {
              "organismName": "adminProductEditPricingPanel",
              "purpose": "Editar preço padrão e preço promocional quando aplicável.",
              "fieldsets": [
                "Preço",
                "Promoção"
              ]
            },
            {
              "organismName": "adminProductEditMediaPanel",
              "purpose": "Gerenciar imagens/mídias do produto (adicionar/remover/ordenar)."
            },
            {
              "organismName": "adminProductEditAttributesPanel",
              "purpose": "Editar atributos específicos (pet/estágio de vida e demais atributos do catálogo).",
              "fieldsets": [
                "Atributos do Pet",
                "Atributos Gerais"
              ]
            }
          ]
        }
      ]
    },
    {
      "screenId": "ADMIN_ORDERS_LIST",
      "pageName": "adminOrdersList",
      "actor": "staff",
      "purpose": "Listar pedidos para acompanhamento operacional com filtros por status.",
      "sections": [
        {
          "sectionName": "header",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "adminOrdersListContextHeader",
              "purpose": "Exibir contexto de pedidos (contagem, filtros ativos e prioridades)."
            }
          ]
        },
        {
          "sectionName": "main",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "adminOrdersListFilters",
              "purpose": "Filtrar pedidos por status e outros critérios operacionais relevantes."
            },
            {
              "organismName": "adminOrdersListResultsInfinite",
              "purpose": "Listar pedidos com carregamento em infinite-scroll e acesso ao detalhe do pedido."
            }
          ]
        }
      ]
    },
    {
      "screenId": "ADMIN_ORDER_DETAIL",
      "pageName": "adminOrderDetail",
      "actor": "staff",
      "purpose": "Exibir detalhes do pedido com dados do cliente, itens e controle de status.",
      "sections": [
        {
          "sectionName": "header",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "adminOrderDetailHeader",
              "purpose": "Exibir identificação do pedido, status atual e principais flags operacionais."
            }
          ]
        },
        {
          "sectionName": "main",
          "mode": "exclusive",
          "organisms": [
            {
              "organismName": "adminOrderDetailSummaryPanel",
              "purpose": "Exibir itens, valores, frete e detalhes de entrega do pedido."
            },
            {
              "organismName": "adminOrderDetailCustomerPanel",
              "purpose": "Exibir dados do cliente e informações de contato relacionadas ao pedido."
            },
            {
              "organismName": "adminOrderDetailStatusPanel",
              "purpose": "Permitir atualização inline do status do pedido com feedback otimista e trilha de alterações quando aplicável."
            }
          ]
        }
      ]
    },
    {
      "screenId": "ADMIN_STORE_INFO_EDIT",
      "pageName": "adminStoreInfoEdit",
      "actor": "staff",
      "purpose": "Editar informações institucionais da loja (localização, horário, contato).",
      "sections": [
        {
          "sectionName": "header",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "adminStoreInfoEditHeader",
              "purpose": "Exibir contexto da edição institucional e estado de salvamento."
            }
          ]
        },
        {
          "sectionName": "main",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "adminStoreInfoEditForm",
              "purpose": "Editar informações da loja com edição inline e agrupamento semântico.",
              "fieldsets": [
                "Localização",
                "Horário de Funcionamento",
                "Contato"
              ]
            },
            {
              "organismName": "adminStoreInfoEditPreview",
              "purpose": "Exibir pré-visualização textual do conteúdo institucional para validação antes/depois de salvar."
            }
          ]
        }
      ]
    },
    {
      "screenId": "ADMIN_BLOG_LIST",
      "pageName": "adminBlogList",
      "actor": "staff",
      "purpose": "Listar posts do blog com controle de status (rascunho/publicado).",
      "sections": [
        {
          "sectionName": "header",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "adminBlogListContextHeader",
              "purpose": "Exibir contexto da gestão do blog (contagens por status e filtros ativos)."
            }
          ]
        },
        {
          "sectionName": "main",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "adminBlogListFilters",
              "purpose": "Filtrar posts por status (rascunho/publicado) e outros critérios."
            },
            {
              "organismName": "adminBlogListResultsInfinite",
              "purpose": "Listar posts com carregamento em infinite-scroll e acesso à edição/criação."
            },
            {
              "organismName": "adminBlogListSearch",
              "purpose": "Buscar posts por título/slug quando aplicável."
            }
          ]
        }
      ]
    },
    {
      "screenId": "ADMIN_BLOG_EDIT",
      "pageName": "adminBlogEdit",
      "actor": "staff",
      "purpose": "Criar/editar post do blog com editor de conteúdo e controle de publicação.",
      "sections": [
        {
          "sectionName": "header",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "adminBlogEditHeader",
              "purpose": "Exibir contexto do post (novo/edição), status e estado de salvamento."
            }
          ]
        },
        {
          "sectionName": "main",
          "mode": "exclusive",
          "organisms": [
            {
              "organismName": "adminBlogEditContentPanel",
              "purpose": "Editar conteúdo do post (título, corpo, mídia) em um editor dedicado.",
              "fieldsets": [
                "Metadados",
                "Conteúdo"
              ]
            },
            {
              "organismName": "adminBlogEditPublicationPanel",
              "purpose": "Controlar status de publicação (rascunho/publicado) e validações associadas.",
              "fieldsets": [
                "Publicação"
              ]
            },
            {
              "organismName": "adminBlogEditPreviewPanel",
              "purpose": "Pré-visualizar o post renderizado para revisão antes de publicar."
            }
          ]
        }
      ]
    },
    {
      "screenId": "ADMIN_REVIEWS_MODERATION",
      "pageName": "adminReviewsModeration",
      "actor": "staff",
      "purpose": "Moderar avaliações de produtos com ações de aprovar e rejeitar.",
      "sections": [
        {
          "sectionName": "header",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "adminReviewsModerationHeader",
              "purpose": "Exibir contexto da fila de moderação (pendentes, critérios e contagem)."
            }
          ]
        },
        {
          "sectionName": "main",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "adminReviewsModerationQueueInfinite",
              "purpose": "Listar avaliações pendentes com carregamento em infinite-scroll e exibição do contexto (produto/cliente)."
            },
            {
              "organismName": "adminReviewsModerationActions",
              "purpose": "Permitir aprovar/rejeitar avaliações com atualizações otimistas e justificativa opcional quando aplicável."
            }
          ]
        }
      ]
    },
    {
      "screenId": "ADMIN_TRUST_MESSAGES",
      "pageName": "adminTrustMessages",
      "actor": "staff",
      "purpose": "Gerenciar mensagens de confiança exibidas no checkout e no rodapé.",
      "sections": [
        {
          "sectionName": "header",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "adminTrustMessagesHeader",
              "purpose": "Exibir contexto da configuração de confiança e estado de salvamento."
            }
          ]
        },
        {
          "sectionName": "main",
          "mode": "stack",
          "organisms": [
            {
              "organismName": "adminTrustMessagesEditor",
              "purpose": "Criar/editar/remover itens de confiança e definir quais estão ativos com edição inline e atualizações otimistas.",
              "fieldsets": [
                "Itens de Confiança",
                "Ativação/Ordem"
              ]
            },
            {
              "organismName": "adminTrustMessagesPreview",
              "purpose": "Pré-visualizar como as mensagens aparecerão no checkout e no rodapé."
            }
          ]
        }
      ]
    }
  ]
}

const toBeConceptualTest: ModuleToBe = {
  "meta": {
    "userLanguage": "pt",
    "moduleName": "petShop",
    "userPromptOriginal": "Criar um novo módulo para um site de pet shop.",
    "userPromptFinal": "Criar o módulo \"petShop\" para um site de pet shop em Português (Brasil), voltado a donos de pets em geral. O site deve funcionar como um e-commerce com catálogo de produtos bem organizado, carrinho de compras e sistema de pagamento. Deve conter também seções institucionais como \"quem somos\" e informações de contato. Papéis principais: clientes (navegar e comprar) e administradores (gerenciar conteúdo, produtos e pedidos). Tom de comunicação amigável, acolhedor e informativo, transmitindo confiança e carinho pelos animais. Design limpo, moderno e intuitivo, com cores que remetam à natureza e bem-estar animal e imagens de pets felizes e saudáveis. Categorias de produtos: rações para cães e gatos, brinquedos, acessórios (coleiras e guias), produtos de higiene e possivelmente vestuário para pets. Não incluir funcionalidades de agendamento de serviços nem adoção. Atualizações aplicadas (yagni=now): controle de estoque por produto; cálculo de frete por endereço e opções de entrega; avaliações e comentários de produtos; cupons de desconto; histórico detalhado de pedidos para o cliente; rastreamento e status detalhado de envio; FAQ rápido no checkout (frete, prazos, trocas, formas de pagamento) com links para políticas; páginas institucionais adicionais (trocas e devoluções, privacidade, termos) acessíveis via rodapé."
  },
  "ontology": {
    "entities": {
      "User": {
        "description": "Pessoa que interage com o site do pet shop.",
        "fields": {
          "id": {
            "type": "string",
            "required": true
          },
          "role": {
            "type": "string",
            "required": true,
            "values": [
              "cliente",
              "administrador"
            ],
            "constraints": "O papel define permissões: cliente compra; administrador gerencia conteúdo, produtos e pedidos."
          },
          "name": {
            "type": "string",
            "required": false
          },
          "email": {
            "type": "string",
            "required": false
          }
        },
        "rules": [
          "RULE-USER-ROLES-001"
        ]
      },
      "Product": {
        "description": "Item vendido no e-commerce do pet shop.",
        "fields": {
          "id": {
            "type": "string",
            "required": true
          },
          "name": {
            "type": "string",
            "required": true
          },
          "category": {
            "type": "string",
            "required": true,
            "values": [
              "racao_caes",
              "racao_gatos",
              "brinquedos",
              "acessorios",
              "higiene",
              "vestuario"
            ],
            "constraints": "Categorias devem refletir o catálogo planejado para o pet shop."
          },
          "description": {
            "type": "string",
            "required": false
          },
          "price": {
            "type": "number",
            "required": true,
            "constraints": "Preço em moeda local (BRL)."
          },
          "active": {
            "type": "boolean",
            "required": true
          },
          "stockQuantity": {
            "type": "number",
            "required": true,
            "constraints": "Quantidade disponível em estoque (inteiro >= 0). Deve impedir venda de itens indisponíveis."
          },
          "stockStatus": {
            "type": "string",
            "required": true,
            "values": [
              "disponivel",
              "indisponivel"
            ],
            "constraints": "Status derivado do estoque (ex.: indisponivel quando stockQuantity = 0) para comunicação clara no catálogo."
          }
        },
        "rules": [
          "RULE-PRODUCT-CATEGORIES-001",
          "RULE-INVENTORY-CONTROL-001"
        ]
      },
      "Cart": {
        "description": "Carrinho de compras do cliente.",
        "fields": {
          "id": {
            "type": "string",
            "required": true
          },
          "userId": {
            "type": "string",
            "required": true
          },
          "items": {
            "type": "array",
            "required": true,
            "constraints": "Lista de itens com produto e quantidade."
          },
          "appliedCouponCode": {
            "type": "string",
            "required": false,
            "constraints": "Código de cupom aplicado ao carrinho (se houver)."
          },
          "discountTotal": {
            "type": "number",
            "required": false,
            "constraints": "Total de descontos aplicados ao carrinho (BRL)."
          },
          "shippingAddress": {
            "type": "string",
            "required": false,
            "constraints": "Endereço informado para estimativa/cálculo de frete."
          },
          "selectedShippingOptionId": {
            "type": "string",
            "required": false,
            "constraints": "Identificador da opção de entrega selecionada para cálculo do frete."
          },
          "shippingCost": {
            "type": "number",
            "required": false,
            "constraints": "Custo de frete estimado/calculado (BRL)."
          }
        },
        "rules": [
          "RULE-COUPONS-001",
          "RULE-SHIPPING-CALCULATION-001"
        ]
      },
      "Order": {
        "description": "Pedido realizado pelo cliente.",
        "fields": {
          "id": {
            "type": "string",
            "required": true
          },
          "userId": {
            "type": "string",
            "required": true
          },
          "status": {
            "type": "string",
            "required": true,
            "values": [
              "criado",
              "pago",
              "cancelado",
              "enviado",
              "entregue"
            ],
            "constraints": "Fluxo típico de e-commerce com pagamento."
          },
          "total": {
            "type": "number",
            "required": true
          },
          "createdAt": {
            "type": "string",
            "required": true,
            "constraints": "Data/hora em formato ISO-8601."
          },
          "shippingCost": {
            "type": "number",
            "required": false,
            "constraints": "Custo de frete (BRL) aplicado ao pedido."
          },
          "shippingOptionLabel": {
            "type": "string",
            "required": false,
            "constraints": "Descrição da opção de entrega escolhida (ex.: normal/expressa)."
          },
          "trackingCode": {
            "type": "string",
            "required": false,
            "constraints": "Código de rastreamento do envio (quando aplicável)."
          },
          "shippingStatus": {
            "type": "string",
            "required": false,
            "values": [
              "aguardando_envio",
              "postado",
              "em_transito",
              "saiu_para_entrega",
              "entregue",
              "problema_no_envio"
            ],
            "constraints": "Status detalhado do envio para acompanhamento pelo cliente."
          },
          "couponCode": {
            "type": "string",
            "required": false,
            "constraints": "Código de cupom aplicado no pedido (se houver)."
          },
          "discountTotal": {
            "type": "number",
            "required": false,
            "constraints": "Total de descontos aplicados ao pedido (BRL)."
          }
        },
        "rules": [
          "RULE-SHIPPING-TRACKING-001",
          "RULE-COUPONS-001",
          "RULE-SHIPPING-CALCULATION-001",
          "RULE-INVENTORY-CONTROL-001"
        ]
      },
      "ContentPage": {
        "description": "Página institucional/informativa do site (ex.: quem somos, contato, políticas).",
        "fields": {
          "id": {
            "type": "string",
            "required": true
          },
          "slug": {
            "type": "string",
            "required": true,
            "values": [
              "quem-somos",
              "contato",
              "trocas-e-devolucoes",
              "politica-de-privacidade",
              "termos-de-uso"
            ],
            "constraints": "Deve incluir no mínimo as páginas 'quem somos' e 'contato'. Também deve suportar páginas de políticas no rodapé."
          },
          "title": {
            "type": "string",
            "required": true
          },
          "body": {
            "type": "string",
            "required": true
          }
        },
        "rules": [
          "RULE-INSTITUTIONAL-PAGES-001",
          "RULE-POLICIES-PAGES-001"
        ]
      },
      "ProductReview": {
        "description": "Avaliação e comentário de um produto feito por um cliente.",
        "fields": {
          "id": {
            "type": "string",
            "required": true
          },
          "productId": {
            "type": "string",
            "required": true
          },
          "userId": {
            "type": "string",
            "required": true,
            "constraints": "Apenas usuários com role=cliente podem avaliar."
          },
          "rating": {
            "type": "number",
            "required": true,
            "constraints": "Nota (ex.: 1 a 5)."
          },
          "comment": {
            "type": "string",
            "required": false
          },
          "createdAt": {
            "type": "string",
            "required": true,
            "constraints": "Data/hora em formato ISO-8601."
          },
          "status": {
            "type": "string",
            "required": true,
            "values": [
              "pendente",
              "publicado",
              "oculto"
            ],
            "constraints": "Permite moderação de avaliações/comentários."
          }
        },
        "rules": [
          "RULE-PRODUCT-REVIEWS-001",
          "RULE-USER-ROLES-001",
          "RULE-LANGUAGE-PTBR-001"
        ]
      },
      "Coupon": {
        "description": "Cupom de desconto criado por administrador e aplicado no carrinho/pedido.",
        "fields": {
          "id": {
            "type": "string",
            "required": true
          },
          "code": {
            "type": "string",
            "required": true,
            "constraints": "Código único do cupom."
          },
          "active": {
            "type": "boolean",
            "required": true
          },
          "discountType": {
            "type": "string",
            "required": true,
            "values": [
              "percentual",
              "valor_fixo"
            ]
          },
          "discountValue": {
            "type": "number",
            "required": true,
            "constraints": "Valor do desconto conforme discountType (percentual: 0-100; valor_fixo: BRL)."
          },
          "validFrom": {
            "type": "string",
            "required": false,
            "constraints": "Data/hora ISO-8601 de início de vigência."
          },
          "validTo": {
            "type": "string",
            "required": false,
            "constraints": "Data/hora ISO-8601 de fim de vigência."
          },
          "minOrderTotal": {
            "type": "number",
            "required": false,
            "constraints": "Valor mínimo do carrinho/pedido para aplicar o cupom (BRL)."
          }
        },
        "rules": [
          "RULE-COUPONS-001",
          "RULE-USER-ROLES-001"
        ]
      },
      "ShippingOption": {
        "description": "Opção de entrega disponível para um endereço e um conjunto de itens (ex.: normal/expressa).",
        "fields": {
          "id": {
            "type": "string",
            "required": true
          },
          "label": {
            "type": "string",
            "required": true,
            "constraints": "Nome/descrição da opção (ex.: Normal, Expressa)."
          },
          "estimatedDelivery": {
            "type": "string",
            "required": false,
            "constraints": "Prazo estimado em formato textual (ex.: '3 a 5 dias úteis')."
          },
          "cost": {
            "type": "number",
            "required": true,
            "constraints": "Custo de frete (BRL) para a opção."
          },
          "active": {
            "type": "boolean",
            "required": true
          }
        },
        "rules": [
          "RULE-SHIPPING-CALCULATION-001"
        ]
      },
      "CheckoutFAQItem": {
        "description": "Item de FAQ exibido no checkout para reduzir dúvidas (frete, prazos, trocas, pagamento) e orientar para políticas.",
        "fields": {
          "id": {
            "type": "string",
            "required": true
          },
          "question": {
            "type": "string",
            "required": true
          },
          "answer": {
            "type": "string",
            "required": true,
            "constraints": "Resposta curta e clara, adequada ao contexto do checkout."
          },
          "topic": {
            "type": "string",
            "required": true,
            "values": [
              "frete",
              "prazos",
              "trocas",
              "pagamento",
              "outros"
            ]
          },
          "relatedPolicySlugs": {
            "type": "array",
            "required": false,
            "constraints": "Lista de slugs de ContentPage que devem ser linkados (ex.: 'trocas-e-devolucoes', 'politica-de-privacidade', 'termos-de-uso')."
          },
          "active": {
            "type": "boolean",
            "required": true
          }
        },
        "rules": [
          "RULE-CHECKOUT-FAQ-001",
          "RULE-LANGUAGE-PTBR-001"
        ]
      }
    }
  },
  "rules": {
    "RULE-LANGUAGE-PTBR-001": {
      "kind": "policy",
      "description": "O site deve estar disponível apenas em Português (Brasil).",
      "scope": [
        "global"
      ],
      "acceptanceCriteria": [
        "Todo o conteúdo e textos do módulo devem estar em pt-BR.",
        "Não deve existir alternância/seleção de idioma."
      ]
    },
    "RULE-USER-ROLES-001": {
      "kind": "platform",
      "description": "O sistema deve suportar apenas os papéis principais 'cliente' e 'administrador', com responsabilidades coerentes: cliente navega e compra; administrador gerencia conteúdo, produtos e pedidos.",
      "scope": [
        "entities.User",
        "capabilities"
      ],
      "acceptanceCriteria": [
        "Usuários devem ter role em {cliente,administrador}.",
        "Ações administrativas devem ser restritas ao papel administrador."
      ]
    },
    "RULE-ECOMMERCE-CORE-001": {
      "kind": "domain",
      "description": "O site deve funcionar como e-commerce, incluindo catálogo de produtos, carrinho de compras e sistema de pagamento.",
      "scope": [
        "global",
        "capabilities"
      ],
      "acceptanceCriteria": [
        "Deve existir navegação de catálogo por categorias.",
        "Deve existir carrinho de compras com itens e quantidades.",
        "Deve existir fluxo de checkout com pagamento."
      ]
    },
    "RULE-INSTITUTIONAL-PAGES-001": {
      "kind": "domain",
      "description": "O site deve incluir seção institucional 'quem somos' e informações de contato.",
      "scope": [
        "entities.ContentPage",
        "capabilities"
      ],
      "acceptanceCriteria": [
        "Deve existir página 'quem somos'.",
        "Deve existir página 'contato' com informações de contato."
      ]
    },
    "RULE-PRODUCT-CATEGORIES-001": {
      "kind": "domain",
      "description": "O catálogo deve contemplar as categorias: rações para cães, rações para gatos, brinquedos, acessórios (coleiras e guias), higiene e possivelmente vestuário para pets.",
      "scope": [
        "entities.Product"
      ],
      "acceptanceCriteria": [
        "Product.category deve suportar: racao_caes,racao_gatos,brinquedos,acessorios,higiene,vestuario."
      ]
    },
    "RULE-TONE-VOICE-001": {
      "kind": "policy",
      "description": "O tom de comunicação do site deve ser amigável, acolhedor e informativo, transmitindo confiança e carinho pelos animais.",
      "scope": [
        "global"
      ],
      "acceptanceCriteria": [
        "Textos institucionais e mensagens do fluxo de compra devem refletir tom amigável e acolhedor.",
        "Conteúdo deve ser informativo sem perder a sensação de confiança e cuidado com os pets."
      ]
    },
    "RULE-DESIGN-STYLE-001": {
      "kind": "policy",
      "description": "O design deve ser limpo, moderno e intuitivo, com cores que remetam à natureza e bem-estar animal e uso de imagens de pets felizes e saudáveis.",
      "scope": [
        "global"
      ],
      "acceptanceCriteria": [
        "Interface deve priorizar clareza e navegação simples.",
        "Paleta visual deve remeter à natureza/bem-estar animal.",
        "Páginas principais devem utilizar imagens de pets felizes e saudáveis."
      ]
    },
    "RULE-NO-SERVICES-SCHEDULING-001": {
      "kind": "domain",
      "description": "O módulo não deve oferecer agendamento de serviços.",
      "scope": [
        "global",
        "capabilities"
      ],
      "acceptanceCriteria": [
        "Não deve existir funcionalidade de agendar banho/tosa/consulta ou similares."
      ]
    },
    "RULE-NO-ADOPTION-001": {
      "kind": "domain",
      "description": "O módulo não deve permitir adoção de animais.",
      "scope": [
        "global",
        "capabilities"
      ],
      "acceptanceCriteria": [
        "Não deve existir fluxo, seção ou formulários de adoção."
      ]
    },
    "RULE-INVENTORY-CONTROL-001": {
      "kind": "domain",
      "description": "O sistema deve controlar estoque por produto e evitar venda de itens indisponíveis.",
      "scope": [
        "entities.Product",
        "entities.Cart",
        "entities.Order",
        "capabilities.CART_MANAGEMENT",
        "capabilities.CHECKOUT_AND_PAYMENT",
        "capabilities.ADMIN_MANAGEMENT"
      ],
      "acceptanceCriteria": [
        "Cada produto deve possuir quantidade em estoque (>=0).",
        "Não deve ser possível finalizar pedido com item sem estoque suficiente.",
        "Ao gerenciar produtos, administrador deve poder ajustar o estoque."
      ]
    },
    "RULE-SHIPPING-CALCULATION-001": {
      "kind": "domain",
      "description": "O sistema deve calcular o frete com base no endereço do cliente e nas opções de entrega, exibindo o custo antes da finalização do pedido.",
      "scope": [
        "entities.Cart",
        "entities.Order",
        "entities.ShippingOption",
        "capabilities.CHECKOUT_AND_PAYMENT"
      ],
      "acceptanceCriteria": [
        "No checkout, deve ser possível informar endereço para cálculo/estimativa de frete.",
        "Deve ser possível escolher entre opções de entrega quando houver.",
        "O custo do frete deve compor o total apresentado antes da confirmação do pedido."
      ]
    },
    "RULE-PRODUCT-REVIEWS-001": {
      "kind": "policy",
      "description": "O sistema deve permitir que clientes avaliem e comentem produtos, com possibilidade de moderação.",
      "scope": [
        "entities.ProductReview",
        "capabilities.PRODUCT_REVIEWS"
      ],
      "acceptanceCriteria": [
        "Clientes devem poder registrar nota e opcionalmente comentário em um produto.",
        "Avaliações devem ter status (pendente/publicado/oculto) para controle de exibição.",
        "Somente avaliações publicadas devem ser exibidas no catálogo."
      ]
    },
    "RULE-COUPONS-001": {
      "kind": "domain",
      "description": "O sistema deve permitir criação e aplicação de cupons de desconto no carrinho e refletir descontos no total do pedido.",
      "scope": [
        "entities.Coupon",
        "entities.Cart",
        "entities.Order",
        "capabilities.COUPONS_AND_DISCOUNTS",
        "capabilities.CHECKOUT_AND_PAYMENT",
        "capabilities.ADMIN_MANAGEMENT"
      ],
      "acceptanceCriteria": [
        "Deve ser possível aplicar/remover um cupom no carrinho.",
        "Cupom deve respeitar status ativo e janela de validade quando informada.",
        "O desconto deve ser exibido e subtraído do total antes da confirmação do pedido."
      ]
    },
    "RULE-SHIPPING-TRACKING-001": {
      "kind": "domain",
      "description": "O sistema deve informar código de rastreamento e status detalhado do envio para pedidos enviados.",
      "scope": [
        "entities.Order",
        "capabilities.ORDER_TRACKING"
      ],
      "acceptanceCriteria": [
        "Quando um pedido estiver em processo de entrega, deve existir código de rastreamento quando aplicável.",
        "O cliente deve conseguir visualizar o status detalhado do envio do pedido."
      ]
    },
    "RULE-POLICIES-PAGES-001": {
      "kind": "policy",
      "description": "O site deve disponibilizar páginas de políticas essenciais (Trocas e devoluções, Política de privacidade, Termos de uso) com acesso pelo rodapé.",
      "scope": [
        "entities.ContentPage",
        "capabilities.INSTITUTIONAL_CONTENT"
      ],
      "acceptanceCriteria": [
        "Deve existir página 'trocas-e-devolucoes'.",
        "Deve existir página 'politica-de-privacidade'.",
        "Deve existir página 'termos-de-uso'.",
        "Essas páginas devem ser acessíveis via links no rodapé."
      ]
    },
    "RULE-CHECKOUT-FAQ-001": {
      "kind": "domain",
      "description": "O checkout deve exibir um FAQ rápido e contextual sobre frete, prazos, trocas e formas de pagamento, com links para políticas aplicáveis.",
      "scope": [
        "entities.CheckoutFAQItem",
        "capabilities.CHECKOUT_SUPPORT_FAQ",
        "capabilities.CHECKOUT_AND_PAYMENT"
      ],
      "acceptanceCriteria": [
        "No checkout, deve existir acesso a itens de FAQ de leitura rápida.",
        "Itens de FAQ devem cobrir ao menos: frete, prazos, trocas e pagamento (podendo incluir outros).",
        "Quando relevante, itens de FAQ devem incluir links para páginas de políticas (ex.: trocas e devoluções, privacidade, termos).",
        "Somente itens ativos devem ser exibidos."
      ]
    }
  },
  "capabilities": {
    "CATALOG_BROWSING": {
      "description": "Navegar e pesquisar o catálogo de produtos por categorias.",
      "usesRules": [
        "RULE-ECOMMERCE-CORE-001",
        "RULE-PRODUCT-CATEGORIES-001",
        "RULE-LANGUAGE-PTBR-001",
        "RULE-TONE-VOICE-001",
        "RULE-DESIGN-STYLE-001",
        "RULE-INVENTORY-CONTROL-001"
      ],
      "isOptional": false,
      "actions": [
        {
          "actionId": "listProducts",
          "description": "Listar produtos do catálogo com filtros por categoria."
        },
        {
          "actionId": "viewProductDetails",
          "description": "Visualizar detalhes de um produto."
        },
        {
          "actionId": "viewAvailability",
          "description": "Exibir disponibilidade do produto com base no estoque."
        }
      ]
    },
    "CART_MANAGEMENT": {
      "description": "Gerenciar carrinho de compras (adicionar, remover e alterar quantidades).",
      "usesRules": [
        "RULE-ECOMMERCE-CORE-001",
        "RULE-LANGUAGE-PTBR-001",
        "RULE-TONE-VOICE-001",
        "RULE-INVENTORY-CONTROL-001",
        "RULE-COUPONS-001"
      ],
      "isOptional": false,
      "actions": [
        {
          "actionId": "addToCart",
          "description": "Adicionar produto ao carrinho (respeitando limite de estoque)."
        },
        {
          "actionId": "removeFromCart",
          "description": "Remover produto do carrinho."
        },
        {
          "actionId": "updateQuantity",
          "description": "Atualizar quantidade de um item no carrinho (respeitando limite de estoque)."
        },
        {
          "actionId": "viewCart",
          "description": "Visualizar itens, subtotal, descontos (se houver) e estimativa de total."
        }
      ]
    },
    "CHECKOUT_AND_PAYMENT": {
      "description": "Finalizar compra e realizar pagamento.",
      "usesRules": [
        "RULE-ECOMMERCE-CORE-001",
        "RULE-LANGUAGE-PTBR-001",
        "RULE-TONE-VOICE-001",
        "RULE-NO-SERVICES-SCHEDULING-001",
        "RULE-NO-ADOPTION-001",
        "RULE-SHIPPING-CALCULATION-001",
        "RULE-INVENTORY-CONTROL-001",
        "RULE-COUPONS-001",
        "RULE-CHECKOUT-FAQ-001",
        "RULE-POLICIES-PAGES-001"
      ],
      "isOptional": false,
      "actions": [
        {
          "actionId": "startCheckout",
          "description": "Iniciar checkout a partir do carrinho."
        },
        {
          "actionId": "calculateShipping",
          "description": "Informar endereço, listar opções de entrega e calcular custo de frete antes da confirmação."
        },
        {
          "actionId": "applyCouponAtCheckout",
          "description": "Aplicar ou remover cupom durante o checkout, refletindo no total final."
        },
        {
          "actionId": "viewCheckoutFAQ",
          "description": "Acessar FAQ rápido no checkout (frete, prazos, trocas e pagamento) com links para políticas relacionadas."
        },
        {
          "actionId": "processPayment",
          "description": "Processar pagamento do pedido."
        },
        {
          "actionId": "confirmOrder",
          "description": "Confirmar criação do pedido após pagamento, registrando frete e descontos."
        }
      ]
    },
    "INSTITUTIONAL_CONTENT": {
      "description": "Exibir páginas institucionais e de contato.",
      "usesRules": [
        "RULE-INSTITUTIONAL-PAGES-001",
        "RULE-POLICIES-PAGES-001",
        "RULE-LANGUAGE-PTBR-001",
        "RULE-TONE-VOICE-001",
        "RULE-DESIGN-STYLE-001"
      ],
      "isOptional": false,
      "actions": [
        {
          "actionId": "viewAboutUs",
          "description": "Exibir a página 'quem somos'."
        },
        {
          "actionId": "viewContact",
          "description": "Exibir a página de contato com informações para o cliente."
        },
        {
          "actionId": "viewReturnsPolicy",
          "description": "Exibir a página 'Trocas e devoluções'."
        },
        {
          "actionId": "viewPrivacyPolicy",
          "description": "Exibir a página 'Política de privacidade'."
        },
        {
          "actionId": "viewTermsOfUse",
          "description": "Exibir a página 'Termos de uso'."
        },
        {
          "actionId": "viewFooterPolicyLinks",
          "description": "Disponibilizar links no rodapé para as páginas de políticas."
        }
      ]
    },
    "ADMIN_MANAGEMENT": {
      "description": "Área administrativa para gerenciar produtos, pedidos e conteúdo.",
      "usesRules": [
        "RULE-USER-ROLES-001",
        "RULE-ECOMMERCE-CORE-001",
        "RULE-INSTITUTIONAL-PAGES-001",
        "RULE-POLICIES-PAGES-001",
        "RULE-LANGUAGE-PTBR-001",
        "RULE-INVENTORY-CONTROL-001",
        "RULE-COUPONS-001",
        "RULE-PRODUCT-REVIEWS-001",
        "RULE-SHIPPING-TRACKING-001",
        "RULE-CHECKOUT-FAQ-001"
      ],
      "isOptional": false,
      "actions": [
        {
          "actionId": "manageProducts",
          "description": "Criar/editar/ativar/desativar produtos e categorias."
        },
        {
          "actionId": "manageInventory",
          "description": "Ajustar e manter o estoque de cada produto."
        },
        {
          "actionId": "manageOrders",
          "description": "Visualizar e atualizar status de pedidos."
        },
        {
          "actionId": "updateShippingTracking",
          "description": "Informar/atualizar código de rastreamento e status detalhado de envio no pedido."
        },
        {
          "actionId": "managePages",
          "description": "Editar páginas institucionais, incluindo 'quem somos', 'contato' e páginas de políticas."
        },
        {
          "actionId": "manageCoupons",
          "description": "Criar/editar/ativar/desativar cupons e definir regras básicas de validade e desconto."
        },
        {
          "actionId": "moderateReviews",
          "description": "Publicar/ocultar avaliações e comentários de produtos."
        }
      ]
    },
    "PRODUCT_REVIEWS": {
      "description": "Permitir que clientes avaliem e comentem produtos, e exibir avaliações publicadas na página do produto.",
      "usesRules": [
        "RULE-PRODUCT-REVIEWS-001",
        "RULE-USER-ROLES-001",
        "RULE-LANGUAGE-PTBR-001",
        "RULE-TONE-VOICE-001"
      ],
      "isOptional": true,
      "actions": [
        {
          "actionId": "submitReview",
          "description": "Cliente registra uma avaliação (nota e comentário opcional) para um produto."
        },
        {
          "actionId": "listPublishedReviews",
          "description": "Exibir avaliações publicadas de um produto."
        }
      ]
    },
    "COUPONS_AND_DISCOUNTS": {
      "description": "Aplicar e validar cupons de desconto no carrinho e refletir o desconto no checkout.",
      "usesRules": [
        "RULE-COUPONS-001",
        "RULE-LANGUAGE-PTBR-001",
        "RULE-TONE-VOICE-001"
      ],
      "isOptional": true,
      "actions": [
        {
          "actionId": "applyCoupon",
          "description": "Aplicar cupom no carrinho e recalcular totais."
        },
        {
          "actionId": "removeCoupon",
          "description": "Remover cupom do carrinho e recalcular totais."
        }
      ]
    },
    "CUSTOMER_ORDER_HISTORY": {
      "description": "Disponibilizar histórico detalhado de pedidos na conta do cliente.",
      "usesRules": [
        "RULE-ECOMMERCE-CORE-001",
        "RULE-LANGUAGE-PTBR-001",
        "RULE-TONE-VOICE-001"
      ],
      "isOptional": false,
      "actions": [
        {
          "actionId": "listMyOrders",
          "description": "Listar pedidos do cliente com principais informações (data, total, status)."
        },
        {
          "actionId": "viewMyOrderDetails",
          "description": "Visualizar detalhes de um pedido (itens, frete, descontos, status e dados de envio quando existirem)."
        }
      ]
    },
    "ORDER_TRACKING": {
      "description": "Permitir que o cliente acompanhe o envio do pedido com status detalhado e código de rastreamento (quando aplicável).",
      "usesRules": [
        "RULE-SHIPPING-TRACKING-001",
        "RULE-LANGUAGE-PTBR-001",
        "RULE-TONE-VOICE-001"
      ],
      "isOptional": false,
      "actions": [
        {
          "actionId": "viewTrackingInfo",
          "description": "Exibir código de rastreamento e status detalhado de envio do pedido."
        }
      ]
    },
    "CHECKOUT_SUPPORT_FAQ": {
      "description": "Gerenciar e exibir um FAQ rápido no checkout, com respostas curtas e links para políticas aplicáveis.",
      "usesRules": [
        "RULE-CHECKOUT-FAQ-001",
        "RULE-LANGUAGE-PTBR-001",
        "RULE-TONE-VOICE-001",
        "RULE-POLICIES-PAGES-001",
        "RULE-USER-ROLES-001"
      ],
      "isOptional": true,
      "actions": [
        {
          "actionId": "listActiveFAQItems",
          "description": "Exibir itens ativos do FAQ no checkout."
        },
        {
          "actionId": "manageFAQItems",
          "description": "Administrador cria/edita/ativa/desativa itens do FAQ e define links para políticas relacionadas."
        }
      ]
    }
  }
}


