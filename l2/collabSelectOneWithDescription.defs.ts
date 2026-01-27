/// <mls fileReference="_100554_/l2/collabSelectOneWithDescription.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabSelectOneWithDescription.ts",
    "componentType": "molecule",
    "componentScope": "appFrontEnd",
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
          },
          {
            "name": "query"
          },
          {
            "name": "queryAll"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabDecorators.js",
        "dependencies": [
          {
            "name": "propertyDataSource"
          },
          {
            "name": "propertyCompositeDataSource"
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
        "ref": "/_100554_/l2/collabIcons.js",
        "dependencies": [
          {
            "name": "collab_bolt"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "A Lit web component for selecting one option with descriptions displayed on hover.",
      "businessCapabilities": [
        "Allows users to select one option from a list with additional descriptions."
      ],
      "technicalCapabilities": [
        "Supports internationalization (en, pt)",
        "Keyboard accessible (arrow keys, enter)",
        "Mouse interactions (hover, click)",
        "Dynamic popup positioning"
      ],
      "implementedFeatures": [
        "Renders options in a list",
        "Toggles dropdown on click",
        "Updates description on hover/focus",
        "Dispatches custom event on selection"
      ]
    }
  }
}
    