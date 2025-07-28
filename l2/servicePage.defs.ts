/// <mls shortName="servicePage" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "servicePage",
    "type": "page",
    "group": "other",
    "tags": [
      "lit",
      "service",
      "dynamic",
      "plugin",
      "ia"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [
      "msg",
      "pluginsIA",
      "pluginIALoaded"
    ],
    "statesRW": [
      "activeTab",
      "pluginNav",
      "pluginProp",
      "pluginsIA",
      "pluginIALoaded"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_serviceBase",
      "./_100554_utilsLit",
      "./_100554_wcdToolboxItemActionEditAttrOut"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Use of unsafeHTML in renderNavigation() can lead to XSS if pluginNav is not sanitized.",
      "Dynamic import paths in loadPlugins() could be abused if plugin names are not controlled."
    ],
    "unusedImports": [
      "css"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "No explicit aria-* attributes found; accessibility depends on child components.",
      "Tab navigation is handled via state, but keyboard accessibility is not explicit.",
      "No focus management or skip links present.",
      "Color tokens in LESS suggest good contrast, but not verified in markup."
    ],
    "i18nWarnings": [
      "Strings in menu.options (Details, Navigation, Properties, IA) are not internationalized.",
      "Tooltip 'Page' in details is not internationalized."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Componente de página de serviço para Collab.codes, exibindo detalhes, navegação, propriedades e integrações IA via plugins dinâmicos. Utiliza LitElement, suporta internacionalização parcial, e carrega widgets/plugins conforme contexto do projeto.",
    "goal": "Oferecer uma interface flexível para manipulação e visualização de informações de página, com suporte a plugins dinâmicos e IA, facilitando a extensão e customização pelo usuário.",
    "userStories": [
      {
        "story": "Como usuário, quero visualizar detalhes, navegar, editar propriedades e acessar recursos IA de uma página, para gerenciar eficientemente objetos e widgets.",
        "derivedRequirements": [
          {
            "description": "Exibir abas para detalhes, navegação, propriedades e IA.",
            "done": true,
            "comment": "Implementado via activeTab e renderContent()."
          },
          {
            "description": "Carregar plugins dinamicamente conforme o contexto do projeto.",
            "done": true,
            "comment": "loadPlugins() e setPluginIA() implementam essa lógica."
          },
          {
            "description": "Internacionalizar mensagens e dicas de interface.",
            "done": false,
            "comment": "Só parcialmente implementado; menu e tooltips não estão traduzidos."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte completo a i18n para todos os textos visíveis ao usuário.",
        "done": false,
        "comment": "Somente mensagens principais estão traduzidas; menu e tooltips não."
      },
      {
        "description": "Melhorar acessibilidade com atributos aria e navegação por teclado.",
        "done": false,
        "comment": "Sem atributos aria ou foco explícito."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Permitir configuração de plugins IA por usuário.",
        "done": false,
        "comment": "Atualmente carrega todos os plugins IA disponíveis."
      }
    ]
  },
  "textToEmbedding": [
    "This page component provides a dynamic service interface for Collab.codes, allowing users to view details, navigate, edit properties, and access AI plugins.",
    "It uses LitElement and loads widgets/plugins dynamically based on project context. Partial i18n is present, but some UI strings are not translated.",
    "Security risks include use of unsafeHTML and dynamic imports. Accessibility and keyboard navigation are not fully addressed.",
    "Future improvements include full i18n support, better accessibility, and user-configurable AI plugins."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9768,version:2"
}
    