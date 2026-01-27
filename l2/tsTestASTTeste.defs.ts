/// <mls fileReference="_100554_/l2/tsTestASTTeste.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/tsTestASTTeste.ts",
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
            "name": "html"
          },
          {
            "name": "css"
          },
          {
            "name": "LitElement"
          }
        ]
      },
      {
        "ref": "lit/decorators.js",
        "dependencies": [
          {
            "name": "customElement"
          },
          {
            "name": "property"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/tsTestAST.js",
        "dependencies": [
          {
            "name": "TsTestAst"
          },
          {
            "name": "ICANIntegration"
          },
          {
            "name": "ICANTest"
          }
        ]
      }
    ]
  },
  "codeInsights": {
    "deadCodeBlocks": [
      "const testAddTest = ''",
      "const testAddTestSameTitle = ''",
      "const testAddIntegration= ''",
      "const testDeleteTest = ''"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Test runner component for AST testing",
      "businessCapabilities": [],
      "technicalCapabilities": [
        "parse AST",
        "get integrations",
        "get tests",
        "add test",
        "add integration",
        "delete test"
      ],
      "implementedFeatures": [
        "exeTest",
        "test1",
        "test2",
        "test3",
        "test4",
        "test5",
        "test6"
      ]
    }
  }
}
    