/// <mls fileReference="_100554_/l2/serviceDashboard.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/serviceDashboard.ts",
    "componentType": "editorService",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "collab-tiles-100554"
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
        "ref": "/_100554_/l2/serviceBase.js",
        "dependencies": [
          {
            "name": "ServiceBase",
            "type": "class"
          },
          {
            "name": "IService",
            "type": "interface"
          },
          {
            "name": "IToolbarContent",
            "type": "interface"
          },
          {
            "name": "IServiceMenu",
            "type": "interface"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libProjectConfig.js",
        "dependencies": [
          {
            "name": "getConfigProject",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "loadPluginProject",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabTiles.js"
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Service dashboard component for displaying plugin tiles in tabs",
      "businessCapabilities": [
        "Displays dashboard with plugin tiles categorized into Examples 1 and Examples 2"
      ],
      "technicalCapabilities": [
        "Uses Lit for rendering",
        "Implements custom element",
        "Loads and configures plugins dynamically",
        "Handles responsive breakpoints",
        "Manages tab switching"
      ],
      "implementedFeatures": [
        "Renders collab-tiles based on active tab",
        "Loads plugins from project configuration",
        "Sorts tiles by index",
        "Shows about dialog",
        "Handles service visibility and mode changes"
      ]
    }
  }
}
    