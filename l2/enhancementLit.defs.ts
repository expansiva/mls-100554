/// <mls fileReference="_100554_/l2/enhancementLit.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/enhancementLit.ts",
    "componentType": "editorService",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_102027_/l2/utils.js",
        "dependencies": [
          {
            "name": "convertFileNameToTag"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/propiertiesLit.js",
        "dependencies": [
          {
            "name": "getPropierties"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/validateLit.js",
        "dependencies": [
          {
            "name": "validateTagName"
          },
          {
            "name": "validateRender"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/codeLensLit.js",
        "dependencies": [
          {
            "name": "setCodeLens"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/processCssLit.js",
        "dependencies": [
          {
            "name": "injectStyle"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "",
      "businessCapabilities": [],
      "technicalCapabilities": [
        "TypeScript"
      ],
      "implementedFeatures": [
        "requires",
        "getDefaultHtmlExamplePreview",
        "getDesignDetails",
        "onAfterChange",
        "onAfterCompile"
      ],
      "constraints": []
    }
  }
}
    