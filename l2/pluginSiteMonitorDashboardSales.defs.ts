/// <mls shortName="pluginSiteMonitorDashboardSales" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginSiteMonitorDashboardSales",
    "type": "plugin",
    "group": "dashboard",
    "tags": [
      "sales",
      "analytics",
      "chart",
      "pie-chart"
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
      "Use of innerHTML without proper sanitization - even with escapeHTML function, consider using safer alternatives like textContent or template literals"
    ],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "Select element lacks proper labeling - should have aria-label or associated label",
      "Chart component may need aria-label for screen readers",
      "No keyboard navigation support mentioned for chart interactions"
    ],
    "i18nWarnings": [],
    "correctness": 8,
    "errorHandling": 6,
    "readability": 8,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Plugin de dashboard para visualização de distribuição de vendas por produto usando gráfico de pizza interativo",
    "goal": "Fornecer uma visualização clara e interativa da distribuição de vendas por produto, permitindo análise rápida de performance e tomada de decisões baseada em dados",
    "userStories": [
      {
        "story": "Como gerente de vendas, quero visualizar a distribuição de vendas por produto em um gráfico de pizza para identificar rapidamente os produtos mais vendidos",
        "derivedRequirements": [
          {
            "description": "Implementar gráfico de pizza com dados de vendas por produto",
            "done": true,
            "comment": "Implementado usando wc-chart com dados mockados"
          },
          {
            "description": "Mostrar percentual de cada produto no total de vendas",
            "done": true,
            "comment": "Configurado no tooltip do gráfico"
          }
        ]
      },
      {
        "story": "Como usuário, quero filtrar os dados de vendas por período (hoje, semana, mês, todos) para analisar tendências temporais",
        "derivedRequirements": [
          {
            "description": "Implementar dropdown de filtros de período",
            "done": true,
            "comment": "Select com opções implementado no header"
          },
          {
            "description": "Conectar filtros com atualização dos dados do gráfico",
            "done": false,
            "comment": "Filtro implementado mas não conectado com dados reais - apenas chama prepare()"
          }
        ]
      },
      {
        "story": "Como usuário, quero ver informações detalhadas ao passar o mouse sobre cada seção do gráfico para obter insights específicos",
        "derivedRequirements": [
          {
            "description": "Configurar tooltip interativo no gráfico",
            "done": true,
            "comment": "Tooltip configurado mostrando nome, valor e percentual"
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar modo de visualização em tabela além do gráfico de pizza",
        "done": false,
        "comment": "Não implementado - apenas modo gráfico disponível"
      },
      {
        "description": "Implementar exportação dos dados em CSV/Excel",
        "done": false,
        "comment": "Funcionalidade não implementada"
      },
      {
        "description": "Adicionar comparação com período anterior",
        "done": false,
        "comment": "Não implementado - apenas dados do período atual"
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Corrigir erro de digitação 'mounth' para 'month' na opção do select",
        "done": false,
        "comment": "Typo identificado na opção 'Last 30 days'"
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar tratamento de erro quando dados não estão disponíveis",
        "done": false,
        "comment": "Não há tratamento de erro para falha no carregamento de dados"
      },
      {
        "description": "Adicionar loading state durante carregamento dos dados",
        "done": false,
        "comment": "Não há indicador visual de carregamento"
      },
      {
        "description": "Implementar responsividade para dispositivos móveis",
        "done": false,
        "comment": "Layout pode não ser otimizado para telas pequenas"
      },
      {
        "description": "Adicionar animações de transição entre mudanças de filtro",
        "done": false,
        "comment": "Mudanças de dados são instantâneas sem transições suaves"
      }
    ]
  }
}
    