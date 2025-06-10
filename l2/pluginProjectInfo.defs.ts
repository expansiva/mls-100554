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
    "statesRW": [],
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
      "JSON.parse without try-catch in getMyKeysBranch method could throw runtime errors"
    ],
    "unusedImports": [
      "getConfigProject from ./_100554_libProjectConfig"
    ],
    "deadCodeBlocks": [
      "renderHeader method returns empty html`` making the header rendering code unreachable",
      "renderInfoFork method is commented out in renderBody"
    ],
    "accessibility": [
      "Missing aria-labels for interactive elements",
      "Details/summary elements could benefit from aria-expanded attributes",
      "No keyboard navigation considerations for custom elements",
      "Missing alt text or aria-labels for SVG icons"
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
  }
}
    