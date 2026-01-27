/// <mls fileReference="_100554_/l2/aiAgentOrchestration.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/aiAgentOrchestration.ts",
    "componentType": "agent",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_100554_/l2/aiAgentHelper.js",
        "dependencies": [
          {
            "name": "calculateStepsByFilter",
            "type": "function"
          },
          {
            "name": "updateStepStatus",
            "type": "function"
          },
          {
            "name": "calculateStepsStatistics",
            "type": "function"
          },
          {
            "name": "getInteractionStepId",
            "type": "function"
          },
          {
            "name": "getNextPendentStep",
            "type": "function"
          },
          {
            "name": "appendLongTermMemory",
            "type": "function"
          },
          {
            "name": "getStepById",
            "type": "function"
          },
          {
            "name": "notifyTaskChange",
            "type": "function"
          },
          {
            "name": "dispatchDetailsTaskClose",
            "type": "function"
          },
          {
            "name": "updateTaskTitle",
            "type": "function"
          },
          {
            "name": "getNextStepIdAvaliable",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabImport.js",
        "dependencies": [
          {
            "name": "collabImport",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_102025_/l2/collabMessagesIndexedDB.js",
        "dependencies": [
          {
            "name": "getTask",
            "type": "function"
          },
          {
            "name": "getMessage",
            "type": "function"
          },
          {
            "name": "addOrUpdateTask",
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
            "name": "IAgentAsync",
            "type": "interface"
          }
        ]
      },
      {
        "ref": "/_102025_/l2/collabMessagesHelper.js",
        "dependencies": [
          {
            "name": "getUserId",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "loadModuleFromProjectOrDependency",
            "type": "function"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "AI agent orchestration module",
      "businessCapabilities": [
        "Starting new AI tasks",
        "Executing next steps in tasks",
        "Managing clarifications",
        "Loading agents and tools"
      ],
      "technicalCapabilities": [
        "Async function execution",
        "Error handling",
        "Task state updates"
      ],
      "implementedFeatures": [
        "startNewAiTask",
        "startNewAiTaskAsync",
        "startNewInteractionInAiTask",
        "addNewStep",
        "executeNextStep",
        "executeTool",
        "loadAgent",
        "loadTool",
        "executeBeforePrompt",
        "getAgentContext",
        "getClarification",
        "postBackClarification",
        "startClarification",
        "endClarification",
        "toLLMClarification"
      ],
      "constraints": [
        "maxCostByTask = 1.01",
        "maxStepsByTask = 100"
      ]
    }
  }
}
    