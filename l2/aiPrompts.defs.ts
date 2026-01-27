/// <mls fileReference="_100554_/l2/aiPrompts.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/aiPrompts.ts",
    "componentType": "tool",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_100554_/l2/aiAgentBase.js",
        "dependencies": [
          {
            "name": "ITool",
            "type": "interface"
          },
          {
            "name": "IAgent",
            "type": "interface"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/designSystemBase.js",
        "dependencies": [
          {
            "name": "getTokensLess",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabState.js",
        "dependencies": [
          {
            "name": "getState",
            "type": "function"
          },
          {
            "name": "setState",
            "type": "function"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "AI prompts module",
      "businessCapabilities": [
        "Provide system messages for available agents",
        "Provide system messages for available RAGs",
        "Add RAG additional information to prompts",
        "Specify JSON format for returns",
        "List available tools",
        "Retrieve LESS tokens for design system",
        "Generate prompts from HTML content",
        "Get source content from files"
      ],
      "technicalCapabilities": [
        "Export functions returning IAMessageInputType",
        "Use async functions for file operations",
        "Interact with mls.stor for file access",
        "Parse HTML content for prompts",
        "Replace placeholders in content"
      ],
      "implementedFeatures": [
        "systemAgentsAvailable",
        "systemRagsAvailable",
        "addRAGAdditionalInformation",
        "systemReturnJsonFormat",
        "systemToolsAvailable",
        "getListFilesStart",
        "systemTokensLessInstruction",
        "getPromptByHtml",
        "getSource"
      ]
    }
  }
}
    