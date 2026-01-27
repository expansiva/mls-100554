/// <mls fileReference="_100554_/l2/collabPanelItem.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabPanelItem.ts",
    "componentType": "molecule",
    "componentScope": "appFrontEnd",
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "collab-panel-item-100554"
    ],
    "imports": [
      {
        "ref": "/_102027_/l2/utils",
        "dependencies": [
          {
            "name": "convertTagToFileName",
            "type": "function"
          },
          {
            "name": "convertFileNameToTag",
            "type": "function"
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
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "LitElement component for collaborative panel item",
      "businessCapabilities": [
        "Displays panel item with badge, SVG, and info",
        "Handles click to activate and fire plugin details event"
      ],
      "technicalCapabilities": [
        "Uses LitElement for rendering",
        "Supports dynamic import of plugin data",
        "Renders HTML or tag based on mode"
      ],
      "implementedFeatures": [
        "widget property",
        "badge property",
        "loading property",
        "mode property",
        "Click handling for activation",
        "Dynamic SVG and title display"
      ]
    }
  }
}
    