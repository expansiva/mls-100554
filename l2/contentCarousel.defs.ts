/// <mls fileReference="_100554_/l2/contentCarousel.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/contentCarousel.ts",
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
      "generalDescription": "Content carousel component with tabs and navigation",
      "businessCapabilities": [
        "Displays content in a carousel format",
        "Allows selection via tabs",
        "Provides previous and next navigation buttons"
      ],
      "technicalCapabilities": [
        "Uses Lit for rendering",
        "Manages selected index state",
        "Renders nav and content items"
      ],
      "implementedFeatures": [
        "Tab selection handling",
        "Previous button click handling",
        "Next button click handling",
        "Content rendering with unsafeHTML"
      ]
    }
  }
}
    