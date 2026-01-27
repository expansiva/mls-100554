/// <mls fileReference="_100554_/l2/serviceBase.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/serviceBase.ts",
    "componentType": "molecule",
    "componentScope": "appFrontEnd",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_100554_/l2/stateLitElement.js",
        "dependencies": [
          {
            "name": "StateLitElement",
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
        "ref": "/_100554_/l2/libCommom.js"
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Abstract base class for service components",
      "businessCapabilities": [],
      "technicalCapabilities": [
        "Manages service content, navigation, tooltips, loading states",
        "Provides methods for service interaction"
      ],
      "implementedFeatures": [
        "abstract details: IService",
        "abstract menu: IServiceMenu",
        "abstract onServiceClick method",
        "getActualRef method",
        "setError method",
        "toogleBadge method",
        "openMe method",
        "showNav2Item method",
        "openService method",
        "setFullScreen method",
        "selectLevel method",
        "connectedCallback",
        "attributeChangedCallback",
        "updated method"
      ]
    }
  }
}
    