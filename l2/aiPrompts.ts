/// <mls shortName="aiPrompts" project="100554" enhancement="_100554_enhancementLit" groupName="other" />


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
        { agent: 'agentPlannerNewWidget', description: 'planejamento para a criação de componentes/widgets, será pedido mais informações ao usuário se necessário.' },
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

export function systemToolsAvailable(): mls.msg.IAMessageInputType {
    return {
        type: 'system',
        content: `## Tools disponíveis:\n${getToolsList()}`
    };
}

// import { createTool as t2 } from "./toolMortgageCalculator.js";
// import { createTool as t1 } from './toolPercentagemCalculator.js';

function getToolsList(): string {
    //   const tools: string[] = [];
    //   addTool(t1(), tools);
    //   addTool(t2(), tools);
    //   return tools.join('\n');
    return '';
}

// function addTool(tool: mls.msg.ITool, tools: string[]): void {
//   const argsList = Object.keys(tool.argsSchema || {})
//     .map(arg => `${arg}:${tool.argsSchema[arg].type} /* ${tool.argsSchema[arg].description} */`)
//     .join(', ');

//   tools.push(`${tool.toolName}: ${tool.description} (args: ${argsList})`);
// }