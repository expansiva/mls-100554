/// <mls shortName="agentCreateNewPrototypePage2" project="100554" enhancement="_blank" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { getPromptByHtml } from './_100554_aiPrompts';
import { getImages } from './_100554_libUnsplash';
import { convertFileNameToTag, convertTagToFileName } from './_100554_utilsLit';
import { loadModuleFromProjectOrDependency } from './_100554_libCommom';
import { createNewFile } from "./_100554_pluginNewFileBase";
import { formatHtml } from './_100554_collabDOMSync';

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

const agentName = "agentCreateNewPrototypePage2";
const agentProject = 100554;
const projectToSave = mls.actualProject || 0;
const enhancementTs = '_100554_enhancementLit';
const enhancementStyle = '_100554_enhancementStyle';

export function createAgent(): IAgent {
    return {
        agentName,
        avatar_url: svg_agent,
        agentDescription: "Agent for create a new Module - 4",
        visibility: "private",
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
        let pp = context.message.content
            .replace(`@@ ${agentName}`, '')
            .replace(`@@${agentName}`, '').trim();

        let data = JSON.parse(pp);

        const pageIndex: number = +data.pageIndex;
        const payload3 = await getPayload3(data);
        const organism: string[] = getOrganismsAlreadyCreated(payload3, +data.project, data.folder);
        const inputs: any = await getPrompts(payload3, organism, pageIndex);
        
        await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt, { project: data.project, shortName: data.shortName, folder: data.folder, pageIndex: pageIndex.toString() });
        return;
    }

    const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
    if (!step) {
        throw new Error(`[${agentName}](beforePrompt) No pending step found for this agent.`);
    }

    if (!step.prompt) throw new Error(`[${agentName}] beforePrompt: No prompt found in step for this agent.`);

    const data = JSON.parse(step.prompt) ;
    let payload3 = await getPayload3(data);

    const organismAlreadyDeclared = getOrganismsAlreadyCreated(payload3, +data.project, data.folder);

    await appendLongTermMemory(context, { project: data.project, shortName: data.shortName, folder: data.folder, pageIndex: data.pageIndex.toString() });

    const inputs = await getPrompts(payload3, organismAlreadyDeclared, +data.pageIndex);

    await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);

}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {

    if (!context || !context.message || !context.task) throw new Error("Invalid context");
    const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
    if (!step) throw new Error(`[${agentName}](afterPrompt) No in progress interaction found.`);

    context = await updateStepStatus(context, step.stepId, "completed", "no more agents");
    notifyTaskChange(context);
    await createPage(context);
    await executeNextStep(context);
    return;

}

async function getPayload3(info: { project: number, shortName: string, folder: string }): Promise<any> {

    const mm = await loadModuleFromProjectOrDependency('module', info.folder, '.ts');

    if (!mm || !mm.payload3) throw new Error(`Erro [${agentName}] getPrompts: invalid module`);

    const clone = JSON.parse(JSON.stringify(mm.payload3));
    return clone;
}

function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceByPriority(source: string, key: string, value: string): string {
    const escapedKey = escapeRegex(key);

    const pattern1 = new RegExp(`\\{{2}${escapedKey}\\}{2}`, 'g'); // {{key}}
    const pattern2 = new RegExp(`\\$\\{${escapedKey}\\}`, 'g');     // ${key}
    const pattern3 = new RegExp(escapedKey, 'g');                   // key

    if (pattern1.test(source)) {
        return source.replace(pattern1, value);
    } else if (pattern2.test(source)) {
        return source.replace(pattern2, value);
    } else if (pattern3.test(source)) {
        return source.replace(pattern3, value);
    }

    return source;
}

async function createPage(context: mls.msg.ExecutionContext) {

    if (!context || !context.task) throw new Error(`[${agentName}](createPage) Not found context to createPage`);
    const step = getNextPendentStep(context.task);
    if (!step || step.type !== 'flexible') throw new Error(`[${agentName}](createPage) Invalid step in createPage`);
    const payload4: PayLoad4 = step.result;
    if (!payload4 || !payload4.pageHtml) throw new Error(`[${agentName}](createPage) Not found "pageHtml" in payload`);

    const pageMemory = context.task?.iaCompressed?.longMemory as any;

    if (!pageMemory.project || !pageMemory.shortName || !pageMemory.folder || !step.result) throw new Error(`[${agentName}]Invalid step in update defs, type: ${step?.type} `);

    let payload3 = await getPayload3(pageMemory);

    consistPayload3(payload3);

    const resolvedImages = await getAllImages(payload4.images);

    let finalSource = payload4.pageHtml;

    for (const [key, url] of Object.entries(resolvedImages)) {
        finalSource = replaceByPriority(finalSource, key, url);
    }

    const groupName = pageMemory.folder;
    const shortName = pageMemory.shortName;

    const organismUsed = extractOrganismTags(finalSource);
    await generateFiles(step, context.task, payload4, payload3, finalSource, organismUsed, +pageMemory.project, pageMemory.folder, groupName, shortName, pageMemory.pageIndex);
    return context;
}

const _replayForSupport = async (context: mls.msg.ExecutionContext, payload: mls.msg.AIPayload[]): Promise<void> => {
    throw new Error("[replayForSupport] not implemented");
}

async function getPrompts(payload3:any, organismDeclared: string[], pageIndex: number): Promise<mls.msg.IAMessageInputType[]> {

    const actualProject = projectToSave;
    const organismNames = extractOrganismNames(payload3.pagesWireframe[pageIndex].pageHtml);
    const organismsUsed = payload3.organism.filter((item:any) => organismNames.includes(item.organismTag));
    const tagName = convertFileNameToTag({ project: actualProject, shortName: payload3.pages[pageIndex].pageName });

    const data: Record<string, string> = {
        page: JSON.stringify(payload3.pages[pageIndex]),
        pageWireframe: JSON.stringify(payload3.pagesWireframe[pageIndex]),
        finalModuleDetails: JSON.stringify(payload3.finalModuleDetails, null, 2),
        organismDetails: JSON.stringify(organismsUsed, null, 2),
        tokens: JSON.stringify(payload3.tokens),
        organismDeclared: JSON.stringify(organismDeclared),
        project: actualProject?.toString() || '',
        tag: tagName
    }

    const prompts = await getPromptByHtml({ project: agentProject, shortName: agentName, folder: '', data })
    return prompts;
}

function consistPayload3(payload3: any): any {
    if (!payload3) throw new Error(`[${agentName}](consistPayload3) No find payload`);
    if (!payload3.organism) throw new Error(`[${agentName}](consistPayload3) No find payload organism`);
    if (!payload3.pages) throw new Error(`[${agentName}](consistPayload3) No find payload pages`);
    if (!payload3.tokens) throw new Error(`[${agentName}](consistPayload3) No find payload tokens`);
    return payload3;
}

function getOrganismsAlreadyCreated(payload3: any, project: number, folder: string): string[] {
    const ret:string[] = [];
    if (!payload3 || !payload3.organism) return [];
    payload3.organism.forEach((i:any) => {
        const name = toCamelCase(i.organismTag);
        const key = mls.stor.getKeyToFiles(project, 2, name, folder, '.ts');
        if (mls.stor.files[key]) ret.push(i.organismTag);
    });
    return ret
}

function toCamelCase(input: string): string {
  return input
    .split('-')
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
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
    if (!context || !context.task) throw new Error(`[${agentName}](getPayload) Invalid context`);
    const agentStep = getAgentStepByAgentName(context.task, agentName); // Only one agent execution must exist in this task
    if (!agentStep) throw new Error(`[${agentName}](getPayload) no agent found`);

    // get result
    const resultStep = agentStep.interaction?.payload?.[0];
    if (!resultStep || resultStep.type !== "flexible" || !resultStep.result) throw new Error(`[${agentName}] [getPayload] No step flexible found for this agent.`);
    let payload4: PayLoad4 | string = resultStep.result;
    if (typeof payload4 === "string") payload4 = JSON.parse(payload4) as PayLoad4;
    return payload4;
}

async function generateFiles(
    step: mls.msg.AIPayload,
    task: mls.msg.TaskData,
    payload4: PayLoad4,
    payload3: any,
    htmlFull: string,
    organism: string[],
    project: number,
    folder: string,
    groupName: string,
    shortName: string,
    index: number
): Promise<string> {
    try {

        const { html, style } = extractStyleFromHtml(htmlFull);

        const enhancement = enhancementTs;
        const pageTagName = convertFileNameToTag({ project, shortName, folder });
        const info = convertTagToFileName(pageTagName);
        if (!info) return '';

        await generateOrganisms(payload3, organism, htmlFull, project, folder, groupName);

        const sourceTS = generateTsPage(info, groupName, pageTagName, payload3);
        const sourceHTML = generateHtmlPage(info, pageTagName, html);
        const sourceLess = generateLessPage(info, groupName, pageTagName, htmlFull);
        const sourceDefs = generateDefsPage(info, groupName, pageTagName, payload3, index, payload4.images, organism, task, step);

        const models = mls.editor.getModels(project, shortName, folder);
        if (models) {

            models.ts?.model.setValue(sourceTS);
            models.html?.model.setValue(sourceHTML);
            if(sourceLess) models.style?.model.setValue(sourceLess);
            models.defs?.model.setValue(sourceDefs);

            
        }

        return `page created: ${folder}/${shortName}`

    } catch (err: any) {
        return `[${agentName}](generateFiles) ${err.message}`;
    }
}

async function generateOrganisms(payload3: any, organisms: string[], htmlString: string, project: number, folder: string, groupName: string) {

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
        const organismData = payload3.organism.find((org:any) => org.organismTag === organism);
        if (!organismData) return;

        let shortName1 = sanitizeMeta(organismData.organismTag, project, folder);

        const tagNameWithFolder = `${folder}--${shortName1}-${project}`;
        const info = convertTagToFileName(tagNameWithFolder);
        if (!info) continue;

        const organismHtml = organismEl.innerHTML;
        if (!organismHtml) continue;
        const organismLess = styleData?.content?.replace(`${organism} {`, `${tagNameWithFolder} {`)

        const sourceTS = generateTsOrganism(info, tagNameWithFolder, groupName, organismHtml);
        const sourceHTML = generateHtmlOrganism(info, tagNameWithFolder);
        const sourceLess = generateLessOrganism(info, groupName, organismLess || '');
        const sourceDefs = generateDefsOrganism(info, groupName, tagNameWithFolder, payload3, organism);

        await createNewFile({ project, shortName: info.shortName, folder, position: 'right', enhancement, sourceTS: sourceTS.trim(), sourceHTML, sourceLess, sourceDefs, openPreview: false });


    }

}

function generateTsPage(
    info: {
        shortName: string;
        project: number;
        folder: string;
    },
    groupName: string,
    pageTagName: string,
    payload: any,
): string {

    const enhancement = enhancementTs;

    const ts = `
/// <mls shortName="${info.shortName}" project="${info.project}" folder="${info.folder}" enhancement="${enhancement}" groupName="${groupName}" />

import { CollabPageElement } from './_100554_collabPageElement';
import { customElement } from 'lit/decorators.js';
import { globalState, initState, setState } from './_100554_collabState';

@customElement('${pageTagName}')
export class Page${info.shortName.charAt(0).toUpperCase()}${info.shortName.slice(1)} extends CollabPageElement {
    initPage() {

    }
}`;

    return ts;
}


function generateLessPage(
    info: {
        shortName: string;
        project: number;
        folder: string;
    },
    groupName: string,
    pageTagName: string,
    htmlString: string
): string {


    const enhancement = enhancementStyle;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const styles = doc.querySelectorAll('style[type="text/less"]');
    const resultStyles = Array.from(styles).map(style => ({
        name: style.getAttribute('data-name'),
        content: style.textContent
    }));



    const tagNameWithoutFolder = convertFileNameToTag({ shortName: info.shortName, project: info.project });
    let styleData = resultStyles.find((result) => result.name === `page-${tagNameWithoutFolder}`); // page-home-100554
    if (!styleData) styleData = resultStyles.find((result) => result.name === `page-${info.shortName}`); //page-adminPanel
    if (!styleData) return "";

    if (styleData && !styleData.content) return "";
    const lessContent = replacePageLessTag(styleData.content as string, info.project, info.shortName, pageTagName);
    const lessResult = `/// <mls shortName="${info.shortName}" project="${info.project}" folder="${info.folder}" groupName="${groupName}" enhancement="${enhancement}" />\n\n ${lessContent || ''}`;
    return lessResult;

}

function generateHtmlPage(
    info: {
        shortName: string;
        project: number;
        folder: string;
    },
    pageTagName: string,
    htmlFull: string,
): string {

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlFull, 'text/html');
    const allElements = doc.querySelectorAll('*');
    const countByTags: Record<string, number> = {};
    const pageName = info.shortName;

    allElements.forEach((element) => {
        const tag = element.tagName.toLowerCase();
        if (tag.startsWith('organism')) {
            if (!countByTags[tag]) {
                countByTags[tag] = 1;
            } else {
                countByTags[tag]++;
            }
            element.id = pageName + tag.replace('organism', '') + countByTags[tag].toString()
        } else {
            if (!countByTags[tag]) {
                countByTags[tag] = 1;
            } else {
                countByTags[tag]++;
            }
            element.id = pageName + '-core-' + tag + countByTags[tag].toString()
        }
    });

    let newHtml = replaceOrganismTags(doc.body.outerHTML, info.project, info.folder);
    newHtml = replacePageTag(newHtml, info.project, info.shortName, pageTagName);

    const htmlFinal = `${formatHtml(newHtml)}`;
    return htmlFinal;
}

function generateDefsPage(
    info: {
        shortName: string;
        project: number;
        folder: string;
    },
    groupName: string,
    pageTagName: string,
    payload: any,
    index: number,
    images: Images[],
    organism: string[],
    task: mls.msg.TaskData,
    step: mls.msg.AIPayload
): string {

    const page = payload.pages[index];
    const wireframe = payload.pagesWireframe.find((p:any) => p.pageSequential === page.pageSequential);
    const widgets = wireframe ? extractOrganismTagsFromHtml(wireframe.pageHtml) : [];

    const defs: mls.l4.BaseDefs = {
        meta: {
            projectId: info.project,
            folder: info.folder,
            shortName: info.shortName,
            type: "page",
            devFidelity: "scaffold",
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
                    derivedRequirements: page.pageRequirements.map((desc:any) => ({ description: desc }))
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

    return `/// <mls shortName="${info.shortName}" project="${info.project}" folder="${info.folder}" groupName="${groupName}" enhancement="_blank" />\n\n` +
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


function generateTsOrganism(
    info: {
        shortName: string;
        project: number;
        folder: string;
    },
    tagName: string,
    groupName: string,
    organismHtml: string) {

    const enhancement = enhancementTs;
    const shortName = info.shortName;

    const parser = new DOMParser();
    const doc = parser.parseFromString(organismHtml, 'text/html');
    let counter = 1;
    const prefixId = tagName.replace('organism-', '');
    doc.body.querySelectorAll('*').forEach(el => {
        el.id = el.id || `${prefixId}-${counter++}`;
    });

    const ts = `
/// <mls shortName="${shortName}" project="${info.project}" folder="${info.folder}" enhancement="${enhancement}" groupName="${groupName}" />

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

function generateHtmlOrganism(
    info: {
        shortName: string;
        project: number;
        folder: string;
    },
    tagName: string
): string {

    try {
        const htmlResult = `<${tagName}></${tagName}>`;
        return htmlResult;

    } catch (err: any) {
        throw new Error(`[${agentName}](generateHtmlOrganism) ${err.message}`);
    }
}

function generateLessOrganism(
    info: {
        shortName: string;
        project: number;
        folder: string;
    },
    groupName: string,
    less: string
): string {

    try {

        const shortName = info.shortName;
        const enhancement = enhancementStyle;
        if (!less) return '';
        const lessResult = `/// <mls shortName="${shortName}" project="${info.project}" folder="${info.folder}" groupName="${groupName}" enhancement="${enhancement}" />\n\n ${less}`
        return lessResult;

    } catch (err: any) {
        throw new Error(`[${agentName}](generateLessOrganism) ${err.message}`);
    }
}

function generateDefsOrganism(
    info: {
        shortName: string;
        project: number;
        folder: string;
    },
    groupName: string,
    tagName: string,
    payload: any,
    organismTag: string,
): string {

    const organism = payload.organism.find((org:any) => org.organismTag === organismTag);
    if (!organism) return '';

    const defs: mls.l4.BaseDefs = {
        meta: {
            projectId: info.project,
            folder: info.folder,
            shortName: info.shortName,
            type: "organism",
            devFidelity: "scaffold",
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

    return `/// <mls shortName="${info.shortName}" project="${info.project}" folder="${info.folder}" groupName="${groupName}" enhancement="_blank" />\n\n` +
        `// Do not change – automatically generated code.\n\n` +
        `export const defs: mls.l4.BaseDefs = ${JSON.stringify(defs, null, 2)}\n`;
}

function replaceOrganismTags(htmlString: string, project: number, folder: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const organismElements = doc.querySelectorAll('*');
    organismElements.forEach((el) => {
        if (el.tagName.toLowerCase().startsWith('organism-')) {
            const tagName = el.tagName.toLowerCase();
            const newTagName = folder ? `${folder}--${tagName}-${project}` : `${tagName}-${project}`;
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

function replacePageTag(htmlString: string, project: number, shortName: string, newTag: string) {
    const oldTag = convertFileNameToTag({ shortName, project });
    const escapedOldTag = oldTag.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(escapedOldTag, 'g');
    const newHtml = htmlString.replace(regex, newTag);
    return newHtml;
}

function replacePageLessTag(lessString: string, project: number, shortName: string, newTag: string) {
    const oldTag = convertFileNameToTag({ shortName, project });
    const escapedOldTag = oldTag.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(^|\\s)${escapedOldTag}(?=\\s*\\{)`);
    const newLess = lessString.replace(regex, (match, prefix) => `${prefix}${newTag}`);
    return newLess;
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


function verifyFileIfExists(args: { project: number, shortName: string, folder: string }): boolean {
    const key = mls.stor.getKeyToFiles(args.project, 2, args.shortName, args.folder, ".ts")
    return !!mls.stor.files[key];
}

function sanitizeMeta(baseShortName: string, project: number, folder: string): string {
    let candidateName = baseShortName;
    let suffix = 1;

    while (verifyFileIfExists({ project, shortName: candidateName, folder })) {
        candidateName = `${baseShortName}${suffix}`;
        suffix++;
    }
    return candidateName;
}

function verifyFolderAlreadyExists(args: { project: number, folder: string }): boolean {

    let alreadyExists: boolean = false;
    for (let storFile of Object.values(mls.stor.files)) {
        if (storFile.folder === args.folder && storFile.project === args.project) {
            alreadyExists = true;
            break;
        }
    }

    return alreadyExists;

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