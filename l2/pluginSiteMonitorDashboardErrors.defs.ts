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
  }
}
    