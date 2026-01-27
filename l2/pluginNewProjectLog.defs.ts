/// <mls fileReference="_100554_/l2/pluginNewProjectLog.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/pluginNewProjectLog.ts",
    "componentType": "pluginUI",
    "componentScope": "appFrontEnd",
    "group": "enhancement"
  },
  "references": {
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
            "name": "LitElement"
          },
          {
            "name": "TemplateResult"
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
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabIcons",
        "dependencies": [
          {
            "name": "collab_check"
          },
          {
            "name": "collab_circle_notch"
          },
          {
            "name": "collab_triangle_exclamation"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLitElement",
        "dependencies": [
          {
            "name": "CollabLitElement"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Log line component for new project status",
      "businessCapabilities": [
        "Display text with status-based icons"
      ],
      "technicalCapabilities": [
        "LitElement custom element with properties"
      ],
      "implementedFeatures": [
        "Status property",
        "Text property",
        "Icon mapping by status"
      ]
    }
  }
}
    