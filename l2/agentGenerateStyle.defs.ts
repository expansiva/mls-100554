/// <mls fileReference="_100554_/l2/agentGenerateStyle.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/agentGenerateStyle.ts",
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
            "name": "createAllModels",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/libCompileStyle.js",
        "dependencies": [
          {
            "name": "removeTokensFromSource",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/designSystemBase.js",
        "dependencies": [
          {
            "name": "getTokensLess",
            "type": "function"
          },
          {
            "name": "getGlobalLess",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/ _100554_/l2/aiAgentHelper.js",
        "dependencies": [
          {
            "name": "getNextPendingStepByAgentName",
            "type": "function"
          },
          {
            "name": "getNextInProgressStepByAgentName",
            "type": "function"
          },
          {
            "name": "getNextFlexiblePendingStep",
            "type": "function"
          },
          {
            "name": "appendLongTermMemory",
            "type": "function"
          },
          {
            "name": "notifyTaskChange",
            "type": "function"
          },
          {
            "name": "updateStepStatus",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/ _100554_/l2/aiAgentOrchestration.js",
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
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Agent for optimize style",
      "businessCapabilities": [
        "Planning Style"
      ],
      "technicalCapabilities": [
        "TypeScript"
      ],
      "implementedFeatures": [
        "createAgent",
        "beforePrompt",
        "afterPrompt",
        "getPrompts",
        "getContentByExtension",
        "getModel",
        "updateFile",
        "updateGlobalCss",
        "prepareComponentCss",
        "prepareGlobalCss"
      ]
    }
  }
}
    