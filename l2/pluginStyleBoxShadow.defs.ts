/// <mls fileReference="_100554_/l2/pluginStyleBoxShadow.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/pluginStyleBoxShadow.ts",
    "componentType": "pluginUI",
    "componentScope": "appFrontEnd",
    "languages": [
      "en",
      "pt"
    ],
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "plugin-style-box-shadow-100554",
      "collab-ds-input-select-color-100554",
      "collab-ds-input-range-100554"
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
            "name": "repeat",
            "type": "function"
          }
        ]
      },
      {
        "ref": "lit/decorators.js",
        "dependencies": [
          {
            "name": "customElement",
            "type": "?",
            "purpose": "decorator"
          },
          {
            "name": "property",
            "type": "?",
            "purpose": "decorator"
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
        "ref": "/_100554_/l2/collabDecorators.js",
        "dependencies": [
          {
            "name": "propertyDataSource",
            "type": "?",
            "purpose": "decorator"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabState.js",
        "dependencies": [
          {
            "name": "getState",
            "type": "function"
          },
          {
            "name": "setState",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLitElement.js",
        "dependencies": [
          {
            "name": "getMessageKey",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/lessCSS.js",
        "dependencies": [
          {
            "name": "ICSSState",
            "type": "interface"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "convertColorToHex",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabDsInputSelectColor.js"
      },
      {
        "ref": "/_100554_/l2/collabDsInputRange.js"
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "An intuitive plugin to manage and customize shadows on elements using box-shadow. Easily adjust color, offset, blur, spread, and mode (inset/outset). Perfect for crafting modern and stylish visual interfaces.",
      "businessCapabilities": [
        "manage and customize shadows on elements using box-shadow",
        "adjust color, offset, blur, spread, and mode (inset/outset)"
      ],
      "technicalCapabilities": [
        "uses Lit for rendering",
        "custom element with decorators",
        "handles state changes",
        "parses CSS rules",
        "renders gallery and input components"
      ],
      "implementedFeatures": [
        "gallery of predefined box-shadow styles",
        "inputs for X Offset, Y Offset, Blur, Spread, Color",
        "radio buttons for shadow mode (outset/inset)",
        "handles changes and updates state"
      ]
    }
  }
}
    