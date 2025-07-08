/// <mls shortName="pluginSystemPrivacyPolicy" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginSystemPrivacyPolicy",
    "type": "plugin",
    "group": "other",
    "tags": [
      "privacy",
      "policy",
      "static",
      "i18n"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [],
    "statesRW": [],
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
      "Use of unsafeHTML to render HTML from i18n messages. If message content is not strictly controlled, this could lead to XSS vulnerabilities. In this case, the HTML is hardcoded and not user-supplied, so risk is low, but future dynamic content should be carefully validated."
    ],
    "unusedImports": [
      "unsafeHTML"
    ],
    "deadCodeBlocks": [
      "The async init() method is empty and only called by prepare(), which itself is only called if autoPrepare is true. If autoPrepare is always false, these methods are dead code."
    ],
    "accessibility": [
      "No explicit accessibility attributes (aria-*) are present in the rendered HTML. The policy content uses semantic HTML (h1, h2, ul, li, p), which is good for accessibility. However, there is no focus management or keyboard navigation support, and no tabindex is set. If this plugin is modal or overlay, consider managing focus.",
      "Contrast between text and background is likely sufficient due to color tokens, but should be verified in the final theme."
    ],
    "i18nWarnings": [
      "All user-facing strings are properly internationalized via the messages object. No hardcoded untranslated strings found."
    ],
    "correctness": 9,
    "errorHandling": 7,
    "readability": 9,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "This plugin displays the privacy policy for the Collab Codes platform. It supports both English and Portuguese, rendering the appropriate content based on the user's language. The policy is static and does not interact with user data or backend services.",
    "goal": "Provide users with clear, accessible information about data privacy and rights, in compliance with legal requirements.",
    "userStories": [
      {
        "story": "As a user, I want to read the privacy policy in my preferred language so that I understand how my data is handled.",
        "derivedRequirements": [
          {
            "description": "Display privacy policy content in English and Portuguese based on user language.",
            "done": true,
            "comment": "Implemented via messages object and getMessageKey."
          },
          {
            "description": "Ensure the policy is accessible and readable on all devices.",
            "done": true,
            "comment": "Uses semantic HTML and responsive font tokens."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Allow users to print or download the privacy policy.",
        "done": false,
        "comment": "Not implemented. Could be added as a button or link."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Add support for more languages.",
        "done": false,
        "comment": "Currently only English and Portuguese are supported."
      },
      {
        "description": "Highlight recent changes in the policy.",
        "done": false,
        "comment": "No visual indication of updates or changes."
      }
    ]
  },
  "textToEmbedding": [
    "This plugin displays the Collab Codes privacy policy in English and Portuguese. It ensures users can read about data collection, usage, and rights in their preferred language. The content is static, rendered with semantic HTML for accessibility.",
    "The main goal is to provide clear, accessible privacy information and comply with legal requirements. The plugin does not interact with user data or backend services, focusing solely on information display.",
    "Future requests include print/download options and support for more languages. Enhancements like highlighting recent changes are also suggested.",
    "No bugs are currently reported. The code is readable and maintainable, with minor security considerations due to unsafeHTML usage, but content is hardcoded and safe."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9816,version:2"
}
    