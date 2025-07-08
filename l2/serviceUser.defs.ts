/// <mls shortName="serviceUser" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "serviceUser",
    "type": "widget",
    "group": "other",
    "tags": [
      "lit",
      "user",
      "plugin",
      "collab"
    ]
  },
  "references": {
    "widgets": [
      "collab-panel-100554",
      "collab-panel-item-100554"
    ],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "activeTab",
      "plugin"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_serviceBase",
      "./_100554_libCommom",
      "./_100554_collabPanel",
      "./_100554_collabPanelItem"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "No explicit aria-* attributes or tabindex found. Consider adding ARIA roles and keyboard navigation for better accessibility.",
      "The widget uses semantic HTML for structure, but lacks explicit accessibility enhancements."
    ],
    "i18nWarnings": [
      "Tooltip 'User' in IService.details is not internationalized.",
      "Tab text 'Settings' is not internationalized."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Widget for managing user-related plugins and settings in a Collab.codes environment. Allows users to explore and add plugins, and displays user settings grouped by category.",
    "goal": "Provide a user interface for managing user plugins and settings, supporting extensibility and internationalization.",
    "userStories": [
      {
        "story": "As a user, I want to view and manage my available plugins and settings in a single panel.",
        "derivedRequirements": [
          {
            "description": "Display a list of user plugins grouped by category.",
            "done": true,
            "comment": "Implemented in renderSettings and setMyData."
          },
          {
            "description": "Allow users to activate a plugin by clicking on it.",
            "done": true,
            "comment": "Handled in firstUpdated and updated lifecycle methods."
          }
        ]
      },
      {
        "story": "As a user, I want the interface to be available in multiple languages.",
        "derivedRequirements": [
          {
            "description": "Provide i18n support for interface strings.",
            "done": true,
            "comment": "Implemented for some strings, but not all (see i18nWarnings)."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Add support for more tabs beyond 'Settings'.",
        "done": false,
        "comment": "Currently only 'Settings' tab is implemented."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Internationalize all user-facing strings, including tooltips and tab labels.",
        "done": false,
        "comment": "Partial i18n support; some strings are hardcoded."
      }
    ]
  },
  "textToEmbedding": [
    "This widget manages user plugins and settings in a Collab.codes environment.",
    "It displays user plugins grouped by category and allows activation of plugins.",
    "Internationalization is partially supported; some interface strings are not translated.",
    "Future improvements include more tabs and full i18n coverage for all user-facing text."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9808,version:2"
}
    