/// <mls fileReference="_100554_/l2/collabTokensVisualization.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabTokensVisualization.ts",
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
            "name": "css",
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
      },
      {
        "ref": "/_100554_/l2/designSystemBase.js",
        "dependencies": [
          {
            "name": "getTokens",
            "type": "function"
          },
          {
            "name": "IDesignSystemTokens",
            "type": "interface"
          }
        ]
      }
    ]
  },
  "codeInsights": {
    "unusedImports": [
      "css"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Visualization of design system tokens",
      "businessCapabilities": [
        "Displays color palette from Default theme",
        "Renders text samples with primary and secondary backgrounds",
        "Shows font family primary and secondary",
        "Lists font sizes"
      ],
      "technicalCapabilities": [
        "Uses Lit for rendering",
        "Filters tokens by themeName",
        "Maps color keys to styled divs"
      ],
      "implementedFeatures": [
        "Displays colors excluding keys starting with _",
        "Renders 'Hello world' in primary and secondary backgrounds",
        "Displays 'Font family primary' and 'Font family secondary'",
        "Lists font sizes 12,16,20,24,40,48,64"
      ]
    }
  }
}
    