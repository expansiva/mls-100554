/// <mls fileReference="_100554_/l2/pluginPresenterRecorder.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/pluginPresenterRecorder.ts",
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
            "name": "css",
            "type": "function"
          },
          {
            "name": "svg",
            "type": "function"
          },
          {
            "name": "TemplateResult",
            "type": "type"
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
        "ref": "/_100554_/l2/collabLitElement.js",
        "dependencies": [
          {
            "name": "getMessageKey",
            "type": "function"
          }
        ]
      }
    ]
  },
  "codeInsights": {
    "i18nWarnings": [
      "Square",
      "Round",
      "Zoom:",
      "1x",
      "1.5x",
      "2x",
      "Recording starts in",
      "Baixar vídeo"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Presentation Recording Plugin",
      "businessCapabilities": [
        "Records browser screen and camera with audio",
        "Provides download of recorded video"
      ],
      "technicalCapabilities": [
        "Uses MediaRecorder API",
        "Supports picture-in-picture for camera preview"
      ],
      "implementedFeatures": [
        "Countdown before recording",
        "Start and stop recording",
        "Download video",
        "Adjustable camera zoom and shape"
      ]
    }
  }
}
    