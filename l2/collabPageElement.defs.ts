/// <mls fileReference="_100554_/l2/collabPageElement.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabPageElement.ts",
    "componentType": "page",
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
            "name": "PropertyValueMap",
            "type": "type"
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
            "name": "property",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/stateLitElement.js",
        "dependencies": [
          {
            "name": "StateLitElement",
            "type": "class"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/utils",
        "dependencies": [
          {
            "name": "convertTagToFileName",
            "type": "function"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Abstract class for Collab page elements",
      "businessCapabilities": [
        "Page initialization",
        "Overlay management",
        "Level handling"
      ],
      "technicalCapabilities": [
        "Extends StateLitElement",
        "Uses LitElement",
        "Dynamic imports"
      ],
      "implementedFeatures": [
        "initPage method",
        "Overlay creation",
        "Level-based overlay checks",
        "ICA ID setup"
      ]
    }
  }
}
    