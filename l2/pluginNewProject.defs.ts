/// <mls shortName="pluginNewProject" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginNewProject",
    "type": "plugin",
    "group": "other",
    "tags": [
      "lit",
      "project-creation",
      "collab.codes",
      "wizard",
      "i18n",
      "frontend"
    ]
  },
  "references": {
    "widgets": [
      "plugin-new-project-log-100554"
    ],
    "plugins": [],
    "statesRO": [
      "driverSelected",
      "orgSelected",
      "loadingAdd1Msg",
      "orgsLoaded",
      "actualOrgs",
      "actualTeams",
      "isValidProjectName",
      "errorDriver",
      "logs"
    ],
    "statesRW": [
      "driverSelected",
      "orgSelected",
      "loadingAdd1Msg",
      "orgsLoaded",
      "actualOrgs",
      "actualTeams",
      "isValidProjectName",
      "errorDriver",
      "logs",
      "newProjectName",
      "newProjectNumber",
      "newProjectTeam",
      "newProjectVisibility",
      "newProjectUpdateMode",
      "driverName",
      "orgName",
      "instanceDriver",
      "login",
      "secret"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_collabLitElement",
      "./_100554_pluginNewProjectTemplate",
      "./_100554_collabIcons",
      "./_100554_pluginNewProjectLog"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Hardcoded username in getLoginUser().",
      "Potentially weak password generation in getUniquePassword() (uses Math.random and Date.now).",
      "No CSRF protection for form submission.",
      "No sanitization of user input for project name or org name."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [
      "createInitialCoreIndex is implemented but commented out in onCreateProjectClick (dead for now)."
    ],
    "accessibility": [
      "Labels are associated with inputs, but no explicit 'for' attribute.",
      "No aria-* attributes for error messages or progress bar.",
      "Keyboard navigation is possible, but focus management could be improved.",
      "Error messages use color only (red), which may not be sufficient for colorblind users.",
      "No tabindex management for custom elements."
    ],
    "i18nWarnings": [
      "Some log/error strings in tryItem and onCreateProjectClick are hardcoded in English (e.g., 'Error statuscode 400', 'User name not found', 'Error not found org name').",
      "getLoginUser() returns hardcoded 'Santiago', not localized."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Plugin para criação de novos projetos no Collab.codes, guiando o usuário por etapas de seleção de driver, organização, modo de atualização, time e visibilidade. Automatiza a criação do repositório, arquivos iniciais e configurações.",
    "goal": "Facilitar e padronizar a criação de novos projetos integrados ao Collab.codes, reduzindo erros e tempo manual.",
    "userStories": [
      {
        "story": "Como usuário, quero criar um novo projeto no Collab.codes, escolhendo driver, organização, modo de atualização, time e visibilidade, para iniciar rapidamente um repositório pronto para uso.",
        "derivedRequirements": [
          {
            "description": "Implementar wizard de múltiplas etapas para seleção de driver, organização, modo de atualização, time e visibilidade.",
            "done": true,
            "comment": "Wizard implementado com renderização condicional das etapas."
          },
          {
            "description": "Automatizar criação de repositório, arquivos iniciais e configurações.",
            "done": true,
            "comment": "Fluxo de criação automatizado com logs e feedback visual."
          },
          {
            "description": "Exibir logs de progresso e erros ao usuário.",
            "done": true,
            "comment": "Logs exibidos em tempo real na interface."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Permitir seleção de diferentes drivers (GitHub, GitLab).",
        "done": true,
        "comment": "Dropdown de drivers implementado."
      },
      {
        "description": "Atualizar lista de organizações do usuário dinamicamente.",
        "done": true,
        "comment": "Botão de atualização implementado."
      },
      {
        "description": "Permitir escolha entre modos de atualização (push, pull request).",
        "done": true,
        "comment": "Cards de seleção implementados, mas opção 'push' está oculta."
      },
      {
        "description": "Permitir seleção de time e visibilidade do projeto.",
        "done": true,
        "comment": "Dropdowns implementados."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Mensagem de erro ao tentar criar projeto com nome inválido.",
        "done": true,
        "comment": "Validação implementada e mensagem exibida."
      },
      {
        "description": "Erro ao não encontrar organização selecionada.",
        "done": true,
        "comment": "Tratamento de erro implementado."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Adicionar suporte a mais times além de 'admin'.",
        "done": false,
        "comment": "Atualmente só 'admin' é carregado; melhoria futura possível."
      },
      {
        "description": "Melhorar acessibilidade com aria-* e foco gerenciado.",
        "done": false,
        "comment": "Acessibilidade básica, mas pode ser aprimorada."
      },
      {
        "description": "Internacionalizar todas as mensagens, inclusive logs e erros dinâmicos.",
        "done": false,
        "comment": "Algumas mensagens ainda estão hardcoded."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin guides users through a multi-step wizard to create new projects in Collab.codes.",
    "It automates repository creation, initial file setup, and configuration, supporting GitHub and GitLab.",
    "Users can select organization, update mode, team, and project visibility, with real-time progress logs.",
    "Future improvements include better accessibility, more team options, and full i18n coverage."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9744,version:2"
}
    