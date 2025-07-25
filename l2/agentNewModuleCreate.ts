/// <mls shortName="agentNewModuleCreate" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';
import { PayLoad3, getPayload3, PageDefinition } from './_100554_agentNewModule3';
import { getTask } from './_100554_msgDBController';
import { formatHtml } from './_100554_collabDOMSync';
import { convertFileNameToTag, convertTagToFileName } from './_100554_utilsLit';
import { createNewFile } from "./_100554_pluginNewFileBase";
@customElement('agent-new-module-create-100554')
export class AgentNewModuleCreate100554 extends StateLitElement {

    static properties = {
        type: { type: String },
        index: { type: Number },
        result: { type: String },
        groupToDelete: { type: String },
        loading: { type: Boolean }
    };


    type = "table";
    index = 0;
    groupToDelete = '';
    taskId = "task#1751381101588";  //"task#1750787911355"
    result = "";
    project = 100554;
    folder = "";
    loading = false;


    render() {

        if (this.loading) {
            return html`executing...`
        }
        return html`
      <div>

        <fieldset>
            <label>TaskId:</label>
            <input type="string" .value=${this.taskId} @input=${(e: Event) => this.taskId = (e.target as HTMLInputElement).value} />
            <label>Type:</label>
            <select @change=${(e: Event) => this.type = (e.target as HTMLSelectElement).value}>
            <option value="table">table</option>
            <option value="plugin">plugin</option>
            <option value="organism">organism</option>
            <option value="page">page</option>
            </select>

            <label>Index:</label>
            <input type="number" .value=${this.index} @input=${(e: Event) => this.index = Number((e.target as HTMLInputElement).value)} />
            <div>
                <button @click=${this.generate}>Gerar .defs</button>
                <button @click=${this.generateHTML}>Gerar .html</button>
                <button @click=${this.generateTS}>Gerar .ts</button>
                <button @click=${this.generatePage}>Criar Página</button>
                <button @click=${this.generateOrganism}>Criar Organismo</button>
                <button @click=${this.generateTable}>Criar Tabela</button>    
            </div>
        </fieldset>
        <fieldset>
                <button @click=${this.generateAllPage}>Criar todas as páginas</button>
                <button @click=${this.generateAllOrganism}>Criar todos os organismos</button>
                <button @click=${this.generateAllTables}>Criar todas as tabelas</button>
        </fieldset>
        <fieldset>
            <div>
                <label>GroupName:</label>
                <input @input=${(e: Event) => this.groupToDelete = String((e.target as HTMLInputElement).value)} />
                <button @click=${this.deletePages}>Deletar</button>
            </div>
        </fieldset>
      </div>

      <pre><code>${this.result}</code></pre>
    `;
    }

    async getPayload() {
        const task = await getTask(this.taskId);
        if (!task) return `// invalid taskid selected`;
        const context: mls.msg.ExecutionContext = {
            message: {
                threadId: "",
                orderAt: "",
                createAt: "",
                senderId: "",
                content: "",
            },
            task,
            modeSingleStep: true,
        }
        const payload3 = getPayload3(context);
        return payload3;
    }

    async deletePages() {
        this.result = '';
        if (!this.groupToDelete) return this.result = 'Digite um grupo para deletar';
        const files = await getListFilesToDelete(this.groupToDelete, this.project, this.folder);
        for await (const log of deleteAllFiles(files)) {
            this.result = this.result + '\n' + log;
        }
    }

    async generate() {
        const payload3 = await this.getPayload();
        if (typeof payload3 === 'string') return this.result = payload3;
        this.result = generateDefs(this.type, payload3, this.project, this.folder, this.index);
    }

    async generateHTML() {
        const payload3 = await this.getPayload();
        if (typeof payload3 === 'string') return this.result = payload3;
        this.result = generateHTML(this.type, payload3, this.project, this.folder, this.index);
    }

    async generateTS() {
        const payload3 = await this.getPayload();
        if (typeof payload3 === 'string') return this.result = payload3;
        this.result = generateTs(this.type, payload3, this.project, this.folder, this.index);
    }

    async generatePage() {
        this.loading = true;
        try {
            const payload3 = await this.getPayload();
            if (typeof payload3 === 'string') return this.result = payload3;
            this.result = await generatePage(payload3, this.project, this.folder, this.index);
        } finally {
            this.loading = false;
        }
    }

    async generateOrganism() {
        this.loading = true;
        try {
            const payload3 = await this.getPayload();
            if (typeof payload3 === 'string') return this.result = payload3;
            this.result = await generateOrganism(payload3, this.project, this.folder, this.index)
        } finally {
            this.loading = false;
        }
    }

    async generateTable() {
        this.loading = true;
        try {
            const payload3 = await this.getPayload();
            if (typeof payload3 === 'string') return this.result = payload3;
            this.result = await generateTable(payload3, this.project, this.folder, this.index)
        } finally {
            this.loading = false;
        }
    }

    async generateAllPage() {
        this.loading = true;
        try {
            const payload3 = await this.getPayload();
            if (typeof payload3 === 'string') return this.result = payload3;
            this.result = await generateAllPages(payload3, this.project, this.folder);
        } finally {
            this.loading = false;
        }
    }

    async generateAllOrganism() {
        this.loading = true;
        try {
            const payload3 = await this.getPayload();
            if (typeof payload3 === 'string') return this.result = payload3;
            this.result = await generateAllOrganism(payload3, this.project, this.folder);
        } finally {
            this.loading = false;
        }
    }

    async generateAllTables() {
        this.loading = true;
        try {
            const payload3 = await this.getPayload();
            if (typeof payload3 === 'string') return this.result = payload3;
            this.result = await generateAllTables(payload3, this.project, this.folder);
        } finally {
            this.loading = false;
        }
    }
}

function generateDefs(fileType: string, payload3: PayLoad3, project: number, folder: string, index: number): string {
    try {
        switch (fileType) {
            case "table":
                return generateTableDefsFromLLM(payload3, index, project, folder);
            case "plugin":
                return generatePluginDefsFromLLM(payload3, index, project, folder);
            case "organism":
                return generateOrganismDefsFromLLM(payload3, index, project, folder);
            case "page":
                return generatePageDefsFromLLM(payload3, index, project, folder);
            default:
                return "// Invalid type selected.";
        }
    } catch (err: any) {
        return `// Error: ${err.message}`;
    }
}


function generateTs(fileType: string, payload3: PayLoad3, project: number, folder: string, index: number): string {
    try {
        switch (fileType) {
            case "table":
                return generateTsTable(payload3, project, folder, index);
            case "plugin":
                return ''
            case "organism":
                return generateTsOrganism(payload3, project, folder, index);
            case "page":
                return generateTsPage(payload3, project, folder, index);
            default:
                return "// Invalid type selected.";
        }

    } catch (err: any) {
        return `// Error: ${err.message}`;
    }
}

function generateHTML(fileType: string, payload3: PayLoad3, project: number, folder: string, index: number) {
    try {

        switch (fileType) {
            case "table":
                return ''
            case "plugin":
                return ''
            case "organism":
                return generateHtmlOrganism(payload3, project, folder, index);
            case "page":
                return generateHtmlPage(payload3, project, folder, index);
            default:
                return "// Invalid type selected.";
        }

    } catch (err: any) {
        return `// Error: ${err.message}`;
    }
}


export async function generateAllPages(payload3: PayLoad3, project: number, folder: string): Promise<string> {

    const logs: string[] = [];
    for (let i = 0; i < payload3.pagesWireframe.length; i++) {
        try {
            const response = await generatePage(payload3, project, folder, i);
            logs.push(response);
        } catch (err: any) {
            logs.push(`// Error: ${err.message}`)
        }
    }

    return logs.join('\n');

}

export async function generateAllOrganism(payload3: PayLoad3, project: number, folder: string): Promise<string> {

    const logs: string[] = [];
    for (let i = 0; i < payload3.organism.length; i++) {
        try {
            const response = await generateOrganism(payload3, project, folder, i);
            logs.push(response);
        } catch (err: any) {
            logs.push(`// Error: ${err.message}`)
        }
    }

    return logs.join('\n');

}

export async function generateAllTables(payload3: PayLoad3, project: number, folder: string): Promise<string> {

    const logs: string[] = [];
    for (let i = 0; i < payload3.hierarchicalPersistentData.length; i++) {
        try {
            const response = await generateTable(payload3, project, folder, i);
            logs.push(response);
        } catch (err: any) {
            logs.push(`// Error: ${err.message}`)
        }
    }

    return logs.join('\n');

}

async function generatePage(payload3: PayLoad3, project: number, folder: string, index: number): Promise<string> {
    try {
        const ts = generateTs('page', payload3, project, folder, index);
        const html = generateHTML('page', payload3, project, folder, index);
        const defs = generateDefs('page', payload3, project, folder, index);

        const pageWirefame = payload3.pagesWireframe[index];
        const shortName = pageWirefame.pageName;
        const enhancement = '_100554_enhancementLit';

        await createNewFile(
            { project, position: 'right', shortName, enhancement, sourceTS: ts.trim(), sourceHTML: html, sourceLess: '', sourceDefs: defs, openPreview: false }
        );

        return `page created: ${shortName}`

    } catch (err: any) {
        return `// Error: ${err.message}`;
    }
}

async function generateOrganism(payload3: PayLoad3, project: number, folder: string, index: number): Promise<string> {
    try {
        const ts = generateTs('organism', payload3, project, folder, index);
        const html = generateHTML('organism', payload3, project, folder, index);
        const defs = generateDefs('organism', payload3, project, folder, index);

        const organism = payload3.organism[index];
        const shortTagName = organism.organismTag;
        const fullName = convertTagToFileName(`${shortTagName}-${project}`);
        const { shortName } = mls.l2.getPath(fullName)
        const enhancement = '_100554_enhancementLit';

        await createNewFile(
            { project, position: 'right', shortName, enhancement, sourceTS: ts.trim(), sourceHTML: html, sourceDefs: defs, openPreview: false }
        );

        return `organism created: ${fullName}`

    } catch (err: any) {
        return `// Error: ${err.message}`;
    }
}

async function generateTable(payload3: PayLoad3, project: number, folder: string, index: number): Promise<string> {
    try {
        const ts = generateTs('table', payload3, project, folder, index);
        const defs = generateDefs('table', payload3, project, folder, index);

        const entity = payload3.hierarchicalPersistentData[index];
        const shortNameAux = sanitizeMeta(entity.entityName.toLowerCase(), project, folder);
        const aux = prepareNameTable(shortNameAux);
        const fullName = convertTagToFileName(`${aux}-${project}`);
        const { shortName } = mls.l2.getPath(fullName)
        const enhancement = '_100554_enhancementLit';


        await createNewFile(
            { project, position: 'right', shortName, enhancement, sourceTS: ts.trim(), sourceHTML: '', sourceLess: '', sourceDefs: defs, openPreview: false }
        );

        return `table created: ${fullName}`

    } catch (err: any) {
        return `// Error: ${err.message}`;
    }
}


function generateTsTable(payload: PayLoad3, project: number, folder: string, index: number): string {
    try {
        const entity = payload.hierarchicalPersistentData[index];
        const flatData = payload.flatPersistentData[0].prima[index];
        console.info({ entity, flatData });
        console.info(payload);

        const shortNameAux = sanitizeMeta(entity.entityName.toLowerCase(), project, folder);
        const aux = prepareNameTable(shortNameAux);
        const fullName = convertTagToFileName(`${aux}-${project}`);
        const { shortName } = mls.l2.getPath(fullName)
        const enhancement = '_100554_enhancementLit';
        const tagName = `${shortNameAux}-${project}`;
        const groupName = payload.finalModuleDetails.moduleName;

        const interfaceBlock = entity.entityDefinitions.length
            ? `${entity.entityDefinitions.join("\n")}`
            : "";


        const formattedInterfaces = interfaceBlock
            .split('\n')
            .map(line => line.trim().startsWith('export interface') ? formatInterface(line.trim()) : line)
            .join('\n');




        const ts = `
/// <mls shortName="${shortName}" project="${project}" enhancement="${enhancement}" groupName="${groupName}" />

${formattedInterfaces}

export const modelPrisma = \`
${formatPrismaModel(flatData)}
\`;

`;
        return ts;

    } catch (err: any) {
        return `// Error: ${err.message}`;
    }
}

function formatPrismaModel(modelStr: string) {

    const match = modelStr.match(/model\s+(\w+)\s*{(.*)}/s);
    if (!match) return modelStr;

    const modelName = match[1];
    const fieldsBlock = match[2].trim();
    if (!fieldsBlock) return modelStr;


    const formattedFields = fieldsBlock
        .match(/[^@{}\n]+(?:@[^\s{}]+(?:\([^\)]*\))?\s*)*/g) 
        ?.map(field => field.trim())
        .filter(Boolean)
        .join('\n  ');
    // Retorna o model formatado
    return `model ${modelName} {\n  ${formattedFields}\n}`;
}

function generateTsOrganism(payload: PayLoad3, project: number, folder: string, index: number): string {
    try {
        const organism = payload.organism[index];
        const tagName = organism.organismTag;
        const fullName = convertTagToFileName(`${tagName}-${project}`);
        const { shortName } = mls.l2.getPath(fullName)
        const enhancement = '_100554_enhancementLit';
        const groupName = payload.finalModuleDetails.moduleName;
        const fileName = `_${project}_${shortName}`

        const ts = `
/// <mls shortName="${shortName}" project="${project}" enhancement="${enhancement}" groupName="${groupName}" />

import { customElement } from 'lit/decorators.js';
import { IcaOrganismWireframeBase } from './_100554_icaOrganismWireframeBase';

@customElement('${tagName}-${project}')
export class ${fileName} extends IcaOrganismWireframeBase {
    
    generalDescription: string | undefined = '${organism.planning.context}';
    goal: string | undefined = '${organism.planning.goal}';

}`;
        return ts;

    } catch (err: any) {
        return `// Error: ${err.message}`;
    }
}

function generateHtmlOrganism(payload: PayLoad3, project: number, folder: string, index: number): string {
    try {
        const organism = payload.organism[index];
        const shortTagName = organism.organismTag;
        const tagName = `${shortTagName}-${project}`;
        const htmlResult = `<${tagName}></${tagName}>`;
        return htmlResult;

    } catch (err: any) {
        return `// Error: ${err.message}`;
    }
}

function generateTsPage(payload: PayLoad3, project: number, folder: string, index: number): string {

    const pageWirefame = payload.pagesWireframe[index];
    const shortName = pageWirefame.pageName;
    const enhancement = '_100554_enhancementLit';
    const groupName = payload.finalModuleDetails.moduleName;
    const fileName = `_${project}_${shortName}`
    const tagName = convertFileNameToTag(fileName);

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

function generateHtmlPage(payload: PayLoad3, project: number, folder: string, index: number): string {
    const pageWirefame = payload.pagesWireframe[index];
    const shortName = pageWirefame.pageName;
    const fileName = `_${project}_${shortName}`
    const pagetagName = convertFileNameToTag(fileName);

    const suffix = `-${project}`;

    const updatedTags = pageWirefame.pageHtml.map(tag => {
        return tag.replace(/<\/?([a-z0-9\-]+)(\s[^>]*)?>/gi, (match, tagName, attrs = '') => {
            // Só adiciona sufixo se for web component (tem hífen no nome da tag)
            if (tagName.includes('-')) {
                const newTagName = tagName + suffix;
                return match.startsWith('</')
                    ? `</${newTagName}>`
                    : `<${newTagName}${attrs}>`;
            }
            return match;
        });
    });
    const htmlFinal = `<${pagetagName}>\n${formatHtml(updatedTags.join('\n'))}\n</${pagetagName}>`
    return formatHtml(htmlFinal);
}


export async function getListFilesToDelete(group: string, project: number, folder: string) {

    const filesToDelete: mls.stor.IFileInfo[] = [];

    const filesLocal = Object.values(mls.stor.files).filter(file =>
        file.inLocalStorage &&
        file.folder === folder &&
        file.project === project &&
        file.status === 'new'
    );

    for await (let storFile of filesLocal) {
        const keyModel = mls.l2.getKey(storFile);
        let models: mls.editor.IModels | undefined = mls.editor.models[keyModel];
        if (!models) models = await mls.editor.addModels(storFile.project, storFile.shortName, '')
        if (models && models.ts) {
            mls.l2.typescript.parseTripleSlash(models.ts);
            const tpsGroup = models.ts.compilerResults?.tripleSlashMLS?.variables['groupName']
            if (group === tpsGroup) filesToDelete.push(storFile);
        }
    }

    return filesToDelete;
}

export async function* deleteAllFiles(filesToDelete: mls.stor.IFileInfo[]) {
    const modelsToDelete: { project: number, shortName: string, folder:string }[] = Array.from(
        new Map(filesToDelete.map(({ project, shortName, folder }) => [shortName, { project, shortName, folder }])).values()
    );

    const filesToDeleteCache: Set<string> = new Set();

    for (const fileToDelete of filesToDelete) {
        await mls.stor.localStor.setContent(fileToDelete, { contentType: 'string', content: null });
        fileToDelete.onAction = undefined;
        fileToDelete.getValueInfo = undefined;

        const keyFiles = mls.stor.getKeyToFiles(
            fileToDelete.project,
            fileToDelete.level,
            fileToDelete.shortName,
            fileToDelete.folder,
            fileToDelete.extension
        );
        delete mls.stor.files[keyFiles];

        yield `Storfile deleted: ${keyFiles}`;

        const ext = fileToDelete.extension.replace('.ts', '.js');
        const targetKey = `https://collab.codes/local/_${fileToDelete.project}_${fileToDelete.shortName}${ext}?v=`;
        filesToDeleteCache.add(targetKey);
    }

    for (const data of modelsToDelete) {
        const keyModel = mls.l2.getKey(data);
        mls.editor.deleteModels(data.project, data.shortName, true);
        yield `Model deleted : ${keyModel}`;
    }

    const cacheName = 'mls-v2';
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    for (const request of keys) {
        for (const targetKey of filesToDeleteCache) {
            if (request.url.includes(targetKey)) {
                await cache.delete(request);
                yield `Cache file deleted: ${request.url}`;
            }
        }
    }
}

//
// ------
//


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

function extractTablesFromDataNeeds(dataNeeds: string[]): string[] {
    const tables = new Set<string>();

    for (const entry of dataNeeds) {
        const parts = entry.split(':')[0].split(',').map(p => p.trim());
        for (const item of parts) {
            const base = item.split('.')[0].trim();
            if (base && base.toLowerCase() !== "pages" && base.toLowerCase() !== "business") {
                tables.add(`table${capitalizeFirstLetter(base)}`);
            }
        }
    }

    return Array.from(tables);
}

function capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function generateOrganismDefsFromLLM(payload: PayLoad3, index: number, project: number, folder: string): string {
    const organism = payload.organism[index];

    let shortName1 = sanitizeMeta(organism.organismTag, project, folder);
    const fileName = convertTagToFileName(`${shortName1}-${project}`);
    const { shortName } = mls.l2.getPath(fileName);

    const tableImports = extractTablesFromDataNeeds(organism.organismDataNeeds);

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
            plugins: undefined, // organism.organismPlugins,
            statesRO: [],
            statesRW: [],
            statesWO: [],
            imports: tableImports
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

function generatePluginDefsFromLLM(payload: PayLoad3, index: number, project: number, folder: string): string {
    const plugin = payload.plugins[index];
    const shortName = sanitizeMeta(plugin.pluginName, project, folder);

    const defs: mls.l4.BaseDefs = {
        meta: {
            projectId: project,
            folder,
            shortName,
            type: "plugin",
            group: payload.finalModuleDetails.moduleName,
            tags: ["plugin"]
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
            generalDescription: "",
            goal: plugin.pluginGoal,
            userStories: [
                {
                    story: `Como sistema, quero integrar o plugin ${plugin.pluginName} para ${plugin.pluginGoal.toLowerCase()}`,
                    derivedRequirements: plugin.pluginRequirements.map(req => ({ description: req }))
                }
            ],
            userRequestsEnhancements: [],
            constraints: []
        }
    };

    return `/// <mls shortName="${shortName}" project="${project}" enhancement="_blank" />\n\n` +
        `// Do not change – automatically generated code.\n\n` +
        `export const defs: mls.l4.BaseDefs = ${JSON.stringify(defs, null, 2)}\n`;
}


function extractOrganismTagsFromHtml(pageHtml: string[]): string[] {
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
    return Array.from(tags);
}

function generatePageDefsFromLLM(payload: PayLoad3, index: number, project: number, folder: string): string {
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
            widgets: undefined, // widgets is not organism
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

    return `/// <mls shortName="${shortName}" project="${project}" enhancement="_blank" />\n\n` +
        `// Do not change – automatically generated code.\n\n` +
        `export const defs: mls.l4.BaseDefs = ${JSON.stringify(defs, null, 2)}\n`;
}

function prepareNameTable(shortNameAux: string) {
    const prefix = "table";
    const shortName = shortNameAux.replace(new RegExp(`^(${prefix})(.)`), (_, p1, p2) => {
        return p1 + p2.toUpperCase();
    });
    return shortName;

}

function generateTableDefsFromLLM(payload: PayLoad3, index: number, project: number, folder: string): string {
    const entity = payload.hierarchicalPersistentData[index];
    const shortNameAux = sanitizeMeta(entity.entityName.toLowerCase(), project, folder);
    const shortName = prepareNameTable(shortNameAux);
    const defs: mls.l4.BaseDefs = {
        meta: {
            projectId: project,
            folder,
            shortName,
            type: "table",
            group: payload.finalModuleDetails.moduleName,
            tags: ["data", "table"]
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
            generalDescription: `Tabela de dados representando a entidade ${entity.entityName}.`,
            goal: `Armazenar informações da entidade ${entity.entityName} de forma estruturada.`,
            userStories: [
                {
                    story: `Como sistema, quero gerenciar dados da entidade ${entity.entityName} para uso no frontend e backend.`,
                    derivedRequirements: []
                }
            ],
            userRequestsEnhancements: [],
            constraints: []
        }
    };

    const interfaceBlock = entity.entityDefinitions.length
        ? `// <interfaces>\n${entity.entityDefinitions.join("\n")}\n// </interfaces>\n\n`
        : "";

    return `/// <mls shortName="${shortName}" project="${project}" enhancement="_blank" />\n\n` +
        `// Do not change – automatically generated code.\n\n` +
        `export const defs: mls.l4.BaseDefs = ${JSON.stringify(defs, null, 2)}\n\n\n` + interfaceBlock
        ;
}

function formatInterface(line: string) {
    const match = line.match(/^export interface (\w+)\s*\{(.*)\}$/);
    if (!match) return line;

    const [, name, body] = match;
    const properties = body.split(';').map(p => p.trim()).filter(Boolean);
    const formattedProps = properties.map(p => `  ${p};`).join('\n');

    return `export interface ${name} {\n${formattedProps}\n}`;
}

