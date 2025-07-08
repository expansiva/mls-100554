/// <mls shortName="collabInit" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "collabInit",
    "type": "widget",
    "group": "other",
    "tags": []
  },
  "references": {
    "widgets": [
      "collab-nav-1",
      "collab-nav-2",
      "collab-nav-3",
      "collab-sticky-notification"
    ],
    "plugins": [
      "_100554_pluginSystemPrivacyPolicy",
      "_100554_pluginSystemTermsOfService",
      "_100554_pluginCollabLogin"
    ],
    "statesRO": [
      "mls.api.common.getCookie('loginUser')",
      "localStorage.getItem('userSettings')",
      "navigator.language",
      "localStorage.getItem('_100554_serviceUserSettings_theme')",
      "window.matchMedia('(prefers-color-scheme: dark)').matches",
      "document.head.querySelector('base').href",
      "mls.stor.others.getDriver('github')",
      "mls.stor.others.getDriver('gitlab')",
      "mls.plugin.getAllMenuActions",
      "mls.l5.getProjectOrgIndex",
      "mls.actual[5].project",
      "getProjectDetails()"
    ],
    "statesRW": [
      "mls.actual[5].project",
      "mls.l5.setActualOrg",
      "collabNav1.services",
      "collabNav1.setAttribute('status', ...)",
      "nav3.args",
      "toolbar.state[7].right",
      "document.documentElement.lang",
      "document.documentElement.setAttribute('data-theme', ...)",
      "document.head.appendChild(style)"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_collabLitElement",
      "./_100554_libProjectConfig",
      "./_100554_collabManagerCoachMarks",
      "./_100554_designSystemBase",
      "./_100554_libCommom"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct DOM manipulation (document.head.appendChild, document.documentElement.lang, setAttribute) - ensure no XSS vectors.",
      "Direct use of localStorage and cookies - ensure sensitive data is not exposed.",
      "Dynamic import of drivers - ensure imported modules are trusted.",
      "No CSP or sanitization for style injection (tokensCss)."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [
      "//const lhLastPrj = localStorage.getItem('l5-last-project') || this.baseProject.toString();",
      "//localStorage.setItem('l5-last-project', lhLastPrj);",
      "//const lastPrj = lhLastPrj ? Number.parseInt(lhLastPrj, 10) : undefined;"
    ],
    "accessibility": [
      "Component sets <html lang> attribute based on user language, which is good.",
      "No visible focus management or ARIA attributes in this widget.",
      "No tabindex or keyboard navigation handling.",
      "No color/contrast handling in this code, but theme is set via data-theme."
    ],
    "i18nWarnings": [
      "Hardcoded strings in console.info and some comments, but UI is not rendered here.",
      "No user-facing strings in render() or HTML, so i18n risk is low."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Widget responsável pela inicialização do ambiente colaborativo Collab.codes, incluindo configuração de tema, idioma, drivers de colaboração (GitHub/GitLab), navegação, tokens CSS e carregamento de projetos.",
    "goal": "Garantir que o ambiente Collab.codes seja inicializado corretamente para cada usuário, respeitando preferências de idioma, tema, autenticação e serviços disponíveis.",
    "userStories": [
      {
        "story": "Como usuário, quero que o Collab.codes carregue meu idioma e tema preferidos automaticamente ao acessar o sistema.",
        "derivedRequirements": [
          {
            "description": "Detectar idioma do navegador ou das configurações do usuário e aplicar ao HTML."
          },
          {
            "description": "Detectar tema (dark/light) do usuário ou do sistema operacional e aplicar ao HTML."
          }
        ]
      },
      {
        "story": "Como usuário anônimo, quero ser direcionado para o login ou visualizar políticas de privacidade/termos de uso conforme necessário.",
        "derivedRequirements": [
          {
            "description": "Detectar se o usuário é anônimo e abrir tela de login automaticamente."
          },
          {
            "description": "Abrir detalhes de política de privacidade ou termos de uso conforme parâmetros da URL."
          }
        ]
      },
      {
        "story": "Como usuário autenticado, quero ver meus serviços e navegação personalizada conforme meu projeto atual.",
        "derivedRequirements": [
          {
            "description": "Carregar serviços do projeto e configurar navegação personalizada."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Permitir configuração de idiomas adicionais além de en-US e pt-BR.",
        "done": false,
        "comment": "Atualmente só aceita en-US e pt-BR; expansão futura possível."
      },
      {
        "description": "Adicionar suporte a temas customizados além de dark/light.",
        "done": false,
        "comment": "Só suporta dark/light; custom themes não implementados."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Problema ao carregar avatar em alguns navegadores.",
        "done": false,
        "comment": "Necessário validar se o avatarUrl está correto e acessível."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade adicionando ARIA e foco de teclado.",
        "done": false,
        "comment": "Sem suporte explícito a acessibilidade no momento."
      }
    ]
  },
  "textToEmbedding": [
    "This widget initializes the Collab.codes environment, setting language, theme, and drivers.",
    "It handles anonymous and authenticated users, loads project services, and manages navigation.",
    "Feature requests include support for more languages and custom themes, and improved accessibility.",
    "Known bug: avatar loading issues in some browsers; accessibility improvements are planned."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9776,version:2"
}
    