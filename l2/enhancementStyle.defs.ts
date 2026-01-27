/// <mls fileReference="_100554_/l2/enhancementStyle.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/enhancementStyle.ts",
    "componentType": "editorService",
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
      "generalDescription": "Style enhancement module for LESS validation and processing",
      "businessCapabilities": [],
      "technicalCapabilities": [
        "Validates root selectors in LESS files",
        "Formats text in memory",
        "Sets error markers in editor",
        "Processes CSS without tag",
        "Gets root selectors",
        "Checks for comment lines",
        "Sets styles processed"
      ],
      "implementedFeatures": [
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
    