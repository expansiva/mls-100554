/// <mls fileReference="_100554_/l2/serviceExploreProjects.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/serviceExploreProjects.ts",
    "componentType": "editorService",
    "componentScope": "editor",
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
            "name": "property",
            "type": "function"
          },
          {
            "name": "queryAll",
            "type": "function"
          },
          {
            "name": "query",
            "type": "function"
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
            "name": "getProjectDetails",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/serviceBase.js",
        "dependencies": [
          {
            "name": "ServiceBase",
            "type": "class"
          },
          {
            "name": "IService",
            "type": "interface"
          },
          {
            "name": "IToolbarContent",
            "type": "interface"
          },
          {
            "name": "IServiceMenu",
            "type": "interface"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Service for exploring projects",
      "businessCapabilities": [
        "Explore projects",
        "Select project",
        "View history",
        "Filter projects"
      ],
      "technicalCapabilities": [
        "Renders with Lit",
        "Handles events",
        "Manages state"
      ],
      "implementedFeatures": [
        "Project selection",
        "History management",
        "Project filtering"
      ]
    }
  }
}
    