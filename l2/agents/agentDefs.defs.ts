/// <mls fileReference="_100554_/l2/agents/agentDefs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/agents/agentDefs.ts",
    "componentType": "agent",
    "componentScope": "editor"
  },
  "references": {
    "imports": [
      {
        "ref": "/_100554_/l2/aiAgentBase.js",
        "dependencies": [
          {
            "name": "IAgentAsync",
            "type": "interface"
          },
          {
            "name": "IAgentMeta",
            "type": "interface"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLibModel.js",
        "dependencies": [
          {
            "name": "createModel",
            "type": "function"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Create or Update Defs",
      "businessCapabilities": [
        "Generate defs for files",
        "Update defs for multiple files"
      ],
      "technicalCapabilities": [
        "Uses AI for prompt generation",
        "Manages file updates"
      ],
      "implementedFeatures": [
        "beforePromptAtomic",
        "beforePromptImplicit",
        "beforePromptStep",
        "afterPromptStep"
      ]
    }
  }
}
    