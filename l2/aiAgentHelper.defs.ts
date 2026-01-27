/// <mls fileReference="_100554_/l2/aiAgentHelper.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/aiAgentHelper.ts",
    "componentType": "tool",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_102025_/l2/collabMessagesIndexedDB.js",
        "dependencies": [
          {
            "name": "updateMessage",
            "type": "function"
          },
          {
            "name": "getMessage",
            "type": "function"
          },
          {
            "name": "getThreadByName",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_102025_/l2/collabMessagesHelper.js",
        "dependencies": [
          {
            "name": "getUserId",
            "type": "function"
          },
          {
            "name": "createThread",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiAgentOrchestration.js",
        "dependencies": [
          {
            "name": "loadAgent",
            "type": "function"
          },
          {
            "name": "executeBeforePrompt",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "openService",
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
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabImport.js",
        "dependencies": [
          {
            "name": "collabImport"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Helper functions for AI agent orchestration and task management",
      "businessCapabilities": [],
      "technicalCapabilities": [],
      "implementedFeatures": [
        "getAllSteps",
        "getAgentStepByAgentName",
        "getAgentsStepByAgentName",
        "getStepById",
        "getNextPendentStep",
        "getNextResultStep",
        "getNextClarificationStep",
        "getNextPendingStepByAgentName",
        "getNextFlexiblePendingStep",
        "getNextInProgressStepByAgentName",
        "getRootAgent",
        "getInteractionStepId",
        "calculateStepsStatistics",
        "calculateStepsByFilter",
        "getTemporaryContext",
        "appendLongTermMemory",
        "updateStepStatus",
        "updateTaskTitle",
        "appendPromptToInteraction",
        "notifyMessageSendChange",
        "notifyTaskChange",
        "notifyTaskCompleted",
        "notifyThreadChange",
        "notifyThreadCreate",
        "dispatchDetailsTaskClose",
        "getTotalCost",
        "getNextStepIdAvaliable",
        "executeAgentByFile",
        "openCollabMessage",
        "formatTimestamp"
      ]
    }
  }
}
    