/// <mls fileReference="_100554_/l2/agentPlanner1.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/agentPlanner1.ts",
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
            "name": "calculateStepsStatistics",
            "type": "function"
          },
          {
            "name": "updateStepStatus",
            "type": "function"
          },
          {
            "name": "getStepById",
            "type": "function"
          },
          {
            "name": "updateTaskTitle",
            "type": "function"
          },
          {
            "name": "notifyTaskChange",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiPrompts.js",
        "dependencies": [
          {
            "name": "systemAgentsAvailable",
            "type": "function"
          },
          {
            "name": "systemRagsAvailable",
            "type": "function"
          },
          {
            "name": "systemToolsAvailable",
            "type": "function"
          },
          {
            "name": "addRAGAdditionalInformation",
            "type": "function"
          },
          {
            "name": "getPromptByHtml",
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
      "generalDescription": "first agent for general prompts",
      "businessCapabilities": [
        "Planning"
      ],
      "technicalCapabilities": [
        "beforePrompt",
        "afterPrompt",
        "beforeClarification"
      ],
      "implementedFeatures": [
        "createAgent",
        "getPrompts",
        "prepareHtmlClarification"
      ]
    }
  }
}
    