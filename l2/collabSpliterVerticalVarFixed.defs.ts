/// <mls fileReference="_100554_/l2/collabSpliterVerticalVarFixed.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabSpliterVerticalVarFixed.ts",
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
            "name": "query",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabIcons.js",
        "dependencies": [
          {
            "name": "collab_chevron_down",
            "type": "constant"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Vertical splitter component with variable fixed height",
      "businessCapabilities": [
        "Splits content into top and bottom panes",
        "Toggles bottom pane visibility",
        "Distributes msize to child elements"
      ],
      "technicalCapabilities": [
        "LitElement custom element",
        "Uses ResizeObserver for height changes",
        "Manages CSS properties for layout"
      ],
      "implementedFeatures": [
        "Toggle bottom pane on spliter click",
        "Apply msize to panes",
        "Observe resize on bottom pane"
      ],
      "constraints": [
        "Requires msize attribute for sizing",
        "Fixed height for bottom pane"
      ]
    }
  }
}
    