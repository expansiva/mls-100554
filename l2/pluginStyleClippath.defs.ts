/// <mls shortName="pluginStyleClippath" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginStyleClippath",
    "type": "plugin",
    "group": "other",
    "tags": [
      "clip-path",
      "css",
      "visual-editor",
      "shape-maker"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "less.left.lessCSS.styles.clipPath",
      "less.right.lessCSS.styles.clipPath"
    ],
    "statesWO": [],
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
    "securityWarnings": [
      "Direct DOM manipulation with pointsContainer.innerHTML = '' may allow unsafe HTML injection if not controlled.",
      "Dynamic style assignment with this.image.style.clipPath is not sanitized, but risk is low as values are generated internally.",
      "No explicit sanitization for user input if future custom shapes are allowed."
    ],
    "unusedImports": [
      "query decorator for svgOverlay is present but svgOverlay is never used in the code."
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "Draggable points for shape editing lack ARIA attributes and are not accessible via keyboard.",
      "No focus management or tabindex for interactive points or gallery items.",
      "Gallery items are clickable but lack role='button' or descriptive labels.",
      "Image has alt text, but interactive elements need better accessibility support."
    ],
    "i18nWarnings": [],
    "correctness": 7,
    "errorHandling": 6,
    "readability": 8,
    "maintainability": 7
  },
  "auth": {},
  "planning": {
    "generalDescription": "Plugin para criação e edição visual de propriedades CSS clip-path, permitindo aos usuários criar formas complexas através de uma interface interativa com galeria de formas pré-definidas e editor visual com pontos arrastáveis.",
    "goal": "Facilitar a criação e personalização de clip-paths CSS através de uma interface visual intuitiva, eliminando a necessidade de escrever código CSS manualmente para formas complexas.",
    "userStories": [
      {
        "story": "Como designer, quero selecionar formas pré-definidas de uma galeria para aplicar rapidamente clip-paths aos meus elementos",
        "derivedRequirements": [
          {
            "description": "Implementar galeria com formas geométricas básicas (triângulo, círculo, polígonos)",
            "done": true,
            "comment": "Galeria implementada com 25+ formas pré-definidas"
          },
          {
            "description": "Permitir seleção por clique nas formas da galeria",
            "done": true,
            "comment": "Funcionalidade implementada no método handleChangeCss"
          }
        ]
      },
      {
        "story": "Como desenvolvedor, quero editar visualmente os pontos de uma forma para ajustar precisamente o clip-path",
        "derivedRequirements": [
          {
            "description": "Implementar editor visual com pontos arrastáveis",
            "done": true,
            "comment": "Editor implementado para polígonos, círculos e elipses"
          },
          {
            "description": "Suportar diferentes tipos de formas (polygon, circle, ellipse)",
            "done": true,
            "comment": "Suporte completo implementado com identificação automática do tipo"
          },
          {
            "description": "Atualizar preview em tempo real durante edição",
            "done": true,
            "comment": "Preview atualiza durante o arraste dos pontos"
          }
        ]
      },
      {
        "story": "Como usuário, quero que as alterações sejam aplicadas automaticamente ao elemento CSS",
        "derivedRequirements": [
          {
            "description": "Integrar com sistema de estados CSS do Collab.codes",
            "done": true,
            "comment": "Integração implementada através do globalState._ica.less"
          },
          {
            "description": "Aplicar mudanças automaticamente após edição",
            "done": true,
            "comment": "Método applyChanges implementado"
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte para formas personalizadas além das pré-definidas",
        "done": false,
        "comment": "Atualmente limitado às formas da galeria"
      },
      {
        "description": "Implementar undo/redo para edições",
        "done": false,
        "comment": "Não há histórico de alterações"
      },
      {
        "description": "Adicionar preview com diferentes backgrounds para melhor visualização",
        "done": false,
        "comment": "Atualmente usa apenas uma imagem fixa"
      },
      {
        "description": "Suporte para animações de clip-path",
        "done": false,
        "comment": "Plugin focado apenas em valores estáticos"
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Pontos arrastáveis podem sair dos limites da imagem",
        "done": false,
        "comment": "Há limitação por Math.min/max mas pode não ser suficiente"
      },
      {
        "description": "Falta feedback visual durante o arraste dos pontos",
        "done": false,
        "comment": "Usuário pode não perceber que está arrastando"
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade com suporte a teclado para pontos arrastáveis",
        "done": false,
        "comment": "Atualmente apenas mouse/touch"
      },
      {
        "description": "Adicionar tooltips explicativos para cada forma da galeria",
        "done": false,
        "comment": "Nomes das formas não são visíveis para o usuário"
      },
      {
        "description": "Implementar zoom no editor visual para maior precisão",
        "done": false,
        "comment": "Editor trabalha em escala fixa"
      },
      {
        "description": "Adicionar exportação do código CSS gerado",
        "done": true,
        "comment": "Código disponível no textarea output (oculto)"
      }
    ]
  },
  "textToEmbedding": [
    "This plugin enables visual creation and editing of CSS clip-path properties.",
    "Users can select from a gallery of predefined shapes or edit points visually.",
    "It integrates with Collab.codes CSS state system and updates previews in real time.",
    "Future requests include custom shapes, undo/redo, better accessibility, and animated clip-paths."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9752,version:2"
}
    