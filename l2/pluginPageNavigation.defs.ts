/// <mls fileReference="_100554_/l2/pluginPageNavigation.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/pluginPageNavigation.ts",
    "componentType": "pluginUI",
    "componentScope": "appFrontEnd",
    "group": "enhancement",
    "devFidelity": "final",
    "languages": [
      "en",
      "pt"
    ]
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
            "name": "state",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/pluginBaseModule.js",
        "dependencies": [
          {
            "name": "PluginBaseModule",
            "type": "class"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabIcons.js",
        "dependencies": [
          {
            "name": "collab_trash",
            "type": "constant"
          },
          {
            "name": "collab_pencil",
            "type": "constant"
          },
          {
            "name": "collab_bars",
            "type": "constant"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/utils.js",
        "dependencies": [
          {
            "name": "convertTagToFileName",
            "type": "function"
          },
          {
            "name": "convertFileNameToTag",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "selectLevel",
            "type": "function"
          },
          {
            "name": "openService",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabDOMSync.js",
        "dependencies": [
          {
            "name": "formatHtml",
            "type": "function"
          },
          {
            "name": "setValueInModeKeepingUndo",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabPreviewL4.js",
        "dependencies": [
          {
            "name": "CollabPreviewL4",
            "type": "class"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiAgentHelper.js",
        "dependencies": [
          {
            "name": "openCollabMessage",
            "type": "function"
          }
        ]
      }
    ]
  },
  "codeInsights": {
    "i18nWarnings": []
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin for page navigation and component management",
      "businessCapabilities": [
        "Navigate and select page components",
        "Edit and delete components",
        "Drag and drop to reorder components",
        "Open related services and messages"
      ],
      "technicalCapabilities": [
        "Renders a tree navigation of HTML elements",
        "Handles drag-and-drop for reordering",
        "Integrates with preview and editor services",
        "Supports internationalization"
      ],
      "implementedFeatures": [
        "Component tree rendering",
        "Active item selection",
        "Edit, delete, and style actions",
        "Drag-and-drop functionality",
        "Mouse hover effects",
        "HTML synchronization"
      ]
    }
  }
}
    