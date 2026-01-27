/// <mls fileReference="_100554_/l2/collabL3PreviewTextAttr.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabL3PreviewTextAttr.ts",
    "componentType": "molecule",
    "componentScope": "appFrontEnd",
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
          }
        ]
      },
      {
        "ref": "lit/decorators.js",
        "dependencies": [
          {
            "name": "customElement",
            "type": "?"
          },
          {
            "name": "property",
            "type": "?"
          }
        ]
      },
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
        "ref": "/_100554_/l2/collabDecorators.js",
        "dependencies": [
          {
            "name": "propertyDataSource",
            "type": "?"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Lit web component for text attribute preview and editing",
      "businessCapabilities": [
        "Handle click to select and edit text",
        "Fire events on text change"
      ],
      "technicalCapabilities": [
        "Uses Lit decorators",
        "Sets contenteditable attribute",
        "Extends StateLitElement"
      ],
      "implementedFeatures": [
        "findby property",
        "value property with propertyDataSource",
        "render method",
        "handleChange method",
        "handleClick method",
        "fireEvent method",
        "onSelect method"
      ]
    }
  }
}
    