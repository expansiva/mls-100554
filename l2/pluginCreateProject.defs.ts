/// <mls fileReference="_100554_/l2/pluginCreateProject.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/pluginCreateProject.ts",
    "componentType": "pluginUI",
    "componentScope": "appFrontEnd",
    "languages": [
      "en",
      "pt"
    ],
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "plugin-create-project-100554"
    ],
    "imports": [
      {
        "ref": "lit",
        "dependencies": [
          {
            "name": "html",
            "type": "constant"
          },
          {
            "name": "css",
            "type": "constant"
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
          },
          {
            "name": "state",
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
        "ref": "/_100554_/l2/collabLibStor.js",
        "dependencies": [
          {
            "name": "createAllFiles",
            "type": "function"
          },
          {
            "name": "IReqCreateAllFiles",
            "type": "interface"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libProjectConfig.js",
        "dependencies": [
          {
            "name": "createConfigFile",
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
        "ref": "/_102025_/l2/collabMessagesHelper.js",
        "dependencies": [
          {
            "name": "addMessage",
            "type": "function"
          },
          {
            "name": "createThread",
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
        "ref": "/_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "setProjectDetails",
            "type": "function"
          },
          {
            "name": "checkIfHasLocalProject",
            "type": "function"
          },
          {
            "name": "setLocalProjectName",
            "type": "function"
          },
          {
            "name": "isValidProjectName",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/pluginNewProjectTemplate.js",
        "dependencies": [
          {
            "name": "template_ds",
            "type": "constant"
          },
          {
            "name": "template_l5Project",
            "type": "constant"
          },
          {
            "name": "template_l2Project",
            "type": "constant"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "UI for creating new local projects, either blank or from a prompt, with validation and success feedback.",
      "businessCapabilities": [
        "Local project creation",
        "Project type selection (blank/prompt)",
        "Project naming",
        "Prompt-based project generation",
        "Project configuration",
        "Internationalization (PT, EN)"
      ],
      "technicalCapabilities": [
        "LitElement custom component",
        "State management",
        "Form validation",
        "Asynchronous file creation",
        "Interaction with Collab.codes storage",
        "Message thread creation",
        "Event firing"
      ],
      "implementedFeatures": [
        "Project name input and validation",
        "Project type radio buttons",
        "Prompt textarea",
        "Local project existence check",
        "Success message display",
        "File creation for project, design system, and config",
        "Agent message creation for prompt-based projects"
      ],
      "constraints": [
        "Project names must be alphanumeric and start with a letter",
        "Prompt is required for 'prompt' project type",
        "Only one local test project can exist at a time",
        "Local projects are for testing only, no version control/backup/sharing"
      ]
    }
  }
}
    