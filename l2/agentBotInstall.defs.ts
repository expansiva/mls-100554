/// <mls fileReference="_100554_/l2/agentBotInstall.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/agentBotInstall.ts",
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
    ],
    "statesRO": [],
    "statesRW": [],
    "statesWO": []
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Install Bot in a thread",
      "businessCapabilities": [
        "Install a bot in a thread",
        "Disable a bot in a thread",
        "Validate input arguments for bot installation/disabling",
        "Handle agent lifecycle hooks (beforePrompt, afterPrompt)"
      ],
      "technicalCapabilities": [
        "Parses and validates command-line arguments",
        "Loads other agents",
        "Updates step status in a task",
        "Notifies message send changes",
        "Adds messages to a thread",
        "Interacts with mls.api.msgAddOrUpdateThreadBot"
      ],
      "implementedFeatures": [
        "Agent creation (createAgent)",
        "Pre-prompt logic (_beforePrompt) for bot installation/disabling",
        "Post-prompt logic (_afterPrompt) for completing agent steps",
        "Bot disabling functionality (disableBot)"
      ],
      "constraints": [
        "Requires context and context.message to be valid",
        "Throws an error if _beforePrompt is called in a task context",
        "Requires projectId (number) and shortName (string) arguments",
        "Requires the loaded agent to have an installBot method if not disabling",
        "Requires context.task and a pending interaction step for _afterPrompt"
      ]
    }
  }
}
    