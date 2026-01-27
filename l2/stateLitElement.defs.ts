/// <mls fileReference="_100554_/l2/stateLitElement.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/stateLitElement.ts",
    "componentType": "molecule",
    "componentScope": "appFrontEnd",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_100554_/l2/collabLitElement.js",
        "dependencies": [
          {
            "name": "CollabLitElement",
            "type": "class"
          }
        ]
      },
      {
        "ref": "lit",
        "dependencies": [
          {
            "name": "PropertyValueMap",
            "type": "type"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabState.js",
        "dependencies": [
          {
            "name": "getState",
            "type": "function"
          },
          {
            "name": "setState",
            "type": "function"
          },
          {
            "name": "subscribe",
            "type": "function"
          },
          {
            "name": "unsubscribe",
            "type": "function"
          },
          {
            "name": "notify",
            "type": "function"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Base class for all components that need to interact with the shared state.",
      "businessCapabilities": [],
      "technicalCapabilities": [
        "State subscription",
        "Dynamic state key updates",
        "Performance monitoring"
      ],
      "implementedFeatures": [
        "updateStateKeys",
        "handleIcaStateChange",
        "connectMonitoring"
      ],
      "constraints": [
        "Paths can be modified dynamically during the web component's lifecycle."
      ]
    }
  }
}
    