/// <mls fileReference="_100554_/l2/collabPanelHelper.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabPanelHelper.ts",
    "componentType": "molecule",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "collab-panel-helper-100554"
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
            "name": "LitElement",
            "type": "class"
          },
          {
            "name": "PropertyValueMap",
            "type": "type"
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
            "name": "query",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabIcons.js",
        "dependencies": [
          {
            "name": "collab_chevron_right",
            "type": "constant"
          },
          {
            "name": "collab_chevron_left",
            "type": "constant"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Collapsible panel helper component",
      "businessCapabilities": [
        "Provides a toggleable helper panel"
      ],
      "technicalCapabilities": [
        "Uses LitElement for web component",
        "Handles click events to toggle visibility"
      ],
      "implementedFeatures": [
        "Toggle button with chevrons",
        "CSS transitions for opening/closing"
      ]
    }
  }
}
    