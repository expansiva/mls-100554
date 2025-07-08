/// <mls shortName="pluginBaseIndex" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginBaseIndex",
    "type": "lib",
    "group": "plugin",
    "tags": [
      "abstract",
      "plugin",
      "base",
      "index"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [],
    "statesRW": [],
    "statesWO": [],
    "imports": []
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [],
    "deadCodeBlocks": [
      "export default \"disabled\"; // or: export default new Pluginxxx()"
    ],
    "accessibility": [
      "O HTML contém apenas um <h1> estático, sem problemas de acessibilidade detectados. Não há interatividade, navegação por teclado ou atributos ARIA necessários."
    ],
    "i18nWarnings": [
      "O texto do <h1> ('_100554_pluginBaseIndex') está hardcoded, mas parece ser apenas um identificador técnico. Não há outras strings relevantes para i18n."
    ],
    "correctness": 10,
    "errorHandling": 10,
    "readability": 10,
    "maintainability": 10
  },
  "planning": {
    "generalDescription": "Classe base abstrata para plugins, fornecendo contratos para menus, hooks e serviços. Serve como ponto de partida para implementação de plugins no sistema.",
    "goal": "Padronizar a criação de plugins, garantindo que todos implementem os métodos essenciais para integração no ecossistema Collab.codes.",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero criar plugins seguindo um padrão, para garantir integração e manutenção facilitada.",
        "derivedRequirements": [
          {
            "description": "Definir métodos abstratos para menus, hooks e serviços.",
            "done": true,
            "comment": "Os métodos getMenus, getHooks e getServices estão definidos como abstratos."
          },
          {
            "description": "Impedir instanciamento direto da classe base.",
            "done": true,
            "comment": "A classe é abstrata e exporta 'disabled' por padrão."
          }
        ]
      }
    ],
    "userRequestsFeatures": [],
    "userRequestsBugs": [],
    "userRequestsEnhancements": []
  },
  "textToEmbedding": [
    "This abstract base class defines contracts for plugin menus, hooks, and services.",
    "Its purpose is to standardize plugin creation, ensuring all plugins implement required integration points.",
    "No user feature requests, bug reports, or enhancements are currently associated with this component.",
    "The code is simple, correct, and highly maintainable, serving as a foundation for plugin development in Collab.codes."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9792,version:2"
}
    