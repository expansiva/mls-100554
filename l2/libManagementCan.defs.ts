/// <mls fileReference="_100554_/l2/libManagementCan.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/libManagementCan.ts",
    "componentType": "tool",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_100554_/l2/collabState.js",
        "dependencies": [
          {
            "name": "CollabState",
            "type": "type"
          },
          {
            "name": "GlobalState",
            "type": "type"
          },
          {
            "name": "globalState",
            "type": "constant"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Library for managing collaborative state",
      "businessCapabilities": [
        "Initialize state paths",
        "Set state values",
        "Wait for state changes",
        "Watch state for changes"
      ],
      "technicalCapabilities": [
        "Provides async waiting functions",
        "Manages active watchers",
        "Normalizes values for comparison"
      ],
      "implementedFeatures": [
        "initState",
        "setState",
        "waitingState",
        "waitForNonEmptyState",
        "watchState",
        "unwatchState",
        "clearWatchers",
        "verifyState"
      ]
    }
  }
}
    