/// <mls fileReference="_100554_/l2/agentImprovePrototype.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/agentImprovePrototype.ts",
    "componentType": "agent",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_102027_/l2/utils.js",
        "dependencies": [
          {
            "name": "convertTagToFileName",
            "type": "function"
          }
        ]
      },
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
            "name": "getNextPendingStepByAgentName",
            "type": "function"
          },
          {
            "name": "getNextInProgressStepByAgentName",
            "type": "function"
          },
          {
            "name": "getAgentStepByAgentName",
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
          },
          {
            "name": "getNextPendentStep",
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
          },
          {
            "name": "ClarificationValue",
            "type": "type"
          },
          {
            "name": "startClarification",
            "type": "function"
          }
        ]
      }
    ]
  },
  "codeInsights": {
    "unusedImports": [
      "executeNextStep",
      "ClarificationValue",
      "startClarification"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Agent for prototype improve",
      "businessCapabilities": [],
      "technicalCapabilities": [],
      "implementedFeatures": []
    }
  }
}
    