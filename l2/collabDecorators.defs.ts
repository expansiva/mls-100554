/// <mls fileReference="_100554_/l2/collabDecorators.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabDecorators.ts",
    "componentType": "other",
    "componentScope": "appFrontEnd",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "lit",
        "dependencies": [
          {
            "name": "PropertyDeclaration",
            "type": "interface"
          }
        ]
      },
      {
        "ref": "lit/decorators.js",
        "dependencies": [
          {
            "name": "property",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/\\_100554_/l2/collabState.js",
        "dependencies": [
          {
            "name": "getState",
            "type": "function"
          },
          {
            "name": "setState",
            "type": "function"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Custom decorator to bind properties to multiple data sources dynamically.",
      "businessCapabilities": [
        "bind properties to multiple data sources dynamically",
        "read state values",
        "persist changes to the state"
      ],
      "technicalCapabilities": [
        "Lit property decorators",
        "template literals",
        "attribute variations"
      ],
      "implementedFeatures": [
        "propertyCompositeDataSource",
        "propertyDataSource",
        "getAttributeValueWithVariation"
      ]
    }
  }
}
    