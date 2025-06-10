/// <mls shortName="pluginStyleFlex" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginStyleFlex",
    "type": "plugin",
    "group": "other",
    "tags": [
      "css",
      "flexbox",
      "layout",
      "styling"
    ]
  },
  "references": {
    "widgets": [
      "collab-ds-input-range-100554"
    ],
    "plugins": [],
    "statesRO": [
      "less.left",
      "less.right"
    ],
    "statesRW": [
      "less.left.lessCSS.styles",
      "less.right.lessCSS.styles"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "_100554_stateLitElement",
      "_100554_collabDecorators",
      "_100554_collabState",
      "_100554_collabLitElement",
      "_100554_lessCSS",
      "_100554_collabDsInputRange"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "Elementos select não possuem labels associados para acessibilidade",
      "Falta de atributos aria-* para melhor descrição dos controles",
      "Gallery items não possuem texto alternativo ou descrição para leitores de tela",
      "Elementos interativos da galeria não são acessíveis via teclado (apenas click)"
    ],
    "i18nWarnings": [],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 7
  },
  "auth": {},
  "planning": {
    "generalDescription": "Plugin para gerenciar e personalizar propriedades de layout flexível em CSS, oferecendo interface visual para configurar display flex, direção, alinhamento e distribuição de elementos.",
    "goal": "Facilitar a configuração de propriedades CSS Flexbox através de uma interface intuitiva com galeria de layouts pré-definidos e controles individuais para cada propriedade.",
    "userStories": [
      {
        "story": "Como desenvolvedor, quero configurar rapidamente layouts flexbox através de uma galeria visual para acelerar o desenvolvimento",
        "derivedRequirements": [
          {
            "description": "Implementar galeria com 8 layouts flexbox pré-configurados",
            "done": true,
            "comment": "Galeria implementada com layouts row/column e diferentes justify-content"
          },
          {
            "description": "Permitir seleção de layout através de clique na galeria",
            "done": true,
            "comment": "Funcionalidade implementada no handleChangeGalleryCss"
          }
        ]
      },
      {
        "story": "Como desenvolvedor, quero controlar individualmente cada propriedade flexbox para ter controle fino sobre o layout",
        "derivedRequirements": [
          {
            "description": "Criar controles para propriedades do container flex (display, flex-direction, flex-wrap, justify-content, align-items, align-content)",
            "done": true,
            "comment": "Todos os controles implementados na seção renderFlex()"
          },
          {
            "description": "Criar controles para propriedades dos itens flex (align-self, order)",
            "done": true,
            "comment": "Controles implementados na seção renderFlexItem()"
          }
        ]
      },
      {
        "story": "Como usuário, quero que o plugin seja internacionalizado para usar em diferentes idiomas",
        "derivedRequirements": [
          {
            "description": "Implementar sistema de internacionalização com suporte a português e inglês",
            "done": true,
            "comment": "Sistema i18n implementado com messages_pt e messages_en"
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte para propriedades flex-grow, flex-shrink e flex-basis",
        "done": false,
        "comment": "Propriedades importantes do flexbox que não estão disponíveis no plugin"
      },
      {
        "description": "Implementar preview visual dos layouts na galeria",
        "done": false,
        "comment": "Atualmente a galeria mostra apenas representações simples com spans"
      },
      {
        "description": "Adicionar mais opções de justify-content (space-evenly, start, end)",
        "done": false,
        "comment": "Valores CSS mais recentes não estão incluídos"
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Corrigir problema de acessibilidade nos controles select",
        "done": false,
        "comment": "Elementos select precisam de labels associados"
      },
      {
        "description": "Melhorar navegação por teclado na galeria",
        "done": false,
        "comment": "Gallery items não são acessíveis via teclado"
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Adicionar tooltips explicativos para cada propriedade flexbox",
        "done": false,
        "comment": "Ajudaria usuários menos experientes a entender cada propriedade"
      },
      {
        "description": "Implementar undo/redo para mudanças de estilo",
        "done": false,
        "comment": "Funcionalidade útil para experimentação com layouts"
      },
      {
        "description": "Adicionar modo de visualização responsiva",
        "done": false,
        "comment": "Permitir testar layouts em diferentes tamanhos de tela"
      }
    ]
  }
}
    