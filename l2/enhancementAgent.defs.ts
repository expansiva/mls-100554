/// <mls fileReference="_100554_/l2/enhancementAgent.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/enhancementAgent.ts",
    "componentType": "agent",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_102027_/l2/propiertiesLit.js",
        "dependencies": [
          {
            "name": "getPropierties",
            "type": "function"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Enhancement agent for injecting regions into compiled JavaScript",
      "businessCapabilities": [],
      "technicalCapabilities": [
        "Injects regions from TypeScript into JavaScript templates",
        "Validates region syntax",
        "Replaces placeholders in JS"
      ],
      "implementedFeatures": [
        "getDesignDetails",
        "onAfterChange",
        "onAfterCompile",
        "injectSourceInJs",
        "injectRegionsIntoTemplate",
        "removeRegionsIntoJS"
      ],
      "constraints": [
        "Regions must not contain backticks",
        "Regions cannot be nested",
        "Region names must be unique",
        "Placeholders must match existing regions"
      ]
    }
  }
}
    