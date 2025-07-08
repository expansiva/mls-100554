/// <mls shortName="pluginCollabWidgetIndex" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginCollabWidgetIndex",
    "type": "plugin",
    "group": "other",
    "tags": []
  },
  "references": {
    "widgets": [
      "_100554_wcText",
      "_100554_wcImage",
      "_100554_wcCode",
      "_100554_wcVideo",
      "_100554_wcSection",
      "_100554_wcDivider",
      "_100554_wcButtonSubmit",
      "_100554_wcChart",
      "_100554_wcColumn",
      "_100554_wcInputNumber",
      "_100554_wcInputText",
      "_100554_wcInputNumberRange",
      "_100554_wcInputNumberWithButtons",
      "_100554_wcRow",
      "_100554_wcSelectOne",
      "_100554_wcTableSelect"
    ],
    "plugins": [],
    "statesRO": [],
    "statesRW": [],
    "statesWO": [],
    "imports": [
      "./_100554_pluginBaseIndex"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "O HTML contém apenas um <h1> sem atributos de acessibilidade adicionais. Não há problemas óbvios, mas o componente é mínimo.",
      "Não há navegação por teclado ou elementos interativos.",
      "Não há uso de aria-* ou tabindex, mas não é necessário para o conteúdo atual."
    ],
    "i18nWarnings": [
      "O texto '_100554_pluginCollabWidgetIndex' no <h1> não está internacionalizado. Se for exibido ao usuário final, considerar i18n."
    ],
    "correctness": 10,
    "errorHandling": 10,
    "readability": 10,
    "maintainability": 10
  },
  "planning": {
    "generalDescription": "Este plugin fornece um índice de widgets colaborativos para o sistema Collab.codes, permitindo a adição dinâmica de diversos tipos de widgets em páginas ou módulos.",
    "goal": "Facilitar a integração e gerenciamento de múltiplos widgets colaborativos, centralizando o registro e a exposição destes para uso em diferentes contextos do sistema.",
    "userStories": [
      {
        "story": "Como usuário administrador, quero adicionar diferentes tipos de widgets colaborativos para compor páginas dinâmicas.",
        "derivedRequirements": [
          {
            "description": "Registrar todos os widgets disponíveis no plugin para fácil acesso."
          },
          {
            "description": "Permitir que widgets sejam filtrados por categoria e prioridade."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte para novos tipos de widgets no futuro.",
        "done": false,
        "comment": "O código já permite fácil extensão, mas não há widgets customizados além dos listados."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Internacionalizar o nome exibido no <h1> do HTML.",
        "done": false,
        "comment": "O texto ainda está hardcoded e não utiliza sistema de i18n."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin acts as a registry for collaborative widgets in Collab.codes, enabling dynamic addition and management of various widget types.",
    "Its main goal is to centralize widget registration and exposure, supporting extensibility and easy integration in different system contexts.",
    "There is a feature request to support new widget types in the future, and an enhancement to internationalize the displayed plugin name.",
    "No bugs are currently reported; the code is clean, maintainable, and ready for further extension."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9764,version:2"
}
    