/// <mls shortName="agentGeneratePrototype4" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { getPromptByHtml } from './_100554_aiPrompts';
import { getPayload3, PayLoad3, Organism } from './_100554_agentGeneratePrototype3';
import { getTask } from './_100554_msgDBController';
import { getImages } from './_100554_libUnsplash';
import { convertFileNameToTag, convertTagToFileName } from './_100554_utilsLit';
import { createNewFile } from "./_100554_pluginNewFileBase";
import { formatHtml } from './_100554_collabDOMSync';
import { updateTokensTheme } from './_100554_designSystemBase';

import {
    getNextPendingStepByAgentName,
    getNextInProgressStepByAgentName,
    getAgentStepByAgentName,
    notifyTaskChange,
    updateTaskTitle,
    updateStepStatus,
    appendLongTermMemory,
    getNextPendentStep,
    getInteractionStepId,
    getStepById
} from "./_100554_aiAgentHelper";
import {
    startNewInteractionInAiTask,
    startNewAiTask,
    executeNextStep,
    addNewStep,
} from "./_100554_aiAgentOrchestration";

const agentName = "agentGeneratePrototype4";
const agentProject = 100554;
const projectToSave = mls.actual[5].project || 0;
const enhancementTs = '_100554_enhancementLit';
const enhancementStyle = '_100554_enhancementStyle';

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Agent for create a new Module - 4",
        visibility: "public",
        async beforePrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _beforePrompt(context);
        },
        async afterPrompt(context: mls.msg.ExecutionContext): Promise<void> {
            return _afterPrompt(context);
        },
        async replayForSupport(context: mls.msg.ExecutionContext, payload: mls.msg.AIPayload[]): Promise<void> {
            return _replayForSupport(context, payload);
        }
    };
}

const _beforePrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {
    const taskTitle = "Planning 4...";
    if (!context || !context.message) throw new Error("Invalid context");

    if (!context.task) {
        const pageIndex: number = 0;
        const organism: string[] = [];
        const payload3: PayLoad3 = getPayload3Mock();
        const totalPages = payload3.pages.length;
        const inputs: any = await getPrompts(payload3, organism, pageIndex);

        await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt, { 'next_page': `${pageIndex}`, 'organism_created': JSON.stringify(organism), "total_pages": totalPages.toString() });
        return;
    }

    const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
    if (!step) {
        throw new Error(`[${agentName}] beforePrompt: No pending step found for this agent.`);
    }
    const organismAlreadyDeclared = getOrganismsAlreadyCreated(context);
    let payload3: PayLoad3 | undefined;
    if (context.modeSingleStep) payload3 = getPayload3Mock(); // only for dev test on preview
    else payload3 = getPayload3(context);
    const totalPages = payload3.pages.length;
    appendLongTermMemory(context, { "total_pages": totalPages.toString() });

    const inputs = await getPrompts(payload3, organismAlreadyDeclared, Number(step.prompt));
    await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);

}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {

    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}] afterPrompt: No in progress interaction found.`);

    context = await updateStepStatus(context, step.stepId, "completed", "no more agents");
    notifyTaskChange(context);
    await createPage(context);

    if (!context.task) throw new Error("Invalid context task");
    const nextPage = context.task?.iaCompressed?.longMemory['next_page'] ? +(context.task?.iaCompressed?.longMemory['next_page']) : -1;
    const totalPagesIndex = context.task?.iaCompressed?.longMemory['total_pages'] ? +(context.task?.iaCompressed?.longMemory['total_pages']) : undefined;

    if (totalPagesIndex === undefined || nextPage >= totalPagesIndex) {

        context.task = await updateTaskTitle(context.task, "Ok, all pages created, see result");
        await executeNextStep(context);
        return;
    }
    context.task = await updateTaskTitle(context.task, "Ok, page created");
    const stepPendent = getNextPendentStep(context.task);
    if (!stepPendent) throw new Error(`[${agentName}] afterPrompt: Invalid next stepPendent`);

    const newStep: mls.msg.AIPayload = {
        agentName: 'agentGeneratePrototype4',
        prompt: nextPage.toString(),
        status: 'pending',
        stepId: stepPendent.stepId + 1,
        interaction: null,
        nextSteps: null,
        rags: null,
        type: 'agent'
    }
    await addNewStep(context, stepPendent.stepId, [newStep]);

}

async function createPage(context: mls.msg.ExecutionContext) {

    if (!context || !context.task) throw new Error('Not found context to createPage');
    const step = getNextPendentStep(context.task);
    if (!step || step.type !== 'flexible') throw new Error('Invalid step in createPage');
    const payload4: PayLoad4 = step.result;
    if (!payload4 || !payload4.pageHtml) throw new Error('Not found "pageHtml" in payload');

    let payload3: PayLoad3 | undefined;
    if (context.modeSingleStep) payload3 = getPayload3Mock(); // only for dev test on preview
    else payload3 = getPayload3(context);

    const resolvedImages = await getAllImages(payload4.images);

    let finalSource = payload4.pageHtml;
    for (const [key, url] of Object.entries(resolvedImages)) {
        const pattern = new RegExp(`\\{{${key}\\}}`, 'g');
        finalSource = finalSource.replace(pattern, url);
    }
    const actualTaskIndex = context.task?.iaCompressed?.longMemory['next_page'] ? +(context.task?.iaCompressed?.longMemory['next_page']) : 0;

    if (actualTaskIndex === 0) {
        await updateTokensTheme(projectToSave, 'Default', payload3.tokens);
        await createProjectFile(projectToSave, payload3)
    }

    const organismUsed = extractOrganismTags(finalSource);
    await updateLongMemory(context, organismUsed, actualTaskIndex);
    await generateFiles(step, context.task, payload4, payload3, finalSource, organismUsed, projectToSave, '', actualTaskIndex);
    return context;
}


const _replayForSupport = async (context: mls.msg.ExecutionContext, payload: mls.msg.AIPayload[]): Promise<void> => {
    throw new Error("[replayForSupport] not implemented");
}

async function getPrompts(payload3: PayLoad3, organismDeclared: string[], pageIndex: number): Promise<mls.msg.IAMessageInputType[]> {

    const actualProject = projectToSave;
    const organismNames = extractOrganismNames(payload3.pagesWireframe[pageIndex].pageHtml);
    const organismsUsed = payload3.organism.filter((item) => organismNames.includes(item.organismTag));

    const data: Record<string, string> = {
        page: JSON.stringify(payload3.pages[pageIndex]),
        pageWireframe: JSON.stringify(payload3.pagesWireframe[pageIndex]),
        finalModuleDetails: JSON.stringify(payload3.finalModuleDetails, null, 2),
        organismDetails: JSON.stringify(organismsUsed, null, 2),
        tokens: JSON.stringify(payload3.tokens),
        organismDeclared: JSON.stringify(organismDeclared),
        project: actualProject?.toString() || '',
        tag: `${payload3.pages[pageIndex].pageName}`
    }

    const prompts = await getPromptByHtml({ project: agentProject, shortName: agentName, folder: '', data })
    return prompts;
}

async function updateLongMemory(context: mls.msg.ExecutionContext, newOrganism: string[], actualTaskIndex: number) {
    const byLongMemory = context.task?.iaCompressed?.longMemory['organism_created'];
    const data = (byLongMemory ? JSON.parse(byLongMemory) : []) as string[]
    const newOrganismData: string[] = [...data].concat(newOrganism);
    if (actualTaskIndex !== undefined && actualTaskIndex > -1) {
        actualTaskIndex = actualTaskIndex + 1;
    }
    const task = await appendLongTermMemory(context, { 'organism_created': JSON.stringify(newOrganismData), 'next_page': actualTaskIndex.toString() });
    context.task = task;
    return task;
}

function getOrganismsAlreadyCreated(context: mls.msg.ExecutionContext): string[] {
    const byLongMemory = context.task?.iaCompressed?.longMemory['organism_created'];
    return (byLongMemory ? JSON.parse(byLongMemory) : []) as string[]
}

function extractOrganismTags(htmlString: string): string[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const organismElements = Array.from(doc.querySelectorAll('*')).filter((el) =>
        el.tagName.toLowerCase().startsWith('organism-')
    );
    return [...new Set(organismElements.map((el) => el.tagName.toLowerCase()))];
}

function extractOrganismNames(pageHtml: string[]): string[] {
    const organismRegex = /<organism-([\w-]+)>/g;
    const organisms = new Set<string>();

    for (const line of pageHtml) {
        let match;
        while ((match = organismRegex.exec(line)) !== null) {
            organisms.add(`organism-${match[1]}`);
        }
    }

    return Array.from(organisms);
}

async function getAllImages(
    images: Images[]
): Promise<Record<string, string>> {
    const resolved: Record<string, string> = {};


    for (const img of images) {
        try {
            const result = await getImages(img.searchText, 1, 1);
            if (result.images && result.images.length > 0) {
                const image = result.images[0];
                resolved[img.key] = image.urls[img.type];
            } else {
                resolved[img.key] = `https://source.unsplash.com/800x600/?${encodeURIComponent(img.key)}`;
            }
        } catch (err) {
            console.warn(`Failed to get image for "${img.key}":`, err);
            resolved[img.key] = `https://source.unsplash.com/800x600/?${encodeURIComponent(img.key)}`;
        }
    }

    return resolved;
}

export function getPayload4(context: mls.msg.ExecutionContext): PayLoad4 {
    if (!context || !context.task) throw new Error(`[${agentName}] [getPayload] Invalid context`);
    const agentStep = getAgentStepByAgentName(context.task, agentName); // Only one agent execution must exist in this task
    if (!agentStep) throw new Error(`[${agentName}] [getPayload] no agent found`);

    // get result
    const resultStep = agentStep.interaction?.payload?.[0];
    if (!resultStep || resultStep.type !== "flexible" || !resultStep.result) throw new Error(`[${agentName}] [getPayload] No step flexible found for this agent.`);
    let payload4: PayLoad4 | string = resultStep.result;
    if (typeof payload4 === "string") payload4 = JSON.parse(payload4) as PayLoad4;
    return payload4;
}

async function generateFiles(step: mls.msg.AIPayload, task: mls.msg.TaskData, payload4: PayLoad4, payload3: PayLoad3, htmlFull: string, organism: string[], project: number, folder: string, index: number): Promise<string> {
    try {

        const { html, style } = extractStyleFromHtml(htmlFull);

        const pageWirefame = payload3.pages[index];
        const shortName = pageWirefame.pageName;
        const enhancement = enhancementTs;
        await generateOrganisms(payload3, organism, htmlFull, project);
        const sourceTS = generateTsPage(payload3, project, folder, index);
        const sourceHTML = generateHtmlPage(html, project, payload3, index);
        const sourceLess = generateLessPage(htmlFull, payload3, project, folder, index);
        const sourceDefs = generateDefsPage(payload3, index, project, folder, payload4.images, organism, task, step);

        await createNewFile({ project, position: 'right', shortName, enhancement, sourceTS: sourceTS.trim(), sourceHTML, sourceLess, sourceDefs, openPreview: false });

        return `page created: ${shortName}`

    } catch (err: any) {
        return `// Error: ${err.message}`;
    }
}

async function createProjectFile(project: number, payload3: PayLoad3) {

    const shortName = 'project';
    const enhancement = '_blank';

    const ts = `
/// <mls shortName="${shortName}" project="${project}" enhancement="_blank" />

export const payload3 = ${JSON.stringify(payload3, null, 2)}

`;

    await createNewFile({ project, position: 'right', shortName, enhancement, sourceTS: ts.trim(), sourceHTML: '', sourceLess: '', sourceDefs: '', openPreview: false });


    return ts;

}

async function generateOrganisms(payload3: PayLoad3, organisms: string[], htmlString: string, project: number) {

    const enhancement = enhancementTs;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const styles = doc.querySelectorAll('style[type="text/less"]');
    const resultStyles = Array.from(styles).map(style => ({
        name: style.getAttribute('data-name'),
        content: style.textContent
    }));

    for await (let organism of organisms) {

        const organismEl = doc.querySelector(organism);
        if (!organismEl) continue;
        const styleData = resultStyles.find((result) => result.name === organism);
        const organismData = payload3.organism.find((org) => org.organismTag === organism);
        if (!organismData) return;

        let shortName1 = sanitizeMeta(organismData.organismTag, project, '');
        const info = convertTagToFileName(`${shortName1}-${project}`);
        if (!info) continue;

        const organismHtml = organismEl.innerHTML;
        if (!organismHtml) continue;
        const organismLess = styleData?.content?.replace(`${organism} {`, `${organism}-${project} {`)

        const sourceTS = generateTsOrganism(shortName1, project, payload3.finalModuleDetails.moduleName, '', organismHtml);
        const sourceHTML = generateHtmlOrganism(organismData, project);
        const sourceLess = generateLessOrganism(organismData, project, organismLess || '');
        const sourceDefs = generateDefsOrganism(payload3, organism, project, '');

        await createNewFile({ project, position: 'right', shortName: info.shortName, enhancement, sourceTS: sourceTS.trim(), sourceHTML, sourceLess, sourceDefs, openPreview: false });


    }

}

function generateTsPage(payload: PayLoad3, project: number, folder: string, index: number): string {

    const pageWirefame = payload.pagesWireframe[index];
    const shortName = pageWirefame.pageName;
    const enhancement = enhancementTs;
    const groupName = payload.finalModuleDetails.moduleName;
    const fileName = `_${project}_${shortName}`
    const tagName = convertFileNameToTag({ project, shortName, folder });

    const ts = `
/// <mls shortName="${shortName}" project="${project}" enhancement="${enhancement}" groupName="${groupName}" />

import { CollabPageElement } from './_100554_collabPageElement';
import { customElement } from 'lit/decorators.js';
import { globalState, initState, setState } from './_100554_collabState';

@customElement('${tagName}')
export class ${fileName} extends CollabPageElement {
    initPage() {

    }
}`;

    return ts;
}


function generateLessPage(htmlString: string, payload: PayLoad3, project: number, folder: string, index: number): string {

    const page = payload.pages[index];
    const shortName = page.pageName;
    const enhancement = enhancementStyle;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const styles = doc.querySelectorAll('style[type="text/less"]');
    const resultStyles = Array.from(styles).map(style => ({
        name: style.getAttribute('data-name'),
        content: style.textContent
    }));

    const styleData = resultStyles.find((result) => result.name === `page-${shortName}`);
    if (!styleData) return "";
    if (styleData && !styleData.content) return "";
    const lessResult = `/// <mls shortName="${shortName}" project="${project}" enhancement="${enhancement}" />\n\n ${styleData?.content || ''}`;

    return lessResult;

}

function generateHtmlPage(htmlFull: string, project: number, payload: PayLoad3, indexPage: number): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlFull, 'text/html');
    const allElements = doc.querySelectorAll('*');
    const countByTags: Record<string, number> = {};

    const page = payload.pages[indexPage];
    const pageName = page.pageName;

    allElements.forEach((element) => {
        const tag = element.tagName.toLowerCase();

        if (tag.startsWith('organism')) {
            if (!countByTags[tag]) {
                countByTags[tag] = 1;
            } else {
                countByTags[tag]++;
            }
            element.id = pageName + tag.replace('organism', '') + countByTags[tag].toString()
        }
    });

    const newHtml = replaceOrganismTags(doc.body.outerHTML, project);
    const htmlFinal = `${formatHtml(newHtml)}`;
    return htmlFinal;
}

function generateDefsPage(
    payload: PayLoad3,
    index: number,
    project: number,
    folder: string,
    images: Images[],
    organism: string[],
    task: mls.msg.TaskData,
    step: mls.msg.AIPayload
): string {
    const page = payload.pages[index];
    const shortName = sanitizeMeta(page.pageName, project, folder);
    const wireframe = payload.pagesWireframe.find(p => p.pageSequential === page.pageSequential);
    const widgets = wireframe ? extractOrganismTagsFromHtml(wireframe.pageHtml) : [];

    const defs: mls.l4.BaseDefs = {
        meta: {
            projectId: project,
            folder,
            shortName,
            type: "page",
            group: payload.finalModuleDetails.moduleName,
            tags: ["lit", "page"]
        },
        references: {
            widgets,
            plugins: [],
            statesRO: [],
            statesRW: [],
            statesWO: [],
            imports: []
        },
        planning: {
            generalDescription: "",
            goal: page.pageGoal,
            userStories: [
                {
                    story: `Como visitante, quero acessar a página "${page.pageName}" para ${page.pageGoal.toLowerCase()}`,
                    derivedRequirements: page.pageRequirements.map(desc => ({ description: desc }))
                }
            ],
            userRequestsEnhancements: [],
            constraints: []
        }
    };

    let trace: string = '';
    const stepInteractionId = getInteractionStepId(task, step.stepId);
    if (stepInteractionId) {
        const stepInteraction = getStepById(task, stepInteractionId);
        if (stepInteraction) trace = stepInteraction.interaction?.trace.join('\n') || ''
    }

    return `/// <mls shortName="${shortName}" project="${project}" enhancement="_blank" />\n\n` +
        `// Do not change – automatically generated code.\n\n` +
        `export const defs: mls.l4.BaseDefs = ${JSON.stringify(defs, null, 2)}\n\n
/*\n
Task Id: ${task.PK}\n
Step Trace: ${trace}
Organism used in page: ${JSON.stringify(organism, null, 2)} \n
Images:\n ${JSON.stringify(images, null, 2)}\n 
\n*/
`;
}


function generateTsOrganism(shortTagName: string, project: number, groupName: string, folder: string, organismHtml: string) {

    const enhancement = enhancementTs;
    const tagName = `${shortTagName}-${project}`;
    const info = convertTagToFileName(tagName);
    if (!info) return ``;
    const shortName = info.shortName;

    const parser = new DOMParser();
    const doc = parser.parseFromString(organismHtml, 'text/html');
    let counter = 1;
    const prefixId = shortTagName.replace('organism-', '');
    doc.body.querySelectorAll('*').forEach(el => {
        el.id = el.id || `${prefixId}-${counter++}`;
    });

    const ts = `
/// <mls shortName="${shortName}" project="${project}" enhancement="${enhancement}" groupName="${groupName}" />

import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaOrganismBase } from './_100554_icaOrganismBase';

@customElement('${tagName}')
export class ${shortName} extends IcaOrganismBase {
    render(){
        return html\`${doc.body.innerHTML}\`
    }
}`;

    return ts;

}

function generateHtmlOrganism(organism: Organism, project: number): string {
    try {
        const shortTagName = organism.organismTag;
        const tagName = `${shortTagName}-${project}`;
        const htmlResult = `<${tagName}></${tagName}>`;
        return htmlResult;

    } catch (err: any) {
        return `// Error: ${err.message}`;
    }
}

function generateLessOrganism(organism: Organism, project: number, less: string): string {
    try {

        const shortTagName = organism.organismTag;
        const tagName = `${shortTagName}-${project}`;
        const info = convertTagToFileName(tagName);
        if (!info) return ``;
        const shortName = info.shortName;
        const enhancement = enhancementStyle;
        if (!less) return '';
        const lessResult = `/// <mls shortName="${shortName}" project="${project}" enhancement="${enhancement}" />\n\n ${less}`
        return lessResult;

    } catch (err: any) {
        return `// Error: ${err.message}`;
    }
}

function generateDefsOrganism(payload: PayLoad3, organismTag: string, project: number, folder: string): string {
    const organism = payload.organism.find((org) => org.organismTag = organismTag);
    if (!organism) return '';
    let shortName1 = sanitizeMeta(organism.organismTag, project, folder);

    const info = convertTagToFileName(`${shortName1}-${project}`);
    if (!info) return ``;
    const shortName = info.shortName;

    const defs: mls.l4.BaseDefs = {
        meta: {
            projectId: project,
            folder,
            shortName,
            type: "widget",
            group: payload.finalModuleDetails.moduleName,
            tags: ["lit", "organism"]
        },
        references: {
            widgets: [],
            plugins: [],
            statesRO: [],
            statesRW: [],
            statesWO: [],
            imports: []
        },
        planning: {
            generalDescription: organism.planning?.context || '',
            goal: organism.planning.goal,
            userStories: organism.planning?.userStories,
            userRequestsEnhancements: organism.planning.userRequestsEnhancements || [],
            constraints: organism.planning.constraints || []
        }
    };

    return `/// <mls shortName="${shortName}" project="${project}" enhancement="_blank" />\n\n` +
        `// Do not change – automatically generated code.\n\n` +
        `export const defs: mls.l4.BaseDefs = ${JSON.stringify(defs, null, 2)}\n`;
}

function replaceOrganismTags(htmlString: string, project: number): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const organismElements = doc.querySelectorAll('*');
    organismElements.forEach((el) => {
        if (el.tagName.toLowerCase().startsWith('organism-')) {
            const tagName = el.tagName.toLowerCase();
            const newTagName = `${tagName}-${project}`;
            const newEl = document.createElement(newTagName);
            for (const attr of el.attributes) {
                newEl.setAttribute(attr.name, attr.value);
            }
            el.replaceWith(newEl);
        }
    });
    doc.querySelectorAll('script').forEach((sc) => sc.remove());
    return doc.body.innerHTML;
}

function extractStyleFromHtml(htmlString: string): { html: string; style: string } {
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;

    let styleContent = '';
    let match: RegExpExecArray | null;

    while ((match = styleRegex.exec(htmlString)) !== null) {
        styleContent += match[1].trim() + '\n';
    }

    const cleanedHtml = htmlString.replace(styleRegex, '').trim();
    return {
        html: cleanedHtml,
        style: styleContent.trim(),
    };
}


function verifyIfExists(args: { project: number, shortName: string, folder: string }): boolean {
    const key = mls.stor.getKeyToFiles(args.project, 2, args.shortName, args.folder, ".defs")
    return !!mls.stor.files[key];
}

function sanitizeMeta(baseShortName: string, project: number, folder: string): string {
    let candidateName = baseShortName;
    let suffix = 1;

    while (verifyIfExists({ project, shortName: candidateName, folder })) {
        candidateName = `${baseShortName}${suffix}`;
        suffix++;
    }
    return candidateName;
}


function extractOrganismTagsFromHtml(pageHtml: string[]): mls.l4.DefsWidget[] {
    const tags = new Set<string>();
    for (const line of pageHtml) {
        const match = line.match(/<organism-[\w-]+/g);
        if (match) {
            match.forEach(tag => {
                const clean = tag.replace("<", "").split(" ")[0].trim();
                tags.add(clean);
            });
        }
    }

    const widgets = Array.from(tags);
    const arr = widgets.map((tag) => {
        const w: mls.l4.DefsWidget = {
            tag,
            analysis: undefined,
            bindings: [],
            purpose: '',
            used: true
        }
        return w;
    });

    return arr;
}

function getPayload3Mock(): PayLoad3 {

    const data: PayLoad3 = {
  "finalModuleDetails": {
    "userLanguage": "pt",
    "executionRegions": "Brasil",
    "userPrompt": "criar site petshop",
    "moduleGoal": "Desenvolver um site para um petshop com funcionalidades de e-commerce, agendamento online de serviços e painel administrativo.",
    "moduleName": "petshop",
    "requirements": [
      "Site em português.",
      "Usuários principais: clientes (donos de animais de estimação) e administradores.",
      "Público-alvo: donos de cães e gatos.",
      "Tom do site: amigável e acolhedor.",
      "Funcionalidades principais: agendamento online de banho, tosa e consultas veterinárias.",
      "Catálogo de produtos com categorias (ração, brinquedos, acessórios) e busca por nome.",
      "E-commerce com pagamento via cartão de crédito e Pix.",
      "Opções de entrega: domicílio e retirada na loja.",
      "Painel do administrador para cadastro/edição de produtos, visualização e gerenciamento de pedidos e agendamentos.",
      "Página de serviços e formulário de contato.",
      "Criação de identidade visual (logo, cores, imagens)."
    ],
    "userRequestsEnhancements": [
      {
        "description": "Incluir blog ou área de dicas para clientes.",
        "priority": "could"
      },
      {
        "description": "Permitir avaliações e comentários de clientes nos produtos e serviços.",
        "priority": "could"
      },
      {
        "description": "Integrar o site com redes sociais (Instagram, Facebook).",
        "priority": "could"
      },
      {
        "description": "Oferecer cupons de desconto ou promoções especiais pelo site.",
        "priority": "could"
      },
      {
        "description": "Disponibilizar chat online para atendimento ao cliente.",
        "priority": "could"
      }
    ]
  },
  "pages": [
    {
      "pageSequential": 0,
      "pageName": "home",
      "pageGoal": "Apresentar o petshop, principais serviços, destaques do catálogo e facilitar navegação.",
      "pageRequirements": [
        "Exibir banner de boas-vindas.",
        "Destaques de produtos e serviços.",
        "Acesso rápido para agendamento e catálogo.",
        "Links para contato e redes sociais."
      ]
    },
    {
      "pageSequential": 1,
      "pageName": "produtos",
      "pageGoal": "Exibir catálogo de produtos com categorias, filtros e busca.",
      "pageRequirements": [
        "Listar produtos por categoria (ração, brinquedos, acessórios).",
        "Busca por nome do produto.",
        "Filtro por categoria.",
        "Adicionar ao carrinho."
      ]
    },
    {
      "pageSequential": 2,
      "pageName": "servicos",
      "pageGoal": "Apresentar serviços oferecidos e permitir agendamento online.",
      "pageRequirements": [
        "Listar serviços: banho, tosa, consulta veterinária.",
        "Permitir seleção de serviço, data e horário.",
        "Formulário de confirmação de agendamento."
      ]
    },
    {
      "pageSequential": 3,
      "pageName": "carrinho",
      "pageGoal": "Exibir itens selecionados para compra e iniciar processo de checkout.",
      "pageRequirements": [
        "Listar produtos adicionados.",
        "Permitir alteração de quantidade e remoção.",
        "Botão para finalizar compra."
      ]
    },
    {
      "pageSequential": 4,
      "pageName": "checkout",
      "pageGoal": "Processar pagamento e escolher método de entrega.",
      "pageRequirements": [
        "Formulário de dados do cliente.",
        "Escolha de entrega: domicílio ou retirada.",
        "Pagamento via cartão de crédito ou Pix.",
        "Resumo do pedido."
      ]
    },
    {
      "pageSequential": 5,
      "pageName": "contato",
      "pageGoal": "Permitir que clientes entrem em contato com o petshop.",
      "pageRequirements": [
        "Formulário de contato.",
        "Exibir informações de endereço, telefone e e-mail.",
        "Links para redes sociais."
      ]
    },
    {
      "pageSequential": 6,
      "pageName": "admin",
      "pageGoal": "Painel administrativo para gerenciar produtos, pedidos e agendamentos.",
      "pageRequirements": [
        "Cadastro e edição de produtos.",
        "Visualização e gerenciamento de pedidos.",
        "Acompanhamento e gerenciamento de agendamentos."
      ]
    }
  ],
  "plugins": [
    {
      "pluginSequential": 0,
      "pluginName": "pluginStripe",
      "pluginType": "third-party",
      "pluginGoal": "Processar pagamentos com cartão de crédito.",
      "pluginRequirements": [
        "Integração segura com Stripe.",
        "Suporte a pagamentos em reais (BRL)."
      ]
    },
    {
      "pluginSequential": 1,
      "pluginName": "pluginPix",
      "pluginType": "third-party",
      "pluginGoal": "Permitir pagamentos via Pix.",
      "pluginRequirements": [
        "Geração de QR Code Pix.",
        "Confirmação automática de pagamento."
      ]
    },
    {
      "pluginSequential": 2,
      "pluginName": "pluginScrollToTop",
      "pluginType": "ui",
      "pluginGoal": "Facilitar navegação em páginas longas.",
      "pluginRequirements": [
        "Botão flutuante para voltar ao topo."
      ]
    }
  ],
  "pagesWireframe": [
    {
      "pageSequential": 0,
      "pageName": "home",
      "pageHtml": [
        "<body>",
        "<header>",
        "<organism-nav></organism-nav>",
        "</header>",
        "<main>",
        "<organism-banner-welcome></organism-banner-welcome>",
        "<organism-featured-products></organism-featured-products>",
        "<organism-featured-services></organism-featured-services>",
        "<organism-quick-links></organism-quick-links>",
        "</main>",
        "<footer>",
        "<organism-footer-info></organism-footer-info>",
        "</footer>",
        "</body>"
      ]
    },
    {
      "pageSequential": 1,
      "pageName": "produtos",
      "pageHtml": [
        "<body>",
        "<header>",
        "<organism-nav></organism-nav>",
        "</header>",
        "<aside>",
        "<organism-category-filter></organism-category-filter>",
        "</aside>",
        "<main>",
        "<organism-product-search></organism-product-search>",
        "<organism-product-list></organism-product-list>",
        "</main>",
        "<footer>",
        "<organism-footer-info></organism-footer-info>",
        "</footer>",
        "</body>"
      ]
    },
    {
      "pageSequential": 2,
      "pageName": "servicos",
      "pageHtml": [
        "<body>",
        "<header>",
        "<organism-nav></organism-nav>",
        "</header>",
        "<main>",
        "<organism-services-list></organism-services-list>",
        "<organism-scheduling-form></organism-scheduling-form>",
        "</main>",
        "<footer>",
        "<organism-footer-info></organism-footer-info>",
        "</footer>",
        "</body>"
      ]
    },
    {
      "pageSequential": 3,
      "pageName": "carrinho",
      "pageHtml": [
        "<body>",
        "<header>",
        "<organism-nav></organism-nav>",
        "</header>",
        "<main>",
        "<organism-cart-list></organism-cart-list>",
        "<organism-cart-summary></organism-cart-summary>",
        "</main>",
        "<footer>",
        "<organism-footer-info></organism-footer-info>",
        "</footer>",
        "</body>"
      ]
    },
    {
      "pageSequential": 4,
      "pageName": "checkout",
      "pageHtml": [
        "<body>",
        "<header>",
        "<organism-nav></organism-nav>",
        "</header>",
        "<main>",
        "<organism-checkout-form></organism-checkout-form>",
        "<organism-payment-methods></organism-payment-methods>",
        "<organism-order-summary></organism-order-summary>",
        "</main>",
        "<footer>",
        "<organism-footer-info></organism-footer-info>",
        "</footer>",
        "</body>"
      ]
    },
    {
      "pageSequential": 5,
      "pageName": "contato",
      "pageHtml": [
        "<body>",
        "<header>",
        "<organism-nav></organism-nav>",
        "</header>",
        "<main>",
        "<organism-contact-form></organism-contact-form>",
        "<organism-contact-info></organism-contact-info>",
        "</main>",
        "<footer>",
        "<organism-footer-info></organism-footer-info>",
        "</footer>",
        "</body>"
      ]
    },
    {
      "pageSequential": 6,
      "pageName": "admin",
      "pageHtml": [
        "<body>",
        "<header>",
        "<organism-admin-nav></organism-admin-nav>",
        "</header>",
        "<aside>",
        "<organism-admin-sidebar></organism-admin-sidebar>",
        "</aside>",
        "<main>",
        "<organism-admin-product-management></organism-admin-product-management>",
        "<organism-admin-order-management></organism-admin-order-management>",
        "<organism-admin-scheduling-management></organism-admin-scheduling-management>",
        "</main>",
        "<footer>",
        "<organism-footer-info></organism-footer-info>",
        "</footer>",
        "</body>"
      ]
    }
  ],
  "organism": [
    {
      "organismSequential": 0,
      "organismTag": "organism-nav",
      "planning": {
        "context": "Navegação principal do site, visível em todas as páginas públicas.",
        "goal": "Exibir logo, menu de navegação, acesso ao carrinho e login/admin.",
        "userStories": [
          {
            "story": "Como cliente, quero acessar facilmente todas as áreas do site pelo menu.",
            "derivedRequirements": [
              {
                "description": "Menu com links para Home, Produtos, Serviços, Contato, Carrinho."
              }
            ]
          },
          {
            "story": "Como administrador, quero acessar rapidamente o painel admin.",
            "derivedRequirements": [
              {
                "description": "Link visível para painel admin quando autenticado como administrador."
              }
            ]
          }
        ],
        "constraints": [
          "Deve ser responsivo.",
          "Deve exibir logo e destacar página ativa."
        ]
      }
    },
    {
      "organismSequential": 1,
      "organismTag": "organism-banner-welcome",
      "planning": {
        "context": "Banner de destaque na home para boas-vindas e promoções.",
        "goal": "Exibir mensagem de boas-vindas e chamadas para ação.",
        "userStories": [
          {
            "story": "Como visitante, quero sentir confiança e acolhimento ao acessar o site.",
            "derivedRequirements": [
              {
                "description": "Banner visual com mensagem amigável e CTA para agendamento ou catálogo."
              }
            ]
          }
        ],
        "constraints": [
          "Deve ser visualmente atraente.",
          "Deve ser acessível para leitores de tela."
        ]
      }
    },
    {
      "organismSequential": 2,
      "organismTag": "organism-featured-products",
      "planning": {
        "context": "Destaque de produtos na home para incentivar compras.",
        "goal": "Exibir produtos em destaque com opção de adicionar ao carrinho.",
        "userStories": [
          {
            "story": "Como cliente, quero ver rapidamente os produtos mais populares ou em promoção.",
            "derivedRequirements": [
              {
                "description": "Listar produtos destacados com botão de adicionar ao carrinho."
              }
            ]
          }
        ]
      }
    },
    {
      "organismSequential": 3,
      "organismTag": "organism-featured-services",
      "planning": {
        "context": "Destaque de serviços na home para incentivar agendamentos.",
        "goal": "Exibir principais serviços com link para agendamento.",
        "userStories": [
          {
            "story": "Como cliente, quero conhecer rapidamente os serviços oferecidos.",
            "derivedRequirements": [
              {
                "description": "Listar serviços principais com botão para agendar."
              }
            ]
          }
        ]
      }
    },
    {
      "organismSequential": 4,
      "organismTag": "organism-quick-links",
      "planning": {
        "context": "Atalhos na home para áreas importantes.",
        "goal": "Facilitar acesso ao catálogo, agendamento e contato.",
        "userStories": [
          {
            "story": "Como visitante, quero acessar rapidamente as principais funcionalidades.",
            "derivedRequirements": [
              {
                "description": "Botões de atalho para catálogo, agendamento e contato."
              }
            ]
          }
        ]
      }
    },
    {
      "organismSequential": 5,
      "organismTag": "organism-footer-info",
      "planning": {
        "context": "Rodapé padrão do site.",
        "goal": "Exibir informações de contato, endereço, redes sociais e direitos autorais.",
        "userStories": [
          {
            "story": "Como visitante, quero encontrar facilmente informações de contato e redes sociais.",
            "derivedRequirements": [
              {
                "description": "Exibir telefone, e-mail, endereço e ícones de redes sociais."
              }
            ]
          }
        ],
        "constraints": [
          "Deve ser consistente em todas as páginas."
        ]
      }
    },
    {
      "organismSequential": 6,
      "organismTag": "organism-category-filter",
      "planning": {
        "context": "Filtro lateral na página de produtos.",
        "goal": "Permitir filtrar produtos por categoria.",
        "userStories": [
          {
            "story": "Como cliente, quero filtrar produtos por categoria para encontrar mais rápido.",
            "derivedRequirements": [
              {
                "description": "Lista de categorias com seleção única ou múltipla."
              }
            ]
          }
        ]
      }
    },
    {
      "organismSequential": 7,
      "organismTag": "organism-product-search",
      "planning": {
        "context": "Busca de produtos na página de catálogo.",
        "goal": "Permitir busca por nome do produto.",
        "userStories": [
          {
            "story": "Como cliente, quero buscar produtos pelo nome.",
            "derivedRequirements": [
              {
                "description": "Campo de busca com autocomplete."
              }
            ]
          }
        ]
      }
    },
    {
      "organismSequential": 8,
      "organismTag": "organism-product-list",
      "planning": {
        "context": "Listagem de produtos na página de catálogo.",
        "goal": "Exibir produtos filtrados e permitir adicionar ao carrinho.",
        "userStories": [
          {
            "story": "Como cliente, quero ver todos os produtos disponíveis e adicionar ao carrinho.",
            "derivedRequirements": [
              {
                "description": "Listagem com imagem, nome, preço e botão de adicionar ao carrinho."
              }
            ]
          }
        ]
      }
    },
    {
      "organismSequential": 9,
      "organismTag": "organism-services-list",
      "planning": {
        "context": "Listagem de serviços na página de serviços.",
        "goal": "Exibir serviços disponíveis para agendamento.",
        "userStories": [
          {
            "story": "Como cliente, quero ver todos os serviços que posso agendar.",
            "derivedRequirements": [
              {
                "description": "Listar serviços com descrição e preço."
              }
            ]
          }
        ]
      }
    },
    {
      "organismSequential": 10,
      "organismTag": "organism-scheduling-form",
      "planning": {
        "context": "Formulário de agendamento de serviços.",
        "goal": "Permitir selecionar serviço, data, horário e confirmar agendamento.",
        "userStories": [
          {
            "story": "Como cliente, quero agendar um serviço escolhendo data e horário.",
            "derivedRequirements": [
              {
                "description": "Formulário com seleção de serviço, data, horário e confirmação."
              }
            ]
          }
        ],
        "constraints": [
          "Deve validar horários disponíveis.",
          "Deve enviar confirmação ao cliente."
        ]
      }
    },
    {
      "organismSequential": 11,
      "organismTag": "organism-cart-list",
      "planning": {
        "context": "Listagem de itens no carrinho.",
        "goal": "Exibir produtos adicionados ao carrinho e permitir alterações.",
        "userStories": [
          {
            "story": "Como cliente, quero ver e editar os itens do meu carrinho.",
            "derivedRequirements": [
              {
                "description": "Listar produtos, permitir alterar quantidade e remover itens."
              }
            ]
          }
        ]
      }
    },
    {
      "organismSequential": 12,
      "organismTag": "organism-cart-summary",
      "planning": {
        "context": "Resumo do carrinho antes do checkout.",
        "goal": "Exibir valor total e botão para finalizar compra.",
        "userStories": [
          {
            "story": "Como cliente, quero ver o valor total antes de finalizar a compra.",
            "derivedRequirements": [
              {
                "description": "Exibir subtotal, frete e total."
              }
            ]
          }
        ]
      }
    },
    {
      "organismSequential": 13,
      "organismTag": "organism-checkout-form",
      "planning": {
        "context": "Formulário de checkout.",
        "goal": "Coletar dados do cliente e endereço de entrega.",
        "userStories": [
          {
            "story": "Como cliente, quero informar meus dados para entrega e contato.",
            "derivedRequirements": [
              {
                "description": "Formulário com campos obrigatórios para nome, endereço, telefone e e-mail."
              }
            ]
          }
        ]
      }
    },
    {
      "organismSequential": 14,
      "organismTag": "organism-payment-methods",
      "planning": {
        "context": "Seleção de método de pagamento no checkout.",
        "goal": "Permitir escolher entre cartão de crédito e Pix.",
        "userStories": [
          {
            "story": "Como cliente, quero escolher como pagar minha compra.",
            "derivedRequirements": [
              {
                "description": "Opções de pagamento integradas com Stripe e Pix."
              }
            ]
          }
        ]
      }
    },
    {
      "organismSequential": 15,
      "organismTag": "organism-order-summary",
      "planning": {
        "context": "Resumo final do pedido no checkout.",
        "goal": "Exibir todos os detalhes do pedido antes da confirmação.",
        "userStories": [
          {
            "story": "Como cliente, quero revisar meu pedido antes de pagar.",
            "derivedRequirements": [
              {
                "description": "Exibir lista de produtos, valores, endereço e método de entrega."
              }
            ]
          }
        ]
      }
    },
    {
      "organismSequential": 16,
      "organismTag": "organism-contact-form",
      "planning": {
        "context": "Formulário de contato na página de contato.",
        "goal": "Permitir envio de mensagens para o petshop.",
        "userStories": [
          {
            "story": "Como cliente, quero enviar dúvidas ou solicitações pelo site.",
            "derivedRequirements": [
              {
                "description": "Formulário com campos para nome, e-mail, mensagem."
              }
            ]
          }
        ]
      }
    },
    {
      "organismSequential": 17,
      "organismTag": "organism-contact-info",
      "planning": {
        "context": "Informações de contato na página de contato.",
        "goal": "Exibir endereço, telefone, e-mail e redes sociais.",
        "userStories": [
          {
            "story": "Como cliente, quero encontrar facilmente como entrar em contato.",
            "derivedRequirements": [
              {
                "description": "Exibir informações de contato e ícones de redes sociais."
              }
            ]
          }
        ]
      }
    },
    {
      "organismSequential": 18,
      "organismTag": "organism-admin-nav",
      "planning": {
        "context": "Navegação do painel administrativo.",
        "goal": "Permitir acesso rápido às áreas de gestão.",
        "userStories": [
          {
            "story": "Como administrador, quero navegar facilmente entre produtos, pedidos e agendamentos.",
            "derivedRequirements": [
              {
                "description": "Menu com links para gestão de produtos, pedidos e agendamentos."
              }
            ]
          }
        ],
        "constraints": [
          "Visível apenas para usuários autenticados como admin."
        ]
      }
    },
    {
      "organismSequential": 19,
      "organismTag": "organism-admin-sidebar",
      "planning": {
        "context": "Sidebar do painel admin.",
        "goal": "Exibir atalhos para funcionalidades administrativas.",
        "userStories": [
          {
            "story": "Como administrador, quero acessar rapidamente funções administrativas.",
            "derivedRequirements": [
              {
                "description": "Links rápidos para cadastro de produtos, visualização de pedidos e agendamentos."
              }
            ]
          }
        ]
      }
    },
    {
      "organismSequential": 20,
      "organismTag": "organism-admin-product-management",
      "planning": {
        "context": "Gestão de produtos no painel admin.",
        "goal": "Permitir cadastro, edição e exclusão de produtos.",
        "userStories": [
          {
            "story": "Como administrador, quero cadastrar e editar produtos facilmente.",
            "derivedRequirements": [
              {
                "description": "Formulário para cadastro/edição de produtos com campos obrigatórios."
              }
            ]
          }
        ]
      }
    },
    {
      "organismSequential": 21,
      "organismTag": "organism-admin-order-management",
      "planning": {
        "context": "Gestão de pedidos no painel admin.",
        "goal": "Visualizar e gerenciar pedidos realizados.",
        "userStories": [
          {
            "story": "Como administrador, quero ver todos os pedidos e atualizar status.",
            "derivedRequirements": [
              {
                "description": "Listagem de pedidos com opção de alterar status (em preparo, enviado, concluído)."
              }
            ]
          }
        ]
      }
    },
    {
      "organismSequential": 22,
      "organismTag": "organism-admin-scheduling-management",
      "planning": {
        "context": "Gestão de agendamentos no painel admin.",
        "goal": "Visualizar e gerenciar agendamentos de serviços.",
        "userStories": [
          {
            "story": "Como administrador, quero acompanhar todos os agendamentos feitos pelos clientes.",
            "derivedRequirements": [
              {
                "description": "Listagem de agendamentos com detalhes e opção de confirmação/cancelamento."
              }
            ]
          }
        ]
      }
    }
  ],
  "visualIdentity": {
    "logoDescription": "A friendly, modern logo featuring a stylized dog and cat outline in soft blue and green tones, with rounded shapes and a playful, welcoming vibe.",
    "fontFamily": "'Poppins', 'Charlie Display', Arial, sans-serif",
    "iconStyle": "outline",
    "illustrationStyle": "flat, colorful, with soft gradients and rounded corners",
    "colorPalette": {
      "primary": "#5EC6E6",
      "secondary": "#7ED957",
      "text": "#2D2D2D",
      "background": "#F7FAFC",
      "border": "#D1E7EF",
      "error": "#FF4D4F",
      "warning": "#FAAD14",
      "success": "#52C41A"
    }
  },
  "tokens": {
    "description": "Design tokens para o site do petshop, com suporte a modo claro e escuro, focando em cores suaves, acessibilidade e identidade visual alegre.",
    "themeName": "petshop",
    "color": {
      "color-primary": "#5EC6E6",
      "color-secondary": "#7ED957",
      "color-accent": "#FFD166",
      "color-background": "#F7FAFC",
      "color-surface": "#FFFFFF",
      "color-text-normal": "#2D2D2D",
      "color-text-secondary": "#5A5A5A",
      "color-text-disabled": "#B0B0B0",
      "color-border": "#D1E7EF",
      "color-link-normal": "#5EC6E6",
      "color-link-hover": "#3BA9C9",
      "color-link-visited": "#4B8EA7",
      "color-overlay": "rgba(94,198,230,0.08)",
      "color-error": "#FF4D4F",
      "color-warning": "#FAAD14",
      "color-success": "#52C41A",
      "_dark-color-primary": "#4BB3D3",
      "_dark-color-secondary": "#6CC24A",
      "_dark-color-accent": "#FFC94A",
      "_dark-color-background": "#1A232B",
      "_dark-color-surface": "#232F3E",
      "_dark-color-text-normal": "#F7FAFC",
      "_dark-color-text-secondary": "#B0B0B0",
      "_dark-color-text-disabled": "#5A5A5A",
      "_dark-color-border": "#2A3A44",
      "_dark-color-link-normal": "#4BB3D3",
      "_dark-color-link-hover": "#3BA9C9",
      "_dark-color-link-visited": "#4B8EA7",
      "_dark-color-overlay": "rgba(75,179,211,0.12)",
      "_dark-color-error": "#FF7B7F",
      "_dark-color-warning": "#FFD166",
      "_dark-color-success": "#7ED957"
    },
    "global": {
      "spacing-xxs": "0.25rem",
      "spacing-xs": "0.5rem",
      "spacing-sm": "1rem",
      "spacing-md": "1.5rem",
      "spacing-lg": "2rem",
      "spacing-xl": "3rem",
      "spacing-xxl": "4rem",
      "border-radius-xs": "0.25rem",
      "border-radius-sm": "0.5rem",
      "border-radius-md": "1rem",
      "border-radius-lg": "2rem",
      "shadow-sm": "0 1px 4px 0 rgba(94,198,230,0.08)",
      "shadow-md": "0 2px 8px 0 rgba(94,198,230,0.16)",
      "shadow-lg": "0 4px 16px 0 rgba(94,198,230,0.24)",
      "transition-base": "all 0.3s cubic-bezier(0.4,0,0.2,1)",
      "transition-fast": "all 0.15s cubic-bezier(0.4,0,0.2,1)",
      "transition-slow": "all 0.5s cubic-bezier(0.4,0,0.2,1)",
      "z-index-modal": "1000",
      "z-index-tooltip": "1100",
      "z-index-dropdown": "1200"
    },
    "typography": {
      "font-family-primary": "'Poppins', 'Charlie Display', Arial, sans-serif",
      "font-family-secondary": "serif",
      "font-size-xs": "0.75rem",
      "font-size-sm": "0.875rem",
      "font-size-md": "1rem",
      "font-size-lg": "1.25rem",
      "font-size-xl": "1.5rem",
      "font-size-xxl": "2rem",
      "font-weight-light": "300",
      "font-weight-normal": "400",
      "font-weight-bold": "700",
      "line-height-xs": "1.1",
      "line-height-sm": "1.25",
      "line-height-md": "1.5",
      "line-height-lg": "1.75"
    }
  }
}

    return data;
}

export interface PayLoad4 {
    pageHtml: string,
    images: Images[]
}

interface Images {
    key: string,
    searchText: string,
    type: 'raw' | 'full' | 'regular' | 'small' | 'thumb',
    height: number, // px
    width: number, // px
    toolTip: string
}







