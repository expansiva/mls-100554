/// <mls shortName="pluginTaskPreviewFlexible" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginTaskPreviewFlexible",
    "type": "plugin",
    "group": "other",
    "tags": []
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [
      "task",
      "step"
    ],
    "statesRW": [
      "mode"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_collabLitElement"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [
      "repeat"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "Tab navigation is implemented with buttons, but no aria-selected or role attributes are present for accessibility. Consider adding aria attributes for better screen reader support.",
      "Details/summary elements are used, which are accessible, but no explicit keyboard focus indicators are styled.",
      "Contrast between text and background is sufficient in most cases, but check for small text in <small> tags."
    ],
    "i18nWarnings": [
      "Strings like 'Step not Found.', 'Not found!', 'No input found!', 'Not next step', 'Info', 'Flexible', 'Results', 'Step details', 'Task details', 'Status', 'Última atualização' should be internationalized if i18n is enabled."
    ],
    "correctness": 9,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Este plugin exibe uma pré-visualização flexível de tarefas e etapas de IA, permitindo alternar entre abas de informações, resultados flexíveis e próximos passos. O componente é usado para inspecionar o progresso e detalhes de execuções de tarefas automatizadas ou assistidas por IA.",
    "goal": "Fornecer uma interface clara e flexível para visualizar detalhes de tarefas, etapas e resultados de execuções de IA, facilitando a navegação entre diferentes tipos de informações relevantes para o usuário.",
    "userStories": [
      {
        "story": "Como usuário, quero visualizar detalhes de uma tarefa e suas etapas para entender o progresso e status das execuções de IA.",
        "derivedRequirements": [
          {
            "description": "Exibir abas para alternar entre informações, resultados flexíveis e próximos passos.",
            "done": true,
            "comment": "Implementado via state 'mode' e métodos de renderização."
          },
          {
            "description": "Mostrar detalhes da tarefa e da etapa selecionada.",
            "done": true,
            "comment": "Implementado em renderInfo()."
          },
          {
            "description": "Exibir próximos passos e opções de interação, se disponíveis.",
            "done": true,
            "comment": "Implementado em renderResults()."
          }
        ]
      }
    ],
    "userRequestsFeatures": [],
    "userRequestsBugs": [],
    "userRequestsEnhancements": []
  },
  "textToEmbedding": [
    "This plugin provides a flexible preview for AI task steps, allowing users to switch between info, flexible result, and next steps tabs. It displays detailed information about the current task and step, including status and last update, and shows possible next steps if available.",
    "The main goal is to offer a clear interface for inspecting the progress and results of automated or AI-assisted tasks, supporting user navigation and understanding of workflow execution.",
    "Accessibility could be improved by adding ARIA attributes to tab buttons and ensuring all user-facing strings are internationalized. There are no critical security issues or dead code blocks.",
    "Future enhancements may include better i18n support and improved accessibility for screen readers and keyboard navigation."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9768,version:2"
}
    