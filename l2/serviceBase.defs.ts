/// <mls shortName="serviceBase" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "serviceBase",
    "type": "lib",
    "group": "other",
    "tags": [
      "abstract",
      "toolbar",
      "service",
      "collab"
    ]
  },
  "references": {
    "widgets": [
      "service-base-100554"
    ],
    "imports": [
      "./_100554_stateLitElement",
      "lit/decorators.js",
      "./_100554_libCommom"
    ],
    "statesRO": [],
    "statesRW": [
      "loading",
      "visible",
      "msize",
      "position"
    ],
    "statesWO": []
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct usage of document.querySelector and closest may expose to DOM-based XSS if not carefully handled.",
      "No sanitization for attribute values set via setAttribute (e.g., error messages)."
    ],
    "unusedImports": [
      "* as libCommom from './_100554_libCommom' (partially used, only some functions called)"
    ],
    "deadCodeBlocks": [],
    "accessibility": [
      "No ARIA attributes or accessibility features present in the HTML.",
      "Component is abstract and does not render UI directly, so accessibility must be handled in subclasses."
    ],
    "i18nWarnings": [
      "Hardcoded error message in console.error in toogleBadge.",
      "Tooltip and error attributes may require i18n in subclasses."
    ],
    "correctness": 9,
    "errorHandling": 8,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "A base abstract class for Collab.codes toolbar/service widgets, providing common logic for navigation, error handling, badge toggling, fullscreen, and menu integration. Intended to be extended by concrete service implementations.",
    "goal": "Facilitate the creation of consistent, maintainable, and feature-rich toolbar services for Collab.codes, reducing code duplication and centralizing service-related logic.",
    "userStories": [
      {
        "story": "As a developer, I want to extend a base service class so I can quickly implement new toolbar services with consistent behavior.",
        "derivedRequirements": [
          {
            "description": "Provide abstract methods and properties for service details and menu."
          },
          {
            "description": "Expose navigation and badge toggling utilities."
          },
          {
            "description": "Handle attribute changes and propagate UI updates."
          }
        ]
      },
      {
        "story": "As a user, I want toolbar services to behave consistently (open, close, show badges, handle errors) regardless of the specific service.",
        "derivedRequirements": [
          {
            "description": "Centralize error and loading state handling."
          },
          {
            "description": "Ensure UI updates are reflected in navigation and badges."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Support for dynamic positioning (left/right) and fullscreen toggling.",
        "done": true,
        "comment": "Implemented via position property and setFullScreen method."
      },
      {
        "description": "Expose a method to open a service programmatically.",
        "done": true,
        "comment": "openService method implemented."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Badge toggling fails if navigation element is missing.",
        "done": false,
        "comment": "Currently logs error to console; could improve error handling."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Add ARIA and accessibility support for toolbar services.",
        "done": false,
        "comment": "No ARIA attributes present; should be addressed in subclasses."
      },
      {
        "description": "Internationalize error and tooltip messages.",
        "done": false,
        "comment": "Hardcoded strings present; i18n not implemented."
      }
    ]
  },
  "textToEmbedding": [
    "This is an abstract base class for Collab.codes toolbar/service widgets, designed to centralize navigation, error, badge, and fullscreen logic for consistent UI behavior.",
    "The main goal is to enable developers to quickly build new toolbar services with minimal duplication, ensuring all services share the same navigation and error handling patterns.",
    "There are requests for improved accessibility (ARIA support) and internationalization, as well as a known issue where badge toggling logs an error if navigation is missing.",
    "Future enhancements should focus on i18n and accessibility, while the current implementation already supports dynamic positioning, fullscreen, and programmatic service opening."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9780,version:2"
}
    