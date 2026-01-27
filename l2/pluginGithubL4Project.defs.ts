/// <mls fileReference="_100554_/l2/pluginGithubL4Project.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/pluginGithubL4Project.ts",
    "componentType": "pluginUI",
    "componentScope": "appFrontEnd",
    "group": "enhancement",
    "devFidelity": "final"
  },
  "references": {
    "imports": [
      {
        "ref": "lit",
        "dependencies": [
          {
            "name": "html",
            "type": "function",
            "purpose": "rendering HTML templates"
          },
          {
            "name": "svg",
            "type": "function",
            "purpose": "rendering SVG templates"
          },
          {
            "name": "TemplateResult",
            "type": "interface",
            "purpose": "type for template results"
          },
          {
            "name": "repeat",
            "type": "function",
            "purpose": "rendering lists"
          },
          {
            "name": "unsafeHTML",
            "type": "function",
            "purpose": "inserting unsafe HTML"
          }
        ]
      },
      {
        "ref": "lit/decorators.js",
        "dependencies": [
          {
            "name": "query",
            "type": "function",
            "purpose": "querying DOM elements"
          },
          {
            "name": "property",
            "type": "function",
            "purpose": "defining properties"
          },
          {
            "name": "customElement",
            "type": "function",
            "purpose": "defining custom elements"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "getMyKeysBranch",
            "type": "function",
            "purpose": "retrieving branch keys"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libGithubIo.js",
        "dependencies": []
      },
      {
        "ref": "/_100554_/l2/collabLitElement.js",
        "dependencies": [
          {
            "name": "CollabLitElement",
            "type": "class",
            "purpose": "base class for elements"
          }
        ]
      },
      {
        "ref": "https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.3/Sortable.min.js",
        "dependencies": []
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "GitHub Projects plugin component for managing and displaying GitHub projects and issues",
      "businessCapabilities": [
        "Integrate with GitHub Projects",
        "Display project lists",
        "Manage issues within projects",
        "Add new issues",
        "Update issue statuses",
        "Assign labels and members"
      ],
      "technicalCapabilities": [
        "Render project and issue views",
        "Handle drag-and-drop for status updates",
        "Interact with GitHub API via libGithubIo",
        "Use Lit for templating"
      ],
      "implementedFeatures": [
        "List projects",
        "Show project details with status columns",
        "View and edit issues",
        "Add issues to projects",
        "Filter and search issues"
      ],
      "constraints": []
    }
  }
}
    