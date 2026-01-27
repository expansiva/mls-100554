/// <mls fileReference="_100554_/l2/pluginProjectUsage.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/pluginProjectUsage.ts",
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
      "plugin-project-usage-100554"
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
            "name": "query",
            "type": "function"
          },
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
        "ref": "/_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "getDateFormated",
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
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabIcons.js",
        "dependencies": [
          {
            "name": "icons",
            "type": "?"
          }
        ]
      }
    ]
  },
  "codeInsights": {
    "i18nWarnings": [
      "Total Files"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin for project usage",
      "businessCapabilities": [
        "Displays project resume",
        "Shows last modified date",
        "Counts design systems",
        "Counts files"
      ],
      "technicalCapabilities": [
        "Lit web component",
        "Internationalization support"
      ],
      "implementedFeatures": [
        "prepare method",
        "render method",
        "renderHeader method",
        "renderBody method",
        "renderResume method"
      ]
    }
  }
}
    