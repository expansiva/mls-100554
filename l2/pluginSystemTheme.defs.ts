/// <mls shortName="pluginSystemTheme" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginSystemTheme",
    "type": "plugin",
    "group": "other",
    "tags": [
      "theme",
      "settings",
      "i18n",
      "lit"
    ]
  },
  "references": {
    "plugins": [
      "plugin-system-theme-100554"
    ],
    "statesRO": [
      "actualTheme"
    ],
    "statesRW": [
      "actualTheme"
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
      "Direct use of window.matchMedia for theme detection (acceptable, but be aware of browser compatibility).",
      "Direct use of location.reload() after theme change (may disrupt user workflow).",
      "No sanitization needed, but localStorage is used for theme persistence (safe for this use case)."
    ],
    "unusedImports": [
      "css"
    ],
    "deadCodeBlocks": [
      "async init() is defined but empty and only called by prepare()."
    ],
    "accessibility": [
      "No explicit aria-* attributes found.",
      "Theme selector is a native <select>, which is accessible.",
      "Button is focusable and uses semantic <button>.",
      "No tabindex or keyboard trap issues detected.",
      "Contrast depends on CSS variables, which should be checked for sufficient contrast."
    ],
    "i18nWarnings": [],
    "correctness": 9,
    "errorHandling": 7,
    "readability": 9,
    "maintainability": 9
  },
  "planning": {
    "generalDescription": "Plugin para seleção de tema (claro, escuro, padrão) no sistema Collab.codes. Permite ao usuário escolher o tema preferido, salva a escolha no localStorage e recarrega a página para aplicar. Suporte a internacionalização (i18n) para inglês e português.",
    "goal": "Oferecer ao usuário uma forma simples e acessível de alterar o tema visual do sistema, respeitando preferências do sistema operacional e persistindo a escolha.",
    "userStories": [
      {
        "story": "Como usuário, quero escolher entre tema claro, escuro ou padrão para personalizar a aparência do sistema.",
        "derivedRequirements": [
          {
            "description": "Exibir seletor de tema com opções 'Claro', 'Escuro' e 'Padrão'.",
            "done": true,
            "comment": "Implementado no <select> do template."
          },
          {
            "description": "Salvar escolha do usuário no localStorage.",
            "done": true,
            "comment": "Função setUserTheme implementada."
          },
          {
            "description": "Aplicar tema escolhido ao recarregar a página.",
            "done": true,
            "comment": "location.reload() chamado após alteração."
          },
          {
            "description": "Internacionalizar rótulos e opções do seletor.",
            "done": true,
            "comment": "Mensagens em inglês e português implementadas."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Permitir seleção de tema pelo usuário.",
        "done": true,
        "comment": "Funcionalidade principal implementada."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Evitar recarregar a página ao trocar o tema, aplicando dinamicamente.",
        "done": false,
        "comment": "Atualmente recarrega a página; melhoria possível para UX."
      },
      {
        "description": "Adicionar suporte a mais idiomas.",
        "done": false,
        "comment": "Atualmente apenas inglês e português."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin allows users to select between light, dark, or default themes.",
    "It saves the user's choice in localStorage and reloads the page to apply the theme.",
    "Internationalization is supported for English and Portuguese, with clear labels.",
    "Future improvements include dynamic theme switching without reload and more language support."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9728,version:2"
}
    