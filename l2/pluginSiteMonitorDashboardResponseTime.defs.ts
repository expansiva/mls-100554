/// <mls shortName="pluginSiteMonitorDashboardResponseTime" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginSiteMonitorDashboardResponseTime",
    "type": "plugin",
    "group": "monitoring",
    "tags": [
      "dashboard",
      "performance",
      "charts"
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
      "lit",
      "lit/decorators.js",
      "./_100554_pluginBaseModule",
      "./_100554_wcChart"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Use of innerHTML in prepare() method - potential XSS vulnerability if data is not properly sanitized",
      "Direct DOM manipulation with innerHTML bypasses Lit's template system security"
    ],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "Select element lacks proper labeling - should have aria-label or associated label",
      "Chart component may need aria-label for screen readers",
      "No keyboard navigation considerations for chart interactions"
    ],
    "i18nWarnings": [],
    "correctness": 7,
    "errorHandling": 6,
    "readability": 8,
    "maintainability": 7
  },
  "auth": {},
  "planning": {
    "generalDescription": "Plugin para monitoramento de tempo de resposta de sites, exibindo dados em gráficos interativos com diferentes períodos de tempo",
    "goal": "Fornecer visualização clara e em tempo real dos tempos de resposta do site para identificar problemas de performance",
    "userStories": [
      {
        "story": "Como administrador do sistema, quero visualizar os tempos de resposta do meu site em diferentes períodos para identificar tendências de performance",
        "derivedRequirements": [
          {
            "description": "Implementar filtros de tempo (hoje, semana, 30 dias, todos os tempos)",
            "done": true,
            "comment": "Filtros implementados no select do header"
          },
          {
            "description": "Criar gráfico de linha mostrando evolução dos tempos de resposta",
            "done": true,
            "comment": "Gráfico implementado usando ECharts via wc-chart-100554"
          }
        ]
      },
      {
        "story": "Como desenvolvedor, quero ver métricas detalhadas como valores máximo, mínimo e médio dos tempos de resposta",
        "derivedRequirements": [
          {
            "description": "Adicionar markPoints para valores máximo e mínimo",
            "done": true,
            "comment": "Implementado na configuração do gráfico"
          },
          {
            "description": "Adicionar linha de média no gráfico",
            "done": true,
            "comment": "Implementado via markLine com tipo 'average'"
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar alertas quando tempo de resposta exceder threshold configurável",
        "done": false,
        "comment": "Funcionalidade não implementada - seria útil para monitoramento proativo"
      },
      {
        "description": "Implementar exportação dos dados do gráfico em CSV/Excel",
        "done": false,
        "comment": "Não há funcionalidade de exportação implementada"
      },
      {
        "description": "Adicionar comparação entre diferentes períodos",
        "done": false,
        "comment": "Atualmente só mostra um período por vez"
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Corrigir uso de innerHTML que pode causar vulnerabilidades XSS",
        "done": false,
        "comment": "Método prepare() usa innerHTML diretamente - deveria usar templates do Lit"
      },
      {
        "description": "Melhorar acessibilidade do componente select",
        "done": false,
        "comment": "Select não tem label adequado para screen readers"
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Implementar carregamento real de dados via API ao invés de dados mockados",
        "done": false,
        "comment": "Atualmente usa dados estáticos - precisa integrar com API real"
      },
      {
        "description": "Adicionar loading state durante carregamento dos dados",
        "done": false,
        "comment": "Não há indicador de carregamento implementado"
      },
      {
        "description": "Melhorar responsividade do gráfico em diferentes tamanhos de tela",
        "done": false,
        "comment": "Grid do gráfico pode precisar de ajustes para mobile"
      }
    ]
  },
  "textToEmbedding": [
    "This plugin provides real-time response time monitoring for websites, displaying data in interactive charts with selectable time filters.",
    "The main goal is to offer clear, up-to-date visualizations of site performance, helping users identify trends and issues quickly.",
    "Future requests include alerting on thresholds, data export, period comparison, and loading real data from APIs instead of static values.",
    "Known bugs involve XSS risk from innerHTML and accessibility issues with the select element; enhancements focus on loading states and mobile responsiveness."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9848,version:2"
}
    