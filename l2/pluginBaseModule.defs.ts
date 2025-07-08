/// <mls shortName="pluginBaseModule" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginBaseModule",
    "type": "lib",
    "tags": [
      "abstract",
      "lit",
      "base",
      "plugin"
    ]
  },
  "references": {
    "imports": [
      "lit/decorators.js",
      "./_100554_stateLitElement"
    ],
    "statesRW": [
      "scope"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "O HTML contém apenas um <h1> estático, sem problemas aparentes de acessibilidade, mas como é um componente base abstrato, não há interface real para avaliar.",
      "Não há atributos aria-* ou navegação por teclado, o que é esperado para um componente base sem UI."
    ],
    "i18nWarnings": [
      "O texto '_100554_pluginBaseModule' no <h1> não está internacionalizado, mas parece ser apenas um marcador ou identificador técnico."
    ],
    "correctness": 10,
    "errorHandling": 10,
    "readability": 9,
    "maintainability": 10
  },
  "planning": {
    "generalDescription": "Classe base abstrata para módulos de plugin usando LitElement, fornecendo um escopo padrão e estrutura para renderização.",
    "goal": "Oferecer uma fundação reutilizável para plugins, padronizando o escopo e facilitando a extensão de funcionalidades.",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero criar plugins herdando de uma base comum para garantir consistência e facilitar manutenção.",
        "derivedRequirements": [
          {
            "description": "A classe base deve definir propriedades essenciais como 'scope' e exigir implementação do método render.",
            "done": true,
            "comment": "A propriedade 'scope' e o método abstrato 'render' já estão definidos."
          }
        ]
      }
    ],
    "userRequestsFeatures": [],
    "userRequestsBugs": [],
    "userRequestsEnhancements": []
  },
  "textToEmbedding": [
    "This is an abstract base class for plugin modules using LitElement.",
    "It standardizes the 'scope' property and enforces a render method for all derived plugins.",
    "The component is meant for developers to extend, ensuring consistency and maintainability.",
    "No user-facing UI or features are present; it serves as a technical foundation for plugin development."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9816,version:2"
}
    