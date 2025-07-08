/// <mls shortName="pluginStyleBoxShadow" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginStyleBoxShadow",
    "type": "plugin",
    "group": "other",
    "tags": [
      "box-shadow",
      "css",
      "styling",
      "visual-editor"
    ]
  },
  "references": {
    "widgets": [
      "collab-ds-input-select-color-100554",
      "collab-ds-input-range-100554"
    ],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "globalState._ica.less[this.position]"
    ],
    "statesWO": [],
    "imports": [
      "_100554_stateLitElement",
      "_100554_collabDecorators",
      "_100554_collabState",
      "_100554_collabLitElement",
      "_100554_lessCSS",
      "_100554_libCommom",
      "_100554_collabDsInputSelectColor",
      "_100554_collabDsInputRange"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [
      "repeat"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "Radio buttons have proper labels and name attributes for grouping",
      "Gallery items lack keyboard navigation support - consider adding tabindex and keyboard event handlers",
      "Color input component should have proper aria-label for screen readers",
      "Range inputs should have proper min/max values and step attributes for better accessibility"
    ],
    "i18nWarnings": [
      "Radio button labels 'outset' and 'inset' are not internationalized"
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 7
  },
  "auth": {},
  "planning": {
    "generalDescription": "Plugin para gerenciar e personalizar sombras CSS (box-shadow) de elementos, oferecendo controles intuitivos para ajustar offset, blur, spread, cor e modo (inset/outset).",
    "goal": "Fornecer uma interface visual amigável para configuração de box-shadow CSS, permitindo aos usuários criar efeitos de sombra profissionais sem conhecimento técnico avançado.",
    "userStories": [
      {
        "story": "Como designer, quero ajustar visualmente as sombras dos elementos para criar interfaces mais atrativas",
        "derivedRequirements": [
          {
            "description": "Implementar controles visuais para offset X e Y",
            "done": true,
            "comment": "Implementado com collab-ds-input-range"
          },
          {
            "description": "Adicionar seletor de cor para a sombra",
            "done": true,
            "comment": "Implementado com collab-ds-input-select-color"
          },
          {
            "description": "Criar galeria de presets de sombras",
            "done": true,
            "comment": "Galeria com 9 presets implementada"
          }
        ]
      },
      {
        "story": "Como desenvolvedor, quero que as alterações sejam aplicadas em tempo real no CSS",
        "derivedRequirements": [
          {
            "description": "Implementar sincronização com estado global CSS",
            "done": true,
            "comment": "Integrado com globalState._ica.less"
          },
          {
            "description": "Aplicar debounce nas mudanças para performance",
            "done": true,
            "comment": "Timeout de 100ms implementado"
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte para múltiplas sombras (box-shadow com vírgulas)",
        "done": false,
        "comment": "Atualmente suporta apenas uma sombra por vez"
      },
      {
        "description": "Implementar preview em tempo real da sombra",
        "done": false,
        "comment": "Seria útil ter uma área de preview visual"
      },
      {
        "description": "Adicionar mais presets na galeria",
        "done": false,
        "comment": "Galeria atual tem apenas 9 opções básicas"
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Parsing de cores nomeadas pode falhar em alguns casos",
        "done": false,
        "comment": "Método setValues2() tem lógica complexa de parsing que pode ser melhorada"
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade dos controles",
        "done": false,
        "comment": "Adicionar suporte a teclado na galeria e melhorar labels"
      },
      {
        "description": "Otimizar performance do parsing CSS",
        "done": false,
        "comment": "Método findCSSRuleInIframe cria stylesheet dinamicamente a cada chamada"
      },
      {
        "description": "Adicionar validação de valores de entrada",
        "done": false,
        "comment": "Não há validação para valores inválidos de CSS"
      }
    ]
  },
  "textToEmbedding": [
    "This plugin provides an intuitive UI for customizing CSS box-shadow properties.",
    "It allows users to adjust offset, blur, spread, color, and shadow mode visually.",
    "Feature requests include multi-shadow support, live preview, and more presets.",
    "Known bugs involve color parsing, and enhancements focus on accessibility and validation."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9812,version:2"
}
    