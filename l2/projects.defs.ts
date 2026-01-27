/// <mls fileReference="_100554_/l2/projects.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/projects.ts",
    "componentType": "page",
    "componentScope": "appFrontEnd",
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "plugin-create-project-100554"
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
        "ref": "/_100554_/l2/stateLitElement.js",
        "dependencies": [
          {
            "name": "StateLitElement",
            "type": "class"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "setProjectDetails",
            "type": "function"
          },
          {
            "name": "checkIfHasLocalProject",
            "type": "function"
          },
          {
            "name": "getLocalProjectName",
            "type": "function"
          }
        ]
      },
      {
        "ref": "./_100554_pluginCreateProject"
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Projects management component",
      "businessCapabilities": [
        "list projects",
        "select project",
        "view project details",
        "add new project",
        "archive project"
      ],
      "technicalCapabilities": [
        "Lit web component",
        "state management"
      ],
      "implementedFeatures": [
        "render project list",
        "render project details",
        "render add project",
        "filter projects",
        "archive confirmation"
      ]
    }
  }
}
    