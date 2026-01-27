/// <mls fileReference="_100554_/l2/pluginOrganismAdd.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/pluginOrganismAdd.ts",
    "componentType": "pluginUI",
    "componentScope": "appFrontEnd",
    "languages": [
      "en",
      "pt"
    ],
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
            "name": "state"
          },
          {
            "name": "query"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiAgentHelper.js",
        "dependencies": [
          {
            "name": "executeAgentByFile"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLitElement.js",
        "dependencies": [
          {
            "name": "CollabLitElement"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/serviceBase.js",
        "dependencies": [
          {
            "name": "ServiceBase"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin component for adding new elements to an organism using AI",
      "businessCapabilities": [
        "Describe the new element to add inside the organism",
        "Type what to create inside the organism"
      ],
      "technicalCapabilities": [
        "Uses Lit for rendering",
        "Custom element with decorators",
        "Integrates with AI agent helper"
      ],
      "implementedFeatures": [
        "Renders form with project, module, organism inputs",
        "Prompt textarea with placeholders",
        "Button to implement with AI",
        "Calls executeAgentByFile for improvement"
      ]
    }
  }
}
    