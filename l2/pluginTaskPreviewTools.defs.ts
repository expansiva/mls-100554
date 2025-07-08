/// <mls shortName="pluginTaskPreviewTools" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginTaskPreviewTools",
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
      "html",
      "repeat",
      "customElement",
      "property",
      "state",
      "CollabLitElement"
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
      "Tab navigation is implemented with buttons, but there is no explicit aria-selected or role attributes for accessibility. Consider adding role=\"tablist\", role=\"tab\", and aria-selected for better screen reader support.",
      "No tabindex management for keyboard navigation between tabs.",
      "Color contrast appears sufficient, but should be verified against WCAG for all states.",
      "SVG chevron used for details, but no aria-label or title for screen readers."
    ],
    "i18nWarnings": [
      "Strings like 'Step not Found.', 'Info', 'Tools', 'Results', 'Not found!', 'Step details', 'Task details', 'No input found!', 'Not next step' are hardcoded and should be internationalized for multi-language support."
    ],
    "correctness": 9,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Este plugin exibe detalhes de uma tarefa e seus passos, permitindo alternar entre abas de informações, ferramentas e resultados. Utiliza LitElement e estilização LESS customizada.",
    "goal": "Fornecer uma visualização clara e interativa dos detalhes de tarefas e passos de ferramentas de IA, facilitando a navegação entre informações, ferramentas e resultados.",
    "userStories": [
      {
        "story": "Como usuário, quero visualizar detalhes de uma tarefa e seus passos para entender o progresso e status.",
        "derivedRequirements": [
          {
            "description": "Exibir informações detalhadas da tarefa e do passo atual na aba 'Info'.",
            "done": true,
            "comment": "Implementado em renderInfo()."
          }
        ]
      },
      {
        "story": "Como usuário, quero alternar entre abas para acessar informações, ferramentas e resultados relacionados ao passo.",
        "derivedRequirements": [
          {
            "description": "Implementar navegação por abas entre Info, Tools e Results.",
            "done": true,
            "comment": "Implementado com state 'mode' e métodos selectTab*."
          }
        ]
      },
      {
        "story": "Como usuário, quero ver os resultados e próximos passos após a execução de uma ferramenta.",
        "derivedRequirements": [
          {
            "description": "Exibir resultados e próximos passos na aba 'Results'.",
            "done": true,
            "comment": "Implementado em renderResults()."
          }
        ]
      }
    ],
    "userRequestsFeatures": [],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Adicionar suporte a internacionalização (i18n) para todas as strings exibidas.",
        "done": false,
        "comment": "Strings estão hardcoded, não há integração i18n."
      },
      {
        "description": "Melhorar acessibilidade das abas com roles e atributos ARIA.",
        "done": false,
        "comment": "Faltam roles e aria-selected nos botões das abas."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin displays task and step details, allowing users to switch between Info, Tools, and Results tabs. It is built with LitElement and custom LESS styling.",
    "The main goal is to provide a clear, interactive view of AI tool steps and task progress, making it easy to navigate between information, tool arguments, and results.",
    "There are enhancement requests for adding i18n support and improving accessibility with ARIA roles for better screen reader compatibility.",
    "Some hardcoded strings and missing ARIA attributes are present, which should be addressed for internationalization and accessibility best practices."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9768,version:2"
}
    