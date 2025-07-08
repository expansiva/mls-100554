/// <mls shortName="pluginStyleMargin" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginStyleMargin",
    "type": "plugin",
    "group": "other",
    "tags": [
      "margin*"
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
      "state.marginLeft",
      "state.marginRight",
      "state.marginTop",
      "state.marginBottom",
      "state.lessCSS",
      "state.lessCSS.lessAST",
      "state.lessCSS.lessAST.ast",
      "state.lessCSS.lessAST.toCamelCaseProperty",
      "state.lessCSS.selector"
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
      "./_100554_collabDsInputRange",
      "./_100554_collabIcons"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct usage of querySelector in setValues may be risky if selector is user-controlled.",
      "Dynamic CSSStyleSheet creation in findCSSRuleInIframe could be abused if ruleSelector is not sanitized."
    ],
    "unusedImports": [
      "repeat"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "Checkbox for margin lock uses label with for attribute, which is good.",
      "Icons use <i> tags with data-tooltip for hints, but no aria-labels or roles for screen readers.",
      "No explicit tabindex or keyboard navigation for gallery items.",
      "Color contrast appears sufficient, but not programmatically verified."
    ],
    "i18nWarnings": [
      "Tooltip strings for icons (data-tooltip) are translated, which is good.",
      "All visible strings are internationalized via i18n section."
    ],
    "correctness": 9,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Plugin para ajuste visual de margens em elementos CSS, com interface intuitiva, suporte a bloqueio de margens iguais e integração com estado global do Collab.codes.",
    "goal": "Permitir ao usuário configurar margens de elementos de forma rápida, visual e precisa, facilitando a padronização de layouts.",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero ajustar as margens dos elementos visualmente para garantir espaçamento consistente no layout.",
        "derivedRequirements": [
          {
            "description": "Exibir controles para cada margem (top, left, bottom, right) com suporte a múltiplas unidades.",
            "done": true,
            "comment": "Implementado via collab-ds-input-range-100554 e arraySelect."
          },
          {
            "description": "Permitir bloquear/desbloquear margens para edição simultânea.",
            "done": true,
            "comment": "Checkbox de lock implementado e sincronizado com valores."
          },
          {
            "description": "Mostrar galeria de presets de margens para seleção rápida.",
            "done": true,
            "comment": "Galeria implementada com exemplos práticos."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a unidades customizadas além das pré-definidas.",
        "done": false,
        "comment": "Não implementado, apenas unidades fixas disponíveis."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Ao alterar uma margem com lock ativado, nem sempre todos os campos sincronizam corretamente.",
        "done": false,
        "comment": "Necessário revisar sincronização dos inputs e estado."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade adicionando aria-labels e suporte total a teclado.",
        "done": false,
        "comment": "Atributos de acessibilidade ainda não implementados."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin allows users to visually adjust CSS margins for elements, supporting both individual and grouped (locked) margin editing. The interface includes a gallery of margin presets for quick selection and integrates with the Collab.codes global state.",
    "The main goal is to provide developers with a fast and precise way to set element spacing, ensuring consistent layouts. Margin values can be set in various units, and changes are reflected in the global style state.",
    "Future requests include support for custom units and improved accessibility, such as better keyboard navigation and ARIA labels. There is a known bug where margin lock synchronization may fail in some cases.",
    "All user-facing strings are internationalized, and the component is designed for maintainability and extensibility within the Collab.codes ecosystem."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9812,version:2"
}
    