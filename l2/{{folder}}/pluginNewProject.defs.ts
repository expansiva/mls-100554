/// <mls shortName="pluginNewProject" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "{{folder}}",
    "shortName": "pluginNewProject",
    "type": "plugin",
    "group": "other",
    "tags": []
  },
  "references": {
    "widgets": [
      "plugin-new-project-log-100554"
    ],
    "plugins": [],
    "statesRO": [],
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
      "Potentially weak password generation in getUniquePassword().",
      "Direct use of crypto.subtle.digestSync (browser compatibility and security)."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [
      "createInitialCoreIndex is implemented but commented out in onCreateProjectClick (dead path)."
    ],
    "accessibility": [
      "No explicit aria-* attributes found.",
      "Form fields use labels, which is good.",
      "No tabindex management for custom elements.",
      "Color contrast appears sufficient, but not explicitly checked.",
      "Keyboard navigation is possible for form fields, but custom card selection may need tabindex/focus management."
    ],
    "i18nWarnings": [
      "Some log/error strings in tryItem and onCreateProjectClick are not internationalized (e.g., 'Error statuscode 400', 'User name not found', 'Error not found org name')."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Plugin para criação de novos projetos no Collab.codes, integrando com provedores GitHub/GitLab, permitindo seleção de organização, time, visibilidade e modo de atualização (Pull Request). Gera arquivos iniciais e configurações automatizadas.",
    "goal": "Facilitar a criação de projetos padronizados e integrados ao fluxo Collab.codes, reduzindo erros manuais e acelerando o onboarding de novos repositórios.",
    "userStories": [
      {
        "story": "Como usuário, quero criar um novo projeto integrado ao Collab.codes, escolhendo organização, time, visibilidade e modo de atualização, para iniciar rapidamente um repositório pronto para uso.",
        "derivedRequirements": [
          {
            "description": "Permitir seleção de driver (GitHub/GitLab) e carregar organizações do usuário.",
            "done": true,
            "comment": "Implementado em renderStep1 e loadOrgsByDriver."
          },
          {
            "description": "Permitir seleção de organização e modo de atualização (Pull Request).",
            "done": true,
            "comment": "Implementado em renderStep2."
          },
          {
            "description": "Permitir seleção de time e visibilidade do projeto.",
            "done": true,
            "comment": "Implementado em renderStep3."
          },
          {
            "description": "Gerar arquivos iniciais (README, package.json, build.yml, etc) automaticamente.",
            "done": true,
            "comment": "Implementado em onCreateProjectClick e métodos auxiliares."
          },
          {
            "description": "Exibir logs de progresso e erros ao usuário.",
            "done": true,
            "comment": "Implementado em renderLogs e addLog."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a múltiplos times por organização.",
        "done": false,
        "comment": "Atualmente só há o time 'admin' fixo."
      },
      {
        "description": "Permitir customização dos arquivos iniciais gerados.",
        "done": false,
        "comment": "Templates são fixos no momento."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Erro ao validar nome de organização inexistente.",
        "done": true,
        "comment": "Tratado com mensagem de erro e validação em onOrgChanged."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade dos cards de seleção de modo de atualização.",
        "done": false,
        "comment": "Falta tabindex e foco visual."
      },
      {
        "description": "Internacionalizar todas as mensagens de erro e logs.",
        "done": false,
        "comment": "Algumas mensagens ainda estão hardcoded."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin enables users to create new Collab.codes projects, integrating with GitHub or GitLab. It guides users through selecting organization, team, visibility, and update mode, and automates the creation of initial files and configuration.",
    "The main goal is to streamline project setup, reduce manual errors, and accelerate onboarding by providing a standardized, automated workflow for new repositories.",
    "Future requests include support for multiple teams per organization and customizable initial file templates. Accessibility improvements and full i18n coverage are also desired.",
    "A known bug with organization validation has been addressed, but further enhancements for accessibility and error message translation remain open."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9820,version:2"
}
    