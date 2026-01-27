/// <mls fileReference="_100554_/l2/driverGitlab.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/driverGitlab.ts",
    "componentType": "tool",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_100554_/l2/driverLib.js"
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "GitLab driver class",
      "businessCapabilities": [
        "Integrate with GitLab API"
      ],
      "technicalCapabilities": [
        "TypeScript class",
        "Extends DriverIOBase",
        "Uses fetch and GraphQL"
      ],
      "implementedFeatures": [
        "init",
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
        "addVariable",
        "updateVariable",
        "listVariables",
        "delVariable",
        "checkFork",
        "syncFork"
      ]
    }
  }
}
    