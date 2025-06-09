/// <mls shortName="pluginAttrDataset" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginAttrDataset",
    "type": "plugin",
    "group": "other",
    "tags": []
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "expandedPaths",
      "selectedPath",
      "data"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_pluginBaseModule"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Acesso direto ao objeto global window e top para buscar window.preview. Isso pode ser problemático em ambientes restritos ou cross-origin.",
      "Acesso ao window.preview?.iframe e top?.preview?.iframe pode causar falhas de segurança se o conteúdo do iframe não for confiável."
    ],
    "unusedImports": [
      "css",
      "repeat"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "O componente utiliza elementos padrão (button, p, h3), mas não há uso explícito de atributos aria-* ou roles para acessibilidade.",
      "O botão 'ok' não possui label acessível além do texto, mas como é apenas 'ok', pode ser suficiente.",
      "Não há controle de foco programático para navegação por teclado, mas os elementos são naturalmente focáveis.",
      "Contraste de cores parece adequado, mas depende das variáveis de cor no LESS."
    ],
    "i18nWarnings": [
      "O texto 'Nenhum item selecionado' está hardcoded e deveria estar internacionalizado.",
      "O texto 'Item:' e 'State' também deveriam estar no sistema de i18n."
    ]
  },
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small@compressed"
}
    