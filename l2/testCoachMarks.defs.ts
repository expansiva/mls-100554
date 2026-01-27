/// <mls fileReference="_100554_/l2/testCoachMarks.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/testCoachMarks.ts",
    "componentType": "page",
    "componentScope": "appFrontEnd",
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "test-coach-marks-100554"
    ],
    "imports": [
      {
        "ref": "/_100554_/l2/collabPageElement.js",
        "dependencies": [
          {
            "name": "CollabPageElement",
            "type": "class"
          }
        ]
      },
      {
        "ref": "lit/decorators.js",
        "dependencies": [
          {
            "name": "customElement",
            "type": "function"
          }
        ]
      },
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
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Test component for coach marks",
      "businessCapabilities": [
        "Display coach marks for promotional code and checkout guidance"
      ],
      "technicalCapabilities": [
        "Uses Lit custom element",
        "Integrates coach marks"
      ],
      "implementedFeatures": [
        "Initializes coach marks on button click"
      ]
    }
  }
}
    