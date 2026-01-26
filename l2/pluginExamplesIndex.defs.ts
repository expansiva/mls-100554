/// <mls fileReference="_100554_/l2/pluginExamplesIndex.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100554_/l2/pluginExamplesIndex.ts",
    "componentType": "pluginUI",
    "componentScope": "appFrontEnd",
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "_100554_pluginSiteMonitorDashboardErrors",
      "_100554_pluginSiteMonitorDashboardActiveUsers",
      "_100554_pluginSiteMonitorDashboardExpenses",
      "_100554_pluginSiteMonitorDashboardRegionalLatency",
      "_100554_pluginSiteMonitorDashboardResponseTime",
      "_100554_pluginSiteMonitorDashboardSales",
      "_100554_pluginSiteMonitorDashboardSpikes"
    ],
    "imports": [
      {
        "ref": "/_100554_/l2/pluginBaseIndex.js",
        "dependencies": [
          {
            "name": "PluginBaseIndex",
            "type": "class"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin index for example dashboard widgets",
      "businessCapabilities": [
        "Provides various dashboard widgets for monitoring site performance and sales."
      ],
      "technicalCapabilities": [
        "Registers menu actions for dashboard widgets."
      ],
      "implementedFeatures": [
        "Dashboard menu registration for site monitoring errors",
        "Dashboard menu registration for active users",
        "Dashboard menu registration for expenses",
        "Dashboard menu registration for regional latency",
        "Dashboard menu registration for response time",
        "Dashboard menu registration for sales",
        "Dashboard menu registration for spikes"
      ]
    }
  }
}
    