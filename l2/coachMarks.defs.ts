/// <mls fileReference="_100554_/l2/coachMarks.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/coachMarks.ts",
    "componentType": "molecule",
    "componentScope": "appFrontEnd",
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "coach-marks-100554"
    ],
    "imports": [
      {
        "ref": "lit",
        "dependencies": [
          {
            "name": "html",
            "type": "function"
          },
          {
            "name": "css",
            "type": "function"
          },
          {
            "name": "LitElement",
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
          },
          {
            "name": "property",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLitElement.js",
        "dependencies": [
          {
            "name": "CollabLitElement",
            "type": "class"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Coach marks web component",
      "businessCapabilities": [
        "Displays coach marks with steps",
        "Positions marks relative to elements or screen",
        "Supports animations and arrows",
        "Handles localStorage for dismissal"
      ],
      "technicalCapabilities": [
        "Uses LitElement for web components",
        "Creates dynamic elements",
        "Manages timeouts and intervals"
      ],
      "implementedFeatures": [
        "addCoachMark function",
        "CoachMarks100554 class",
        "setInfo method",
        "setCoachMarks method",
        "clearMe method",
        "close method",
        "setKey method",
        "inLocalStorage method",
        "setGlobalDefinitions method",
        "createSteps method",
        "addAnimation method",
        "addTextWithArrow method",
        "positionStep method"
      ]
    }
  }
}
    