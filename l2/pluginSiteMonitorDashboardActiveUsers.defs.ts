/// <mls shortName="pluginSiteMonitorDashboardActiveUsers" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginSiteMonitorDashboardActiveUsers",
    "type": "plugin",
    "group": "other",
    "tags": [
      "dashboard",
      "monitoring",
      "analytics"
    ]
  },
  "references": {
    "widgets": [
      "wc-chart-100554"
    ],
    "plugins": [],
    "statesRO": [],
    "statesRW": [],
    "statesWO": [],
    "imports": [
      "./_100554_wcChart",
      "./_100554_pluginBaseModule"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Use of innerHTML in prepare() method - potential XSS vulnerability if data is not properly sanitized",
      "Direct DOM manipulation with innerHTML should be avoided in favor of template rendering"
    ],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "Select element lacks proper labeling - should have aria-label or associated label",
      "Chart component may need aria-label for screen readers",
      "No keyboard navigation considerations for interactive elements"
    ],
    "i18nWarnings": [],
    "correctness": 7,
    "errorHandling": 6,
    "readability": 8,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Plugin para monitoramento de usuários ativos em tempo real, diferenciando entre usuários anônimos e logados, com visualização em gráfico de linha e filtros temporais.",
    "goal": "Fornecer insights em tempo real sobre o número de usuários ativos no site, permitindo otimização de performance e melhor compreensão do engajamento dos usuários.",
    "userStories": [
      {
        "story": "Como administrador do site, quero visualizar o número de usuários ativos em tempo real para monitorar o tráfego e otimizar recursos do servidor",
        "derivedRequirements": [
          {
            "description": "Implementar gráfico de linha mostrando usuários ativos ao longo do tempo",
            "done": true,
            "comment": "Implementado usando wc-chart com dados mock"
          },
          {
            "description": "Separar visualização entre usuários anônimos e logados",
            "done": true,
            "comment": "Implementado com duas séries no gráfico"
          }
        ]
      },
      {
        "story": "Como usuário do dashboard, quero filtrar os dados por período (hoje, semana, mês, todos) para analisar tendências temporais",
        "derivedRequirements": [
          {
            "description": "Implementar dropdown com opções de filtro temporal",
            "done": true,
            "comment": "Select implementado com opções: today, week, month, all"
          },
          {
            "description": "Conectar filtros com atualização dos dados do gráfico",
            "done": false,
            "comment": "Filtro implementado mas não conectado com dados reais - usando dados mock estáticos"
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Integrar com dados reais de usuários ativos em vez de dados mock",
        "done": false,
        "comment": "Atualmente usa dados estáticos para demonstração"
      },
      {
        "description": "Adicionar alertas quando número de usuários exceder limites configuráveis",
        "done": false
      },
      {
        "description": "Implementar atualização automática dos dados em intervalos regulares",
        "done": false
      },
      {
        "description": "Adicionar métricas adicionais como tempo médio de sessão",
        "done": false
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Corrigir uso de innerHTML que pode causar vulnerabilidades XSS",
        "done": false,
        "comment": "Método prepare() usa innerHTML diretamente - deve usar template rendering"
      },
      {
        "description": "Melhorar tratamento de erros na preparação do gráfico",
        "done": false,
        "comment": "Não há tratamento de erro se o import do chart falhar"
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade adicionando labels apropriados aos elementos interativos",
        "done": false,
        "comment": "Select e gráfico precisam de melhor suporte para leitores de tela"
      },
      {
        "description": "Implementar modo responsivo para diferentes tamanhos de tela",
        "done": false
      },
      {
        "description": "Adicionar animações suaves nas transições de dados",
        "done": false
      },
      {
        "description": "Implementar cache local para melhorar performance",
        "done": false
      }
    ]
  }
}
    