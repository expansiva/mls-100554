/// <mls shortName="pluginCodelensServiceDetails" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginCodelensServiceDetails",
    "type": "plugin",
    "group": "other",
    "tags": []
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
      "./_100554_collabLitElement"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Uso de unsafeHTML para renderizar HTML vindo de i18n. Embora o conteúdo seja controlado, é importante garantir que não haja inserção de conteúdo dinâmico não sanitizado nas mensagens para evitar XSS.",
      "O link para FontAwesome utiliza target=\"_blank\" sem rel=\"noopener noreferrer\", o que pode abrir brecha para ataques de segurança e problemas de acessibilidade."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "O componente utiliza apenas elementos semânticos básicos (h1, h2, p). Não há atributos aria-* ou roles específicos, mas como é um componente de documentação/tutorial, isso não é crítico.",
      "Os exemplos de código são exibidos em <wc-code-100554>, que provavelmente já cuida da acessibilidade do bloco de código.",
      "Não há navegação por teclado explícita, mas não há elementos interativos além de links.",
      "O link externo não utiliza rel=\"noopener noreferrer\" junto com target=\"_blank\", o que é recomendado para segurança e acessibilidade."
    ],
    "i18nWarnings": [
      "Todas as strings exibidas estão internacionalizadas via objeto messages. Não há strings hardcoded relevantes fora do i18n."
    ],
    "correctness": 9,
    "errorHandling": 8,
    "readability": 9,
    "maintainability": 9
  },
  "planning": {
    "generalDescription": "Este plugin exibe uma documentação/tutorial sobre como configurar corretamente o objeto de detalhes de um service para uso no Collab.codes, incluindo exemplos de configuração de ícone, estado, posição e customizações por nível.",
    "goal": "Orientar desenvolvedores na configuração do objeto IService para que seus serviços sejam corretamente reconhecidos e utilizados na plataforma.",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero entender como configurar o objeto de detalhes do meu serviço para que ele seja exibido corretamente na interface do Collab.codes.",
        "derivedRequirements": [
          {
            "description": "Exibir exemplos claros de configuração do objeto IService, incluindo ícone, estado, posição e customizações.",
            "done": true,
            "comment": "Todos os exemplos estão presentes no componente."
          },
          {
            "description": "Internacionalizar todas as mensagens exibidas para suportar múltiplos idiomas.",
            "done": true,
            "comment": "Mensagens disponíveis em inglês e português."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a mais idiomas além de inglês e português.",
        "done": false,
        "comment": "Atualmente apenas en/pt estão disponíveis."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Adicionar rel=\"noopener noreferrer\" aos links externos para melhorar segurança e acessibilidade.",
        "done": false,
        "comment": "Link para FontAwesome ainda não utiliza rel=\"noopener noreferrer\"."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin provides documentation and code samples for configuring the IService details object in Collab.codes, including icon, state, position, and customizations per level.",
    "Its goal is to guide developers in setting up their service details so services are properly recognized and used in the platform.",
    "There is a feature request to add support for more languages beyond English and Portuguese.",
    "An enhancement is suggested to add rel=\"noopener noreferrer\" to external links for improved security and accessibility."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9796,version:2"
}
    