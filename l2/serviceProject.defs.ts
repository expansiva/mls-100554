/// <mls fileReference="_100554_/l2/serviceProject.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/serviceProject.ts",
    "componentType": "service",
    "componentScope": "editor",
    "languages": [
      "en",
      "pt"
    ],
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "collab-panel-100554"
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
            "name": "query"
          },
          {
            "name": "queryAll"
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
          },
          {
            "name": "IOptions"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabIcons.js",
        "dependencies": [
          {
            "name": "collab_user"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libCompile.js",
        "dependencies": [
          {
            "name": "getAllWebComponentsInSource"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/utils.js",
        "dependencies": [
          {
            "name": "convertTagToFileName"
          },
          {
            "name": "convertFileNameToTag"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "loadPluginProject"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabPanel.js"
      }
    ]
  },
  "codeInsights": {
    "todos": [
      "In Develpoment",
      "In development: Details plugins"
    ],
    "i18nWarnings": [
      "About this content",
      "nothing selected",
      "service-project-100554",
      "project.html",
      "collab-panel-100554",
      "File 'project.html' dont's exist in selected project",
      "Select a plugin",
      "In development: Details plugins",
      "Explore and add new plugins",
      "Explore e adicione novos plug-ins",
      "No project selected"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Service for project management with tabs for Explore, ShowCase, Admin, and Plugins",
      "businessCapabilities": [
        "Explore plugins",
        "Display project showcase",
        "Administer plugins",
        "List and manage plugins"
      ],
      "technicalCapabilities": [
        "Dynamic plugin loading",
        "UI rendering with Lit",
        "Event handling"
      ],
      "implementedFeatures": [
        "Explore tab",
        "ShowCase tab",
        "Admin tab",
        "Plugins tab"
      ]
    }
  }
}
    