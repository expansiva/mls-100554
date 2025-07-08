/// <mls shortName="pluginTaskPreviewAgent" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginTaskPreviewAgent",
    "type": "plugin",
    "group": "other",
    "tags": [
      "lit",
      "ai",
      "task",
      "preview",
      "agent"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [
      "task",
      "step"
    ],
    "statesRW": [
      "prompts",
      "mode"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_collabLitElement",
      "./_100554_aiAgentBase",
      "./_100554_aiAgentHelper"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct assignment to innerHTML in replayForSupport may allow XSS if not sanitized. Ensure interaction.payload is trusted."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "SVGs used as buttons lack aria-labels; consider adding for screen readers.",
      "Tab navigation is implemented with buttons, which is good, but no explicit tabindex or aria-selected attributes.",
      "No evidence of keyboard focus styling beyond browser default.",
      "No explicit role or aria attributes for tab panels or details/summary."
    ],
    "i18nWarnings": [
      "Strings like 'Info', 'Inputs', 'Results', 'Step not Found.', 'Not found!', 'No input found!', 'Not next step', 'Step details', 'Task details', 'Advanced details', 'Execute', 'result: Ok', 'result: Erro' should be internationalized for multi-language support."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Este plugin exibe uma pré-visualização detalhada de tarefas e etapas de agentes de IA, permitindo ao usuário alternar entre informações, entradas e resultados de uma etapa de tarefa. Inclui recursos para reexecutar etapas para suporte e visualizar detalhes avançados.",
    "goal": "Fornecer uma interface clara e interativa para visualizar e depurar tarefas de agentes de IA, facilitando o suporte e a análise de execuções.",
    "userStories": [
      {
        "story": "Como usuário, quero visualizar detalhes de uma etapa de tarefa de IA, incluindo entradas, resultados e informações avançadas, para entender e depurar execuções.",
        "derivedRequirements": [
          {
            "description": "Exibir abas para alternar entre informações, entradas e resultados da etapa.",
            "done": true,
            "comment": "Implementado com botões de tabulação e renderização condicional."
          },
          {
            "description": "Permitir reexecução de etapas para suporte.",
            "done": true,
            "comment": "Função replayForSupport implementada e acionada por SVG."
          },
          {
            "description": "Mostrar detalhes da tarefa e da etapa, incluindo status, custo e rastreamento.",
            "done": true,
            "comment": "Renderização de detalhes em <details> com informações relevantes."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a internacionalização (i18n) para todos os textos exibidos.",
        "done": false,
        "comment": "Strings estão hardcoded em português e inglês; necessário extrair para arquivos de tradução."
      },
      {
        "description": "Melhorar acessibilidade com atributos ARIA e navegação por teclado.",
        "done": false,
        "comment": "Faltam roles, aria-labels e foco visual explícito."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Permitir customização do layout das abas e detalhes via slots ou propriedades.",
        "done": false,
        "comment": "Atualmente o layout é fixo e não permite customização externa."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin displays detailed previews of AI agent tasks and steps, allowing users to switch between info, inputs, and results. It supports step replay for support and advanced details inspection.",
    "The main goal is to provide a clear, interactive interface for viewing and debugging AI agent task executions, making support and analysis easier.",
    "Future requests include adding i18n support for all displayed texts and improving accessibility with ARIA attributes and better keyboard navigation.",
    "Enhancements suggested: allow layout customization for tabs and details via slots or properties. No critical bugs reported."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9828,version:2"
}
    