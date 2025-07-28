/// <mls shortName="pluginNewFilePage" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginNewFilePage",
    "type": "plugin",
    "group": "other",
    "tags": [
      "lit",
      "html",
      "page"
    ]
  },
  "references": {
    "widgets": [
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
      "./_100554_utilsLit",
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
      "O componente utiliza elementos básicos (div, h2, hr, span, button) e widgets customizados. O botão é acessível por padrão, mas não há atributos aria-* ou tabindex explícitos. Recomenda-se adicionar aria-label ao botão para melhorar a acessibilidade para leitores de tela.",
      "Nenhum problema crítico detectado, mas pode-se melhorar a acessibilidade com atributos ARIA e foco visual."
    ],
    "i18nWarnings": [
      "O componente implementa corretamente i18n para todas as strings visíveis ao usuário, usando o objeto messages e selecionando pelo idioma.",
      "Nenhum problema de i18n detectado."
    ],
    "correctness": 9,
    "errorHandling": 8,
    "readability": 9,
    "maintainability": 9
  },
  "planning": {
    "generalDescription": "Este plugin permite criar rapidamente um novo arquivo de página no sistema Collab.codes, fornecendo templates TypeScript e HTML prontos para uso, com suporte a i18n e integração ao fluxo do projeto.",
    "goal": "Facilitar a criação de páginas customizadas, padronizadas e integradas ao sistema, reduzindo erros e acelerando o desenvolvimento.",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero criar rapidamente uma nova página no projeto, com templates prontos e integração ao sistema, para agilizar o desenvolvimento e manter o padrão do projeto.",
        "derivedRequirements": [
          {
            "description": "Gerar arquivos TS e HTML com base em templates parametrizados pelo usuário.",
            "done": true,
            "comment": "Templates são gerados dinamicamente conforme os parâmetros informados."
          },
          {
            "description": "Validar o nome do arquivo e garantir que siga o padrão exigido (começar com 'page').",
            "done": true,
            "comment": "Validação implementada no método handleAddFile."
          },
          {
            "description": "Exibir mensagens de erro e loading adequadas ao usuário.",
            "done": true,
            "comment": "Mensagens são exibidas conforme o estado loading e erros."
          },
          {
            "description": "Suportar internacionalização das mensagens exibidas.",
            "done": true,
            "comment": "i18n implementado via objeto messages."
          }
        ]
      }
    ],
    "userRequestsFeatures": [],
    "userRequestsBugs": [],
    "userRequestsEnhancements": []
  },
  "textToEmbedding": [
    "This plugin enables fast creation of new page files in Collab.codes, providing ready-to-use TypeScript and HTML templates.",
    "It validates file naming, supports i18n, and integrates with the project workflow to standardize and speed up development.",
    "The UI displays loading and error states, and all user-facing strings are internationalized.",
    "No open bugs or enhancement requests exist; the main goal is to streamline page creation for developers."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9812,version:2"
}
    