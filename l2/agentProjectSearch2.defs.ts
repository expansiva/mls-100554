/// <mls fileReference="_100554_/l2/agentProjectSearch2.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/agentProjectSearch2.ts",
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
        "ref": "/_100554_/l2/agentProjectSearch.js",
        "dependencies": [
          {
            "name": "PayLoad1"
          },
          {
            "name": "getPayload1"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiAgentHelper.js",
        "dependencies": [
          {
            "name": "notifyTaskChange"
          },
          {
            "name": "updateStepStatus"
          },
          {
            "name": "getNextPendingStepByAgentName"
          },
          {
            "name": "getNextInProgressStepByAgentName"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiAgentOrchestration.js",
        "dependencies": [
          {
            "name": "startNewAiTask"
          },
          {
            "name": "executeNextStep"
          },
          {
            "name": "startNewInteractionInAiTask"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Agent for create a new Module - step 2",
      "businessCapabilities": [
        "create a new Module"
      ],
      "technicalCapabilities": [
        "search project files",
        "generate context for LLM",
        "handle AI agent tasks"
      ],
      "implementedFeatures": [
        "beforePrompt",
        "afterPrompt",
        "getContextToLLM",
        "getPrompts",
        "scanDefsFiles",
        "scanSourceFiles"
      ]
    }
  }
}
    