/// <mls fileReference="_100554_/l2/collabConsoleL1.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabConsoleL1.ts",
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
          },
          {
            "name": "query",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/\\_100554_/l2/collabLitElement.js",
        "dependencies": [
          {
            "name": "CollabLitElement",
            "type": "class"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Collab Console L1 Component",
      "businessCapabilities": [
        "Execute JavaScript commands in a console interface",
        "Persist variables across executions",
        "Redirect console.log and console.info to the output"
      ],
      "technicalCapabilities": [
        "Render HTML using Lit",
        "Handle keyboard events for command execution",
        "Override console methods to display in UI"
      ],
      "implementedFeatures": [
        "Command input and execution",
        "Variable declaration and persistence",
        "Console log redirection"
      ]
    }
  }
}
    