/// <mls shortName="agentCreateSite" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { preferModelType, systemComponentsInstruction } from './_100554_aiPrompts';
import { getNextPendingStepByAgentName, getNextInProgressStepByAgentName, getAgentStepByAgentName, updateStepStatus, getNextPendentStep, appendLongTermMemory, getAgentsStepByAgentName, updateTaskTitle } from "./_100554_aiAgentHelper";
import { startNewInteractionInAiTask, addNewStep, executeNextStep } from "./_100554_aiAgentOrchestration";
import { getImages } from "./_100554_libUnsplash";
import { widgetsDefault } from "./_100554_icaBaseDescription";
import { convertFileNameToTag, convertTagToFileName } from './_100554_utilsLit';
import { createNewFile } from "./_100554_pluginNewFileBase";

import { TemplateContent, TemplateChild, ChildElement, Organism, Molecule, Media } from './_100554_agentAnalyzeNewModuleBase';

const ICATEMPLATE = 'ica-template-100554';
const ICAORGANISM = 'ica-organism-100554';
const PROJECTICA = 100554;
const MODEOVERLAYDEFAULT = 'wcd-overlay-mode-default-100554';

const agentName = "agentCreateSite";
const enhancement = '_100554_enhancementLit';

export function createAgent(): IAgent {
  return {
    agentName,
    avatar_url: svg_agent,
    agentDescription: "Analisador de novos modulos 2",
    visibility: "private",
    async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
      return _beforePrompt(context);
    },
    async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
      return _afterPrompt(context);
    },
  }
};

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
  const taskTitle = "Planning";

  if (!context || !context.message) throw new Error("Invalid context");
  if (!context.task) throw new Error("Invalid task");

  const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
  if (!step) throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);

  context.task = await updateStepStatus(context.task, step.stepId, "in_progress");

  const remainingTasks = getRemainingTasksIds(context.task);
  if (!remainingTasks || remainingTasks.length === 0) throw new Error("remainingTasks === 0");
  const taskId = remainingTasks[0];

  console.info({
    beforePrompt: step.prompt,
    taskId
  })

  const allStepsTasksComplete = getAgentsStepByAgentName(context.task, 'agentCreateSite', 'completed');
  const inputs = await getPrompts(taskId, step.prompt, step.rags, allStepsTasksComplete);
  await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);

}


const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {

  if (!context || !context.message || !context.task) throw new Error("Invalid context");
  const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
  if (!step) throw new Error(`[${agentName}] afterPrompt: No pending interaction found.`);

  context.task = await updateStepStatus(context.task, step.stepId, "completed");

  const remainingTasks = getRemainingTasksIds(context.task);
  remainingTasks.shift();
  const task = await appendLongTermMemory(context, { remainingTasks: remainingTasks.join(',') });
  context.task = task;

  if (!remainingTasks || remainingTasks.length === 0) {
    const allResults = getAllStepsThisAgent(context);
    const allResults2 = await execPrepareMidias(allResults);
    const allResults3 = execPrepareWidgetsDefault(allResults2);
    const pages = execPrepareHTML(allResults3);
    await execPrepareOrganismAndTemplates(context, allResults3);
    await execCreatePages(pages);
    return;

  }

  const stepAgentAnalyzeNewModule2 = getAgentStepByAgentName(context.task, 'agentAnalyzeNewModule2');
  if (!stepAgentAnalyzeNewModule2) throw new Error(`[${agentName}] afterPrompt: no find parent step AgentAnalyzeNewModule2.`);
  const data = stepAgentAnalyzeNewModule2.interaction?.payload ? (stepAgentAnalyzeNewModule2.interaction?.payload[0] as any).content : undefined
  const newStep: mls.msg.AIPayload = {
    agentName: 'agentCreateSite',
    prompt: JSON.stringify(data),
    status: 'pending',
    stepId: step.stepId + 1,
    interaction: null,
    nextSteps: null,
    rags: null,
    type: 'agent'
  }
  await addNewStep(context, step.stepId, [newStep]);

}


function getAllStepsThisAgent(context: mls.msg.ExecutionContext): TemplateContent[] {
  if (!context || !context.task) throw new Error(`[${agentName}] Not found context on getAllStepsThisAgent`);
  const allSteps = getAgentsStepByAgentName(context.task, 'agentCreateSite');
  const allResults = allSteps.map((step) => {
    const payload = step.interaction?.payload?.[0]
    if (payload) return (payload as any).content
  }).filter((s) => s !== undefined).flat();

  return allResults;
}

async function execCreatePages(data: Record<string, { el: HTMLElement; data: TemplateContent; }>) {

  const keys = Object.keys(data);
  for await (let key of keys) {
    const page = data[key];
    await createTemplatePage(key, page)
  }
}

async function createTemplatePage(fileName: string, data: { el: HTMLElement; data: TemplateContent; }) {

  const { project, shortName } = mls.l2.getPath(fileName);
  const tagName = convertFileNameToTag(fileName);

  const ts = `
/// <mls shortName="${shortName}" project="${project}" enhancement="_100554_enhancementLit" groupName="other" />

import { CollabPageElement } from './_100554_collabPageElement';
import { customElement } from 'lit/decorators.js';
import { globalState, initState, setState } from './_100554_collabState';

@customElement('${tagName}')
export class ${fileName} extends CollabPageElement {

    initPage() {

    }
}`;

  await createNewFile(
    { project, position: 'right', shortName, enhancement, sourceTS: ts.trim(), sourceHTML: data.el.outerHTML.trim(), sourceLess: '', openPreview: false }
  );
}

function execPrepareHTML(allResults: TemplateContent[]) {

  const result: Record<string, { el: HTMLElement, data: TemplateContent }> = {};
  const result2: Record<string, { el: HTMLElement, data: TemplateContent }> = {};
  const actualProject = mls.actual[5].project;

  for (const task of allResults) {

    const template = task.template;
    const prepareElements = async (childs: TemplateChild[] | ChildElement[], parent: HTMLElement) => {
      for (const child of childs) {

        if ("organismOrMolecule" in child && "attributes" in child.organismOrMolecule) {
          const _child = child.organismOrMolecule as Molecule;
          const tagName = `${_child.name}-${PROJECTICA}`;
          const str = `<${tagName} widget=${_child.widget} ${_child.attributes}> </${tagName}>`;
          parent.innerHTML = parent.innerHTML + str;

        } else if ("organism" in child) {
          const _organism = child.organism as Organism;
          const organinsEl = document.createElement(ICAORGANISM);
          const tagName = `${_organism.name}-${actualProject}`;
          organinsEl.setAttribute('widget', tagName);
          organinsEl.className = child.class;
          parent.appendChild(organinsEl);
          prepareElements(_organism.childs, organinsEl);
        }
      }
    }

    const templateElement = document.createElement(ICATEMPLATE);
    const tagName = `${template.name}-${actualProject}`;
    templateElement.setAttribute('widget', tagName);
    result[template.name] = { el: templateElement, data: task };
    if (template?.childs) prepareElements(template.childs, templateElement);

  }

  const prepareName = (name: string) => {
    const { project } = mls.actual[5];
    return `_${project}_${name}`;
  }

  Object.keys(result).forEach((key, index) => {
    const item = result[key];
    const name = prepareName(`pageNew${index}`);
    const tag = convertFileNameToTag(name);
    const page = document.createElement(tag);
    page.setAttribute('modeoverlay', MODEOVERLAYDEFAULT);
    page.appendChild(item.el);
    result2[name] = { el: page, data: item.data };
  });

  return result2;

}

function execPrepareWidgetsDefault(allResults: TemplateContent[]) {

  for (const task of allResults) {
    const template = task.template;

    const collectMidias = async (childs: TemplateChild[] | ChildElement[]) => {
      for (const child of childs) {
        if ("organismOrMolecule" in child && "attributes" in child.organismOrMolecule) {
          const _child = child.organismOrMolecule as Molecule;
          _child.widget = widgetsDefault[_child.name];
        } else if ("organism" in child) {
          const _organism = child.organism as Organism;
          collectMidias(_organism.childs);
        }
      }
    }
    if (template?.childs) collectMidias(template.childs);
  }

  return allResults;

}

async function execPrepareMidias(allResults: TemplateContent[]) {

  for await (const task of allResults) {
    const template = task.template;
    const collectMidias = async (childs: TemplateChild[] | ChildElement[]) => {
      for (const child of childs) {
        if ("organismOrMolecule" in child && "attributes" in child.organismOrMolecule) {
          const _child = child.organismOrMolecule as Molecule;
          if (!_child.medias) continue;
          for (const media of _child.medias) {
            if (media.mediaType === 'image') {
              console.info({
                imageToSearch: {
                  media,
                  _child
                }
              });
              const res = await getImages(media.searchText, 1, 1);
              const [image] = res.images;
              if (!image) continue;

              const escapedFileName = media.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              const regex = new RegExp(escapedFileName, 'g');

              if (typeof _child.attributes === 'string') {
                _child.attributes = _child.attributes.replace(regex, image.urls.regular);
              }

            };
            if (media.mediaType === 'sound') continue;
            if (media.mediaType === 'video') continue;
          }
        } else if ("organism" in child) {
          const _organism = child.organism as Organism;
          await collectMidias(_organism.childs);
        }
      }
    }

    if (template?.childs) await collectMidias(template.childs);

  }

  return allResults;
}

async function execPrepareOrganismAndTemplates(context: mls.msg.ExecutionContext, allResults: TemplateContent[]) {

  if (!context || !context.task) throw new Error(`[${agentName}] Not found context on execPrepareMolecules`);
  const step = getNextPendentStep(context.task) as any;
  if (!step || step.type !== 'flexible') throw new Error(`[${agentName}] Invalid next pendent step on execPrepareMolecules`);
  if (!step.content) throw new Error(`[${agentName}] Not found "content" in flexible result`);

  const templateAndOrganismToCreate = extractTemplatesAndOrganisms(allResults);
  console.info({
    templateAndOrganismToCreate: templateAndOrganismToCreate
  });

  const newStep: mls.msg.AIPayload = {
    agentName: 'agentCreateOrganism',
    prompt: JSON.stringify([...templateAndOrganismToCreate.templates, ...templateAndOrganismToCreate.organisms]),
    status: 'pending',
    stepId: step.stepId + 1,
    interaction: null,
    nextSteps: null,
    rags: null,
    type: 'agent'
  }

  await addNewStep(context, step.stepId, [newStep]);

}

function extractTemplatesAndOrganisms(tasks: TemplateContent[]) {
  const templateNames = new Set<any>();
  const organismNames = new Set<any>();

  const prepareName = (name: string) => {
    const { project } = mls.actual[5];
    return `${name}-${project}`;
  }

  const collectOrganisms = (childs: TemplateChild[] | ChildElement[]) => {
    for (const child of childs) {

      if ("organism" in child) {
        const _child = child as TemplateChild;
        const org = _child.organism;
        if (org.name) organismNames.add({
          name: prepareName(org.name),
          description: org.description,
          class: org.childs.map((child) => child.class)
        });
        if (org.childs) collectOrganisms(org.childs);
      } else if ("organismOrMolecule" in child && !("attributes" in child.organismOrMolecule)) {

        const _child = child.organismOrMolecule as Organism;
        if (_child.name) organismNames.add({
          name: prepareName(_child.name),
          description: _child.description,
          class: _child.childs.map((child) => child.class)
        });
        collectOrganisms(child.organismOrMolecule.childs);
      }
    }

  };

  for (const task of tasks) {
    const template = task.template;

    if (template?.name) {
      templateNames.add({
        name: prepareName(template.name),
        description: template.description,
        class: template.childs.map((child) => child.class)
      });
    }

    if (template?.childs) {
      collectOrganisms(template.childs);
    }

  }

  return {
    templates: Array.from(templateNames),
    organisms: Array.from(organismNames)
  };
}

export async function getPrompts(taskId: string, prompt: string | undefined, rags: string[] | null, tasks: mls.msg.AIPayload[]): Promise<mls.msg.IAMessageInputType[]> {
  if (!prompt || prompt.length < 3) throw new Error("Invalid Prompt");
  const prompts: mls.msg.IAMessageInputType[] = [];

  let allResults: TemplateContent[] = []

  if (tasks) {
    allResults = tasks.map((step) => {
      const payload = step.interaction?.payload?.[0]
      if (payload) return (payload as any).content
    }).filter((s) => s !== undefined).flat() as TemplateContent[];
  }

  prompts.push(systemMainInstruction(taskId, allResults));
  prompts.push(outputFormat());
  prompts.push(componentCompositionStandard());
  prompts.push(atomicDesignMolecules());
  prompts.push(systemComponentsInstruction())
  prompts.push(collabStates());

  prompts.push({
    type: 'human',
    content: `## Definições da task \n\n ${prompt}`
  });

  return prompts;
}

/*
 
## Contexto Global (Retrieve)
Defina o objetivo e as necessidades da página, dados disponíveis, público-alvo e função principal.
Analise a seção "## Definições da task":
 - O objeto task contém várias tasks. Cada task começa contem identificador "id":  (ex: {"id": "t1" }). 
 - Analise *TODAS* as tasks. 
 - Para cada task, gerar 2 versões com diferenças entre textos e criatividade.
 - Nomeie seguindo o padrão: [idTask][idVersão]  => Exemplo: (ex: t1v1, t1v2, t2v1, etc)... 
 - Não omita nenhuma task. Verifique todas que estiverem listadas no JSON.
 - Use somente as tabelas relacionadas neste módulo.
 
---------
 
## Contexto Global (Retrieve)
Defina o objetivo e as necessidades da página, dados disponíveis, público-alvo e função principal.
Analise a seção "## Definições da task" abaixo, e analise a task "t1". Gere 2 versões com diferenças entre textos e criatividade, nomeie como "t1v1" e "t1v2". Use somente as tabelas relacionadas neste módulo.
Analise a seção "## Padrão de Composição dos Componentes"
analise a seção "## Collab States"
 
*/


function systemMainInstruction(taskId: string, allResults: TemplateContent[]): mls.msg.IAMessageInputType {
  return {
    type: 'system',
    content: `${preferModelType("code")}
Você é responsável por gerar uma nova página web para o sistema Collab.

## Objetivo
Retornar um JSON compatível com a interface definida na seção "## Formato de saída".

## Contexto Global (Retrieve)
Defina o objetivo e as necessidades da página, dados disponíveis, público-alvo e função principal.
Analise a seção "## Definições da task" abaixo, e analise a task "${taskId}". Use somente as tabelas relacionadas neste módulo.
Analise a seção "## Padrão de Composição dos Componentes"
analise a seção "## Collab States"


## Pense e decida sobre a estrutura geral da página (Decide)
Use o modelo Atomic Design para organizar os componentes da interface:
- Átomos: elementos básicos (texto, imagem, botão). Não serão relacionados aqui.
- Moléculas: pequenos agrupamentos reutilizáveis (ex: input + label). Já existe uma lista dos possíveis que podem ser utilizados.
- Organismos: seções completas da interface (ex: cabeçalho, lista de itens), nomes iniciam com "organism-".
- Template: define o layout da página e onde cada organismo se encaixa, nome inicia com "template-".

## States
Decida quais states para o controle da página serão necessários.
- Toda comunicação com o backend ocorre via states com prefixo "db." (ex: 'db.produto', 'db.categoria'). Nos states "db." ficam os registros dos bancos de dados.
- Toda lógica e controle visual no frontend é feito com states com prefixo "ui.".
- Tabelas intermediárias ou que devem ser preparadas, como por exemplo, para chart , deverão iniciar com "ui.".
- O TypeScript escuta mudanças nos states "ui." e executa ações baseadas neles, como ler tabelas e atualizar states "db.".
- Por exemplo se um botão 'save' for pressionado, pode alterar um state "{{ui.action}}", com o valor 'save' , o typescript irá agir conforme necessário.

## Template
Decida qual template será utilizado dentro os disponíveis, lista abaixo, ou decida criar um novo, justifique isto
Os templates serão web componentes.
Na descrição do template , para templates novos, inclua quais filhos serão esperados e com quais classes.
Pense em um template que poderá ser reaproveitado em outras páginas, exemplo de nome "template-dashboard".

## Organisms
Decida quais organismos serão utilizados dentro dos disponíveis abaixo na seção "## Organismos disponíveis no projeto", ou decida criar um novo. Justifique a decisão com base em sua função e possibilidade de reaproveitamento.
Regras:
- Os organismos devem ser web components.
- Pense em organismos com papéis estruturais ou lógicos que possam ser usados em outras páginas do sistema.

Exemplos úteis de organismos reutilizáveis:
- organism-header (cabeçalho comum com logo e nome do sistema)
- organism-filter-bar (barra de filtros genérica)
- organism-item-list (lista padronizada de itens)
- organism-detail-view (visualização de detalhes de qualquer entidade)
- organism-empty-state (mensagem genérica para "sem dados")
- organism-table-list (lista cada registro em uma linha, com opção de seleção, várias colunas, paginação)

## moleculesOrOrganism
Cada Organismo poderá ter filhos organismo ou molécula.
- Em que momentos usar uma molécula
  a. Procure na seção "## Atomic Design – Moléculas (Molecules)" pelas moléculas que poderão ser utilizadas.
- Em que momentos preferir um organismo
  a. Para lidar com cenários exclusivos (ex: etapas de um fluxo).
  b. Para suportar níveis de detalhamento progressivo (ex: lista → detalhe → formulário).
  c. Para dividir seções complexas de uma página em blocos lógicos reutilizáveis.
  d. Se tem um layout importante para a tela, como cards, etc 

## Assets em moleculas
Algumas moléculas permite o uso de imagens, videos e sons (assets) em seus atributos
- Procure os assets disponíveis em "## Assets disponíveis no projeto"
- Importante: Se definir um path de midia nos atributos ex: [banner-petshop-hero.jpg], **OBRIGATORIAMENTE** adicione dentro da seção Medias, um item com as informaçoes da media => ex Medias: [{{ name:  '[banner-petshop-hero.jpg]', mediaType: 'image',  searchText: string}]
- nomeie o asset com um nome de arquivo temporário e use o nome nos atributos da molécula, exemplo "src="[imagem1.png]". Não use pastas ou caminhos aqui.
- a seção Media permite que uma outra etapa pesquise um asset que mais se encaixe, então use o campo 'searchText' em ingles , de uma forma a pesquisar nos sites especializados.

## Templates disponíveis no projeto
${getTemplatesAvaliables(allResults)}

## Organismos disponíveis no projeto
${getOrganismAvaliables(allResults)}

## Assets disponíveis no projeto
${getAssetsAvaliables(allResults)}

`
  }
}


function outputFormat(): mls.msg.IAMessageInputType {
  return {
    type: 'system',
    content: `
## Formato de saida
Você deve retornar um objeto no formato JSON, conforme interface Saida abaixo

export interface Saida {
  type: "flexible",
  content: Tasks[]
}

export interface Task {
    id: string;
    uiStates: UIState[];
    template: {
      name: string;
      exists: boolean;
      reusable: boolean;
      description: string; // short description
      childs: [{
        class: string;
        organism: Organism;
      }]
    };
  implementationNotes?: string[]; // Observações sobre incertezas ou problemas não solucionados
}

export interface UIState {
  name: string; // Nome completo do state, prefixado com "ui.", ex: "{{ui.produto.filter}}"
  description: string; // O que representa ou controla ex: "alterado pelo usuário, contem o valor do filtro"
}

export interface Organism {
  name: string;
  exists: boolean;
  reusable: boolean;
  description: string;
  layoutRole: string;
  childs: [{
    class: string;
    description: string;
    organismOrMolecule: Organism | Molecule;
  }]
}

export interface Molecule {
  name: string;
  medias: Media[]; // Para cada midia(image, sound ou video) definido, adicionar uma entrada no array.
  description: string;
  attributes: string; // Gere a string de atributos no formato name="xxx" value="yyy" — apenas os pares, sem aspas ao redor da string inteira
}

export interface Media {
  name: string;
  mediaType: 'image' | 'sound' | 'video';
  searchText: string;
}
`
  }
}

function componentCompositionStandard(): mls.msg.IAMessageInputType {
  return {
    type: 'system',
    content: `
## Padrão de Composição dos Componentes

Todos os componentes do Collab não utilizam Shadow DOM nem slots. Em vez disso, eles esperam elementos filhos diretos com classes específicas que indicam seu papel estrutural.

Regras:
- O componente não deve declarar '<slot>'.
- Os filhos devem ser elementos diretos e possuir classes bem definidas.
- A renderização e organização é feita com base nessas classes.

Exemplo esperado:

<organism-card>
  <div class="card-header">...</div>
  <div class="card-body">...</div>
  <div class="card-footer">...</div>
</organism-card>

O componente 'organism-card' posiciona os filhos com base nas classes: '.card-header', '.card-body', '.card-footer'.

`
  }
}

function atomicDesignMolecules(): mls.msg.IAMessageInputType {
  return {
    type: 'system',
    content: `## Atomic Design – Moléculas (Molecules)

General attributes (aplicáveis em quase todas as moléculas):
- name, id, class, style
- Attributes A11y (opcionais): role, ariaLabel, ariaDescribedBy, ariaExpanded, ariaSelected …

Attributes Text:
Exibem textos fixos ou dinâmicos.
Aceitam texto simples ou **composite binding**.
Exemplos:
- label="Digite o CPF"
- label="Bem-vindo {{ui.user.name}}"

Attributes Cfg:
Controlam o comportamento ou aparência da molécula.
Aceitam texto fixo ou **binding puro** (sem texto adicional).
Exemplos:
- readonly="true"
- disabled="{{ui.ReadyForInput}}"

Attributes Bind:
São usados para ler e/ou gravar dados dinâmicos.
Aceitam texto fixo ou **binding puro**.
Exemplos:
- value="dog"
- value="{{ui.choice.animal}}"
`
  }
}

function collabStates(): mls.msg.IAMessageInputType {
  return {
    type: 'system',
    content: `
## Collab States

ADR-001: Comunicação baseada exclusivamente em States

Título:
Uso exclusivo de states para comunicação entre HTML, TypeScript e backend

Status:
Aceito

Data:
2025-05-12

Contexto:
O sistema Collab.codes utiliza componentes web (Lit 3.0) sem shadow DOM. Para facilitar rastreamento, testes, AI assistida e redução de código imperativo, optamos por adotar uma arquitetura onde toda a comunicação entre camadas (HTML ↔ TS ↔ API/DB) será mediada por um objeto central de states.
Será criado 2 tipos de states, local , iniciando com “ui” ex: “{{ui.action}}” , e global, iniciando com “db” ex: “{{db.user.name}}”

Decisão:
	•	A camada HTML usa expressões como {{db.user.name}} para binding de dados.
	•	O TypeScript observa, atualiza e responde às mudanças nesses states.
	•	Chamadas de API e banco de dados devem ser feitas com base nas alterações de states, e os resultados são colocados de volta no state.
	•	Nenhum evento customizado entre elementos (como dispatchEvent) será usado para passar dados entre HTML e TS.
	•	Não haverá uso direto de fetch ou axios no código HTML/TS, tudo deve passar por funções observadoras da alteração de state.

Consequências:
✅ Reduz complexidade e código imperativo
✅ Facilita orquestração por IA e entendimento de dependências
✅ Permite reuso e cache baseado nos states
❌ Pode exigir adaptação em bibliotecas externas que esperam eventos ou props
❌ Depuração exige uma boa ferramenta de inspeção de states

Alternativas consideradas:
	•	Usar eventos e listeners (dispatchEvent, addEventListener)
	•	Usar bindings tradicionais tipo React/Vue com props e callbacks
	•	Usar um framework completo com reatividade embutida

Motivo da escolha:
A abordagem por states é mais declarativa, permite rastreamento mais fácil por IA, e reduz o acoplamento entre camadas.
`
  }
}

function getTemplatesAvaliables(templatesResult: TemplateContent[]): string {
  if (templatesResult.length === 0) return `- nenhum`;

  const res = templatesResult.map(item => item.template)
    .filter(template => template && template.reusable === true)
    .map(template => ({
      name: template.name,
      description: template.description
    }));

  return res.length === 0 ? `- nenhum` : `- ${res.join('-')}`

}

function getOrganismAvaliables(templatesResult: TemplateContent[]): string {
  if (templatesResult.length === 0) return `- nenhum`;

  const organisms: any[] = [];
  templatesResult.forEach(item => {
    const template = item.template;
    if (!template || !template.childs) return;

    template.childs.forEach(child => {
      const organism = child.organism;
      if (organism && organism.name && organism.description) {
        organisms.push({
          name: organism.name,
          description: organism.description
        });
      }
    });
  });

  return organisms.length === 0 ? `- nenhum` : `- ${organisms.join('-')}`

}

function getAssetsAvaliables(templatesResult: TemplateContent[]): string {
  if (templatesResult.length === 0) return `- nenhum`;
  return `- nenhum`
}

function getRemainingTasksIds(task: mls.msg.TaskData) {
  const remainingTasks = task.iaCompressed?.longMemory.remainingTasks || '';
  if (!remainingTasks) return []
  const arrRemainingTasks = remainingTasks.split(',');
  return arrRemainingTasks;
}



