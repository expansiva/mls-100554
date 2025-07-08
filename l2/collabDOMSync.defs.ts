/// <mls shortName="collabDOMSync" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "collabDOMSync",
    "type": "lib",
    "group": "other",
    "tags": [
      "html-sync",
      "editor",
      "iframe",
      "utility"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [],
    "statesRW": [],
    "statesWO": [],
    "imports": [
      "./_100554_collabLitElement"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct use of window.preview and window.preview.editor/iframe can be unsafe if not validated.",
      "Direct manipulation of innerHTML (container.innerHTML = ...) in formatHtml may expose to XSS if input is not sanitized."
    ],
    "unusedImports": [
      "CollabLitElement"
    ],
    "deadCodeBlocks": [
      "clearTree3 function is defined but never called (commented out in clearTree).",
      "Commented-out code in clearTree2 and clearTree."
    ],
    "accessibility": [
      "No interactive elements or ARIA attributes in HTML. No accessibility issues detected in the provided HTML.",
      "LESS tokens provide good color contrast options, but actual usage in UI is not shown."
    ],
    "i18nWarnings": [],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 7,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "This library provides functions to synchronize and format HTML content between an editor (likely Monaco) and an iframe, supporting undo/redo and cleaning up the DOM tree for collaborative editing scenarios.",
    "goal": "Enable robust, undo-friendly HTML synchronization between a code editor and a live preview iframe, with formatting and DOM cleanup.",
    "userStories": [
      {
        "story": "As a user, I want my HTML edits in the code editor to be reflected in the live preview, and vice versa, with proper formatting and undo support.",
        "derivedRequirements": [
          {
            "description": "Implement sync() to update editor content from iframe DOM.",
            "done": true,
            "comment": "sync() is implemented and updates the editor from the iframe."
          },
          {
            "description": "Implement updateHTML() to update editor content from a given HTML string.",
            "done": true,
            "comment": "updateHTML() is implemented and supports optional formatting."
          },
          {
            "description": "Ensure formatting of HTML is consistent and readable.",
            "done": true,
            "comment": "formatHtml() provides indentation and attribute formatting."
          },
          {
            "description": "Support undo/redo in the editor when updating content.",
            "done": true,
            "comment": "setValueInModeKeepingUndo2 uses pushUndoStop and executeEdits."
          },
          {
            "description": "Clean up the DOM tree to remove unnecessary attributes before syncing.",
            "done": true,
            "comment": "clearTree and clearTree2 remove specific attributes and handle custom elements."
          }
        ]
      }
    ],
    "userRequestsFeatures": [],
    "userRequestsBugs": [],
    "userRequestsEnhancements": []
  },
  "textToEmbedding": [
    "This library enables HTML synchronization between a code editor and an iframe preview.",
    "It formats HTML, cleans up the DOM, and ensures undo/redo support for collaborative editing.",
    "Security risks include direct window access and innerHTML usage; accessibility is not directly addressed.",
    "No user feature requests or bug reports are present; the main focus is robust, maintainable HTML sync."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9816,version:2"
}
    