/// <mls fileReference="_100554_/l2/enhancementStyle.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/enhancementStyle.ts",
    "componentType": "tool",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_102027_/l2/utils.js",
        "dependencies": [
          {
            "name": "convertFileNameToTag",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/processCssLit.js",
        "dependencies": [
          {
            "name": "getCssWithoutTag",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/libCompileStyle.js",
        "dependencies": [
          {
            "name": "removeTokensFromSource",
            "type": "function"
          },
          {
            "name": "removeCommentLines",
            "type": "function"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Style enhancement utilities for editor",
      "businessCapabilities": [
        "Validate style selectors",
        "Process and format LESS code",
        "Set styles on elements"
      ],
      "technicalCapabilities": [
        "Async validation of styles",
        "Marker error verification",
        "CSS stylesheet creation"
      ],
      "implementedFeatures": [
        "requires",
        "onAfterChange",
        "onAfterMarkersChange",
        "onAfterCompile",
        "getDesignDetails",
        "verifyMarkersError",
        "validateStyle",
        "formatTextInMemory",
        "setErrorOnEditor",
        "getLineByText",
        "getLineSelectorByText",
        "getRootSelectors",
        "isCommentLine",
        "setStylesProcessed",
        "createStyleSheet"
      ]
    }
  }
}
    