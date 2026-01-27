/// <mls fileReference="_100554_/l2/serviceUser.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/serviceUser.ts",
    "componentType": "service",
    "componentScope": "editor",
    "languages": [
      "en",
      "pt"
    ],
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "collab-panel-100554",
      "collab-panel-item-100554"
    ],
    "imports": [
      {
        "ref": "lit",
        "dependencies": [
          {
            "name": "html"
          },
          {
            "name": "repeat"
          },
          {
            "name": "LitElement"
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
          },
          {
            "name": "query"
          }
        ]
      },
      {
        "ref": "/\\_100554_/l2/serviceBase.js",
        "dependencies": [
          {
            "name": "ServiceBase"
          },
          {
            "name": "IService"
          },
          {
            "name": "IToolbarContent"
          },
          {
            "name": "IServiceMenu"
          }
        ]
      },
      {
        "ref": "/\\_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "loadPluginProject"
          }
        ]
      },
      {
        "ref": "/\\_100554_/l2/collabPanel.js"
      },
      {
        "ref": "/\\_100554_/l2/collabPanelItem.js"
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "User service component for settings and plugin management",
      "businessCapabilities": [
        "Explore and add new plugins",
        "Manage user settings"
      ],
      "technicalCapabilities": [
        "LitElement-based web component",
        "i18n support",
        "Plugin loading"
      ],
      "implementedFeatures": [
        "Settings tab",
        "Plugin panel rendering"
      ]
    }
  }
}
    