/// <mls fileReference="_100554_/l2/ateste2.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/ateste2.ts",
    "componentType": "molecule",
    "componentScope": "appFrontEnd",
    "languages": [
      "pt"
    ],
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "lit",
        "dependencies": [
          {
            "name": "html"
          }
        ]
      },
      {
        "ref": "lit/decorators.js",
        "dependencies": [
          {
            "name": "customElement"
          },
          {
            "name": "property"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLitElement.js",
        "dependencies": [
          {
            "name": "CollabLitElement",
            "type": "class"
          }
        ]
      }
    ]
  },
  "codeInsights": {
    "deadCodeBlocks": [
      "message_pt"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "SimpleGreeting component for displaying fruits fetched from server",
      "businessCapabilities": [
        "Fetch and display list of fruits/products"
      ],
      "technicalCapabilities": [
        "Custom Lit element with properties and event handling",
        "Fetch API integration with custom config"
      ],
      "implementedFeatures": [
        "Property declarations for frutas and name",
        "firstUpdated lifecycle for config",
        "handleConfirm event handler",
        "render method with HTML template",
        "buscar method for fetching data",
        "configFetch for preview mode fetch override"
      ]
    }
  }
}
    