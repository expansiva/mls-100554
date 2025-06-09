/// <mls shortName="pluginConfigLinks" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginConfigLinks",
    "type": "plugin",
    "group": "other",
    "tags": []
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "myLinks",
      "autoPrepare"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_pluginBaseModule",
      "./_100554_libProjectConfig"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Uso de alert() para mensagens de erro pode ser considerado inseguro ou ruim para UX.",
      "Não há validação sanitizada para os campos de entrada antes de adicionar links (potencial XSS se o valor for usado em innerHTML em futuras alterações).",
      "Uso de 'unsafeHTML' importado, mas não utilizado; se for usado no futuro, pode ser um risco de XSS."
    ],
    "unusedImports": [
      "unsafeHTML"
    ],
    "deadCodeBlocks": [
      "A variável privada 'test' nunca é utilizada no código."
    ],
    "accessibility": [
      "Os botões possuem ícones SVG e texto, mas o texto está dentro do SVG, o que pode dificultar a leitura por leitores de tela.",
      "Não há uso de atributos aria-* nos botões ou links.",
      "Os elementos <link-item> não possuem tabindex ou roles de acessibilidade.",
      "O contraste de cor dos links depende do valor escolhido pelo usuário, podendo gerar problemas de contraste.",
      "O foco visual é tratado via CSS para link-item, mas não há indicação clara para navegação por teclado nos botões."
    ],
    "i18nWarnings": [
      "Strings como 'fill all the fields!', 'title', 'url', 'color', 'add', 'cancel', 'New' estão hardcoded e deveriam ser internacionalizadas para suportar múltiplos idiomas."
    ]
  },
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small@compressed"
}
    