/// <mls fileReference="_100554_/l2/collabInit.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/collabInit.ts",
    "componentType": "molecule",
    "componentScope": "appFrontEnd",
    "languages": [
      "en-US",
      "pt-BR"
    ],
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "collab-init-100554"
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
        "ref": "/_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "getProjectDetails"
          },
          {
            "name": "setProjectDetails"
          },
          {
            "name": "getLastOpenedFiles"
          },
          {
            "name": "findStorFileInProjectsOrDeps"
          },
          {
            "name": "getInstanceByFile"
          },
          {
            "name": "saveOpenedFile"
          },
          {
            "name": "getLastModule"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Initialization component for Collab.codes system",
      "businessCapabilities": [
        "Initializes system lifecycle",
        "Sets up collaboration drivers",
        "Configures themes and languages",
        "Loads project information",
        "Manages user authentication status"
      ],
      "technicalCapabilities": [
        "Loads Monaco editor",
        "Sets favicon",
        "Handles events",
        "Loads plugins",
        "Manages navigation"
      ],
      "implementedFeatures": [
        "initCompileMonaco",
        "setFavicon",
        "setDrivers",
        "setAndGetBaseUrl",
        "setTheme",
        "enableNav",
        "loadProjectBase",
        "getServices"
      ]
    }
  }
}
    