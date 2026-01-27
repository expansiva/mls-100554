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
    ],
    "webComponents": [
      "plugin-codelens-file-references-100554"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "ServiceDetail extends ServiceBase for plugin details",
      "businessCapabilities": [],
      "technicalCapabilities": [
        "Lit element",
        "Custom element",
        "Event handling"
      ],
      "implementedFeatures": [
        "onClickMain",
        "showAboutThis",
        "updateContentPluginWithElement",
        "clear",
        "onServiceClick",
        "renderDefault",
        "setEvents",
        "onMonacoEvents",
        "onFileActionReceived",
        "onPluginDetails",
        "onWidgetChanged",
        "showPluginContent",
        "getHtmlFromPlugin",
        "updateContentPluginWithScripts",
        "_updateContentPluginWithElement",
        "setContentElement",
        "setContentinEl",
        "fireEvents"
      ]
    }
  }
}
    