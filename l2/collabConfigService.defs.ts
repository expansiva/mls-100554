/// <mls shortName="collabConfigService" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "collabConfigService",
    "type": "widget",
    "group": "other",
    "tags": [
      "lit",
      "service-config",
      "collab"
    ]
  },
  "references": {
    "widgets": [
      "collab-config-service-100554"
    ],
    "statesRO": [],
    "statesRW": [
      "currentScenario",
      "error",
      "positionToolbar",
      "actualLevel",
      "userServices",
      "avaliableServices"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_collabLitElement"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct DOM manipulation via el.parentElement?.querySelector('.groupHidden') may be fragile.",
      "No sanitization for service.tooltip, possible XSS if not controlled.",
      "Direct assignment to this.style.height in render() is not recommended in LitElement."
    ],
    "unusedImports": [
      "repeat"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "Radio buttons for position lack aria-labels; consider adding for clarity.",
      "Buttons and links are accessible, but <a> tags used as buttons should have role='button' and tabindex.",
      "No explicit keyboard navigation for service actions.",
      "Color contrast for .badge may be insufficient for some users."
    ],
    "i18nWarnings": [
      "Error messages like 'This service cannot be deactivated!' are not internationalized.",
      "Error messages like 'This service cannot be moved to this position!' are not internationalized.",
      "Error messages like 'This service is static, cannot be moved' are not internationalized."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Widget de configuração de serviços do Collab, permitindo ao usuário ativar, desativar, reordenar e customizar serviços disponíveis em uma barra lateral. Suporta múltiplos níveis e posições (esquerda/direita), com integração ao componente de navegação principal.",
    "goal": "Oferecer uma interface intuitiva para gerenciar quais serviços aparecem na barra lateral do Collab, permitindo personalização e controle pelo usuário.",
    "userStories": [
      {
        "story": "Como usuário, quero adicionar ou remover serviços da barra lateral para personalizar minha experiência.",
        "derivedRequirements": [
          {
            "description": "Permitir ativar/desativar serviços disponíveis.",
            "done": true,
            "comment": "Implementado via métodos activeService/desactiveService."
          }
        ]
      },
      {
        "story": "Como usuário, quero reordenar os serviços para priorizar os mais usados.",
        "derivedRequirements": [
          {
            "description": "Permitir mover serviços para cima/baixo na lista.",
            "done": true,
            "comment": "Implementado via método moveElement."
          }
        ]
      },
      {
        "story": "Como usuário, quero alternar a posição da barra de serviços (esquerda/direita).",
        "derivedRequirements": [
          {
            "description": "Permitir alternar entre as posições left/right.",
            "done": true,
            "comment": "Implementado via radio buttons e métodos onclickPositionLeft/Right."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a drag-and-drop para reordenação de serviços.",
        "done": false,
        "comment": "Atualmente só é possível mover via setas."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Mensagens de erro não são traduzidas conforme idioma selecionado.",
        "done": false,
        "comment": "Mensagens hardcoded em inglês."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade dos controles (aria-labels, navegação por teclado).",
        "done": false,
        "comment": "Controles básicos presentes, mas sem suporte completo a acessibilidade."
      }
    ]
  },
  "textToEmbedding": [
    "This widget allows users to configure which services appear in the Collab sidebar.",
    "Users can activate, deactivate, and reorder services, as well as switch sidebar position.",
    "There are requests for drag-and-drop reordering and improved accessibility.",
    "A known bug is that error messages are not internationalized according to the selected language."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9728,version:2"
}
    