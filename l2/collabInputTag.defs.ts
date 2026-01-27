/// <mls fileReference="_100554_/l2/collabInputTag.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabInputTag.ts",
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
          },
          {
            "name": "ifDefined",
            "type": "function"
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
            "name": "query",
            "type": "function"
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
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Lit-based custom element for tag input",
      "businessCapabilities": [
        "Add tags",
        "Delete tags",
        "Validate tags",
        "Handle duplicates"
      ],
      "technicalCapabilities": [
        "Uses Lit library",
        "Custom element",
        "Property binding",
        "Event handling"
      ],
      "implementedFeatures": [
        "Tag addition on enter or comma",
        "Tag deletion",
        "Validation with pattern",
        "Error indication"
      ]
    }
  }
}
    