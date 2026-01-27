/// <mls fileReference="_100554_/l2/agentPrototypeOptimizer.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/agentPrototypeOptimizer.ts",
    "componentType": "agent",
    "componentScope": "editor",
    "languages": [
      "pt"
    ],
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "home-100554",
      "organism-nav",
      "organism-banner-welcome",
      "organism-services-highlight",
      "organism-featured-products",
      "organism-about-petshop",
      "organism-social-links",
      "organism-footer-info"
    ],
    "imports": [
      {
        "ref": "/_100554_/l2/aiAgentBase",
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
        "ref": "/_100554_/l2/aiPrompts",
        "dependencies": [
          {
            "name": "getPromptByHtml",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiAgentHelper",
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
            "name": "notifyTaskChange",
            "type": "function"
          },
          {
            "name": "updateTaskTitle",
            "type": "function"
          },
          {
            "name": "updateStepStatus",
            "type": "function"
          },
          {
            "name": "appendLongTermMemory",
            "type": "function"
          },
          {
            "name": "getNextPendentStep",
            "type": "function"
          },
          {
            "name": "getInteractionStepId",
            "type": "function"
          },
          {
            "name": "getStepById",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiAgentOrchestration",
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
      "generalDescription": "Agent for create a new Module - 4",
      "businessCapabilities": [
        "create a new Module"
      ],
      "technicalCapabilities": [
        "optimize prototype"
      ],
      "implementedFeatures": [
        "beforePrompt",
        "afterPrompt",
        "replayForSupport",
        "createPage"
      ]
    }
  }
}
    