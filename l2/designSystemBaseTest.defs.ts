/// <mls fileReference="_100554_/l2/designSystemBaseTest.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/designSystemBaseTest.ts",
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
          }
        ]
      },
      {
        "ref": "/_100554_/l2/stateLitElement.js",
        "dependencies": [
          {
            "name": "StateLitElement"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/designSystemBase.js",
        "dependencies": [
          {
            "name": "getImages"
          },
          {
            "name": "getVideos"
          },
          {
            "name": "getTokens"
          },
          {
            "name": "getTokensLess"
          },
          {
            "name": "getTokensCss"
          },
          {
            "name": "addAssets"
          },
          {
            "name": "addNewTokensTheme"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Design System Base Test Component",
      "businessCapabilities": [
        "Testing design system functions"
      ],
      "technicalCapabilities": [
        "Extends StateLitElement",
        "Uses Lit for rendering"
      ],
      "implementedFeatures": [
        "Get Tokens",
        "Get Tokens Less",
        "Get Tokens Css",
        "Add Tokens Theme",
        "Get Images",
        "Get Videos",
        "Add assets"
      ]
    }
  }
}
    