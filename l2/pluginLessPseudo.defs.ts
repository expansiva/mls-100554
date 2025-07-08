/// <mls shortName="pluginLessPseudo" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginLessPseudo",
    "type": "plugin",
    "group": "other",
    "tags": [
      "pseudo:*"
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
      "./_100554_stateLitElement",
      "./_100554_collabLitElement"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "thinking: O componente utiliza apenas elementos semânticos básicos (div, h2, ul, li). Não há atributos aria-* ou tabindex. Como é apenas informativo, não há problemas graves, mas poderia ser melhorado com roles ou landmarks para leitores de tela.",
      "action: Nenhum problema crítico, mas recomenda-se adicionar roles ou landmarks se o componente crescer em complexidade."
    ],
    "i18nWarnings": [
      "thinking: Todas as strings exibidas ao usuário estão internacionalizadas via objeto messages. Não há strings hardcoded no HTML ou TS fora do sistema i18n.",
      "action: Nenhum problema de i18n encontrado."
    ],
    "correctness": 10,
    "errorHandling": 9,
    "readability": 10,
    "maintainability": 10
  },
  "planning": {
    "generalDescription": "Plugin informativo sobre pseudo-classes e pseudo-elementos CSS, com exemplos e descrições internacionalizadas. Focado em auxiliar desenvolvedores a entender e aplicar seletores CSS de forma eficiente.",
    "goal": "Fornecer uma interface clara e acessível para consulta rápida de pseudo-classes e pseudo-elementos CSS, promovendo aprendizado e produtividade.",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero consultar rapidamente descrições e exemplos de pseudo-classes e pseudo-elementos CSS para aplicar estilos de forma correta e eficiente.",
        "derivedRequirements": [
          {
            "description": "Exibir lista de pseudo-classes CSS com descrições claras.",
            "done": true,
            "comment": "Implementado no render() com internacionalização."
          },
          {
            "description": "Exibir lista de pseudo-elementos CSS com descrições claras.",
            "done": true,
            "comment": "Implementado no render() com internacionalização."
          },
          {
            "description": "Permitir alternância automática de idioma conforme configuração global.",
            "done": true,
            "comment": "Implementado via getMessageKey e objeto messages."
          }
        ]
      }
    ],
    "userRequestsFeatures": [],
    "userRequestsBugs": [],
    "userRequestsEnhancements": []
  },
  "textToEmbedding": [
    "This plugin provides a clear, internationalized reference for CSS pseudo-classes and pseudo-elements.",
    "It aims to help developers quickly understand and apply CSS selectors with practical examples.",
    "All user-facing strings are internationalized, and the component is designed for accessibility and maintainability.",
    "No user requests, bugs, or enhancements are currently registered for this component."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9752,version:2"
}
    