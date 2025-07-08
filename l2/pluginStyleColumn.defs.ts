/// <mls shortName="pluginStyleColumn" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginStyleColumn",
    "type": "plugin",
    "group": "other",
    "tags": [
      "css",
      "layout",
      "columns",
      "styling"
    ]
  },
  "references": {
    "widgets": [
      "collab-ds-input-range-100554",
      "collab-ds-input-select-color-100554"
    ],
    "plugins": [],
    "statesRO": [
      "globalState._ica.less.left",
      "globalState._ica.less.right"
    ],
    "statesRW": [
      "globalState._ica.less.left.lessCSS.styles.columnCount",
      "globalState._ica.less.left.lessCSS.styles.columnGap",
      "globalState._ica.less.left.lessCSS.styles.columnSpan",
      "globalState._ica.less.left.lessCSS.styles.columnWidth",
      "globalState._ica.less.left.lessCSS.styles.columnRuleColor",
      "globalState._ica.less.left.lessCSS.styles.columnRuleStyle",
      "globalState._ica.less.left.lessCSS.styles.columnRuleWidth",
      "globalState._ica.less.left.lessCSS.styles.breakInside"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_stateLitElement",
      "./_100554_collabDecorators",
      "./_100554_collabState",
      "./_100554_collabLitElement",
      "./_100554_collabDsInputSelectColor",
      "./_100554_lessCSS",
      "./_100554_libCommom",
      "./_100554_collabDsInputSelectColor (duplicated import)",
      "./_100554_collabDsInputRange"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [
      "./_100554_collabDsInputSelectColor (duplicated import)"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "Gallery items use h5 elements but lack proper heading hierarchy",
      "Select elements lack aria-label or proper labeling",
      "Interactive elements should have focus indicators",
      "Color inputs should have accessible color descriptions"
    ],
    "i18nWarnings": [
      "Gallery placeholder text 'Lorem ipsum dolor sit amet...' should be internationalized",
      "Select option values like 'none', 'auto', 'inherit' could benefit from localized descriptions"
    ],
    "correctness": 8,
    "errorHandling": 6,
    "readability": 7,
    "maintainability": 7
  },
  "auth": {},
  "planning": {
    "generalDescription": "Plugin para criação e ajuste de colunas de texto CSS, permitindo configurar propriedades como número de colunas, espaçamento, regras e quebras.",
    "goal": "Fornecer uma interface visual intuitiva para configuração de propriedades CSS relacionadas a colunas de texto, facilitando a criação de layouts multi-coluna.",
    "userStories": [
      {
        "story": "Como designer, quero configurar o número de colunas de um texto para criar layouts mais organizados",
        "derivedRequirements": [
          {
            "description": "Implementar controle para column-count",
            "done": true,
            "comment": "Implementado com collab-ds-input-range"
          },
          {
            "description": "Validar valores numéricos para contagem de colunas",
            "done": true
          }
        ]
      },
      {
        "story": "Como usuário, quero ajustar o espaçamento entre colunas para melhorar a legibilidade",
        "derivedRequirements": [
          {
            "description": "Implementar controle para column-gap",
            "done": true,
            "comment": "Implementado com diferentes unidades de medida"
          },
          {
            "description": "Suportar diferentes unidades de medida (px, em, rem, etc.)",
            "done": true
          }
        ]
      },
      {
        "story": "Como designer, quero adicionar regras visuais entre colunas para separação clara",
        "derivedRequirements": [
          {
            "description": "Implementar controles para column-rule (width, style, color)",
            "done": true,
            "comment": "Implementado com componente de seleção de cor"
          },
          {
            "description": "Suportar diferentes estilos de borda",
            "done": true
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar preview em tempo real das mudanças",
        "done": false,
        "comment": "Seria útil para melhor experiência do usuário"
      },
      {
        "description": "Implementar presets salvos pelo usuário",
        "done": false,
        "comment": "Permitiria reutilização de configurações"
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Corrigir imports duplicados",
        "done": false,
        "comment": "Remover import duplicado de _100554_collabDsInputSelectColor"
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade dos controles",
        "done": false,
        "comment": "Adicionar labels adequados e suporte a navegação por teclado"
      },
      {
        "description": "Implementar tratamento de erro mais robusto",
        "done": false,
        "comment": "Adicionar validações e feedback de erro"
      },
      {
        "description": "Otimizar performance do debounce",
        "done": false,
        "comment": "Considerar usar requestAnimationFrame para mudanças visuais"
      }
    ]
  },
  "textToEmbedding": [
    "This plugin provides a visual interface for configuring CSS columns,",
    "including column count, spacing, rules, and break-inside. The goal is to",
    "make multi-column layout creation intuitive for designers and users.",
    "Future requests include real-time preview, user presets, accessibility, and better error handling."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9860,version:2"
}
    