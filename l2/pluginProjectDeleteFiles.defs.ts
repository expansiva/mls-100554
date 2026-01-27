/// <mls fileReference="_100554_/l2/pluginProjectDeleteFiles.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/pluginProjectDeleteFiles.ts",
    "componentType": "pluginUI",
    "componentScope": "appFrontEnd",
    "languages": [
      "en",
      "pt"
    ],
    "group": "enhancement",
    "devFidelity": "final"
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
            "name": "svg",
            "type": "function"
          },
          {
            "name": "TemplateResult",
            "type": "type"
          }
        ]
      },
      {
        "ref": "lit/decorators.js",
        "dependencies": [
          {
            "name": "customElement",
            "type": "?",
            "purpose": "decorator"
          },
          {
            "name": "state",
            "type": "?",
            "purpose": "decorator"
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
        "ref": "/_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "getListNewFilesToDeleteByFolder",
            "type": "function"
          },
          {
            "name": "deleteAllFilesLocal",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/projectAST.js",
        "dependencies": [
          {
            "name": "removeModule",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/designSystemBase.js",
        "dependencies": [
          {
            "name": "removeTokensTheme",
            "type": "function"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin for deleting local project files",
      "businessCapabilities": [
        "Search for files to delete by module path",
        "Delete selected files from project"
      ],
      "technicalCapabilities": [
        "Renders UI using Lit library",
        "Handles asynchronous file operations"
      ],
      "implementedFeatures": [
        "Search input for module path",
        "Delete button for selected files",
        "Checkbox list for file selection",
        "Logs display for operation feedback"
      ]
    }
  }
}
    