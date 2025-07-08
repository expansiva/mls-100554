/// <mls shortName="pluginStyleIndexItem" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginStyleIndexItem",
    "type": "plugin",
    "group": "other",
    "tags": [
      "ui-component",
      "interactive"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [
      "less.left",
      "less.right"
    ],
    "statesRW": [],
    "statesWO": [],
    "imports": [
      "_100554_collabLitElement",
      "_100554_cssHelperIndexBase",
      "_100554_utilsLit",
      "_100554_collabIcons"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Dynamic element creation with document.createElement using external tag conversion - potential XSS risk if tag names are not properly validated"
    ],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "Icons used as interactive elements lack proper ARIA labels or roles",
      "Click handlers on <i> elements should use button elements or proper ARIA roles",
      "No keyboard navigation support for interactive icons",
      "Missing focus indicators for interactive elements",
      "Icons should have aria-label or title attributes for screen readers"
    ],
    "i18nWarnings": [],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Um componente de item de índice de estilo que permite expandir/colapsar plugins, curtir itens, mostrar informações e alternar entre diferentes modos de visualização.",
    "goal": "Fornecer uma interface interativa para gerenciar e visualizar plugins de estilo com diferentes estados de expansão e funcionalidades de interação do usuário.",
    "userStories": [
      {
        "story": "Como usuário, quero poder expandir e colapsar itens de plugin para ver mais detalhes quando necessário",
        "derivedRequirements": [
          {
            "description": "Implementar estados de modo: collapsed, expanded, full",
            "done": true,
            "comment": "Implementado com propriedade mode e handlers correspondentes"
          },
          {
            "description": "Criar animações visuais para transições de estado",
            "done": true,
            "comment": "Animações CSS implementadas para rotação e heartbeat"
          }
        ]
      },
      {
        "story": "Como usuário, quero poder curtir/descurtir plugins para marcar meus favoritos",
        "derivedRequirements": [
          {
            "description": "Implementar funcionalidade de like/unlike com feedback visual",
            "done": true,
            "comment": "Implementado com animação de heartbeat e troca de ícones"
          },
          {
            "description": "Persistir estado de like do usuário",
            "done": false,
            "comment": "Estado é mantido apenas em memória, não há persistência"
          }
        ]
      },
      {
        "story": "Como usuário, quero ver informações detalhadas sobre cada plugin quando solicitado",
        "derivedRequirements": [
          {
            "description": "Implementar toggle de informações com descrição do plugin",
            "done": true,
            "comment": "Implementado com showInfo toggle e exibição condicional"
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a teclado para navegação e interação",
        "done": false,
        "comment": "Necessário para melhorar acessibilidade"
      },
      {
        "description": "Implementar persistência de preferências do usuário (likes, estados)",
        "done": false,
        "comment": "Atualmente apenas em memória"
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade com ARIA labels e roles apropriados",
        "done": false,
        "comment": "Ícones interativos precisam de melhor suporte para leitores de tela"
      },
      {
        "description": "Adicionar indicadores visuais de foco para navegação por teclado",
        "done": false,
        "comment": "Necessário para conformidade com padrões de acessibilidade"
      }
    ]
  },
  "textToEmbedding": [
    "This component provides an interactive UI for managing style plugins.",
    "It allows users to expand/collapse items, like plugins, and view details.",
    "Future requests include keyboard navigation, user preference persistence, and improved accessibility.",
    "Known issues: accessibility gaps (ARIA, focus), likes not persisted, and interactive icons lacking roles."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9828,version:2"
}
    