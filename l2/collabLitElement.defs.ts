/// <mls fileReference="_100554_/l2/collabLitElement.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabLitElement.ts",
    "componentType": "other",
    "componentScope": "appFrontEnd",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "lit",
        "dependencies": [
          {
            "name": "LitElement",
            "type": "class"
          }
        ]
      },
      {
        "ref": "lit/decorators.js",
        "dependencies": [
          {
            "name": "property",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabState.js",
        "dependencies": [
          {
            "name": "globalState"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Class extending LitElement with CollabState functionality.",
      "businessCapabilities": [
        "Integrates global state",
        "Handles message keys for internationalization",
        "Loads styles dynamically"
      ],
      "technicalCapabilities": [
        "Overrides createRenderRoot",
        "Overrides updated method",
        "Provides getMessageKey function",
        "Provides loadStyle method"
      ],
      "implementedFeatures": [
        "Global variation property",
        "Message key resolution",
        "Dynamic style loading"
      ]
    }
  }
}
    