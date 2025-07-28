/// <mls shortName="collabIcaTree" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "collabIcaTree",
    "type": "widget",
    "group": "other",
    "tags": [
      "lit",
      "tree",
      "ica",
      "collab"
    ]
  },
  "references": {
    "widgets": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_utilsLit",
      "./_100554_serviceBase",
      "./_100554_collabLitElement",
      "./_100554_icaLitElementBase"
    ],
    "statesRO": [
      "messages",
      "message_en",
      "message_pt"
    ],
    "statesRW": [
      "msg",
      "myParent",
      "servicePreview",
      "idLastClick"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct DOM manipulation via querySelector and shadowRoot access may expose the component to XSS or DOM clobbering if not properly sandboxed.",
      "Use of setTimeout for UI updates can cause race conditions if DOM changes unexpectedly.",
      "No explicit sanitization for dynamic HTML content, though usage appears controlled."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [
      "//<span class=\"mls-gpbtnslider-item fa classLock\" @click=\"${this.setLock}\"></span> // commented out, not used"
    ],
    "accessibility": [
      "No explicit aria-* attributes found; consider adding for better screen reader support.",
      "Keyboard navigation is not handled; tree navigation should support arrow keys and focus management.",
      "Contrast and focus styles are partially handled via CSS, but not fully accessible.",
      "Tabindex is not set; users may have difficulty navigating via keyboard."
    ],
    "i18nWarnings": [
      "Button titles like 'move', 'remove', 'lock', 'lock open' are hardcoded and not internationalized.",
      "Consider extracting all user-facing strings to i18n messages."
    ],
    "correctness": 8,
    "errorHandling": 6,
    "readability": 7,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Widget para exibir e manipular uma árvore de componentes ICA em uma interface colaborativa baseada em LitElement. Permite navegação, seleção, drag-and-drop e operações de grupo sobre elementos ICA.",
    "goal": "Facilitar a visualização, organização e manipulação de componentes ICA em uma estrutura hierárquica, com suporte a operações de grupo e drag-and-drop.",
    "userStories": [
      {
        "story": "Como usuário, quero visualizar todos os componentes ICA em uma árvore para navegar facilmente entre eles.",
        "derivedRequirements": [
          {
            "description": "Renderizar árvore de componentes ICA baseada na estrutura DOM.",
            "done": true,
            "comment": "Implementado via getICAComponents e renderItemTree."
          }
        ]
      },
      {
        "story": "Como usuário, quero poder mover componentes ICA na árvore usando drag-and-drop.",
        "derivedRequirements": [
          {
            "description": "Implementar drag-and-drop entre elementos da árvore.",
            "done": true,
            "comment": "Função setDragDrop implementa lógica de drag-and-drop."
          }
        ]
      },
      {
        "story": "Como usuário, quero remover ou agrupar componentes ICA diretamente na árvore.",
        "derivedRequirements": [
          {
            "description": "Adicionar botões de ação para remover e agrupar elementos.",
            "done": true,
            "comment": "Botões de ação presentes em renderItemTree."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a navegação por teclado (acessibilidade).",
        "done": false,
        "comment": "Não implementado; navegação é apenas via mouse."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Drag-and-drop pode falhar se o DOM mudar durante a operação.",
        "done": false,
        "comment": "Possível race condition devido ao uso de setTimeout."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Internacionalizar todos os textos e títulos de botões.",
        "done": false,
        "comment": "Apenas mensagem principal está internacionalizada."
      }
    ]
  },
  "textToEmbedding": [
    "This widget displays and manages a hierarchical ICA component tree using LitElement.",
    "It supports navigation, selection, grouping, and drag-and-drop of ICA elements.",
    "Accessibility and i18n are partial; keyboard navigation and full string translation are pending.",
    "Future improvements include better accessibility and complete internationalization of UI strings."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9756,version:2"
}
    