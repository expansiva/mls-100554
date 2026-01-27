/// <mls fileReference="_100554_/l2/pluginNewFileService.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/pluginNewFileService.ts",
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
      "widget-text-code-100554"
    ],
    "imports": [
      {
        "ref": "lit",
        "dependencies": [
          {
            "name": "html"
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
          }
        ]
      },
      {
        "ref": "/_102027_/l2/utils.js",
        "dependencies": [
          {
            "name": "convertFileNameToTag"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/stateLitElement.js",
        "dependencies": [
          {
            "name": "StateLitElement"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLitElement.js",
        "dependencies": [
          {
            "name": "getMessageKey"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabDecorators.js",
        "dependencies": [
          {
            "name": "propertyDataSource"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/serviceBase.js",
        "dependencies": [
          {
            "name": "ServiceBase"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/pluginNewFileBase.js",
        "dependencies": [
          {
            "name": "IDetails"
          },
          {
            "name": "createNewFile"
          },
          {
            "name": "changeTagName"
          },
          {
            "name": "changeClassName"
          },
          {
            "name": "changeWidget"
          },
          {
            "name": "getTemplateImport"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/widgetTextCode.js"
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin for creating a new service file",
      "businessCapabilities": [
        "Create a service to be used in the Collab system",
        "Allows creating menus after selecting the level",
        "Placed in nav2 with icons"
      ],
      "technicalCapabilities": [
        "Uses Lit",
        "Custom element",
        "TypeScript"
      ],
      "implementedFeatures": [
        "Form for project and shortName",
        "Button to create file",
        "Displays template code"
      ],
      "constraints": [
        "File name must start with \"service\""
      ]
    }
  }
}
    