/// <mls fileReference="_100554_/l2/libCommom.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/libCommom.ts",
    "componentType": "tool",
    "componentScope": "editor",
    "languages": [
      "en",
      "pt"
    ]
  },
  "references": {
    "imports": [
      {
        "ref": "/_100554_/l2/collabLitElement.js",
        "dependencies": [
          {
            "name": "getMessageKey",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libCompile.js",
        "dependencies": [
          {
            "name": "getAllWebComponentsInSource",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/utils",
        "dependencies": [
          {
            "name": "convertTagToFileName",
            "type": "function"
          },
          {
            "name": "convertFileNameToTag",
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
        "ref": "/_100554_/l2/serviceDetail.js",
        "dependencies": [
          {
            "name": "ServiceDetail100554",
            "type": "class"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Common utility library",
      "businessCapabilities": [],
      "technicalCapabilities": [
        "i18n messaging",
        "project branch retrieval",
        "path creation",
        "timestamp generation",
        "date formatting",
        "favicon changing",
        "project validation",
        "HTML escaping",
        "service opening",
        "level selection",
        "file loading",
        "color conversion",
        "enhancement name retrieval",
        "plugin loading",
        "project details management",
        "string size calculation",
        "file deletion",
        "module loading",
        "file finding",
        "opened files storage",
        "module storage",
        "base template generation",
        "triple slash verification",
        "instance retrieval",
        "name validation",
        "service details opening",
        "project config retrieval"
      ],
      "implementedFeatures": [
        "getMyKeysBranch",
        "createPath",
        "generateCompactTimestamp",
        "getDateFormated",
        "changeFavIcon",
        "checkIfHasLocalProject",
        "getLocalProjectName",
        "setLocalProjectName",
        "isValidProjectName",
        "escapeHTML",
        "openService",
        "selectLevel",
        "forceServiceInstance",
        "loadFileHTMLInContainer",
        "convertColorToHex",
        "getEnhancementName",
        "loadPluginProject",
        "setProjectDetails",
        "getProjectDetails",
        "calculateTotalStringSize",
        "getListNewFilesToDeleteByFolder",
        "deleteAllFilesLocal",
        "loadModuleFromProjectOrDependency",
        "findStorFileInProjectsOrDeps",
        "saveOpenedFile",
        "getLastOpenedFiles",
        "deleteLastOpenedFiles",
        "getLastModule",
        "setLastModule",
        "getBaseTemplate",
        "verifyNeedAddTripleslach",
        "getInstanceByFile",
        "isNameValid",
        "openElementInServiceDetails",
        "clearServiceDetails",
        "getProjectConfig",
        "getProjectModuleConfig"
      ]
    }
  }
}
    