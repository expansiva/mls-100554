/// <mls fileReference="_100554_/l2/serviceDetail.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/serviceDetail.ts",
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
            "name": "html"
          },
          {
            "name": "css"
          }
        ]
      },
      {
        "ref": "lit/decorators.js",
        "dependencies": [
          {
            "name": "customElement"
          },
          {
            "name": "property"
          },
          {
            "name": "query"
          },
          {
            "name": "state"
          }
        ]
      },
      {
        "ref": "/\\_100554_/l2/serviceBase.js",
        "dependencies": [
          {
            "name": "ServiceBase"
          },
          {
            "name": "IService"
          },
          {
            "name": "IToolbarContent"
          },
          {
            "name": "IServiceMenu"
          }
        ]
      },
      {
        "ref": "/\\_100554_/l2/libCompile.js",
        "dependencies": [
          {
            "name": "getAllWebComponentsInSource"
          }
        ]
      },
      {
        "ref": "/\\_102027_/l2/utils.js",
        "dependencies": [
          {
            "name": "convertTagToFileName"
          },
          {
            "name": "convertFileNameToTag"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "ServiceDetail component for displaying plugin details",
      "businessCapabilities": [
        "Display plugin information",
        "Handle user interactions for plugin details",
        "Show about content for selected plugins"
      ],
      "technicalCapabilities": [
        "Implements custom element",
        "Manages event listeners",
        "Dynamically loads and updates HTML content"
      ],
      "implementedFeatures": [
        "Plugin detail rendering",
        "Event handling for plugin details, Monaco actions, and file actions",
        "Menu functionality for about and mode setting"
      ]
    }
  }
}
    