/// <mls fileReference="_100554_/l2/pluginVerifyErrorDesignSystem.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/pluginVerifyErrorDesignSystem.ts",
    "componentType": "pluginUI",
    "componentScope": "appFrontEnd",
    "languages": [
      "en",
      "pt"
    ],
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
          }
        ]
      },
      {
        "ref": "lit/decorators.js",
        "dependencies": [
          {
            "name": "property",
            "type": "function"
          },
          {
            "name": "customElement",
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
        "ref": "/_100554_/l2/designSystemBase.js",
        "dependencies": [
          {
            "name": "preCompileLessByThemeOrDefault",
            "type": "function"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin for verifying Less file compilation errors in the design system",
      "businessCapabilities": [
        "Verifying Less files for compilation errors",
        "Displaying verification progress",
        "Listing errors found",
        "Canceling verification"
      ],
      "technicalCapabilities": [
        "Compiling Less files using preCompileLessByThemeOrDefault",
        "Accessing project files via mls.stor",
        "Firing events on completion"
      ],
      "implementedFeatures": [
        "prepare method to start verification",
        "compileAll to process files",
        "render methods for UI",
        "progressCallback",
        "cancelVerify"
      ]
    }
  }
}
    