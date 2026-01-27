/// <mls fileReference="_100554_/l2/lessASTTest.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/lessASTTest.ts",
    "componentType": "molecule",
    "componentScope": "appFrontEnd",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "lit",
        "dependencies": [
          {
            "name": "html",
            "type": "function"
          },
          {
            "name": "css",
            "type": "function"
          },
          {
            "name": "LitElement",
            "type": "class"
          }
        ]
      },
      {
        "ref": "lit/decorators.js",
        "dependencies": [
          {
            "name": "customElement",
            "type": "function"
          },
          {
            "name": "property",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/lessCSS.js",
        "dependencies": [
          {
            "name": "LessCSS",
            "type": "class"
          }
        ]
      }
    ]
  },
  "codeInsights": {
    "deadCodeBlocks": [
      "test1",
      "test3",
      "testt1",
      "testt2"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "LitElement component for testing LESS AST",
      "businessCapabilities": [
        "testing LESS CSS AST",
        "finding selectors by line",
        "setting selectors",
        "updating styles"
      ],
      "technicalCapabilities": [
        "extends LitElement",
        "uses Monaco editor",
        "instantiates LessCSS"
      ],
      "implementedFeatures": [
        "exeTest method",
        "test2 method"
      ]
    }
  }
}
    