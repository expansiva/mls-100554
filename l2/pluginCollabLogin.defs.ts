/// <mls shortName="pluginCollabLogin" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginCollabLogin",
    "type": "plugin",
    "group": "other",
    "tags": [
      "login",
      "oauth",
      "collab.codes",
      "auth",
      "plugin"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [
      "mls.l0.providersConnected",
      "mls.api.common.getCookie('loginUser')"
    ],
    "statesRW": [],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_pluginBaseModule"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Tokens (clientId/clientid) for Google, GitHub, and GitLab OAuth are hardcoded in the code. This is generally not recommended for production environments.",
      "Direct use of window.location.href for redirects can be a vector for open redirect attacks if not properly controlled.",
      "Direct manipulation of document.cookie for authentication state (logoff) may be insufficient for secure session management."
    ],
    "unusedImports": [
      "property (from lit/decorators.js) is imported but not used."
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "Buttons use semantic <button> elements, which is good for accessibility.",
      "SVG icons are used inline, but do not have aria-labels or roles for screen readers.",
      "No explicit keyboard navigation/focus management, but default browser behavior applies.",
      "No aria-* attributes present for additional accessibility context.",
      "Color contrast for some elements (e.g., .footer, .divider span) may be insufficient for visually impaired users, depending on the theme."
    ],
    "i18nWarnings": [
      "All user-facing strings are properly internationalized via the i18n message objects. No hardcoded untranslated strings found."
    ],
    "correctness": 9,
    "errorHandling": 7,
    "readability": 9,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Plugin de login para Collab.codes, permitindo autenticação via Google, GitHub e GitLab usando OAuth2. Exibe botões de login, estado de conexão e links para Termos de Serviço e Política de Privacidade.",
    "goal": "Oferecer uma interface de login unificada e segura para múltiplos provedores OAuth no Collab.codes.",
    "userStories": [
      {
        "story": "Como usuário, quero poder entrar no Collab.codes usando minha conta Google, GitHub ou GitLab para facilitar o acesso.",
        "derivedRequirements": [
          {
            "description": "Exibir botões de login para Google, GitHub e GitLab.",
            "done": true,
            "comment": "Implementado nos métodos renderButton e render."
          },
          {
            "description": "Mostrar o estado de conexão do provedor (conectado, pode conectar, pode desconectar, pode adicionar).",
            "done": true,
            "comment": "Implementado em getState e renderButton."
          },
          {
            "description": "Internacionalizar todas as mensagens e labels.",
            "done": true,
            "comment": "Implementado via objetos message_pt e message_en."
          },
          {
            "description": "Permitir logoff do usuário.",
            "done": true,
            "comment": "Implementado no método logoff e renderLogOff."
          },
          {
            "description": "Redirecionar corretamente para os fluxos OAuth de cada provedor.",
            "done": true,
            "comment": "Implementado nos métodos googleLogin, gitHubLogin, gitLabLogin."
          },
          {
            "description": "Exibir links para Termos de Serviço e Política de Privacidade.",
            "done": true,
            "comment": "Implementado em renderFooter."
          }
        ]
      }
    ],
    "userRequestsFeatures": [],
    "userRequestsBugs": [],
    "userRequestsEnhancements": []
  },
  "textToEmbedding": [
    "This plugin provides a unified login interface for Collab.codes, supporting Google, GitHub, and GitLab OAuth2 authentication.",
    "It displays login buttons, connection status, and links to Terms of Service and Privacy Policy, with all user-facing text fully internationalized.",
    "Security concerns include hardcoded OAuth tokens and direct use of window.location.href for redirects, which may pose risks if not handled carefully.",
    "Accessibility is mostly standard, but lacks aria-labels for SVGs and may have color contrast issues in some themes."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9784,version:2"
}
    