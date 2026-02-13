/// <mls fileReference="_100554_/l2/agents/agentDefs.defs.ts" enhancement="_blank" />

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
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "AI agent that generates AsIs factual definitions for TypeScript files",
      "businessCapabilities": [
        "Generate AsIs JSON definitions from source code",
        "Update existing .defs.ts files",
        "Create new .defs.ts files",
        "Process single file or batch of files needing definitions update"
      ],
      "technicalCapabilities": [
        "Parse TypeScript source files",
        "Extract metadata and code insights",
        "Generate structured JSON output following strict schema",
        "Handle parallel execution for batch processing",
        "Manage file storage operations via mls.stor API",
        "Format output as valid JSON without extra whitespace"
      ],
      "implementedFeatures": [
        "beforePromptAtomic: single file processing",
        "beforePromptImplicit: batch file processing with max limit",
        "beforePromptStep: parallel step continuation",
        "afterPromptStep: result processing and status update",
        "getSource: file content retrieval with header transformation",
        "updateDefs: file creation or update logic",
        "createStorFile: new .defs.ts file creation",
        "updateStorFile: existing .defs.ts file update",
        "System prompt with SudoLang constraints and schema definitions"
      ]
    }
  }
}
    