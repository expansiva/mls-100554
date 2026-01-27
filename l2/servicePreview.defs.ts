/// <mls fileReference="_100554_/l2/servicePreview.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/servicePreview.ts",
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
      "service-preview-view-100554",
      "plugin-preview-insights-100554",
      "collab-l3-edit-text-100554",
      "collab-console-100554",
      "collab-result-container-100554",
      "plugin-preview-result-js-100554",
      "plugin-preview-result-test-js-100554",
      "collab-result-test-100554",
      "collab-process-test-100554",
      "collab-spliter-vertical-var-fixed-100554",
      "collab-spliter-horizontal-var-fixed-100554",
      "collab-messages-prompt-102025",
      "mls-editor-100529",
      "wcd-toolbox-100554"
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
        "ref": "/_100554_/l2/serviceBase.js",
        "dependencies": [
          {
            "name": "ServiceBase",
            "type": "class"
          },
          {
            "name": "IService",
            "type": "interface"
          },
          {
            "name": "IServiceMenu",
            "type": "interface"
          },
          {
            "name": "IOptions",
            "type": "interface"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/designSystemBase.js",
        "dependencies": [
          {
            "name": "getTokens",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libProjectConfig.js",
        "dependencies": [
          {
            "name": "getConfigProject",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "createPath",
            "type": "function"
          },
          {
            "name": "getLastOpenedFiles",
            "type": "function"
          },
          {
            "name": "OpenedFileL2",
            "type": "interface"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabImport.js",
        "dependencies": [
          {
            "name": "collabImport",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_102025_/l2/collabMessagesHelper.js",
        "dependencies": [
          {
            "name": "createThread",
            "type": "function"
          },
          {
            "name": "getUserId",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_102025_/l2/collabMessagesIndexedDB.js",
        "dependencies": [
          {
            "name": "getThreadByName",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabState.js",
        "dependencies": [
          {
            "name": "globalState",
            "type": "constant"
          },
          {
            "name": "setState",
            "type": "function"
          },
          {
            "name": "initState",
            "type": "function"
          },
          {
            "name": "getState",
            "type": "function"
          },
          {
            "name": "CollabState",
            "type": "class"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabIcons.js",
        "dependencies": [
          {
            "name": "collab_record",
            "type": "constant"
          },
          {
            "name": "collab_trash",
            "type": "constant"
          },
          {
            "name": "collab_file_pen",
            "type": "constant"
          },
          {
            "name": "collab_play",
            "type": "constant"
          },
          {
            "name": "collab_test",
            "type": "constant"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabState.js",
        "dependencies": [
          {
            "name": "CollabState",
            "type": "class"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/tsTestAST.js",
        "dependencies": [
          {
            "name": "TsTestAst",
            "type": "class"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiAgentHelper.js",
        "dependencies": [
          {
            "name": "getTemporaryContext",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiAgentOrchestration.js",
        "dependencies": [
          {
            "name": "loadAgent",
            "type": "function"
          },
          {
            "name": "executeBeforePrompt",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLibModel.js",
        "dependencies": [
          {
            "name": "createModel",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabConsole.js"
      },
      {
        "ref": "/_100554_/l2/collabResultTest.js"
      },
      {
        "ref": "/_100554_/l2/servicePreviewView.js"
      },
      {
        "ref": "/_100554_/l2/pluginPreviewInsights.js"
      },
      {
        "ref": "/_102025_/l2/collabMessagesPrompt.js"
      },
      {
        "ref": "/_100554_/l2/collabSpliterVerticalVarFixed.js"
      },
      {
        "ref": "/_100554_/l2/collabSpliterHorizontalVarFixed.js"
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Service for previewing and interacting with front-end components",
      "businessCapabilities": [
        "preview",
        "test",
        "theme",
        "language"
      ],
      "technicalCapabilities": [
        "render",
        "event handling",
        "editor integration"
      ],
      "implementedFeatures": [
        "desktop preview",
        "mobile preview",
        "insights preview",
        "test recording",
        "theme switching",
        "language switching",
        "console toggle",
        "L3 edit mode"
      ]
    }
  }
}
    