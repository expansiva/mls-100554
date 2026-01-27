/// <mls fileReference="_100554_/l2/designSystemBase.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/designSystemBase.ts",
    "componentType": "tool",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_100554_/l2/serviceSource.js",
        "dependencies": [
          {
            "name": "ServiceSource100554"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "forceServiceInstance"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLibModel.js",
        "dependencies": [
          {
            "name": "createAllModels"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabImport.js",
        "dependencies": [
          {
            "name": "collabImport"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Design system base utilities",
      "businessCapabilities": [
        "Managing design system tokens",
        "Handling project assets"
      ],
      "technicalCapabilities": [
        "Compiling LESS",
        "Serializing tokens"
      ],
      "implementedFeatures": [
        "getImages",
        "getVideos",
        "addAssets",
        "getTokens",
        "updateTokensTheme",
        "addNewTokensTheme",
        "removeTokensTheme",
        "getTokensLess",
        "getTokensCss",
        "getGlobalCss",
        "getGlobalLess",
        "compileLess",
        "preCompileLess",
        "preCompileLessByThemeOrDefault"
      ]
    }
  }
}
    