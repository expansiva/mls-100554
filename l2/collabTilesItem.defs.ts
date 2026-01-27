/// <mls fileReference="_100554_/l2/collabTilesItem.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabTilesItem.ts",
    "componentType": "molecule",
    "componentScope": "appFrontEnd",
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "collabtileitemcontent",
      "collabtileenabled",
      "collabtileitemresize"
    ],
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
            "type": "constant"
          },
          {
            "name": "LitElement",
            "type": "class"
          },
          {
            "name": "unsafeHTML",
            "type": "function"
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
          },
          {
            "name": "query",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/utils",
        "dependencies": [
          {
            "name": "convertFileNameToTag",
            "type": "function"
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
      "generalDescription": "LitElement component for collaborative tiles item",
      "businessCapabilities": [
        "Render tiles in a dashboard",
        "Load and display plugins",
        "Enable/disable tiles",
        "Resize tiles via drag"
      ],
      "technicalCapabilities": [
        "Uses LitElement for web components",
        "Implements drag and drop for resizing",
        "Dynamically imports plugins"
      ],
      "implementedFeatures": [
        "Plugin loading",
        "Tile resizing",
        "Enable/disable functionality",
        "Click to open plugin details"
      ]
    }
  }
}
    