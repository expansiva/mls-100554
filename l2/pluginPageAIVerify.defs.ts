/// <mls shortName="pluginPageAIVerify" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginPageAIVerify",
    "type": "plugin",
    "group": "other",
    "tags": [
      "lit",
      "ai",
      "verify",
      "in-development"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [],
    "statesRW": [],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_pluginBaseModule"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [
      "property",
      "queryAll",
      "repeat"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "O componente exibe apenas uma div com texto, sem elementos interativos. Não há problemas de acessibilidade, mas também não há melhorias como roles ou aria-label, pois não são necessários para o conteúdo atual."
    ],
    "i18nWarnings": [
      "O componente já utiliza i18n para a mensagem principal. Não há outras strings hardcoded que precisem ser internacionalizadas."
    ],
    "correctness": 10,
    "errorHandling": 8,
    "readability": 10,
    "maintainability": 10
  },
  "planning": {
    "generalDescription": "Plugin simples para exibir uma mensagem de status 'Em desenvolvimento' ou 'In development', com suporte a i18n, usando LitElement. Serve como placeholder para futuras funcionalidades de verificação de página por IA.",
    "goal": "Fornecer um ponto de entrada visual e técnico para futuras implementações de verificação de página por IA, garantindo já a estrutura de internacionalização e integração ao sistema de plugins.",
    "userStories": [
      {
        "story": "Como usuário, quero ver uma indicação clara de que a funcionalidade de verificação por IA está em desenvolvimento, para saber que o recurso ainda não está disponível.",
        "derivedRequirements": [
          {
            "description": "Exibir mensagem de status em diferentes idiomas conforme o idioma do sistema.",
            "done": true,
            "comment": "Implementado via sistema i18n no componente."
          },
          {
            "description": "Integrar o componente como plugin no sistema Collab.codes.",
            "done": true,
            "comment": "Registrado como custom element e plugin."
          }
        ]
      }
    ],
    "userRequestsFeatures": [],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Adicionar funcionalidades reais de verificação de página por IA no futuro.",
        "done": false,
        "comment": "Aguardando definição de requisitos e implementação."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin displays a simple status message ('In development') with i18n support using LitElement.",
    "It serves as a placeholder for future AI page verification features, already integrated as a plugin.",
    "No user feature requests or bug reports exist yet; one enhancement is planned: adding real AI verification functionality.",
    "The component is minimal, accessible, and ready for future expansion within the Collab.codes system."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9784,version:2"
}
    