/// <mls fileReference="_100554_/l2/libCompile.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/libCompile.ts",
    "componentType": "tool",
    "componentScope": "editor",
    "group": "enhancement",
    "devFidelity": "final"
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
  "asIs": {
    "semantic": {
      "generalDescription": "Library for compiling web component dependencies",
      "businessCapabilities": [],
      "technicalCapabilities": [
        "Extract custom tags from HTML",
        "Load JavaScript imports for components",
        "Retrieve CSS tokens and global CSS"
      ],
      "implementedFeatures": [
        "getDependenciesByHtmlFile",
        "getDependenciesByHtml",
        "getDependenciesByMFile",
        "getTokens",
        "getAllWebComponentsInSource"
      ]
    }
  }
}
    