/// <mls shortName="pluginSystemTermsOfService" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginSystemTermsOfService",
    "type": "plugin",
    "group": "other",
    "tags": [
      "terms",
      "legal",
      "i18n",
      "static-content"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "autoPrepare"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_pluginBaseModule"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Use of unsafeHTML to render terms content. If the HTML is not strictly controlled, this can lead to XSS vulnerabilities. In this case, the HTML is static and controlled, but any future dynamic content should be sanitized."
    ],
    "unusedImports": [
      "unsafeHTML"
    ],
    "deadCodeBlocks": [
      "The private async init() method is defined but currently empty and only called by prepare()."
    ],
    "accessibility": [
      "No explicit ARIA attributes or roles are set. The rendered HTML is semantic (headings, paragraphs, lists), which is good. However, the plugin-container div could benefit from a role or aria-label for clarity.",
      "No keyboard traps or focus issues detected, but no explicit tabindex or focus management is present."
    ],
    "i18nWarnings": [
      "All user-facing strings are properly internationalized via the messages object. No hardcoded UI strings outside the i18n block."
    ],
    "correctness": 9,
    "errorHandling": 8,
    "readability": 9,
    "maintainability": 9
  },
  "planning": {
    "generalDescription": "This plugin displays the Terms of Service for the Collab Codes platform, supporting both English and Portuguese. It replaces placeholders in the terms template with system-specific data and renders the result as HTML.",
    "goal": "Provide a clear, localized, and up-to-date Terms of Service page for users, ensuring legal compliance and transparency.",
    "userStories": [
      {
        "story": "As a user, I want to read the Terms of Service in my preferred language so that I can understand my rights and obligations.",
        "derivedRequirements": [
          {
            "description": "Implement i18n support for at least English and Portuguese.",
            "done": true,
            "comment": "Implemented via messages object and language detection."
          },
          {
            "description": "Replace placeholders in the terms template with system-specific data.",
            "done": true,
            "comment": "Handled by prepareText and replaceAllOccurrences methods."
          }
        ]
      },
      {
        "story": "As an admin, I want to update the Terms of Service content and metadata easily.",
        "derivedRequirements": [
          {
            "description": "Terms content should be easily editable in the codebase.",
            "done": true,
            "comment": "Terms are defined in a static object, easy to update."
          },
          {
            "description": "Last update date and contact info should be dynamically inserted.",
            "done": true,
            "comment": "Handled via placeholders and class properties."
          }
        ]
      }
    ],
    "userRequestsFeatures": [],
    "userRequestsBugs": [],
    "userRequestsEnhancements": []
  },
  "textToEmbedding": [
    "This plugin provides a localized Terms of Service page for Collab Codes, supporting English and Portuguese. It dynamically replaces placeholders with system-specific data such as name, contact, and last update.",
    "The main goal is to ensure users can read and understand the terms in their language, with up-to-date legal and contact information. The content is static but editable in the codebase.",
    "No user feature requests, bug reports, or enhancement suggestions are currently registered for this component.",
    "Security is considered, but unsafeHTML is used for rendering static, controlled HTML. Accessibility is mostly covered by semantic HTML, but could be improved with ARIA attributes."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9820,version:2"
}
    