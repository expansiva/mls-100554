/// <mls shortName="pluginStyleCursor" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginStyleCursor",
    "type": "plugin",
    "group": "other",
    "tags": [
      "cursor",
      "style",
      "ui"
    ]
  },
  "references": {
    "plugins": [],
    "statesRW": [
      "globalState._ica.less[this.position].lessCSS.styles.cursor"
    ],
    "imports": [
      "lit",
      "_100554_stateLitElement",
      "_100554_collabDecorators",
      "_100554_collabState",
      "_100554_collabLitElement",
      "_100554_lessCSS"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "Itens da galeria não possuem atributos aria-label ou role para melhor acessibilidade.",
      "Falta suporte para navegação via teclado nos itens da galeria.",
      "Não há indicação visual de foco para usuários que navegam via teclado."
    ],
    "i18nWarnings": [],
    "correctness": 7,
    "errorHandling": 6,
    "readability": 8,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Plugin para personalização de cursor CSS que permite aos usuários escolher entre diferentes estilos de cursor através de uma galeria visual interativa.",
    "goal": "Fornecer uma interface intuitiva para personalização de cursores CSS, melhorando a experiência do usuário e permitindo maior customização visual.",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero poder personalizar o cursor da minha aplicação de forma visual para melhorar a experiência do usuário",
        "derivedRequirements": [
          {
            "description": "Criar galeria visual com diferentes opções de cursor",
            "done": true,
            "comment": "Implementado com arrayGallery contendo 33 tipos de cursor"
          },
          {
            "description": "Implementar seleção interativa de cursor",
            "done": true,
            "comment": "Implementado através do handleChangeCss"
          }
        ]
      },
      {
        "story": "Como usuário final, quero ver uma prévia visual de cada tipo de cursor antes de selecioná-lo",
        "derivedRequirements": [
          {
            "description": "Aplicar o estilo de cursor diretamente nos itens da galeria",
            "done": true,
            "comment": "Cada item da galeria aplica o cursor correspondente via style attribute"
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte para cursores customizados (imagens)",
        "done": false,
        "comment": "Atualmente suporta apenas cursores CSS padrão"
      },
      {
        "description": "Implementar busca/filtro na galeria de cursores",
        "done": false,
        "comment": "Não implementado"
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Melhorar tratamento de erro quando elemento não é encontrado",
        "done": false,
        "comment": "handleChangeCss tem verificação básica mas poderia ser mais robusta"
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Adicionar suporte para navegação via teclado",
        "done": false,
        "comment": "Importante para acessibilidade"
      },
      {
        "description": "Implementar categorização dos cursores (resize, pointer, etc.)",
        "done": false,
        "comment": "Não implementado"
      },
      {
        "description": "Adicionar preview em tempo real do cursor selecionado",
        "done": false,
        "comment": "Não implementado"
      }
    ]
  },
  "textToEmbedding": [
    "This plugin provides a visual gallery for CSS cursor customization, allowing users to select from various cursor styles to enhance UI experience.",
    "The main goal is to offer an intuitive interface for cursor selection, improving user experience and enabling greater visual customization.",
    "Future requests include support for custom image cursors, search/filter in the gallery, and real-time cursor preview.",
    "Accessibility improvements and better error handling are desired, as well as keyboard navigation and cursor categorization."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9780,version:2"
}
    