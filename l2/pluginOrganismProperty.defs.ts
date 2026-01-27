/// <mls fileReference="_100554_/l2/pluginOrganismProperty.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/pluginOrganismProperty.ts",
    "componentType": "organism",
    "componentScope": "appFrontEnd",
    "languages": [
      "en",
      "pt"
    ],
    "group": "enhancement",
    "devFidelity": "draft"
  },
  "references": {
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
            "name": "state",
            "type": "function"
          },
          {
            "name": "query",
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
  "codeInsights": {
    "unusedImports": [
      "state",
      "query"
    ],
    "i18nWarnings": [
      "Hardcoded string 'In development' should use i18n"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin organism property component displaying in development message",
      "businessCapabilities": [],
      "technicalCapabilities": [
        "Renders HTML using Lit",
        "Supports i18n for English and Portuguese"
      ],
      "implementedFeatures": [
        "Basic Lit element with custom element decorator",
        "i18n setup"
      ],
      "constraints": []
    }
  }
}
    