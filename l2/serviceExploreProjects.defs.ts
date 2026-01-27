/// <mls fileReference="_100554_/l2/serviceExploreProjects.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/serviceExploreProjects.ts",
    "componentType": "service",
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
          },
          {
            "name": "query",
            "type": "?",
            "purpose": "decorator"
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
      "generalDescription": "Service to explore and select projects",
      "businessCapabilities": [
        "explore projects",
        "select project",
        "view project history",
        "filter projects"
      ],
      "technicalCapabilities": [
        "render project lists",
        "handle project selection events",
        "manage project state",
        "load project history"
      ],
      "implementedFeatures": [
        "project history rendering",
        "project list rendering",
        "filtering projects",
        "project selection"
      ]
    }
  }
}
    