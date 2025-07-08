/// <mls shortName="pluginExploreStories" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginExploreStories",
    "type": "plugin",
    "group": "other",
    "tags": [
      "lit",
      "stories",
      "explore",
      "plugin"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "files",
      "activeTab",
      "position",
      "level",
      "autoPrepare"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_pluginBaseModule",
      "./_100554_libCommom"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Uso de innerHTML em div.innerHTML = await sf.getContent() pode ser perigoso se o conteúdo não for sanitizado, pois pode permitir XSS.",
      "Acesso direto ao window['mls'] e manipulação de DOM sem validação rigorosa pode ser um vetor de ataque se o conteúdo não for controlado."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "Os elementos customizados (menuitems, menubox, menuicon, menuitem) não possuem atributos aria nem roles definidos, o que pode dificultar a navegação por leitores de tela.",
      "Não há evidências de foco visível ou gerenciamento de foco para navegação por teclado nos menus.",
      "O contraste de cores parece adequado, mas depende das variáveis LESS utilizadas."
    ],
    "i18nWarnings": [
      "Strings como 'Nenhum paragrafo encontrado', 'Editar rascunho', 'Deletar rascunho' e suas versões em inglês estão corretamente internacionalizadas.",
      "Strings como 'Rascunho', 'Publicados' também estão internacionalizadas.",
      "Strings estáticas no LESS ou nomes de classes não precisam de i18n."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Plugin para explorar e gerenciar histórias (stories) em projetos, exibindo rascunhos e publicados, com ações de edição e exclusão.",
    "goal": "Facilitar a navegação, visualização e gerenciamento de arquivos de histórias do projeto, permitindo ações rápidas sobre rascunhos e publicados.",
    "userStories": [
      {
        "story": "Como usuário, quero visualizar uma lista de histórias do projeto para poder gerenciar rascunhos e publicações.",
        "derivedRequirements": [
          {
            "description": "Exibir lista de arquivos de histórias filtrados por status (rascunho/publicado).",
            "done": true,
            "comment": "Implementado via renderDraft e renderPublished."
          },
          {
            "description": "Permitir edição e exclusão de rascunhos diretamente na lista.",
            "done": true,
            "comment": "Ações disponíveis no menu contextual de cada item."
          }
        ]
      }
    ],
    "userRequestsFeatures": [],
    "userRequestsBugs": [],
    "userRequestsEnhancements": []
  },
  "textToEmbedding": [
    "This plugin allows users to explore and manage project stories, showing drafts and published items with quick actions for editing and deleting.",
    "The main goal is to facilitate navigation and management of story files, providing a clear interface for handling drafts and published stories.",
    "The code implements internationalization for key UI strings and uses custom elements for menu actions, but lacks ARIA roles and keyboard accessibility.",
    "Security risks include use of innerHTML and direct DOM access; error handling is basic but present. No authentication logic is enforced."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9840,version:2"
}
    