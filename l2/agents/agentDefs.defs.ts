/// <mls fileReference="_100554_/l2/agents/agentDefs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/agents/agentDefs.ts",
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
        "ref": "/_100554_/l2/collabLibModel.js",
        "dependencies": [
          {
            "name": "createModel",
            "type": "function"
          }
        ]
      }
    ],
    "statesRO": [
      "mls.stor.files"
    ],
    "statesRW": []
  },
  "asIs": {
    "semantic": {
      "generalDescription": "LLM agent that generates AsIs factual definitions for source code files",
      "businessCapabilities": [
        "Generate AsIsFactual JSON definitions from source code",
        "Create or update .defs.ts files automatically",
        "Batch process multiple files for defs generation",
        "Parse and transform triple-slash XML metadata in source files"
      ],
      "technicalCapabilities": [
        "Orchestrate LLM prompts for code analysis",
        "Execute parallel processing of multiple files",
        "Manage file storage operations (create/update)",
        "Integrate with Monaco editor models",
        "Parse and rewrite file metadata headers",
        "Serialize structured definitions to TypeScript files"
      ],
      "implementedFeatures": [
        "Atomic prompt processing for single file analysis",
        "Implicit prompt processing for batch file updates",
        "Step-based parallel execution with continuation hooks",
        "Automatic .defs.ts file generation and updates",
        "Triple-slash XML header transformation",
        "Integration with mls.stor file storage system",
        "Monaco editor model synchronization"
      ],
      "constraints": [
        "Output must be strictly valid JSON with no extra whitespace",
        "Only extract information literally present in source code",
        "No interpretation, abstraction, or normalization allowed",
        "Do not create empty arrays or placeholder values",
        "Only populate optional fields when data is explicitly present",
        "Only list imports verifiable line-by-line in code",
        "Only list state paths starting with db. or ui. verbatim in code"
      ]
    }
  }
}
    