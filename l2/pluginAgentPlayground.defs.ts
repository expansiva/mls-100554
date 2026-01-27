/// <mls fileReference="_100554_/l2/pluginAgentPlayground.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/pluginAgentPlayground.ts",
    "componentType": "service",
    "componentScope": "editor",
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
        "ref": "/ _100554_/l2/collabLitElement.js",
        "dependencies": [
          {
            "name": "CollabLitElement",
            "type": "class"
          }
        ]
      },
      {
        "ref": "/ _102025_/l2/collabMessagesHelper.js",
        "dependencies": [
          {
            "name": "loadChatPreferences",
            "type": "function"
          },
          {
            "name": "IChatPreferences",
            "type": "interface"
          },
          {
            "name": "saveChatPreferences",
            "type": "function"
          },
          {
            "name": "getUserId",
            "type": "function"
          },
          {
            "name": "createThread",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/ _102025_/l2/collabMessagesIndexedDB.js",
        "dependencies": [
          {
            "name": "getThreadByName",
            "type": "function"
          },
          {
            "name": "listThreads",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/ _100554_/l2/aiAgentBase.js",
        "dependencies": [
          {
            "name": "IAgent",
            "type": "interface"
          }
        ]
      },
      {
        "ref": "/ _100554_/l2/aiAgentHelper.js",
        "dependencies": [
          {
            "name": "getTemporaryContext",
            "type": "function"
          },
          {
            "name": "getAllSteps",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/ _100554_/l2/collabDOMSync.js",
        "dependencies": [
          {
            "name": "updateHTML",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/ _100554_/l2/collabIcons.js",
        "dependencies": [
          {
            "name": "collab_trash",
            "type": "constant"
          }
        ]
      },
      {
        "ref": "/ _100554_/l2/collabState.js",
        "dependencies": [
          {
            "name": "setState",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/ _100554_/l2/aiAgentOrchestration.js",
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
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Agent playground component for testing AI agents",
      "businessCapabilities": [
        "Testing AI agents",
        "Comparing agent responses",
        "Managing prompt groups"
      ],
      "technicalCapabilities": [
        "Lit web component",
        "State management",
        "Drag and drop prompts"
      ],
      "implementedFeatures": [
        "Prompt input",
        "Agent execution",
        "Result display",
        "Thread settings",
        "Group management"
      ]
    }
  }
}
    