/// <mls fileReference="_100554_/l2/collabLibModel.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabLibModel.ts",
    "componentType": "tool",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "getEnhancementName",
            "type": "function"
          },
          {
            "name": "getBaseTemplate",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/utils.js",
        "dependencies": [
          {
            "name": "setErrorOnModel",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/designSystemBase.js",
        "dependencies": [
          {
            "name": "getTokensLess",
            "type": "function"
          },
          {
            "name": "removeTokensFromSource",
            "type": "function"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Library for creating and compiling models in the Collab.codes editor",
      "businessCapabilities": [
        "Load project TypeScript files",
        "Compile TypeScript and LESS",
        "Create editor models"
      ],
      "technicalCapabilities": [
        "Async model creation",
        "TypeScript compilation",
        "LESS compilation"
      ],
      "implementedFeatures": [
        "readProjectTypescriptAndCompile",
        "readProjectTypescriptAndCompileL1",
        "createAllModels",
        "createModel"
      ]
    }
  }
}
    