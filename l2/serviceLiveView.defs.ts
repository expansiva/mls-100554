/// <mls fileReference="_100554_/l2/serviceLiveView.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/serviceLiveView.ts",
    "componentType": "editorService",
    "componentScope": "editor",
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
            "name": "nothing",
            "type": "constant"
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
            "name": "query",
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
      },
      {
        "ref": "/_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "openService",
            "type": "function"
          },
          {
            "name": "getProjectConfig",
            "type": "function"
          },
          {
            "name": "getProjectModuleConfig",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/utils.js",
        "dependencies": [
          {
            "name": "convertFileNameToTag",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabNav4Menu.js"
      }
    ]
  },
  "codeInsights": {
    "securityWarnings": [
      "Uses unsafeHTML which can lead to XSS vulnerabilities"
    ],
    "deadCodeBlocks": [
      "Commented out code block in onServiceClick method"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Service for live view of modules in development",
      "businessCapabilities": [
        "Provides live view of configured modules",
        "Builds modules on demand",
        "Starts front-end and back-end instances"
      ],
      "technicalCapabilities": [
        "Renders dynamic web components using unsafeHTML",
        "Handles internationalization with messages",
        "Manages service state and lifecycle"
      ],
      "implementedFeatures": [
        "Initializes live view component",
        "Builds and starts modules",
        "Handles service click events"
      ]
    }
  }
}
    