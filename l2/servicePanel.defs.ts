/// <mls shortName="servicePanel" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "servicePanel",
    "type": "widget",
    "group": "other",
    "tags": [
      "lit",
      "panel",
      "collab"
    ]
  },
  "references": {
    "widgets": [
      "collab-panel-100554"
    ],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "msize",
      "inLoading",
      "activeTab",
      "myData"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_serviceBase",
      "./_100554_libCommom",
      "./_100554_collabPanel"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct DOM manipulation via style assignment (servicePanel.style.height).",
      "Potential XSS if myData or plugin data is not sanitized before rendering."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [
      "onServiceClick method is defined but never used."
    ],
    "accessibility": [
      "Input in filter lacks aria-label or descriptive label for screen readers.",
      "SVG icon in filter input does not have aria-hidden or role attributes.",
      "No explicit keyboard navigation/focus management for tab switching."
    ],
    "i18nWarnings": [
      "Strings like 'Filter plugins ...', 'History of the latest changes to the website in production - in development', and 'Panel' tooltip are hardcoded and not internationalized."
    ],
    "correctness": 8,
    "errorHandling": 6,
    "readability": 7,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Widget de painel de serviços para Collab.codes, exibindo plugins agrupados por categoria, com filtro e abas para navegação entre site e histórico.",
    "goal": "Facilitar a navegação e gerenciamento de plugins e histórico do site em um painel lateral integrado.",
    "userStories": [
      {
        "story": "Como usuário, quero visualizar e filtrar plugins disponíveis agrupados por categoria para encontrar rapidamente o que preciso.",
        "derivedRequirements": [
          {
            "description": "Exibir plugins agrupados por categoria no painel.",
            "done": true,
            "comment": "Implementado em renderItens e renderItem."
          },
          {
            "description": "Permitir filtragem de plugins por texto.",
            "done": true,
            "comment": "Implementado no método filter."
          }
        ]
      },
      {
        "story": "Como usuário, quero alternar entre abas para ver o site e o histórico de alterações.",
        "derivedRequirements": [
          {
            "description": "Implementar navegação por abas (Site/History).",
            "done": true,
            "comment": "Implementado via activeTab e menu.tabs."
          },
          {
            "description": "Exibir histórico de alterações na aba History.",
            "done": false,
            "comment": "Aba History exibe mensagem placeholder, funcionalidade ainda em desenvolvimento."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a internacionalização (i18n) para todos os textos exibidos.",
        "done": false,
        "comment": "Não implementado, textos estão hardcoded."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade do filtro e navegação por teclado.",
        "done": false,
        "comment": "Faltam atributos aria e foco gerenciável."
      }
    ]
  },
  "textToEmbedding": [
    "This widget provides a service panel for Collab.codes, displaying plugins grouped by category with filtering and tab navigation between site and history.",
    "The main goal is to facilitate plugin management and quick access to site history in a sidebar interface.",
    "Currently, the history tab is a placeholder and i18n is not implemented; accessibility improvements are also pending.",
    "Future enhancements include better accessibility and full internationalization support."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9820,version:2"
}
    