/// <mls shortName="pluginTaskPreview" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginTaskPreview",
    "type": "plugin",
    "group": "other",
    "tags": [
      "lit",
      "task-preview",
      "ai-agent",
      "stepper",
      "collab.codes"
    ]
  },
  "references": {
    "widgets": [
      "plugin-task-preview-agent-100554",
      "plugin-task-preview-clarification-100554",
      "plugin-task-preview-flexible-100554",
      "plugin-task-preview-tools-100554",
      "plugin-task-preview-result-100554"
    ],
    "plugins": [],
    "statesRO": [
      "task",
      "modeTest",
      "stepMap",
      "navigationStack",
      "currentStepId",
      "allSteps"
    ],
    "statesRW": [
      "task",
      "modeTest",
      "stepMap",
      "navigationStack",
      "currentStepId",
      "allSteps"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_aiAgentHelper",
      "./_100554_collabLitElement",
      "./_100554_pluginTaskPreviewAgent",
      "./_100554_pluginTaskPreviewClarification",
      "./_100554_pluginTaskPreviewFlexible",
      "./_100554_pluginTaskPreviewTools",
      "./_100554_pluginTaskPreviewResult"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct use of setTimeout in connectedCallback for test mode (not a security risk, but can be improved for testability).",
      "No evidence of innerHTML or direct DOM manipulation, but always review dynamic rendering for XSS if user data is injected."
    ],
    "unusedImports": [
      "repeat"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "Buttons have aria-labels and are focusable.",
      "Breadcrumb navigation uses clickable spans, but not semantic <a> or <button> elements; consider for better accessibility.",
      "Tab order is not explicitly managed, but default order is reasonable.",
      "Contrast and color tokens are used, but actual contrast should be verified in the rendered UI.",
      "No explicit tabindex or aria-current in breadcrumb; could be improved."
    ],
    "i18nWarnings": [
      "Strings like 'Task not provided.', 'No steps selected.', 'Step not found', 'Not found type: renderStepDetails' are hardcoded and should be internationalized."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Plugin para visualização e navegação de tarefas de IA em múltiplos passos, exibindo diferentes tipos de etapas (agent, clarification, flexible, tool, result) em um fluxo interativo. Permite navegação entre passos, breadcrumbs e visualização detalhada de cada etapa, integrando-se ao ecossistema Collab.codes.",
    "goal": "Permitir que usuários visualizem, naveguem e entendam o fluxo de execução de tarefas de IA multi-etapas, facilitando o acompanhamento, depuração e entendimento do processo automatizado.",
    "userStories": [
      {
        "story": "Como usuário, quero visualizar cada etapa de uma tarefa de IA para entender o que foi executado e os resultados intermediários.",
        "derivedRequirements": [
          {
            "description": "Renderizar detalhes de cada etapa com base no tipo (agent, clarification, flexible, tool, result).",
            "done": true,
            "comment": "Implementado via métodos renderStepDetails e componentes específicos."
          }
        ]
      },
      {
        "story": "Como usuário, quero navegar entre as etapas anteriores e posteriores para revisar o histórico da tarefa.",
        "derivedRequirements": [
          {
            "description": "Implementar navegação via botões e breadcrumb.",
            "done": true,
            "comment": "Navegação implementada com navigationStack e métodos navigateToStep/goBack."
          }
        ]
      },
      {
        "story": "Como usuário, quero receber feedback claro caso uma etapa não exista ou não esteja disponível.",
        "derivedRequirements": [
          {
            "description": "Exibir mensagens amigáveis quando task ou step não estiverem disponíveis.",
            "done": true,
            "comment": "Mensagens implementadas em render e renderStep."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a internacionalização das mensagens exibidas.",
        "done": false,
        "comment": "Mensagens ainda estão hardcoded em inglês."
      },
      {
        "description": "Melhorar acessibilidade dos breadcrumbs e navegação por teclado.",
        "done": false,
        "comment": "Breadcrumbs usam spans clicáveis, mas não são semanticamente links ou botões."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Permitir visualização em modo somente leitura para usuários sem permissão de edição.",
        "done": false,
        "comment": "Não há controle de permissão implementado no componente."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin provides a step-by-step AI task preview for Collab.codes, allowing users to navigate, inspect, and understand each phase of a multi-step AI workflow.",
    "It supports agent, clarification, flexible, tool, and result step types, with navigation via buttons and breadcrumbs, and displays detailed information for each step.",
    "Future requests include i18n support for all user-facing messages and improved accessibility for navigation elements, especially breadcrumbs.",
    "Enhancements are suggested for read-only mode and better permission handling, while current implementation focuses on clarity and interactive review of AI task flows."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9772,version:2"
}
    