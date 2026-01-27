/// <mls fileReference="_100554_/l2/enhancementLitService.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/enhancementLitService.ts",
    "componentType": "service",
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
            "type": "?"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Enhancement Lit Service",
      "businessCapabilities": [],
      "technicalCapabilities": [
        "exports wrapper functions"
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
    