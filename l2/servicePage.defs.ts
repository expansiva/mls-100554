/// <mls fileReference="_100554_/l2/servicePage.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/servicePage.ts",
    "componentType": "editorService",
    "componentScope": "editor",
    "group": "enhancement",
    "languages": [
      "en",
      "pt"
    ]
  },
  "references": {
    "webComponents": [
      "plugin-page-navigation-100554",
      "plugin-explore-list-100554",
      "plugin-prototype-improve-100554"
    ],
    "imports": [
      {
        "ref": "lit",
        "dependencies": [
          {
            "name": "html"
          },
          {
            "name": "css"
          },
          {
            "name": "unsafeHTML"
          },
          {
            "name": "repeat"
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
            "name": "state"
          },
          {
            "name": "query"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/serviceBase.js",
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
        "ref": "/_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "selectLevel"
          },
          {
            "name": "openService"
          },
          {
            "name": "saveOpenedFile"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/pluginPrototypeImprove.js"
      },
      {
        "ref": "/_100554_/l2/pluginExploreList.js"
      },
      {
        "ref": "/_100554_/l2/pluginPageNavigation.js"
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Service page with tabs for Explore, Navigation, Improve",
      "businessCapabilities": [
        "Explore",
        "Navigation",
        "Improve"
      ],
      "technicalCapabilities": [
        "Renders tabs",
        "Handles events",
        "Integrates plugins"
      ],
      "implementedFeatures": [
        "Tab navigation",
        "Plugin integration"
      ],
      "constraints": [
        "level: [5]",
        "position: right"
      ]
    }
  }
}
    