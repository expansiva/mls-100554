/// <mls fileReference="_100554_/l2/libCompile.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/libCompile.ts",
    "componentType": "tool",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_100554_/l2/designSystemBase.js",
        "dependencies": [
          {
            "name": "getTokensCss",
            "type": "function"
          },
          {
            "name": "getGlobalCss",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/utils",
        "dependencies": [
          {
            "name": "convertFileNameToTag",
            "type": "function"
          },
          {
            "name": "convertTagToFileName",
            "type": "function"
          }
        ]
      }
    ]
  },
  "codeInsights": {
    "deadCodeBlocks": [
      "function extrairTagsCustomizadas(html: string): string[] { ... }"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Library for compiling dependencies and extracting web components",
      "businessCapabilities": [
        "getDependenciesByHtmlFile",
        "getDependenciesByHtml",
        "getDependenciesByMFile"
      ],
      "technicalCapabilities": [
        "extract custom tags from HTML",
        "load enhancements",
        "fetch tokens and CSS"
      ],
      "implementedFeatures": [
        "getDependenciesByHtmlFile",
        "getDependenciesByHtml",
        "getDependenciesByMFile",
        "getTagsInTypescript",
        "getDependencies",
        "getDependenciesFile",
        "extrairTagsCustomizadas",
        "loadMyNeedsToCompile",
        "getEnhancementFromFetch",
        "getImportUrl",
        "getJSImportEnhancement",
        "getJSImporMap",
        "getJSBlank",
        "getJS",
        "getTokens",
        "getAllWebComponentsInSource"
      ]
    }
  }
}
    