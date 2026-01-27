/// <mls fileReference="_100554_/l2/projects.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/projects.ts",
    "componentType": "organism",
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
  "codeInsights": {
    "todos": [
      "In develpoment"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Projects component",
      "businessCapabilities": [
        "list projects",
        "select project",
        "view project details",
        "archive project",
        "add new project"
      ],
      "technicalCapabilities": [
        "render project lists",
        "handle state changes",
        "filter projects"
      ],
      "implementedFeatures": [
        "render header",
        "render project list",
        "render current project",
        "render user projects",
        "render community projects",
        "render project details",
        "render add view",
        "get organizations and projects",
        "create local project item",
        "open details",
        "go back",
        "confirm archive",
        "on project click"
      ]
    }
  }
}
    