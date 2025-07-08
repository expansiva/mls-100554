/// <mls shortName="pluginNewFileBlank" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginNewFileBlank",
    "type": "plugin",
    "group": "other",
    "tags": [
      "lit",
      "html",
      "component"
    ]
  },
  "references": {
    "widgets": [
      "wc-code-100554"
    ],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "shortName",
      "project",
      "position",
      "loading"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_stateLitElement",
      "./_100554_collabLitElement",
      "./_100554_collabDecorators",
      "./_100554_pluginNewFileBase",
      "./_100554_serviceBase",
      "./_100554_wcCode"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "O botão principal é acessível via teclado e tem contraste adequado (azul e branco).",
      "Não há atributos aria explícitos, mas o texto do botão é claro e descritivo.",
      "Não há estilos de foco personalizados, depende do navegador.",
      "O fluxo de navegação por teclado é padrão e suficiente para o componente atual."
    ],
    "i18nWarnings": [],
    "correctness": 9,
    "errorHandling": 8,
    "readability": 9,
    "maintainability": 9
  },
  "planning": {
    "generalDescription": "Componente Lit para criar rapidamente um novo arquivo em branco em projetos Collab.codes, com suporte a internacionalização e visualização do template gerado.",
    "goal": "Permitir ao usuário criar arquivos em branco de forma rápida, segura e amigável, com feedback visual e suporte a múltiplos idiomas.",
    "userStories": [
      {
        "story": "Como usuário, quero criar um novo arquivo em branco em meu projeto para iniciar rapidamente um novo desenvolvimento.",
        "derivedRequirements": [
          {
            "description": "Exibir formulário com campos para nome e projeto do arquivo.",
            "done": true,
            "comment": "Implementado no render e propriedades do componente."
          },
          {
            "description": "Validar se o nome do arquivo não está em branco ou inválido.",
            "done": true,
            "comment": "Validação feita em handleAddFile."
          },
          {
            "description": "Exibir mensagem de erro caso a criação falhe.",
            "done": true,
            "comment": "Chama setError do service em caso de erro."
          },
          {
            "description": "Mostrar feedback visual de carregamento durante a criação.",
            "done": true,
            "comment": "Estado loading tratado no render."
          },
          {
            "description": "Permitir visualização do template do arquivo antes da criação.",
            "done": true,
            "comment": "Template exibido via wc-code-100554."
          }
        ]
      }
    ],
    "userRequestsFeatures": [],
    "userRequestsBugs": [],
    "userRequestsEnhancements": []
  },
  "textToEmbedding": [
    "This Lit component allows users to quickly create a blank file in a Collab.codes project.",
    "It provides a form for file name and project, validates input, and shows loading and error feedback.",
    "The component supports i18n for English and Portuguese, and displays the generated template for preview.",
    "Accessibility is reasonable, with good color contrast and keyboard navigation, but could improve with ARIA attributes."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9792,version:2"
}
    