/// <mls shortName="pluginCollabWidgetIndex" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { PluginBaseIndex } from '/_100554_/l2/pluginBaseIndex.js';

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

            {
                category: 'Widget',
                scope: ['l3AddWidget'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_wcButtonSubmit'
            },
            {
                category: 'Widget',
                scope: ['l3AddWidget'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_wcChart'
            },
            {
                category: 'Widget',
                scope: ['l3AddWidget'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_wcColumn'
            },
            {
                category: 'Widget',
                scope: ['l3AddWidget'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_wcInputNumber'
            },
            {
                category: 'Widget',
                scope: ['l3AddWidget'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_wcInputText'
            },
            {
                category: 'Widget',
                scope: ['l3AddWidget'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_wcInputNumberRange'
            },
            {
                category: 'Widget',
                scope: ['l3AddWidget'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_wcInputNumberWithButtons'
            },
            {
                category: 'Widget',
                scope: ['l3AddWidget'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_wcRow'
            },
            {
                category: 'Widget',
                scope: ['l3AddWidget'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_wcSelectOne'
            },
            {
                category: 'Widget',
                scope: ['l3AddWidget'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_wcTableSelect'
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