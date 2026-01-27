/// <mls fileReference="_100554_/l2/pluginSystemTheme.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/pluginSystemTheme.ts",
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
      "plugin-system-theme-100554"
    ],
    "imports": [
      {
        "ref": "/_100554_/l2/pluginBaseModule.js",
        "dependencies": [
          {
            "name": "PluginBaseModule",
            "type": "class"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Theme selection plugin component",
      "businessCapabilities": [
        "Allows users to select and change application theme"
      ],
      "technicalCapabilities": [
        "Uses localStorage for theme persistence",
        "Detects OS theme preference"
      ],
      "implementedFeatures": [
        "Theme selection dropdown",
        "Change button",
        "Page reload on theme change"
      ]
    }
  }
}
    