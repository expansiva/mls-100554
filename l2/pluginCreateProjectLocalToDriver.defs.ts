/// <mls fileReference="_100554_/l2/pluginCreateProjectLocalToDriver.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/pluginCreateProjectLocalToDriver.ts",
    "componentType": "pluginUI",
    "componentScope": "appFrontEnd",
    "languages": [
      "en",
      "pt"
    ],
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "plugin-create-project-local-to-driver-100554",
      "plugin-new-project-log-100554"
    ],
    "imports": [
      {
        "ref": "lit",
        "dependencies": [
          {
            "name": "html",
            "type": "constant"
          },
          {
            "name": "css",
            "type": "constant"
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
            "name": "state",
            "type": "function"
          },
          {
            "name": "query",
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
      },
      {
        "ref": "/_100554_/l2/libProviders.js",
        "dependencies": [
          {
            "name": "gitHubLogin",
            "type": "function"
          },
          {
            "name": "gitLabLogin",
            "type": "function"
          },
          {
            "name": "isProviderConnected",
            "type": "function"
          },
          {
            "name": "gitlabIcon",
            "type": "component"
          },
          {
            "name": "githubIcon",
            "type": "component"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLibStor.js",
        "dependencies": [
          {
            "name": "replaceTripleslashAndTag",
            "type": "function"
          },
          {
            "name": "createStorFile",
            "type": "function"
          },
          {
            "name": "IReqCreateStorFile",
            "type": "interface"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "getLocalProjectName",
            "type": "function"
          },
          {
            "name": "isValidProjectName",
            "type": "function"
          },
          {
            "name": "setProjectDetails",
            "type": "function"
          },
          {
            "name": "deleteLastOpenedFiles",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabIcons.js",
        "dependencies": [
          {
            "name": "collab_arrows_rotate",
            "type": "component"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/pluginNewProjectTemplate.js",
        "dependencies": [
          {
            "name": "template_package",
            "type": "constant"
          },
          {
            "name": "template_build",
            "type": "constant"
          },
          {
            "name": "template_tsconfig",
            "type": "constant"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/pluginNewProjectLog.js"
      }
    ],
    "statesRO": [],
    "statesRW": [],
    "statesWO": []
  },
  "codeInsights": {
    "i18nWarnings": []
  },
  "asIs": {
    "semantic": {
      "generalDescription": "A plugin to create a new project by connecting to a version control driver (GitHub/GitLab) and migrating local files.",
      "businessCapabilities": [
        "Connect to GitHub",
        "Connect to GitLab",
        "Create new repositories on GitHub",
        "Create new repositories on GitLab",
        "Migrate local project files to a remote repository",
        "Set project visibility (public/private)",
        "Manage project settings (organization, team)",
        "Create initial project files (README.md, package.json, build.yml, tsconfig.json)",
        "Integrate with Collab.codes project management"
      ],
      "technicalCapabilities": [
        "Handles user authentication with GitHub",
        "Handles user authentication with GitLab",
        "Interacts with version control APIs (create repo, create file, rename repo, change visibility, set permissions, set variables)",
        "Manages local storage (IndexedDB for tempObjects, mls.stor.localStor)",
        "Performs file content manipulation (replace project IDs, tripleslash tags)",
        "Manages UI state for multi-step process",
        "Provides internationalization (English, Portuguese)"
      ],
      "implementedFeatures": [
        "Provider selection (GitHub/GitLab)",
        "Provider connection status display",
        "Login flow for GitHub",
        "Login flow for GitLab",
        "Organization selection",
        "Project name input and validation",
        "Project visibility selection",
        "Step-by-step project creation log",
        "Progress indicator for creation steps",
        "Error handling and display",
        "Local file migration and renaming",
        "Creation of initial repository files",
        "Integration with Collab.codes project settings",
        "Integration with Collab.codes organization settings"
      ],
      "constraints": [
        "Project names must start with a letter and contain only letters, numbers, and underscores",
        "Requires connection to GitHub or GitLab",
        "Requires user login for the selected provider",
        "Requires an organization to be selected",
        "Relies on mls.stor.LOCALPROJECTNUMBER for local project identification",
        "Assumes a design system file exists for migration",
        "IndexedDB is used for tempObjects"
      ]
    }
  }
}
    