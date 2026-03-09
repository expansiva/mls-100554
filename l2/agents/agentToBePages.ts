/// <mls fileReference="_100554_/l2/agents/agentToBePages.ts" enhancement="_100554_enhancementAgent" />

import { IAgentAsync, IAgentMeta } from '/_100554_/l2/aiAgentBase.js';
import { getAgentStepByAgentName, getTemporaryContext } from '/_100554_/l2/aiAgentHelper.js';
import { executeBeforePrompt, loadAgent } from '/_100554_/l2/aiAgentOrchestration.js';
import { saveModuleToBe } from '/_100554_/l2/moduleToBeAST.js';
import { getPayloadToBeConceptual3 } from '/_100554_/l2/agents/agentToBeConceptual3.js';

export function createAgent(): IAgentAsync {
        return {
                agentName: "agentToBePages",
                agentProject: 100554,
                agentFolder: "agents",
                agentDescription: "Generate Page List",
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
        if (userPrompt === 'test') userPrompt = userPromptTest

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

async function beforePromptStep(
        agent: IAgentMeta,
        context: mls.msg.ExecutionContext,
        parentStep: mls.msg.AIAgentStep,
        step: mls.msg.AIAgentStep,
        hookSequential: number,
        args?: string
): Promise<mls.msg.AgentIntent[]> {

        if (!args) throw new Error(`(${agent.agentName})[beforePromptStep] args invalid`);
        const continueIntent: mls.msg.AgentIntentPromptReady = {
                type: "prompt_ready",
                args,
                messageId: context.message.orderAt,
                threadId: context.message.threadId,
                taskId: context.task?.PK || '',
                hookSequential,
                parentStepId: parentStep.stepId,
                humanPrompt: args || '',
                systemPrompt: system1.replace("{{systemExperienceConstraints}}", systemExperienceConstraints)
        }

        return [continueIntent];
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

        const output = payload.result;
        const intents = await processOutputToBePages(context, output as ToBePages, step);

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

async function processOutputToBePages(context: mls.msg.ExecutionContext, toBePages: ToBePages, step: mls.msg.AIAgentStep): Promise<mls.msg.AgentIntent[]> {

        console.log("processOutputToBePages === toBePages");
        console.log({ toBePages });
        if (context.isTest) return [];

        const toBe = getPayloadToBeConceptual3(context);
        if (!toBe) throw new Error(`[processOutputToBePages] invalid toBe: undefined`)

        /*
        const paths = toBePages.pages.map((page) => page.pageName).slice(0, 1);
        const parentStepId = step.stepId;
        const newStep: mls.msg.AgentIntentAddStep = {
                type: "add-step",
                messageId: context.message.orderAt,
                threadId: context.message.threadId,
                taskId: context.task?.PK || '',
                parentStepId: 1,
                step:
                {
                        type: 'agent',
                        stepId: 0,
                        interaction: null,
                        status: 'waiting_human_input',
                        nextSteps: [],
                        agentName: "agentToBePage",
                        prompt: `[agentToBePages] ${JSON.stringify({ toBePages, moduleName: 'petShop' })}`,
                        rags: null,
                },
                executionMode: {
                        type: 'parallel',
                        args: paths
                }
        };

        return [newStep];

        */


        // add new step not working, save toBe in l2 and starting new task
        await saveModuleToBe(mls.actualProject as number, toBe.meta.moduleName, undefined, toBePages);

        const nextAgentInNewTask = 'agentToBePage'
        const prompt = `@@agentToBePage ${JSON.stringify({ toBePages, moduleName: toBe?.meta.moduleName || '' })}`
        const agent = await loadAgent(nextAgentInNewTask);
        if (!agent) throw new Error(`[processOutputToBePages] invalid agent: ${nextAgentInNewTask}`)
        const context2 = getTemporaryContext(context.message.threadId, context.message.senderId, prompt)
        await executeBeforePrompt(agent, context2)
        return [];


}



export function getPayloadToBePages(context: mls.msg.ExecutionContext): ToBePages | undefined {

        if (!context.task) return undefined;
        const agentName = 'agentToBePages'
        const agentStep = getAgentStepByAgentName(context.task, agentName); // Only one agent execution must exist in this task
        if (!agentStep) throw new Error(`[${agentName}] [getPayload] no agent found`);

        const resultStep = agentStep.interaction?.payload?.[0];
        if (!resultStep || resultStep.type !== "flexible" || !resultStep.result) throw new Error(`[${agentName}] [getPayload] No step clarification found for this agent.`);
        let payloadToBePages: ToBePages | string = resultStep.result;
        if (typeof payloadToBePages === "string") payloadToBePages = JSON.parse(payloadToBePages) as ToBePages;
        return payloadToBePages;
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


const userPromptTest = `
## Experience Model
\`\`\`json
{
        "screens": [
                {
                        "screenId": "home",
                        "actor": "customer",
                        "screenType": "page",
                        "isEntryPoint": true,
                        "purpose": "Página inicial do site com destaque para produtos, blog e informações institucionais em tom acolhedor",
                        "supportsCapabilities": [
                                "catalog",
                                "blog",
                                "about",
                                "contact",
                                "cart",
                                "footerContactHighlights"
                        ],
                        "rulesApplied": [
                                "RULE-TONE-001",
                                "RULE-LANG-001",
                                "RULE-CONTACT-002"
                        ]
                },
                {
                        "screenId": "productCatalog",
                        "actor": "customer",
                        "screenType": "page",
                        "purpose": "Listagem de produtos com navegação por categorias, busca e filtros",
                        "supportsCapabilities": [
                                "catalog",
                                "catalogAdvancedFilters"
                        ],
                        "rulesApplied": [
                                "RULE-PRODUCT-001",
                                "RULE-PRODUCT-002",
                                "RULE-PRODUCT-004",
                                "RULE-PRODUCT-005",
                                "RULE-TONE-001",
                                "RULE-LANG-001"
                        ]
                },
                {
                        "screenId": "productDetail",
                        "actor": "customer",
                        "screenType": "page",
                        "purpose": "Página de detalhes do produto com galeria de imagens, descrição completa, preço e disponibilidade",
                        "supportsCapabilities": [
                                "catalog",
                                "cart"
                        ],
                        "rulesApplied": [
                                "RULE-PRODUCT-001",
                                "RULE-PRODUCT-003",
                                "RULE-PRODUCT-005",
                                "RULE-CART-001",
                                "RULE-TONE-001",
                                "RULE-LANG-001"
                        ]
                },
                {
                        "screenId": "cart",
                        "actor": "customer",
                        "screenType": "page",
                        "purpose": "Visualização e gerenciamento do carrinho com CTAs de finalização configurados",
                        "supportsCapabilities": [
                                "cart",
                                "cartCheckoutCtas"
                        ],
                        "rulesApplied": [
                                "RULE-CART-001",
                                "RULE-CART-002",
                                "RULE-CART-003",
                                "RULE-TONE-001",
                                "RULE-LANG-001"
                        ]
                },
                {
                        "screenId": "about",
                        "actor": "customer",
                        "screenType": "page",
                        "purpose": "Página institucional com história e valores do pet shop",
                        "supportsCapabilities": [
                                "about"
                        ],
                        "rulesApplied": [
                                "RULE-CONTENT-001",
                                "RULE-TONE-001",
                                "RULE-LANG-001"
                        ]
                },
                {
                        "screenId": "blogList",
                        "actor": "customer",
                        "screenType": "page",
                        "purpose": "Listagem de posts do blog organizados por tópicos",
                        "supportsCapabilities": [
                                "blog",
                                "blogProductLinking"
                        ],
                        "rulesApplied": [
                                "RULE-BLOG-001",
                                "RULE-BLOG-002",
                                "RULE-TONE-001",
                                "RULE-LANG-001"
                        ]
                },
                {
                        "screenId": "blogPost",
                        "actor": "customer",
                        "screenType": "page",
                        "purpose": "Visualização de post do blog com conteúdo completo e produtos relacionados",
                        "supportsCapabilities": [
                                "blog",
                                "blogProductLinking"
                        ],
                        "rulesApplied": [
                                "RULE-BLOG-001",
                                "RULE-BLOG-002",
                                "RULE-TONE-001",
                                "RULE-LANG-001"
                        ]
                },
                {
                        "screenId": "contact",
                        "actor": "customer",
                        "screenType": "page",
                        "purpose": "Página de contato com informações, WhatsApp clicável, horários, endereço e ação 'Como chegar'",
                        "supportsCapabilities": [
                                "contact",
                                "footerContactHighlights"
                        ],
                        "rulesApplied": [
                                "RULE-CONTACT-001",
                                "RULE-CONTACT-002",
                                "RULE-TONE-001",
                                "RULE-LANG-001"
                        ]
                },
                {
                        "screenId": "adminLogin",
                        "actor": "staff",
                        "screenType": "login",
                        "isEntryPoint": true,
                        "purpose": "Tela de autenticação para acesso à área administrativa",
                        "supportsCapabilities": [
                                "adminProductManagement",
                                "blog",
                                "about",
                                "contact",
                                "catalogAdvancedFilters",
                                "cartCheckoutCtas",
                                "footerContactHighlights"
                        ],
                        "rulesApplied": [
                                "RULE-ROLE-001",
                                "RULE-LANG-001"
                        ]
                },
                {
                        "screenId": "adminDashboard",
                        "actor": "staff",
                        "screenType": "dashboard",
                        "purpose": "Painel administrativo com visão geral de produtos, posts e ações rápidas",
                        "supportsCapabilities": [
                                "adminProductManagement",
                                "blog",
                                "about",
                                "contact",
                                "catalogAdvancedFilters",
                                "cartCheckoutCtas",
                                "footerContactHighlights"
                        ],
                        "rulesApplied": [
                                "RULE-ROLE-001",
                                "RULE-LANG-001"
                        ]
                },
                {
                        "screenId": "adminProductList",
                        "actor": "staff",
                        "screenType": "page",
                        "purpose": "Listagem de produtos para gerenciamento com ações de editar e remover",
                        "supportsCapabilities": [
                                "adminProductManagement"
                        ],
                        "rulesApplied": [
                                "RULE-ROLE-001",
                                "RULE-PRODUCT-001",
                                "RULE-LANG-001"
                        ]
                },
                {
                        "screenId": "adminProductEditor",
                        "actor": "staff",
                        "screenType": "editor",
                        "purpose": "Editor para criação e edição de produtos com campos completos de catálogo",
                        "supportsCapabilities": [
                                "adminProductManagement"
                        ],
                        "rulesApplied": [
                                "RULE-ROLE-001",
                                "RULE-PRODUCT-001",
                                "RULE-PRODUCT-003",
                                "RULE-PRODUCT-004",
                                "RULE-PRODUCT-005",
                                "RULE-LANG-001"
                        ]
                },
                {
                        "screenId": "adminBlogList",
                        "actor": "staff",
                        "screenType": "page",
                        "purpose": "Listagem de posts do blog com indicadores de status editorial (rascunho/publicado)",
                        "supportsCapabilities": [
                                "blog"
                        ],
                        "rulesApplied": [
                                "RULE-ROLE-001",
                                "RULE-BLOG-001",
                                "RULE-BLOG-003",
                                "RULE-LANG-001"
                        ]
                },
                {
                        "screenId": "adminBlogEditor",
                        "actor": "staff",
                        "screenType": "editor",
                        "purpose": "Editor de posts do blog com suporte a rascunho, publicação e pré-visualização",
                        "supportsCapabilities": [
                                "blog",
                                "blogProductLinking"
                        ],
                        "rulesApplied": [
                                "RULE-ROLE-001",
                                "RULE-BLOG-001",
                                "RULE-BLOG-002",
                                "RULE-BLOG-003",
                                "RULE-LANG-001"
                        ]
                },
                {
                        "screenId": "adminBlogPreview",
                        "actor": "staff",
                        "screenType": "page",
                        "purpose": "Pré-visualização do post do blog antes da publicação, simulando visualização do cliente",
                        "supportsCapabilities": [
                                "blog"
                        ],
                        "rulesApplied": [
                                "RULE-ROLE-001",
                                "RULE-BLOG-003",
                                "RULE-LANG-001"
                        ]
                },
                {
                        "screenId": "adminAboutEditor",
                        "actor": "staff",
                        "screenType": "editor",
                        "purpose": "Editor da página 'Sobre Nós' para atualização de história e valores",
                        "supportsCapabilities": [
                                "about"
                        ],
                        "rulesApplied": [
                                "RULE-ROLE-001",
                                "RULE-CONTENT-001",
                                "RULE-LANG-001"
                        ]
                },
                {
                        "screenId": "adminContactSettings",
                        "actor": "staff",
                        "screenType": "settings",
                        "purpose": "Configuração de informações de contato, WhatsApp, horários, endereço e link do mapa",
                        "supportsCapabilities": [
                                "contact",
                                "footerContactHighlights"
                        ],
                        "rulesApplied": [
                                "RULE-ROLE-001",
                                "RULE-CONTACT-001",
                                "RULE-CONTACT-002",
                                "RULE-LANG-001"
                        ]
                },
                {
                        "screenId": "adminCatalogSettings",
                        "actor": "staff",
                        "screenType": "settings",
                        "purpose": "Configuração de filtros avançados do catálogo (tipos de pet, marcas, faixa de preço)",
                        "supportsCapabilities": [
                                "catalogAdvancedFilters"
                        ],
                        "rulesApplied": [
                                "RULE-ROLE-001",
                                "RULE-PRODUCT-004",
                                "RULE-LANG-001"
                        ]
                },
                {
                        "screenId": "adminCartSettings",
                        "actor": "staff",
                        "screenType": "settings",
                        "purpose": "Configuração do caminho de finalização do carrinho e textos dos CTAs",
                        "supportsCapabilities": [
                                "cartCheckoutCtas"
                        ],
                        "rulesApplied": [
                                "RULE-ROLE-001",
                                "RULE-CART-003",
                                "RULE-LANG-001"
                        ]
                }
        ],
        "journeys": [
                {
                        "journeyId": "customerBrowseAndPurchaseIntent",
                        "actor": "customer",
                        "supportsCapabilities": [
                                "catalog",
                                "cart",
                                "cartCheckoutCtas"
                        ],
                        "steps": [
                                {
                                        "screenId": "home"
                                },
                                {
                                        "screenId": "productCatalog"
                                },
                                {
                                        "screenId": "productDetail",
                                        "params": [
                                                "prodId"
                                        ]
                                },
                                {
                                        "screenId": "cart"
                                },
                                {
                                        "screenId": "productDetail",
                                        "params": [
                                                "prodId"
                                        ]
                                },
                                {
                                        "screenId": "cart"
                                }
                        ]
                },
                {
                        "journeyId": "customerSearchProduct",
                        "actor": "customer",
                        "supportsCapabilities": [
                                "catalog",
                                "catalogAdvancedFilters"
                        ],
                        "steps": [
                                {
                                        "screenId": "home"
                                },
                                {
                                        "screenId": "productCatalog"
                                },
                                {
                                        "screenId": "productDetail",
                                        "params": [
                                                "prodId"
                                        ]
                                }
                        ]
                },
                {
                        "journeyId": "customerExploreBlogAndRelatedProducts",
                        "actor": "customer",
                        "supportsCapabilities": [
                                "blog",
                                "blogProductLinking",
                                "catalog"
                        ],
                        "steps": [
                                {
                                        "screenId": "home"
                                },
                                {
                                        "screenId": "blogList"
                                },
                                {
                                        "screenId": "blogPost",
                                        "params": [
                                                "postId"
                                        ]
                                },
                                {
                                        "screenId": "productDetail",
                                        "params": [
                                                "prodId"
                                        ]
                                }
                        ]
                },
                {
                        "journeyId": "customerContactAndVisitStore",
                        "actor": "customer",
                        "supportsCapabilities": [
                                "contact",
                                "footerContactHighlights"
                        ],
                        "steps": [
                                {
                                        "screenId": "home"
                                },
                                {
                                        "screenId": "contact"
                                },
                                {
                                        "screenId": "home"
                                }
                        ]
                },
                {
                        "journeyId": "customerLearnAboutStore",
                        "actor": "customer",
                        "supportsCapabilities": [
                                "about"
                        ],
                        "steps": [
                                {
                                        "screenId": "home"
                                },
                                {
                                        "screenId": "about"
                                },
                                {
                                        "screenId": "contact"
                                }
                        ]
                },
                {
                        "journeyId": "staffLoginAndDashboard",
                        "actor": "staff",
                        "supportsCapabilities": [
                                "adminProductManagement",
                                "blog",
                                "about",
                                "contact"
                        ],
                        "steps": [
                                {
                                        "screenId": "adminLogin"
                                },
                                {
                                        "screenId": "adminDashboard"
                                }
                        ]
                },
                {
                        "journeyId": "staffCreateAndPublishProduct",
                        "actor": "staff",
                        "supportsCapabilities": [
                                "adminProductManagement"
                        ],
                        "steps": [
                                {
                                        "screenId": "adminLogin"
                                },
                                {
                                        "screenId": "adminDashboard"
                                },
                                {
                                        "screenId": "adminProductList"
                                },
                                {
                                        "screenId": "adminProductEditor"
                                },
                                {
                                        "screenId": "adminProductList"
                                },
                                {
                                        "screenId": "adminDashboard"
                                }
                        ]
                },
                {
                        "journeyId": "staffEditProductCatalog",
                        "actor": "staff",
                        "supportsCapabilities": [
                                "adminProductManagement"
                        ],
                        "steps": [
                                {
                                        "screenId": "adminLogin"
                                },
                                {
                                        "screenId": "adminDashboard"
                                },
                                {
                                        "screenId": "adminProductList"
                                },
                                {
                                        "screenId": "adminProductEditor",
                                        "params": [
                                                "prodId"
                                        ]
                                },
                                {
                                        "screenId": "adminProductList"
                                }
                        ]
                },
                {
                        "journeyId": "staffCreateAndPreviewBlogPost",
                        "actor": "staff",
                        "supportsCapabilities": [
                                "blog",
                                "blogProductLinking"
                        ],
                        "steps": [
                                {
                                        "screenId": "adminLogin"
                                },
                                {
                                        "screenId": "adminDashboard"
                                },
                                {
                                        "screenId": "adminBlogList"
                                },
                                {
                                        "screenId": "adminBlogEditor"
                                },
                                {
                                        "screenId": "adminBlogPreview",
                                        "params": [
                                                "postId"
                                        ]
                                },
                                {
                                        "screenId": "adminBlogEditor"
                                },
                                {
                                        "screenId": "adminBlogList"
                                }
                        ]
                },
                {
                        "journeyId": "staffPublishDraftBlogPost",
                        "actor": "staff",
                        "supportsCapabilities": [
                                "blog"
                        ],
                        "steps": [
                                {
                                        "screenId": "adminLogin"
                                },
                                {
                                        "screenId": "adminDashboard"
                                },
                                {
                                        "screenId": "adminBlogList"
                                },
                                {
                                        "screenId": "adminBlogEditor",
                                        "params": [
                                                "postId"
                                        ]
                                },
                                {
                                        "screenId": "adminBlogPreview",
                                        "params": [
                                                "postId"
                                        ]
                                },
                                {
                                        "screenId": "adminBlogList"
                                }
                        ]
                },
                {
                        "journeyId": "staffUpdateAboutPage",
                        "actor": "staff",
                        "supportsCapabilities": [
                                "about"
                        ],
                        "steps": [
                                {
                                        "screenId": "adminLogin"
                                },
                                {
                                        "screenId": "adminDashboard"
                                },
                                {
                                        "screenId": "adminAboutEditor"
                                },
                                {
                                        "screenId": "adminDashboard"
                                }
                        ]
                },
                {
                        "journeyId": "staffConfigureContactAndFooter",
                        "actor": "staff",
                        "supportsCapabilities": [
                                "contact",
                                "footerContactHighlights"
                        ],
                        "steps": [
                                {
                                        "screenId": "adminLogin"
                                },
                                {
                                        "screenId": "adminDashboard"
                                },
                                {
                                        "screenId": "adminContactSettings"
                                },
                                {
                                        "screenId": "adminDashboard"
                                }
                        ]
                },
                {
                        "journeyId": "staffConfigureCatalogFilters",
                        "actor": "staff",
                        "supportsCapabilities": [
                                "catalogAdvancedFilters"
                        ],
                        "steps": [
                                {
                                        "screenId": "adminLogin"
                                },
                                {
                                        "screenId": "adminDashboard"
                                },
                                {
                                        "screenId": "adminCatalogSettings"
                                },
                                {
                                        "screenId": "adminDashboard"
                                }
                        ]
                },
                {
                        "journeyId": "staffConfigureCartCheckout",
                        "actor": "staff",
                        "supportsCapabilities": [
                                "cartCheckoutCtas"
                        ],
                        "steps": [
                                {
                                        "screenId": "adminLogin"
                                },
                                {
                                        "screenId": "adminDashboard"
                                },
                                {
                                        "screenId": "adminCartSettings"
                                },
                                {
                                        "screenId": "adminDashboard"
                                }
                        ]
                }
        ]
}
\`\`\`
## Capabilities Summary
\`\`\`json
[
        {
                "capabilityId": "catalog",
                "description": "Exibição e exploração do catálogo de produtos (categorias, busca e detalhes).",
                "impliesUI": [
                        {
                                "actionId": "listProducts",
                                "description": "Listar produtos com suporte a categorias."
                        },
                        {
                                "actionId": "searchProducts",
                                "description": "Pesquisar produtos por texto."
                        },
                        {
                                "actionId": "viewProductDetails",
                                "description": "Visualizar detalhes do produto (fotos, descrição, preço e disponibilidade)."
                        },
                        {
                                "actionId": "filterProducts",
                                "description": "Filtrar produtos por tipo de pet, marca e faixa de preço."
                        }
                ]
        },
        {
                "capabilityId": "cart",
                "description": "Carrinho para seleção de itens antes de finalizar a compra (externa ou futura).",
                "impliesUI": [
                        {
                                "actionId": "addToCart",
                                "description": "Adicionar produto ao carrinho."
                        },
                        {
                                "actionId": "removeFromCart",
                                "description": "Remover produto do carrinho."
                        },
                        {
                                "actionId": "updateQuantity",
                                "description": "Atualizar quantidade de um item no carrinho."
                        },
                        {
                                "actionId": "viewCart",
                                "description": "Visualizar o carrinho atual."
                        },
                        {
                                "actionId": "viewCheckoutCtas",
                                "description": "Visualizar CTAs de finalização disponíveis no carrinho, com explicação do próximo passo."
                        }
                ]
        },
        {
                "capabilityId": "about",
                "description": "Página institucional 'Sobre Nós' com história e valores.",
                "impliesUI": [
                        {
                                "actionId": "viewAboutPage",
                                "description": "Visualizar a seção 'Sobre Nós'."
                        },
                        {
                                "actionId": "adminEditAboutPage",
                                "description": "Administrador edita história e valores."
                        }
                ]
        },
        {
                "capabilityId": "blog",
                "description": "Blog com artigos para engajamento e informação.",
                "impliesUI": [
                        {
                                "actionId": "listBlogPosts",
                                "description": "Listar posts do blog."
                        },
                        {
                                "actionId": "viewBlogPost",
                                "description": "Visualizar um post do blog."
                        },
                        {
                                "actionId": "adminCreateBlogPost",
                                "description": "Administrador cria um post."
                        },
                        {
                                "actionId": "adminEditBlogPost",
                                "description": "Administrador edita um post."
                        },
                        {
                                "actionId": "adminPublishBlogPost",
                                "description": "Administrador publica um post."
                        },
                        {
                                "actionId": "adminLinkBlogPostToProducts",
                                "description": "Administrador relaciona um post a produtos relevantes."
                        },
                        {
                                "actionId": "adminLinkBlogPostToCategories",
                                "description": "Administrador relaciona um post a categorias relevantes."
                        },
                        {
                                "actionId": "adminSaveDraftBlogPost",
                                "description": "Administrador salva post como rascunho."
                        },
                        {
                                "actionId": "adminPreviewBlogPost",
                                "description": "Administrador pré-visualiza o post antes de publicar."
                        }
                ]
        },
        {
                "capabilityId": "contact",
                "description": "Página/área de contato com informações claras e mapa de localização (quando houver).",
                "impliesUI": [
                        {
                                "actionId": "viewContactInfo",
                                "description": "Visualizar informações de contato."
                        },
                        {
                                "actionId": "viewMapLocation",
                                "description": "Visualizar/abrir mapa da localização física, quando houver."
                        },
                        {
                                "actionId": "adminEditContactInfo",
                                "description": "Administrador edita informações de contato e link do mapa."
                        },
                        {
                                "actionId": "viewWhatsAppContact",
                                "description": "Acessar WhatsApp clicável quando configurado."
                        },
                        {
                                "actionId": "viewBusinessHours",
                                "description": "Visualizar horários de atendimento quando configurados."
                        },
                        {
                                "actionId": "viewDirections",
                                "description": "Acionar 'Como chegar' quando endereço/mapa estiverem configurados."
                        }
                ]
        },
        {
                "capabilityId": "adminProductManagement",
                "description": "Administração de produtos e conteúdo do catálogo.",
                "impliesUI": [
                        {
                                "actionId": "adminCreateProduct",
                                "description": "Administrador cadastra produto."
                        },
                        {
                                "actionId": "adminEditProduct",
                                "description": "Administrador edita produto."
                        },
                        {
                                "actionId": "adminRemoveProduct",
                                "description": "Administrador remove produto."
                        },
                        {
                                "actionId": "adminSetProductPrice",
                                "description": "Administrador define/atualiza o preço do produto."
                        },
                        {
                                "actionId": "adminSetProductStockAvailability",
                                "description": "Administrador define/atualiza a disponibilidade de estoque do produto."
                        },
                        {
                                "actionId": "adminSetProductPetType",
                                "description": "Administrador define/atualiza o tipo de pet associado ao produto (quando aplicável)."
                        },
                        {
                                "actionId": "adminSetProductBrand",
                                "description": "Administrador define/atualiza a marca do produto (quando aplicável)."
                        },
                        {
                                "actionId": "adminSetProductShortHighlight",
                                "description": "Administrador define/atualiza o destaque curto do produto para cards/listagens (quando aplicável)."
                        },
                        {
                                "actionId": "adminSetProductPrimaryImage",
                                "description": "Administrador define/atualiza a imagem principal do produto para cards/listagens (quando aplicável)."
                        }
                ]
        },
        {
                "capabilityId": "catalogAdvancedFilters",
                "description": "Configuração e disponibilização de filtros avançados no catálogo (tipo de pet, marca e faixa de preço).",
                "isOptional": true,
                "impliesUI": [
                        {
                                "actionId": "adminEnableAdvancedFilters",
                                "description": "Administrador habilita/desabilita filtros avançados no catálogo."
                        },
                        {
                                "actionId": "adminConfigureFilterOptions",
                                "description": "Administrador ajusta opções e critérios de filtragem (ex: quais tipos de pet e marcas aparecem)."
                        }
                ]
        },
        {
                "capabilityId": "blogProductLinking",
                "description": "Relacionar posts do blog a produtos e categorias relevantes para conectar conteúdo e catálogo.",
                "isOptional": true,
                "impliesUI": [
                        {
                                "actionId": "showRelatedProductsOnBlogPost",
                                "description": "Exibir produtos relacionados ao final (ou em área dedicada) de um post do blog."
                        },
                        {
                                "actionId": "showRelatedBlogPostsOnCategory",
                                "description": "Exibir posts do blog relacionados ao navegar por uma categoria de produto."
                        }
                ]
        },
        {
                "capabilityId": "cartCheckoutCtas",
                "description": "Configurar e apresentar CTAs de finalização no carrinho alinhados ao caminho de compra escolhido (ex.: WhatsApp/parceiro), com texto explicativo do que acontece ao clicar.",
                "isOptional": true,
                "impliesUI": [
                        {
                                "actionId": "adminConfigureCheckoutPath",
                                "description": "Administrador configura o caminho de finalização do carrinho (ex.: WhatsApp, parceiro, outro)."
                        },
                        {
                                "actionId": "adminConfigureCheckoutCtaText",
                                "description": "Administrador define textos do CTA e explicação do próximo passo para o cliente."
                        },
                        {
                                "actionId": "showCheckoutCtasInCart",
                                "description": "Exibir CTAs de finalização no carrinho conforme configuração."
                        }
                ]
        },
        {
                "capabilityId": "footerContactHighlights",
                "description": "Destacar no rodapé e em áreas de contato: WhatsApp clicável, horários, endereço e ação 'Como chegar' quando houver localização configurada.",
                "isOptional": true,
                "impliesUI": [
                        {
                                "actionId": "adminEnableFooterContactHighlights",
                                "description": "Administrador habilita/desabilita destaques de contato no rodapé."
                        },
                        {
                                "actionId": "showFooterWhatsApp",
                                "description": "Exibir WhatsApp clicável no rodapé quando configurado."
                        },
                        {
                                "actionId": "showFooterBusinessHours",
                                "description": "Exibir horários no rodapé quando configurados."
                        },
                        {
                                "actionId": "showFooterAddressAndDirections",
                                "description": "Exibir endereço e ação 'Como chegar' no rodapé quando endereço/mapa estiverem configurados."
                        }
                ]
        }
]
\`\`\`

`



