/// <mls fileReference="_100554_/l2/agents/agentToBeConceptual.defs.ts" enhancement="_blank" />

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
    ],
    "statesRO": [],
    "statesRW": [],
    "statesWO": []
  },
  "codeInsights": {
    "todos": [
      "resolve inTest constant"
    ],
    "securityWarnings": [],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibilityIssues": [],
    "i18nWarnings": [],
    "performanceHints": []
  },
  "auth": {},
  "asIs": {
    "semantic": {
      "generalDescription": "LLM agent that creates ToBe conceptual module definitions from user prompts",
      "businessCapabilities": [
        "Create new ToBe conceptual module definitions",
        "Process user requirements into structured ontology",
        "Generate capability maps from user input",
        "Define business rules and platform policies"
      ],
      "technicalCapabilities": [
        "Orchestrate multi-step LLM interactions",
        "Parse and validate user prompts",
        "Generate structured JSON output following ToBeFactual schema",
        "Chain to secondary agent agentToBeConceptual2",
        "Handle agent lifecycle hooks (beforePromptImplicit, beforePromptStep, afterPromptStep)"
      ],
      "implementedFeatures": [
        "Agent initialization with metadata",
        "Implicit prompt handling with system message injection",
        "Step-based prompt continuation",
        "Post-prompt processing with payload validation",
        "ToBe module processing and step creation",
        "Error handling and status updates",
        "JSON schema enforcement for output",
        "Multi-language support via userLanguage field",
        "Ontology definition with entities and fields",
        "Rules registry for domain/platform/policy rules",
        "Capability mapping with optional features"
      ],
      "constraints": [
        "Output MUST be valid JSON only",
        "NO indentation, NO newlines except when strictly required by JSON syntax",
        "NO extra spaces or whitespace",
        "All field names and keys MUST be in English",
        "All descriptions and string values MUST be written in the language specified by the 'userLanguage' field",
        "All relevant information provided by the user in their answers MUST be converted into explicit 'rules' in the output"
      ]
    }
  }
}
    