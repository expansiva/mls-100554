/// <mls fileReference="_100554_/l2/widgetDefsListEdit.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/widgetDefsListEdit.ts",
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
          },
          {
            "name": "css"
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
            "name": "state"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/stateLitElement",
        "dependencies": [
          {
            "name": "StateLitElement"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabIcons",
        "dependencies": [
          {
            "name": "collab_file_pen"
          },
          {
            "name": "collab_message"
          },
          {
            "name": "collab_floppy_disk"
          },
          {
            "name": "collab_xmark"
          },
          {
            "name": "collab_trash"
          }
        ]
      }
    ]
  },
  "codeInsights": {
    "unusedImports": [
      "collab_file_pen",
      "collab_message",
      "collab_trash"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "WidgetDefsListEdit component",
      "businessCapabilities": [],
      "technicalCapabilities": [
        "Renders a list of items",
        "Provides edit mode with textarea",
        "Handles save and cancel actions"
      ],
      "implementedFeatures": [
        "Read mode",
        "Edit mode",
        "Save edit",
        "Cancel edit"
      ]
    }
  }
}
    