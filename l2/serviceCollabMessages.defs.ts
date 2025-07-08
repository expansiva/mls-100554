/// <mls shortName="serviceCollabMessages" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "serviceCollabMessages",
    "type": "widget",
    "group": "other",
    "tags": [
      "lit",
      "collab",
      "messages",
      "tasks",
      "crm"
    ]
  },
  "references": {
    "widgets": [
      "collab-messages-add-100554",
      "collab-messages-chat-100554",
      "collab-tasks-100554",
      "collab-messages-settings-100554",
      "collab-messages-findtask-100554",
      "wc-image-100554"
    ],
    "imports": [
      "./_100554_coachMarks",
      "lit",
      "lit/decorators.js",
      "./_100554_serviceBase",
      "./_100554_aiAgentHelper",
      "./_100554_msgDBController",
      "./_100554_collabMessagesAdd",
      "./_100554_collabMessagesChat",
      "./_100554_wcImage",
      "./_100554_collabTasks",
      "./_100554_collabMessagesSettings",
      "./_100554_collabMessagesFindtask"
    ],
    "statesRO": [],
    "statesRW": [
      "dataLocal",
      "activeTab",
      "activeScenerie",
      "isLoadingThread",
      "userPerfil",
      "userThreads"
    ],
    "statesWO": []
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct use of localStorage without namespacing or expiration policy.",
      "Potential XSS risk: usage of innerHTML-like string interpolation in coach marks (text property).",
      "No sanitization for user-provided data in thread/user rendering.",
      "Error messages from API are directly thrown and set, could leak sensitive info."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "No explicit aria-* attributes found in main widget.",
      "Keyboard navigation depends on child widgets, not enforced here.",
      "Coach marks use images and tooltips, but no alt text or ARIA for images.",
      "Tab navigation is handled, but focus management is not explicit."
    ],
    "i18nWarnings": [
      "Menu and error strings like 'Reset onboarding', 'Settings', 'Find Task', 'Add Thread', 'Invalid option', 'Erro ao buscar threads', 'Erro ao salvar no localStorage', 'Erro ao carregar do localStorage' are not internationalized.",
      "Some error messages and menu labels are hardcoded in English/Portuguese."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Widget central para mensagens colaborativas, CRM, tarefas e docs, integrando navegação por abas, onboarding, threads e configurações. Utiliza LitElement e integra diversos widgets filhos para chat, tarefas, configurações e busca.",
    "goal": "Oferecer uma interface unificada para colaboração em mensagens, tarefas e documentos, com suporte a onboarding, threads, e integração com outros módulos do Collab.codes.",
    "userStories": [
      {
        "story": "Como usuário, quero alternar entre abas de CRM, Tarefas, Docs e Conexões para acessar diferentes funcionalidades colaborativas.",
        "derivedRequirements": [
          {
            "description": "Implementar navegação por abas com renderização condicional dos widgets filhos.",
            "done": true,
            "comment": "Tabs implementadas via activeTab e renderTabs()."
          }
        ]
      },
      {
        "story": "Como usuário, quero adicionar novas threads de mensagens para colaborar com outros membros.",
        "derivedRequirements": [
          {
            "description": "Permitir adicionar threads via widget dedicado e atualizar a lista de threads do usuário.",
            "done": true,
            "comment": "Função openAdd e integração com collab-messages-add-100554."
          }
        ]
      },
      {
        "story": "Como usuário, quero acessar configurações e redefinir o onboarding para personalizar minha experiência.",
        "derivedRequirements": [
          {
            "description": "Adicionar opções de menu para configurações e reset de onboarding.",
            "done": true,
            "comment": "Menu implementado com openSettings e resetOnBoarding."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte completo a internacionalização para todos os textos e mensagens do widget.",
        "done": false,
        "comment": "Parcialmente implementado, faltam strings do menu e erros."
      },
      {
        "description": "Melhorar acessibilidade com suporte a ARIA e navegação por teclado.",
        "done": false,
        "comment": "Atributos ARIA e foco não implementados explicitamente."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Erro ao salvar ou carregar dados do localStorage pode não ser tratado corretamente.",
        "done": false,
        "comment": "Tratamento de erro existe, mas apenas loga no console."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Adicionar feedback visual durante o carregamento de threads.",
        "done": false,
        "comment": "Exibe 'Loading...' mas pode ser melhorado com spinner ou barra de progresso."
      }
    ]
  },
  "textToEmbedding": [
    "This widget provides a unified interface for collaborative messages, CRM, tasks, and docs.",
    "It features tab navigation, onboarding, thread management, and settings, using LitElement.",
    "Future improvements include full i18n support, better accessibility, and enhanced loading feedback.",
    "Known issues: partial i18n, limited error handling for localStorage, and accessibility gaps."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9792,version:2"
}
    