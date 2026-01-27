/// <mls fileReference="_100554_/l2/modules.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/modules.ts",
    "componentType": "organism",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "plugin-delete-module-100554"
    ],
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
            "name": "state",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/\\_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "getInstanceByFile",
            "type": "function"
          },
          {
            "name": "openService",
            "type": "function"
          },
          {
            "name": "saveOpenedFile",
            "type": "function"
          },
          {
            "name": "getLastModule",
            "type": "function"
          },
          {
            "name": "setLastModule",
            "type": "function"
          },
          {
            "name": "getProjectConfig",
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
        "ref": "/_100554_pluginDeleteModule"
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Module selection and management component",
      "businessCapabilities": [
        "Select a module from a list",
        "View module details",
        "Add new modules",
        "Filter modules"
      ],
      "technicalCapabilities": [
        "Renders different views based on currentView state",
        "Uses Lit for templating",
        "Manages module state and local storage"
      ],
      "implementedFeatures": [
        "Module list rendering",
        "Module details view",
        "Add module view",
        "Error handling",
        "Filtering functionality"
      ]
    }
  }
}
    