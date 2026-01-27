/// <mls fileReference="_100554_/l2/collabNav4Menu.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabNav4Menu.ts",
    "componentType": "molecule",
    "componentScope": "appFrontEnd",
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "collab-nav4-menu-100554"
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
            "name": "unsafeHTML",
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
            "name": "state",
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
      },
      {
        "ref": "/_100554_/l2/collabIcons.js",
        "dependencies": [
          {
            "name": "collab_bars",
            "type": "constant"
          },
          {
            "name": "collab_bell",
            "type": "constant"
          },
          {
            "name": "collab_chevron_down",
            "type": "constant"
          },
          {
            "name": "collab_xmark",
            "type": "constant"
          }
        ]
      }
    ]
  },
  "codeInsights": {
    "securityWarnings": [
      "Use of unsafeHTML may expose to XSS attacks."
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Lit-based navigation menu component for tabs",
      "businessCapabilities": [
        "Tab selection",
        "Tab closing",
        "Dropdown menu toggle"
      ],
      "technicalCapabilities": [
        "Custom element with Lit decorators",
        "Event dispatching",
        "Mode-based rendering"
      ],
      "implementedFeatures": [
        "Render tabs with icons and text",
        "Handle tab selection and closing",
        "Toggle dropdown menu"
      ]
    }
  }
}
    