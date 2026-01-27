/// <mls fileReference="_100554_/l2/wcAuxCommand.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/wcAuxCommand.ts",
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
            "name": "customElement",
            "type": "function"
          },
          {
            "name": "property",
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
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Auxiliary command web component",
      "businessCapabilities": [
        "Handles keyboard shortcuts for auxiliary commands",
        "Displays grouped items for selection"
      ],
      "technicalCapabilities": [
        "Renders HTML lists using Lit",
        "Manages event listeners for keydown and click",
        "Positions element based on target"
      ],
      "implementedFeatures": [
        "Keyboard event handling",
        "Mouse leave deactivation",
        "Item click event dispatch"
      ]
    }
  }
}
    