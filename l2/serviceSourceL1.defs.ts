/// <mls shortName="serviceSourceL1" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "serviceSourceL1",
    "type": "widget",
    "group": "other",
    "tags": [
      "editor",
      "monaco",
      "file-management",
      "typescript"
    ]
  },
  "references": {
    "widgets": [
    ],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "activeModels",
      "msize",
      "isNewFile",
      "loading"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_utilsLit",
      "./_100554_libCommom",
      "./_100554_serviceBase"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct use of localStorage without namespacing or expiration policy.",
      "Potential exposure of error messages via setError(e.message).",
      "No sanitization for dynamic content in error handling."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [
      "Case 'updatedOnServer' in onMLSEvents switch does nothing.",
      "Default case in onMLSEvents switch is empty string."
    ],
    "accessibility": [
      "No ARIA attributes or accessibility features in HTML.",
      "Component renders only <mls-editor-100529> in slot, accessibility depends on that widget.",
      "No keyboard navigation or focus management detected."
    ],
    "i18nWarnings": [
      "Tooltip 'Source L1' and menu text 'L2 - widget1' are hardcoded and not internationalized."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 7,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Widget for managing source files at level 1 in the Collab.codes system. Integrates Monaco editor, handles file actions (new, open, delete, undo, rename, clone), and manages editor state and events.",
    "goal": "Provide a robust, extensible, and user-friendly source file editor for level 1 files, supporting all major file operations and seamless integration with the Collab.codes event and storage system.",
    "userStories": [
      {
        "story": "As a user, I want to create, open, rename, clone, and delete source files so that I can manage my project files efficiently.",
        "derivedRequirements": [
          {
            "description": "Implement file action handlers for new, open, delete, undo, rename, and clone.",
            "done": true,
            "comment": "All handlers are present and integrated with event system."
          },
          {
            "description": "Integrate Monaco editor for code editing.",
            "done": true,
            "comment": "Monaco editor is initialized and managed."
          },
          {
            "description": "Persist file state and content in local storage and backend.",
            "done": true,
            "comment": "Local storage and backend sync implemented."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Add support for additional file types beyond .ts, .d.ts, .html, .less.",
        "done": false,
        "comment": "Currently limited to main types; extensibility possible."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Occasional loss of editor state after file rename.",
        "done": false,
        "comment": "Potential issue with model mapping after rename."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Improve accessibility by adding ARIA attributes and keyboard navigation.",
        "done": false,
        "comment": "No accessibility features detected in current implementation."
      },
      {
        "description": "Internationalize all user-facing strings.",
        "done": false,
        "comment": "Hardcoded strings present; i18n not implemented."
      }
    ]
  },
  "textToEmbedding": [
    "This widget manages source files at level 1, integrating Monaco editor and handling file actions like new, open, delete, undo, rename, and clone.",
    "Its goal is to provide a robust, extensible, and user-friendly source file editor for Collab.codes, supporting all major file operations and seamless event integration.",
    "User requests include support for more file types, improved accessibility, and full internationalization of UI strings.",
    "Known issues include possible editor state loss after file rename and lack of ARIA/keyboard accessibility."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9840,version:2"
}
    