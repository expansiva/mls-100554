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
    "statesRW": [
      "filter",
      "chartData",
      "autoPrepare",
      "mode"
    ],
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
  },
  "textToEmbedding": [
    "This plugin provides real-time monitoring of active users, distinguishing between anonymous and logged-in users, with a line chart and time filters.",
    "The main goal is to deliver instant insights on user activity, supporting performance optimization and user engagement analysis.",
    "Future requests include integration with real user data, configurable alerts, auto-refresh, and session metrics. Accessibility and error handling improvements are also needed.",
    "Known bugs involve XSS risk due to innerHTML usage and lack of error handling in chart preparation. Enhancements requested include better accessibility, responsive design, smooth animations, and local caching."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9820,version:2"
}
    