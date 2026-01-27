/// <mls fileReference="_100554_/l2/pluginCodelensServiceDetails.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/pluginCodelensServiceDetails.ts",
    "componentType": "pluginUI",
    "componentScope": "editor",
    "languages": [
      "en",
      "pt"
    ],
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "wc-code-100554"
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
            "name": "unsafeHTML",
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
            "type": "?"
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
      "generalDescription": "Plugin Codelens Service Details",
      "businessCapabilities": [
        "Configure service details for plugins"
      ],
      "technicalCapabilities": [
        "Uses LitElement for rendering",
        "Supports internationalization"
      ],
      "implementedFeatures": [
        "Renders service configuration examples",
        "Displays icon, state, and custom configuration details"
      ]
    }
  }
}
    