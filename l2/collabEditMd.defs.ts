/// <mls shortName="collabEditMd" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "collabEditMd",
    "type": "widget",
    "group": "other",
    "tags": [
      "markdown",
      "editor",
      "lit",
      "collab"
    ]
  },
  "references": {
    "widgets": [
      "collab-edit-md-100554"
    ],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "value",
      "opened",
      "openedToolbar",
      "easyMDE",
      "editor"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct DOM manipulation via document.createElement and document.head.appendChild for loading external scripts. This can be a vector for XSS if script src is not trusted.",
      "Direct access to window object (window.easymdeLoaded, window['EasyMDE']) can cause issues in SSR or non-browser environments."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "No explicit aria-* attributes or roles found. The editor uses icons for actions (edit, finish), but these are <i> elements without accessible labels. Consider adding aria-label or role='button' for better accessibility.",
      "Keyboard navigation is not handled explicitly; users may have trouble toggling edit/preview without mouse.",
      "Contrast appears sufficient, but icon-only buttons may be hard to discover for screen readers."
    ],
    "i18nWarnings": [
      "String 'Type here...' used as placeholder should be internationalized if i18n is enabled."
    ],
    "correctness": 8,
    "errorHandling": 6,
    "readability": 7,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Widget de editor Markdown colaborativo baseado em LitElement, integrando EasyMDE para edição e visualização de Markdown. Permite alternar entre modos de edição e visualização, com interface customizada e integração de ícones FontAwesome.",
    "goal": "Fornecer um editor Markdown fácil de integrar, com alternância rápida entre edição e visualização, pronto para uso em sistemas colaborativos.",
    "userStories": [
      {
        "story": "Como usuário, quero editar textos em Markdown com visualização instantânea para facilitar a formatação de documentos.",
        "derivedRequirements": [
          {
            "description": "Permitir alternância entre modo de edição e visualização com um clique.",
            "done": true,
            "comment": "Implementado via ícones de lápis e check."
          },
          {
            "description": "Carregar EasyMDE dinamicamente apenas quando necessário.",
            "done": true,
            "comment": "Script é carregado apenas se não estiver presente."
          }
        ]
      },
      {
        "story": "Como desenvolvedor, quero integrar facilmente o editor em páginas existentes sem dependências pesadas.",
        "derivedRequirements": [
          {
            "description": "Expor o valor do editor via propriedade e getter.",
            "done": true,
            "comment": "Propriedade value e getter text implementados."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a atalhos de teclado para alternar entre edição e visualização.",
        "done": false,
        "comment": "Não implementado; atualmente só via mouse."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Ao alternar rapidamente entre edição e visualização, o estado dos ícones pode ficar inconsistente.",
        "done": false,
        "comment": "Possível race condition; requer debounce ou controle de estado mais robusto."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Internacionalizar o placeholder e mensagens do editor.",
        "done": false,
        "comment": "Placeholder 'Type here...' está hardcoded."
      }
    ]
  },
  "textToEmbedding": [
    "This widget provides a collaborative Markdown editor using LitElement and EasyMDE.",
    "It allows toggling between edit and preview modes with custom icons and dynamic script loading.",
    "User requests include keyboard shortcut support and i18n for placeholder text.",
    "A known bug is icon state inconsistency when toggling quickly; accessibility improvements are also suggested."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9804,version:2"
}
    