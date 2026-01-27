/// <mls fileReference="_100554_/l2/collabManagerCoachMarks.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabManagerCoachMarks.ts",
    "componentType": "tool",
    "componentScope": "editor",
    "languages": [
      "en",
      "pt"
    ],
    "group": "enhancement",
    "devFidelity": "final"
  },
  "references": {
    "imports": [
      {
        "ref": "/_100554_/l2/coachMarks.js",
        "dependencies": [
          {
            "name": "addCoachMark",
            "type": "function"
          },
          {
            "name": "ICoachMarks",
            "type": "interface"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLitElement.js",
        "dependencies": [
          {
            "name": "getMessageKey",
            "type": "function"
          }
        ]
      }
    ]
  },
  "codeInsights": {
    "deadCodeBlocks": [
      "onServicechange function parses data but does not use it"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Manages coach marks for collaboration manager",
      "businessCapabilities": [
        "Provides guided tours for UI elements"
      ],
      "technicalCapabilities": [
        "Handles event listeners for level and service changes",
        "Sets up coach marks with translations"
      ],
      "implementedFeatures": [
        "Level 5 coach marks",
        "Event-driven coach mark initialization"
      ]
    }
  }
}
    