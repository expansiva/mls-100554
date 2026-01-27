/// <mls fileReference="_100554_/l2/agentDesignRef2Image2.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/agentDesignRef2Image2.ts",
    "componentType": "agent",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_100554_/l2/aiAgentBase.js",
        "dependencies": [
          {
            "name": "IAgent",
            "type": "interface"
          },
          {
            "name": "svg_agent",
            "type": "constant"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiPrompts.js",
        "dependencies": [
          {
            "name": "getPromptByHtml",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiAgentHelper.js",
        "dependencies": [
          {
            "name": "getNextInProgressStepByAgentName",
            "type": "function"
          },
          {
            "name": "updateStepStatus",
            "type": "function"
          },
          {
            "name": "updateTaskTitle",
            "type": "function"
          },
          {
            "name": "getNextPendingStepByAgentName",
            "type": "function"
          },
          {
            "name": "getAgentStepByAgentName",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/agentDesignRef2Image.js",
        "dependencies": [
          {
            "name": "getPayload1",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiAgentOrchestration.js",
        "dependencies": [
          {
            "name": "startNewAiTask",
            "type": "function"
          },
          {
            "name": "executeNextStep",
            "type": "function"
          },
          {
            "name": "startNewInteractionInAiTask",
            "type": "function"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "DesignRef 2 Image",
      "businessCapabilities": [
        "Creating hero images"
      ],
      "technicalCapabilities": [
        "Executes AI prompts",
        "Orchestrates AI tasks"
      ],
      "implementedFeatures": [
        "beforePrompt",
        "afterPrompt",
        "getPrompts",
        "getPayload2"
      ]
    }
  }
}
    