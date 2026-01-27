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
    ],
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_100554_/l2/collabLitElement.js",
        "dependencies": [
          {
            "name": "getMessageKey"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libCompile.js",
        "dependencies": [
          {
            "name": "getAllWebComponentsInSource"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/utils",
        "dependencies": [
          {
            "name": "convertTagToFileName"
          },
          {
            "name": "convertFileNameToTag"
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
      },
      {
        "ref": "/_100554_/l2/serviceDetail.js",
        "dependencies": [
          {
            "name": "ServiceDetail100554"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Common utility library",
      "businessCapabilities": [
        "Retrieve project branch information",
        "Create file paths",
        "Generate timestamps",
        "Format dates with i18n",
        "Change favicon",
        "Check local project existence",
        "Manage local project name",
        "Validate project names",
        "Escape HTML",
        "Open services in UI",
        "Select levels",
        "Force service instances",
        "Load HTML files",
        "Convert colors to hex",
        "Get enhancement names",
        "Load plugins",
        "Manage project details",
        "Calculate string sizes",
        "Delete files",
        "Load modules from dependencies",
        "Find files in projects",
        "Save opened files",
        "Get last modules",
        "Get base templates",
        "Verify triple slash",
        "Get instances",
        "Validate names",
        "Open elements in service details",
        "Clear service details",
        "Get project configs"
      ],
      "technicalCapabilities": [
        "TypeScript functions",
        "DOM manipulation",
        "Local storage operations",
        "Cache management",
        "Module loading"
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
    