/// <mls fileReference="_100554_/l2/saveAddBranch.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/saveAddBranch.ts",
    "componentType": "molecule",
    "componentScope": "appFrontEnd",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "lit",
        "dependencies": [
          {
            "name": "html",
            "type": "function"
          },
          {
            "name": "css",
            "type": "function"
          },
          {
            "name": "repeat",
            "type": "function"
          },
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
            "name": "customElement",
            "type": "function"
          },
          {
            "name": "property",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/\\_100554_/l2/libCommom",
        "dependencies": [
          {
            "name": "getMyKeysBranch",
            "type": "function"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "LitElement web component for saving and adding branches",
      "businessCapabilities": [
        "List branches",
        "List forks",
        "Add new branch"
      ],
      "technicalCapabilities": [
        "Renders UI with LitElement",
        "Handles user interactions",
        "Calls driver methods"
      ],
      "implementedFeatures": [
        "Branch listing",
        "Fork listing",
        "New branch creation"
      ]
    }
  }
}
    