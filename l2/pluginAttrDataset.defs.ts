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
    ],
    "correctness": 8,
    "errorHandling": 6,
    "readability": 8,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Plugin para exibir e selecionar caminhos de atributos de um dataset, permitindo ao usuário navegar por uma árvore de dados e selecionar um item para configuração.",
    "goal": "Facilitar a configuração de atributos dinâmicos em plugins Collab.codes, permitindo seleção visual de caminhos de dados.",
    "userStories": [
      {
        "story": "Como usuário, quero visualizar a estrutura de dados do estado para selecionar facilmente um caminho de atributo.",
        "derivedRequirements": [
          {
            "description": "Renderizar árvore de dados baseada no estado atual.",
            "done": true,
            "comment": "Implementado via renderTree e renderTreeItem."
          },
          {
            "description": "Permitir seleção de um caminho e disparar evento customizado.",
            "done": true,
            "comment": "Implementado via selectItem e setConfig."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a internacionalização completa para todos os textos exibidos.",
        "done": false,
        "comment": "Parcialmente implementado; textos principais ainda hardcoded."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade com uso de aria-labels e foco programático.",
        "done": false,
        "comment": "Não implementado; acessibilidade básica apenas."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin displays a dataset attribute tree, letting users select a path for configuration.",
    "Its goal is to make dynamic attribute selection easy and visual for Collab.codes plugins.",
    "There are requests for full i18n support and improved accessibility, as some texts are still hardcoded.",
    "No critical bugs reported, but enhancements focus on usability and internationalization."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9796,version:2"
}
    