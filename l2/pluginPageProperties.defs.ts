/// <mls shortName="pluginPageProperties" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginPageProperties",
    "type": "plugin",
    "group": "other",
    "tags": []
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "elementAttributes"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_pluginBaseModule",
      "./_100554_serviceBase"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Uso de iframe.contentDocument e manipulação direta do DOM pode abrir brechas de segurança, especialmente se o conteúdo do iframe não for totalmente controlado.",
      "Acesso a parent.info.element.getAtributtes() e getAttribute pode ser problemático se o objeto não for validado.",
      "Não há sanitização explícita dos valores exibidos nos inputs, o que pode ser um vetor de XSS se os atributos forem manipuláveis externamente."
    ],
    "unusedImports": [
      "css",
      "svg",
      "queryAll"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "Os inputs gerados dinamicamente não possuem labels associados, o que pode prejudicar a acessibilidade.",
      "Não há uso de atributos aria-* ou tabindex para melhorar navegação por teclado.",
      "O contraste de cores parece adequado devido ao uso de tokens de cor, mas recomenda-se validar com ferramentas automáticas.",
      "O HTML gerado não possui roles ou landmarks semânticos além de <ul> e <li>."
    ],
    "i18nWarnings": [
      "O texto do botão ou placeholder dos inputs não está internacionalizado (embora não haja placeholder explícito, se for adicionado deve ser i18n).",
      "O título <h3> está corretamente internacionalizado.",
      "O título do HTML <h1> não está internacionalizado."
    ]
  },
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small@compressed"
}
    