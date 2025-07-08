/// <mls shortName="collabDecorators" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "collabDecorators",
    "type": "lib",
    "group": "other",
    "tags": [
      "decorator",
      "lit",
      "state-management",
      "collab.codes"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [
      "user.name",
      "globalState.users[0].sex"
    ],
    "statesRW": [
      "ui.checked",
      "globalState.users[0].sex"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_collabState"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct DOM access via document.documentElement.lang may be problematic in SSR or shadow DOM contexts.",
      "No input sanitization for template string interpolation; risk if used with untrusted data."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "No accessibility issues detected in decorators themselves.",
      "No UI elements in .html except a heading; no aria attributes present."
    ],
    "i18nWarnings": [
      "Hardcoded strings in comments and documentation, but not in runtime code.",
      "No i18n mechanism in decorators, but supports attribute variations for language."
    ],
    "correctness": 9,
    "errorHandling": 8,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Esta biblioteca fornece decorators personalizados para integração dinâmica de propriedades com múltiplas fontes de dados no padrão LitElement, facilitando o binding entre atributos HTML, estados globais e variações de idioma. Permite leitura e escrita de estados globais, além de suportar variações linguísticas em atributos.",
    "goal": "Facilitar o desenvolvimento de componentes LitElement com binding dinâmico de propriedades a estados globais e suporte a variações de idioma, promovendo reatividade e flexibilidade.",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero decorar propriedades de componentes Lit para que possam ser ligadas dinamicamente a estados globais ou atributos HTML, facilitando a manutenção e internacionalização.",
        "derivedRequirements": [
          {
            "description": "Decorator deve permitir binding a estados globais via template string (ex: {{user.name}}).",
            "done": true,
            "comment": "Implementado em propertyCompositeDataSource e propertyDataSource."
          },
          {
            "description": "Decorator deve suportar variações de idioma em atributos (ex: label-pt, label-en).",
            "done": true,
            "comment": "Implementado em getAttributeValueWithVariation."
          },
          {
            "description": "Mudanças em propriedades devem refletir no estado global quando apropriado.",
            "done": true,
            "comment": "propertyDataSource faz persistência bidirecional."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Permitir binding de propriedades a múltiplos estados simultaneamente.",
        "done": false,
        "comment": "Atualmente, cada propriedade está ligada a um único estado por vez."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Adicionar suporte a fallback de idioma caso variação específica não exista.",
        "done": false,
        "comment": "Hoje já há fallback parcial, mas pode ser aprimorado para múltiplos níveis."
      }
    ]
  },
  "textToEmbedding": [
    "This library provides custom decorators for LitElement to enable dynamic property binding to global state and HTML attributes, supporting language variations.",
    "It allows properties to read and write from a shared state, and supports attribute-based language fallback for internationalization.",
    "Feature requests include multi-state binding and improved language fallback. No critical bugs reported.",
    "The decorators are designed for flexibility and reactivity in Collab.codes systems, focusing on maintainability and extensibility."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9840,version:2"
}
    