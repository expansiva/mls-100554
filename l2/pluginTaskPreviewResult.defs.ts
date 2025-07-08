/// <mls shortName="pluginTaskPreviewResult" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginTaskPreviewResult",
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
      "Tab navigation is implemented via buttons, but no explicit aria attributes or roles are set for tabs. Consider adding role=\"tablist\", role=\"tab\", and aria-selected for better accessibility.",
      "SVG icons are decorative but lack aria-hidden or descriptive titles.",
      "Keyboard focus is not explicitly managed for tab switching; relies on default button behavior.",
      "Color contrast appears sufficient, but verify with real content for WCAG compliance."
    ],
    "i18nWarnings": [
      "Strings like 'Step not Found.', 'Not found!', 'Info', 'Result', 'Step details', 'Task details', 'Status', 'Última atualização', 'Not found step', 'Not next step' are hardcoded and should be internationalized for multi-language support."
    ],
    "correctness": 9,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Este plugin exibe uma prévia dos resultados de uma tarefa de IA, mostrando detalhes do passo atual, informações da tarefa e possíveis próximos passos. Utiliza tabs para alternar entre informações e resultados, com layout responsivo e estilização customizada.",
    "goal": "Permitir ao usuário visualizar rapidamente o resultado de um passo de tarefa de IA, alternando entre detalhes do passo e da tarefa, e visualizar próximos passos sugeridos.",
    "userStories": [
      {
        "story": "Como usuário, quero visualizar detalhes de um passo de tarefa de IA para entender o status e resultado do processamento.",
        "derivedRequirements": [
          {
            "description": "Exibir detalhes do passo atual, incluindo ID, tipo e status.",
            "done": true,
            "comment": "Implementado em renderInfo()."
          },
          {
            "description": "Exibir detalhes da tarefa associada, incluindo status, última atualização e título.",
            "done": true,
            "comment": "Implementado em renderInfo()."
          }
        ]
      },
      {
        "story": "Como usuário, quero alternar entre abas de informações e resultados para navegar facilmente entre diferentes visões.",
        "derivedRequirements": [
          {
            "description": "Implementar tabs para alternar entre informações e resultados.",
            "done": true,
            "comment": "Tabs implementadas com estado 'mode'."
          }
        ]
      },
      {
        "story": "Como usuário, quero visualizar os próximos passos sugeridos pela IA após o resultado do passo atual.",
        "derivedRequirements": [
          {
            "description": "Exibir lista de próximos passos, se existirem, após o resultado.",
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
        "description": "Adicionar suporte a internacionalização (i18n) para todas as strings exibidas ao usuário.",
        "done": false,
        "comment": "Strings estão hardcoded, não há integração i18n."
      },
      {
        "description": "Melhorar acessibilidade adicionando roles e atributos ARIA nos elementos de tab.",
        "done": false,
        "comment": "Acessibilidade básica, mas sem roles ARIA específicas para tabs."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin displays a preview of AI task results, showing step details, task info, and possible next steps. It uses tabs for switching between info and results, with a responsive layout and custom styles.",
    "The main goal is to let users quickly view the outcome of an AI task step, switch between step/task details, and see suggested next steps.",
    "There are no current user bug reports or feature requests, but enhancements are suggested: add i18n support for all user-facing strings and improve accessibility with ARIA roles for tabs.",
    "Strings are hardcoded and accessibility for tabs is basic; future improvements should address these for better usability and internationalization."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9776,version:2"
}
    