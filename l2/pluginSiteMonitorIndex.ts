/// <mls shortName="pluginSiteMonitorIndex" project="100554" enhancement="_blank" />

// To improve system performance, avoid using imports, as this file is loaded during initialization.

import { PluginBaseIndex } from './_100554_pluginBaseIndex';

export class PluginSiteMonitorIndex extends PluginBaseIndex {

    public getMenus(): mls.plugin.MenuAction[] {
      return [
        {
            category: 'Site',
            scope: ['l6Dashboard'],
            priority: 1,
            auth: ['admin', 'editor'],
            widget: '_100554_pluginSiteMonitorDashboardErrors'
        },
        {
            category: 'Tools',
            scope: ['createNewWidget'],
            auth: ['admin', 'author'],
            widget: '_100554_pluginSiteMonitorUses'
        }
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
