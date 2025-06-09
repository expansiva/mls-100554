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
    "widgets": [
      "wc-code-100554"
    ],
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
      "./_100554_libCommom",
      "./_100554_wcCode"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [],
    "deadCodeBlocks": [
      "Bloco de código comentado da função handleAddFile (versão alternativa, comentada)."
    ],
    "accessibility": [
      "O botão é acessível via teclado (elemento <button> nativo).",
      "Não há uso de atributos aria-* explícitos, mas o layout é simples e sem elementos interativos complexos.",
      "Contraste de cor parece adequado devido ao uso de tokens de cor, mas recomenda-se validar com ferramentas de contraste.",
      "Não há tabindex customizado, o que é adequado para o caso.",
      "O componente é exibido como block, facilitando navegação por leitores de tela."
    ],
    "i18nWarnings": [
      "Todas as strings essenciais exibidas ao usuário estão internacionalizadas via objeto messages e função getMessageKey.",
      "Strings internas de template de código (ex: 'Hello, Somebody!') não precisam ser internacionalizadas pois são exemplos técnicos."
    ]
  },
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small@compressed"
}
    