/// <mls fileReference="_100554_/l2/servicePreviewL1ListServer.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/servicePreviewL1ListServer.ts",
    "componentType": "molecule",
    "componentScope": "appFrontEnd",
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "collab-console-l1-100554"
    ],
    "imports": [
      {
        "ref": "lit",
        "dependencies": [
          {
            "name": "html",
            "type": "function"
          },
          {
            "name": "repeat",
            "type": "function"
          },
          {
            "name": "unsafeHTML",
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
            "name": "state",
            "type": "function"
          },
          {
            "name": "query",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLitElement.js",
        "dependencies": [
          {
            "name": "CollabLitElement",
            "type": "class"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libCompile.js",
        "dependencies": [
          {
            "name": "IJSONDependence",
            "type": "interface"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "List of servers with status and quick actions",
      "businessCapabilities": [
        "List of servers with status and quick actions (Power On/Off, Restart, View)"
      ],
      "technicalCapabilities": [
        "Render server list",
        "Manage iframes",
        "Compile and load code in iframes",
        "Handle server status"
      ],
      "implementedFeatures": [
        "renderHeader",
        "renderList",
        "renderItem",
        "init",
        "loadEsbuild",
        "initializeEsBuild",
        "handleClickPower",
        "handleClickRestart",
        "handleClickView",
        "handleCloseView",
        "refreshRow",
        "onServer",
        "offServer",
        "restartServer",
        "createServer",
        "setHTml",
        "compileWithEsbuild",
        "getVirtualFiles",
        "getVirtualFilesPlugin",
        "mountJSImporMap",
        "mountJSBundle"
      ]
    }
  }
}
    