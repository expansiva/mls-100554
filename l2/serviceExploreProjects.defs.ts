/// <mls shortName="serviceExploreProjects" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "serviceExploreProjects",
    "type": "widget",
    "group": "other",
    "tags": [
      "lit",
      "project-management",
      "explore",
      "collab.codes"
    ]
  },
  "references": {
    "widgets": [
      "service-explore-projects-100554"
    ],
    "plugins": [
      "plugin-create-new-project-100554"
    ],
    "statesRO": [
      "mls.stor.orgs",
      "mls.l5.getProjectSettings",
      "mls.l5.getProjectOrgIndex",
      "mls.actualLevel",
      "mls.stor.server.loadProjectInfoIfNeeded",
      "mls.stor.server.unzipSourcesIfNeeded"
    ],
    "statesRW": [
      "this.state.history",
      "this.state.orgs",
      "this.state.projectSelected",
      "this.lastPrjId",
      "this.activeTab",
      "this.currentScenario",
      "this.projectCreated",
      "this.projectCreatedNumber"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "./_100554_serviceBase",
      "./_100554_libCommom",
      "./_100554_pluginCreateNewProject"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct use of localStorage for storing project details/history. Consider possible XSS or data tampering if user input is not sanitized.",
      "No sanitization for project/org names before rendering in HTML. If backend is not trusted, risk of XSS.",
      "No explicit check for user permissions before accessing or mutating project/org data."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [
      "Commented-out code in getOrgsAndProjects (legacy logic for projectDriver/projectURL)."
    ],
    "accessibility": [
      "Buttons and inputs have visible labels and placeholders.",
      "No explicit aria-* attributes or roles found; consider adding for better screen reader support.",
      "Keyboard navigation is possible for inputs and buttons, but no tabindex or focus management.",
      "Color contrast appears sufficient, but verify with actual CSS variables in production."
    ],
    "i18nWarnings": [
      "Some hardcoded strings in renderExplore (e.g., 'Explore others projects , in development').",
      "History section title is hardcoded as 'History' in renderHistory.",
      "Filter input placeholder is hardcoded as 'Filter' in renderSelectProject."
    ],
    "correctness": 8,
    "errorHandling": 7,
    "readability": 8,
    "maintainability": 8
  },
  "planning": {
    "generalDescription": "Widget for exploring and managing projects in Collab.codes. Allows users to view, filter, and select projects from organizations, view project history, and create new projects. Integrates with the platform's event and storage systems.",
    "goal": "Provide an intuitive interface for users to explore, select, and manage projects, including history and creation, within the Collab.codes ecosystem.",
    "userStories": [
      {
        "story": "As a user, I want to see a list of my organizations and their projects so that I can quickly select and manage my work.",
        "derivedRequirements": [
          {
            "description": "Display organizations and their projects in a structured list."
          },
          {
            "description": "Allow filtering of projects by name."
          }
        ]
      },
      {
        "story": "As a user, I want to view my recently accessed projects for quick access.",
        "derivedRequirements": [
          {
            "description": "Maintain and display a history of selected projects."
          }
        ]
      },
      {
        "story": "As a user, I want to create a new project from the interface.",
        "derivedRequirements": [
          {
            "description": "Integrate with the project creation plugin."
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Add support for project search/filtering.",
        "done": true,
        "comment": "Implemented via _filterProjects method and input."
      },
      {
        "description": "Allow users to view project details directly from the list.",
        "done": true,
        "comment": "Implemented via firedetail and detail button."
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Project history sometimes does not update after selection.",
        "done": false,
        "comment": "Needs further investigation; logic for updating history is present but may have edge cases."
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Improve accessibility with ARIA attributes and better keyboard navigation.",
        "done": false,
        "comment": "No ARIA attributes present; keyboard navigation is basic."
      },
      {
        "description": "Internationalize all user-facing strings.",
        "done": false,
        "comment": "Some strings are hardcoded and not covered by i18n."
      }
    ]
  },
  "textToEmbedding": [
    "This widget enables users to explore, select, and manage projects within Collab.codes.",
    "It supports viewing organizations, filtering projects, accessing project history, and creating new projects.",
    "Some user requests include improved accessibility and full internationalization of all UI strings.",
    "There is a known issue with project history updates and some hardcoded strings not covered by i18n."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9752,version:2"
}
    