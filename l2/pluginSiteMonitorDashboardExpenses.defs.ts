/// <mls shortName="pluginSiteMonitorDashboardExpenses" project="100554" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
  "meta": {
    "projectId": 100554,
    "folder": "",
    "shortName": "pluginSiteMonitorDashboardExpenses",
    "type": "plugin",
    "group": "dashboard",
    "tags": [
      "monitoring",
      "expenses",
      "visualization",
      "chart"
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
      "chartData",
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
      "Direct innerHTML usage in prepare() method with only basic HTML escaping. If chartData ever contains user-controlled input, this could be a vector for XSS.",
      "Dynamic data injection into HTML template could be vulnerable if escapeHTML function is insufficient for all edge cases."
    ],
    "unusedImports": [],
    "deadCodeBlocks": [],
    "accessibility": [
      "Select dropdown lacks aria-label or accessible labeling for screen readers.",
      "Chart component likely not accessible to screen readers; lacks ARIA attributes.",
      "No keyboard navigation or focus management for dynamic chart updates.",
      "No visible focus indicators or skip links for keyboard users."
    ],
    "i18nWarnings": [
      "Filter option 'Last 30 days' and other select options are hardcoded in English and not internationalized.",
      "Chart title and legend labels are hardcoded and not internationalized."
    ],
    "correctness": 8,
    "errorHandling": 6,
    "readability": 8,
    "maintainability": 7
  },
  "planning": {
    "generalDescription": "A dashboard plugin that displays website expense breakdown in a pie chart format, allowing users to visualize and track operational costs across different categories like CDN, EC2, Database, Domain, and Others.",
    "goal": "Provide clear visualization of monthly expenses to help users optimize budget allocation and make informed financial decisions for their website operations.",
    "userStories": [
      {
        "story": "As a website owner, I want to see a visual breakdown of my monthly expenses so that I can understand where my money is being spent",
        "derivedRequirements": [
          {
            "description": "Display expenses in a pie chart format with categories and values",
            "done": true,
            "comment": "Implemented with ECharts pie chart showing CDN, EC2, Database, Domain, and Others"
          },
          {
            "description": "Show percentage and dollar amounts for each expense category",
            "done": true,
            "comment": "Tooltip shows both dollar amount and percentage"
          }
        ]
      },
      {
        "story": "As a user, I want to filter expenses by different time periods so that I can analyze spending patterns over time",
        "derivedRequirements": [
          {
            "description": "Provide time filter options (Today, Week, Month, All Time)",
            "done": true,
            "comment": "Dropdown with filter options implemented"
          },
          {
            "description": "Update chart data based on selected time filter",
            "done": false,
            "comment": "Filter functionality exists but doesn't actually change the data - uses static mock data"
          }
        ]
      },
      {
        "story": "As a dashboard user, I want the expense chart to integrate seamlessly with other dashboard components",
        "derivedRequirements": [
          {
            "description": "Plugin should only render when scope is 'dashboard'",
            "done": true,
            "comment": "Conditional rendering based on scope property"
          },
          {
            "description": "Support both simplified and full display modes",
            "done": true,
            "comment": "Mode property controls title and legend display"
          }
        ]
      }
    ],
    "userRequestsFeatures": [
      {
        "description": "Add real-time data integration instead of static mock data",
        "done": false,
        "comment": "Currently uses hardcoded expense values"
      },
      {
        "description": "Implement export functionality for expense reports",
        "done": false
      },
      {
        "description": "Add drill-down capability to see detailed breakdown of each category",
        "done": false
      },
      {
        "description": "Include budget vs actual comparison visualization",
        "done": false
      }
    ],
    "userRequestsBugs": [
      {
        "description": "Fix typo in filter option 'mounth' should be 'month'",
        "done": false,
        "comment": "Typo in HTML option value"
      },
      {
        "description": "Time filter changes don't actually update the displayed data",
        "done": false,
        "comment": "handleChange method calls prepare() but data remains static"
      }
    ],
    "userRequestsEnhancements": [
      {
        "description": "Improve accessibility with proper ARIA labels and keyboard navigation",
        "done": false,
        "comment": "Current implementation lacks comprehensive accessibility features"
      },
      {
        "description": "Add loading states and error handling for data fetching",
        "done": false,
        "comment": "No error handling for chart rendering or data loading"
      },
      {
        "description": "Implement responsive design for mobile devices",
        "done": false,
        "comment": "Current styling may not be optimal for smaller screens"
      },
      {
        "description": "Add animation transitions when switching between time periods",
        "done": false
      }
    ]
  },
  "textToEmbedding": [
    "This plugin provides a dashboard pie chart for website expense breakdown, helping users visualize and track operational costs across categories like CDN, EC2, Database, Domain, and Others.",
    "The main goal is to offer clear monthly expense visualization, supporting budget optimization and informed financial decisions for site operations.",
    "Users have requested real-time data, export features, drill-downs, and budget vs actual comparisons. There are also requests for better accessibility, error handling, and mobile responsiveness.",
    "Known bugs include a typo in the filter and static data not updating with filter changes. Accessibility and i18n improvements are also needed."
  ],
  "embedding": "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",
  "embeddingVersion": "openai-text-embedding-3-small,len:4x512,compressed:9792,version:2"
}
    