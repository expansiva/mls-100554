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
            "type": "function"
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
      "generalDescription": "LitElement component for dashboard tiles items",
      "businessCapabilities": [
        "Display plugin tiles",
        "Enable/disable tiles",
        "Resize tiles via drag",
        "Load and render plugins dynamically",
        "Handle click to open plugin details"
      ],
      "technicalCapabilities": [
        "Extends CollabLitElement",
        "Uses LitElement for rendering",
        "Handles drag events for resizing",
        "Dynamically imports and creates plugin elements"
      ],
      "implementedFeatures": [
        "Loading state with animation",
        "Conditional rendering based on edit mode and enabled status",
        "Grid positioning",
        "Plugin loading and preparation",
        "Resizing logic",
        "Enable/disable toggle"
      ]
    }
  }
}
    