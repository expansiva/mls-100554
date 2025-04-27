/// <mls shortName="aiPrompts" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { ITool, IAgent } from './_100554_aiAgentBase'

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

export const preferModelType = (modelType: mls.msg.ModelType) => `<!-- modelType: ${modelType} -->`;

function getAgentsList(): string {
    const listAgents = [
        { agent: 'agentPlannerNewPage', description: 'planejamento para a criação de novas páginas no sistema, será pedido mais informações ao usuário se necessário.' },
        { agent: 'agentPlannerNewWidget', description: 'criação de novos componentes UI, web components, widgets, estes widgets podem futuramente serem incluidos em uma página html.' },
        { agent: 'agentPlannerNewAPI', description: 'criação de endpoints ou APIs, será pedido mais informações ao usuário se necessário.' },
        { agent: 'agentSupportExternal', description: 'suporte para usuários externos. Executar rag1 antes de enviar o prompt.' },
        { agent: 'agentSupportInternal', description: 'suporte para usuários internos. Executar os RAGs rag1 e rag2 antes de enviar o prompt.' },
    ]

    return `Agentes disponíveis:\n${listAgents.map((item) => `•	${item.agent}:${item.description}`).join('\n')}`
}

function getRagsList(): string {
    return `
- rag1: base de conhecimento de suporte geral.
- rag2: base de conhecimento da empresa (documentação interna).`
};

export async function  systemToolsAvailable(): Promise<mls.msg.IAMessageInputType> {
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

export async function getListFilesStart(start: 'wc' | 'tool' | 'agent'): Promise<string[]> {

    const keys = Object.keys(mls.stor.files);
    const ret:string[] = [];
    for await (const k of keys) {

        try {
            if (k.indexOf(start) < 0) continue;

            const file = mls.stor.files[k];
            const path = `./_${file.project}_${file.shortName}`;

            if (file.extension !== '.ts' || !file.shortName.startsWith(start)) continue;

            const mdl = await import(path);

            if (start === 'tool') {
                const tool = mdl.createTool() as ITool;
                ret.push(`${tool.toolName}: ${tool.description}`);
            } else {
                const agent = mdl.createAgent() as IAgent;
                ret.push(`${agent.agentName}: ${agent.agentDescription}`);
            }

        } catch (e) {

            console.info('Erro get list with start: ' + start + ' in key:' + k);

        }

    }

    return ret;

}

// import { createTool as t2 } from "./toolMortgageCalculator.js";
// import { createTool as t1 } from './toolPercentagemCalculator.js';


// function addTool(tool: mls.msg.ITool, tools: string[]): void {
//   const argsList = Object.keys(tool.argsSchema || {})
//     .map(arg => `${arg}:${tool.argsSchema[arg].type} /* ${tool.argsSchema[arg].description} */`)
//     .join(', ');

//   tools.push(`${tool.toolName}: ${tool.description} (args: ${argsList})`);
// }

export function systemRulesComponentsInstruction(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `##REGRA DOS COMPONENTES
No atributo  allowedChildren e allowedParents

- Pode encontrar itens que terminam -*, exemplo: "ica-forms-*" isso significa que o componente aceita qualquer filho que a tag comece com "ica-forms-" exemplo nesse caso aceitaria "ica-forms-submit"

- Pode ser encontrado também itens que começam com **, exemplo "**ica-forms-content-form" isso significa que o item não precisar ser filho direto do elemento, porem tem q estar debaixo desse elemento

-Pode encontrar também o item "!*", isso significa que esse componente não aceita filho nenhum

-Se o atributo allowedParents estiver preenchido, significa que aquele componente só pode ser adicionado dentro daquele componente diretamente ou não, seguindo a regra do "**"
`
    }
}

