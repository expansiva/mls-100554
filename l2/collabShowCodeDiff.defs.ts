/// <mls fileReference="_100554_/l2/collabShowCodeDiff.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabShowCodeDiff.ts",
    "componentType": "molecule",
    "componentScope": "appFrontEnd",
    "languages": [
      "en",
      "pt"
    ],
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "mls-editor-100529"
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
            "name": "css",
            "type": "function"
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
        "ref": "/_100554_/l2/collabIcons.js",
        "dependencies": [
          {
            "name": "collab_check",
            "type": "constant"
          },
          {
            "name": "collab_copy",
            "type": "constant"
          },
          {
            "name": "collab_repeat",
            "type": "constant"
          },
          {
            "name": "collab_thumbs_down",
            "type": "constant"
          },
          {
            "name": "collab_thumbs_up",
            "type": "constant"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLitElement.js",
        "dependencies": [
          {
            "name": "CollabLitElement",
            "type": "class"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Component for showing code differences",
      "businessCapabilities": [
        "show code diff",
        "copy code",
        "accept changes",
        "reject changes",
        "try again",
        "toggle diff view"
      ],
      "technicalCapabilities": [
        "uses LitElement",
        "integrates Monaco editor",
        "supports i18n"
      ],
      "implementedFeatures": [
        "diff editor",
        "result editor",
        "action buttons",
        "CSS loading for Monaco"
      ]
    }
  }
}
    