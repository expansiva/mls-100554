/// <mls fileReference="_100554_/l2/serviceDashboard.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/serviceDashboard.ts",
    "componentType": "service",
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
            "type": "constant"
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
      "generalDescription": "Service Dashboard",
      "businessCapabilities": [
        "Display plugins in tiles",
        "Switch between tabs for Example 1 and Example 2"
      ],
      "technicalCapabilities": [
        "Load plugins from project config",
        "Render collab-tiles-100554",
        "Handle responsive breakpoints"
      ],
      "implementedFeatures": [
        "Tab navigation",
        "Plugin loading and sorting",
        "Tile positioning"
      ]
    }
  }
}
    