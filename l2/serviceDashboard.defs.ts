/// <mls shortName="serviceDashboard" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "serviceDashboard",
    "type": "widget",
    "group": "other",
    "tags": [
      "dashboard",
      "lit",
      "collab.codes"
    ]
  },
  "references": {
    "widgets": [
      "collab-tiles-100554"
    ],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "msize",
      "cssBreakPoint",
      "activeTab",
      "pluginsDash1",
      "pluginsDash2"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_serviceBase",
      "./_100554_libProjectConfig",
      "./_100554_libCommom",
      "./_100554_collabTiles"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct DOM access via shadowRoot.querySelector and shadowRoot.querySelectorAll. Ensure no user input is injected into selectors or attributes.",
      "No input sanitization for plugin/widgetConfig data. If these come from untrusted sources, risk of XSS exists."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [
      "default: ''; in switch (i.category) is a no-op and can be removed."
    ],
    "accessibility": [
      "No explicit aria-* attributes or keyboard navigation in the rendered HTML.",
      "Tiles and headings are rendered, but no focus management or roles for accessibility.",
      "Color and font variables are used, but actual contrast depends on theme variables."
    ],
    "i18nWarnings": [
      "Strings like 'Not found plugins', 'Dashboard', 'Example 1', 'Example 2', and tile titles are hardcoded and not internationalized."
    ],
    "correctness": 8,
    "errorHandling": 6,
    "readability": 7,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Widget de dashboard para Collab.codes, exibindo tiles dinâmicos baseados em plugins configurados por projeto. Permite alternar entre abas e renderiza diferentes conjuntos de plugins conforme a categoria.",
    "goal": "Oferecer uma interface de dashboard flexível e extensível, permitindo a visualização de diferentes plugins organizados em tiles e abas, com responsividade e integração ao sistema Collab.codes.",
    "userStories": [
      {
        "story": "Como usuário, quero visualizar diferentes dashboards de plugins organizados em abas para acessar rapidamente informações relevantes do projeto.",
        "derivedRequirements": [
          {
            "description": "Renderizar abas para alternar entre diferentes conjuntos de plugins.",
            "done": true,
            "comment": "Implementado via menu.tabs e activeTab."
          },
          {
            "description": "Carregar plugins dinamicamente conforme a configuração do projeto.",
            "done": true,
            "comment": "loadAndSetPlugins implementa essa lógica."
          },
          {
            "description": "Exibir mensagem amigável quando não houver plugins disponíveis.",
            "done": true,
            "comment": "Mensagem 'Not found plugins' exibida quando arrays estão vazias."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a internacionalização (i18n) para textos exibidos.",
        "done": false,
        "comment": "Strings estão hardcoded, i18n não implementado."
      },
      {
        "description": "Melhorar acessibilidade com suporte a teclado e atributos ARIA.",
        "done": false,
        "comment": "Sem suporte explícito a acessibilidade."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Permitir configuração dinâmica das abas e ícones via painel administrativo.",
        "done": false,
        "comment": "Atualmente, abas e ícones são estáticos no código."
      }
    ]
  },
  "textToEmbedding": [
    "This widget provides a dynamic dashboard for Collab.codes, displaying plugin tiles organized by tabs. It loads plugin configurations per project and renders them responsively.",
    "The main goal is to offer a flexible, extensible dashboard interface, allowing users to switch between plugin sets and view relevant project information in a tile-based layout.",
    "Future requests include adding i18n support for all user-facing strings and improving accessibility with ARIA attributes and keyboard navigation.",
    "Enhancements are suggested for dynamic tab/icon configuration via an admin panel. No critical bugs are reported, but security and accessibility improvements are needed."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9816,version:2"
}
    