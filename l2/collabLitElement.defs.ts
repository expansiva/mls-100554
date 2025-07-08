/// <mls shortName="collabLitElement" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "collabLitElement",
    "type": "lib",
    "group": "Collab.codes Core",
    "tags": [
      "lit",
      "base",
      "state",
      "collab"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "globalState.globalVariation"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_collabState"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct DOM manipulation in loadStyle (document.head, createElement). Ensure CSS injection is safe and not vulnerable to XSS if css is user-controlled."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "No interactive elements in HTML. No accessibility issues detected in this base class. If extended, ensure focus management and ARIA attributes are handled in child components."
    ],
    "i18nWarnings": [
      "Error message in getMessageKey: 'Error Message not valid for international' should be internationalized if i18n is enabled."
    ],
    "correctness": 9,
    "errorHandling": 8,
    "readability": 9,
    "maintainability": 9
  },
  "planning": {
    "generalDescription": "A base class for Collab.codes components using LitElement, with integrated global state and dynamic style injection. Provides helpers for i18n message key selection and style management.",
    "goal": "Facilitate the creation of consistent, state-aware, and internationalizable web components for Collab.codes projects.",
    "userStories": [
      {
        "story": "As a developer, I want to extend a base LitElement with Collab.codes state and i18n helpers, so I can build consistent components faster.",
        "derivedRequirements": [
          {
            "description": "Expose global state properties as reactive properties in the base class.",
            "done": true,
            "comment": "globalVariation is exposed and reactive."
          },
          {
            "description": "Provide a method for safe dynamic style injection.",
            "done": true,
            "comment": "loadStyle method implemented with checks."
          },
          {
            "description": "Include a helper for selecting the correct i18n message key based on document language.",
            "done": true,
            "comment": "getMessageKey implemented and exported."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Allow dynamic switching of global state properties at runtime.",
        "done": false,
        "comment": "Currently only globalVariation is exposed; consider making state binding more generic."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Style injection may overwrite styles if multiple components use the same tag name.",
        "done": false,
        "comment": "Style tag uses tagName as id; risk of collision if reused."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Add support for shadow DOM opt-in for advanced use cases.",
        "done": false,
        "comment": "Currently, createRenderRoot disables shadow DOM for all children."
      }
    ]
  },
  "textToEmbedding": [
    "This library provides a base LitElement class for Collab.codes, integrating global state and i18n helpers.",
    "It enables consistent, state-aware, and internationalizable web components with dynamic style injection.",
    "The code includes a method for safe CSS injection, but warns about possible style collisions and XSS risks.",
    "Future improvements include more generic state binding and optional shadow DOM support."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9772,version:2"
}
    