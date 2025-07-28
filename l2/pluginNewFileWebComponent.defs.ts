/// <mls shortName="pluginNewFileWebComponent" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginNewFileWebComponent",
    "type": "plugin",
    "group": "other",
    "tags": [
      "lit",
      "html",
      "component"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "shortName",
      "project",
      "position",
      "loading",
      "aimActionSuggest"
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
      "O botão utiliza elemento <button> nativo, garantindo acessibilidade básica via teclado.",
      "Não há uso de atributos aria-* explícitos, mas o layout é simples e sem elementos interativos complexos.",
      "Contraste de cor parece adequado devido ao uso de tokens de cor, mas recomenda-se validar com ferramentas de contraste.",
      "Não há tabindex customizado, o que é adequado para o caso.",
      "O componente é exibido como block, facilitando navegação por leitores de tela."
    ],
    "i18nWarnings": [
      "Todas as strings essenciais exibidas ao usuário estão internacionalizadas via objeto messages e função getMessageKey.",
      "Strings internas de template de código (ex: 'Hello, Somebody!') não precisam ser internacionalizadas pois são exemplos técnicos."
    ],
    "correctness": 9,
    "errorHandling": 8,
    "readability": 9,
    "maintainability": 9
  },
  "planning": {
    "generalDescription": "Este plugin permite ao usuário criar rapidamente um novo arquivo de web component utilizando Lit 3, com template inicial e integração com IA para preparação do componente.",
    "goal": "Facilitar a criação de web components Lit, automatizando a geração do arquivo e incentivando boas práticas de desenvolvimento.",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero criar rapidamente um novo web component em Lit para acelerar o desenvolvimento de páginas.",
        "derivedRequirements": [
          {
            "description": "Gerar automaticamente um arquivo com template padrão de web component Lit.",
            "done": true,
            "comment": "Implementado via método getTemplate e integração com createNewFile."
          },
          {
            "description": "Permitir ao usuário definir nome curto e projeto para o novo componente.",
            "done": true,
            "comment": "shortName e project são propriedades expostas e utilizadas."
          },
          {
            "description": "Exibir feedback visual durante a criação do arquivo.",
            "done": true,
            "comment": "Estado loading e mensagem de progresso implementados."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte para customização avançada do template inicial.",
        "done": false,
        "comment": "Não implementado; atualmente o template é fixo."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Permitir seleção do diretório de destino do novo arquivo.",
        "done": false,
        "comment": "Não há suporte para seleção de pasta no momento."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin enables users to quickly create a new Lit 3 web component file, providing a standard template and integrating with AI for further preparation.",
    "The main goal is to streamline the creation of Lit web components, automating file generation and promoting best development practices.",
    "Feature requests include advanced template customization and the ability to select the destination directory for the new file.",
    "All user-facing strings are internationalized, and accessibility is ensured through native HTML elements and color tokens."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9812,version:2"
}
    