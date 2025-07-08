/// <mls shortName="servicePreviewL1" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "servicePreviewL1",
    "type": "widget",
    "group": "other",
    "tags": [
      "preview",
      "iframe",
      "lit",
      "collab.codes"
    ]
  },
  "references": {
    "widgets": [
      "collab-console-l1-100554"
    ],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_libCompile",
      "./_100554_serviceBase",
      "./_100554_collabConsoleL1"
    ],
    "statesRO": [],
    "statesRW": [
      "error",
      "watch"
    ],
    "statesWO": []
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct assignment to iframe.contentDocument.body.innerHTML (potential XSS risk if not sanitized).",
      "window/global object assignments inside iframe (may expose sensitive data if not controlled)."
    ],
    "unusedImports": [
      "css"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "No ARIA attributes or accessibility helpers detected in render().",
      "h1 used for error, but no focus management or live region for dynamic errors.",
      "iframe lacks title attribute (should be added for accessibility)."
    ],
    "i18nWarnings": [
      "Static strings like 'No file selected', 'Not found content', 'Erro no file:', 'Error', 'Preview L1', 'run', 'pause' should be internationalized if i18n is enabled."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 7,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Componente de visualização de arquivos em nível 1 para Collab.codes, usando iframe para renderizar previews dinâmicos de arquivos do projeto. Permite alternar entre execução automática e pausa, exibe erros e integra dependências JS/CSS dinamicamente.",
    "goal": "Permitir ao usuário visualizar rapidamente a prévia de arquivos do projeto, com recarregamento automático e integração de dependências, facilitando o desenvolvimento colaborativo.",
    "userStories": [
      {
        "story": "Como usuário, quero visualizar a prévia de um arquivo selecionado para ver rapidamente o resultado das minhas alterações.",
        "derivedRequirements": [
          {
            "description": "Renderizar o arquivo selecionado em um iframe dinâmico."
          },
          {
            "description": "Exibir mensagens de erro claras caso o arquivo não possa ser carregado."
          },
          {
            "description": "Permitir alternar entre modo de observação automática e pausa."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a múltiplos temas de visualização.",
        "done": false,
        "comment": "Não implementado, apenas tema 'Default' presente."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Erro ao carregar arquivos com dependências externas não resolvidas.",
        "done": false,
        "comment": "Tratamento de erro parcial, mas não resolve dependências externas automaticamente."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade do preview, incluindo atributos ARIA e título no iframe.",
        "done": false,
        "comment": "Acessibilidade básica, melhorias necessárias."
      }
    ]
  },
  "textToEmbedding": [
    "This widget provides a live preview of project files using an iframe, enabling users to see changes in real time.",
    "It supports toggling between auto-refresh and pause, displays errors, and dynamically injects JS/CSS dependencies.",
    "There are requests for multi-theme support, better error handling for unresolved dependencies, and improved accessibility.",
    "Future enhancements should focus on i18n, accessibility (ARIA, iframe title), and robust dependency management."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9776,version:2"
}
    