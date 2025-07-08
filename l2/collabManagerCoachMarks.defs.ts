/// <mls shortName="collabManagerCoachMarks" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "collabManagerCoachMarks",
    "type": "module",
    "group": "other",
    "tags": [
      "i18n",
      "coachmarks",
      "onboarding",
      "collab.codes"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [],
    "statesRW": [],
    "statesWO": [],
    "imports": [
      "./_100554_coachMarks",
      "./_100554_collabLitElement"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [],
    "deadCodeBlocks": [
      "onServicechange function is defined but currently does nothing except parsing JSON.",
      "The default case in the switch statement inside onLevelchange is redundant."
    ],
    "accessibility": [
      "No direct HTML output except for <h1>; accessibility depends on coach mark overlays.",
      "Coach marks should ensure focus management and ARIA attributes for screen readers."
    ],
    "i18nWarnings": [
      "All user-facing strings in coach marks are properly internationalized."
    ],
    "correctness": 9,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Este módulo gerencia coach marks (guias visuais) para onboarding e orientação de usuários no sistema Collab.codes, com suporte a internacionalização (i18n) para inglês e português.",
    "goal": "Fornecer uma experiência de onboarding contextual e multilíngue para novos usuários, destacando funcionalidades principais do sistema.",
    "userStories": [
      {
        "story": "Como um novo usuário, quero receber dicas visuais sobre as principais áreas do sistema para entender rapidamente como navegar e utilizar as funcionalidades.",
        "derivedRequirements": [
          {
            "description": "Exibir coach marks contextuais ao atingir o nível 5 de onboarding.",
            "done": true,
            "comment": "Implementado via evento LevelChanged."
          },
          {
            "description": "Internacionalizar todas as mensagens dos coach marks.",
            "done": true,
            "comment": "Mensagens disponíveis em inglês e português."
          },
          {
            "description": "Permitir fácil atualização dos textos dos coach marks.",
            "done": true,
            "comment": "Mensagens centralizadas em objetos message_pt e message_en."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte para mais idiomas além de inglês e português.",
        "done": false,
        "comment": "Estrutura pronta para expansão, mas idiomas adicionais não implementados."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Coach marks não aparecem para alguns usuários após upgrade de nível.",
        "done": false,
        "comment": "Necessário investigar se eventos estão sendo disparados corretamente."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Permitir customização dos coach marks por administradores.",
        "done": false,
        "comment": "Atualmente, textos e passos são fixos no código."
      }
    ]
  },
  "textToEmbedding": [
    "This module manages multilingual coach marks for onboarding in Collab.codes.",
    "It triggers contextual tips when users reach onboarding level 5, supporting English and Portuguese.",
    "Feature requests include adding more languages and allowing admin customization of coach marks.",
    "Known bug: some users do not see coach marks after level upgrade; investigation needed."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9832,version:2"
}
    