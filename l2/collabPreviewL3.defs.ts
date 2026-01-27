/// <mls fileReference="_100554_/l2/collabPreviewL3.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabPreviewL3.ts",
    "componentType": "molecule",
    "componentScope": "appFrontEnd",
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "collab-aux-overlay",
      "collab-selected-overlay"
    ],
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
        "ref": "/\\_100554_/l2/collabLitElement.js",
        "dependencies": [
          {
            "name": "CollabLitElement",
            "type": "class"
          }
        ]
      },
      {
        "ref": "/\\_100554_/l2/collabState.js",
        "dependencies": [
          {
            "name": "initState"
          }
        ]
      },
      {
        "ref": "/\\_100554_/l2/collabL3EditText.js"
      }
    ],
    "statesRO": [],
    "statesRW": [],
    "statesWO": []
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [
      "initState"
    ],
    "deadCodeBlocks": [],
    "accessibilityIssues": [],
    "i18nWarnings": [],
    "performanceHints": []
  },
  "auth": {},
  "asIs": {
    "semantic": {
      "generalDescription": "Component for previewing L3 collaboration with hover and selection overlays",
      "businessCapabilities": [
        "Provides hover overlay for elements",
        "Allows selection of elements with overlay"
      ],
      "technicalCapabilities": [
        "Creates and manages overlay elements",
        "Handles mouse events for hover and selection"
      ],
      "implementedFeatures": [
        "Hover overlay creation",
        "Selection overlay creation",
        "Element selection logic"
      ]
    }
  }
}
    