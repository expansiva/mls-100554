/// <mls fileReference="_100554_/l2/aiAgentBase.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/aiAgentBase.ts",
    "componentType": "agent",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "lit",
        "dependencies": [
          {
            "name": "TemplateResult",
            "type": "type"
          }
        ]
      }
    ]
  },
  "codeInsights": {
    "todos": [
      "remove agentProject",
      "remove agentFolder"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Agent Architecture Overview",
      "businessCapabilities": [
        "Supports two agent models",
        "IAgent procedural model",
        "IAgentAsync declarative model"
      ],
      "technicalCapabilities": [
        "Defines TypeScript types and interfaces",
        "Exports agent lifecycle hooks",
        "Includes tool interface",
        "Provides middleware example"
      ],
      "implementedFeatures": [
        "IAgent type",
        "IAgentAsync type",
        "IAgentMeta type",
        "IAgentLifecycle type",
        "IAgentLifecycleSync type",
        "IAgentLifecycleHooks type",
        "ITool interface",
        "withLogging function",
        "svg_tool constant",
        "svg_agent constant"
      ]
    }
  }
}
    