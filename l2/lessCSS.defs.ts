/// <mls fileReference="_100554_/l2/lessCSS.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/lessCSS.ts",
    "componentType": "tool",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_100554_/l2/lessAST.js",
        "dependencies": [
          {
            "name": "LessAst"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabState.js",
        "dependencies": [
          {
            "name": "setState",
            "type": "function"
          },
          {
            "name": "getState",
            "type": "function"
          },
          {
            "name": "initState",
            "type": "function"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "LESS CSS handler class with Monaco editor integration",
      "businessCapabilities": [
        "Manages LESS CSS properties and selectors",
        "Integrates with Monaco editor for real-time updates"
      ],
      "technicalCapabilities": [
        "Parses LESS AST",
        "Provides proxy for CSS properties",
        "Handles state management for LESS positions"
      ],
      "implementedFeatures": [
        "setSelector",
        "getProperty",
        "setProperty",
        "refresh",
        "setStateByLine",
        "clearState",
        "updateState",
        "initStateIfNeeded"
      ]
    }
  }
}
    