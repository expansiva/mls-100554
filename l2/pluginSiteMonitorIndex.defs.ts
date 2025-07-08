/// <mls shortName="pluginSiteMonitorIndex" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginSiteMonitorIndex",
    "type": "plugin",
    "group": "Site Monitoring",
    "tags": [
      "monitoring",
      "dashboard",
      "analytics"
    ]
  },
  "references": {
    "widgets": [
      "_100554_pluginSiteMonitorDashboardErrors",
      "_100554_pluginSiteMonitorDashboardActiveUsers",
      "_100554_pluginSiteMonitorDashboardSpikes",
      "_100554_pluginSiteMonitorDashboardResponseTime",
      "_100554_pluginSiteMonitorDashboardRegionalLatency",
      "_100554_pluginSiteMonitorDashboardSales"
    ],
    "plugins": [],
    "statesRO": [],
    "statesRW": [],
    "statesWO": [],
    "imports": [
      "./_100554_pluginBaseIndex"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "HTML file contains basic content but lacks proper semantic structure and accessibility attributes.",
      "Missing aria-labels, proper heading hierarchy, and keyboard navigation considerations."
    ],
    "i18nWarnings": [],
    "correctness": 8,
    "errorHandling": 6,
    "readability": 9,
    "maintainability": 8
  },
  "auth": {
    "view": [
      "admin",
      "editor",
      "author"
    ],
    "edit": [
      "admin",
      "editor",
      "author"
    ],
    "use": [
      "admin",
      "editor",
      "author"
    ],
    "restrictReason": "Site monitoring requires elevated permissions to access system metrics and analytics data"
  },
  "planning": {
    "generalDescription": "Plugin index that provides site monitoring functionality through various dashboard widgets",
    "goal": "Centralize site monitoring capabilities including error tracking, user analytics, performance metrics, and sales data",
    "userStories": [
      {
        "story": "As an admin, I want to monitor site errors so I can quickly identify and resolve issues",
        "derivedRequirements": [
          {
            "description": "Implement error dashboard widget with real-time error tracking",
            "done": true,
            "comment": "Widget _100554_pluginSiteMonitorDashboardErrors is registered"
          }
        ]
      },
      {
        "story": "As an editor, I want to see active users on the site so I can understand current engagement",
        "derivedRequirements": [
          {
            "description": "Create active users dashboard showing real-time user activity",
            "done": true,
            "comment": "Widget _100554_pluginSiteMonitorDashboardActiveUsers is registered"
          }
        ]
      },
      {
        "story": "As an admin, I want to monitor traffic spikes so I can ensure system stability",
        "derivedRequirements": [
          {
            "description": "Develop spike detection dashboard for traffic monitoring",
            "done": true,
            "comment": "Widget _100554_pluginSiteMonitorDashboardSpikes is registered"
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Add response time monitoring across different regions",
        "done": true,
        "comment": "Both response time and regional latency widgets are implemented"
      },
      {
        "description": "Include sales metrics in monitoring dashboard",
        "done": true,
        "comment": "Sales dashboard widget is registered"
      }
    ],
    "userRequestsBugs": [],
    "userRequestsEnhancements": [
      {
        "description": "Consolidate duplicate response time widgets in different categories",
        "done": false,
        "comment": "Response time widget appears in both Site and Tools categories - consider removing duplication"
      },
      {
        "description": "Add proper HTML content and styling for the plugin index page",
        "done": false,
        "comment": "Current HTML is placeholder content, needs actual plugin interface"
      }
    ]
  },
  "textToEmbedding": [
    "This plugin centralizes site monitoring via dashboard widgets for errors, users, spikes, and sales.",
    "It aims to provide real-time analytics and performance metrics for admins, editors, and authors.",
    "Future improvements include removing duplicate widgets and enhancing the HTML interface.",
    "No critical bugs are reported; all main features are implemented as requested by users."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9844,version:2"
}
    