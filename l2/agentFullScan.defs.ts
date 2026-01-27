/// <mls fileReference="_100554_/l2/agentFullScan.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/agentFullScan.ts",
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
            "name": "updateStepStatus",
            "type": "function"
          },
          {
            "name": "getNextPendentStep",
            "type": "function"
          },
          {
            "name": "updateTaskTitle",
            "type": "function"
          },
          {
            "name": "calculateStepsStatistics",
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
      "generalDescription": "Responsavel por analisar os arquivos do projeto de acordo com a solicitação do usuário",
      "businessCapabilities": [
        "analisar os arquivos do projeto",
        "de acordo com a solicitação do usuário"
      ],
      "technicalCapabilities": [
        "beforePrompt",
        "afterPrompt",
        "getPrompts",
        "prepareExecTasks"
      ],
      "implementedFeatures": [
        "Planning",
        "Tool exec",
        "Analysis completed"
      ]
    }
  }
}
    