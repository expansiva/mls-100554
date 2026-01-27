/// <mls fileReference="_100554_/l2/agentImprovePrototypeOrganism.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/agentImprovePrototypeOrganism.ts",
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
            "name": "createAllModels",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libUnsplash.js",
        "dependencies": [
          {
            "name": "getImages",
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
        "ref": "/_102027_/l2/libCompileStyle.js",
        "dependencies": [
          {
            "name": "removeTokensFromSource",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "forceServiceInstance",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabState.js",
        "dependencies": [
          {
            "name": "getState",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/serviceSource.js",
        "dependencies": [
          {
            "name": "ServiceSource100554",
            "type": "class"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiAgentHelper.js",
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
            "name": "updateTaskTitle",
            "type": "function"
          },
          {
            "name": "updateStepStatus",
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
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Agent for prototype improve on organism",
      "businessCapabilities": [
        "improve prototype on organism"
      ],
      "technicalCapabilities": [
        "compiles TypeScript",
        "compiles Less",
        "updates HTML",
        "updates TypeScript",
        "updates Less"
      ],
      "implementedFeatures": [
        "createAgent",
        "_beforePrompt",
        "_afterPrompt",
        "updateFile",
        "fireAgentFix",
        "getPrompts",
        "getContentByExtension",
        "getModel",
        "getAllImages",
        "escapeRegex",
        "replaceByPriority",
        "prepareComponentCss"
      ]
    }
  }
}
    