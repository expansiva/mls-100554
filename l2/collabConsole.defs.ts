/// <mls shortName="collabConsole" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "collabConsole",
    "type": "widget",
    "group": "other",
    "tags": [
      "lit",
      "console",
      "logging",
      "debug"
    ]
  },
  "references": {
    "widgets": [
      "collab-console-100554"
    ],
    "statesRO": [],
    "statesRW": [
      "logs",
      "height",
      "mode",
      "scope"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_stateLitElement"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct assignment to window.console.log may have side effects or security implications.",
      "Use of window object (scope: Window & typeof globalThis = window) can introduce global side effects."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "No ARIA attributes present. Consider adding roles or ARIA labels for better accessibility.",
      "Keyboard navigation is not explicitly handled; ensure focus management if interactive.",
      "Contrast appears sufficient due to color tokens, but verify with actual theme."
    ],
    "i18nWarnings": [
      "Log type labels (e.g., 'log', 'error', 'warn') and messages are not internationalized.",
      "Static strings like '[ms]' and log prefixes are not localized."
    ],
    "correctness": 8,
    "errorHandling": 6,
    "readability": 8,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Widget para exibir logs do console em tempo real, interceptando console.log e apresentando mensagens formatadas em uma interface customizada. Permite alternar entre modos habilitado/desabilitado e limpar logs ao trocar de escopo.",
    "goal": "Facilitar o debug e visualização de logs diretamente na interface do usuário, sem depender do console do navegador.",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero visualizar logs do console diretamente na interface para facilitar o debug sem abrir o console do navegador.",
        "derivedRequirements": [
          {
            "description": "Interceptar console.log e exibir mensagens em tempo real no widget.",
            "done": true,
            "comment": "Implementado via interceptConsole e renderização dos logs."
          },
          {
            "description": "Permitir alternar entre modos habilitado e desabilitado.",
            "done": true,
            "comment": "Propriedade 'mode' controla interceptação."
          },
          {
            "description": "Limpar logs ao trocar de escopo.",
            "done": true,
            "comment": "Implementado no updated."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a diferentes tipos de logs (info, warn, error).",
        "done": false,
        "comment": "Atualmente só 'log' é tratado explicitamente."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Logs podem não ser restaurados corretamente ao alternar o modo rapidamente.",
        "done": false,
        "comment": "Necessário revisar restauração de console.log."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Adicionar botões para limpar logs manualmente e exportar logs.",
        "done": false,
        "comment": "Funcionalidade não implementada."
      }
    ]
  },
  "textToEmbedding": [
    "This widget displays real-time console logs in the UI, intercepting console.log calls.",
    "It allows toggling between enabled/disabled modes and clears logs when the scope changes.",
    "Planned features include support for log types (info, warn, error) and manual log clearing/export.",
    "Known issues: possible race condition when toggling modes quickly; log messages and labels are not internationalized."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9804,version:2"
}
    