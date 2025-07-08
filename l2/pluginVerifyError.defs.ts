/// <mls shortName="pluginVerifyError" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginVerifyError",
    "type": "plugin",
    "group": "other",
    "tags": [
      "typescript",
      "lit",
      "error-handling",
      "verification"
    ]
  },
  "references": {
    "plugins": [],
    "widgets": [],
    "statesRO": [
      "find",
      "current",
      "tot",
      "error",
      "autoPrepare",
      "isLoad",
      "listErrors"
    ],
    "statesRW": [
      "find",
      "current",
      "tot",
      "error",
      "autoPrepare",
      "isLoad",
      "listErrors"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_pluginBaseModule",
      "./_100554_collabInit"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "No explicit aria-* attributes found. Consider adding aria-live or role attributes for dynamic error/status messages.",
      "Button is accessible and uses semantic <button>.",
      "List items are rendered as <ul><li>, which is semantically correct.",
      "No tabindex or keyboard trap issues detected.",
      "Contrast appears sufficient, but depends on CSS variables at runtime."
    ],
    "i18nWarnings": [
      "All user-facing strings are internationalized via the messages object. No hardcoded untranslated strings found."
    ],
    "correctness": 9,
    "errorHandling": 8,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Plugin para verificação de erros de compilação em arquivos TypeScript de um projeto Collab.codes. Exibe progresso, lista de erros e permite cancelar a verificação.",
    "goal": "Permitir ao usuário verificar rapidamente erros de compilação em todos os arquivos do projeto, com feedback visual e opção de cancelamento.",
    "userStories": [
      {
        "story": "Como usuário, quero verificar todos os arquivos do projeto para encontrar erros de compilação, para garantir que o código está correto antes de publicar.",
        "derivedRequirements": [
          {
            "description": "Exibir progresso da verificação em tempo real.",
            "done": true,
            "comment": "Implementado via current/tot e mensagem de progresso."
          },
          {
            "description": "Listar todos os erros encontrados de forma clara.",
            "done": true,
            "comment": "Implementado via listErrors e renderização dinâmica."
          },
          {
            "description": "Permitir cancelar a verificação em andamento.",
            "done": true,
            "comment": "Botão de cancelar implementado e funcional."
          },
          {
            "description": "Internacionalizar todas as mensagens exibidas ao usuário.",
            "done": true,
            "comment": "Mensagens em inglês e português implementadas."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a mais idiomas além de inglês e português.",
        "done": false,
        "comment": "Atualmente apenas en/pt disponíveis."
      },
      {
        "description": "Exibir detalhes do erro ao clicar em um item da lista.",
        "done": false,
        "comment": "A lista exibe apenas a string do erro, sem detalhes expandidos."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Às vezes, a lista de erros mostra 'No errors found' mesmo quando há erros.",
        "done": false,
        "comment": "Necessário revisar lógica de preenchimento de listErrors."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar feedback visual durante a verificação (ex: spinner animado).",
        "done": false,
        "comment": "Loader básico implementado, pode ser aprimorado."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin verifies TypeScript files for compilation errors in Collab.codes projects.",
    "It shows real-time progress, lists errors, and allows users to cancel the verification.",
    "All user-facing messages are internationalized (English/Portuguese).",
    "Future improvements include more languages, error details on click, and enhanced visual feedback."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9796,version:2"
}
    