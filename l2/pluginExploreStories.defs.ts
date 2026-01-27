/// <mls fileReference="_100554_/l2/pluginExploreStories.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/pluginExploreStories.ts",
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
            "name": "html"
          },
          {
            "name": "css"
          },
          {
            "name": "svg"
          },
          {
            "name": "repeat"
          },
          {
            "name": "TemplateResult"
          }
        ]
      },
      {
        "ref": "lit/decorators.js",
        "dependencies": [
          {
            "name": "property"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/pluginBaseModule.js",
        "dependencies": [
          {
            "name": "PluginBaseModule"
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
            "name": "forceServiceInstance"
          },
          {
            "name": "openService"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin to explore stories",
      "businessCapabilities": [
        "List draft stories",
        "Edit draft",
        "Delete draft"
      ],
      "technicalCapabilities": [
        "Renders HTML using Lit",
        "Uses custom elements",
        "Interacts with mls storage"
      ],
      "implementedFeatures": [
        "renderDraft",
        "renderPublished",
        "renderList",
        "renderLiItem"
      ]
    }
  }
}
    