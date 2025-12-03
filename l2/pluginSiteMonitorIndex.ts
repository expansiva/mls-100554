/// <mls shortName="pluginSiteMonitorIndex" project="100554" enhancement="_blank" />

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
            widget: '_100554_pluginSiteMonitorDashboardErrors'
        },
        {
            category: 'Site',
            scope: ['l5Panel'],
            auth: ['admin', 'editor'],
            widget: '_100554_pluginSiteMonitorDashboardActiveUsers'
        },
        {
            category: 'Site',
            scope: ['l5Panel'],
            auth: ['admin', 'editor'],
            widget: '_100554_pluginSiteMonitorDashboardSpikes'
        },
        {
            category: 'Site',
            scope: ['l5Panel'],
            auth: ['admin', 'author'],
            widget: '_100554_pluginSiteMonitorDashboardResponseTime'
        },
        {
            category: 'Tools',
            scope: ['l5Panel'],
            auth: ['admin', 'author'],
            widget: '_100554_pluginSiteMonitorDashboardRegionalLatency'
        },
        {
            category: 'Tools',
            scope: ['l5Panel'],
            auth: ['admin', 'author'],
            widget: '_100554_pluginSiteMonitorDashboardResponseTime'
        },
        {
            category: 'Tools',
            scope: ['l5Panel'],
            auth: ['admin', 'author'],
            widget: '_100554_pluginSiteMonitorDashboardSales'
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
