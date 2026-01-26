/// <mls shortName="agentDefs" project="100554" enhancement="_blank" folder="agents" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/serviceSave.ts",
    "componentType": "service",
    "componentScope": "editor",
    "languages": [
      "en",
      "pt"
    ],
    "devFidelity": "final"
  },
  "references": {
    "webComponents": [
      "plugin-create-project-local-to-driver-100554",
      "save-add-branch-100554",
      "plugin-verify-error-design-system-100554",
      "plugin-pullrequest-100554",
      "plugin-verify-error-100554"
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
            "name": "css",
            "type": "function"
          },
          {
            "name": "unsafeHTML",
            "type": "function"
          },
          {
            "name": "repeat",
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
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabIcons.js",
        "dependencies": [
          {
            "name": "collab_branch",
            "type": "constant"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLibStor.js",
        "dependencies": [
          {
            "name": "undoFile",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/saveAddBranch.js",
        "dependencies": [
          {
            "name": "initServiceSaveaddBranch",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "getMyKeysBranch",
            "type": "function"
          },
          {
            "name": "calculateTotalStringSize",
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
          },
          {
            "name": "updateConfigProject",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLibModel.js",
        "dependencies": [
          {
            "name": "readProjectTypescriptAndCompile",
            "type": "function"
          }
        ]
      }
    ]
  },
  "codeInsights": {
    "unusedImports": [
      "css"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Service for saving project changes and managing pull requests.",
      "businessCapabilities": [
        "Project version control",
        "Pull request management",
        "File change tracking",
        "Fork creation"
      ],
      "technicalCapabilities": [
        "Git-like workflow integration",
        "Multi-language support (i18n)",
        "File size calculation",
        "Conflict and error detection before saving",
        "Undo file changes"
      ],
      "implementedFeatures": [
        "Save changes to branch",
        "Create fork",
        "Create pull request",
        "File history viewing",
        "I18n support",
        "Local project to driver migration"
      ],
      "constraints": [
        "Saving only allowed if no files have errors",
        "Comment required for pull requests",
        "Total file size limit enforcement"
      ]
    }
  }
}