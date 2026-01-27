/// <mls fileReference="_100554_/l2/pluginTaskPreview.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/pluginTaskPreview.ts",
    "componentType": "molecule",
    "componentScope": "appFrontEnd"
  },
  "references": {
    "webComponents": [
      "plugin-task-preview-agent-100554",
      "plugin-task-preview-clarification-100554",
      "plugin-task-preview-flexible-100554",
      "plugin-task-preview-tools-100554",
      "plugin-task-preview-result-100554"
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
            "name": "repeat",
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
            "name": "state",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiAgentHelper.js",
        "dependencies": [
          {
            "name": "getAllSteps",
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
      },
      {
        "ref": "/_100554_/l2/pluginTaskPreviewAgent.js"
      },
      {
        "ref": "/_100554_/l2/pluginTaskPreviewClarification.js"
      },
      {
        "ref": "/_100554_/l2/pluginTaskPreviewFlexible.js"
      },
      {
        "ref": "/_100554_/l2/pluginTaskPreviewTools.js"
      },
      {
        "ref": "/_100554_/l2/pluginTaskPreviewResult.js"
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin component for previewing task steps with navigation",
      "businessCapabilities": [
        "Render task steps",
        "Provide navigation between steps",
        "Display breadcrumbs"
      ],
      "technicalCapabilities": [
        "Lit web component",
        "Custom element",
        "State management with Lit decorators"
      ],
      "implementedFeatures": [
        "renderStep",
        "renderNavigation",
        "renderBreadcrumb",
        "init",
        "buildStepMap",
        "navigateToStep",
        "goBack"
      ]
    }
  }
}
    