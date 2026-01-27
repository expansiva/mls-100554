/// <mls fileReference="_100554_/l2/collabConsole.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabConsole.ts",
    "componentType": "molecule",
    "componentScope": "appFrontEnd",
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "collab-console-100554"
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
          },
          {
            "name": "property"
          },
          {
            "name": "state"
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
      "generalDescription": "Lit-based web component for console log interception and display",
      "businessCapabilities": [
        "Intercept console logs",
        "Display logs in UI"
      ],
      "technicalCapabilities": [
        "Uses Lit for rendering",
        "Extends StateLitElement"
      ],
      "implementedFeatures": [
        "Log interception with timestamps",
        "Scrollable log display"
      ]
    }
  }
}
    