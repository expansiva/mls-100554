/// <mls shortName="pluginExamplesIndex" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { PluginBaseIndex } from '/_100554_/l2/pluginBaseIndex.js';

export class PluginExamplesIndex extends PluginBaseIndex {


    public getMenus(): mls.plugin.MenuAction[] {
      return [
        {
            category: 'Examples 1',
            scope: ['l6Dashboard'],
            priority: 1,
            auth: ['admin', 'editor'],
            widget: '_100554_pluginSiteMonitorDashboardErrors'
        },
        {
            category: 'Examples 1',
            scope: ['l6Dashboard'],
            auth: ['admin', 'editor'],
            widget: '_100554_pluginSiteMonitorDashboardActiveUsers'
        },
        {
            category: 'Examples 1',
            scope: ['l6Dashboard'],
            auth: ['admin', 'editor'],
            widget: '_100554_pluginSiteMonitorDashboardExpenses'
        },
        {
            category: 'Examples 1',
            scope: ['l6Dashboard'],
            auth: ['admin', 'author'],
            widget: '_100554_pluginSiteMonitorDashboardRegionalLatency'
        },
        {
            category: 'Examples 1',
            scope: ['l6Dashboard'],
            auth: ['admin', 'author'],
            widget: '_100554_pluginSiteMonitorDashboardResponseTime'
        },
        {
            category: 'Examples 1',
            scope: ['l6Dashboard'],
            auth: ['admin', 'author'],
            widget: '_100554_pluginSiteMonitorDashboardSales'
        },
        {
            category: 'Examples 2',
            scope: ['l6Dashboard'],
            auth: ['admin', 'author'],
            widget: '_100554_pluginSiteMonitorDashboardRegionalLatency'
        },
        {
            category: 'Examples 2',
            scope: ['l6Dashboard'],
            auth: ['admin', 'author'],
            widget: '_100554_pluginSiteMonitorDashboardResponseTime'
          },
        {
            category: 'Examples 2',
            scope: ['l6Dashboard'],
            auth: ['admin', 'author'],
            widget: '_100554_pluginSiteMonitorDashboardSales'
        },
        {
            category: 'Examples 2',
            scope: ['l6Dashboard'],
            auth: ['admin', 'author'],
            widget: '_100554_pluginSiteMonitorDashboardSpikes'
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

export default new PluginExamplesIndex();