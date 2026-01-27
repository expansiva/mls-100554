/// <mls fileReference="_100554_/l2/cssHelperIndex.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/cssHelperIndex.ts",
    "componentType": "molecule",
    "componentScope": "appFrontEnd",
    "languages": [
      "en",
      "pt"
    ],
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "plugin-style-index-item-100554"
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
            "name": "when",
            "type": "function"
          },
          {
            "name": "repeat",
            "type": "function"
          }
        ]
      },
      {
        "ref": "lit/decorators.js",
        "dependencies": [
          {
            "name": "customElement",
            "type": "?",
            "purpose": "decorator"
          },
          {
            "name": "property",
            "type": "?",
            "purpose": "decorator"
          },
          {
            "name": "queryAll",
            "type": "?",
            "purpose": "decorator"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/stateLitElement.js",
        "dependencies": [
          {
            "name": "StateLitElement",
            "type": "class"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabDecorators.js",
        "dependencies": [
          {
            "name": "propertyDataSource",
            "type": "?",
            "purpose": "decorator"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/pluginStyleIndexItem.js",
        "dependencies": [
          {
            "name": "PluginStyleIndexItem",
            "type": "class"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/cssHelperIndexBase.js",
        "dependencies": [
          {
            "name": "IHelpers",
            "type": "interface"
          },
          {
            "name": "IMode",
            "type": "type"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/lessCSS.js",
        "dependencies": [
          {
            "name": "ICSSState",
            "type": "interface"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabState.js",
        "dependencies": [
          {
            "name": "setState",
            "type": "function"
          },
          {
            "name": "getState",
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
        "ref": "/_100554_/l2/pluginStyleIndexItem.js"
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "CSS Helper Index Component",
      "businessCapabilities": [
        "Manages CSS helpers based on properties and values",
        "Filters and displays available plugins"
      ],
      "technicalCapabilities": [
        "Uses Lit for rendering",
        "Implements custom element with decorators",
        "Handles state changes for CSS properties"
      ],
      "implementedFeatures": [
        "Filters helpers by property and value",
        "Merges helper arrays",
        "Renders helper items",
        "Supports internationalization for messages"
      ]
    }
  }
}
    