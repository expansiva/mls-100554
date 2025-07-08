/// <mls shortName="serviceWorkspace" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "serviceWorkspace",
    "type": "widget",
    "group": "other",
    "tags": [
      "lit",
      "workspace",
      "collab",
      "service"
    ]
  },
  "references": {
    "widgets": [
      "service-workspace-100554"
    ],
    "plugins": [
      "plugin-github-l4-project-100554",
      "plugin-github-l4-issues-100554",
      "plugin-config-links-100554"
    ],
    "statesRO": [],
    "statesRW": [
      "msize",
      "activeTab"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_serviceBase",
      "./_100554_pluginGithubL4Project",
      "./_100554_pluginGithubL4Issues",
      "./_100554_pluginConfigLinks"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [],
    "deadCodeBlocks": [
      "onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) { }"
    ],
    "accessibility": [
      "No explicit aria-* attributes or tabindex found. As the widget is a container for plugins, accessibility depends on child plugins. Consider adding role and aria-label for the main container if used standalone."
    ],
    "i18nWarnings": [
      "Tooltip 'Workspace' and static string in renderChat() ('Here are the plugins that manage communication with the team, such as slack channels - under development') should be internationalized if i18n is enabled."
    ],
    "correctness": 9,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "O componente serviceWorkspace fornece uma interface de workspace para o sistema Collab.codes, integrando plugins para links, projetos, issues, requisitos e chat. Ele atua como um hub para navegação entre diferentes funcionalidades relacionadas ao gerenciamento de projetos colaborativos.",
    "goal": "Oferecer um workspace centralizado e extensível para equipes colaborarem em projetos, com fácil acesso a links, tarefas, backlog, requisitos e comunicação.",
    "userStories": [
      {
        "story": "Como usuário, quero alternar entre diferentes abas de funcionalidades (Links, Project, Issues, Requirements, Chat) para acessar rapidamente as ferramentas necessárias para o meu fluxo de trabalho.",
        "derivedRequirements": [
          {
            "description": "Implementar navegação por abas com estado persistente da aba ativa.",
            "done": true,
            "comment": "Implementado via activeTab e menu.tabs."
          },
          {
            "description": "Integrar plugins para cada funcionalidade principal.",
            "done": true,
            "comment": "Plugins integrados em métodos renderLinks, renderTasks, renderBackLog, renderRequirements, renderChat."
          }
        ]
      },
      {
        "story": "Como usuário, quero que o workspace seja responsivo e acessível para uso em diferentes dispositivos e por pessoas com necessidades especiais.",
        "derivedRequirements": [
          {
            "description": "Aplicar tokens de design e garantir responsividade via LESS.",
            "done": true,
            "comment": "Tokens de design presentes, mas responsividade depende do contexto externo."
          },
          {
            "description": "Adicionar atributos de acessibilidade quando necessário.",
            "done": false,
            "comment": "Atributos de acessibilidade não implementados explicitamente."
          }
        ]
      }
    ],
    "userRequestsFeatures": [],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Internacionalizar strings estáticas e tooltips.",
        "done": false,
        "comment": "Strings ainda hardcoded, i18n não implementado."
      },
      {
        "description": "Adicionar feedback visual ao alternar abas.",
        "done": false,
        "comment": "Não há feedback visual explícito no código atual."
      }
    ]
  },
  "textToEmbedding": [
    "This widget provides a workspace hub for Collab.codes, integrating plugins for links, project tasks, issues, requirements, and chat.",
    "Its goal is to centralize project collaboration tools, allowing users to switch between tabs for different functionalities.",
    "Some static strings and tooltips are not yet internationalized, and accessibility attributes are missing.",
    "Future enhancements include i18n support and improved visual feedback when switching tabs."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9792,version:2"
}
    