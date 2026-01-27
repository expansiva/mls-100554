/// <mls fileReference="_100554_/l2/collabSpliterHorizontalVarFixed.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabSpliterHorizontalVarFixed.ts",
    "componentType": "molecule",
    "componentScope": "appFrontEnd",
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
          },
          {
            "name": "LitElement",
            "type": "class"
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
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabIcons.js",
        "dependencies": [
          {
            "name": "collab_chevron_right",
            "type": "constant"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Horizontal splitter component with variable fixed width",
      "businessCapabilities": [
        "Splits view into left and right panes",
        "Toggles visibility of right pane",
        "Resizes panes based on fixed width"
      ],
      "technicalCapabilities": [
        "LitElement custom element",
        "Handles property changes for visibility and width",
        "Distributes slotted content"
      ],
      "implementedFeatures": [
        "Toggle right pane open/close",
        "Set fixed width in px or %",
        "Update pane sizes on resize",
        "Apply msize attributes to slotted elements"
      ]
    }
  }
}
    