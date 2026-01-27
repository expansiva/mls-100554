/// <mls fileReference="_100554_/l2/pluginPrototypeImprove.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/pluginPrototypeImprove.ts",
    "componentType": "pluginUI",
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
            "name": "state"
          },
          {
            "name": "property"
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
            "name": "collab_file_pen"
          },
          {
            "name": "collab_magnifying_glass"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabState.js",
        "dependencies": [
          {
            "name": "getState"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin component for improving prototypes",
      "businessCapabilities": [
        "Toggle actions for review and rewrite",
        "Update text options like tone, clarity, and shortness",
        "Update layout options like grid, spacing, alignment, and reordering",
        "Update visual options like contrast, emphasizing headers, and imagery",
        "Update interaction options like CTA prominence, navigation simplification, and feedback states",
        "Update accessibility options like large touch targets",
        "Update responsiveness options like optimization and sticky header",
        "Update notes"
      ],
      "technicalCapabilities": [
        "Uses Lit for rendering",
        "Extends StateLitElement",
        "Manages state with @state and @property decorators",
        "Builds prompts for improvement",
        "Renders UI with buttons and inputs"
      ],
      "implementedFeatures": [
        "Quick actions for review and rewrite",
        "Text options: tone (friendly, professional, concise), clarify wording, shorter",
        "Layout options: grid (auto, 1-col, 2-col, 3-col), spacing (compact, comfortable, roomy), align to grid, reorder sections",
        "Visual options: emphasize headers, imagery (add, reduce, keep)",
        "Contrast options: normal, high",
        "Interaction options: CTA prominence (low, medium, high), simplify navigation, add feedback states",
        "Accessibility options: large touch targets",
        "Responsiveness options: optimize for (mobile, desktop, both), sticky header",
        "Additional notes input"
      ]
    }
  }
}
    