/// <mls shortName="agentGeneratePrototype4" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAgent, svg_agent } from './_100554_aiAgentBase';
import { getPromptByHtml } from './_100554_aiPrompts';
import { getPayload3, PayLoad3 } from './_100554_agentGeneratePrototype3';
import { getImages } from './_100554_libUnsplash';
import { convertFileNameToTag, convertTagToFileName } from './_100554_utilsLit';
import { createNewFile } from "./_100554_pluginNewFileBase";
import { formatHtml } from './_100554_collabDOMSync';
import { addNewTokensTheme } from './_100554_designSystemBase';
import { addModule } from './_100554_projectAST';

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
    const pageIndex: number = 0;
    const organism: string[] = []
    const payload3: PayLoad3 = getPayload3Mock();
    const totalPages = payload3.pages.length;
    const inputs: any = await getPrompts(payload3, organism, pageIndex);
    const moduleName = sanitizeFolder(payload3.finalModuleDetails.moduleName, projectToSave);

    await startNewAiTask(agentName, taskTitle, context.message.content, context.message.threadId, context.message.senderId, inputs, context, _afterPrompt, { 'next_page': `${pageIndex}`, 'organism_created': JSON.stringify(organism), "total_pages": totalPages.toString(), "module_name": moduleName });
    return;
  }

  const step: mls.msg.AIAgentStep | null = getNextPendingStepByAgentName(context.task, agentName);
  if (!step) {
    throw new Error(`[${agentName}](beforePrompt) No pending step found for this agent.`);
  }
  const organismAlreadyDeclared = getOrganismsAlreadyCreated(context);
  let payload3: PayLoad3 | undefined;
  if (context.modeSingleStep) payload3 = getPayload3Mock(); // only for dev test on preview
  else payload3 = getPayload3(context);

  const totalPages = payload3.pages.length;
  let moduleName = context.task?.iaCompressed?.longMemory['module_name'];
  if (!moduleName) {
    moduleName = sanitizeFolder(payload3.finalModuleDetails.moduleName, projectToSave);
    appendLongTermMemory(context, { "total_pages": totalPages.toString(), "module_name": moduleName });
  }

  const inputs = await getPrompts(payload3, organismAlreadyDeclared, Number(step.prompt));
  await startNewInteractionInAiTask(agentName, taskTitle, inputs, context, _afterPrompt, step.stepId);

}

const _afterPrompt = async (context: mls.msg.ExecutionContext): Promise<void> => {

  if (!context || !context.message || !context.task) throw new Error("Invalid context");
  const step: mls.msg.AIAgentStep | null = getNextInProgressStepByAgentName(context.task, agentName);
  if (!step) throw new Error(`[${agentName}](afterPrompt) No in progress interaction found.`);

  context = await updateStepStatus(context, step.stepId, "completed", "no more agents");
  notifyTaskChange(context);
  await createPage(context);

  if (!context.task) throw new Error(`[${agentName}](afterPrompt) Invalid context task`);
  const nextPage = context.task?.iaCompressed?.longMemory['next_page'] ? +(context.task?.iaCompressed?.longMemory['next_page']) : -1;
  const totalPagesIndex = context.task?.iaCompressed?.longMemory['total_pages'] ? +(context.task?.iaCompressed?.longMemory['total_pages']) : undefined;

  if (totalPagesIndex === undefined || nextPage >= totalPagesIndex) {
    context.task = await updateTaskTitle(context.task, "Ok, all pages created, see result");
    await executeNextStep(context);
    return;
  }

  context.task = await updateTaskTitle(context.task, "Ok, page created");
  const stepPendent = getNextPendentStep(context.task);
  if (!stepPendent) throw new Error(`[${agentName}](afterPrompt) Invalid next stepPendent`);

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

  let payload3: PayLoad3 | undefined;
  if (context.modeSingleStep) payload3 = getPayload3Mock(); // only for dev test on preview
  else payload3 = getPayload3(context);

  consistPayload3(payload3)

  const resolvedImages = await getAllImages(payload4.images);

  let finalSource = payload4.pageHtml;

  for (const [key, url] of Object.entries(resolvedImages)) {
    finalSource = replaceByPriority(finalSource, key, url);
  }

  const actualTaskIndex = context.task?.iaCompressed?.longMemory['next_page'] ? +(context.task?.iaCompressed?.longMemory['next_page']) : 0;
  const folder = context.task?.iaCompressed?.longMemory['module_name'];
  if (!folder) throw new Error(`[${agentName}](createPage) Invalid module name`)

  const groupName = folder;
  const pageData = payload3.pages[actualTaskIndex];
  const shortName = pageData.pageName;
  const shortName1 = sanitizeMeta(shortName, projectToSave, folder);

  if (actualTaskIndex === 0) {
    payload3.tokens.themeName = folder;
    await addNewTokensTheme(projectToSave, payload3.tokens);
    await createModuleFile(shortName1, projectToSave, folder, groupName, payload3);
    await createProjectFile(groupName, projectToSave, payload3);

  }

  const organismUsed = extractOrganismTags(finalSource);
  await updateLongMemory(context, organismUsed, actualTaskIndex);
  await generateFiles(step, context.task, payload4, payload3, finalSource, organismUsed, projectToSave, folder, groupName, shortName1, actualTaskIndex);
  return context;
}

const _replayForSupport = async (context: mls.msg.ExecutionContext, payload: mls.msg.AIPayload[]): Promise<void> => {
  throw new Error("[replayForSupport] not implemented");
}

async function getPrompts(payload3: PayLoad3, organismDeclared: string[], pageIndex: number): Promise<mls.msg.IAMessageInputType[]> {

  const actualProject = projectToSave;
  const organismNames = extractOrganismNames(payload3.pagesWireframe[pageIndex].pageHtml);
  const organismsUsed = payload3.organism.filter((item) => organismNames.includes(item.organismTag));
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

async function updateLongMemory(context: mls.msg.ExecutionContext, newOrganism: string[], actualTaskIndex: number) {
  const byLongMemory = context.task?.iaCompressed?.longMemory['organism_created'];
  const data = (byLongMemory ? JSON.parse(byLongMemory) : []) as string[]
  const newOrganismData: string[] = [...data].concat(newOrganism);
  const newOrganismArr = Array.from(new Set(newOrganismData))
  if (actualTaskIndex !== undefined && actualTaskIndex > -1) {
    actualTaskIndex = actualTaskIndex + 1;
  }
  const task = await appendLongTermMemory(context, { 'organism_created': JSON.stringify(newOrganismArr), 'next_page': actualTaskIndex.toString() });
  context.task = task;
  return task;
}

function consistPayload3(payload3: PayLoad3): PayLoad3 {
  if (!payload3) throw new Error(`[${agentName}](consistPayload3) No find payload`);
  if (!payload3.organism) throw new Error(`[${agentName}](consistPayload3) No find payload organism`);
  if (!payload3.pages) throw new Error(`[${agentName}](consistPayload3) No find payload pages`);
  if (!payload3.tokens) throw new Error(`[${agentName}](consistPayload3) No find payload tokens`);
  return payload3;
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
  payload3: PayLoad3,
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

    await createNewFile({ project, folder, shortName, position: 'right', enhancement, sourceTS: sourceTS.trim(), sourceHTML, sourceLess, sourceDefs, openPreview: false });

    return `page created: ${folder}/${shortName}`

  } catch (err: any) {
    return `[${agentName}](generateFiles) ${err.message}`;
  }
}

async function createProjectFile(moduleName: string, project: number, payload3: PayLoad3) {

  const shortName = 'project';
  const folder = '';
  const enhancement = '_blank';
  const key = mls.stor.getKeyToFiles(project, 2, shortName, folder, '.ts');
  const storFile = mls.stor.files[key];
  if (!storFile) {
    const ts = `
/// <mls shortName="${shortName}" project="${project}" folder="${folder}" enhancement="_blank" />

export const modules = [{ name: '${moduleName}' }];

`;

    await createNewFile({ project, shortName, folder, position: 'right', enhancement, sourceTS: ts.trim(), sourceHTML: '', sourceLess: '', sourceDefs: '', openPreview: false });
  } else {

    await addModule(project, moduleName, true);

  }


}

async function createModuleFile(shortName: string, project: number, folder: string, groupName: string, payload3: PayLoad3) {

  const moduleShortName = 'module';
  const enhancement = '_blank';

  const ts = `
/// <mls shortName="${moduleShortName}" project="${project}" folder="${folder}" groupName="${groupName}" enhancement="_blank" />

export const moduleConfig = {
  theme: "${folder}",
  initialPage: "${shortName}"
}

export const payload3 = ${JSON.stringify(payload3, null, 2)}

`;

  await createNewFile({ project, shortName: moduleShortName, folder, position: 'right', enhancement, sourceTS: ts.trim(), sourceHTML: '', sourceLess: '', sourceDefs: '', openPreview: false });

}

async function generateOrganisms(payload3: PayLoad3, organisms: string[], htmlString: string, project: number, folder: string, groupName: string) {

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
  payload: PayLoad3,
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
  payload: PayLoad3,
  index: number,
  images: Images[],
  organism: string[],
  task: mls.msg.TaskData,
  step: mls.msg.AIPayload
): string {

  const page = payload.pages[index];
  const wireframe = payload.pagesWireframe.find(p => p.pageSequential === page.pageSequential);
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
  payload: PayLoad3,
  organismTag: string,
): string {

  const organism = payload.organism.find((org) => org.organismTag === organismTag);
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

function sanitizeFolder(folderName: string, project: number): string {
  let candidateName = folderName;
  let suffix = 1;

  while (verifyFolderAlreadyExists({ project, folder: candidateName })) {
    candidateName = `${folderName}${suffix}`;
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
      "moduleGoal": "Desenvolver um site para um petshop, voltado principalmente para donos de cães e gatos, mas também atendendo outros animais de estimação. O site deve ser amigável e acolhedor, com funcionalidades para clientes e administradores.",
      "moduleName": "petshop",
      "requirements": [
        "Site em português.",
        "Acesso para clientes (usuários comuns) e administradores (gestão de conteúdo).",
        "Funcionalidades principais: agendamento de banho e tosa, catálogo de produtos, página de contato.",
        "Fluxo de agendamento: escolha de serviço, data, horário, dados do pet, confirmação por e-mail.",
        "Catálogo de produtos com categorias e filtros.",
        "Administradores podem gerenciar produtos, agendamentos e textos do site.",
        "Integração com Instagram, Facebook e WhatsApp.",
        "Site responsivo e com acessibilidade básica.",
        "Tom de comunicação amigável e acolhedor.",
        "Sugestão de cores e imagens para o site (logo já existente).",
        "Público-alvo: donos de cães, gatos e outros animais de estimação."
      ],
      "userRequestsEnhancements": [
        {
          "description": "Adicionar blog ou área de notícias.",
          "priority": "could"
        },
        {
          "description": "Implementar sistema de fidelidade ou cupons para clientes.",
          "priority": "could"
        },
        {
          "description": "Permitir avaliações e comentários de clientes nos produtos ou serviços.",
          "priority": "could"
        },
        {
          "description": "Oferecer agendamento para outros serviços além de banho e tosa.",
          "priority": "could"
        },
        {
          "description": "Disponibilizar o site em outros idiomas.",
          "priority": "could"
        }
      ]
    },
    "pages": [
      {
        "pageSequential": 0,
        "pageName": "home",
        "pageGoal": "Apresentar o petshop, principais serviços, destaques e facilitar navegação para agendamento, catálogo e contato.",
        "pageRequirements": [
          "Exibir banner de boas-vindas.",
          "Destaque para agendamento de banho e tosa.",
          "Acesso rápido ao catálogo de produtos.",
          "Links para redes sociais.",
          "Apresentação do petshop."
        ]
      },
      {
        "pageSequential": 1,
        "pageName": "agendamento",
        "pageGoal": "Permitir que clientes agendem banho e tosa, escolhendo serviço, data, horário e informando dados do pet.",
        "pageRequirements": [
          "Escolha de serviço (banho, tosa, ambos).",
          "Seleção de data e horário disponíveis.",
          "Formulário para dados do pet e do tutor.",
          "Confirmação do agendamento por e-mail."
        ]
      },
      {
        "pageSequential": 2,
        "pageName": "catalogoProdutos",
        "pageGoal": "Exibir produtos do petshop com categorias e filtros para facilitar a busca.",
        "pageRequirements": [
          "Lista de produtos com imagens, nome, preço e categoria.",
          "Filtros por categoria e busca por nome.",
          "Possibilidade de exibir detalhes do produto."
        ]
      },
      {
        "pageSequential": 3,
        "pageName": "contato",
        "pageGoal": "Permitir que clientes entrem em contato com o petshop e acessem links para redes sociais.",
        "pageRequirements": [
          "Formulário de contato.",
          "Exibir telefone, endereço e e-mail.",
          "Links para Instagram, Facebook e WhatsApp."
        ]
      },
      {
        "pageSequential": 4,
        "pageName": "adminPanel",
        "pageGoal": "Permitir que administradores gerenciem produtos, agendamentos e textos do site.",
        "pageRequirements": [
          "Login de administrador.",
          "Gestão de produtos (CRUD).",
          "Gestão de agendamentos (visualizar, editar, cancelar).",
          "Gestão de textos institucionais do site."
        ]
      }
    ],
    "plugins": [
      {
        "pluginSequential": 0,
        "pluginName": "pluginWhatsapp",
        "pluginType": "third-party",
        "pluginGoal": "Facilitar contato rápido via WhatsApp.",
        "pluginRequirements": [
          "Botão flutuante para abrir conversa no WhatsApp.",
          "Configuração do número do petshop."
        ]
      },
      {
        "pluginSequential": 1,
        "pluginName": "pluginInstagram",
        "pluginType": "third-party",
        "pluginGoal": "Exibir feed ou link para Instagram do petshop.",
        "pluginRequirements": [
          "Exibir últimas postagens ou link direto para perfil."
        ]
      },
      {
        "pluginSequential": 2,
        "pluginName": "pluginFacebook",
        "pluginType": "third-party",
        "pluginGoal": "Exibir link para página do Facebook do petshop.",
        "pluginRequirements": [
          "Link ou widget para página do Facebook."
        ]
      },
      {
        "pluginSequential": 3,
        "pluginName": "pluginScrollToTop",
        "pluginType": "ui",
        "pluginGoal": "Melhorar navegação em páginas longas.",
        "pluginRequirements": [
          "Botão flutuante para rolar ao topo da página."
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
          "<organism-banner-welcome></organism-banner-welcome>",
          "</header>",
          "<main>",
          "<organism-services-highlight></organism-services-highlight>",
          "<organism-featured-products></organism-featured-products>",
          "<organism-about-petshop></organism-about-petshop>",
          "</main>",
          "<aside>",
          "<organism-social-links></organism-social-links>",
          "</aside>",
          "<footer>",
          "<organism-footer-info></organism-footer-info>",
          "</footer>",
          "</body>"
        ]
      },
      {
        "pageSequential": 1,
        "pageName": "agendamento",
        "pageHtml": [
          "<body>",
          "<header>",
          "<organism-nav></organism-nav>",
          "</header>",
          "<main>",
          "<organism-scheduling-steps></organism-scheduling-steps>",
          "<organism-scheduling-confirmation></organism-scheduling-confirmation>",
          "</main>",
          "<aside>",
          "<organism-help-contact></organism-help-contact>",
          "</aside>",
          "<footer>",
          "<organism-footer-info></organism-footer-info>",
          "</footer>",
          "</body>"
        ]
      },
      {
        "pageSequential": 2,
        "pageName": "catalogoProdutos",
        "pageHtml": [
          "<body>",
          "<header>",
          "<organism-nav></organism-nav>",
          "</header>",
          "<main>",
          "<organism-product-filters></organism-product-filters>",
          "<organism-product-list></organism-product-list>",
          "</main>",
          "<aside>",
          "<organism-category-list></organism-category-list>",
          "</aside>",
          "<footer>",
          "<organism-footer-info></organism-footer-info>",
          "</footer>",
          "</body>"
        ]
      },
      {
        "pageSequential": 3,
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
          "<aside>",
          "<organism-social-links></organism-social-links>",
          "</aside>",
          "<footer>",
          "<organism-footer-info></organism-footer-info>",
          "</footer>",
          "</body>"
        ]
      },
      {
        "pageSequential": 4,
        "pageName": "adminPanel",
        "pageHtml": [
          "<body>",
          "<header>",
          "<organism-admin-nav></organism-admin-nav>",
          "</header>",
          "<main>",
          "<organism-admin-products></organism-admin-products>",
          "<organism-admin-schedules></organism-admin-schedules>",
          "<organism-admin-texts></organism-admin-texts>",
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
          "context": "Navegação principal do site, visível em todas as páginas.",
          "goal": "Exibir menu de navegação com links para as principais páginas do site.",
          "userStories": [
            {
              "story": "Como visitante, quero acessar facilmente as principais áreas do site.",
              "derivedRequirements": [
                {
                  "description": "Menu com links para Home, Agendamento, Catálogo, Contato."
                }
              ]
            },
            {
              "story": "Como usuário mobile, quero um menu adaptado para telas pequenas.",
              "derivedRequirements": [
                {
                  "description": "Menu responsivo com botão de abrir/fechar."
                }
              ]
            }
          ],
          "constraints": [
            "Deve ser responsivo.",
            "Deve ter contraste adequado."
          ]
        }
      },
      {
        "organismSequential": 1,
        "organismTag": "organism-banner-welcome",
        "planning": {
          "context": "Banner de destaque na home.",
          "goal": "Dar boas-vindas ao visitante e destacar o propósito do petshop.",
          "userStories": [
            {
              "story": "Como visitante, quero sentir confiança e acolhimento ao acessar o site.",
              "derivedRequirements": [
                {
                  "description": "Mensagem de boas-vindas e imagem ilustrativa."
                }
              ]
            }
          ],
          "constraints": [
            "Imagem otimizada para web.",
            "Texto acessível para leitores de tela."
          ]
        }
      },
      {
        "organismSequential": 2,
        "organismTag": "organism-services-highlight",
        "planning": {
          "context": "Destaque dos principais serviços na home.",
          "goal": "Apresentar rapidamente os serviços de banho e tosa, incentivando o agendamento.",
          "userStories": [
            {
              "story": "Como dono de pet, quero saber rapidamente quais serviços o petshop oferece.",
              "derivedRequirements": [
                {
                  "description": "Cards ou blocos com descrição dos serviços."
                }
              ]
            }
          ]
        }
      },
      {
        "organismSequential": 3,
        "organismTag": "organism-featured-products",
        "planning": {
          "context": "Exibição de produtos em destaque na home.",
          "goal": "Mostrar produtos populares ou em promoção.",
          "userStories": [
            {
              "story": "Como cliente, quero ver sugestões de produtos logo na página inicial.",
              "derivedRequirements": [
                {
                  "description": "Lista de produtos destacados com imagem, nome e preço."
                }
              ]
            }
          ]
        }
      },
      {
        "organismSequential": 4,
        "organismTag": "organism-about-petshop",
        "planning": {
          "context": "Sessão institucional na home.",
          "goal": "Apresentar a história e valores do petshop.",
          "userStories": [
            {
              "story": "Como visitante, quero conhecer mais sobre o petshop.",
              "derivedRequirements": [
                {
                  "description": "Texto institucional editável pelo admin."
                }
              ]
            }
          ]
        }
      },
      {
        "organismSequential": 5,
        "organismTag": "organism-social-links",
        "planning": {
          "context": "Links para redes sociais em home, contato e aside.",
          "goal": "Facilitar acesso às redes sociais do petshop.",
          "userStories": [
            {
              "story": "Como cliente, quero acessar rapidamente as redes sociais do petshop.",
              "derivedRequirements": [
                {
                  "description": "Ícones para Instagram, Facebook e WhatsApp."
                }
              ]
            }
          ]
        }
      },
      {
        "organismSequential": 6,
        "organismTag": "organism-footer-info",
        "planning": {
          "context": "Rodapé do site.",
          "goal": "Exibir informações institucionais, direitos autorais e links úteis.",
          "userStories": [
            {
              "story": "Como visitante, quero encontrar informações de contato e políticas no rodapé.",
              "derivedRequirements": [
                {
                  "description": "Endereço, telefone, e-mail e links institucionais."
                }
              ]
            }
          ]
        }
      },
      {
        "organismSequential": 7,
        "organismTag": "organism-scheduling-steps",
        "planning": {
          "context": "Fluxo de agendamento de banho e tosa.",
          "goal": "Permitir ao cliente escolher serviço, data, horário e informar dados do pet.",
          "userStories": [
            {
              "story": "Como cliente, quero agendar banho e tosa de forma simples e rápida.",
              "derivedRequirements": [
                {
                  "description": "Formulário multi-etapas: serviço, data/horário, dados do pet/tutor."
                }
              ]
            }
          ]
        }
      },
      {
        "organismSequential": 8,
        "organismTag": "organism-scheduling-confirmation",
        "planning": {
          "context": "Confirmação do agendamento.",
          "goal": "Exibir resumo e confirmação do agendamento, com envio de e-mail.",
          "userStories": [
            {
              "story": "Como cliente, quero receber confirmação do meu agendamento.",
              "derivedRequirements": [
                {
                  "description": "Resumo do agendamento e disparo de e-mail de confirmação."
                }
              ]
            }
          ]
        }
      },
      {
        "organismSequential": 9,
        "organismTag": "organism-help-contact",
        "planning": {
          "context": "Ajuda e contato rápido durante o agendamento.",
          "goal": "Oferecer informações de contato e suporte durante o agendamento.",
          "userStories": [
            {
              "story": "Como cliente, quero tirar dúvidas durante o agendamento.",
              "derivedRequirements": [
                {
                  "description": "Exibir telefone, WhatsApp e horário de atendimento."
                }
              ]
            }
          ]
        }
      },
      {
        "organismSequential": 10,
        "organismTag": "organism-product-filters",
        "planning": {
          "context": "Filtros e busca no catálogo de produtos.",
          "goal": "Permitir filtrar produtos por categoria e buscar por nome.",
          "userStories": [
            {
              "story": "Como cliente, quero filtrar produtos por categoria.",
              "derivedRequirements": [
                {
                  "description": "Filtro por categoria e campo de busca."
                }
              ]
            }
          ]
        }
      },
      {
        "organismSequential": 11,
        "organismTag": "organism-product-list",
        "planning": {
          "context": "Listagem dos produtos do petshop.",
          "goal": "Exibir produtos com imagem, nome, preço e categoria.",
          "userStories": [
            {
              "story": "Como cliente, quero ver todos os produtos disponíveis.",
              "derivedRequirements": [
                {
                  "description": "Grid/lista de produtos com detalhes básicos."
                }
              ]
            }
          ]
        }
      },
      {
        "organismSequential": 12,
        "organismTag": "organism-category-list",
        "planning": {
          "context": "Lista de categorias no catálogo.",
          "goal": "Exibir categorias para navegação rápida.",
          "userStories": [
            {
              "story": "Como cliente, quero navegar por categorias de produtos.",
              "derivedRequirements": [
                {
                  "description": "Lista clicável de categorias."
                }
              ]
            }
          ]
        }
      },
      {
        "organismSequential": 13,
        "organismTag": "organism-contact-form",
        "planning": {
          "context": "Formulário de contato na página de contato.",
          "goal": "Permitir que clientes enviem mensagens ao petshop.",
          "userStories": [
            {
              "story": "Como cliente, quero enviar dúvidas ou solicitações pelo site.",
              "derivedRequirements": [
                {
                  "description": "Formulário com campos de nome, e-mail, mensagem."
                }
              ]
            }
          ]
        }
      },
      {
        "organismSequential": 14,
        "organismTag": "organism-contact-info",
        "planning": {
          "context": "Informações de contato na página de contato.",
          "goal": "Exibir telefone, endereço e e-mail do petshop.",
          "userStories": [
            {
              "story": "Como cliente, quero encontrar facilmente as informações de contato.",
              "derivedRequirements": [
                {
                  "description": "Exibir dados de contato em destaque."
                }
              ]
            }
          ]
        }
      },
      {
        "organismSequential": 15,
        "organismTag": "organism-admin-nav",
        "planning": {
          "context": "Navegação do painel administrativo.",
          "goal": "Permitir que administradores naveguem entre as áreas de gestão.",
          "userStories": [
            {
              "story": "Como administrador, quero acessar rapidamente as áreas de produtos, agendamentos e textos.",
              "derivedRequirements": [
                {
                  "description": "Menu lateral ou superior com links para cada área."
                }
              ]
            }
          ]
        }
      },
      {
        "organismSequential": 16,
        "organismTag": "organism-admin-products",
        "planning": {
          "context": "Gestão de produtos no painel admin.",
          "goal": "Permitir CRUD de produtos.",
          "userStories": [
            {
              "story": "Como administrador, quero adicionar, editar e remover produtos.",
              "derivedRequirements": [
                {
                  "description": "Formulário de cadastro e edição, lista de produtos."
                }
              ]
            }
          ]
        }
      },
      {
        "organismSequential": 17,
        "organismTag": "organism-admin-schedules",
        "planning": {
          "context": "Gestão de agendamentos no painel admin.",
          "goal": "Visualizar, editar e cancelar agendamentos.",
          "userStories": [
            {
              "story": "Como administrador, quero ver todos os agendamentos e gerenciá-los.",
              "derivedRequirements": [
                {
                  "description": "Tabela de agendamentos com ações de editar/cancelar."
                }
              ]
            }
          ]
        }
      },
      {
        "organismSequential": 18,
        "organismTag": "organism-admin-texts",
        "planning": {
          "context": "Gestão de textos institucionais no painel admin.",
          "goal": "Permitir editar textos do site.",
          "userStories": [
            {
              "story": "Como administrador, quero atualizar textos institucionais facilmente.",
              "derivedRequirements": [
                {
                  "description": "Editor de texto para áreas institucionais do site."
                }
              ]
            }
          ]
        }
      }
    ],
    "visualIdentity": {
      "logoDescription": "Mascot-style logo with a friendly dog and cat together, using rounded shapes and soft lines, in a playful and welcoming style. Colors: blue, orange, and white.",
      "fontFamily": "'Quicksand', 'Charlie Display', Arial, sans-serif",
      "iconStyle": "outline",
      "illustrationStyle": "flat, colorful, with rounded corners and playful animal characters",
      "colorPalette": {
        "primary": "#1C91CD",
        "secondary": "#FFB347",
        "text": "#403f3f",
        "background": "#F9F9F9",
        "border": "#E6E6E6",
        "error": "#FF4D4F",
        "warning": "#FAAD14",
        "success": "#52C41A"
      }
    },
    "tokens": {
      "description": "Design tokens personalizados para o site do petshop, com foco em cores acolhedoras, contraste acessível e tipografia amigável.",
      "themeName": "Petshop",
      "color": {
        "text-primary-color-lighter": "#5a5a5a",
        "text-primary-color-lighter-hover": "#6b6b6b",
        "text-primary-color-lighter-focus": "#474747",
        "text-primary-color-lighter-disabled": "#8a8a8a",
        "text-primary-color": "#403f3f",
        "text-primary-color-hover": "#1C91CD",
        "text-primary-color-focus": "#FFB347",
        "text-primary-color-disabled": "#bdbdbd",
        "text-primary-color-darker": "#1C91CD",
        "text-primary-color-darker-hover": "#1573a1",
        "text-primary-color-darker-focus": "#0F6FA9",
        "text-primary-color-darker-disabled": "#a3c8e5",
        "text-secondary-color-lighter": "#FFB347",
        "text-secondary-color-lighter-hover": "#ffd18c",
        "text-secondary-color-lighter-focus": "#ffbe5c",
        "text-secondary-color-lighter-disabled": "#ffe2b3",
        "text-secondary-color": "#FFB347",
        "text-secondary-color-hover": "#ffbe5c",
        "text-secondary-color-focus": "#FFA500",
        "text-secondary-color-disabled": "#ffe2b3",
        "text-secondary-color-darker": "#FFA500",
        "text-secondary-color-darker-hover": "#e59400",
        "text-secondary-color-darker-focus": "#cc8400",
        "text-secondary-color-darker-disabled": "#ffd18c",
        "bg-primary-color-lighter": "#ffffff",
        "bg-primary-color-lighter-hover": "#f7fafc",
        "bg-primary-color-lighter-focus": "#f0f4f8",
        "bg-primary-color-lighter-disabled": "#eaeaea",
        "bg-primary-color": "#F9F9F9",
        "bg-primary-color-hover": "#f2f2f2",
        "bg-primary-color-focus": "#e6e6e6",
        "bg-primary-color-disabled": "#d9d9d9",
        "bg-primary-color-darker": "#E6E6E6",
        "bg-primary-color-darker-hover": "#d9d9d9",
        "bg-primary-color-darker-focus": "#cccccc",
        "bg-primary-color-darker-disabled": "#bfbfbf",
        "bg-secondary-color-lighter": "#E6F4FA",
        "bg-secondary-color-lighter-hover": "#d0eaf7",
        "bg-secondary-color-lighter-focus": "#b8e0f3",
        "bg-secondary-color-lighter-disabled": "#e0f7fa",
        "bg-secondary-color": "#D6EAF8",
        "bg-secondary-color-hover": "#b8e0f3",
        "bg-secondary-color-focus": "#a3c8e5",
        "bg-secondary-color-disabled": "#e0f7fa",
        "bg-secondary-color-darker": "#B8E0F3",
        "bg-secondary-color-darker-hover": "#a3c8e5",
        "bg-secondary-color-darker-focus": "#8ec0e0",
        "bg-secondary-color-darker-disabled": "#d0eaf7",
        "grey-color-lighter": "#F9F9F9",
        "grey-color-light": "#F2F2F2",
        "grey-color": "#E6E6E6",
        "grey-color-dark": "#D3D3D3",
        "grey-color-darker": "#C0C0C0",
        "error-color": "#FF4D4F",
        "error-color-hover": "#ff6666",
        "error-color-focus": "#e63e3e",
        "error-color-disabled": "#ff9999",
        "success-color": "#52C41A",
        "success-color-hover": "#66d93f",
        "success-color-focus": "#4ca610",
        "success-color-disabled": "#8cd78e",
        "warning-color": "#FAAD14",
        "warning-color-hover": "#fbbd34",
        "warning-color-focus": "#e09a0e",
        "warning-color-disabled": "#fdd55e",
        "info-color": "#1C91CD",
        "info-color-hover": "#2a9edb",
        "info-color-focus": "#1786b7",
        "info-color-disabled": "#55b4e1",
        "active-color": "#FFB347",
        "active-color-hover": "#ffd18c",
        "active-color-focus": "#ffbe5c",
        "active-color-disabled": "#ffe2b3",
        "link-color": "#1C91CD",
        "link-color-hover": "#1573a1",
        "link-color-focus": "#0F6FA9",
        "link-color-disabled": "#a3c8e5",
        "_dark-text-primary-color-lighter": "#FFFFFF",
        "_dark-text-primary-color-lighter-hover": "#f2f2f2",
        "_dark-text-primary-color-lighter-focus": "#e6e6e6",
        "_dark-text-primary-color-lighter-disabled": "#bdbdbd",
        "_dark-text-primary-color": "#e6edf3",
        "_dark-text-primary-color-hover": "#FFB347",
        "_dark-text-primary-color-focus": "#1C91CD",
        "_dark-text-primary-color-disabled": "#8a8a8a",
        "_dark-text-primary-color-darker": "#1C91CD",
        "_dark-text-primary-color-darker-hover": "#1573a1",
        "_dark-text-primary-color-darker-focus": "#0F6FA9",
        "_dark-text-primary-color-darker-disabled": "#a3c8e5",
        "_dark-text-secondary-color-lighter": "#FFB347",
        "_dark-text-secondary-color-lighter-hover": "#ffd18c",
        "_dark-text-secondary-color-lighter-focus": "#ffbe5c",
        "_dark-text-secondary-color-lighter-disabled": "#ffe2b3",
        "_dark-text-secondary-color": "#FFB347",
        "_dark-text-secondary-color-hover": "#ffbe5c",
        "_dark-text-secondary-color-focus": "#FFA500",
        "_dark-text-secondary-color-disabled": "#ffe2b3",
        "_dark-text-secondary-color-darker": "#FFA500",
        "_dark-text-secondary-color-darker-hover": "#e59400",
        "_dark-text-secondary-color-darker-focus": "#cc8400",
        "_dark-text-secondary-color-darker-disabled": "#ffd18c",
        "_dark-bg-primary-color-lighter": "#23272e",
        "_dark-bg-primary-color-lighter-hover": "#2c313a",
        "_dark-bg-primary-color-lighter-focus": "#353a42",
        "_dark-bg-primary-color-lighter-disabled": "#3e434c",
        "_dark-bg-primary-color": "#181c22",
        "_dark-bg-primary-color-hover": "#23272e",
        "_dark-bg-primary-color-focus": "#2c313a",
        "_dark-bg-primary-color-disabled": "#353a42",
        "_dark-bg-primary-color-darker": "#23272e",
        "_dark-bg-primary-color-darker-hover": "#2c313a",
        "_dark-bg-primary-color-darker-focus": "#353a42",
        "_dark-bg-primary-color-darker-disabled": "#3e434c",
        "_dark-bg-secondary-color-lighter": "#1C91CD",
        "_dark-bg-secondary-color-lighter-hover": "#1573a1",
        "_dark-bg-secondary-color-lighter-focus": "#0F6FA9",
        "_dark-bg-secondary-color-lighter-disabled": "#a3c8e5",
        "_dark-bg-secondary-color": "#1C91CD",
        "_dark-bg-secondary-color-hover": "#1573a1",
        "_dark-bg-secondary-color-focus": "#0F6FA9",
        "_dark-bg-secondary-color-disabled": "#a3c8e5",
        "_dark-bg-secondary-color-darker": "#FFB347",
        "_dark-bg-secondary-color-darker-hover": "#ffd18c",
        "_dark-bg-secondary-color-darker-focus": "#ffbe5c",
        "_dark-bg-secondary-color-darker-disabled": "#ffe2b3",
        "_dark-grey-color-lighter": "#23272e",
        "_dark-grey-color-light": "#2c313a",
        "_dark-grey-color": "#353a42",
        "_dark-grey-color-dark": "#3e434c",
        "_dark-grey-color-darker": "#4a4f59",
        "_dark-error-color": "#f9676a",
        "_dark-error-color-hover": "#ff7b7f",
        "_dark-error-color-focus": "#e5565e",
        "_dark-error-color-disabled": "#ff9b9e",
        "_dark-success-color": "#63d42b",
        "_dark-success-color-hover": "#75d93d",
        "_dark-success-color-focus": "#55b825",
        "_dark-success-color-disabled": "#8ade5f",
        "_dark-warning-color": "#eead2b",
        "_dark-warning-color-hover": "#f2b73d",
        "_dark-warning-color-focus": "#d69c1f",
        "_dark-warning-color-disabled": "#f5cd5c",
        "_dark-info-color": "#1C91CD",
        "_dark-info-color-hover": "#1573a1",
        "_dark-info-color-focus": "#0F6FA9",
        "_dark-info-color-disabled": "#a3c8e5",
        "_dark-active-color": "#FFB347",
        "_dark-active-color-hover": "#ffd18c",
        "_dark-active-color-focus": "#ffbe5c",
        "_dark-active-color-disabled": "#ffe2b3",
        "_dark-link-color": "#1C91CD",
        "_dark-link-color-hover": "#1573a1",
        "_dark-link-color-focus": "#0F6FA9",
        "_dark-link-color-disabled": "#a3c8e5"
      },
      "global": {
        "breakpoint-small": "544px",
        "breakpoint-medium": "768px",
        "breakpoint-large": "1012px",
        "transition-slow": "0.2s",
        "transition-normal": "0.3s",
        "transition-fast": "0.5s",
        "space-base-unit": "0.25rem",
        "space-8": "calc(@space-base-unit * 2)",
        "space-16": "calc(@space-base-unit * 4)",
        "space-24": "calc(@space-base-unit * 6)",
        "space-32": "calc(@space-base-unit * 8)",
        "space-40": "calc(@space-base-unit * 10)",
        "space-48": "calc(@space-base-unit * 12)",
        "space-64": "calc(@space-base-unit * 16)"
      },
      "typography": {
        "font-base-unit": ".25rem",
        "font-family-primary": "'Quicksand', 'Charlie Display', Arial, sans-serif",
        "font-family-secondary": "serif",
        "font-size-12": "calc(@font-base-unit * 3)",
        "font-size-16": "calc(@font-base-unit * 4)",
        "font-size-20": "calc(@font-base-unit * 5)",
        "font-size-24": "calc(@font-base-unit * 6)",
        "font-size-40": "calc(@font-base-unit * 10)",
        "font-size-48": "calc(@font-base-unit * 12)",
        "font-size-64": "calc(@font-base-unit * 16)",
        "line-height-base-unit": "1.2",
        "line-height-small": "1.3",
        "line-height-medium": "1.5",
        "line-height-large": "1.7",
        "font-weight-lighter": "200",
        "font-weight-light": "300",
        "font-weight-normal": "400",
        "font-weight-bold": "700",
        "font-weight-bolder": "900"
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







