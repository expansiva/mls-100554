/// <mls fileReference="_100554_/l2/pluginExamplesIndex.ts" enhancement="_100554_/l2/enhancementLit" />

import { PluginBaseIndex } from '/_100554_/l2/pluginBaseIndex.js';

export class PluginExamplesIndex extends PluginBaseIndex {


    public getMenus(): mls.plugin.MenuAction[] {
      return [
        {
            category: 'Examples 1',
            scope: ['l6Dashboard'],
            priority: 1,
            auth: ['admin', 'editor'],
            widget: '_100555_/l2/pluginSiteMonitorDashboard/pluginErrors'
        },
        {
            category: 'Examples 1',
            scope: ['l6Dashboard'],
            auth: ['admin', 'editor'],
            widget: '_100555_/l2/pluginSiteMonitorDashboard/pluginActiveUsers'
        },
        {
            category: 'Examples 1',
            scope: ['l6Dashboard'],
            auth: ['admin', 'editor'],
            widget: '_100555_/l2/pluginSiteMonitorDashboard/pluginExpenses'
        },
        {
            category: 'Examples 1',
            scope: ['l6Dashboard'],
            auth: ['admin', 'author'],
            widget: '_100555_/l2/pluginSiteMonitorDashboard/pluginRegionalLatency'
        },
        {
            category: 'Examples 1',
            scope: ['l6Dashboard'],
            auth: ['admin', 'author'],
            widget: '_100555_/l2/pluginSiteMonitorDashboard/pluginResponseTime'
        },
        {
            category: 'Examples 1',
            scope: ['l6Dashboard'],
            auth: ['admin', 'author'],
            widget: '_100555_/l2/pluginSiteMonitorDashboard/pluginSales'
        },
        {
            category: 'Examples 2',
            scope: ['l6Dashboard'],
            auth: ['admin', 'author'],
            widget: '_100555_/l2/pluginSiteMonitorDashboard/pluginRegionalLatency'
        },
        {
            category: 'Examples 2',
            scope: ['l6Dashboard'],
            auth: ['admin', 'author'],
            widget: '_100555_/l2/pluginSiteMonitorDashboard/pluginResponseTime'
          },
        {
            category: 'Examples 2',
            scope: ['l6Dashboard'],
            auth: ['admin', 'author'],
            widget: '_100555_/l2/pluginSiteMonitorDashboard/pluginSales'
        },
        {
            category: 'Examples 2',
            scope: ['l6Dashboard'],
            auth: ['admin', 'author'],
            widget: '_100555_/l2/pluginSiteMonitorDashboard/pluginSpikes'
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