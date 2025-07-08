/// <mls shortName="pluginProjectRunTest" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginProjectRunTest",
    "type": "plugin",
    "group": "other",
    "tags": [
      "test",
      "automation",
      "lit",
      "collab.codes"
    ]
  },
  "references": {
    "widgets": [
      "collab-result-container-100554",
      "collab-result-test-100554"
    ],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "progress",
      "totalTest",
      "totalTestPass",
      "totalTestFailed",
      "startTime",
      "endTime",
      "actualAllPagesTests",
      "filesWithTest"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_libCommom",
      "./_100554_pluginBaseModule",
      "./_100554_tsTestAST",
      "./_100554_collabPageElement",
      "./_100554_collabIcons",
      "./_100554_collabResultTest"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct assignment to innerHTML in clear() and createResumeFinal(). Ensure test result content is sanitized to prevent XSS.",
      "Direct access to window.preview and window.preview.iframe. If preview is user-controlled, may be a risk.",
      "Use of window.addEventListener('preview-loaded', ...) without namespace. Could cause leaks if not handled properly."
    ],
    "unusedImports": [
      "css",
      "svg",
      "repeat"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "No explicit aria-* attributes found. Consider adding aria-live to result containers for dynamic updates.",
      "Button is focusable and uses semantic <button>.",
      "Progress bar is visually clear but lacks ARIA progress attributes.",
      "Keyboard navigation should be checked for custom elements."
    ],
    "i18nWarnings": [
      "Strings in createResume and createResumeFinal (e.g., 'tests executed', 'passed', 'failed', 'Result', 'Execution Time', etc.) are not internationalized.",
      "Some error messages and debug logs are not translated."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Este plugin executa automaticamente todos os testes disponíveis para todas as páginas com testes no projeto Collab.codes. Ele apresenta o progresso, resultados detalhados e um resumo final da execução dos testes.",
    "goal": "Automatizar a execução de testes de páginas do projeto, exibir progresso e resultados de forma clara e acessível para desenvolvedores e usuários do Collab.codes.",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero rodar todos os testes do projeto com um clique, para garantir que todas as páginas estejam funcionando corretamente.",
        "derivedRequirements": [
          {
            "description": "Botão para executar todos os testes disponíveis.",
            "done": true,
            "comment": "Implementado no método exec()."
          },
          {
            "description": "Exibir barra de progresso e resumo dos testes.",
            "done": true,
            "comment": "Barra de progresso e resumo implementados no render() e createResumeFinal()."
          },
          {
            "description": "Mostrar resultados detalhados por página/teste.",
            "done": true,
            "comment": "Resultados detalhados exibidos via collab-result-test-100554."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a internacionalização completa nos resultados e mensagens.",
        "done": false,
        "comment": "Mensagens principais traduzidas, mas resultados e resumos ainda usam strings fixas."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade com ARIA nos resultados e barra de progresso.",
        "done": false,
        "comment": "Sem atributos ARIA atualmente."
      },
      {
        "description": "Permitir execução seletiva de testes por página.",
        "done": false,
        "comment": "Atualmente executa todos os testes de todas as páginas."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin automates running all available tests for project pages in Collab.codes.",
    "It provides a progress bar, detailed per-page results, and a final summary for developers.",
    "Current user requests include full i18n for all result strings and improved accessibility with ARIA.",
    "Enhancements desired: selective test execution per page and better accessibility support."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9772,version:2"
}
    