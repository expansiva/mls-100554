/// <mls fileReference="_100554_/l2/pluginCodelensFileReferences.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/pluginCodelensFileReferences.ts",
    "componentType": "pluginUI",
    "componentScope": "appFrontEnd",
    "languages": [
      "en",
      "pt"
    ],
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
    "deadCodeBlocks": [
      "return [];"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin for code lens file references",
      "businessCapabilities": [
        "Display file references"
      ],
      "technicalCapabilities": [
        "Lit web component",
        "i18n support"
      ],
      "implementedFeatures": [
        "Render references list",
        "Handle click to open file"
      ]
    }
  }
}
    