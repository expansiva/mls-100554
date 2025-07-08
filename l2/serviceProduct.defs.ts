/// <mls shortName="serviceProduct" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "serviceProduct",
    "type": "widget",
    "group": "other",
    "tags": [
      "lit",
      "service",
      "mindmap",
      "product"
    ]
  },
  "references": {
    "widgets": [
      "widget-mind-map-l4-100554"
    ],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_serviceBase",
      "./_100554_widgetMindMapL4"
    ],
    "statesRW": [
      "msize",
      "activeTab"
    ],
    "statesRO": [
      "details",
      "menu"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [
      "repeat"
    ],
    "deadCodeBlocks": [
      "onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {\n}"
    ],
    "accessibility": [
      "No explicit accessibility attributes (aria-*, tabindex) found in the HTML output.",
      "Component relies on custom widget; ensure widget-mind-map-l4-100554 is accessible.",
      "No keyboard navigation or focus management detected."
    ],
    "i18nWarnings": [
      "Tooltip 'Product' and tab text 'MindMap' are hardcoded and not internationalized."
    ],
    "correctness": 8,
    "errorHandling": 5,
    "readability": 8,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Widget de serviço para exibir e gerenciar produtos, com foco em visualização MindMap. Utiliza LitElement e integra um widget de mapa mental. Estrutura básica de tabs, mas atualmente apenas MindMap está implementado.",
    "goal": "Fornecer uma interface de serviço para produtos, permitindo visualização em MindMap e futura expansão para outros modos/tabs.",
    "userStories": [
      {
        "story": "Como usuário, quero visualizar produtos em formato de mapa mental para entender melhor suas relações.",
        "derivedRequirements": [
          {
            "description": "Integrar widget de MindMap ao serviço de produto.",
            "done": true,
            "comment": "Implementado via <widget-mind-map-l4-100554>."
          },
          {
            "description": "Permitir alternância de abas para diferentes modos de visualização.",
            "done": false,
            "comment": "Estrutura de tabs existe, mas apenas MindMap está disponível."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Adicionar mais modos de visualização além do MindMap.",
        "done": false,
        "comment": "Somente MindMap implementado no momento."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Internacionalizar textos fixos como 'Product' e 'MindMap'.",
        "done": false,
        "comment": "Textos estão hardcoded."
      }
    ]
  },
  "textToEmbedding": [
    "This widget provides a service interface for products, focusing on MindMap visualization.",
    "It uses LitElement and integrates a custom mind map widget. Only the MindMap tab is currently available.",
    "There are requests to add more visualization modes and to internationalize hardcoded texts.",
    "Accessibility and error handling could be improved; only basic tab structure is present."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9784,version:2"
}
    