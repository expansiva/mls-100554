/// <mls fileReference="_100554_/l2/collabShowCodeDiff.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabShowCodeDiff.ts",
    "componentType": "molecule",
    "componentScope": "appFrontEnd",
    "languages": [
      "en-us",
      "pt-br"
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
            "name": "collab_check"
          },
          {
            "name": "collab_copy"
          },
          {
            "name": "collab_repeat"
          },
          {
            "name": "collab_thumbs_down"
          },
          {
            "name": "collab_thumbs_up"
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
      "generalDescription": "LitElement component for code diff display with Monaco editor",
      "businessCapabilities": [
        "Code difference visualization",
        "Code copying",
        "Change acceptance or rejection"
      ],
      "technicalCapabilities": [
        "Monaco editor integration",
        "LitElement web component",
        "i18n support"
      ],
      "implementedFeatures": [
        "Diff and result view toggle",
        "Copy to clipboard",
        "Accept, reject, try again actions",
        "Language indicator"
      ]
    }
  }
}
    