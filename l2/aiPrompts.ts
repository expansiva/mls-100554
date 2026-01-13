/// <mls shortName="aiPrompts" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { ITool, IAgent } from '/_100554_/l2/aiAgentBase.js'
import { descriptionForPrompt } from '/_100554_/l2/icaBaseDescription.js'
import { getTokensLess } from '/_100554_/l2/designSystemBase.js';
import { getState, setState } from '/_100554_/l2/collabState.js';

export function systemAgentsAvailable(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## Agentes disponíveis:\n${getAgentsList()}`
    };
}

export function systemRagsAvailable(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## RAGs disponíveis:\n${getRagsList()}`
    };
}

export function addRAGAdditionalInformation(rags: string[] | null, prompts: mls.msg.IAMessageInputType[]): void {
    if (!rags || rags.length === 0) return;

    prompts.push({
        type: 'system',
        content: `## Informações complementares:\n${rags.join('\n')}`
    });
}

export function systemReturnJsonFormat(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `
Você deve retornar um array de objetos no formato JSON. Cada objeto representa uma subtarefa, com **apenas um dos seguintes formatos**:
\`\`\` json
[
  {
    "type": "agent",
    "agentName": string,
    "title": string,
    "prompt": string,
    "rags": string[] | null
  },
  {
    "type": "tool",
    "toolName": string,
    "title": string,
    "args": string
  },
  {
    "type": "clarification",
    "clarificationMessage": string,
    "htmlForm?": string
  },
  {
    "type": "result",
    "result": string
  }
]
\`\`\`
`
    };
}


function getAgentsList(): string {

    const listAgents = [
        { agent: 'agentGeneratePrototype', description: 'planejamento para a criação de novos projetos, sites ou criação de uma nova página' },
        { agent: 'agentNewWidget', description: 'criação de novos componentes UI, web components, widgets, estes widgets podem futuramente serem incluidos em uma página html.' },
        { agent: 'agentPlannerNewAPI', description: 'criação de endpoints ou APIs, será pedido mais informações ao usuário se necessário.' },
        { agent: 'agentSupportExternal', description: 'suporte para usuários externos. Executar rag1 antes de enviar o prompt.' },
        { agent: 'agentSupportInternal', description: 'suporte para usuários internos. Executar os RAGs rag1 e rag2 antes de enviar o prompt.' },
        { agent: 'agentGenerateDefs', description: 'criação e atualização do arquivo definition.' },
    ]

    return `Agentes disponíveis:\n${listAgents.map((item) => `•	${item.agent}:${item.description}`).join('\n')}`
}

function getRagsList(): string {
    return `
- rag1: base de conhecimento de suporte geral.
- rag2: base de conhecimento da empresa (documentação interna).`
};

export async function systemToolsAvailable(): Promise<mls.msg.IAMessageInputType> {
    const tools = await getToolsList();
    return {
        type: 'system',
        content: `## Tools disponíveis:\n${tools}`
    };
}


async function getToolsList(): Promise<string> {
    const tolls = await getListFilesStart('tool');
    return tolls.join('\n');
}

export async function getListFilesStart(start: 'widget' | 'tool' | 'agent'): Promise<string[]> {

    const keys = Object.keys(mls.stor.files);
    const ret: string[] = [];
    for await (const k of keys) {

        try {
            if (k.indexOf(start) < 0) continue;

            const file = mls.stor.files[k];
            const path = `/_${file.project}_/l2/${file.shortName}`;

            if (file.extension !== '.ts' || !file.shortName.startsWith(start)) continue;

            if (start === 'widget') {
                ret.push(file.shortName);

            } else {

                const mdl = await import(path);

                if (start === 'tool') {
                    const tool = mdl.createTool() as ITool;
                    ret.push(getDefTool(tool));
                } else {
                    const agent = mdl.createAgent() as IAgent;
                    ret.push(`${agent.agentName}: ${agent.agentDescription}`);
                }

            }

        } catch (e) {

            console.info('Erro get list with start: ' + start + ' in key:' + k);

        }

    }

    return ret;

}

function getDefTool(tool: ITool): string {
    const argsList = Object.keys(tool.argsSchema || {})
        .map(arg => `${arg}:${tool.argsSchema[arg].type} /* ${tool.argsSchema[arg].description} */`)
        .join(', ');

    return `${tool.toolName}: ${tool.description} (args: ${argsList})`;
}

export function systemComponentsInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `${descriptionForPrompt}`
    }
}

export async function systemTokensLessInstruction(): Promise<mls.msg.IAMessageInputType> {
    const project = mls.actualProject;
    const theme = 'Default';
    if (!project) throw new Error('Invalid Project');
    return {
        type: 'system',
        content: '## LESS TOKENS - DESIGN SYSTEM \n\n' + (await getTokensLess(project, theme)) || ""
    }
}

export async function getPromptByHtml(dt: { project: number, shortName: string, folder: string, data?: any }): Promise<mls.msg.IAMessageInputType[]> {

    const groupMode = getState('playgroundAgent.modeCompare');

    if (!dt.project || !dt.shortName) {
        setState('playgroundAgent.modeCompare', undefined);
        throw new Error(`[getPromptByHtml]: incomplete parameters.`);
    }
    const keyFile = mls.stor.getKeyToFiles(dt.project, 2, dt.shortName, dt.folder, '.html');
    if (!mls.stor.files[keyFile]) {
        setState('playgroundAgent.modeCompare', undefined);
        throw new Error(`[getPromptByHtml]: not found stor.file ${keyFile}.`);
    }

    const content = await mls.stor.files[keyFile].getContent() as string;
    if (!content) {
        setState('playgroundAgent.modeCompare', undefined);
        return [];
    }

    const el = document.createElement('div');
    el.innerHTML = content;

    const itens = el.querySelectorAll('promptcustom');
    const ret: mls.msg.IAMessageInputType[] = [];

    let hasGroup = false;
    itens.forEach((item) => {
        const itemGroup = item.getAttribute('group') as any;
        if (itemGroup) hasGroup = true;
    });

    itens.forEach((item) => {
        let cont = item.innerHTML;
        const tp = item.getAttribute('type') as any;
        const itemGroup = item.getAttribute('group') as any;

        if (tp === 'memory' || tp === 'prompt' || (groupMode && groupMode !== itemGroup) || (!groupMode && hasGroup && itemGroup !== 'A')) return;
        cont = escape(cont);

        if (dt.data) {
            cont = clearGaps(cont);
            const keys = findKeys(cont);
            keys.forEach((key) => {
                if (!dt.data) return;
                const st = dt.data[key];
                if (st === undefined) return;
                const rp = `{{${key}}}`
                cont = cont.replace(rp, st);
            });
        }

        ret.push({
            type: tp,
            content: cont
        });

    });

    setState('playgroundAgent.modeCompare', undefined);
    return ret;

}


function clearGaps(text: string): string {
    return text.replace(/{{(.*?)}}/g, (_, content) => {
        return `{{${content.trim().replace(/\s+/g, '')}}}`;
    });
}

function findKeys(text: string): string[] {
    const regex = /{{(.*?)}}/g;
    const resultados: string[] = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
        resultados.push(match[1].trim());
    }

    return resultados;
}

function escape(input: string): string {
    return input
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
}

interface IReqGetPromptByHtml {
    project: number,
    shortName: string,
    folder: string,
    state: any
}

export async function getPromptByTS(dt: { project: number, shortName: string, folder: string, extension?: string, data: { system1: string, userPrompt: string } }): Promise<mls.msg.IAMessageInputType[]> {

    if (!dt.data?.userPrompt) throw new Error(`[getPromptByTS]: userPrompt invalid`);
    if (!dt.data?.system1) throw new Error(`[getPromptByTS]: system1 invalid`);
    dt.extension = ".ts";
    const sourceTS = await getSource(dt);
    if (!sourceTS) throw new Error(`[getPromptByTS]: source dont exists ${JSON.stringify(dt)}.`);
    const content = injectRegionsIntoTemplate(dt.data.system1, sourceTS, { warnUnusedRegions: true });
    const rc: mls.msg.IAMessageInputType[] =
        [
            { type: "system", content },
            { type: "human", content: dt.data.userPrompt }
        ]
    return rc
}

export async function getSource(dt: { project: number, shortName: string, folder: string, extension?: string, level?: number }): Promise<string | null> {
    if (!dt.project || !dt.shortName || !dt.folder || !dt.extension) throw new Error(`[getSource]: incomplete parameters: project | shortName | folder | extension.`);
    if (dt.level !== 1) dt.level = 2;
    const keyFile = mls.stor.getKeyToFiles(dt.project, dt.level, dt.shortName, dt.folder, dt.extension);
    if (!mls.stor.files[keyFile]) throw new Error(`[getSource]: not found stor.file ${keyFile}.`);
    return (await mls.stor.files[keyFile].getContent()) as string | null;
}

/**
 * Replaces [[REGION_NAME]] placeholders in the template with the actual content
 * from //#region REGION_NAME blocks in the source TypeScript file.
 * 
 * Throws clear errors if:
 * - A region is opened but not closed
 * - Regions are nested
 * - Region name is duplicated
 * - A placeholder exists but no matching region
 * - A region exists but no placeholder uses it (optional, can be disabled)
 */
export function injectRegionsIntoTemplate(
    template: string,
    sourceTS: string,
    options: { warnUnusedRegions?: boolean } = { warnUnusedRegions: true }
): string {
    const regions = new Map<string, string[]>();
    let currentRegion: string | null = null;
    const lines = sourceTS.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trimStart();

        if (trimmed.startsWith('//#region')) {
            const match = line.match(/\/\/\s*#region\s+([\w-]+)/);
            if (!match) {
                throw new Error(`Invalid //#region syntax at line ${i + 1}: ${line}`);
            }
            const name = match[1];

            if (currentRegion !== null) {
                throw new Error(`Nested //#region "${name}" inside "${currentRegion}" at line ${i + 1}`);
            }
            if (regions.has(name)) {
                throw new Error(`Duplicate //#region "${name}" at line ${i + 1}`);
            }

            currentRegion = name;
            regions.set(name, []);
        }
        else if (trimmed.startsWith('//#endregion')) {
            if (currentRegion === null) {
                throw new Error(`Unexpected //#endregion at line ${i + 1}`);
            }
            currentRegion = null;
        }
        else if (currentRegion !== null) {
            regions.get(currentRegion)!.push(line);
        }
    }

    if (currentRegion !== null) {
        throw new Error(`Unclosed //#region "${currentRegion}" at end of file`);
    }

    const regionStrings = new Map<string, string>();
    for (const [name, linesArr] of regions) {
        const content = linesArr.join('\n').trim();
        if (content) { 
            regionStrings.set(name, content);
        }
    }

    let result = template;
    const used = new Set<string>();

    result = result.replace(/\[\[([\w-]+)\]\]/g, (match, name: string) => {
        used.add(name);
        if (!regionStrings.has(name)) {
            throw new Error(`Placeholder [[${name}]] not found in source regions`);
        }
        return regionStrings.get(name)!;
    });

    if (options.warnUnusedRegions) {
        for (const name of regionStrings.keys()) {
            if (!used.has(name)) {
                console.warn(`Warning: //#region ${name} defined but not used`);
            }
        }
    }

    return result;
}


