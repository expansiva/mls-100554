/// <mls fileReference="_100554_/l2/agentJudge.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/agentJudge.ts",
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
        "ref": "/_100554_/l2/collabLibModel.js",
        "dependencies": [
          {
            "name": "createModel",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiAgentOrchestration.js",
        "dependencies": [
          {
            "name": "startNewInteractionInAiTask",
            "type": "function"
          },
          {
            "name": "startNewAiTask",
            "type": "function"
          },
          {
            "name": "executeNextStep",
            "type": "function"
          },
          {
            "name": "addNewStep",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiAgentHelper.js",
        "dependencies": [
          {
            "name": "getNextFlexiblePendingStep",
            "type": "function"
          },
          {
            "name": "getNextPendingStepByAgentName",
            "type": "function"
          },
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
            "name": "getNextPendentStep",
            "type": "function"
          },
          {
            "name": "appendLongTermMemory",
            "type": "function"
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
      "technicalCapabilities": [
        "AI task orchestration",
        "Prompt handling"
      ],
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
    