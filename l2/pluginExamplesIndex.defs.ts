/// <mls shortName="pluginExamplesIndex" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginExamplesIndex",
    "type": "plugin",
    "group": "other",
    "tags": []
  },
  "references": {
    "widgets": [
      "_100554_pluginSiteMonitorDashboardErrors",
      "_100554_pluginSiteMonitorDashboardActiveUsers",
      "_100554_pluginSiteMonitorDashboardExpenses",
      "_100554_pluginSiteMonitorDashboardRegionalLatency",
      "_100554_pluginSiteMonitorDashboardResponseTime",
      "_100554_pluginSiteMonitorDashboardSales",
      "_100554_pluginSiteMonitorDashboardSpikes"
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
    "deadCodeBlocks": [],
    "accessibility": [
      "O HTML contém apenas um <h1> simples, sem problemas de acessibilidade evidentes, mas também sem recursos avançados como aria-* ou navegação por teclado. Recomenda-se expandir para melhor acessibilidade se o componente crescer."
    ],
    "i18nWarnings": [
      "O texto '_100554_pluginExamplesIndex' no <h1> não está internacionalizado. Se for exibido ao usuário final, considere usar i18n."
    ],
    "correctness": 10,
    "errorHandling": 10,
    "readability": 9,
    "maintainability": 9
  },
  "auth": {
    "view": [
      "admin",
      "editor",
      "author"
    ],
    "edit": [],
    "use": [],
    "restrictReason": "Os menus definidos neste plugin são restritos a usuários com papéis 'admin', 'editor' ou 'author', conforme especificado nos arrays 'auth' de cada menu."
  },
  "planning": {
    "generalDescription": "Plugin de exemplo que registra vários widgets de dashboard em diferentes categorias, com controle de acesso baseado em papéis de usuário.",
    "goal": "Fornecer exemplos de integração de widgets em dashboards, demonstrando uso de categorias, escopos e controle de acesso.",
    "userStories": [
      {
        "story": "Como administrador, quero ver diferentes widgets de monitoramento no dashboard para acompanhar métricas do sistema.",
        "derivedRequirements": [
          {
            "description": "Registrar widgets de monitoramento em diferentes categorias.",
            "done": true,
            "comment": "Implementado nos arrays de menus retornados por getMenus()."
          },
          {
            "description": "Restringir acesso aos widgets conforme o papel do usuário.",
            "done": true,
            "comment": "Cada menu define o array 'auth' com os papéis permitidos."
          }
        ]
      }
    ],
    "userRequestsFeatures": [],
    "userRequestsBugs": [],
    "userRequestsEnhancements": []
  },
  "textToEmbedding": [
    "This plugin registers multiple dashboard widgets in categories, with user role-based access.",
    "It demonstrates integration of widgets into dashboards, using categories, scopes, and access control.",
    "No user feature requests, bugs, or enhancements are currently tracked for this plugin.",
    "The main goal is to provide example integrations for monitoring widgets in a role-aware dashboard."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9756,version:2"
}
    