/// <mls fileReference="_100554_/l2/widgetClarificationNewWidget.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/widgetClarificationNewWidget.ts",
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
            "name": "html",
            "type": "function"
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
          },
          {
            "name": "query",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/stateLitElement.js",
        "dependencies": [
          {
            "name": "StateLitElement",
            "type": "class"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiAgentOrchestration.js",
        "dependencies": [
          {
            "name": "postBackClarification",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/102027/l2/utils",
        "dependencies": [
          {
            "name": "convertFileNameToTag",
            "type": "function"
          },
          {
            "name": "convertTagToFileName",
            "type": "function"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Widget for clarifying new widget details",
      "businessCapabilities": [],
      "technicalCapabilities": [
        "Lit-based rendering",
        "Property binding",
        "Event handling"
      ],
      "implementedFeatures": [
        "renderResume",
        "renderParentClass",
        "renderWidgetName",
        "renderProperties",
        "renderRequirements",
        "handleWidgetNameInput",
        "handleTagNameChange",
        "handleParentInput",
        "handleRqVisualInput",
        "handleRqFunctionalInput",
        "handleCancel",
        "handleOk",
        "handleAction",
        "setDevelpoment"
      ],
      "constraints": [
        "Component name must start with \"widget\"",
        "A widget with this name already exists"
      ]
    }
  }
}
    