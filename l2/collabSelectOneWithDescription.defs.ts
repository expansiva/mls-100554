/// <mls fileReference="_100554_/l2/collabSelectOneWithDescription.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabSelectOneWithDescription.ts",
    "componentType": "molecule",
    "componentScope": "appFrontEnd",
    "languages": [
      "en",
      "pt"
    ],
    "group": "enhancement",
    "devFidelity": "final"
  },
  "references": {
    "webComponents": [
      "collab-select-one-with-description-100554"
    ],
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
            "name": "property",
            "type": "function"
          },
          {
            "name": "query",
            "type": "function"
          },
          {
            "name": "queryAll",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabDecorators.js",
        "dependencies": [
          {
            "name": "propertyDataSource",
            "type": "function"
          },
          {
            "name": "propertyCompositeDataSource",
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
            "name": "collab_bolt",
            "type": "constant"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "A select one component with hover descriptions",
      "businessCapabilities": [
        "Allows selection of one option from a list",
        "Displays descriptions on hover or focus"
      ],
      "technicalCapabilities": [
        "Custom Lit element",
        "Keyboard navigation support",
        "Event handling for blur, click, mouseover"
      ],
      "implementedFeatures": [
        "Renders options list",
        "Handles hover to show descriptions",
        "Keyboard arrow navigation",
        "Enter/space to select",
        "Toggle open/close",
        "Popup positioning calculation"
      ],
      "constraints": []
    }
  }
}
    