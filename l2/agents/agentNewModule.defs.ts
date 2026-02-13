/// <mls fileReference="_100554_/l2/agents/agentNewModule.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/agents/agentNewModule.ts",
    "componentType": "agent",
    "componentScope": "editor",
    "group": "100554"
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
          },
          {
            "name": "getNextStepIdAvaliable",
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
    "statesRW": [],
    "statesWO": []
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [
      "getNextStepIdAvaliable"
    ],
    "deadCodeBlocks": [
      "const folders = Array.from(new Set(\nObject.values(mls.stor.files)\n.filter(f => f.project === mls.actualProject && f.level !== 3 && f.folder)\n.map(f => f.folder)\n));",
      "console.log(\"afterPrompt\", payload.json);"
    ],
    "accessibilityIssues": [],
    "i18nWarnings": [
      "New module",
      "Teste step title",
      "You are an assistant responsible for helping create a new module in the current project for collab.codes. Your task is to analyze the user's request and return a JSON object in the format specified under 'Output format'. Use the same language as the user in the prompt.\nAnalyze the user's request:\n- If invalid or not about creating a new system/module → return error\n- If valid → return a clarification",
      "Already existing modules",
      "Output format",
      "Return only valid JSON in the following structure:",
      "This is the first clarification ",
      "before creating somethings"
    ],
    "performanceHints": []
  },
  "auth": {
    "view": [],
    "edit": [],
    "use": [],
    "restrictReason": ""
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Agent for creating new modules in collab.codes projects through AI-driven clarification workflow",
      "businessCapabilities": [
        "Analyze user requests for new module creation",
        "Validate if request is about creating a system/module",
        "Collect clarification information through structured questions",
        "Suggest module names based on existing project folders",
        "Detect user language from prompt",
        "Orchestrate multi-step agent workflow with human-in-the-loop"
      ],
      "technicalCapabilities": [
        "Implement IAgentAsync interface for agent registration",
        "Execute beforePromptImplicit hook to prepare AI system message",
        "Execute afterPromptStep hook to validate and process AI response",
        "Execute beforeClarificationStep hook to render clarification UI",
        "Define TypeScript types for agent output validation",
        "Access project file structure via mls.stor.files",
        "Filter files by project and level to extract folder names",
        "Throw errors for invalid prompts or payloads",
        "Prepare clarification elements with agent intents",
        "Add new agent steps dynamically",
        "Update step status in task workflow"
      ],
      "implementedFeatures": [
        "Agent registration with metadata (name, project, folder, description, visibility)",
        "System prompt injection with dynamic folder list",
        "Input validation for minimum prompt length (5 characters)",
        "Payload validation for clarification vs result types",
        "Structured clarification schema with 8 questions (roles, publicTarget, tone, languages, moduleName, openQuestion1-3)",
        "Multi-language support detection",
        "AI-suggested default answers in first person",
        "Legend translation placeholders",
        "Error handling with descriptive messages",
        "Dynamic step creation for agentToBeConceptual",
        "Status update intents for workflow progression"
      ],
      "constraints": [
        "Minimum 5 characters required for user prompt",
        "Only processes prompts related to creating new systems/modules",
        "Requires valid task context for clarification step",
        "Assumes single agent execution per task",
        "Payload structure strictly typed as Output1",
        "Folder extraction filters by project, level !== 3, and non-null folder",
        "Agent orchestration depends on external prepareClarificationElement function",
        "Step IDs managed externally via getNextStepIdAvaliable (imported but unused)",
        "Hardcoded parentStepId of 1 in new step creation",
        "Portuguese placeholder text 'Teste step title' in code"
      ]
    }
  }
}
    