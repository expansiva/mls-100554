/// <mls shortName="pluginNewProjectLog" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "{{folder}}",
    "shortName": "pluginNewProjectLog",
    "type": "plugin",
    "group": "other",
    "tags": [
      "lit",
      "log",
      "status",
      "ui"
    ]
  },
  "references": {
    "plugins": [],
    "widgets": [],
    "statesRO": [],
    "statesRW": [
      "text",
      "status"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_collabIcons",
      "./_100554_collabLitElement"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [
      "css"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "No aria-* attributes present. Consider adding aria-live for log updates.",
      "No tabindex or keyboard navigation issues detected.",
      "Contrast appears sufficient due to use of theme variables.",
      "SVG icons are used, but no title/desc for screen readers."
    ],
    "i18nWarnings": [
      "The 'text' property is rendered directly; ensure it is internationalized upstream if needed."
    ],
    "correctness": 9,
    "errorHandling": 7,
    "readability": 9,
    "maintainability": 9
  },
  "planning": {
    "generalDescription": "This plugin displays a log line with a status icon and message, used for project logs or process feedback. It visually indicates the current state (in progress, error, finished, waiting) with appropriate icons and colors.",
    "goal": "Provide a clear, reusable UI component for displaying status messages with visual feedback in project workflows.",
    "userStories": [
      {
        "story": "As a user, I want to see real-time status updates for project actions, so I can understand what is happening.",
        "derivedRequirements": [
          {
            "description": "Display a message and icon for each log entry reflecting its status.",
            "done": true,
            "comment": "Implemented via text and status properties."
          },
          {
            "description": "Visually differentiate between statuses (in progress, error, finished, waiting).",
            "done": true,
            "comment": "Handled via CSS and icon mapping."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Support for custom icons per status.",
        "done": false,
        "comment": "Currently uses fixed icons; extensibility could be added."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Add aria-live for better accessibility.",
        "done": false,
        "comment": "Not yet implemented."
      },
      {
        "description": "Allow for additional statuses or custom status mapping.",
        "done": false,
        "comment": "Currently limited to four statuses."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin provides a UI log line with a status icon and message, indicating process feedback.",
    "It supports four statuses: in progress, error, finished, and waiting, each with a visual icon and color.",
    "Accessibility could be improved with aria-live and better screen reader support. Custom icons and statuses are potential enhancements.",
    "The component is intended for real-time project logs, offering clear visual feedback for workflow actions."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9764,version:2"
}
    