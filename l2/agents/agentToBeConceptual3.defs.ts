/// <mls fileReference="_100554_/l2/agents/agentToBeConceptual3.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/agents/agentToBeConceptual3.ts",
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
        "ref": "/_100554_/l2/agents/agentToBeConceptual.js",
        "dependencies": [
          {
            "name": "outputPrompt",
            "type": "constant"
          },
          {
            "name": "Output",
            "type": "type"
          },
          {
            "name": "ModuleToBe",
            "type": "type"
          }
        ]
      }
    ]
  },
  "codeInsights": {
    "todos": [
      "define inTest flag - currently hardcoded to true",
      "uncomment add-steps intent implementation"
    ],
    "securityWarnings": [],
    "unusedImports": [],
    "deadCodeBlocks": [
      "const step: mls.msg.AIPayload = {...}",
      "// const rc: mls.msg.AgentIntentAddSteps = {...}",
      "return [];"
    ],
    "accessibilityIssues": [],
    "i18nWarnings": [],
    "performanceHints": []
  },
  "auth": {},
  "asIs": {
    "semantic": {
      "generalDescription": "AI agent that applies user suggestions to update an existing TO-BE conceptual business model",
      "businessCapabilities": [
        "Apply user suggestions to TO-BE conceptual model",
        "Validate suggestions relevance and applicability",
        "Translate suggestions into concrete entity/rule/capability changes",
        "Mark optional/configurable features with isOptional flag",
        "Preserve existing rules and constraints",
        "Filter suggestions by yagni = now criteria",
        "Return explicit errors for invalid or contradictory suggestions"
      ],
      "technicalCapabilities": [
        "Agent lifecycle management with before/after prompt hooks",
        "System prompt injection with dynamic outputPrompt placeholder",
        "AI message orchestration with system and human message types",
        "Step status management (completed/failed)",
        "Test mode conditional logic",
        "Output processing and error handling",
        "Sequential hook execution tracking"
      ],
      "implementedFeatures": [
        "Agent creation with metadata (name, project, folder, description, visibility)",
        "Input validation (minimum prompt length)",
        "System prompt template with business analyst persona",
        "Dynamic prompt placeholder replacement",
        "Test mode flag for development",
        "Step status update intent generation",
        "Error handling with status failure propagation",
        "Payload type validation (flexible vs result)",
        "Process output placeholder with JSON logging"
      ],
      "constraints": [
        "No technical or implementation details in output",
        "Do not remove existing capabilities unless explicitly required",
        "Only apply suggestions where yagni = now",
        "Must return explicit error for invalid suggestions",
        "Test mode disables step advancement (stepId === 1 clears intents)"
      ]
    }
  }
}
    