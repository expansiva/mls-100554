/// <mls shortName="pluginCollabCoreIndex" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginCollabCoreIndex",
    "type": "plugin",
    "group": "other",
    "tags": []
  },
  "references": {
    "widgets": [
      "_100554_servicePreview",
      "_100554_servicePreviewL1",
      "_100554_serviceDetail",
      "_100554_serviceCollabMessages",
      "_100554_serviceExploreProjects",
      "_100554_serviceDashboard",
      "_100554_serviceProject",
      "_100554_serviceWorkspace",
      "_100554_servicePanel",
      "_100554_serviceSave",
      "_100554_serviceProduct",
      "_100554_servicePage",
      "_100554_serviceSource",
      "_100554_serviceHistories",
      "_100554_serviceUser",
      "_100554_serviceSourceL1",
      "_100554_pluginExploreList",
      "_100554_pluginExploreStories",
      "_100554_pluginPageNavigation",
      "_100554_pluginPageProperties",
      "_100554_pluginPageAIVerify",
      "_100554_pluginPreviewResultJs",
      "_100554_pluginStyleBackground",
      "_100554_pluginStyleBorder",
      "_100554_pluginStyleClippath",
      "_100554_pluginStyleTextShadow",
      "_100554_pluginStyleTokens",
      "_100554_pluginStyleTransform",
      "_100554_pluginStyleFilter",
      "_100554_pluginStyleColumn",
      "_100554_pluginStyleMargin",
      "_100554_pluginStylePadding",
      "_100554_pluginStyleFlex",
      "_100554_pluginStyleCursor",
      "_100554_pluginStyleBoxShadow",
      "_100554_pluginLessPseudo",
      "_100554_pluginProjectUsage",
      "_100554_pluginProjectConfig",
      "_100554_pluginProjectInfo",
      "_100554_pluginProjectReadMe",
      "_100554_pluginProjectFindFiles",
      "_100554_pluginProjectDeleteFiles",
      "_100554_pluginPresenterRecorder",
      "_100554_pluginProjectRunTest",
      "_100554_pluginCollabLogin",
      "_100554_pluginSystemUser",
      "_100554_pluginSystemLanguage",
      "_100554_pluginSystemTheme",
      "_100554_pluginSystemNotification",
      "_100554_pluginSystemPrivacyPolicy",
      "_100554_pluginSystemTermsOfService",
      "_100554_pluginNewFilePage",
      "_100554_pluginNewFileService",
      "_100554_pluginNewFileWebComponent",
      "_100554_pluginNewFileBlank",
      "_100554_pluginAttrDataset"
    ],
    "plugins": [],
    "statesRO": [],
    "statesRW": [],
    "statesWO": [],
    "imports": [
      "./_100554_pluginBaseIndex"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [],
    "deadCodeBlocks": [
      "Comentado bloco de código para o widget '_100554_serviceAim' (não será executado enquanto comentado)."
    ],
    "accessibility": [
      "O HTML contém apenas um <h1> estático, sem problemas de acessibilidade detectados. Não há interatividade ou elementos que exijam foco ou atributos aria."
    ],
    "i18nWarnings": [],
    "correctness": 10,
    "errorHandling": 10,
    "readability": 9,
    "maintainability": 10
  },
  "auth": {
    "view": [
      "*"
    ],
    "edit": [
      "*"
    ],
    "use": [
      "*"
    ]
  },
  "planning": {
    "generalDescription": "Plugin central do Collab.codes que registra e organiza widgets, menus e integrações principais do sistema. Serve como ponto de entrada para menus, widgets e serviços do ecossistema Collab.codes.",
    "goal": "Fornecer um ponto centralizado para registro e organização dos principais widgets, menus e integrações do sistema Collab.codes.",
    "userStories": [
      {
        "story": "Como usuário do Collab.codes, quero acessar diferentes serviços, componentes e configurações do sistema a partir de um menu centralizado, para facilitar a navegação e o uso das funcionalidades.",
        "derivedRequirements": [
          {
            "description": "Registrar todos os widgets principais do sistema no plugin central.",
            "done": true,
            "comment": "Implementado via getMenus()."
          },
          {
            "description": "Permitir controle de acesso por escopo e prioridade nos menus.",
            "done": true,
            "comment": "Implementado via propriedades scope, priority e auth nos menus."
          },
          {
            "description": "Permitir fácil extensão e manutenção dos menus e widgets.",
            "done": true,
            "comment": "Estrutura baseada em arrays e objetos facilita manutenção."
          }
        ]
      }
    ],
    "userRequestsFeatures": [],
    "userRequestsBugs": [],
    "userRequestsEnhancements": []
  },
  "textToEmbedding": [
    "This plugin acts as the central registry for Collab.codes, organizing widgets, menus, and core system integrations. It provides a unified entry point for accessing services and components.",
    "The main goal is to centralize the registration and management of widgets and menus, ensuring easy navigation and extensibility within the Collab.codes ecosystem.",
    "No user feature requests, bug reports, or enhancement requests are currently registered for this plugin.",
    "The code is clean, highly maintainable, and implements access control and extensibility through structured menu definitions."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9808,version:2"
}
    