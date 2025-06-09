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
    "i18nWarnings": []
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
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small@compressed"
}
    