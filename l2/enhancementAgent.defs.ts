/// <mls fileReference="_100554_/l2/enhancementAgent.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/enhancementAgent.ts",
    "componentType": "agent",
    "componentScope": "editor",
    "group": "enhancement="
  },
  "references": {
    "imports": [
      {
        "ref": "/_102027_/l2/propiertiesLit.js",
        "dependencies": [
          {
            "name": "getPropierties"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Enhancement agent for injecting regions into compiled JS",
      "businessCapabilities": [
        "Injects source regions into JS templates",
        "Handles compilation enhancements"
      ],
      "technicalCapabilities": [
        "Processes TypeScript regions",
        "Replaces placeholders in JS"
      ],
      "implementedFeatures": [
        "getDesignDetails",
        "onAfterChange",
        "onAfterCompile",
        "injectSourceInJs",
        "injectRegionsIntoTemplate",
        "removeRegionsIntoJS"
      ]
    }
  }
}
    