/// <mls shortName="agentCreateSite" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { preferModelType, systemComponentsInstruction } from './_100554_aiPrompts';
import { getNextPendingStepByAgentName, getNextInProgressStepByAgentName, getAgentStepByAgentName, updateStepStatus, getNextPendentStep, appendLongTermMemory, getAgentsStepByAgentName, updateTaskTitle } from "./_100554_aiAgentHelper";
import { startNewInteractionInAiTask, addNewStep, executeNextStep, startNewAiTask } from "./_100554_aiAgentOrchestration";
import { getImages } from "./_100554_libUnsplash";
import { widgetsDefault } from "./_100554_icaBaseDescription";
import { convertFileNameToTag, convertTagToFileName } from './_100554_utilsLit';
import { createNewFile } from "./_100554_pluginNewFileBase";
import { formatHtml } from './_100554_collabDOMSync';

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

  if (!context.task) {
    const inputs = await getPrompts('t1', dataFixed, null, []);
    await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt);
    return;
  }

  const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
  if (!step) throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);

  context.task = await updateStepStatus(context.task, step.stepId, "in_progress");
  const remainingTasks = getRemainingTasksIds(context.task);
  if (!remainingTasks || remainingTasks.length === 0) throw new Error("remainingTasks === 0");
  const taskId = remainingTasks[0];
  const allStepsTasksComplete = getAgentsStepByAgentName(context.task, 'agentCreateSite', 'completed');

  console.info({
    beforePrompt: step.prompt,
    allStepsTasksComplete,
    taskId,
    prompt: step.prompt
  });

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

  //Only for test => exec only first task 
  const allResults = getAllStepsThisAgent(context);
  console.info(allResults);
  const allResults2 = await execPrepareMidias(allResults);
  const allResults3 = execPrepareWidgetsDefault(allResults2);
  const pages = execPrepareHTML(allResults3);
  await execPrepareOrganismAndTemplates(context, allResults3);
  await execCreatePages(pages);
  // end test

  /*
    if (!remainingTasks || remainingTasks.length === 0) {
      const allResults = getAllStepsThisAgent(context);
      console.info(allResults);
      const allResults2 = await execPrepareMidias(allResults);
      const allResults3 = execPrepareWidgetsDefault(allResults2);
      const pages = execPrepareHTML(allResults3);
      await execPrepareOrganismAndTemplates(context, allResults3);
      await execCreatePages(pages);
      return;
    }
  
    const stepAgentAnalyzeNewModule2 = getAgentStepByAgentName(context.task, 'agentAnalyzeNewModule2');
    if (!stepAgentAnalyzeNewModule2) throw new Error(`[${agentName}] afterPrompt: no find parent step AgentAnalyzeNewModule2.`);
    const data = stepAgentAnalyzeNewModule2.interaction?.payload ? (stepAgentAnalyzeNewModule2.interaction?.payload[0] as any).content : '';
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
  
    */

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

  console.info({
    pageName: fileName,
    html: data.el.outerHTML.trim()
  });

  const htmlFormatted = formatHtml(data.el.outerHTML.trim());
  await createNewFile(
    { project, position: 'right', shortName, enhancement, sourceTS: ts.trim(), sourceHTML: htmlFormatted, sourceLess: '', openPreview: false }
  );
}

function execPrepareHTML(allResults: TemplateContent[]) {

  const result: Record<string, { el: HTMLElement, data: TemplateContent }> = {};
  const result2: Record<string, { el: HTMLElement, data: TemplateContent }> = {};
  const actualProject = mls.actual[5].project;
  const idControllers: Record<string, number> = {};

  function generateAbbreviation(str: string) {
    const cleaned = str.replace(/[^a-zA-Z\-]/g, '');
    const parts = cleaned.split('-');
    const initials = parts.map(p => p[0]);
    return initials.join('');
  }

  function generateId(tagName: string) {
    const keyAbbr = generateAbbreviation(tagName);
    if (!(keyAbbr in idControllers)) idControllers[keyAbbr] = 0;
    else idControllers[keyAbbr] = idControllers[keyAbbr] + 1;
    return `${keyAbbr}-${idControllers[keyAbbr]}`;
  }

  function prepareName(name: string) {
    const { project } = mls.actual[5];
    return `_${project}_${name}`;
  }

  for (const task of allResults) {

    const template = task.template;
    const prepareElements = async (childs: TemplateChild[] | ChildElement[], parent: HTMLElement) => {
      for (const child of childs) {

        if ("organismOrMolecule" in child && "attributes" in child.organismOrMolecule) {
          const _child = child.organismOrMolecule as Molecule;
          const tagName = `${_child.name}-${PROJECTICA}`;
          const element = document.createElement(tagName);
          element.setAttribute('id', generateId(tagName));

          if (child.class) element.setAttribute('classel', child.class);
          if (_child.widget) element.setAttribute('widget', _child.widget);

          _child.attributes.forEach((attr) => {
            element.setAttribute(attr.key, attr.value.replace(/"/g, "'"));
          });
          parent.appendChild(element);

        } else if ("organism" in child) {
          const _organism = child.organism as Organism;
          const organinsEl = document.createElement(ICAORGANISM);
          const tagName = `${_organism.name}-${actualProject}`;
          organinsEl.setAttribute('widget', tagName);
          organinsEl.setAttribute('id', generateId(tagName));

          if (child.class) organinsEl.setAttribute('classel', child.class);
          parent.appendChild(organinsEl);
          prepareElements(_organism.childs, organinsEl);
        }
      }
    }

    const templateElement = document.createElement(ICATEMPLATE);
    const tagName = `${template.name}-${actualProject}`;
    templateElement.setAttribute('widget', tagName);
    templateElement.setAttribute('id', generateId(tagName));
    result[template.name] = { el: templateElement, data: task };
    if (template?.childs) prepareElements(template.childs, templateElement);

  }

  Object.keys(result).forEach((key, index) => {
    const item = result[key];
    const name = prepareName(item.data.pageName);
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
          _child.widget = widgetsDefault[_child.name] + `-${PROJECTICA}`;
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
              _child.attributes.forEach((attr) => attr.value = attr.value.replace(regex, image.urls.regular))
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
  prompts.push(systemComponentsInstruction())
  prompts.push(collabStates());

  prompts.push({
    type: 'human',
    content: `## Definições da task: \n\n
    \n\n ${prompt}`
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
Você é responsável por gerar uma página web profissional, moderna e refinada para o sistema Collab.
Esta página deve ser realista, convincente e adequada ao público-alvo — simulando uma entrega de nível de agência.

## Objetivo
Retornar um JSON compatível com a interface definida na seção "## Formato de saída".

## Contexto Global (Retrieve)
Defina o objetivo e as necessidades da página, dados disponíveis, público-alvo e função principal, baseada na task ${taskId}

  ### Requisitos para a Página
  - Analise o promptToCreatePage rigorosamente e siga as definições para a criação dá pagina.
  - A página deve conter múltiplas seções bem definidas, incluindo:
      1. Header com logo, menu e botão de ação
      2. Hero com chamada principal, imagem ou ilustração destacada
      3. Seções com cards, depoimentos, estatísticas, gráficos ou recursos conforme o tipo da task
      4. Área principal com conteúdo detalhado e escaneável
      5. Chamadas para ação (CTA) com botões persuasivos
      6. Rodapé com links úteis, contatos e redes
      7. Inclua elementos como carrosséis, gráficos, tabelas ou blocos visuais quando fizer sentido para a tarefa.
  
  - Use textos que simulem uma situação real: com títulos persuasivos, descrições claras, botões como "Saiba mais", "Comece agora", etc.
Evite textos genéricos como "Lorem ipsum", e priorize mensagens alinhadas ao objetivo da task.

  - A composição deve usar **componentes reutilizáveis** segundo o padrão descrito em "## Padrão de Composição dos Componentes" (Templates > Organismos > Moléculas).
  - A página precisa simular conteúdo realista: textos persuasivos, títulos significativos, botões com ação, imagens ilustrativas, etc.
  - O design deve considerar **hierarquia visual**, uso estratégico de cores, e adaptação a diferentes tamanhos de tela.
  - Adapte a página ao público-alvo da task.
  - Use somente as tabelas e dados disponíveis do módulo da task analisada.
  
  ### Exemplo resumido do esperado:
    Uma página para um sistema de agendamento pode conter:
    - Hero com "Gerencie seus compromissos com facilidade"
    - Cards com benefícios ("Agenda inteligente", "Notificações por WhatsApp", etc.)
    - Seção de depoimentos com fotos e nomes
    - Tabela com próximos eventos ou KPIs de produtividade
    - Gráfico de agendamentos por semana
    - Rodapé com links, termos de uso e redes sociais


## Pense e decida sobre a estrutura geral da página (Decide)
Use o modelo Atomic Design para organizar os componentes da interface:
- Átomos: elementos básicos (texto, imagem, botão). Não serão relacionados aqui.
- Moléculas: pequenos agrupamentos reutilizáveis (ex: input + label). Já existe uma lista dos possíveis que podem ser utilizados.
- Organismos: seções completas da interface (ex: cabeçalho, lista de itens), nomes iniciam com "organism-".
- Template: define o layout da página e onde cada organismo se encaixa, nome inicia com "template-".

## States
Decida quais states para o controle da página serão necessários.
- **Nunca crie states para textos fixos, estáticos ou institucionais**, como banners, mensagens institucionais, descrições de página ou labels. **Esses textos devem estar diretamente no template e não usar '{{}}'.**
- Usar states 'db.' somente quando necessário.
- Toda comunicação com o backend ocorre via states com prefixo '"db."' (ex: 'db.produto', 'db.categoria'). Nos states "db." ficam os registros dos bancos de dados.
- Toda lógica e controle visual no frontend é feito com states com prefixo '"ui."'.
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
    pageName: string;
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
  attributes: {key:string, value: string}[]; // Gere os atributos key, value
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
	•	A camada HTML usa expressões como {{db.user.name}} para binding de dados
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










// FOR TEST
const dataFixed = `{
  "data": {
    "moduleGoal": "Criar um site pessoal de portfólio em formato one page, apresentando informações e trabalhos do usuário, com destaque para uma imagem de banner.",
    "stylePreferences": {
      "brandPersonality": {
        "sincerity": {
          "value": 80,
          "description": "Indicates warmth, honesty, and trust. High values suggest soft colors, friendly language, and empathetic tone."
        },
        "excitement": {
          "value": 60,
          "description": "Measures energy and boldness. Higher values lead to vibrant palettes, fast animations, and youthful aesthetics."
        },
        "competence": {
          "value": 85,
          "description": "Reflects professionalism and efficiency. High scores imply clean layout, technical precision, and trustworthy tone."
        },
        "sophistication": {
          "value": 70,
          "description": "Captures elegance and exclusivity. Higher values suggest premium feel, serif fonts, generous spacing, and refined visuals."
        },
        "ruggedness": {
          "value": 20,
          "description": "Conveys strength and robustness. High values suggest bold fonts, textured backgrounds, and strong visual contrast."
        }
      },
      "toneOfVoice": {
        "funny_serious": {
          "value": 70,
          "description": "Low values use humor and playfulness; high values use a formal, authoritative tone in texts and CTAs."
        },
        "formal_casual": {
          "value": 60,
          "description": "Controls the vocabulary and sentence structure. Low = formal and structured; high = relaxed and conversational."
        },
        "respectful_irreverent": {
          "value": 30,
          "description": "Defines politeness level. Low = traditional and polite; high = informal, bold, possibly sarcastic copy."
        },
        "enthusiastic_matterOfFact": {
          "value": 60,
          "description": "Low values are objective and neutral; high values use expressive, motivational tone and dynamic CTAs."
        }
      }
    },
    "models": {
      "Usuario": {
        "prisma": "model Usuario { id Int @id @default(autoincrement()) nome String foto String bio String contato String redesSociais String }",
        "fields": "id, nome, foto, bio, contato, redesSociais"
      },
      "Projeto": {
        "prisma": "model Projeto { id Int @id @default(autoincrement()) titulo String descricao String imagem String link String tecnologias String }",
        "fields": "id, titulo, descricao, imagem, link, tecnologias"
      }
    },
    "tasks": [
      {
        "id": "t1",
        "name": "Criar página one page do portfólio",
        "agentName": "agentCreateNewPage",
        "urlName": "/",
        "useModels": [
          "Usuario",
          "Projeto"
        ],
        "description": "Desenvolver a página principal do portfólio em formato one page, contendo todas as seções: banner, apresentação pessoal, listagem de projetos, contato e redes sociais.",
        "visibleTo": [
          "public"
        ],
        "businessRules": [
          "O site deve ser responsivo.",
          "Deve conter uma imagem de banner em destaque.",
          "Todas as informações devem estar em uma única página.",
          "Deve apresentar dados do usuário e seus projetos.",
          "Deve haver seção de contato e links para redes sociais."
        ],
        "userStories": [
          {
            "as": "visitante",
            "iWant": "ver rapidamente quem é o usuário e seus principais projetos",
            "soThat": "eu possa avaliar suas habilidades e experiência"
          },
          {
            "as": "recrutador",
            "iWant": "acessar facilmente o contato do usuário",
            "soThat": "eu possa entrar em contato para oportunidades"
          },
          {
            "as": "cliente potencial",
            "iWant": "visualizar exemplos de trabalhos anteriores",
            "soThat": "eu possa decidir se quero contratar o usuário"
          },
          {
            "as": "usuário",
            "iWant": "apresentar minhas informações e portfólio de forma elegante",
            "soThat": "eu possa causar uma boa impressão"
          },
          {
            "as": "visitante",
            "iWant": "acessar os links das redes sociais do usuário",
            "soThat": "eu possa segui-lo ou conhecer mais sobre ele"
          }
        ],
        "navigation": []
      }
    ],
    "moduleConstrains": [
      "Site deve ser one page",
      "Deve conter uma imagem de banner em destaque"
    ]
  }
}`



