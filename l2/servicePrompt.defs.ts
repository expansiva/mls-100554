/// <mls shortName="servicePrompt" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "servicePrompt",
    "type": "widget",
    "group": "other",
    "tags": [
      "lit",
      "prompt",
      "ai",
      "service",
      "frontend"
    ]
  },
  "references": {
    "widgets": [
      "service-prompt-100554"
    ],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_serviceBase"
    ],
    "statesRO": [
      "data.length",
      "data",
      "promptValue",
      "selectedPromptIndex",
      "filterStatus",
      "currentPage",
      "itemsPerPage"
    ],
    "statesRW": [
      "promptValue",
      "selectedPromptIndex",
      "filterStatus",
      "currentPage"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Uso de .innerHTML para renderizar htmlForm em renderDetails pode permitir XSS se o conteúdo não for sanitizado."
    ],
    "unusedImports": [
      "property"
    ],
    "deadCodeBlocks": [
      "Método onServiceClick está vazio e nunca é chamado."
    ],
    "accessibility": [
      "Botões e selects possuem uso padrão, mas falta de aria-labels e roles explícitos.",
      "Foco visual em botões está ok, mas não há tabindex personalizado.",
      "Contraste de cores parece adequado pelas variáveis, mas recomenda-se revisão com ferramentas automáticas.",
      "Uso de <textarea> e <select> está correto, mas falta label explícita para textarea."
    ],
    "i18nWarnings": [
      "Strings como 'Filtrar por status:', 'Todos', 'Em processo', 'Cancelado', 'Finalizado', 'Aguardando', 'Voltar', 'Enviar', 'Anterior', 'Próximo', 'Resultado', 'Agente', 'Tarefa', 'Prompt', 'RAGs', 'Ferramenta', 'Argumentos', 'Esclarecimento', 'Tipo de resultado desconhecido.' deveriam ser internacionalizadas."
    ],
    "correctness": 8,
    "errorHandling": 6,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Widget de serviço de prompts IA para interface Collab.codes, permitindo ao usuário enviar perguntas, visualizar histórico de prompts, filtrar por status e ver detalhes de cada interação (resultado, agente, ferramenta, esclarecimento).",
    "goal": "Facilitar a interação do usuário com serviços de IA, centralizando prompts, respostas e acompanhamento do status de cada solicitação.",
    "userStories": [
      {
        "story": "Como usuário, quero enviar perguntas para a IA e receber respostas, para obter auxílio em tarefas diversas.",
        "derivedRequirements": [
          {
            "description": "Implementar campo de texto para envio de prompts.",
            "done": true,
            "comment": "Textarea implementado com botão de envio."
          },
          {
            "description": "Exibir respostas e status dos prompts enviados.",
            "done": true,
            "comment": "Cards de histórico e detalhes implementados."
          }
        ]
      },
      {
        "story": "Como usuário, quero filtrar e navegar pelo histórico de prompts, para encontrar rapidamente interações anteriores.",
        "derivedRequirements": [
          {
            "description": "Adicionar filtro por status dos prompts.",
            "done": true,
            "comment": "Filtro por status implementado via select."
          },
          {
            "description": "Paginar resultados para facilitar navegação.",
            "done": true,
            "comment": "Paginação implementada com controles de página."
          }
        ]
      },
      {
        "story": "Como usuário, quero visualizar detalhes completos de cada prompt, incluindo agentes, ferramentas e esclarecimentos.",
        "derivedRequirements": [
          {
            "description": "Exibir detalhes completos ao clicar em um card.",
            "done": true,
            "comment": "Detalhes exibidos em card expandido."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Permitir envio de prompts diretamente pela interface.",
        "done": true,
        "comment": "Campo de texto e botão de envio presentes."
      },
      {
        "description": "Adicionar filtro por status dos prompts.",
        "done": true,
        "comment": "Filtro implementado."
      },
      {
        "description": "Paginação do histórico de prompts.",
        "done": true,
        "comment": "Paginação implementada."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Internacionalização das mensagens e labels.",
        "done": false,
        "comment": "Strings ainda estão hardcoded em português."
      },
      {
        "description": "Melhorar acessibilidade com aria-labels e foco.",
        "done": false,
        "comment": "Atributos de acessibilidade ainda não implementados."
      },
      {
        "description": "Sanitizar htmlForm antes de usar innerHTML.",
        "done": false,
        "comment": "Potencial risco de XSS identificado."
      }
    ]
  },
  "textToEmbedding": [
    "This widget provides an AI prompt service for Collab.codes, allowing users to send questions, view prompt history, filter by status, and see detailed results for each interaction.",
    "The main goal is to centralize user interaction with AI services, making it easy to track, filter, and review all prompt-based communications.",
    "Future enhancements include internationalization of all UI strings, improved accessibility with ARIA attributes, and sanitization of dynamic HTML to prevent XSS.",
    "No critical bugs reported, but attention is needed for i18n and security best practices in future updates."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9788,version:2"
}
    