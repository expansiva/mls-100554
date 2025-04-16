/// <mls shortName="agentPlanner1" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { AgentBase, IAMessageInputType, TaskData, AIPayload, AIAfterPrompt } from './_100554_iaChatInterfaces';


export const visibility: 'public' | 'private' = 'private'

export function beforePrompt(task: TaskData, payload: AIPayload | null | undefined): IAMessageInputType[] {
    return []
}

export async function afterPrompt(task: TaskData, payload: AIPayload[] | null | undefined): Promise<AIAfterPrompt[]> {

    const ret: AIAfterPrompt[] = [];

    if (!payload) return ret;

    for await (let payloadItem of payload) {

        if (payloadItem.type === 'agent') {
            const hasAllKeys = ['agentName', 'title', 'prompt'].every((key) => key in payloadItem);

            if (!hasAllKeys && task.messageid_created) {
                console.info('Invalid keys on payload');
                continue;
            }

            const agent = payloadItem.agentName;
            ret.push({ agent, nextprompt: payloadItem, stepFather: payloadItem.stepId })

        }

    }

    return ret
}

function getDescriptions(): string {
    const listAgents = [
        { agent: 'agentPlannerNewPage', description: 'planejamento para a criação de novas páginas no sistema, será pedido mais informações ao usuário se necessário.' },
        { agent: 'agentPlannerNewWidget', description: 'planejamento para a criação de componentes/widgets, será pedido mais informações ao usuário se necessário.' },
        { agent: 'agentPlannerNewAPI', description: 'criação de endpoints ou APIs, será pedido mais informações ao usuário se necessário.' },
        { agent: 'agentSupportExternal', description: 'suporte para usuários externos. Executar rag1 antes de enviar o prompt.' },
        { agent: 'agentSupportInternal', description: 'suporte para usuários internos. Executar os RAGs rag1 e rag2 antes de enviar o prompt.' },
    ]

    return `Agentes disponíveis:\n${listAgents.map((item) => `•	${item.agent}:${item.description}`).join('\n')}`
}

function getRags() {
    const listRags = [
        { rag: 'rag1', description: 'base de conhecimento de suporte geral.' },
        { rag: 'rag2', description: 'base de conhecimento da empresa (documentação interna).' },
    ]
    return `Rags disponíveis:\n${listRags.map((item) => `•	${item.rag}:${item.description}`).join('\n')}`
}

function getTools() {
    const listTools = [
        { tool: 'choiceNewName', description: 'escolhe o melhor nome que ainda não existe no projeto,  args deve conter um JSON com:  {{ type: "page" | "widget" | "api”,  suggestion: [sugestão de nome] }}' },
    ]
    return `Tools disponíveis:\n${listTools.map((item) => `•	${item.tool}:${item.description}`).join('\n')}`
}


export function startPrompt(userPrompt: string): IAMessageInputType[] {
    return [
        {
            type: 'system',
            content: `
Você é um coordenador de agentes e ferramentas para executar tarefas complexas com base no prompt do usuário.

Seu unico objetivo é analisar o prompt do usuário e decidir qual agente chamar.

1. Se faltar informações apenas para decidir o agente ou a resposta, retorne apenas uma subtarefa do tipo \`clarification\`. Sempre que possível, inclua um \`htmlForm\` com campos e opções para facilitar a resposta do usuário.
2. Se a tarefa puder ser resolvida diretamente com uma resposta, retorne uma subtarefa do tipo \`result\`.
3. Decida qual agente, ferramenta ou base de conhecimento (RAG) será executado no próximo passo.
4. Nunca retorne múltiplas subtarefas. Retorne **apenas uma subtarefa por vez** neste passo inicial.
5. Se retornar um agent, no atributo prompt, deve se repetir o prompt do usuario.
6. Lembre seu unico objetivo é identificar qual agente chamar, não elabore mais coisas
`
        },
        {
            type: 'system',
            content: getDescriptions()
        },
        {
            type: 'system',
            content: getRags()
        },
        // {
        //     type: 'system',
        //     content: getTools()
        // },
        {
            type: 'system',
            content: `
Você deve retornar um array de objetos no formato JSON. Cada objeto representa uma subtarefa, com **apenas um dos seguintes formatos**:
JSON:
\`\`\` json
[
  {
    "type": "agent",
    "agentName": string,
    “title": string,
    "prompt": string, // prompt original do usuario
    "rags": string[] | null
  },
  {
    "type": "tool",
    "toolName": string,
    “title": string,
    "args": string // JSON stringified
  },
  {
    "type": "clarification",
    "clarificationMessage": string,
    "htmlForm?": string // Optional HTML form shown to the user. The submitted data will be included in the prompt of the next interaction.
  },
  {
     "type": "result",
     “result”: string
  }
]
\`\`\`
`
        },

        {
            type: 'human',
            content: userPrompt
        },
    ]
}
