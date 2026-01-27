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
            "type": "function"
          },
          {
            "name": "property",
            "type": "function"
          },
          {
            "name": "queryAll",
            "type": "function"
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
            "type": "function"
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
  "codeInsights": {
    "unusedImports": [
      "setState"
    ],
    "deadCodeBlocks": [
      "// if (changedProperties.has('actualSelector') &&\n// this.actualProp === '' &&\n// this.actualValue === '' &&\n// this.actualSelector &&\n// (this.actualSelector.endsWith(':') || this.actualSelector.endsWith('::'))\n// ) {\n// this.avaliablePlugins = this.mergeHelpersArrays(this.avaliablePlugins, this.helpers);\n// this.helpers = this.avaliablePlugins.filter((pl) => pl.tags.includes('pseudo:*'));\n// if (this.helpers[0]) this.helpers[0].mode = 'full';\n// }"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "CSS Helper Index component",
      "businessCapabilities": [
        "Provide CSS helpers for properties and pseudo-selectors"
      ],
      "technicalCapabilities": [
        "Filter helpers by property and value",
        "Merge helper arrays",
        "Render helpers using Lit"
      ],
      "implementedFeatures": [
        "Filtering by prop",
        "Merging arrays",
        "Rendering with repeat"
      ]
    }
  }
}
    