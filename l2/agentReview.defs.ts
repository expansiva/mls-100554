/// <mls fileReference="_100554_/l2/agentReview.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/agentReview.ts",
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
        "ref": "/_100554_/l2/aiAgentHelper.js",
        "dependencies": [
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
            "name": "getNextPendentStep"
          },
          {
            "name": "updateTaskTitle"
          },
          {
            "name": "appendLongTermMemory"
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
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "forceServiceInstance"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabState.js",
        "dependencies": [
          {
            "name": "getState"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/serviceSource.js",
        "dependencies": [
          {
            "name": "ServiceSource100554"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLibModel.js",
        "dependencies": [
          {
            "name": "createAllModels"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Responsavel por fazer review do código",
      "businessCapabilities": [
        "fazer review do código"
      ],
      "technicalCapabilities": [
        "async beforePrompt",
        "async afterPrompt",
        "getPrompts",
        "getContentByExtension",
        "updateFile"
      ],
      "implementedFeatures": [
        "createAgent",
        "_beforePrompt",
        "_afterPrompt",
        "getPrompts",
        "getContentByExtension",
        "getModels",
        "updateFile",
        "getModel"
      ]
    }
  }
}
    