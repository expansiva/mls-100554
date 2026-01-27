/// <mls fileReference="_100554_/l2/agentProjectSearch.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/agentProjectSearch.ts",
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
            "name": "getAgentStepByAgentName"
          },
          {
            "name": "notifyTaskChange"
          },
          {
            "name": "updateStepStatus"
          },
          {
            "name": "getNextStepIdAvaliable"
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
            "name": "addNewStep"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Agent for create a new Module",
      "businessCapabilities": [
        "Planning...",
        "Search"
      ],
      "technicalCapabilities": [],
      "implementedFeatures": [
        "createAgent",
        "getPayload1"
      ]
    }
  }
}
    