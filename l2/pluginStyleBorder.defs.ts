/// <mls shortName="pluginStyleBorder" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginStyleBorder",
    "type": "plugin",
    "group": "other",
    "tags": [
      "border",
      "css",
      "style",
      "visual-editor"
    ]
  },
  "references": {
    "widgets": [
      "collab-ds-input-select-color-100554",
      "collab-ds-input-range-100554"
    ],
    "plugins": [],
    "statesRO": [
      "globalState._ica.less.left",
      "globalState._ica.less.right"
    ],
    "statesRW": [
      "globalState._ica.less.left.lessCSS.styles",
      "globalState._ica.less.right.lessCSS.styles"
    ],
    "statesWO": [],
    "imports": [
      "_100554_stateLitElement",
      "_100554_collabDecorators",
      "_100554_collabState",
      "_100554_collabLitElement",
      "_100554_collabDsInputSelectColor",
      "_100554_libCommom",
      "_100554_lessCSS",
      "_100554_collabIcons"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct manipulation of CSSStyleDeclaration without validation",
      "Dynamic CSS rule creation using CSSStyleSheet.insertRule with user input"
    ],
    "unusedImports": [],
    "deadCodeBlocks": [
      "Line with 'styles.breakInside' appears incomplete and unreachable"
    ],
    "accessibility": [
      "Good: Uses data-tooltip attributes for icon descriptions",
      "Good: Proper label association with checkboxes using 'for' attribute",
      "Missing: No ARIA labels for complex border controls",
      "Missing: No keyboard navigation support for gallery items"
    ],
    "i18nWarnings": [],
    "correctness": 8,
    "errorHandling": 6,
    "readability": 7,
    "maintainability": 7
  },
  "auth": {},
  "planning": {
    "generalDescription": "Plugin desenvolvido para facilitar a manutenção, personalização e validação de propriedades de borda em estilos CSS, oferecendo suporte a ajustes dinâmicos e regras específicas.",
    "goal": "Fornecer uma interface visual intuitiva para edição de propriedades CSS de borda, incluindo largura, estilo, cor e raio, com sincronização em tempo real com o estado global do sistema.",
    "userStories": [
      {
        "story": "Como designer, quero poder ajustar visualmente as bordas de elementos CSS para criar interfaces mais atrativas",
        "derivedRequirements": [
          {
            "description": "Implementar controles visuais para largura, estilo e cor da borda",
            "done": true,
            "comment": "Implementado com componentes collab-ds-input-select-color"
          },
          {
            "description": "Criar galeria de estilos pré-definidos para seleção rápida",
            "done": true,
            "comment": "Galeria implementada com 13 estilos diferentes"
          }
        ]
      },
      {
        "story": "Como desenvolvedor, quero que as alterações de borda sejam aplicadas em tempo real no CSS",
        "derivedRequirements": [
          {
            "description": "Sincronizar mudanças com o estado global do sistema",
            "done": true,
            "comment": "Implementado através do globalState._ica.less"
          },
          {
            "description": "Detectar e aplicar mudanças automaticamente",
            "done": true,
            "comment": "Implementado com handleIcaStateChange"
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte para bordas gradientes",
        "done": false,
        "comment": "Funcionalidade avançada não implementada"
      },
      {
        "description": "Implementar preview em tempo real das mudanças",
        "done": false,
        "comment": "Atualmente só aplica após confirmação"
      },
      {
        "description": "Adicionar mais opções de estilos de borda personalizados",
        "done": false,
        "comment": "Limitado aos estilos CSS padrão"
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Corrigir linha incompleta 'styles.breakInside' no método updateBorder",
        "done": false,
        "comment": "Código morto identificado que precisa ser removido"
      },
      {
        "description": "Melhorar tratamento de erro quando state.lessCSS é undefined",
        "done": false,
        "comment": "Verificações existem mas poderiam ser mais robustas"
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade com suporte completo a teclado",
        "done": false,
        "comment": "Galeria não suporta navegação por teclado"
      },
      {
        "description": "Adicionar validação de valores CSS antes da aplicação",
        "done": false,
        "comment": "Atualmente aplica valores sem validação prévia"
      },
      {
        "description": "Implementar undo/redo para mudanças de estilo",
        "done": false,
        "comment": "Funcionalidade de histórico não implementada"
      }
    ]
  },
  "textToEmbedding": [
    "This plugin provides a visual interface for editing CSS border properties,",
    "including width, style, color, and radius, with real-time sync to global state.",
    "Users requested gradient borders, live preview, and more custom styles.",
    "Known bugs include dead code and weak error handling; accessibility and validation need improvement."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9788,version:2"
}
    