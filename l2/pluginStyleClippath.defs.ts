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
      "Direct DOM manipulation with innerHTML in pointsContainer.innerHTML = ''",
      "Dynamic style injection with this.image.style.clipPath without sanitization"
    ],
    "unusedImports": [
      "query decorator for svgOverlay - element is queried but never used"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "Draggable points lack ARIA labels and keyboard navigation support",
      "Image element has alt text but interactive elements need better accessibility",
      "No focus management for dynamically created draggable points",
      "Missing role attributes for interactive gallery items"
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
  }
}
    