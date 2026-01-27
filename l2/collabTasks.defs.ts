/// <mls fileReference="_100554_/l2/collabTasks.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabTasks.ts",
    "componentType": "organism",
    "componentScope": "appFrontEnd",
    "languages": [
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
        "ref": "/_100554_/l2/collabIcons.js",
        "dependencies": [
          {
            "name": "collab_spinner_clock",
            "type": "constant"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Task management component with list and details views",
      "businessCapabilities": [
        "Display tasks in stages: EM PROGRESSO, REVIEW, PENDENTE",
        "Switch to task details view",
        "Navigate back to list"
      ],
      "technicalCapabilities": [
        "Lit web component",
        "State management with @state decorators"
      ],
      "implementedFeatures": [
        "Render task list with stages",
        "Render task details",
        "Back button functionality"
      ]
    }
  }
}
    