/// <mls shortName="serviceSave" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "serviceSave",
    "type": "widget",
    "group": "other",
    "tags": [
      "collab",
      "save",
      "pullrequest",
      "branch",
      "fork"
    ]
  },
  "references": {
    "widgets": [
    ],
    "plugins": [
    ],
    "statesRO": [
      "mls.stor.files",
      "mls.actual[5].project",
      "mls.l5.actualOrg",
      "mls.stor.orgs",
      "mls.stor.others",
      "mls.stor.localDB",
      "mls.stor.cache",
      "mls.editor.getModels",
      "mls.editor.deleteModels",
      "mls.stor.getKeyToFiles",
      "mls.stor.localStor",
      "mls.stor.setContents",
      "mls.stor.files[key]",
      "mls.stor.localStor.setContent",
      "mls.stor.files[key].versionRef",
      "mls.stor.files[key].isLocalVersionOutdated",
      "mls.stor.files[key].newVersionRefIfOutdated"
    ],
    "statesRW": [
      "this.freeToSave",
      "this.itens",
      "this.otherProjects",
      "this.error",
      "this.owner",
      "this.repo",
      "this.branch",
      "this.mainowner",
      "this.mainrepo",
      "this.mainbranch",
      "this.scenery",
      "this.loading",
      "this.forceSaveL5ProjectFile",
      "this.arrayRollback",
      "this.isRemovedFork"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_serviceBase",
      "./_100554_collabIcons",
      "./_100554_saveAddBranch",
      "./_100554_libCommom",
      "./_100554_libProjectConfig"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct use of unsafeHTML in render methods (potential XSS risk if not sanitized).",
      "Direct access to window.collabMessages (could be abused if not controlled).",
      "Direct use of localStorage for storing sensitive info (InfoCurrentDriver)."
    ],
    "unusedImports": [
      "css",
      "repeat",
      "initServiceSaveaddBranch"
    ],
    "deadCodeBlocks": [
      "onSave_withOutPullRequest is not called anywhere (legacy/future code)."
    ],
    "accessibility": [
      "Buttons and inputs have visible labels and are keyboard accessible.",
      "No explicit aria-* attributes found; consider adding for better screen reader support.",
      "Color contrast appears sufficient, but check for users with color blindness.",
      "Tabindex not set; default navigation should work, but explicit management may help complex trees."
    ],
    "i18nWarnings": [
      "Some button labels and error messages are hardcoded in English (e.g., 'Fork', 'Change', 'undo').",
      "SVG titles and tooltips are not internationalized."
    ],
    "correctness": 8,
    "errorHandling": 8,
    "readability": 7,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "Widget for saving project files in Collab.codes, handling pull requests, forks, and branch management. Integrates with project structure, permissions, and error verification.",
    "goal": "Allow users to save, fork, and submit pull requests for project files with proper permission and error handling.",
    "userStories": [
      {
        "story": "As a user, I want to save my project changes and submit them for review via pull requests.",
        "derivedRequirements": [
          {
            "description": "User can select files to save and provide a commit message.",
            "done": true,
            "comment": "Implemented via renderItens and onSave."
          },
          {
            "description": "User can create a fork if lacking write access.",
            "done": true,
            "comment": "Handled in createFork and renderBlockScenery."
          },
          {
            "description": "User receives feedback on errors or permission issues.",
            "done": true,
            "comment": "Error messages and scenery blocks implemented."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Support for saving directly to the main repository without pull requests.",
        "done": false,
        "comment": "onSave_withOutPullRequest exists but is not active."
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Improve accessibility with ARIA attributes and better keyboard navigation.",
        "done": false,
        "comment": "Accessibility is basic; ARIA and tabindex missing."
      },
      {
        "description": "Internationalize all UI strings, including tooltips and SVG titles.",
        "done": false,
        "comment": "Some strings are still hardcoded."
      }
    ]
  },
  "textToEmbedding": [
    "This widget enables users to save project files, manage branches, and submit pull requests in Collab.codes.",
    "It supports forking when write access is missing and provides error feedback and permission checks.",
    "Future enhancements include direct save to main repo, improved accessibility, and full internationalization.",
    "The component is central to collaborative workflows, ensuring safe, traceable, and permission-aware file operations."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9752,version:2"
}
    