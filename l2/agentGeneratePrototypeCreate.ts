/// <mls shortName="agentGeneratePrototypeCreate" project="100554" enhancement="_100554_enhancementLit" />

import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';
import { PayLoad3, getPayload3, PageDefinition } from './_100554_agentGeneratePrototype3';
import { PayLoadPrototypeOrganism, getPayload as getPayloadOrganism } from './_100554_agentGeneratePrototypeOrganism';
import { updateTokensTheme } from './_100554_designSystemBase';
import { addMessage } from './_100554_collabMessageHelper';
import { getTask } from './_100554_msgDBController';
import { formatHtml } from './_100554_collabDOMSync';
import { convertFileNameToTag, convertTagToFileName } from './_100554_utilsLit';
import { createNewFile } from "./_100554_pluginNewFileBase";
import { deleteAllFiles, getListNewFilesToDeleteByGroup } from './_100554_libCommom';
import { getImages } from './_100554_libUnsplash';

@customElement('agent-generate-prototype-create-100554')
export class agentGeneratePrototypeCreate extends StateLitElement {

    static properties = {
        type: { type: String },
        index: { type: Number },
        result: { type: String },
        groupToDelete: { type: String },
        loading: { type: Boolean }
    };


    type = "page";
    index = 0;
    groupToDelete = '';
    taskId = "task#1752689318274";
    taskIdOrganism = "task#1752669827417"
    result = "";
    project = 102010;
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
            <select 
            .value=${this.type} 
            @change=${(e: Event) => this.type = (e.target as HTMLSelectElement).value}>
            <option value="organism">organism</option>
            <option value="page">page</option>
            </select>

            <label>Index:</label>
            <input type="number" .value=${this.index} @input=${(e: Event) => this.index = Number((e.target as HTMLInputElement).value)} />
            <div>
                <button @click=${this.generate}>Preview .defs</button>
                <button @click=${this.generateHTML}>Preview .html</button>
                <button @click=${this.generateTS}>Preview .ts</button>
                <br>
                <button @click=${this.generatePage}>Build Page</button>
                <button @click=${this.generateOrganism}>Build Organism</button>
                <br>
                <button @click=${this.generateAllPage}>Build all Pages</button>
                <button @click=${this.generateAllOrganism}>Build all Organisms</button>
                <br>
                <button @click=${this.generateAllOrganism}>Build Page Complete(Page/Organism)</button>

                <hr>
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

    async getPayloadOrganism() {

        const task = await getTask(this.taskIdOrganism);
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
        const payload3 = getPayloadOrganism(context);
        return payload3;
    }

    async deletePages() {
        this.result = '';
        if (!this.groupToDelete) return this.result = 'Digite um grupo para deletar';
        const files = await getListNewFilesToDeleteByGroup(this.groupToDelete, this.project, this.folder);
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

}

function generateDefs(fileType: string, payload3: PayLoad3, project: number, folder: string, index: number): string {
    try {
        switch (fileType) {
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
        const enhancement = '_100554_enhancementLit';
        const { shortName } = fullName || {};
        if (!shortName) throw new Error('[generateOrganism] Not found shortName')

        await createNewFile(
            { project, position: 'right', shortName, enhancement, sourceTS: ts.trim(), sourceHTML: html, sourceDefs: defs, openPreview: false }
        );

        return `organism created: ${fullName}`

    } catch (err: any) {
        return `// Error: ${err.message}`;
    }
}

function generateTsOrganism(payload: PayLoad3, project: number, folder: string, index: number): string {
    try {
        const organism = payload.organism[index];
        const tagName = organism.organismTag;
        const fullName = convertTagToFileName(`${tagName}-${project}`);
        const { shortName } = fullName || {};
        if (!shortName) throw new Error('[generateTsOrganism] Not found shortName')
        const enhancement = '_100554_enhancementLit';
        const groupName = payload.finalModuleDetails.moduleName;
        const fileName = `_${project}_${shortName}`

        const ts = `
/// <mls shortName="${shortName}" project="${project}" enhancement="${enhancement}" groupName="${groupName}" />

import { customElement } from 'lit/decorators.js';
import { IcaOrganism } from './_100554_icaOrganism';

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
    const tagName = convertFileNameToTag({ shortName, project, folder });

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
    const pagetagName = convertFileNameToTag({ shortName, folder, project });

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

function generateOrganismDefsFromLLM(payload: PayLoad3, index: number, project: number, folder: string): string {
    const organism = payload.organism[index];

    let shortName1 = sanitizeMeta(organism.organismTag, project, folder);
    const fileName = convertTagToFileName(`${shortName1}-${project}`);
    const { shortName } = fileName || {};
    if (!shortName) throw new Error('[generateOrganismDefsFromLLM] Not found shortName')

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
    // const widgets = wireframe ? extractOrganismTagsFromHtml(wireframe.pageHtml) : [];

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
            widgets: undefined,
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





export async function generateOrganismPrototype(payload3: PayLoad3, payLoadPrototypeOrganism: PayLoadPrototypeOrganism, project: number, indexOrganism: number): Promise<string> {

    try {

        console.info({ payload3, payLoadPrototypeOrganism })

        const ts = await generateTsOrganismPrototype(payload3, payLoadPrototypeOrganism.images, payLoadPrototypeOrganism.ts, project, indexOrganism);
        const html = payLoadPrototypeOrganism.html;
        const less = generateLessOrganismPrototype(payload3, payLoadPrototypeOrganism.less, project, indexOrganism);

        const organism = payload3.organism[indexOrganism];
        const shortTagName = organism.organismTag;
        const fullName = convertTagToFileName(`${shortTagName}-${project}`);
        const { shortName } = fullName || {};
        if (!shortName) throw new Error('[generateOrganismDefsFromLLM] Not found shortName')
        const enhancement = '_100554_enhancementLit';

        await createNewFile(
            { project, position: 'right', shortName, enhancement, sourceTS: ts.trim(), sourceHTML: html, sourceDefs: '', sourceLess: less, openPreview: false }
        );

        return `organism created: ${fullName}`

    } catch (err: any) {
        return `// Error: ${err.message}`;
    }
}


async function generateTsOrganismPrototype(
    payload: PayLoad3,
    images: Record<string, string>,
    source: string,
    project: number,
    indexOrganism: number
) {
    try {
        const organism = payload.organism[indexOrganism];
        const tagName = organism.organismTag;
        const fullName = convertTagToFileName(`${tagName}-${project}`);
        const { shortName } = fullName || {};
        if (!shortName) throw new Error('[generateTsOrganismPrototype] Not found shortName')
        const enhancement = '_100554_enhancementLit';
        const groupName = payload.finalModuleDetails.moduleName;

        await updateTokensTheme(project, 'Default', payload.tokens);
        const resolvedImages = await getAllImages(images);

        let finalSource = source;
        for (const [key, url] of Object.entries(resolvedImages)) {
            const pattern = new RegExp(`\\[${key}\\]`, 'g');
            finalSource = finalSource.replace(pattern, url);
        }

        const ts = `
/// <mls shortName="${shortName}" project="${project}" enhancement="${enhancement}" groupName="${groupName}" />

${finalSource}
`;

        return ts;
    } catch (err: any) {
        return `// Error: ${err.message}`;
    }
}

function generateLessOrganismPrototype(payload: PayLoad3, source: string, project: number, indexOrganism: number): string {

    return `${source}

`
}

async function getAllImages(
    imageMap: Record<string, string>
): Promise<Record<string, string>> {
    const resolved: Record<string, string> = {};

    for (const [key, query] of Object.entries(imageMap)) {
        try {
            const result = await getImages(query, 1, 1);
            if (result.images && result.images.length > 0) {
                const image = result.images[0];
                resolved[key] = image.urls.regular;
            } else {
                resolved[key] = `https://source.unsplash.com/800x600/?${encodeURIComponent(query)}`;
            }
        } catch (err) {
            console.warn(`Failed to get image for "${query}":`, err);
            resolved[key] = `https://source.unsplash.com/800x600/?${encodeURIComponent(query)}`;
        }
    }

    return resolved;
}


