/// <mls fileReference="_100554_/l2/agents/agentNewModule.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/agents/agentNewModule.ts",
    "componentType": "agent",
    "componentScope": "editor"
  },
  "references": {
    "imports": [
      {
        "ref": "/_100554_/l2/aiAgentBase.js",
        "dependencies": [
          {
            "name": "IAgentAsync",
            "type": "interface"
          },
          {
            "name": "IAgentMeta",
            "type": "interface"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiAgentHelper.js",
        "dependencies": [
          {
            "name": "getAgentStepByAgentName",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiAgentOrchestration.js",
        "dependencies": [
          {
            "name": "prepareClarificationElement",
            "type": "function"
          }
        ]
      }
    ],
    "statesRO": [
      "mls.stor.files",
      "mls.actualProject"
    ],
    "statesWO": [
      "mls.msg.AgentIntentAddMessageAI",
      "mls.msg.AgentIntentUpdateStatus"
    ]
  },
  "codeInsights": {
    "todos": [
      "commented code block for newStep agent intent in beforeClarificationStep"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "AI agent for creating new modules in collab.codes projects",
      "businessCapabilities": [
        "Analyze user requests for new module creation",
        "Validate user prompts for module creation intent",
        "Collect clarification details for new module specification",
        "Suggest module names based on existing project folders",
        "Detect user language from prompt"
      ],
      "technicalCapabilities": [
        "Agent lifecycle hooks: beforePromptImplicit, afterPromptStep, beforeClarificationStep",
        "Dynamic folder discovery from project files",
        "Multi-step clarification workflow",
        "JSON-structured output generation",
        "Error handling for invalid prompts and payloads"
      ],
      "implementedFeatures": [
        "Prompt validation with minimum length check",
        "System prompt injection with existing module folders",
        "Clarification step preparation with status updates",
        "Type-safe output definitions (Output1, Clarification1, Question)",
        "Payload retrieval from agent step interactions"
      ],
      "constraints": [
        "Requires mls.actualProject and mls.stor.files to be available",
        "User prompt must be at least 5 characters",
        "Agent step interaction payload must contain clarification at index [0] and result at [1]"
      ]
    }
  }
}
    