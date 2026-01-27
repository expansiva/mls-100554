/// <mls fileReference="_100554_/l2/previewModeUtil.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/previewModeUtil.ts",
    "componentType": "tool",
    "componentScope": "editor",
    "group": "enhancement",
    "devFidelity": "final"
  },
  "references": {
    "imports": [
      {
        "ref": "/_100554_/l2/libCompile",
        "dependencies": [
          {
            "name": "IJSONDependence",
            "type": "interface"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/utils",
        "dependencies": [
          {
            "name": "convertFileNameToTag",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/serviceBase",
        "dependencies": [
          {
            "name": "ServiceBase",
            "type": "class"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Utility functions for preview mode iframe management",
      "businessCapabilities": [
        "Preview mode simulation",
        "Iframe content mounting"
      ],
      "technicalCapabilities": [
        "DOM manipulation",
        "Import map injection",
        "CSS and script addition"
      ],
      "implementedFeatures": [
        "mountJSImporMap",
        "mountCSS",
        "mountTokens",
        "removeOlderTokens",
        "getIdTokens",
        "simulateService",
        "addFA",
        "addTooltip",
        "addStyleMls",
        "addNav3",
        "waitForComponents",
        "functionReplaceAnchor",
        "addJsReference"
      ]
    }
  }
}
    