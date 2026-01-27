/// <mls fileReference="_100554_/l2/collabTiles.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabTiles.ts",
    "componentType": "molecule",
    "componentScope": "appFrontEnd",
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "collab-tiles-item-100554"
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
            "name": "repeat",
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
        "ref": "/_100554_/l2/libProjectConfig.js",
        "dependencies": [
          {
            "name": "getConfigProject",
            "type": "function"
          },
          {
            "name": "updateConfigProjectPlugins",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/ _100554_/l2/collabTilesItem.js"
      },
      {
        "ref": "https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.3/Sortable.min.js"
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "LitElement component for collab tiles with config and drag-drop",
      "businessCapabilities": [
        "Manage tiles items",
        "Configure tile positions",
        "Save tile configurations"
      ],
      "technicalCapabilities": [
        "Uses LitElement for rendering",
        "Integrates Sortable for drag-and-drop"
      ],
      "implementedFeatures": [
        "Renders tiles list",
        "Opens/closes config mode",
        "Handles drag-and-drop",
        "Saves changes to project config"
      ]
    }
  }
}
    