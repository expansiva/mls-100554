/// <mls fileReference="_100554_/l2/driverGithub.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/driverGithub.ts",
    "componentType": "repository",
    "componentScope": "appBackEnd",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_100554_/l2/driverLib.js",
        "dependencies": []
      }
    ],
    "statesRO": [],
    "statesRW": [],
    "statesWO": []
  },
  "asIs": {
    "semantic": {
      "generalDescription": "GitHub Driver Class",
      "businessCapabilities": [],
      "technicalCapabilities": [
        "Extends mls.stor.others.DriverIOBase",
        "Uses GitHub API",
        "Handles file operations"
      ],
      "implementedFeatures": [
        "getContents",
        "setContents",
        "loadFilesInfo",
        "getHistory",
        "getHistoryContent",
        "getUrl",
        "getVersionFromFiles",
        "checkBranchExistence",
        "createNewBranch",
        "createPullRequest",
        "reviewPullRequest",
        "listPullRequests",
        "listForks",
        "listBranches",
        "getUserInfo",
        "getOrganizations",
        "createRepository",
        "deleteRepository",
        "createFork",
        "renameRepository",
        "createFileInRepo",
        "changeVisibility",
        "verifyRepositoryNew",
        "verifyPermission",
        "setPermissionAction",
        "addVariable2",
        "addVariable",
        "updateVariable",
        "listVariables",
        "delVariable",
        "checkFork",
        "syncFork"
      ],
      "constraints": [
        "Requires GitHub token",
        "Async operations"
      ]
    }
  }
}
    