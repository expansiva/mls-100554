/// <mls fileReference="_100554_/l2/projectAST.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/projectAST.ts",
    "componentType": "tool",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_100554_/l2/collabLibModel.js",
        "dependencies": [
          {
            "name": "createModel",
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
      },
      {
        "ref": "/_100554_/l2/pluginNewFileBase.js",
        "dependencies": [
          {
            "name": "createNewFile",
            "type": "function"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Functions for managing project modules and configuration",
      "businessCapabilities": [
        "Add module to project",
        "Configure master front-end",
        "Remove module from project"
      ],
      "technicalCapabilities": [
        "Compile and post-process TypeScript models"
      ],
      "implementedFeatures": [
        "addModule",
        "configureMasterFrontEnd",
        "removeModule",
        "getModel"
      ]
    }
  }
}
    