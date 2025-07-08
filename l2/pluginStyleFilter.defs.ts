/// <mls shortName="pluginStyleFilter" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginStyleFilter",
    "type": "plugin",
    "group": "other",
    "tags": [
      "filter",
      "css",
      "ui"
    ]
  },
  "references": {
    "widgets": [
      "collab-ds-input-range-100554",
      "collab-ds-input-selectcolor-100554"
    ],
    "plugins": [],
    "statesRO": [
      "globalState._ica.less"
    ],
    "statesRW": [
      "globalState._ica.less[this.position].emitter",
      "globalState._ica.less[this.position].lessCSS.styles"
    ],
    "statesWO": [],
    "imports": [
      "_100554_stateLitElement",
      "_100554_collabDecorators",
      "_100554_collabState",
      "_100554_collabLitElement",
      "_100554_lessCSS",
      "_100554_collabDsInputSelectColor",
      "_100554_collabDsInputRange"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [
      "_100554_collabDsInputSelectColor"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "Gallery images lack alt attributes for screen readers",
      "No keyboard navigation support for gallery items",
      "Missing aria-labels for filter controls",
      "No focus management for interactive elements"
    ],
    "i18nWarnings": [],
    "correctness": 8,
    "errorHandling": 6,
    "readability": 7,
    "maintainability": 7
  },
  "auth": {},
  "planning": {
    "generalDescription": "Plugin para aplicar e gerenciar filtros CSS em elementos visuais, oferecendo controles para propriedades como desfoque, brilho, contraste, saturação e outros efeitos visuais.",
    "goal": "Fornecer uma interface intuitiva para aplicação de filtros CSS com galeria de presets e controles individuais para cada propriedade de filtro.",
    "userStories": [
      {
        "story": "Como designer, quero aplicar filtros visuais rapidamente usando presets da galeria para acelerar meu workflow",
        "derivedRequirements": [
          {
            "description": "Implementar galeria de filtros pré-definidos",
            "done": true,
            "comment": "Galeria implementada com 7 presets diferentes"
          },
          {
            "description": "Permitir aplicação de filtros com um clique",
            "done": true,
            "comment": "Funcionalidade onGalleryClick implementada"
          }
        ]
      },
      {
        "story": "Como usuário avançado, quero controlar individualmente cada propriedade de filtro para ter controle preciso",
        "derivedRequirements": [
          {
            "description": "Criar controles individuais para cada filtro",
            "done": true,
            "comment": "Controles implementados para grayscale, blur, sepia, saturate, opacity, brightness, contrast, hue-rotate, invert"
          },
          {
            "description": "Sincronizar valores entre controles e estado CSS",
            "done": true,
            "comment": "Métodos setValues e mountValue implementados"
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar preview em tempo real dos filtros",
        "done": true,
        "comment": "Preview implementado através da galeria de imagens"
      },
      {
        "description": "Suporte a internacionalização",
        "done": true,
        "comment": "Sistema i18n implementado com suporte a PT e EN"
      },
      {
        "description": "Integração com sistema de estados CSS",
        "done": true,
        "comment": "Integração com ICSSState e globalState implementada"
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Corrigir sincronização entre valores dos controles e estado CSS",
        "done": true,
        "comment": "Métodos handleIcaStateChange e setValues implementados"
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade dos controles",
        "done": false,
        "comment": "Faltam aria-labels e suporte a navegação por teclado"
      },
      {
        "description": "Adicionar validação de valores de entrada",
        "done": false,
        "comment": "Não há validação dos valores dos filtros"
      },
      {
        "description": "Implementar sistema de undo/redo",
        "done": false,
        "comment": "Não implementado"
      }
    ]
  },
  "textToEmbedding": [
    "This plugin provides an interface for applying and managing CSS filters,",
    "including blur, brightness, contrast, and more. It features a gallery of",
    "presets for quick application and individual controls for each filter property.",
    "Accessibility improvements and input validation are planned for future updates."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9824,version:2"
}
    