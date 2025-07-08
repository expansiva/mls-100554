/// <mls shortName="pluginBase" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginBase",
    "type": "lib",
    "group": "other",
    "tags": []
  },
  "references": {
    "widgets": [],
    "plugins": [
      "plugin-base-100554"
    ],
    "statesRO": [],
    "statesRW": [
      "scope"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "./_100554_collabLitElement",
      "lit/decorators.js"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "O componente é uma classe base abstrata sem interface visual além de um <h1> estático.",
      "Não há elementos interativos ou foco, portanto, não há problemas de acessibilidade detectáveis neste estágio."
    ],
    "i18nWarnings": [
      "O único texto visível é o <h1>_100554_pluginBase</h1>, que serve como marcador e não necessita de internacionalização."
    ],
    "correctness": 10,
    "errorHandling": 8,
    "readability": 9,
    "maintainability": 9
  },
  "planning": {
    "generalDescription": "Classe base abstrata para plugins no sistema Collab.codes, utilizando LitElement e fornecendo estrutura para descrição e SVG customizado.",
    "goal": "Fornecer uma base reutilizável e extensível para criação de plugins, padronizando propriedades e métodos essenciais.",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero criar plugins rapidamente a partir de uma base comum para garantir consistência e facilitar manutenção.",
        "derivedRequirements": [
          {
            "description": "A classe base deve ser abstrata e exigir implementação de métodos essenciais como getSvg e description.",
            "done": true,
            "comment": "Implementado via métodos abstratos e uso de LitElement."
          },
          {
            "description": "Deve expor propriedades comuns como 'scope' para configuração dos plugins.",
            "done": true,
            "comment": "Propriedade 'scope' já exposta e decorada."
          }
        ]
      }
    ],
    "userRequestsFeatures": [],
    "userRequestsBugs": [],
    "userRequestsEnhancements": []
  },
  "textToEmbedding": [
    "This is an abstract base class for plugins in Collab.codes, built with LitElement.",
    "It enforces implementation of a description and an SVG method for all derived plugins.",
    "The class exposes a 'scope' property for plugin configuration and aims for reusability.",
    "No user requests, bugs, or enhancements are currently registered for this component."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9792,version:2"
}
    