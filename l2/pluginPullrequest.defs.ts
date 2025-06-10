/// <mls shortName="pluginPullrequest" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginPullrequest",
    "type": "plugin",
    "group": "other",
    "tags": [
      "git",
      "pullrequest",
      "integration"
    ]
  },
  "references": {
    "plugins": [],
    "statesRO": [
      "mls.actual[5].project"
    ],
    "statesRW": [
      "error",
      "autoPrepare",
      "itens",
      "owner",
      "repo",
      "branch"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "_100554_pluginBaseModule",
      "_100554_libCommom"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct access to global 'mls' object without proper validation",
      "External URL opening with target='_blank' without rel='noopener noreferrer'"
    ],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "Links missing descriptive text for screen readers",
      "No ARIA labels for dynamic content updates",
      "Error messages should have proper ARIA live regions"
    ],
    "i18nWarnings": [],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 7
  },
  "auth": {},
  "planning": {
    "generalDescription": "Plugin para exibir pull requests abertos de um repositório Git, integrado ao sistema MLS",
    "goal": "Fornecer uma interface visual para visualizar e acessar pull requests abertos do projeto atual",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero visualizar todos os pull requests abertos do meu projeto para acompanhar o progresso das funcionalidades",
        "derivedRequirements": [
          {
            "description": "Implementar listagem de pull requests via API",
            "done": true,
            "comment": "Implementado através do método loadListPullRequest"
          },
          {
            "description": "Exibir informações básicas do PR (título, autor)",
            "done": true,
            "comment": "Implementado no renderItemListPull"
          }
        ]
      },
      {
        "story": "Como desenvolvedor, quero clicar em um pull request para abrir diretamente no navegador",
        "derivedRequirements": [
          {
            "description": "Implementar links clicáveis para cada PR",
            "done": true,
            "comment": "Links implementados com target='_blank'"
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar filtros por status do PR (draft, ready for review)",
        "done": false,
        "comment": "Funcionalidade não implementada"
      },
      {
        "description": "Mostrar data de criação e última atualização do PR",
        "done": false,
        "comment": "Informações não exibidas atualmente"
      },
      {
        "description": "Implementar refresh automático da lista",
        "done": false,
        "comment": "Apenas carregamento manual no prepare()"
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Melhorar tratamento de erro quando repositório não é encontrado",
        "done": false,
        "comment": "Erro genérico é exibido, poderia ser mais específico"
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Adicionar indicadores visuais para PRs com conflitos",
        "done": false,
        "comment": "Não há diferenciação visual entre tipos de PR"
      },
      {
        "description": "Implementar paginação para repositórios com muitos PRs",
        "done": false,
        "comment": "Lista todos os PRs sem paginação"
      },
      {
        "description": "Adicionar suporte a múltiplos repositórios",
        "done": false,
        "comment": "Atualmente limitado ao repositório do projeto atual"
      }
    ]
  }
}
    