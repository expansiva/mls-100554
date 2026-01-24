/// <mls shortName="serviceSave" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "serviceSave",
    "level": 2,
    "componentType": "editorService",
    "componentScope": "editor",
    "group": "other",
    "devFidelity": "final",
    "languages": [
      "en",
      "pt"
    ]
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
      },
      {
        "ref": "/_100554_/l2/pluginCreateProjectLocalToDriver.js",
        "dependencies": []
      }
    ]
  },
  "codeInsights": {
    "todos": [
      "Manter para no futuro implementarmos o modo de salvar direto no repo."
    ],
    "performanceHints": [
      "Uses setTimeout for UI feedback and error clearing",
      "Calculates total string size before saving to prevent exceeding limits"
    ]
  },
  "auth": {
    "restrictReason": "Access is restricted based on repository permissions (read/write access). Users without write access are prompted to create a fork."
  },
  "asIs": {
    "generalDescription": "A service component for managing file saves, branch creation, and pull requests within the editor.",
    "goal": "To provide a structured workflow for committing changes to a repository using a fork and pull request model.",
    "businessCapabilities": [
      "File change tracking and visualization",
      "Branch management and switching",
      "Automated fork creation and synchronization",
      "Pull request generation with commit messages",
      "File undo and history viewing",
      "Pre-save validation for errors and file size"
    ],
    "technicalCapabilities": [
      "Lit-based reactive UI",
      "Integration with external Git drivers",
      "Local storage persistence for session metadata",
      "Event-driven architecture for file actions",
      "Internationalization support",
      "CRC-based change detection"
    ],
    "intentHints": [
      "save changes",
      "git workflow",
      "pull request",
      "version control"
    ],
    "implementedFeatures": [
      "Change list with status icons",
      "Commit message input",
      "Branch selection UI",
      "Forking logic",
      "Pull request submission",
      "Error reporting for compilation issues"
    ]
  },
  "toBe": {
    "pendingEnhancements": [
      "Direct save to repository without pull request"
    ]
  }
}
    