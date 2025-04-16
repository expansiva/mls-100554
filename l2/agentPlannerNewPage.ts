/// <mls shortName="agentPlannerNewPage" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { IAMessageInputType, TaskData, AIPayload, AIAfterPrompt } from './_100554_iaChatInterfaces';

export const visibility: 'public' | 'private' = 'public'
export function beforePrompt(task: TaskData, payload: AIPayload | null | undefined): IAMessageInputType[] {
  return startPrompt((payload as any).prompt);
}

export async function afterPrompt(task: TaskData, payload: AIPayload | null | undefined): Promise<AIAfterPrompt[]> {

  const ret: AIAfterPrompt[] = [];

  if (!payload) return ret;

  ret.push({ agent:'agenteCreateHtml1', nextprompt: payload, stepFather: payload.stepId || 0 })
  
  return ret

}

export function getDescriptions(): string {

  return `Planejamento para a criação de novas páginas no sistema, será pedido mais informações ao usuário se necessário.`
}

export function startPrompt(userPrompt: string): IAMessageInputType[] {
  return [
    {
      type: 'system',
      content: `
Você é um planejador responsável por definir os detalhes de criação de uma nova página no sistema.

Com base no prompt original do usuário, sua tarefa é:
1. Entender o propósito da página.
2. Escolher o nome da página.
3. Determinar o tipo da página, usando o enum \`PageType\`.
4. Verificar se há APIs, states ou dados existentes que podem ser usados. Caso não existam, deve sugerir o que precisa ser criado e aguardar uma confirmação ou complementação do usuário.
5. Especificar cada campo necessário (widgets), se o usuario não passar os campos, coloque os campos que você achar necessario para o funcionamento da pagina.
6. Definir restrições e requerimentos técnicos ou funcionais.
7. Se os dados forem suficientes, preparar a chamada para o agente \`agenteCreateHtml1\`.
8. Se necessário, peça mais informações ao usuário usando o tipo \`clarification\`. Sempre que possível, inclua um \`htmlForm\` com campos e respostas prontas (como botões, selects ou inputs) para facilitar a interação. O formulário será exibido ao usuário e os dados enviados serão incluídos automaticamente no próximo prompt.  Se for necessária uma \`clarification\`, retorne **apenas essa subtarefa**. Não crie outros agentes ou ferramentas até que a resposta do usuário seja recebida.
`
    },
    {
      type: 'system',
      content: `## Formato de saida
Você deve retornar **apenas um dos seguintes formatos** no array JSON:

\`\`\`json
[
  {
    "type": "flexible",
    "agentName": "agenteCreateHtml1",
    "taskTitle": string,
    "prompt": string, // original do usuario
    "pageName": string,
    "pageType": "crud" | "report" | "dashboard" | "form" | "search" | "workflow" | "config" | "association",
    "loadContext": false,
    "rags": null,
    "requirements": string,
    "widgets": [
      {
        "name": string,
        "binding": string,
        "description": string
      }
    ]
  }
]
ou
[
  {
    "type": "clarification",
    "clarificationMessage": string,
   "htmlForm?": string // Optional HTML form shown to the user. The submitted data will be included in the prompt of the next interaction.
  }
]
\`\`\``
    },
    {
      type: 'system',
      content: `## states já definidos no projeto no formato simplificado`
    },
    {
      type: 'system',
      content: `## Regras adicionais:
	•	O campo widgets é obrigatório se for criar a página.
  •	O Nome da página que você criar deve ser no formato pageXxx , onde ‘page’ é o sufixo obrigatório.
	•	Cada widget deve conter:
	•	name: identificador curto
	•	binding: no formato "{{[pageName].[name]}}" (não confundir com bindings reais dos states)
	•	description: funcionalidade do componente
	•	Se o tipo da página estiver ambíguo, retorne uma clarificationMessage solicitando mais detalhes ao usuário.`
    },
    {
      type: 'human',
      content: userPrompt
    },
  ]
}