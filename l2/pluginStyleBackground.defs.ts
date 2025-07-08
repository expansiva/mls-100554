/// <mls shortName="pluginStyleBackground" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginStyleBackground",
    "type": "plugin",
    "group": "style",
    "tags": [
      "background",
      "gradient",
      "color",
      "css"
    ]
  },
  "references": {
    "widgets": [
      "_100554_collabDsInputSelectColor",
      "_100554_collabDsInputRange"
    ],
    "plugins": [],
    "statesRO": [
      "less.left",
      "less.right"
    ],
    "statesRW": [
      "less.left.lessCSS",
      "less.right.lessCSS"
    ],
    "statesWO": [],
    "imports": [
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
      "Direct manipulation of CSSStyleSheet and insertRule could be exploited if selector input is not sanitized",
      "Console.info logging may expose sensitive CSS information in production"
    ],
    "unusedImports": [
      "Second import of '_100554_collabDsInputSelectColor'",
      "Second import of '_100554_collabDsInputRange'"
    ],
    "deadCodeBlocks": [
      "renderBody() method has commented code that will never execute",
      "Private method _onIcaStateChange() has commented alternative implementation"
    ],
    "accessibility": [
      "Color inputs lack aria-labels for screen readers",
      "Range inputs missing aria-valuemin, aria-valuemax, and aria-valuenow attributes",
      "Gallery items lack keyboard navigation support",
      "No focus management for dynamically added/removed gradient stops",
      "Missing role attributes for interactive elements"
    ],
    "i18nWarnings": [
      "Hardcoded CSS property names in UI could benefit from internationalization",
      "Error messages and validation feedback not internationalized"
    ],
    "correctness": 7,
    "errorHandling": 6,
    "readability": 6,
    "maintainability": 5
  },
  "planning": {
    "generalDescription": "Plugin robusto para gerenciar e personalizar propriedades de plano de fundo, incluindo cores, gradientes lineares e radiais, com interface visual interativa.",
    "goal": "Fornecer uma interface intuitiva para criação e edição de backgrounds CSS complexos, incluindo gradientes multi-cor com controle de transparência e posicionamento.",
    "userStories": [
      {
        "story": "Como designer, quero poder criar gradientes lineares personalizados para que eu possa aplicar backgrounds únicos aos meus elementos",
        "derivedRequirements": [
          {
            "description": "Implementar interface para seleção de tipo de gradiente (linear/radial)",
            "done": true,
            "comment": "Implementado com botões de alternância entre linear-gradient e radial-gradient"
          },
          {
            "description": "Permitir ajuste de ângulo para gradientes lineares",
            "done": true,
            "comment": "Campo numérico para controle de ângulo implementado"
          }
        ]
      },
      {
        "story": "Como usuário, quero poder escolher cores de uma galeria pré-definida para que eu possa aplicar rapidamente estilos populares",
        "derivedRequirements": [
          {
            "description": "Criar galeria de backgrounds pré-definidos",
            "done": true,
            "comment": "Array de 37 backgrounds pré-definidos implementado"
          },
          {
            "description": "Implementar preview visual dos backgrounds",
            "done": true,
            "comment": "Renderização visual com fundo transparente para preview"
          }
        ]
      },
      {
        "story": "Como desenvolvedor, quero poder adicionar e remover paradas de cor em gradientes para que eu possa criar efeitos complexos",
        "derivedRequirements": [
          {
            "description": "Botões para adicionar/remover paradas de cor",
            "done": true,
            "comment": "Funcionalidades add() e del() implementadas"
          },
          {
            "description": "Controle de posição e transparência para cada parada",
            "done": true,
            "comment": "Inputs para cor, transparência e posição implementados"
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar suporte para background-image com URLs",
        "done": false,
        "comment": "Atualmente só suporta cores sólidas e gradientes"
      },
      {
        "description": "Implementar presets salvos pelo usuário",
        "done": false,
        "comment": "Permitir salvar configurações personalizadas"
      },
      {
        "description": "Adicionar suporte para gradientes cônicos",
        "done": false,
        "comment": "Expandir além de linear e radial"
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Corrigir ordenação automática de paradas de cor",
        "done": true,
        "comment": "Implementado sort() no método changeValues()"
      },
      {
        "description": "Melhorar parsing de strings CSS complexas",
        "done": false,
        "comment": "Método changeStr() pode falhar com alguns formatos CSS"
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Melhorar acessibilidade com navegação por teclado",
        "done": false,
        "comment": "Adicionar suporte completo para keyboard navigation"
      },
      {
        "description": "Otimizar performance para muitas paradas de cor",
        "done": false,
        "comment": "Debounce implementado mas pode ser melhorado"
      },
      {
        "description": "Adicionar validação de entrada mais robusta",
        "done": false,
        "comment": "Validar valores de cor e porcentagem"
      }
    ]
  },
  "textToEmbedding": [
    "This plugin provides a robust UI for managing and customizing CSS backgrounds.",
    "It supports solid colors, linear and radial gradients, and a gallery of presets.",
    "Users can add, remove, and adjust color stops, transparency, and angles visually.",
    "Future requests include support for image URLs, user presets, conic gradients, and better accessibility."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9820,version:2"
}
    