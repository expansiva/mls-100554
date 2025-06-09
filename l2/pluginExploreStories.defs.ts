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
    ]
  },
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small@compressed"
}
    