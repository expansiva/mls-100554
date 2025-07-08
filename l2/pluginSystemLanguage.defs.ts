/// <mls shortName="pluginSystemLanguage" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginSystemLanguage",
    "type": "plugin",
    "group": "other",
    "tags": [
      "i18n",
      "language",
      "settings"
    ]
  },
  "references": {
    "plugins": [
      "plugin-system-language-100554"
    ],
    "statesRO": [
      "actualLanguage"
    ],
    "statesRW": [
      "actualLanguage"
    ],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_pluginBaseModule"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct use of localStorage for user settings; consider XSS/CSRF risks.",
      "location.reload() used after language change; may disrupt unsaved state."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "SVG icon uses role and title for accessibility.",
      "No explicit aria-labels on select/button; consider adding for screen readers.",
      "Keyboard navigation is supported by default for select and button.",
      "Color contrast appears sufficient, but depends on theme variables."
    ],
    "i18nWarnings": [
      "Option values 'Default', 'pt-BR', 'en-US' in select are not internationalized."
    ],
    "correctness": 9,
    "errorHandling": 7,
    "readability": 9,
    "maintainability": 9
  },
  "planning": {
    "generalDescription": "Este plugin permite ao usuário selecionar e alterar o idioma da interface do sistema, armazenando a preferência no localStorage e recarregando a página para aplicar a mudança.",
    "goal": "Oferecer uma interface simples para troca de idioma, suportando internacionalização e persistência da escolha do usuário.",
    "userStories": [
      {
        "story": "Como usuário, quero poder escolher o idioma da interface para usar o sistema no meu idioma preferido.",
        "derivedRequirements": [
          {
            "description": "Exibir opções de idioma disponíveis em um seletor.",
            "done": true,
            "comment": "Implementado via <select> no template."
          },
          {
            "description": "Persistir a escolha do idioma do usuário.",
            "done": true,
            "comment": "Salvo em localStorage."
          },
          {
            "description": "Aplicar a mudança de idioma imediatamente após seleção.",
            "done": true,
            "comment": "location.reload() é chamado após alteração."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a mais idiomas além de pt-BR e en-US.",
        "done": false,
        "comment": "Atualmente limitado a dois idiomas."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Idioma não persiste se localStorage estiver desabilitado.",
        "done": false,
        "comment": "Necessário fallback ou aviso ao usuário."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Permitir troca de idioma sem recarregar a página.",
        "done": false,
        "comment": "Atualmente depende de location.reload()."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin provides a UI for users to select and change the system language.",
    "It saves the user's language preference in localStorage and reloads the page to apply changes.",
    "Currently supports English and Portuguese, with requests for more languages and smoother switching.",
    "There are known issues if localStorage is disabled and improvement requests for no-reload language switching."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9760,version:2"
}
    