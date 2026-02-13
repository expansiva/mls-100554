/// <mls fileReference="_100554_/l2/agents/agentToBeConceptual3.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/agents/agentToBeConceptual3.ts",
    "componentType": "agent",
    "componentScope": "editor",
    "devFidelity": "scaffold"
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
      "define"
    ],
    "deadCodeBlocks": [
      "const rc: mls.msg.AgentIntentAddSteps = { type: 'add-steps', steps: [step] }",
      "t1, grok-code-fast-1, 17s, $0.0070, 8.7/10",
      "t2, gpt-5.2, 60s, $0.0800, 8.3/10, **json formatting issues**",
      "t3, gemini-2.5-pro, 68s, $0.0291, 7.6/10"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Agent that applies suggestions to update TO-BE conceptual models",
      "businessCapabilities": [
        "UPDATE an existing TO-BE conceptual model by applying a list of user-provided suggestions",
        "Apply ONLY suggestions that are relevant to the TO-BE model",
        "Translate each valid suggestion into concrete changes in entities, rules, or capabilities",
        "Mark related capability with isOptional = true when suggestion represents optional or configurable feature",
        "Preserve all existing rules and constraints unless a suggestion clearly extends them",
        "Apply only suggestions where yagni = \"now\"",
        "Return explicit error if suggestions are invalid, contradictory, or not applicable"
      ],
      "technicalCapabilities": [
        "Process AI agent steps with beforePromptImplicit hook",
        "Process AI agent steps with beforePromptStep hook",
        "Process AI agent steps with afterPromptStep hook",
        "Generate agent intents for adding AI messages",
        "Generate agent intents for prompt ready status",
        "Generate agent intents for updating step status",
        "Parse and validate flexible output results",
        "Validate prompt inputs for minimum length"
      ],
      "implementedFeatures": [
        "beforePromptImplicit hook implementation",
        "beforePromptStep hook implementation",
        "afterPromptStep hook implementation",
        "System prompt injection for business analyst role",
        "Output processing via processOutput4 function",
        "Test mode detection via inTest flag"
      ],
      "constraints": [
        "Only apply suggestions where yagni = \"now\"",
        "Do not introduce technical or implementation details",
        "Do not remove existing capabilities unless explicitly required by a suggestion",
        "Preserve all existing rules and constraints unless a suggestion clearly extends them",
        "Minimum prompt length of 5 characters"
      ]
    }
  }
}
    