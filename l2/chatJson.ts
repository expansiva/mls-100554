/// <mls shortName="chatJson" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { TaskData } from '/_100554_/l2/iaChatInterfaces.js';

interface IChatUser {
    type: 'user',
    user: string,
    time: string,
    message: string
}

interface IChatTask {
    type: 'task',
    task: TaskData
}


export const tasks: any[] = [
    {
        "PK": "task#1744720115783",
        "SK": "metadata",
        "title": "Criar um widget\n",
        "owner": "20250306212720.1000",
        "team": "unassigned",
        "status": "in progress",
        "last_updated": 1744720121538,
        "last_update_log": "Task started by  at 2025-04-15T12:28:37.047Z",
        "source": "",
        "iaCompressed": {
            "interaction": {
                "input": [
                    {
                        "type": "system",
                        "content": "\nVocê é um planejador que irá coordenar agentes e ferramentas para executar tarefas complexas com base no prompt do usuário.\n\nSeu objetivo é analisar o prompt do usuário e decidir o próximo passo.\n\n1. Se faltar informações importantes para continuar, retorne apenas uma subtarefa do tipo `clarification`. Sempre que possível, inclua um `htmlForm` com campos e opções para facilitar a resposta do usuário.\n2. Se a tarefa puder ser resolvida diretamente com uma resposta, retorne uma subtarefa do tipo `result`.\n3. Decida qual agente, ferramenta ou base de conhecimento (RAG) será executado no próximo passo.\n4. Nunca retorne múltiplas subtarefas. Retorne **apenas uma subtarefa por vez** neste passo inicial.\n\n"
                    },
                    {
                        "type": "system",
                        "content": "Agentes disponíveis:\n•\tagentPlannerNewPage:planejamento para a criação de novas páginas no sistema, será pedido mais informações ao usuário se necessário.\n•\tagentPlannerNewWidget:planejamento para a criação de componentes/widgets, será pedido mais informações ao usuário se necessário.\n•\tagentPlannerNewAPI:criação de endpoints ou APIs, será pedido mais informações ao usuário se necessário.\n•\tagentSupportExternal:suporte para usuários externos. Executar rag1 antes de enviar o prompt.\n•\tagentSupportInternal:suporte para usuários internos. Executar os RAGs rag1 e rag2 antes de enviar o prompt."
                    },
                    {
                        "type": "system",
                        "content": "Rags disponíveis:\n•\trag1:base de conhecimento de suporte geral.\n•\trag2:base de conhecimento da empresa (documentação interna)."
                    },
                    {
                        "type": "system",
                        "content": "Tools disponíveis:\n•\tchoiceNewName:escolhe o melhor nome que ainda não existe no projeto,  args deve conter um JSON com:  {{ type: \"page\" | \"widget\" | \"api”,  suggestion: [sugestão de nome] }}"
                    },
                    {
                        "type": "system",
                        "content": "Tools disponíveis:\n•\tchoiceNewName:escolhe o melhor nome que ainda não existe no projeto,  args deve conter um JSON com:  {{ type: \"page\" | \"widget\" | \"api”,  suggestion: [sugestão de nome] }}"
                    },
                    {
                        "type": "system",
                        "content": "\nVocê deve retornar um array de objetos no formato JSON. Cada objeto representa uma subtarefa, com **apenas um dos seguintes formatos**:\nJSON:\n``` json\n[\n  {\n    \"type\": \"agent\",\n    \"agentName\": string,\n    “title\": string,\n    \"prompt\": string,\n    \"rags\": string[] | null\n  },\n  {\n    \"type\": \"tool\",\n    \"toolName\": string,\n    “title\": string,\n    \"args\": string // JSON stringified\n  },\n  {\n    \"type\": \"clarification\",\n    \"clarificationMessage\": string,\n    \"htmlForm?\": string // Optional HTML form shown to the user. The submitted data will be included in the prompt of the next interaction.\n  },\n  {\n     \"type\": \"result\",\n     “result”: string\n  }\n]\n```\n"
                    },
                    {
                        "type": "human",
                        "content": "Criar um widget\n"
                    }
                ],
                "cost": 0.0031,
                "trace": [
                    "provider: openai model:gpt-4o inputTokens:646 outputTokens:148 inputCost:2.50/1M outputCost:10.00/1M total:$0.0031 llmTime: 4312ms"
                ],
                "payload": [
                    {
                        "type": "clarification",
                        "clarificationMessage": "Para criar um widget, preciso de mais informações. Por favor, forneça os detalhes necessários.",
                        "htmlForm": "<form><label for='widgetName'>Nome do Widget:</label><input type='text' id='widgetName' name='widgetName' required><br><label for='widgetDescription'>Descrição do Widget:</label><textarea id='widgetDescription' name='widgetDescription' required></textarea><br><label for='widgetFeatures'>Funcionalidades do Widget:</label><textarea id='widgetFeatures' name='widgetFeatures' required></textarea><br><button type='submit'>Enviar</button></form>",
                        "status": "waiting_for_user",
                        "stepId": 1,
                        "interaction": null,
                        "nextSteps": null
                    }
                ]
            }
        },
        "messageid_created": "20250304200000.1000/20250415122835.1000"
    },
    {
        "PK": "task#1744721425856",
        "SK": "metadata",
        "title": "Criar um componente para exibir gráficos de dados estatísticos para uso no painel de estatísticas. Ele deve suportar diferentes tipos de gráficos, como barras, linhas e pizza.",
        "owner": "20250306212720.1000",
        "team": "unassigned",
        "status": "in progress",
        "last_updated": 1744721429083,
        "last_update_log": "Task started by  at 2025-04-15T12:50:26.932Z",
        "source": "",
        "iaCompressed": {
            "interaction": {
                "input": [
                    {
                        "type": "system",
                        "content": "\nVocê é um planejador que irá coordenar agentes e ferramentas para executar tarefas complexas com base no prompt do usuário.\n\nSeu objetivo é analisar o prompt do usuário e decidir o próximo passo.\n\n1. Se faltar informações importantes para continuar, retorne apenas uma subtarefa do tipo `clarification`. Sempre que possível, inclua um `htmlForm` com campos e opções para facilitar a resposta do usuário.\n2. Se a tarefa puder ser resolvida diretamente com uma resposta, retorne uma subtarefa do tipo `result`.\n3. Decida qual agente, ferramenta ou base de conhecimento (RAG) será executado no próximo passo.\n4. Nunca retorne múltiplas subtarefas. Retorne **apenas uma subtarefa por vez** neste passo inicial.\n\n"
                    },
                    {
                        "type": "system",
                        "content": "Agentes disponíveis:\n•\tagentPlannerNewPage:planejamento para a criação de novas páginas no sistema, será pedido mais informações ao usuário se necessário.\n•\tagentPlannerNewWidget:planejamento para a criação de componentes/widgets, será pedido mais informações ao usuário se necessário.\n•\tagentPlannerNewAPI:criação de endpoints ou APIs, será pedido mais informações ao usuário se necessário.\n•\tagentSupportExternal:suporte para usuários externos. Executar rag1 antes de enviar o prompt.\n•\tagentSupportInternal:suporte para usuários internos. Executar os RAGs rag1 e rag2 antes de enviar o prompt."
                    },
                    {
                        "type": "system",
                        "content": "Rags disponíveis:\n•\trag1:base de conhecimento de suporte geral.\n•\trag2:base de conhecimento da empresa (documentação interna)."
                    },
                    {
                        "type": "system",
                        "content": "Tools disponíveis:\n•\tchoiceNewName:escolhe o melhor nome que ainda não existe no projeto,  args deve conter um JSON com:  {{ type: \"page\" | \"widget\" | \"api”,  suggestion: [sugestão de nome] }}"
                    },
                    {
                        "type": "system",
                        "content": "Tools disponíveis:\n•\tchoiceNewName:escolhe o melhor nome que ainda não existe no projeto,  args deve conter um JSON com:  {{ type: \"page\" | \"widget\" | \"api”,  suggestion: [sugestão de nome] }}"
                    },
                    {
                        "type": "system",
                        "content": "\nVocê deve retornar um array de objetos no formato JSON. Cada objeto representa uma subtarefa, com **apenas um dos seguintes formatos**:\nJSON:\n``` json\n[\n  {\n    \"type\": \"agent\",\n    \"agentName\": string,\n    “title\": string,\n    \"prompt\": string,\n    \"rags\": string[] | null\n  },\n  {\n    \"type\": \"tool\",\n    \"toolName\": string,\n    “title\": string,\n    \"args\": string // JSON stringified\n  },\n  {\n    \"type\": \"clarification\",\n    \"clarificationMessage\": string,\n    \"htmlForm?\": string // Optional HTML form shown to the user. The submitted data will be included in the prompt of the next interaction.\n  },\n  {\n     \"type\": \"result\",\n     “result”: string\n  }\n]\n```\n"
                    },
                    {
                        "type": "human",
                        "content": "Criar um componente para exibir gráficos de dados estatísticos para uso no painel de estatísticas. Ele deve suportar diferentes tipos de gráficos, como barras, linhas e pizza."
                    }
                ],
                "cost": 0.0025,
                "trace": [
                    "provider: openai model:gpt-4o inputTokens:677 outputTokens:76 inputCost:2.50/1M outputCost:10.00/1M total:$0.0025 llmTime: 1971ms"
                ],
                "payload": [
                    {
                        "type": "agent",
                        "agentName": "agentPlannerNewWidget",
                        "title": "Planejamento para criação de componente de gráficos",
                        "prompt": "Criar um componente para exibir gráficos de dados estatísticos que suporte diferentes tipos de gráficos, como barras, linhas e pizza.",
                        "rags": null,
                        "status": "pending",
                        "stepId": 1,
                        "interaction": null,
                        "nextSteps": null
                    }
                ]
            }
        },
        "messageid_created": "20250304200000.1000/20250415125025.1000"
    }
]

