/// <mls fileReference="_100554_/l2/agentBotInstall.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/agentBotInstall.ts",
    "componentType": "agent",
    "componentScope": "editor"
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
            "name": "getNextInProgressStepByAgentName",
            "type": "function"
          },
          {
            "name": "updateStepStatus",
            "type": "function"
          },
          {
            "name": "notifyMessageSendChange",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiAgentOrchestration.js",
        "dependencies": [
          {
            "name": "executeNextStep",
            "type": "function"
          },
          {
            "name": "loadAgent",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_102025_/l2/collabMessagesHelper.js",
        "dependencies": [
          {
            "name": "addMessage",
            "type": "function"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Install Bot in a thread",
      "businessCapabilities": [
        "Install Bot in a thread",
        "Disable Bot in a thread"
      ],
      "technicalCapabilities": [
        "Agent creation",
        "Prompt lifecycle handling",
        "Argument validation",
        "Bot installation and disabling",
        "Thread message management"
      ],
      "implementedFeatures": [
        "createAgent",
        "beforePrompt",
        "afterPrompt",
        "disableBot"
      ],
      "constraints": [
        "context and message must be valid",
        "task must be undefined in beforePrompt",
        "projectId and shortName are required arguments"
      ]
    }
  }
}
    