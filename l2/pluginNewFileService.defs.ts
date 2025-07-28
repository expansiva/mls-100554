/// <mls shortName="pluginNewFileService" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginNewFileService",
    "type": "plugin",
    "group": "other",
    "tags": [
      "lit",
      "internal",
      "service"
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
      "./_100554_serviceBase",
      "./_100554_pluginNewFileBase",
      "./_100554_wcCode"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "O componente utiliza elementos básicos (div, h2, hr, span, button) e um widget customizado (wc-code-100554).",
      "O botão de criação é acessível via teclado (elemento <button>), mas não há atributos aria-* explícitos.",
      "Não há tabindex customizado, mas o fluxo padrão de foco está preservado.",
      "O contraste de cores parece adequado devido ao uso de tokens de cor, mas recomenda-se validação visual para garantir acessibilidade total.",
      "Sugestão: adicionar atributos aria-label ou aria-live para feedback de carregamento e erros, se necessário."
    ],
    "i18nWarnings": [],
    "correctness": 9,
    "errorHandling": 8,
    "readability": 9,
    "maintainability": 9
  },
  "planning": {
    "generalDescription": "Plugin para criar rapidamente um novo arquivo de service no padrão Collab.codes, utilizando LitElement. Permite ao usuário informar nome e projeto, gera o template e exibe o código gerado.",
    "goal": "Facilitar a criação de novos services no Collab.codes, padronizando o código inicial e integrando com IA para preparação automática.",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero criar rapidamente um novo service para meu projeto Collab.codes, informando apenas o nome e o projeto, para acelerar o início do desenvolvimento.",
        "derivedRequirements": [
          {
            "description": "Permitir ao usuário informar nome curto e projeto."
          },
          {
            "description": "Gerar automaticamente o template do service com base nesses dados."
          },
          {
            "description": "Exibir o código gerado para revisão imediata."
          },
          {
            "description": "Permitir criar o arquivo e abrir em preview."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a outros tipos de arquivos além de service.",
        "done": false,
        "comment": "Não implementado, foco atual é apenas service."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Adicionar feedback visual para erros e carregamento.",
        "done": true,
        "comment": "Já existe mensagem de erro e loading."
      },
      {
        "description": "Permitir customização do template gerado.",
        "done": false,
        "comment": "Template é fixo, customização não disponível."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin enables fast creation of new service files for Collab.codes using LitElement.",
    "Users input a short name and project, and the system generates a ready-to-use service template.",
    "The generated code is displayed for immediate review, and the file can be created and previewed.",
    "Feature requests include support for other file types and template customization; error and loading feedback is already present."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9828,version:2"
}
    