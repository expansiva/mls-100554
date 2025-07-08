/// <mls shortName="pluginStyleTransform" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginStyleTransform",
    "type": "plugin",
    "group": "other",
    "tags": [
      "transform"
    ]
  },
  "references": {
    "widgets": [
      "collab-ds-input-range-100554",
      "collab-ds-input-select-color"
    ],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "state",
      "transform",
      "scaleX",
      "scaleY",
      "rotate",
      "translateX",
      "translateY",
      "skewX",
      "skewY"
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
      "./_100554_collabDsInputSelectColor",
      "./_100554_collabDsInputRange"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct usage of CSSStyleSheet and insertRule may have security implications if ruleSelector or property values are not sanitized. However, in this context, values are derived from internal state, not user input."
    ],
    "unusedImports": [
      "repeat"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "No explicit aria-* attributes or tabindex found. The component uses custom input widgets, which may or may not be accessible depending on their implementation. Ensure collab-ds-input-range-100554 supports keyboard navigation and screen readers.",
      "Contrast and font sizes appear to be handled via LESS tokens, which should be checked for sufficient contrast."
    ],
    "i18nWarnings": [
      "The string 'Item' in the gallery is not internationalized. All other UI strings are covered by i18n."
    ],
    "correctness": 8,
    "errorHandling": 6,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Plugin para manipulação de propriedades CSS transform, permitindo ao usuário ajustar escala, rotação, inclinação e translação de elementos de UI de forma visual e precisa. Inclui galeria de presets e integração com estado global.",
    "goal": "Oferecer uma interface intuitiva para editar transformações CSS em elementos, facilitando a criação de UIs dinâmicas.",
    "userStories": [
      {
        "story": "Como designer, quero ajustar visualmente as transformações CSS de um elemento para experimentar diferentes efeitos sem escrever código manualmente.",
        "derivedRequirements": [
          {
            "description": "Permitir ajuste de scale, rotate, skew e translate via sliders ou campos numéricos.",
            "done": true,
            "comment": "Implementado via collab-ds-input-range-100554 para cada propriedade."
          },
          {
            "description": "Exibir galeria de presets de transformações para seleção rápida.",
            "done": true,
            "comment": "Galeria implementada com exemplos de transformações."
          }
        ]
      },
      {
        "story": "Como desenvolvedor, quero que as transformações aplicadas sejam refletidas no estado global para integração com outros plugins.",
        "derivedRequirements": [
          {
            "description": "Atualizar o estado global ao alterar qualquer propriedade de transformação.",
            "done": true,
            "comment": "Função setState sincroniza transformações com globalState."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte para múltiplos seletores simultâneos.",
        "done": false,
        "comment": "Atualmente só manipula um seletor por vez."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Valores de transform podem não ser corretamente parseados se a string estiver fora do padrão esperado.",
        "done": false,
        "comment": "Função setValues2 pode falhar com formatos não previstos."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Internacionalizar todos os textos, incluindo o label 'Item' na galeria.",
        "done": false,
        "comment": "Falta i18n para 'Item' na renderização da galeria."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin provides a UI for editing CSS transform properties such as scale, rotate, skew, and translate. It features a gallery of preset transformations and updates the global state to reflect changes.",
    "Users can visually adjust transformations using sliders, making it easier to create dynamic and interactive UI elements without manual CSS coding.",
    "There is a feature request for supporting multiple selectors and a known bug regarding parsing of non-standard transform strings. Also, the gallery label 'Item' lacks i18n support.",
    "Future improvements include full internationalization and enhanced error handling for transform parsing."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9816,version:2"
}
    