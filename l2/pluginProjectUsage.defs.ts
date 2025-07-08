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
    "unusedImports": [
      "html",
      "css",
      "svg"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "Semantic HTML is used with header and details/summary elements.",
      "Keyboard navigation is supported via details/summary.",
      "SVG icons lack aria-labels; consider adding for screen readers.",
      "No explicit role attributes for landmark regions; could be improved."
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
        "done": false,
        "comment": ""
      },
      {
        "description": "Mostrar estatísticas de contribuidores do projeto",
        "done": false,
        "comment": ""
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
        "done": false,
        "comment": ""
      },
      {
        "description": "Implementar refresh automático dos dados",
        "done": false,
        "comment": ""
      }
    ]
  },
  "textToEmbedding": [
    "This plugin provides a quick overview of project usage metrics, such as design systems count, last modification date, and total files. It targets developers and managers seeking fast project insights on the dashboard.",
    "Future requests include adding a file evolution chart, code line metrics by file type, and contributor statistics. There is also a need for better error handling, loading states, and auto-refresh features.",
    "No bugs are currently reported, but enhancements focus on robustness and user experience improvements.",
    "The plugin uses semantic HTML and i18n, but some user-facing strings are not yet internationalized. Accessibility could be improved with better icon labeling."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9816,version:2"
}
    