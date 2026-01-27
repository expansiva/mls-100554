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
            "name": "html"
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
            "name": "state"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "getInstanceByFile"
          },
          {
            "name": "openService"
          },
          {
            "name": "saveOpenedFile"
          },
          {
            "name": "getLastModule"
          },
          {
            "name": "setLastModule"
          },
          {
            "name": "getProjectConfig"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/stateLitElement.js",
        "dependencies": [
          {
            "name": "StateLitElement"
          }
        ]
      },
      {
        "ref": "/_100554_pluginDeleteModule"
      }
    ],
    "statesRO": [],
    "statesRW": [],
    "statesWO": []
  },
  "codeInsights": {
    "todos": [
      "Implement add module functionality"
    ],
    "securityWarnings": [],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibilityIssues": [],
    "i18nWarnings": [],
    "performanceHints": []
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Module selector component",
      "businessCapabilities": [
        "Select module",
        "View module details",
        "Filter modules"
      ],
      "technicalCapabilities": [
        "Lit-based web component",
        "State management",
        "Event handling"
      ],
      "implementedFeatures": [
        "Render module list",
        "Render module details",
        "Render error view",
        "Render add view",
        "Filter modules",
        "Select module",
        "Load last selected module",
        "Save selected module"
      ]
    }
  }
}
    