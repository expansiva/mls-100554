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
            "name": "ServiceSource100554",
            "type": "class"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "forceServiceInstance",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLibModel.js",
        "dependencies": [
          {
            "name": "createAllModels",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabImport.js",
        "dependencies": [
          {
            "name": "collabImport",
            "type": "function"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Design system base utilities",
      "businessCapabilities": [
        "Manage design tokens",
        "Handle asset uploads",
        "Compile LESS to CSS"
      ],
      "technicalCapabilities": [
        "Export functions for token manipulation",
        "Provide asset filtering",
        "Support LESS compilation"
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
    