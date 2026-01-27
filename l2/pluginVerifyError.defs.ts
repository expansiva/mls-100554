/// <mls fileReference="_100554_/l2/pluginVerifyError.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/pluginVerifyError.ts",
    "componentType": "pluginUI",
    "componentScope": "editor",
    "languages": [
      "en",
      "pt"
    ],
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
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
            "name": "repeat",
            "type": "function"
          }
        ]
      },
      {
        "ref": "lit/decorators.js",
        "dependencies": [
          {
            "name": "property",
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
        "ref": "/_100554_/l2/collabInit.js",
        "dependencies": [
          {
            "name": "initCompileMonaco",
            "type": "function"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "File verification",
      "businessCapabilities": [
        "Verifies project files for compilation errors",
        "Displays progress and errors",
        "Allows canceling verification"
      ],
      "technicalCapabilities": [
        "Uses Lit library for rendering",
        "Integrates with Monaco editor for compilation",
        "Manages state for loading and errors"
      ],
      "implementedFeatures": [
        "Renders header",
        "Renders loading state with progress",
        "Renders list of errors",
        "Prepares and compiles project",
        "Handles cancellation",
        "Fires completion event"
      ]
    }
  }
}
    