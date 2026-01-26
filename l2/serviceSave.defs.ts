/// <mls fileReference="_100554_/l2/serviceSave.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = 
{
  "meta": {
    "fileReference": "_100554_/l2/serviceSave.ts",
    "componentType": "editorService",
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
      },
      {
        "ref": "/_100554_/l2/pluginCreateProjectLocalToDriver.js"
      }
    ]
  },
  "codeInsights": {
    "unusedImports": [
      "css"
    ],
    "deadCodeBlocks": [
      "//@property() otherProjects: number[] = [];",
      "/*private filterOtherProject() { ... }*/",
      "/*const params = {} as mls.events.IFileAction; ... */",
      "//this.showLoader(true);",
      "//this.showLoader(false);",
      "//clearTimeout(this.timeSumTotal);",
      "//this.timeSumTotal = setTimeout(() => this.sumTotalSize(), 300);",
      "//console.info('gerou o fork');",
      "//console.info('gerou o branche');",
      "//console.info('gerou o push');",
      "//console.info('gerou o pullrequest');",
      "//this.error = e.message;",
      "//this.setError(e.message);"
    ],
    "accessibilityIssues": [
      "Clickable spans without role='button' or tabindex (fa-caret-righttv, fa-undo, fa-clock)",
      "Disabled checkboxes with custom click handlers"
    ],
    "i18nWarnings": [
      "Hardcoded string 'Owner:'",
      "Hardcoded string 'Repo:'",
      "Hardcoded string 'Branch:'",
      "Hardcoded string 'Change'",
      "Hardcoded string 'Fork'",
      "Hardcoded string 'Checking repository...'",
      "Hardcoded string 'Generating a pull request...'",
      "Hardcoded string 'TOTAL'",
      "Hardcoded string 'Error: the file does not exist in the database'",
      "Hardcoded string 'Pull request'",
      "Hardcoded string 'Not found project actual'",
      "Hardcoded string 'No organization selected'",
      "Hardcoded string 'Not found config file in this project'",
      "Hardcoded string 'Design system needs to be saved along with upcoming changes!'",
      "Hardcoded string 'Error Pull request'",
      "Hardcoded string 'Error create fork'",
      "Hardcoded string 'Error create Branch'",
      "Hardcoded string 'removeFork: Not found fork for delet'",
      "Hardcoded string 'File ... was changed in server, file was not save'"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Service component for saving project files, managing git branches, forks, and pull requests in the editor.",
      "businessCapabilities": [
        "Save project files",
        "Manage Git branches",
        "Create Git forks",
        "Create Pull Requests",
        "View file changes",
        "Undo file changes",
        "Handle repository permissions"
      ],
      "technicalCapabilities": [
        "LitElement Web Component",
        "Integration with global mls storage and event system",
        "TypeScript project compilation trigger",
        "File size validation",
        "Local storage and driver interaction",
        "Dynamic UI based on file status"
      ],
      "implementedFeatures": [
        "ServiceSave class extending ServiceBase",
        "Multi-language support (EN/PT)",
        "File change detection and listing",
        "Fork and Branch creation logic",
        "Pull Request creation logic",
        "Permission verification (read/write)"
      ]
    }
  }
}