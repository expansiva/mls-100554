/// <mls shortName="serviceProject" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "serviceProject",
    "type": "widget",
    "group": "other",
    "tags": [
      "lit",
      "plugin-management",
      "collab.codes"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "activeTab",
      "explories",
      "myData"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_serviceBase",
      "./_100554_collabIcons",
      "./_100554_libCompile",
      "./_100554_utilsLit",
      "./_100554_libCommom",
      "./_100554_collabPanel"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct use of innerHTML in loadHelpPage may expose to XSS if content is not sanitized.",
      "Use of alert in handleAddNewPlugin is not user-friendly and may be abused."
    ],
    "unusedImports": [
      "repeat"
    ],
    "deadCodeBlocks": [
      "In renderShowCase, the return '<div>No project selected</div<' is malformed and unreachable if project is falsy."
    ],
    "accessibility": [
      "No explicit aria-* attributes found. Details/summary used for disclosure, which is accessible.",
      "Button in .buttons-container is focusable and styled, but lacks aria-label for better accessibility.",
      "Keyboard navigation should be checked for plugin list and tab switching."
    ],
    "i18nWarnings": [
      "Strings like 'In development: Details showcase', 'Select a plugin', 'In development: Details plugins', 'Enabled', 'Disabled', 'No project selected', 'File ... dont's exist in selected project', 'alert('In Develpoment')' are not internationalized."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Widget for managing and exploring plugins in a Collab.codes project. Allows users to explore, showcase, administer, and add plugins, with dynamic loading and categorization.",
    "goal": "Provide an interactive interface for plugin management, exploration, and administration within a project, supporting dynamic plugin loading and user-friendly navigation.",
    "userStories": [
      {
        "story": "As a project admin, I want to explore available plugins so I can add new features to my project.",
        "derivedRequirements": [
          {
            "description": "Display a list of available plugins grouped by category.",
            "done": true,
            "comment": "Implemented in renderPlugin and groupPluginsByCategory."
          },
          {
            "description": "Allow dynamic loading and preview of plugin details.",
            "done": true,
            "comment": "Implemented in handleDetailExplorieClick and renderExplore."
          }
        ]
      },
      {
        "story": "As a user, I want to see which plugins are active or inactive.",
        "derivedRequirements": [
          {
            "description": "Show plugin status with visual indicators.",
            "done": true,
            "comment": "Status shown with color and text in plugin-status."
          }
        ]
      },
      {
        "story": "As an admin, I want to add new plugins easily.",
        "derivedRequirements": [
          {
            "description": "Provide a button to add new plugins.",
            "done": false,
            "comment": "Button exists but only shows alert; needs implementation."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Implement full add new plugin workflow.",
        "done": false,
        "comment": "Currently only alert is shown."
      },
      {
        "description": "Improve accessibility with aria-labels and keyboard navigation.",
        "done": false,
        "comment": "Accessibility is basic; improvements needed."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Fix malformed HTML in renderShowCase when no project is selected.",
        "done": false,
        "comment": "Return string is malformed and should be fixed."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Internationalize all user-facing strings.",
        "done": false,
        "comment": "Many strings are not covered by i18n."
      },
      {
        "description": "Replace alert with a user-friendly modal or notification.",
        "done": false,
        "comment": "Alerts are not ideal for UX."
      }
    ]
  },
  "textToEmbedding": [
    "This widget manages and explores plugins for Collab.codes projects. It provides tabs for exploring, showcasing, administering, and adding plugins, with dynamic loading and grouping by category.",
    "The main goal is to offer an interactive and user-friendly interface for plugin management, supporting dynamic plugin loading and clear status indicators for each plugin.",
    "Future requests include implementing the full add plugin workflow, improving accessibility, fixing minor bugs in HTML rendering, and internationalizing all user-facing strings.",
    "There are also suggestions to replace alert dialogs with better notifications and to ensure all features are accessible and user-friendly."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9812,version:2"
}
    