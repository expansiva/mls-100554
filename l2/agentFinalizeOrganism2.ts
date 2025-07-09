/// <mls shortName="agentFinalizeOrganism2" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { getPromptByHtml } from './_100554_aiPrompts';
import { getPayload1, PayLoad1, readDefs } from './_100554_agentFinalizeOrganism';

import {
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    getAgentStepByAgentName,
    getNextStepIdAvaliable,
    notifyTaskChange,
    updateStepStatus
} from "./_100554_aiAgentHelper";

import {
    startNewInteractionInAiTask,
    startNewAiTask,
    executeNextStep,
    addNewStep,
    ClarificationValue,
    startClarification
} from "./_100554_aiAgentOrchestration";

const agentName = "agentFinalizeOrganism2";
const project = 100554;

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Agent for create a organism from wireframe - 2",
        visibility: "public",
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        }
    };
}

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    const taskTitle = "Planning...";
    if (!context || !context.message) throw new Error("Invalid context");

    if (!context.task) {
        const inputs: any = await getPrompts(await getPayload1Mock());
        await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt);
        return;
    }
    // const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
    // if (!step) throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);

    // if (!step.prompt) throw new Error(`[${agentName}] beforePrompt: No prompt found in step for this agent.`);
    // const inputs = await getPrompts(step.prompt);
    // await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);
}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    // if (!context || !context.message || !context.task) throw new Error("Invalid context");
    // const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    // if (!step) throw new Error(`[${agentName}] afterPrompt: No in progress interaction found.`);
    // context.task = await updateStepStatus(context.task, step.stepId, "completed");
    // notifyTaskChange(context);
    // await executeNextStep(context);
}

async function getProjectStates(payload1: PayLoad1): Promise<string> {
    // from project.ts
    return `
/// <mls shortName="projectStates" project="102009" enhancement="_blank" />

import {
  getState,
  setState,
  subscribe,
  unsubscribe,
  notify,
  initState
} from './_100554_collabState';


export const homeVersion = 3;
export const aboutVersion = 2;
export const contactVersion = 5;

export type PageVersions = {
  home: number;
  about: number;
  contact: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role?: string;
  active?: boolean;
};

// ex: ui.actualPage
initState('ui', {
    actualPage: 'home',
    pageVersions: {
      home: homeVersion,
      about: aboutVersion,
      contact: contactVersion
    }
});
initState('auth', {
    user: null
});
    `
}

async function getTablesInformation(payload1: PayLoad1): Promise<string> {
    // neste exemplo foi solicitado 2 tabelas
    // "tableUser",
    return `
### tableUser
/// <mls shortName="tableUsuario" project="102009" enhancement="_100554_enhancementLit" groupName="petshop" />

/**
 * Acesso via state:
 * - db.usuarios[id].campo → dados do usuário
 * - db.usuarios[id].details.campo → dados adicionais
 * - db.usuarios.action → status da tabela
 */

export interface Usuario {
  id: number;             // db.usuarios[id].id
  nome: string;           // db.usuarios[id].nome
  email: string;          // db.usuarios[id].email
  senha?: string;         // db.usuarios[id].senha
  tipo: 'admin' | 'cliente'; // db.usuarios[id].tipo
  status?: string;        // db.usuarios[id].status
  facebookId?: string;    // db.usuarios[id].facebookId
  instagramId?: string;   // db.usuarios[id].instagramId
  details: UsuarioDetails;// db.usuarios[id].details
}

export interface UsuarioDetails {
  endereco?: string;                  // db.usuarios[id].details.endereco
  telefone?: string;                  // db.usuarios[id].details.telefone
  historicoAgendamentos?: number[];   // db.usuarios[id].details.historicoAgendamentos
  historicoPedidos?: number[];        // db.usuarios[id].details.historicoPedidos
}

export interface UsuarioOtherStates {
  action: DBUsuarioActionState;       // db.usuarios.action
}

export interface DBUsuarioActionState {
  status: 'idle' | 'loading' | 'saving' | 'error';
  error?: string;
  lastAction?: 'create' | 'update' | 'delete' | 'load';
  lastId?: string;
}
    `;
}

async function getAdditionalInformation(payload1: PayLoad1): Promise<string> {
    // retirado exemplo de task#1751984742101
    return `### pages-in-the-module
    - home: Apresentar o petshop, principais serviços, destaques do catálogo e chamadas para ação.
    - catalogo: Exibir o catálogo de produtos com busca, filtros e detalhes.
    - agendamento: Permitir que clientes agendem banho e tosa, visualizem e gerenciem seus agendamentos.
    - contato: Permitir que visitantes e clientes entrem em contato com o petshop.
    - login: Permitir login de administradores e clientes, incluindo login social.
    - admin: Painel administrativo para gerenciar produtos, agendamentos e usuários.
    - pagamento: Processar pagamentos online de serviços e produtos.
    
    ### plugins-in-the-module
    1. pluginType: "third-party"
    - pluginfacebook: Permitir integração com Facebook para login social e compartilhamento.
    - plugininstagram: Permitir integração com Instagram para login social e compartilhamento.
    - pluginpagamento: Processar pagamentos online via cartão, boleto e Pix.
    2. pluginType: "ui"
    - pluginthemeswitcher: Permitir alternância de tema (claro/escuro) para melhor experiência do usuário.
    - pluginscrolltotop: Facilitar navegação em páginas longas.
    `;
}

async function getWidgetsGroupDefinitions(payload1: PayLoad1): Promise<string> {
    // solicitação foi 
    // "ica-navigation-links",
    // "ica-apresentation-image",
    // "ica-interaction-button"
    // replace " Cfg: " -> " @PropertyCompositeDataSource: "
    // replace " Bind: " -> " @propertyDataSource: "
    // replace " Text: " -> " @PropertyCompositeDataSource: "
    // 
    return `
### ica-navigation-links
Flexible navigation base molecule for implementing navigation structures.
- @PropertyCompositeDataSource: config
- @propertyDataSource: selected (auto-updated when scrolling or clicking)
- Interface Config {
  scrollSync?: boolean,      // if true, updates selected as the user scrolls
  offset?: number,           // pixels from top to consider section active
  items: {
    label: string,
    href: string,            // can be external ("/produtos") or anchor ("#faq")
    icon?: string,
    badge?: string | number,
    disabled?: boolean
  }[]
}
Specialized widget examples:
- 'link': Simple navigation link list (horizontal or vertical)
- 'dropdown menu': Dropdown navigation
- 'breadcrumb': Breadcrumb trail
- 'button bar': Navigation as a set of buttons
- 'scrollspy': Anchor sidebar with auto-highlight on scroll

### ica-apresentation-image
Displays a single image, icon, or avatar.
Type defines the visual variation and styling.
- @PropertyCompositeDataSource: config
- interface config {
  type: "image" | "icon" | "avatar",
  src?: string,         // for image or avatar
  icon?: string,        // for icon
  alt?: string,
  width?: string,
  height?: string,
  srcset?: string,
  sizes?:string,
  size?: string,        // icon or avatar
  color?: string,       // icon only
  shape?: "circle" | "square" // avatar only
}

### ica-interaction-button
Reusable button for interface actions.  
Can be placed in toolbars, cards, modals or item lists.  
Supports different visual variants, icons and click behaviors.
- @PropertyCompositeDataSource: config  
- @PropertyDataSource:: notifyPath (optional — state path to update on click, e.g. '{{ ui.action }}'),  
    notifyValue (optional — value to assign to that state on click)
- interface config {
  label?: string,              // text displayed on the button
  icon?: string,               // icon name (e.g. "save", "edit")
  type?: "onlyText" | "onlyIcon" | "full",
  disabled?: boolean,          // disables the button when true
  tooltip?: string             // text shown on hover
}
    `;
}

async function getPrompts(payload1: PayLoad1): Promise<mls.msg.IAMessageInputType[]> {
    if (!payload1.userPrompt || !payload1.defs) throw new Error(`Erro[${agentName}]getPrompts: invalid userPrompt`);
    const data: Prompts2 = {
        additionalInformation: await getAdditionalInformation(payload1),
        widgetsGroupDefinitions: await getWidgetsGroupDefinitions(payload1),
        tablesInformation: await getTablesInformation(payload1),
        projectStates: await getProjectStates(payload1),
        defs: JSON.stringify(payload1.defs, null, 2),
        userPrompt: payload1.userPrompt,
    };
    const prompts = await getPromptByHtml({ project, shortName: agentName, folder: '', data })
    return prompts;
}

interface Prompts2 {
    additionalInformation: string;
    widgetsGroupDefinitions: string;
    tablesInformation: string;
    projectStates: string;
    defs: string;
    userPrompt: string;
}

async function getPayload1Mock(): Promise<PayLoad1> {
    return {
        "organismSummary": "Barra de navegação principal do site, visível para todos os usuários, exibindo logo, links principais e opções de login/logout com cores vivas para destacar os elementos e melhorar a experiência visual.",
        "organismPurpose": "view",
        "widgetsGroups": [
            "ica-navigation-links",
            "ica-apresentation-image",
            "ica-interaction-button"
        ],
        "additionalInformations": [
            "pages-in-the-module"
        ],
        "tables": [
            "tableUser",
            "tableLinks"
        ],
        defs: await readDefs(),
        userPrompt: "definir organismo"
    }
}

