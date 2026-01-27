/// <mls fileReference="_100554_/l2/pluginNavigationRenderOrganism.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/pluginNavigationRenderOrganism.ts",
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
      "info-item"
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
            "name": "customElement",
            "type": "function"
          },
          {
            "name": "state",
            "type": "function"
          },
          {
            "name": "property",
            "type": "function"
          },
          {
            "name": "query",
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
          },
          {
            "name": "convertTagToFileName",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabIcons.js",
        "dependencies": [
          {
            "name": "collab_trash",
            "type": "constant"
          },
          {
            "name": "collab_pencil",
            "type": "constant"
          },
          {
            "name": "collab_bars",
            "type": "constant"
          },
          {
            "name": "collab_info",
            "type": "constant"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "openService",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiAgentHelper.js",
        "dependencies": [
          {
            "name": "openCollabMessage",
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
        "ref": "/_100554_/l2/collabPreviewL3.js",
        "dependencies": [
          {
            "name": "CollabPreviewL3",
            "type": "class"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/serviceBase.js",
        "dependencies": [
          {
            "name": "ServiceBase",
            "type": "class"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin Navigation Render Organism",
      "businessCapabilities": [
        "render navigation",
        "handle events",
        "select elements"
      ],
      "technicalCapabilities": [
        "LitElement",
        "i18n",
        "event listeners"
      ],
      "implementedFeatures": [
        "renderNav",
        "renderDetails",
        "createNavigation",
        "renderItemTree",
        "forceUpdate",
        "init",
        "goToScenary",
        "openCollabMessage",
        "dispatchEventAdd",
        "dispatchEventProperty",
        "dispatchEventGlobalStyle",
        "dispatchEventStyle",
        "setElPreview",
        "getComponents",
        "selectItem",
        "clickGroupHidden",
        "delEl",
        "onMouseover",
        "onMouseout",
        "highlightElement",
        "unhighlightElement",
        "goToL2"
      ]
    }
  }
}
    