/// <mls fileReference="_100554_/l2/collabPanel.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabPanel.ts",
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
        "ref": "lit",
        "dependencies": [
          {
            "name": "html"
          },
          {
            "name": "css"
          },
          {
            "name": "UnsafeHTMLDirective"
          },
          {
            "name": "repeat"
          },
          {
            "name": "unsafeHTML"
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
          },
          {
            "name": "query"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabPanelItem.js"
      },
      {
        "ref": "/_100554_/l2/collabLitElement.js",
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
      "generalDescription": "Collapsible panel component for plugin menu actions",
      "businessCapabilities": [
        "Displays categorized plugin menu actions in a collapsible panel"
      ],
      "technicalCapabilities": [
        "Uses Lit for rendering",
        "Supports HTML and tag modes for items"
      ],
      "implementedFeatures": [
        "Renders a details element with summary and content",
        "Repeats over myData to render items",
        "Toggles icon on summary click"
      ]
    }
  }
}
    