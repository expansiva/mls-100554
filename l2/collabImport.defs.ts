/// <mls shortName="collabImport" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "collabImport",
    "type": "lib",
    "group": "other",
    "tags": [
      "dynamic-import",
      "collab.codes",
      "module-loader"
    ]
  },
  "references": {
    "widgets": [],
    "plugins": [],
    "statesRO": [],
    "statesRW": [],
    "statesWO": [],
    "imports": []
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Dynamic import with user-controlled URL (import(/* @vite-ignore */ url)) can be risky if opts is not strictly validated. Ensure only trusted sources are used.",
      "Direct access to global 'mls' object; if mls is not sandboxed, could be a vector for privilege escalation."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "No interactive elements in HTML; only a heading. No accessibility issues detected.",
      "No aria-* attributes or tabindex present, but not required for static heading."
    ],
    "i18nWarnings": [
      "Static heading <h1>_100554_collabImport</h1> is not internationalized. Consider using i18n for user-facing text."
    ],
    "correctness": 9,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "A utility library for dynamically importing modules in the Collab.codes environment, supporting both development and production modes. Handles caching, versioning, and static/dynamic import logic.",
    "goal": "Enable seamless, version-aware dynamic module loading for Collab.codes projects, optimizing for both development and production workflows.",
    "userStories": [
      {
        "story": "As a developer, I want to import modules dynamically based on project, folder, and shortName, so that I can load code on demand and support hot-reloading in development.",
        "derivedRequirements": [
          {
            "description": "Implement a function that builds a moduleId from project, folder, and shortName."
          },
          {
            "description": "Support both static and versioned dynamic imports depending on development mode."
          },
          {
            "description": "Cache module promises to avoid redundant imports and support hot-reload."
          }
        ]
      },
      {
        "story": "As a user, I want the system to load the latest version of a module if it has changed, so I always get the most up-to-date code.",
        "derivedRequirements": [
          {
            "description": "Check file version using CRC and reload module if version differs."
          }
        ]
      }
    ],
    "userRequestsFeatures": [],
    "userRequestsBugs": [],
    "userRequestsEnhancements": []
  },
  "textToEmbedding": [
    "This library enables dynamic, version-aware module imports for Collab.codes projects.",
    "It supports both development (hot-reload) and production (static import) modes, with caching and version checks.",
    "The main goal is to streamline module loading, ensuring users always get the latest code without manual refresh.",
    "Accessibility is not a concern here, but security around dynamic imports should be reviewed."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9756,version:2"
}
    