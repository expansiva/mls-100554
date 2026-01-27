/// <mls fileReference="_100554_/l2/agentTeste.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/agentTeste.ts",
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
            "name": "IAgent"
          },
          {
            "name": "svg_agent"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiPrompts.js",
        "dependencies": [
          {
            "name": "getPromptByHtml"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLibModel.js",
        "dependencies": [
          {
            "name": "createModel"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiAgentOrchestration.js",
        "dependencies": [
          {
            "name": "startNewInteractionInAiTask"
          },
          {
            "name": "startNewAiTask"
          },
          {
            "name": "executeNextStep"
          },
          {
            "name": "addNewStep"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiAgentHelper.js",
        "dependencies": [
          {
            "name": "getNextFlexiblePendingStep"
          },
          {
            "name": "getNextPendingStepByAgentName"
          },
          {
            "name": "getNextInProgressStepByAgentName"
          },
          {
            "name": "updateStepStatus"
          },
          {
            "name": "updateTaskTitle"
          },
          {
            "name": "getNextPendentStep"
          },
          {
            "name": "appendLongTermMemory"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Agente de teste",
      "businessCapabilities": [
        "Planning",
        "Updating links"
      ],
      "technicalCapabilities": [],
      "implementedFeatures": [
        "createAgent",
        "beforePrompt",
        "afterPrompt",
        "replayForSupport",
        "getPrompts"
      ]
    }
  }
}
    