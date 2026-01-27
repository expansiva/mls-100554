/// <mls fileReference="_100554_/l2/collabL3PreviewTextI18n.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabL3PreviewTextI18n.ts",
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
        "ref": "/_100554_/l2/collabDecorators.js",
        "dependencies": [
          {
            "name": "propertyDataSource"
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
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Lit custom element for previewing text with i18n",
      "businessCapabilities": [
        "Handles click events",
        "Handles change events",
        "Fires events for editing"
      ],
      "technicalCapabilities": [
        "Uses Lit framework",
        "Implements contenteditable",
        "Extends StateLitElement"
      ],
      "implementedFeatures": [
        "@property findby",
        "@propertyDataSource value",
        "render method",
        "handleChange method",
        "handleClick method",
        "fireEvent method",
        "onSelect method"
      ]
    }
  }
}
    