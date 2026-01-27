/// <mls fileReference="_100554_/l2/collabLibStor.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabLibStor.ts",
    "componentType": "tool",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_102027_/l2/utils",
        "dependencies": [
          {
            "name": "convertFileNameToTag",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLibModel.js",
        "dependencies": [
          {
            "name": "createModel",
            "type": "function"
          },
          {
            "name": "createAllModels",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "getBaseTemplate",
            "type": "function"
          },
          {
            "name": "verifyNeedAddTripleslach",
            "type": "function"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Library for storage file operations",
      "businessCapabilities": [
        "Create storage files",
        "Delete files",
        "Rename files",
        "Clone files",
        "Undo file changes"
      ],
      "technicalCapabilities": [
        "File storage management",
        "Model creation and disposal",
        "Content replacement"
      ],
      "implementedFeatures": [
        "createStorFile",
        "createAllFiles",
        "deleteFile",
        "deleteAllFiles",
        "renameFile",
        "renameAllFiles",
        "cloneFile",
        "cloneAllFiles",
        "undoFile",
        "undoAllFiles",
        "isNewNameValid",
        "replaceTripleslashAndTag"
      ]
    }
  }
}
    