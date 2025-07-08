/// <mls shortName="pluginSiteMonitorDashboardErrors" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginSiteMonitorDashboardErrors",
    "type": "plugin",
    "group": "Site Monitor",
    "tags": [
      "dashboard",
      "monitoring",
      "errors",
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
      "autoPrepare"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "_100554_pluginBaseModule",
      "_100554_wcChart"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct innerHTML manipulation in prepare() method - potential XSS risk if data is not properly sanitized"
    ],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "Select element lacks proper labeling - should have aria-label or associated label",
      "Chart component may need aria-label for screen readers",
      "Missing focus management for dynamic content updates"
    ],
    "i18nWarnings": [],
    "correctness": 8,
    "errorHandling": 6,
    "readability": 8,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Plugin para monitoramento de erros HTTP em dashboards, exibindo estatísticas de códigos de erro em diferentes períodos de tempo através de gráficos de barras.",
    "goal": "Fornecer visualização clara e interativa dos erros HTTP do site, permitindo análise temporal para identificação de padrões e tendências de problemas.",
    "userStories": [
      {
        "story": "Como administrador do site, quero visualizar os erros HTTP em tempo real para identificar problemas rapidamente",
        "derivedRequirements": [
          {
            "description": "Implementar gráfico de barras para visualização de códigos de erro",
            "done": true,
            "comment": "Implementado usando wc-chart com dados estáticos"
          },
          {
            "description": "Criar filtros temporais (hoje, semana, mês, todos)",
            "done": true,
            "comment": "Select com opções implementado e funcional"
          }
        ]
      },
      {
        "story": "Como desenvolvedor, quero entender quais tipos de erro são mais frequentes para priorizar correções",
        "derivedRequirements": [
          {
            "description": "Exibir diferentes códigos de erro HTTP (400, 401, 403, 404, 405, 409)",
            "done": true,
            "comment": "Códigos implementados com dados de exemplo"
          },
          {
            "description": "Mostrar contagem de ocorrências por tipo de erro",
            "done": true,
            "comment": "Dados numéricos exibidos no gráfico"
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Integração com API real para dados dinâmicos de erro",
        "done": false,
        "comment": "Atualmente usa dados estáticos mockados"
      },
      {
        "description": "Adicionar alertas automáticos quando erros excedem limites",
        "done": false,
        "comment": "Funcionalidade não implementada"
      },
      {
        "description": "Exportar dados de erro para relatórios",
        "done": false,
        "comment": "Funcionalidade não disponível"
      },
      {
        "description": "Adicionar filtros por URL ou página específica",
        "done": false,
        "comment": "Apenas filtros temporais implementados"
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Corrigir typo 'mounth' para 'month' no filtro",
        "done": false,
        "comment": "Erro de digitação presente no código"
      },
      {
        "description": "Melhorar tratamento de erro quando chart não carrega",
        "done": false,
        "comment": "Falta validação de erro no prepare()"
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Adicionar loading state durante carregamento dos dados",
        "done": false,
        "comment": "Não há indicador de carregamento"
      },
      {
        "description": "Implementar cores diferentes para cada tipo de erro",
        "done": false,
        "comment": "Atualmente usa apenas uma cor (#f68a55)"
      },
      {
        "description": "Adicionar tooltips com informações detalhadas dos erros",
        "done": true,
        "comment": "Tooltip básico configurado no chartData"
      },
      {
        "description": "Melhorar acessibilidade com labels adequados",
        "done": false,
        "comment": "Faltam aria-labels e estrutura semântica"
      }
    ]
  },
  "textToEmbedding": [
    "This plugin provides a dashboard for monitoring HTTP errors, displaying bar charts",
    "with error code statistics over different time periods. Its goal is to offer clear,",
    "interactive visualization of site errors, helping users identify patterns and trends.",
    "Future improvements include dynamic API integration, alerts, better accessibility, and bug fixes."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9752,version:2"
}
    