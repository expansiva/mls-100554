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
        const pageIndex: number = 1;
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
    appendLongTermMemory(context, { "total_pages": totalPages.toString() })
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
    const actualTaskIndex = context.task?.iaCompressed?.longMemory['next_page'] ? +(context.task?.iaCompressed?.longMemory['next_page']) : -1;

    if (actualTaskIndex === 0) {
        await updateTokensTheme(projectToSave, 'Default', payload3.tokens);
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
            element.id = pageName + '-' + tag + countByTags[tag].toString();
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

    const ts = `
/// <mls shortName="${shortName}" project="${project}" enhancement="${enhancement}" groupName="${groupName}" />

import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { IcaOrganismBase } from './_100554_icaOrganismBase';

@customElement('${tagName}')
export class ${shortName} extends IcaOrganismBase {
    render(){
        return html\`${organismHtml}\`
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
            "userLanguage": "pt-BR",
            "executionRegions": "BR",
            "userPrompt": "criar um web site para petshop",
            "moduleGoal": "Desenvolver um website completo para petshop com funcionalidades de agendamento de serviços e loja online, direcionado para donos de pets, com tom amigável e profissional.",
            "moduleName": "petshop",
            "requirements": [
                "Website para petshop com público-alvo donos de pets",
                "Dois papéis de usuário: administrador e cliente",
                "Tom amigável e profissional",
                "Idioma: apenas português",
                "Funcionalidades principais: agendamento de serviços (banho, tosa, consulta veterinária, vacinação) e loja online (ração, brinquedos, acessórios, produtos de higiene)",
                "Aceitar pagamentos via cartão de crédito, PIX e boleto",
                "Fluxo de agendamento com confirmação automática e lembretes por email",
                "Horário de funcionamento: segunda a sábado, das 8h às 18h",
                "Design moderno e limpo",
                "Gestão automática de estoque (should)",
                "Perfis detalhados de pets para clientes (should)"
            ],
            "userRequestsEnhancements": [
                {
                    "description": "Programa de fidelidade ou sistema de pontos para clientes",
                    "priority": "could"
                },
                {
                    "description": "Opções de entrega para produtos comprados online",
                    "priority": "could"
                },
                {
                    "description": "Integração com redes sociais para compartilhamento e login",
                    "priority": "could"
                }
            ]
        },
        "pages": [
            {
                "pageSequential": 0,
                "pageName": "home",
                "pageGoal": "Apresentar o petshop, principais serviços, destaques da loja e facilitar navegação.",
                "pageRequirements": [
                    "Exibir banner institucional",
                    "Destaques de serviços e produtos",
                    "Acesso rápido para agendamento e loja",
                    "Depoimentos de clientes",
                    "Horário de funcionamento"
                ]
            },
            {
                "pageSequential": 1,
                "pageName": "servicos",
                "pageGoal": "Listar e detalhar os serviços oferecidos pelo petshop, com opção de agendamento.",
                "pageRequirements": [
                    "Listar serviços: banho, tosa, consulta veterinária, vacinação",
                    "Exibir detalhes e preços",
                    "Permitir agendamento online"
                ]
            },
            {
                "pageSequential": 2,
                "pageName": "agendamento",
                "pageGoal": "Permitir ao cliente agendar serviços, visualizar horários disponíveis e receber confirmação automática.",
                "pageRequirements": [
                    "Formulário de agendamento",
                    "Seleção de serviço, data e horário",
                    "Cadastro ou seleção de pet",
                    "Confirmação automática e lembrete por email"
                ]
            },
            {
                "pageSequential": 3,
                "pageName": "loja",
                "pageGoal": "Exibir produtos para venda online, com categorias e busca.",
                "pageRequirements": [
                    "Listar produtos: ração, brinquedos, acessórios, produtos de higiene",
                    "Filtrar por categoria",
                    "Adicionar ao carrinho"
                ]
            },
            {
                "pageSequential": 4,
                "pageName": "produto",
                "pageGoal": "Exibir detalhes de um produto selecionado e permitir compra.",
                "pageRequirements": [
                    "Exibir imagens, descrição, preço e estoque",
                    "Permitir seleção de quantidade",
                    "Adicionar ao carrinho"
                ]
            },
            {
                "pageSequential": 5,
                "pageName": "carrinho",
                "pageGoal": "Exibir produtos selecionados para compra, permitir alteração e finalizar pedido.",
                "pageRequirements": [
                    "Listar itens do carrinho",
                    "Alterar quantidade ou remover itens",
                    "Calcular total",
                    "Avançar para checkout"
                ]
            },
            {
                "pageSequential": 6,
                "pageName": "checkout",
                "pageGoal": "Finalizar compra com seleção de pagamento e confirmação.",
                "pageRequirements": [
                    "Formulário de dados do cliente",
                    "Seleção de método de pagamento: cartão, PIX, boleto",
                    "Resumo do pedido",
                    "Confirmação de compra"
                ]
            },
            {
                "pageSequential": 7,
                "pageName": "perfil",
                "pageGoal": "Permitir ao cliente gerenciar seus dados, pets e visualizar histórico de agendamentos e compras.",
                "pageRequirements": [
                    "Editar dados pessoais",
                    "Gerenciar perfis de pets",
                    "Visualizar histórico de agendamentos",
                    "Visualizar histórico de compras"
                ]
            },
            {
                "pageSequential": 8,
                "pageName": "admin",
                "pageGoal": "Painel administrativo para gerenciar serviços, produtos, agendamentos, estoque e clientes.",
                "pageRequirements": [
                    "Gerenciar serviços e horários",
                    "Gerenciar produtos e estoque",
                    "Visualizar e editar agendamentos",
                    "Gerenciar clientes e pets"
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
                    "Integração com Stripe para checkout seguro",
                    "Suporte a múltiplos métodos de pagamento"
                ]
            },
            {
                "pluginSequential": 1,
                "pluginName": "pluginPix",
                "pluginType": "third-party",
                "pluginGoal": "Permitir pagamentos via PIX.",
                "pluginRequirements": [
                    "Integração com provedor de pagamentos PIX",
                    "Geração de QR Code para pagamento"
                ]
            },
            {
                "pluginSequential": 2,
                "pluginName": "pluginBoleto",
                "pluginType": "third-party",
                "pluginGoal": "Permitir pagamentos via boleto bancário.",
                "pluginRequirements": [
                    "Integração com provedor de boletos",
                    "Geração e validação de boletos"
                ]
            },
            {
                "pluginSequential": 3,
                "pluginName": "pluginScrollToTop",
                "pluginType": "ui",
                "pluginGoal": "Facilitar navegação em páginas longas.",
                "pluginRequirements": [
                    "Exibir botão flutuante para voltar ao topo"
                ]
            }
        ],
        "pagesWireframe": [
            {
                "pageSequential": 0,
                "pageName": "home",
                "pageHtml": [
                    "<header>",
                    "<organism-nav></organism-nav>",
                    "<organism-banner></organism-banner>",
                    "</header>",
                    "<main>",
                    "<organism-services-highlight></organism-services-highlight>",
                    "<organism-products-highlight></organism-products-highlight>",
                    "<organism-quick-access></organism-quick-access>",
                    "<organism-testimonials></organism-testimonials>",
                    "<organism-business-hours></organism-business-hours>",
                    "</main>",
                    "<footer>",
                    "<organism-footer-info></organism-footer-info>",
                    "</footer>"
                ]
            },
            {
                "pageSequential": 1,
                "pageName": "servicos",
                "pageHtml": [
                    "<header>",
                    "<organism-nav></organism-nav>",
                    "</header>",
                    "<main>",
                    "<organism-services-list></organism-services-list>",
                    "<organism-service-details></organism-service-details>",
                    "</main>",
                    "<footer>",
                    "<organism-footer-info></organism-footer-info>",
                    "</footer>"
                ]
            },
            {
                "pageSequential": 2,
                "pageName": "agendamento",
                "pageHtml": [
                    "<header>",
                    "<organism-nav></organism-nav>",
                    "</header>",
                    "<main>",
                    "<organism-appointment-form></organism-appointment-form>",
                    "<organism-pet-selector></organism-pet-selector>",
                    "<organism-appointment-confirmation></organism-appointment-confirmation>",
                    "</main>",
                    "<footer>",
                    "<organism-footer-info></organism-footer-info>",
                    "</footer>"
                ]
            },
            {
                "pageSequential": 3,
                "pageName": "loja",
                "pageHtml": [
                    "<header>",
                    "<organism-nav></organism-nav>",
                    "</header>",
                    "<aside>",
                    "<organism-category-filter></organism-category-filter>",
                    "</aside>",
                    "<main>",
                    "<organism-product-list></organism-product-list>",
                    "<organism-product-search></organism-product-search>",
                    "</main>",
                    "<footer>",
                    "<organism-footer-info></organism-footer-info>",
                    "</footer>"
                ]
            },
            {
                "pageSequential": 4,
                "pageName": "produto",
                "pageHtml": [
                    "<header>",
                    "<organism-nav></organism-nav>",
                    "</header>",
                    "<main>",
                    "<organism-product-details></organism-product-details>",
                    "<organism-add-to-cart></organism-add-to-cart>",
                    "</main>",
                    "<footer>",
                    "<organism-footer-info></organism-footer-info>",
                    "</footer>"
                ]
            },
            {
                "pageSequential": 5,
                "pageName": "carrinho",
                "pageHtml": [
                    "<header>",
                    "<organism-nav></organism-nav>",
                    "</header>",
                    "<main>",
                    "<organism-cart-list></organism-cart-list>",
                    "<organism-cart-summary></organism-cart-summary>",
                    "<organism-cart-actions></organism-cart-actions>",
                    "</main>",
                    "<footer>",
                    "<organism-footer-info></organism-footer-info>",
                    "</footer>"
                ]
            },
            {
                "pageSequential": 6,
                "pageName": "checkout",
                "pageHtml": [
                    "<header>",
                    "<organism-nav></organism-nav>",
                    "</header>",
                    "<main>",
                    "<organism-checkout-form></organism-checkout-form>",
                    "<organism-payment-methods></organism-payment-methods>",
                    "<organism-order-summary></organism-order-summary>",
                    "<organism-checkout-confirmation></organism-checkout-confirmation>",
                    "</main>",
                    "<footer>",
                    "<organism-footer-info></organism-footer-info>",
                    "</footer>"
                ]
            },
            {
                "pageSequential": 7,
                "pageName": "perfil",
                "pageHtml": [
                    "<header>",
                    "<organism-nav></organism-nav>",
                    "</header>",
                    "<main>",
                    "<organism-user-profile></organism-user-profile>",
                    "<organism-pet-profiles></organism-pet-profiles>",
                    "<organism-appointments-history></organism-appointments-history>",
                    "<organism-orders-history></organism-orders-history>",
                    "</main>",
                    "<footer>",
                    "<organism-footer-info></organism-footer-info>",
                    "</footer>"
                ]
            },
            {
                "pageSequential": 8,
                "pageName": "admin",
                "pageHtml": [
                    "<header>",
                    "<organism-admin-nav></organism-admin-nav>",
                    "</header>",
                    "<aside>",
                    "<organism-admin-sidebar></organism-admin-sidebar>",
                    "</aside>",
                    "<main>",
                    "<organism-admin-services></organism-admin-services>",
                    "<organism-admin-products></organism-admin-products>",
                    "<organism-admin-appointments></organism-admin-appointments>",
                    "<organism-admin-customers></organism-admin-customers>",
                    "</main>",
                    "<footer>",
                    "<organism-footer-info></organism-footer-info>",
                    "</footer>"
                ]
            }
        ],
        "organism": [
            {
                "organismSequential": 0,
                "organismTag": "organism-nav",
                "planning": {
                    "context": "Navegação principal do site, visível em todas as páginas para facilitar o acesso às principais áreas.",
                    "goal": "Exibir menu de navegação com links para Home, Serviços, Loja, Agendamento, Perfil e Login/Logout.",
                    "userStories": [
                        {
                            "story": "Como visitante, quero acessar facilmente todas as áreas do site para encontrar o que preciso.",
                            "derivedRequirements": [
                                {
                                    "description": "Menu responsivo com links para todas as páginas principais."
                                }
                            ]
                        },
                        {
                            "story": "Como usuário logado, quero ver meu nome e acessar rapidamente meu perfil.",
                            "derivedRequirements": [
                                {
                                    "description": "Exibir nome do usuário e link para perfil quando autenticado."
                                }
                            ]
                        }
                    ],
                    "constraints": [
                        "Deve ser responsivo",
                        "Deve suportar dois papéis de usuário"
                    ]
                }
            },
            {
                "organismSequential": 1,
                "organismTag": "organism-banner",
                "planning": {
                    "context": "Banner institucional para destacar a marca e promoções.",
                    "goal": "Exibir imagem de destaque, slogan e chamada para ação.",
                    "userStories": [
                        {
                            "story": "Como visitante, quero ver rapidamente o que o petshop oferece e promoções em destaque.",
                            "derivedRequirements": [
                                {
                                    "description": "Banner com imagem, slogan e botão de ação."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 2,
                "organismTag": "organism-services-highlight",
                "planning": {
                    "context": "Destaque dos principais serviços na home.",
                    "goal": "Mostrar serviços como banho, tosa, consulta e vacinação com ícones e links.",
                    "userStories": [
                        {
                            "story": "Como dono de pet, quero ver rapidamente os serviços disponíveis para agendar.",
                            "derivedRequirements": [
                                {
                                    "description": "Cards de serviços com ícones e links para agendamento."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 3,
                "organismTag": "organism-products-highlight",
                "planning": {
                    "context": "Destaque dos principais produtos na home.",
                    "goal": "Exibir produtos em promoção ou mais vendidos com imagens e preços.",
                    "userStories": [
                        {
                            "story": "Como visitante, quero ver produtos em destaque para comprar com facilidade.",
                            "derivedRequirements": [
                                {
                                    "description": "Lista de produtos em destaque com botão de compra rápida."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 4,
                "organismTag": "organism-quick-access",
                "planning": {
                    "context": "Acesso rápido para agendamento e loja.",
                    "goal": "Exibir botões de acesso rápido para agendar serviço ou acessar a loja.",
                    "userStories": [
                        {
                            "story": "Como usuário, quero acessar rapidamente o agendamento ou loja sem navegar pelo menu.",
                            "derivedRequirements": [
                                {
                                    "description": "Botões de ação destacados para agendamento e loja."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 5,
                "organismTag": "organism-testimonials",
                "planning": {
                    "context": "Depoimentos de clientes para gerar confiança.",
                    "goal": "Exibir depoimentos reais de clientes satisfeitos.",
                    "userStories": [
                        {
                            "story": "Como novo cliente, quero ver avaliações positivas para confiar no serviço.",
                            "derivedRequirements": [
                                {
                                    "description": "Carrossel ou lista de depoimentos com nome e foto do cliente."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 6,
                "organismTag": "organism-business-hours",
                "planning": {
                    "context": "Informar horários de funcionamento.",
                    "goal": "Exibir dias e horários de atendimento do petshop.",
                    "userStories": [
                        {
                            "story": "Como cliente, quero saber quando o petshop está aberto para planejar minha visita.",
                            "derivedRequirements": [
                                {
                                    "description": "Bloco informativo com horários e dias de funcionamento."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 7,
                "organismTag": "organism-footer-info",
                "planning": {
                    "context": "Rodapé com informações institucionais e contatos.",
                    "goal": "Exibir informações de contato, redes sociais e links úteis.",
                    "userStories": [
                        {
                            "story": "Como visitante, quero encontrar facilmente o telefone e endereço do petshop.",
                            "derivedRequirements": [
                                {
                                    "description": "Rodapé com telefone, endereço, email e links para redes sociais."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 8,
                "organismTag": "organism-services-list",
                "planning": {
                    "context": "Lista de todos os serviços oferecidos.",
                    "goal": "Exibir todos os serviços com descrição e preço.",
                    "userStories": [
                        {
                            "story": "Como cliente, quero ver todos os serviços disponíveis e seus preços.",
                            "derivedRequirements": [
                                {
                                    "description": "Lista de serviços com descrição, preço e botão para detalhes/agendamento."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 9,
                "organismTag": "organism-service-details",
                "planning": {
                    "context": "Detalhes de um serviço selecionado.",
                    "goal": "Exibir informações detalhadas do serviço e permitir agendamento.",
                    "userStories": [
                        {
                            "story": "Como cliente, quero saber detalhes do serviço antes de agendar.",
                            "derivedRequirements": [
                                {
                                    "description": "Página de detalhes com informações completas e botão de agendamento."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 10,
                "organismTag": "organism-appointment-form",
                "planning": {
                    "context": "Formulário para agendamento de serviços.",
                    "goal": "Permitir ao cliente selecionar serviço, data, horário e pet.",
                    "userStories": [
                        {
                            "story": "Como cliente, quero agendar um serviço escolhendo data, horário e qual pet será atendido.",
                            "derivedRequirements": [
                                {
                                    "description": "Formulário com seleção de serviço, data, horário e pet."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 11,
                "organismTag": "organism-pet-selector",
                "planning": {
                    "context": "Seleção ou cadastro de pet para o agendamento.",
                    "goal": "Permitir ao cliente escolher um pet cadastrado ou cadastrar novo.",
                    "userStories": [
                        {
                            "story": "Como cliente, quero cadastrar um novo pet ou selecionar um já cadastrado para o agendamento.",
                            "derivedRequirements": [
                                {
                                    "description": "Lista de pets do usuário e opção de adicionar novo pet."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 12,
                "organismTag": "organism-appointment-confirmation",
                "planning": {
                    "context": "Confirmação do agendamento realizado.",
                    "goal": "Exibir mensagem de sucesso e detalhes do agendamento, além de informar sobre o envio de lembrete por email.",
                    "userStories": [
                        {
                            "story": "Como cliente, quero ter certeza que meu agendamento foi realizado e receber confirmação.",
                            "derivedRequirements": [
                                {
                                    "description": "Mensagem de confirmação com detalhes e aviso de lembrete por email."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 13,
                "organismTag": "organism-category-filter",
                "planning": {
                    "context": "Filtro lateral para categorias de produtos na loja.",
                    "goal": "Permitir filtrar produtos por categoria (ração, brinquedos, acessórios, higiene).",
                    "userStories": [
                        {
                            "story": "Como cliente, quero filtrar produtos por categoria para encontrar mais rápido.",
                            "derivedRequirements": [
                                {
                                    "description": "Lista de categorias com seleção múltipla."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 14,
                "organismTag": "organism-product-list",
                "planning": {
                    "context": "Lista de produtos disponíveis na loja.",
                    "goal": "Exibir produtos com imagem, nome, preço e botão de compra.",
                    "userStories": [
                        {
                            "story": "Como cliente, quero ver todos os produtos disponíveis para comprar.",
                            "derivedRequirements": [
                                {
                                    "description": "Grid de produtos com informações básicas e botão de adicionar ao carrinho."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 15,
                "organismTag": "organism-product-search",
                "planning": {
                    "context": "Busca de produtos na loja.",
                    "goal": "Permitir ao usuário buscar produtos por nome ou palavra-chave.",
                    "userStories": [
                        {
                            "story": "Como cliente, quero buscar produtos específicos pelo nome.",
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
                "organismSequential": 16,
                "organismTag": "organism-product-details",
                "planning": {
                    "context": "Detalhes completos de um produto.",
                    "goal": "Exibir imagens, descrição, preço, estoque e avaliações do produto.",
                    "userStories": [
                        {
                            "story": "Como cliente, quero ver todos os detalhes do produto antes de comprar.",
                            "derivedRequirements": [
                                {
                                    "description": "Página de detalhes com imagens, descrição, preço, estoque e avaliações."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 17,
                "organismTag": "organism-add-to-cart",
                "planning": {
                    "context": "Ação de adicionar produto ao carrinho.",
                    "goal": "Permitir selecionar quantidade e adicionar produto ao carrinho.",
                    "userStories": [
                        {
                            "story": "Como cliente, quero escolher a quantidade e adicionar ao carrinho facilmente.",
                            "derivedRequirements": [
                                {
                                    "description": "Campo de quantidade e botão de adicionar ao carrinho."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 18,
                "organismTag": "organism-cart-list",
                "planning": {
                    "context": "Lista de itens no carrinho de compras.",
                    "goal": "Exibir todos os produtos adicionados ao carrinho com opção de alterar ou remover.",
                    "userStories": [
                        {
                            "story": "Como cliente, quero ver e editar os itens do meu carrinho antes de finalizar a compra.",
                            "derivedRequirements": [
                                {
                                    "description": "Lista de itens com opção de alterar quantidade ou remover."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 19,
                "organismTag": "organism-cart-summary",
                "planning": {
                    "context": "Resumo do carrinho de compras.",
                    "goal": "Exibir total de itens, valor total e descontos aplicáveis.",
                    "userStories": [
                        {
                            "story": "Como cliente, quero ver o valor total da minha compra antes de pagar.",
                            "derivedRequirements": [
                                {
                                    "description": "Resumo com total de itens, valor e descontos."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 20,
                "organismTag": "organism-cart-actions",
                "planning": {
                    "context": "Ações do carrinho de compras.",
                    "goal": "Permitir limpar carrinho ou avançar para checkout.",
                    "userStories": [
                        {
                            "story": "Como cliente, quero finalizar a compra ou esvaziar o carrinho facilmente.",
                            "derivedRequirements": [
                                {
                                    "description": "Botões para limpar carrinho e avançar para checkout."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 21,
                "organismTag": "organism-checkout-form",
                "planning": {
                    "context": "Formulário de dados do cliente para finalizar compra.",
                    "goal": "Coletar informações de entrega e contato do cliente.",
                    "userStories": [
                        {
                            "story": "Como cliente, quero informar meus dados para receber o pedido corretamente.",
                            "derivedRequirements": [
                                {
                                    "description": "Formulário com campos obrigatórios de endereço e contato."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 22,
                "organismTag": "organism-payment-methods",
                "planning": {
                    "context": "Seleção de método de pagamento no checkout.",
                    "goal": "Permitir escolher entre cartão, PIX ou boleto.",
                    "userStories": [
                        {
                            "story": "Como cliente, quero escolher a forma de pagamento mais conveniente.",
                            "derivedRequirements": [
                                {
                                    "description": "Opções de pagamento integradas com plugins Stripe, PIX e Boleto."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 23,
                "organismTag": "organism-order-summary",
                "planning": {
                    "context": "Resumo final do pedido antes da confirmação.",
                    "goal": "Exibir todos os itens, valores e dados do pedido para revisão.",
                    "userStories": [
                        {
                            "story": "Como cliente, quero revisar meu pedido antes de confirmar a compra.",
                            "derivedRequirements": [
                                {
                                    "description": "Resumo detalhado do pedido com botão de confirmação."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 24,
                "organismTag": "organism-checkout-confirmation",
                "planning": {
                    "context": "Confirmação de compra realizada.",
                    "goal": "Exibir mensagem de sucesso e detalhes do pedido.",
                    "userStories": [
                        {
                            "story": "Como cliente, quero ter certeza que minha compra foi realizada e receber detalhes do pedido.",
                            "derivedRequirements": [
                                {
                                    "description": "Mensagem de confirmação com número do pedido e instruções de acompanhamento."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 25,
                "organismTag": "organism-user-profile",
                "planning": {
                    "context": "Perfil do usuário cliente.",
                    "goal": "Permitir editar dados pessoais e senha.",
                    "userStories": [
                        {
                            "story": "Como cliente, quero atualizar meus dados pessoais e senha.",
                            "derivedRequirements": [
                                {
                                    "description": "Formulário de edição de dados e senha."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 26,
                "organismTag": "organism-pet-profiles",
                "planning": {
                    "context": "Gestão de perfis de pets do cliente.",
                    "goal": "Permitir cadastrar, editar e visualizar informações dos pets.",
                    "userStories": [
                        {
                            "story": "Como cliente, quero cadastrar e editar informações dos meus pets.",
                            "derivedRequirements": [
                                {
                                    "description": "Lista de pets com opção de adicionar, editar e visualizar histórico médico."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 27,
                "organismTag": "organism-appointments-history",
                "planning": {
                    "context": "Histórico de agendamentos do cliente.",
                    "goal": "Exibir todos os agendamentos realizados, com status e detalhes.",
                    "userStories": [
                        {
                            "story": "Como cliente, quero ver todos os meus agendamentos passados e futuros.",
                            "derivedRequirements": [
                                {
                                    "description": "Lista de agendamentos com status, datas e detalhes."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 28,
                "organismTag": "organism-orders-history",
                "planning": {
                    "context": "Histórico de compras do cliente.",
                    "goal": "Exibir todas as compras realizadas, com detalhes e status de entrega.",
                    "userStories": [
                        {
                            "story": "Como cliente, quero acompanhar minhas compras e status de entrega.",
                            "derivedRequirements": [
                                {
                                    "description": "Lista de pedidos com detalhes e status."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 29,
                "organismTag": "organism-admin-nav",
                "planning": {
                    "context": "Navegação principal do painel administrativo.",
                    "goal": "Permitir ao administrador acessar rapidamente todas as áreas de gestão.",
                    "userStories": [
                        {
                            "story": "Como administrador, quero acessar facilmente as áreas de serviços, produtos, agendamentos e clientes.",
                            "derivedRequirements": [
                                {
                                    "description": "Menu administrativo com links para todas as áreas de gestão."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 30,
                "organismTag": "organism-admin-sidebar",
                "planning": {
                    "context": "Sidebar de navegação no painel admin.",
                    "goal": "Exibir atalhos para funções administrativas.",
                    "userStories": [
                        {
                            "story": "Como administrador, quero acessar rapidamente funções específicas do painel.",
                            "derivedRequirements": [
                                {
                                    "description": "Sidebar com atalhos para funções administrativas."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 31,
                "organismTag": "organism-admin-services",
                "planning": {
                    "context": "Gestão de serviços no painel admin.",
                    "goal": "Permitir adicionar, editar e remover serviços e horários.",
                    "userStories": [
                        {
                            "story": "Como administrador, quero gerenciar os serviços oferecidos e seus horários.",
                            "derivedRequirements": [
                                {
                                    "description": "CRUD de serviços e horários."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 32,
                "organismTag": "organism-admin-products",
                "planning": {
                    "context": "Gestão de produtos e estoque no painel admin.",
                    "goal": "Permitir adicionar, editar, remover produtos e controlar estoque.",
                    "userStories": [
                        {
                            "story": "Como administrador, quero gerenciar produtos e estoque da loja online.",
                            "derivedRequirements": [
                                {
                                    "description": "CRUD de produtos e controle de estoque automático."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 33,
                "organismTag": "organism-admin-appointments",
                "planning": {
                    "context": "Gestão de agendamentos no painel admin.",
                    "goal": "Visualizar, editar e cancelar agendamentos de clientes.",
                    "userStories": [
                        {
                            "story": "Como administrador, quero acompanhar e gerenciar todos os agendamentos.",
                            "derivedRequirements": [
                                {
                                    "description": "Lista de agendamentos com opções de edição e cancelamento."
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "organismSequential": 34,
                "organismTag": "organism-admin-customers",
                "planning": {
                    "context": "Gestão de clientes e pets no painel admin.",
                    "goal": "Visualizar e editar dados de clientes e seus pets.",
                    "userStories": [
                        {
                            "story": "Como administrador, quero acessar informações dos clientes e seus pets.",
                            "derivedRequirements": [
                                {
                                    "description": "Lista de clientes com detalhes e pets associados."
                                }
                            ]
                        }
                    ]
                }
            }
        ],
        "visualIdentity": {
            "logoDescription": "A friendly and modern logo featuring a stylized dog and cat silhouette forming a heart, with clean lines and a playful yet professional color palette. The design conveys care, trust, and happiness for pets and their owners.",
            "fontFamily": "'Poppins', 'Charlie Display', Arial, sans-serif",
            "iconStyle": "outline",
            "illustrationStyle": "flat, colorful, with soft rounded shapes and minimalistic details",
            "colorPalette": {
                "primary": "#1C91CD",
                "secondary": "#F9B233",
                "text": "#403f3f",
                "background": "#ffffff",
                "border": "#E6E6E6",
                "error": "#FF4D4F",
                "warning": "#FAAD14",
                "success": "#52C41A"
            }
        },
        "tokens": {
            "description": "Sistema de design tokens para o módulo petshop, com suporte a modo claro e escuro, focado em acessibilidade e identidade visual amigável.",
            "themeName": "petshop",
            "color": {
                "color-primary": "#1C91CD",
                "color-secondary": "#F9B233",
                "color-accent": "#F97C2E",
                "color-background": "#ffffff",
                "color-surface": "#F9FAFB",
                "color-text-normal": "#403f3f",
                "color-text-secondary": "#6B6B6B",
                "color-text-disabled": "#B0B8C4",
                "color-border": "#E6E6E6",
                "color-link-normal": "#1C91CD",
                "color-link-hover": "#F97C2E",
                "color-link-visited": "#0F6FA9",
                "color-overlay": "rgba(28,145,205,0.08)",
                "color-error": "#FF4D4F",
                "color-warning": "#FAAD14",
                "color-success": "#52C41A",
                "_dark-color-primary": "#56a8d1",
                "_dark-color-secondary": "#F9B233",
                "_dark-color-accent": "#F97C2E",
                "_dark-color-background": "#0d1117",
                "_dark-color-surface": "#161b22",
                "_dark-color-text-normal": "#e6edf3",
                "_dark-color-text-secondary": "#b0b8c4",
                "_dark-color-text-disabled": "#636363",
                "_dark-color-border": "#262626",
                "_dark-color-link-normal": "#56a8d1",
                "_dark-color-link-hover": "#F97C2E",
                "_dark-color-link-visited": "#bddef3",
                "_dark-color-overlay": "rgba(86,168,209,0.12)",
                "_dark-color-error": "#f9676a",
                "_dark-color-warning": "#eead2b",
                "_dark-color-success": "#63d42b"
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
                "shadow-sm": "0 1px 4px rgba(28,145,205,0.08)",
                "shadow-md": "0 2px 8px rgba(28,145,205,0.12)",
                "shadow-lg": "0 4px 16px rgba(28,145,205,0.16)",
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
                "line-height-sm": "1.3",
                "line-height-md": "1.5",
                "line-height-lg": "1.7"
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







