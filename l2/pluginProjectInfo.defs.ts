/// <mls shortName="pluginProjectInfo" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginProjectInfo",
    "type": "plugin",
    "group": "other",
    "tags": [
      "dashboard",
      "project-info",
      "git-integration"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "project",
      "projectName",
      "projectDriver",
      "projectOrg",
      "projectOwner",
      "projectCreatedAt",
      "projectURL",
      "forks",
      "branches",
      "autoPrepare"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_pluginBaseModule",
      "./_100554_libProjectConfig"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct access to global mls object without proper validation",
      "Potential runtime error if mls.l5.getProjectDetails returns malformed JSON in getMyKeysBranch"
    ],
    "unusedImports": [
      "getConfigProject from ./_100554_libProjectConfig"
    ],
    "deadCodeBlocks": [
      "renderHeader method returns html``, making the actual header code unreachable",
      "renderInfoFork method is commented out in renderBody"
    ],
    "accessibility": [
      "Missing aria-labels for interactive elements such as details/summary",
      "SVG icon lacks alt text or aria-label",
      "No explicit keyboard navigation or tabindex management",
      "Details/summary could benefit from aria-expanded"
    ],
    "i18nWarnings": [],
    "correctness": 7,
    "errorHandling": 6,
    "readability": 8,
    "maintainability": 7
  },
  "auth": {},
  "planning": {
    "generalDescription": "Plugin para exibir informações detalhadas do projeto, incluindo metadados, forks e branches do repositório Git",
    "goal": "Fornecer uma interface centralizada para visualizar informações essenciais do projeto no dashboard",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero visualizar informações básicas do projeto para entender rapidamente o contexto e configurações",
        "derivedRequirements": [
          {
            "description": "Exibir nome, organização, proprietário e data de criação do projeto",
            "done": true,
            "comment": "Implementado no método renderInfo()"
          },
          {
            "description": "Mostrar driver e URL do projeto",
            "done": true,
            "comment": "Implementado no método setInfos()"
          }
        ]
      },
      {
        "story": "Como gerente de projeto, quero ver os forks e branches disponíveis para acompanhar o desenvolvimento distribuído",
        "derivedRequirements": [
          {
            "description": "Listar forks do repositório",
            "done": true,
            "comment": "Implementado mas comentado no renderBody()"
          },
          {
            "description": "Listar branches do repositório",
            "done": true,
            "comment": "Implementado mas não exibido na interface"
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte para múltiplos idiomas na interface",
        "done": true,
        "comment": "Sistema i18n implementado com suporte para PT e EN"
      },
      {
        "description": "Integração com API do Git para buscar informações em tempo real",
        "done": true,
        "comment": "Implementado através do driver de storage"
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Corrigir renderização do header que está retornando vazio",
        "done": false,
        "comment": "Método renderHeader() retorna html vazio, impedindo exibição do cabeçalho"
      },
      {
        "description": "Melhorar tratamento de erros no parsing de JSON",
        "done": false,
        "comment": "Método getMyKeysBranch() precisa de try-catch ao redor do JSON.parse"
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Adicionar indicadores visuais para status do projeto",
        "done": false,
        "comment": "Poderia incluir badges ou ícones para indicar saúde do projeto"
      },
      {
        "description": "Implementar cache para informações de forks e branches",
        "done": false,
        "comment": "Evitaria chamadas desnecessárias à API do Git"
      },
      {
        "description": "Melhorar acessibilidade com ARIA labels e navegação por teclado",
        "done": false,
        "comment": "Elementos interativos precisam de melhor suporte à acessibilidade"
      }
    ]
  },
  "textToEmbedding": [
    "This plugin displays detailed project info, including metadata, forks, and branches.",
    "Its goal is to centralize essential project data for quick dashboard access.",
    "User requests include i18n support, real-time Git integration, and improved error handling.",
    "Enhancements focus on visual status indicators, caching, and better accessibility for users."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9788,version:2"
}
    