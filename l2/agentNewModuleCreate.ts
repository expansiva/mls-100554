/// <mls shortName="agentNewModuleCreate" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from './_100554_stateLitElement';
import { PayLoad3, getPayload3 } from './_100554_agentNewModule3';
import { getTask } from './_100554_msgDBController';

@customElement('agent-new-module-create-100554')
export class AgentNewModuleCreate100554 extends StateLitElement {
    static properties = {
        type: { type: String },
        index: { type: Number },
        result: { type: String }
    };


    type = "table";
    index = 0;
    taskId = "task#1750787911355";
    result = "";
    project = 100554;
    folder = "";

    render() {
        return html`
      <div>
        <label>TaskId:</label>
        <input type="string" .value=${this.taskId} @input=${(e: Event) => this.taskId =(e.target as HTMLInputElement).value} />
        <label>Type:</label>
        <select @change=${(e: Event) => this.type = (e.target as HTMLSelectElement).value}>
          <option value="table">table</option>
          <option value="plugin">plugin</option>
          <option value="organism">organism</option>
          <option value="page">page</option>
        </select>

        <label>Index:</label>
        <input type="number" .value=${this.index} @input=${(e: Event) => this.index = Number((e.target as HTMLInputElement).value)} />

        <button @click=${this.generate}>Generate .defs</button>
      </div>

      <pre><code>${this.result}</code></pre>
    `;
    }

    async generate() {
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
        this.result = generate(this.type, payload3, this.project, this.folder, this.index)

    }
}

function generate(fileType: string, payload3: PayLoad3, project: number, folder: string, index: number): string {
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
    const shortName = sanitizeMeta(organism.organismTag, project, folder);

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
            plugins: organism.organismPlugins,
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

    return `/// <mls shortName="${shortName}" project="${project}" enhancement="_blank" />\n\n` +
        `// Do not change – automatically generated code.\n\n` +
        `export const defs: mls.l4.BaseDefs = ${JSON.stringify(defs, null, 2)}\n`;
}

function generateTableDefsFromLLM(payload: PayLoad3, index: number, project: number, folder: string): string {
    const entity = payload.hierarchicalPersistentData[index];
    const shortName = sanitizeMeta(entity.entityName.toLowerCase(), project, folder);

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
