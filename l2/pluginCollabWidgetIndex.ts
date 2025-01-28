/// <mls shortName="pluginCollabWidgetIndex" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { PluginBaseIndex } from './_100554_pluginBaseIndex';

export class PluginCollabWidgetIndex extends PluginBaseIndex {

    public getMenus(): mls.plugin.MenuAction[] {

        return [
            {
                category: 'Widget',
                scope: ['l3AddWidget'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_wcText'
            },
            {
                category: 'Widget',
                scope: ['l3AddWidget'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_wcImage'
            },
            {
                category: 'Widget',
                scope: ['l3AddWidget'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_wcCode'
            },
            {
                category: 'Widget',
                scope: ['l3AddWidget'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_wcVideo'
            },
            {
                category: 'Widget',
                scope: ['l3AddWidget'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_wcSection'
            },
            {
                category: 'Widget',
                scope: ['l3AddWidget'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_wcDivider'
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

export default new PluginCollabWidgetIndex();