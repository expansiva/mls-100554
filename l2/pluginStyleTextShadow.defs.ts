/// <mls shortName="pluginStyleTextShadow" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginStyleTextShadow",
    "type": "plugin",
    "group": "other",
    "tags": [
      "text-shadow"
    ]
  },
  "references": {
    "widgets": [
      "collab-ds-input-range-100554",
      "collab-ds-input-select-color-100554"
    ],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "state",
      "showFull",
      "position",
      "textShadow",
      "offSetX",
      "offSetY",
      "textBlur",
      "color"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_stateLitElement",
      "./_100554_collabDecorators",
      "./_100554_collabState",
      "./_100554_collabLitElement",
      "./_100554_lessCSS",
      "./_100554_libCommom",
      "./_100554_collabDsInputSelectColor",
      "./_100554_collabDsInputRange"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct use of CSSStyleSheet and insertRule may have security implications if ruleSelector or ruleText are user-controlled. Ensure no user input is injected unsanitized."
    ],
    "unusedImports": [
      "repeat",
      "property"
    ],
    "deadCodeBlocks": [
      "The private arrayGallery is defined but never used in the code."
    ],
    "accessibility": [
      "Component uses semantic HTML for grouping and labels. However, gallery items are rendered as <h5> elements with click handlers, which is not ideal for accessibility. Consider using <button> or <a> with proper aria-labels for interactive elements.",
      "No explicit tabindex or keyboard navigation for gallery items.",
      "No aria-* attributes present. Consider adding for better screen reader support."
    ],
    "i18nWarnings": [
      "The string 'Item' in the gallery is not internationalized.",
      "Some error/info messages (e.g., console.info('change')) are not internationalized, but these are for dev only."
    ],
    "correctness": 8,
    "errorHandling": 6,
    "readability": 7,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Plugin para gerenciar e personalizar propriedades de sombra de texto (text-shadow) em CSS, permitindo ajustes de deslocamento, desfoque e cor, além de uma galeria de presets.",
    "goal": "Facilitar a aplicação e customização de sombras em textos de forma visual e intuitiva.",
    "userStories": [
      {
        "story": "Como usuário, quero aplicar rapidamente diferentes estilos de sombra de texto para visualizar o efeito em tempo real.",
        "derivedRequirements": [
          {
            "description": "Exibir uma galeria de presets de text-shadow para seleção rápida.",
            "done": true,
            "comment": "Galeria implementada, mas acessibilidade pode ser melhorada."
          },
          {
            "description": "Permitir ajuste manual de offset X/Y, blur e cor.",
            "done": true,
            "comment": "Inputs de range e cor implementados."
          }
        ]
      },
      {
        "story": "Como usuário, quero que o plugin seja fácil de usar e acessível.",
        "derivedRequirements": [
          {
            "description": "Utilizar componentes de input acessíveis e com labels claros.",
            "done": false,
            "comment": "Inputs possuem labels, mas elementos interativos na galeria não são acessíveis via teclado."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a múltiplas sombras (text-shadow múltiplo).",
        "done": false,
        "comment": "Não implementado, atualmente só suporta um valor de text-shadow por vez."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Ao selecionar um item da galeria, o valor não é refletido corretamente se o formato for inválido.",
        "done": false,
        "comment": "Necessário validar e tratar valores inválidos ao aplicar presets."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade dos itens da galeria, tornando-os navegáveis por teclado.",
        "done": false,
        "comment": "Atualmente só mouse, precisa de tabindex e roles apropriados."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin allows users to visually manage and customize CSS text-shadow properties.",
    "It provides a gallery of presets and manual controls for offset, blur, and color.",
    "Accessibility improvements are needed, especially for keyboard navigation in the gallery.",
    "Future enhancements include support for multiple shadows and better error handling for invalid values."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9808,version:2"
}
    