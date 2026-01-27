/// <mls fileReference="_100554_/l2/serviceHistories.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/serviceHistories.ts",
    "componentType": "editorService",
    "componentScope": "editor",
    "languages": [
      "en",
      "pt"
    ],
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "mls-editor-100529"
    ],
    "imports": [
      {
        "ref": "lit",
        "dependencies": [
          {
            "name": "html",
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
            "name": "query",
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
            "name": "IToolbarContent",
            "type": "interface"
          },
          {
            "name": "IServiceMenu",
            "type": "interface"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "File Histories Diff Service",
      "businessCapabilities": [
        "Display file history differences",
        "Support side-by-side and inline diff modes"
      ],
      "technicalCapabilities": [
        "Uses Monaco Diff Editor",
        "Supports TypeScript, HTML, LESS languages",
        "Integrates with MLS storage and events"
      ],
      "implementedFeatures": [
        "Diff viewing",
        "Editor mode switching",
        "Loading and no selection states"
      ]
    }
  }
}
    