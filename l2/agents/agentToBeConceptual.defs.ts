/// <mls fileReference="_100554_/l2/agents/agentToBeConceptual.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/agents/agentToBeConceptual.ts",
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
      }
    ]
  },
  "codeInsights": {
    "todos": [
      "todo: resolve - const inTest = true;"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Agent that creates new ToBe conceptual modules by orchestrating LLM prompts to generate structured ModuleToBe JSON output",
      "businessCapabilities": [
        "Create new ToBe conceptual module definitions",
        "Process and validate user prompts for module creation",
        "Orchestrate multi-step agent workflow for conceptual design",
        "Generate structured ontology, rules, and capability definitions"
      ],
      "technicalCapabilities": [
        "Agent lifecycle management (beforePromptImplicit, afterPromptStep)",
        "LLM prompt construction with system context injection",
        "JSON schema enforcement for ModuleToBe output",
        "Agent step sequencing and status management",
        "Error handling and validation for agent parameters"
      ],
      "implementedFeatures": [
        "System prompt injection with output template replacement",
        "User prompt validation (minimum 5 characters)",
        "Test mode flag for development",
        "Agent intent generation for AI message addition",
        "Payload type validation for flexible/result discrimination",
        "Sequential hook processing for step status updates",
        "Console logging for debug output"
      ],
      "constraints": [
        "User prompt must be at least 5 characters",
        "Output must be valid JSON only - no indentation, no newlines except JSON syntax requirements",
        "All field names and keys must be in English",
        "All descriptions must be in userLanguage",
        "All user answers must be converted to explicit rules",
        "Agent is private visibility only"
      ]
    }
  }
}
    