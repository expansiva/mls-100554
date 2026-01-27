/// <mls fileReference="_100554_/l2/collabPreviewL4.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabPreviewL4.ts",
    "componentType": "molecule",
    "componentScope": "appFrontEnd",
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "collab-preview-l4-100554"
    ],
    "imports": [
      {
        "ref": "lit",
        "dependencies": [
          {
            "name": "html"
          }
        ]
      },
      {
        "ref": "lit/decorators.js",
        "dependencies": [
          {
            "name": "customElement"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLitElement.js",
        "dependencies": [
          {
            "name": "CollabLitElement",
            "type": "class"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/utils",
        "dependencies": [
          {
            "name": "convertTagToFileName",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabL3EditText.js"
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Lit-based web component for L4 preview with overlays",
      "businessCapabilities": [
        "Provides hover overlays for elements",
        "Enables selection and editing of elements"
      ],
      "technicalCapabilities": [
        "Uses Lit for rendering",
        "Implements custom elements",
        "Handles mouse events and DOM manipulation"
      ],
      "implementedFeatures": [
        "setHover",
        "selectElement",
        "init",
        "createOverlay",
        "createOverlaySelected",
        "setEventsMouse",
        "_setElement",
        "_setHover",
        "caculetePosSelected",
        "_selectElement",
        "editEl"
      ]
    }
  }
}
    