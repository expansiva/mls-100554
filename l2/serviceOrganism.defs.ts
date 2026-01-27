/// <mls fileReference="_100554_/l2/serviceOrganism.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/serviceOrganism.ts",
    "componentType": "organism",
    "componentScope": "appFrontEnd",
    "languages": [
      "en",
      "pt"
    ],
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "plugin-explore-list-100554",
      "plugin-navigation-render-organism-100554",
      "plugin-edit-style-l3-100554",
      "plugin-prototype-improve-100554",
      "plugin-organism-add-100554",
      "plugin-organism-property-100554"
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
            "name": "loadPluginProject"
          },
          {
            "name": "forceServiceInstance"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/utils.js",
        "dependencies": [
          {
            "name": "convertFileNameToTag"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLibModel.js",
        "dependencies": [
          {
            "name": "readProjectTypescriptAndCompile"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/pluginEditStyleL3.js",
        "dependencies": [
          {
            "name": "PluginEditStyleL3"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/pluginExploreList.js"
      },
      {
        "ref": "/_100554_/l2/pluginPrototypeImprove.js"
      },
      {
        "ref": "/_100554_/l2/pluginOrganismAdd.js"
      },
      {
        "ref": "/_100554_/l2/pluginOrganismProperty.js"
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Service organism for managing page organisms",
      "businessCapabilities": [
        "Explore",
        "Navigation",
        "Style",
        "Improve",
        "Add",
        "Property"
      ],
      "technicalCapabilities": [
        "Lit-based web component",
        "Plugin loading",
        "Event handling",
        "I18n support"
      ],
      "implementedFeatures": [
        "Tab navigation",
        "Dynamic plugin integration"
      ],
      "constraints": [
        "Level 5",
        "Position right"
      ]
    }
  }
}
    