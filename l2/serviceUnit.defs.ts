/// <mls fileReference="_100554_/l2/serviceUnit.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/serviceUnit.ts",
    "componentType": "service",
    "componentScope": "editor",
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
          },
          {
            "name": "queryAll",
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
          },
          {
            "name": "IOptions",
            "type": "interface"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libCompile.js",
        "dependencies": [
          {
            "name": "getAllWebComponentsInSource",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/utils.js",
        "dependencies": [
          {
            "name": "convertTagToFileName",
            "type": "function"
          },
          {
            "name": "convertFileNameToTag",
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
        "ref": "/_100554_/l2/collabPanel.js"
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Service unit for plugin exploration and management",
      "businessCapabilities": [
        "Explore and add new plugins"
      ],
      "technicalCapabilities": [
        "Renders UI with tabs",
        "Handles plugin loading",
        "Manages i18n messages"
      ],
      "implementedFeatures": [
        "Explore tab",
        "Plugin details rendering",
        "About this content"
      ]
    }
  }
}
    