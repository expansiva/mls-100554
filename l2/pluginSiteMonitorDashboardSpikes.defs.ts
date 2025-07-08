/// <mls shortName="pluginSiteMonitorDashboardSpikes" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginSiteMonitorDashboardSpikes",
    "type": "plugin",
    "group": "site-monitor",
    "tags": [
      "dashboard",
      "monitoring",
      "analytics",
      "traffic"
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
      "Use of innerHTML in prepare() method with only basic HTML escaping. If chartData is ever sourced from user input or external APIs, this could be vulnerable to XSS.",
      "Direct DOM manipulation via innerHTML is generally discouraged in Lit-based components; consider using Lit's templating for safer rendering."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "The <select> element in the header lacks an explicit label or aria-label, which may hinder screen reader accessibility.",
      "The chart widget <wc-chart-100554> is injected via innerHTML and may lack ARIA attributes for screen readers.",
      "No keyboard navigation or focus management for dynamic chart updates.",
      "No visible focus indicators or tabindex management for interactive elements."
    ],
    "i18nWarnings": [
      "Option label 'mounth' (should be 'month') is hardcoded and not internationalized.",
      "Other select option labels ('Today', 'Week', 'All Time') are also hardcoded and not prepared for i18n."
    ],
    "correctness": 8,
    "errorHandling": 6,
    "readability": 8,
    "maintainability": 7
  },
  "auth": {},
  "planning": {
    "generalDescription": "Plugin para monitoramento de picos de tráfego em tempo real, fornecendo visualização gráfica de dados de requisições por hora com capacidade de filtragem por períodos.",
    "goal": "Permitir que administradores monitorem e analisem picos de tráfego do site para otimizar recursos e garantir estabilidade durante períodos de alta demanda.",
    "userStories": [
      {
        "story": "Como administrador do site, quero visualizar picos de tráfego por hora para identificar padrões de uso e otimizar a infraestrutura",
        "derivedRequirements": [
          {
            "description": "Implementar gráfico de linha com dados horários de tráfego",
            "done": true,
            "comment": "Implementado usando ECharts com dados mock"
          },
          {
            "description": "Adicionar marcadores para valores máximo, mínimo e médio",
            "done": true,
            "comment": "Configurado no chartData com markPoint e markLine"
          }
        ]
      },
      {
        "story": "Como usuário, quero filtrar os dados por diferentes períodos (hoje, semana, mês, todos) para análise temporal",
        "derivedRequirements": [
          {
            "description": "Implementar seletor de período com opções predefinidas",
            "done": true,
            "comment": "Select implementado com opções: today, week, month, all"
          },
          {
            "description": "Conectar filtro com atualização dos dados do gráfico",
            "done": true,
            "comment": "Método handleChange implementado para atualizar dados"
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Integrar com dados reais de analytics em vez de dados mock",
        "done": false,
        "comment": "Atualmente usa dados estáticos para demonstração"
      },
      {
        "description": "Adicionar alertas automáticos quando picos excedem thresholds definidos",
        "done": false,
        "comment": "Funcionalidade mencionada na documentação mas não implementada"
      },
      {
        "description": "Implementar exportação de dados do gráfico",
        "done": false,
        "comment": "Seria útil para relatórios e análises externas"
      },
      {
        "description": "Adicionar zoom e pan no gráfico para análise detalhada",
        "done": false,
        "comment": "Melhoraria a experiência de análise de dados"
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Corrigir typo 'mounth' para 'month' na opção do select",
        "done": false,
        "comment": "Erro de digitação na linha do HTML option"
      },
      {
        "description": "Melhorar tratamento de erro quando wc-chart não carrega",
        "done": false,
        "comment": "Não há fallback se o componente de chart falhar"
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade com labels adequados e suporte a teclado",
        "done": false,
        "comment": "Select e chart precisam de melhor suporte para screen readers"
      },
      {
        "description": "Adicionar loading state durante carregamento de dados",
        "done": false,
        "comment": "UX seria melhor com indicador de carregamento"
      },
      {
        "description": "Implementar responsividade para diferentes tamanhos de tela",
        "done": false,
        "comment": "Chart pode não se adaptar bem em dispositivos móveis"
      },
      {
        "description": "Adicionar tooltips informativos nos elementos da interface",
        "done": false,
        "comment": "Ajudaria usuários a entender melhor as funcionalidades"
      }
    ]
  },
  "textToEmbedding": [
    "This plugin provides real-time monitoring of website traffic spikes, displaying hourly request data in a line chart with filtering by period (today, week, month, all time).",
    "The main goal is to help administrators identify peak usage patterns and optimize infrastructure for stability during high demand.",
    "Current limitations include use of mock data, lack of real analytics integration, missing accessibility features, and no error fallback for chart loading.",
    "Future enhancements requested are real analytics integration, export, zoom/pan, better accessibility, loading states, mobile responsiveness, and informative tooltips."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9764,version:2"
}
    