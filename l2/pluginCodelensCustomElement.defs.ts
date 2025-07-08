/// <mls shortName="pluginCodelensCustomElement" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginCodelensCustomElement",
    "type": "plugin",
    "group": "other",
    "tags": [
      "lit",
      "customElement",
      "webcomponent",
      "documentation"
    ]
  },
  "references": {
    "widgets": [
      "wc-code-100554"
    ],
    "plugins": [],
    "statesRO": [],
    "statesRW": [],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_collabLitElement",
      "./_100554_wcCode"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "O link externo usa target=\"_blank\" sem rel=\"noopener noreferrer\", o que pode abrir brecha para ataques de segurança (tabnabbing)."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "O componente utiliza HTML semântico básico (h1, h2, p, a).",
      "O link externo possui target=\"_blank\" mas não inclui rel=\"noopener noreferrer\" para segurança e acessibilidade.",
      "Não há tabindex, aria-* ou foco explícito, mas o conteúdo é majoritariamente informativo e não interativo.",
      "Recomenda-se adicionar rel=\"noopener noreferrer\" ao link externo para melhor acessibilidade e segurança."
    ],
    "i18nWarnings": [
      "O componente implementa corretamente i18n para todos os textos exibidos, exceto o texto do link 'see more', que está hardcoded em inglês.",
      "Recomenda-se internacionalizar o texto do link 'see more'."
    ],
    "correctness": 9,
    "errorHandling": 8,
    "readability": 9,
    "maintainability": 9
  },
  "planning": {
    "generalDescription": "Este plugin fornece documentação e exemplo de uso do decorador @customElement do Lit, explicando seu funcionamento e exibindo um exemplo de código. O conteúdo é internacionalizado (i18n) para português e inglês.",
    "goal": "Ajudar desenvolvedores a entender e utilizar o @customElement do Lit para criar web components reutilizáveis.",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero entender como criar um custom element com Lit para reutilizar componentes em minha aplicação.",
        "derivedRequirements": [
          {
            "description": "Exibir explicação detalhada sobre o decorador @customElement.",
            "done": true,
            "comment": "A explicação está presente em ambos idiomas."
          },
          {
            "description": "Mostrar exemplo de código funcional usando @customElement.",
            "done": true,
            "comment": "O exemplo é exibido via wc-code-100554."
          },
          {
            "description": "Permitir alternância de idioma entre português e inglês.",
            "done": true,
            "comment": "A seleção de idioma é automática via getMessageKey."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a mais idiomas além de pt/en.",
        "done": false,
        "comment": "Atualmente apenas pt e en estão implementados."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Texto do link 'see more' não está internacionalizado.",
        "done": false,
        "comment": "Texto permanece hardcoded em inglês."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Adicionar rel=\"noopener noreferrer\" ao link externo para segurança.",
        "done": false,
        "comment": "Ainda não implementado."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin documents and demonstrates the Lit @customElement decorator, providing multilingual explanations and a code sample for developers.",
    "Its goal is to help developers understand and use Lit's @customElement to create reusable web components, with content available in English and Portuguese.",
    "There are user requests to add support for more languages and to internationalize the 'see more' link, which is currently hardcoded in English.",
    "A security enhancement is suggested: add rel=\"noopener noreferrer\" to the external link for better safety."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9756,version:2"
}
    