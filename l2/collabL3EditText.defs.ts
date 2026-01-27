/// <mls fileReference="_100554_/l2/collabL3EditText.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabL3EditText.ts",
    "componentType": "molecule",
    "componentScope": "appFrontEnd",
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "collab-l3-preview-text-100554",
      "collab-l3-preview-text-attr-100554",
      "collab-l3-preview-text-i18n-100554"
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
        "ref": "/_100554_/l2/collabLitElement.js",
        "dependencies": [
          {
            "name": "CollabLitElement"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabState.js",
        "dependencies": [
          {
            "name": "initState"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLibModel.js",
        "dependencies": [
          {
            "name": "createModel"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabL3PreviewText.js"
      },
      {
        "ref": "/_100554_/l2/collabL3PreviewTextAttr.js"
      },
      {
        "ref": "/_100554_/l2/collabL3PreviewTextI18n.js"
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "CollabL3EditText component",
      "businessCapabilities": [
        "edit inner text",
        "edit attributes",
        "edit i18n text"
      ],
      "technicalCapabilities": [
        "process DOM tree",
        "replace text nodes",
        "save to Monaco model"
      ],
      "implementedFeatures": [
        "text editing",
        "attribute editing",
        "i18n editing",
        "save functionality"
      ]
    }
  }
}
    