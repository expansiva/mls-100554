/// <mls shortName="serviceHistories" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "serviceHistories",
    "type": "widget",
    "group": "service",
    "tags": [
      "lit",
      "monaco",
      "diff-editor",
      "history",
      "mls"
    ]
  },
  "references": {
    "widgets": [
      "service-histories-100554",
      "mls-editor-100529"
    ],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_serviceBase"
    ],
    "statesRO": [
      "visible",
      "position",
      "msize",
      "fileInfo",
      "hashOriginal",
      "hashModified"
    ],
    "statesRW": [
      "msize"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct use of JSON.parse on event data (ev.desc) without validation may be risky if event sources are not trusted.",
      "No explicit sanitization for content loaded into monaco editor, but usage context is code diff, so risk is low."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "Custom element <service-histories-100554> does not expose ARIA attributes.",
      "No keyboard navigation or focus management is implemented for the widget.",
      "The <h3> in the HTML has cursor:pointer but no tabindex or role=button, which may hinder accessibility."
    ],
    "i18nWarnings": [
      "Tooltip and menu titles ('Histories', 'Start') are hardcoded and not internationalized.",
      "Some error messages and UI strings are not covered by i18n (e.g., 'Start', 'Histories')."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Widget for displaying and comparing file histories using Monaco diff editor in a Collab.codes service context. Handles selection events, loads file versions, and manages editor state.",
    "goal": "Allow users to view and compare different versions of files (histories) in a collaborative coding environment, providing a read-only diff view.",
    "userStories": [
      {
        "story": "As a developer, I want to select a file and see its history so I can compare changes over time.",
        "derivedRequirements": [
          {
            "description": "Listen to history selection events and load the corresponding file versions.",
            "done": true,
            "comment": "Implemented via onSelectHistories and event listeners."
          },
          {
            "description": "Display a diff editor with original and modified file contents.",
            "done": true,
            "comment": "Uses Monaco diff editor for this purpose."
          }
        ]
      },
      {
        "story": "As a user, I want to know when no history is selected or when loading is in progress.",
        "derivedRequirements": [
          {
            "description": "Show loading and empty state messages using i18n.",
            "done": true,
            "comment": "Implemented with message_pt and message_en."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Add support for more file types in the diff editor.",
        "done": false,
        "comment": "Currently supports .ts, .html, .less."
      },
      {
        "description": "Allow users to copy content from the diff view.",
        "done": false,
        "comment": "Diff editor is read-only; copy support not explicit."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Sometimes the editor does not update when switching histories quickly.",
        "done": false,
        "comment": "Potential race condition if multiple async loads overlap."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Improve accessibility for keyboard and screen readers.",
        "done": false,
        "comment": "No ARIA or keyboard support currently."
      },
      {
        "description": "Internationalize all UI strings, including tooltips and menu items.",
        "done": false,
        "comment": "Some strings are hardcoded."
      }
    ]
  },
  "textToEmbedding": [
    "This widget displays and compares file histories using a Monaco diff editor.",
    "It listens to selection events, loads file versions, and manages editor state for collaborative coding.",
    "Current limitations include partial i18n, limited accessibility, and support for only a few file types.",
    "Future improvements focus on accessibility, full internationalization, and enhanced file type support."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9828,version:2"
}
    