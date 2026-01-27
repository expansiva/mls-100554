/// <mls fileReference="_100554_/l2/serviceSource.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/serviceSource.ts",
    "componentType": "service",
    "componentScope": "editor",
    "languages": [
      "en",
      "pt"
    ],
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "collab-spliter-vertical-var-fixed-100554",
      "collab-spliter-horizontal-var-fixed-100554",
      "mls-editor-100529",
      "css-helper-index-100554",
      "mls-history-list-100554"
    ],
    "imports": [
      {
        "ref": "lit",
        "dependencies": [
          {
            "name": "html"
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
            "name": "query"
          },
          {
            "name": "property"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/serviceBase.js",
        "dependencies": [
          {
            "name": "ServiceBase"
          },
          {
            "name": "IService"
          },
          {
            "name": "IToolbarContent"
          },
          {
            "name": "IServiceMenu"
          },
          {
            "name": "IOptions"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabDOMSync.js",
        "dependencies": [
          {
            "name": "formatHtml"
          },
          {
            "name": "sync"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/libCompileStyle.js",
        "dependencies": [
          {
            "name": "removeTokensFromSource"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/designSystemBase.js",
        "dependencies": [
          {
            "name": "getTokensLess"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/lessCSS.js",
        "dependencies": [
          {
            "name": "LessCSS"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabState.js",
        "dependencies": [
          {
            "name": "initState"
          },
          {
            "name": "getState"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabDecorators.js",
        "dependencies": [
          {
            "name": "propertyDataSource"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabIcons.js",
        "dependencies": [
          {
            "name": "collab_html"
          },
          {
            "name": "collab_typescript"
          },
          {
            "name": "collab_less"
          },
          {
            "name": "collab_fileTest"
          },
          {
            "name": "collab_file_code"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/agentFix.js",
        "dependencies": [
          {
            "name": "createAgent"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiAgentHelper.js",
        "dependencies": [
          {
            "name": "getTemporaryContext"
          }
        ]
      },
      {
        "ref": "/_102025_/l2/collabMessagesHelper.js",
        "dependencies": [
          {
            "name": "getUserId"
          },
          {
            "name": "createThread"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "saveOpenedFile"
          },
          {
            "name": "getLastOpenedFiles"
          },
          {
            "name": "OpenedFileL2"
          },
          {
            "name": "getBaseTemplate"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLibModel.js",
        "dependencies": [
          {
            "name": "readProjectTypescriptAndCompile"
          },
          {
            "name": "createModel"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLibStor.js",
        "dependencies": [
          {
            "name": "IReqCreateStorFile"
          },
          {
            "name": "createStorFile"
          }
        ]
      },
      {
        "ref": "/_102025_/l2/collabMessagesIndexedDB.js",
        "dependencies": [
          {
            "name": "getThreadByName"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabSpliterVerticalVarFixed.js",
        "dependencies": [
          {
            "name": "CollabSpliterVerticalVarFixed100554"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "ServiceSource component for managing source code editing in the editor",
      "businessCapabilities": [
        "Source code editing",
        "File management",
        "Editor configuration"
      ],
      "technicalCapabilities": [
        "Monaco editor integration",
        "TypeScript compilation",
        "Less CSS handling",
        "HTML formatting"
      ],
      "implementedFeatures": [
        "Open files",
        "Edit in multiple modes",
        "View history",
        "Agent fix for errors"
      ]
    }
  }
}
    