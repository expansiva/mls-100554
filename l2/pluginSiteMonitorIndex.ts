/// <mls fileReference="_100554_/l2/pluginSiteMonitorIndex.ts" enhancement="_blank" />

// To improve system performance, avoid using imports, as this file is loaded during initialization.

import { PluginBaseIndex } from '/_100554_/l2/pluginBaseIndex.js';

export class PluginSiteMonitorIndex extends PluginBaseIndex {

    public getMenus(): mls.plugin.MenuAction[] {
      return [
        {
            category: 'Site',
            scope: ['l5Panel'],
            priority: 1,
            auth: ['admin', 'editor'],
            widget: '_100555_/l2/pluginSiteMonitorDashboard/pluginErrors'
        },
        {
            category: 'Site',
            scope: ['l5Panel'],
            auth: ['admin', 'editor'],
            widget: '_100555_/l2/pluginSiteMonitorDashboard/pluginActiveUsers'
        },
        {
            category: 'Site',
            scope: ['l5Panel'],
            auth: ['admin', 'editor'],
            widget: '_100555_/l2/pluginSiteMonitorDashboard/pluginSpikes'
        },
        {
            category: 'Site',
            scope: ['l5Panel'],
            auth: ['admin', 'author'],
            widget: '_100555_/l2/pluginSiteMonitorDashboard/pluginResponseTime'
        },
        {
            category: 'Tools',
            scope: ['l5Panel'],
            auth: ['admin', 'author'],
            widget: '_100555_/l2/pluginSiteMonitorDashboard/pluginRegionalLatency'
        },
        {
            category: 'Tools',
            scope: ['l5Panel'],
            auth: ['admin', 'author'],
            widget: '_100555_/l2/pluginSiteMonitorDashboard/pluginResponseTime'
        },
        {
            category: 'Tools',
            scope: ['l5Panel'],
            auth: ['admin', 'author'],
            widget: '_100555_/l2/pluginSiteMonitorDashboard/pluginSales'
        },
      ];
    }

    public getHooks(): mls.plugin.HookAction[] {
        return [];
    }

    public getServices(): mls.plugin.ServiceAction[] {
        return [];
    }

}

export default new PluginSiteMonitorIndex();
