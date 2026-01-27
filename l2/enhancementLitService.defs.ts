/// <mls fileReference="_100554_/l2/enhancementLitService.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/enhancementLitService.ts",
    "componentType": "tool",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_100554_/l2/enhancementLit.js",
        "dependencies": [
          {
            "name": "getDesignDetails",
            "type": "function"
          },
          {
            "name": "getDefaultHtmlExamplePreview",
            "type": "function"
          },
          {
            "name": "onAfterChange",
            "type": "function"
          },
          {
            "name": "onAfterCompile",
            "type": "function"
          },
          {
            "name": "requires",
            "type": "function"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Service that re-exports and wraps Lit enhancement functions",
      "businessCapabilities": [
        "Re-export requires",
        "Wrap getDefaultHtmlExamplePreview",
        "Wrap getDesignDetails",
        "Wrap onAfterChange",
        "Wrap onAfterCompile"
      ],
      "technicalCapabilities": [
        "TypeScript",
        "Async functions",
        "Promises"
      ],
      "implementedFeatures": [
        "requires",
        "getDefaultHtmlExamplePreview",
        "getDesignDetails",
        "onAfterChange",
        "onAfterCompile"
      ]
    }
  }
}
    