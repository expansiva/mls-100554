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
  }
}
    