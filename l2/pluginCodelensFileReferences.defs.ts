/// <mls fileReference="_100554_/l2/pluginCodelensFileReferences.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/pluginCodelensFileReferences.ts",
    "componentType": "pluginUI",
    "componentScope": "appFrontEnd",
    "languages": [
      "en",
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
            "name": "html",
            "type": "function"
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
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin for displaying file references in code lens",
      "businessCapabilities": [
        "Display file references"
      ],
      "technicalCapabilities": [
        "Renders HTML template",
        "Handles click events",
        "Fires file open events"
      ],
      "implementedFeatures": [
        "Fetch and display references",
        "Handle click to open file"
      ]
    }
  }
}
    