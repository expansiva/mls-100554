/// <mls fileReference="_100554_/l2/collabResultTest.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabResultTest.ts",
    "componentType": "molecule",
    "componentScope": "appFrontEnd",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "lit",
        "dependencies": [
          {
            "name": "html"
          }
        ]
      },
      {
        "ref": "lit/decorators.js",
        "dependencies": [
          {
            "name": "customElement"
          },
          {
            "name": "property"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/stateLitElement.js",
        "dependencies": [
          {
            "name": "StateLitElement"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabIcons.js",
        "dependencies": [
          {
            "name": "collab_spinner_clock"
          },
          {
            "name": "collab_check"
          },
          {
            "name": "collab_xmark"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Lit-based web component for displaying test results",
      "businessCapabilities": [
        "Display test name",
        "Show test status",
        "Display result status",
        "Show execution time",
        "Render test output"
      ],
      "technicalCapabilities": [
        "Extends StateLitElement",
        "Uses Lit decorators",
        "Renders HTML templates"
      ],
      "implementedFeatures": [
        "Renders running state with spinner",
        "Renders finished state with details, time, and result"
      ]
    }
  }
}
    