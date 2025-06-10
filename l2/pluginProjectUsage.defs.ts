/// <mls shortName="pluginProjectUsage" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginProjectUsage",
    "type": "plugin",
    "group": "other",
    "tags": [
      "dashboard",
      "analytics",
      "project-info"
    ]
  },
  "references": {
    "plugins": [],
    "statesRO": [
      "mls.actual[5].project",
      "mls.stor.files"
    ],
    "statesRW": [],
    "statesWO": [],
    "imports": [
      "_100554_pluginBaseModule",
      "_100554_libCommom",
      "_100554_libProjectConfig",
      "_100554_collabIcons"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "Plugin uses semantic HTML with proper header structure",
      "Details/summary elements provide good keyboard navigation",
      "Icons should have aria-labels for screen readers",
      "Consider adding role attributes for better accessibility"
    ],
    "i18nWarnings": [
      "String 'Total Files:' should be internationalized as it's user-facing content"
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "auth": {},
  "planning": {
    "generalDescription": "Plugin para exibir informações de uso e estatísticas do projeto atual, incluindo número de design systems, data da última modificação e total de arquivos.",
    "goal": "Fornecer uma visão geral rápida das métricas básicas do projeto para desenvolvedores e gestores no dashboard.",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero ver rapidamente as estatísticas básicas do meu projeto para entender seu estado atual",
        "derivedRequirements": [
          {
            "description": "Exibir número total de design systems configurados",
            "done": true,
            "comment": "Implementado através da propriedade designSystems"
          },
          {
            "description": "Mostrar data da última modificação do projeto",
            "done": true,
            "comment": "Implementado através da propriedade projectLastModified"
          },
          {
            "description": "Contar e exibir número total de arquivos",
            "done": true,
            "comment": "Implementado através da propriedade files"
          }
        ]
      },
      {
        "story": "Como gestor de projeto, quero visualizar métricas de uso em um formato organizado e legível",
        "derivedRequirements": [
          {
            "description": "Criar interface visual clara com cards e seções organizadas",
            "done": true,
            "comment": "Implementado com details-card e estrutura hierárquica"
          },
          {
            "description": "Usar ícones para melhor identificação visual",
            "done": true,
            "comment": "Implementado com ícones do collab_icons"
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar gráfico de evolução temporal dos arquivos",
        "done": false,
        "comment": "Propriedade chartData existe mas não está sendo utilizada"
      },
      {
        "description": "Incluir métricas de linhas de código por tipo de arquivo",
        "done": false
      },
      {
        "description": "Mostrar estatísticas de contribuidores do projeto",
        "done": false
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar tratamento de erros quando projeto não está disponível",
        "done": false,
        "comment": "Método prepare() tem verificações básicas mas poderia ser mais robusto"
      },
      {
        "description": "Adicionar loading state durante carregamento dos dados",
        "done": false
      },
      {
        "description": "Implementar refresh automático dos dados",
        "done": false
      }
    ]
  }
}
    