/// <mls shortName="pluginSiteMonitorDashboardRegionalLatency" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginSiteMonitorDashboardRegionalLatency",
    "type": "plugin",
    "group": "site-monitor",
    "tags": [
      "dashboard",
      "monitoring",
      "latency",
      "regional"
    ]
  },
  "references": {
    "widgets": [
      "wc-chart-100554"
    ],
    "plugins": [],
    "statesRO": [],
    "statesRW": [
      "filter",
      "chartDataBar",
      "autoPrepare",
      "mode"
    ],
    "statesWO": [],
    "imports": [
      "lit",
      "lit/decorators.js",
      "_100554_pluginBaseModule",
      "_100554_wcChart"
    ]
  },
  "codeInsights": {
    "todos": [],
    "securityWarnings": [
      "Direct innerHTML usage in prepare() method with only basic HTML escaping; risk of XSS if dataBar is ever user-controlled.",
      "Hardcoded chart data in prepare() method; no validation or sanitization if dynamic data is introduced."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [
      "Commented-out map chart initialization code in prepare() method."
    ],
    "accessibility": [
      "SVG icon lacks aria-label or role attributes for assistive technologies.",
      "Select dropdown is missing a label or aria-label for screen readers.",
      "No keyboard navigation or focus management for chart or filter.",
      "No alt text or description for SVG icon."
    ],
    "i18nWarnings": [
      "Chart title 'Regional Latency (ms)' is hardcoded and should be internationalized.",
      "Axis label 'Response Time (ms)' is hardcoded and should be internationalized.",
      "Region names in chart data are hardcoded and should be internationalized.",
      "Select option labels ('Today', 'Week', 'mounth', 'All Time') are hardcoded and should be internationalized.",
      "Typo in select option: 'mounth' should be 'month'."
    ],
    "correctness": 8,
    "errorHandling": 6,
    "readability": 8,
    "maintainability": 7
  },
  "auth": {},
  "planning": {
    "generalDescription": "A dashboard plugin that monitors and visualizes network latency across different geographic regions using interactive charts.",
    "goal": "Provide real-time monitoring of latency performance across global regions to help optimize infrastructure and improve user experience worldwide.",
    "userStories": [
      {
        "story": "As a system administrator, I want to monitor latency across different regions so I can identify performance bottlenecks and optimize server placement.",
        "derivedRequirements": [
          {
            "description": "Display regional latency data in an interactive bar chart",
            "done": true,
            "comment": "Implemented with ECharts integration"
          },
          {
            "description": "Show statistical markers (min, max, average) for latency analysis",
            "done": true,
            "comment": "Implemented with markPoint and markLine features"
          }
        ]
      },
      {
        "story": "As a DevOps engineer, I want to filter latency data by time periods so I can analyze trends and patterns over different timeframes.",
        "derivedRequirements": [
          {
            "description": "Implement time period filtering (today, week, month, all time)",
            "done": true,
            "comment": "Filter dropdown implemented with change handler"
          },
          {
            "description": "Update chart data based on selected time period",
            "done": false,
            "comment": "Filter changes trigger prepare() but actual data filtering logic not implemented"
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Add world map visualization for geographic latency representation",
        "done": false,
        "comment": "Map container exists but implementation is commented out"
      },
      {
        "description": "Implement real-time data updates from monitoring APIs",
        "done": false,
        "comment": "Currently uses static mock data"
      },
      {
        "description": "Add export functionality for latency reports",
        "done": false
      },
      {
        "description": "Include alerting thresholds for high latency regions",
        "done": false
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Fix typo in select option 'mounth' should be 'month'",
        "done": false,
        "comment": "Spelling error in HTML template"
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Add accessibility improvements for screen readers",
        "done": false,
        "comment": "Missing aria-labels and proper semantic structure"
      },
      {
        "description": "Implement internationalization for all user-facing text",
        "done": false,
        "comment": "Multiple hardcoded strings need i18n support"
      },
      {
        "description": "Add loading states and error handling for chart rendering",
        "done": false,
        "comment": "No error handling for chart initialization failures"
      },
      {
        "description": "Optimize chart rendering performance for large datasets",
        "done": false
      }
    ]
  },
  "textToEmbedding": [
    "This plugin provides a dashboard for monitoring and visualizing network latency by region.",
    "It enables real-time analysis of latency data, with interactive charts and filtering by time period.",
    "Future improvements include map visualization, real-time API data, export features, and alerting for high latency.",
    "Accessibility, internationalization, and error handling enhancements are also planned for better usability and global reach."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9800,version:2"
}
    