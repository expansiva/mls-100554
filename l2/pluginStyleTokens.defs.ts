/// <mls shortName="pluginStyleTokens" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginStyleTokens",
    "type": "plugin",
    "group": "other",
    "tags": [
      "color:@*",
      "background-color:@*",
      "background:@*"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "state",
      "prop",
      "value",
      "theme",
      "tokens"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_collabLitElement",
      "./_100554_stateLitElement",
      "./_100554_collabDecorators",
      "./_100554_designSystemBase",
      "./_100554_lessCSS"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct DOM access via ownerDocument and querySelector for tooltip management. If collab-tooltip is not trusted, this could be a vector for XSS or unexpected behavior.",
      "No sanitization for style attribute values in token-item divs. If tokens are not trusted, this could be a risk."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "Token items are clickable divs but lack role='button' or tabindex for keyboard navigation. This may hinder accessibility for keyboard users.",
      "No aria-label or aria attributes on interactive elements. Tooltip is managed via a custom element, but native accessibility is not guaranteed.",
      "Contrast appears sufficient due to color tokens, but no explicit checks for WCAG contrast ratios."
    ],
    "i18nWarnings": [
      "Category names (cat), state, and variation labels in the UI are not internationalized. Only the plugin description is i18n-ready."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Plugin especializado para gerenciamento de tokens de design de cores, permitindo definir, organizar e aplicar paletas de cores para garantir consistência visual e acessibilidade em projetos.",
    "goal": "Facilitar a seleção e aplicação de tokens de cor em componentes de design, promovendo padronização e eficiência.",
    "userStories": [
      {
        "story": "Como designer, quero visualizar e selecionar rapidamente tokens de cor para aplicar em meus componentes, garantindo consistência visual.",
        "derivedRequirements": [
          {
            "description": "Exibir todos os tokens de cor disponíveis organizados por categoria, estado e variação.",
            "done": true,
            "comment": "Implementado via renderização dinâmica dos tokens agrupados."
          },
          {
            "description": "Permitir seleção de um token de cor e aplicar ao estilo do componente alvo.",
            "done": true,
            "comment": "Função handleColorClick implementa essa lógica."
          },
          {
            "description": "Mostrar tooltip com o nome do token ao passar o mouse.",
            "done": true,
            "comment": "Tooltip gerenciado via setTooltip e collab-tooltip."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte a temas customizados além do tema Default.",
        "done": false,
        "comment": "Atualmente só há seleção por nome de tema, mas não há interface para criar/editar temas."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Tokens não são atualizados automaticamente ao mudar o valor de theme.",
        "done": false,
        "comment": "Atualização depende de triggers em value, mas não em theme."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Adicionar navegação por teclado entre os tokens para acessibilidade.",
        "done": false,
        "comment": "Atualmente só mouse é suportado."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin manages color design tokens, allowing users to define, organize, and apply color palettes for consistent and accessible UI design.",
    "It displays tokens grouped by category, state, and variation, and lets users select and apply a color token to a component's style.",
    "There are requests for custom theme support, keyboard navigation for accessibility, and improved token updates when the theme changes.",
    "Some UI strings are not internationalized, and accessibility could be improved by adding keyboard support and ARIA attributes."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9740,version:2"
}
    