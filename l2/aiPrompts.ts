/// <mls shortName="aiPrompts" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { ITool, IAgent } from '/_100554_/l2/aiAgentBase.js'
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

export async function getSource(dt: mls.stor.IFileInfo): Promise<string | null> {
    const keyFile = mls.stor.getKeyToFiles(dt.project, dt.level, dt.shortName, dt.folder, dt.extension);
    if (!mls.stor.files[keyFile]) throw new Error(`[getSource]: not found stor.file ${keyFile}.`);
    const rc = (await mls.stor.files[keyFile].getContent()) as string | null;
    return rc
}

