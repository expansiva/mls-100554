/// <mls shortName="pluginPageNavigation" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "other",
    "shortName": "pluginPageNavigation",
    "type": "plugin",
    "group": "navigation",
    "tags": [
      "lit-element",
      "drag-drop",
      "tree-view"
    ]
  },
  "references": {
    "widgets": [

    ],
    "plugins": [],
    "statesRO": [],
    "statesRW": [],
    "statesWO": [],
    "imports": [
      "_100554_utilsLit",
      "_100554_pluginBaseModule",
      "_100554_icaTypes",
      "_100554_wcdTypes",
      "_100554_wcdCommandDel",
      "_100554_wcdCommandMove",
      "_100554_icaBaseDescription"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct access to window.preview object without proper validation",
      "Direct manipulation of DOM elements via innerHTML potential risk",
      "Access to iframe contentDocument and contentWindow without security checks"
    ],
    "unusedImports": [],
    "deadCodeBlocks": [
      "Commented code block in renderItemTree method: //<span class=\"mls-gpbtnslider-item fa classLock\" @click=\"${this.setLock}\"></span>",
      "Commented code block in selectItem method with idLastClick logic"
    ],
    "accessibility": [
      "Missing ARIA labels for drag and drop functionality",
      "No keyboard navigation support for tree items",
      "Missing role attributes for tree structure",
      "No focus management for screen readers",
      "Drag and drop not accessible via keyboard"
    ],
    "i18nWarnings": [
      "Hard-coded title attributes: 'remove', 'lock', 'lock open'",
      "Icon symbols and UI feedback messages not internationalized"
    ],
    "correctness": 7,
    "errorHandling": 6,
    "readability": 8,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Plugin de navegação em árvore para componentes ICA com funcionalidade de drag-and-drop, permitindo visualizar, selecionar e reorganizar elementos da página de forma hierárquica.",
    "goal": "Fornecer uma interface intuitiva de navegação em árvore para elementos ICA com capacidades de edição através de drag-and-drop e operações de exclusão.",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero visualizar todos os componentes ICA da página em uma estrutura hierárquica para entender melhor a organização dos elementos",
        "derivedRequirements": [
          {
            "description": "Implementar varredura recursiva de elementos ICA no DOM",
            "done": true,
            "comment": "Implementado através do método getICAComponents com função reentrance"
          },
          {
            "description": "Criar representação visual em árvore dos componentes",
            "done": true,
            "comment": "Implementado com renderização usando lit-html e repeat"
          }
        ]
      },
      {
        "story": "Como desenvolvedor, quero poder reorganizar elementos através de drag-and-drop para modificar a estrutura da página rapidamente",
        "derivedRequirements": [
          {
            "description": "Implementar funcionalidade de drag-and-drop para elementos da árvore",
            "done": true,
            "comment": "Implementado com handlers para mouse e touch events"
          },
          {
            "description": "Validar se elementos podem ser movidos para determinadas posições",
            "done": true,
            "comment": "Implementado usando canMoveElement function"
          },
          {
            "description": "Fornecer feedback visual durante operações de drag-and-drop",
            "done": true,
            "comment": "Implementado com bordas coloridas e classes CSS"
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte completo para navegação via teclado",
        "done": false,
        "comment": "Necessário para melhorar acessibilidade"
      },
      {
        "description": "Implementar funcionalidade de busca/filtro na árvore de componentes",
        "done": false,
        "comment": "Facilitaria navegação em páginas com muitos elementos"
      },
      {
        "description": "Adicionar indicadores visuais para diferentes tipos de componentes",
        "done": false,
        "comment": "Melhoraria a identificação rápida de elementos"
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Corrigir problemas de performance em páginas com muitos elementos",
        "done": false,
        "comment": "Otimizar renderização e eventos para melhor performance"
      },
      {
        "description": "Resolver inconsistências no feedback visual durante drag-and-drop",
        "done": false,
        "comment": "Padronizar comportamento entre mouse e touch events"
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar tratamento de erros e validações",
        "done": false,
        "comment": "Adicionar try-catch em mais operações críticas"
      },
      {
        "description": "Implementar undo/redo para operações de movimentação",
        "done": false,
        "comment": "Permitiria reverter mudanças acidentais"
      },
      {
        "description": "Adicionar tooltips informativos para elementos da árvore",
        "done": false,
        "comment": "Forneceria mais contexto sobre cada componente"
      }
    ]
  },
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small@compressed"
}
    