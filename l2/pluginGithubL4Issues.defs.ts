/// <mls fileReference="_100554_/l2/pluginGithubL4Issues.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/pluginGithubL4Issues.ts",
    "componentType": "pluginUI",
    "componentScope": "appFrontEnd",
    "group": "enhancement",
    "devFidelity": "final"
  },
  "references": {
    "webComponents": [
      "plugin-github-l4-issues-100554"
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
          },
          {
            "name": "svg",
            "type": "function"
          },
          {
            "name": "TemplateResult",
            "type": "interface"
          },
          {
            "name": "LitElement",
            "type": "class"
          },
          {
            "name": "repeat",
            "type": "function"
          },
          {
            "name": "unsafeHTML",
            "type": "function"
          }
        ]
      },
      {
        "ref": "lit/decorators.js",
        "dependencies": [
          {
            "name": "query",
            "type": "function"
          },
          {
            "name": "property",
            "type": "function"
          },
          {
            "name": "customElement",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "getMyKeysBranch",
            "type": "function"
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
            "type": "class"
          }
        ]
      }
    ],
    "statesRO": [],
    "statesRW": [],
    "statesWO": []
  },
  "asIs": {
    "semantic": {
      "generalDescription": "GitHub Issues Management Plugin",
      "businessCapabilities": [
        "Integrate GitHub issues into the application",
        "Display, filter, and manage issues",
        "Create new issues",
        "View and add comments",
        "Vote on issues"
      ],
      "technicalCapabilities": [
        "Uses LitElement for web components",
        "Interacts with GitHub API via libGithubIo",
        "Supports issue filtering and rendering"
      ],
      "implementedFeatures": [
        "List issues",
        "Show issue details",
        "Create new issue",
        "Add comments",
        "Vote with thumbs up",
        "Change issue priority labels"
      ]
    }
  }
}
    