/// <mls shortName="pluginCollabCoreIndex" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { PluginBaseIndex } from './_100554_pluginBaseIndex';

export class PluginCollabCoreIndex extends PluginBaseIndex {

    public getMenus(): mls.plugin.MenuAction[] {

        return [
            {
                category: 'Services',
                scope: ['l7ServicesRight', 'l6ServicesRight', 'l5ServicesRight', 'l4ServicesRight', 'l3ServicesRight', 'l2ServicesRight', 'l1ServicesRight'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_servicePreview'
            },
            {
                category: 'Services',
                scope: ['l7ServicesRight', 'l6ServicesRight', 'l5ServicesRight', 'l4ServicesRight', 'l3ServicesRight', 'l2ServicesRight', 'l1ServicesRight'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_serviceDetail'
            },
            {
                category: 'Services',
                scope: ['l7ServicesRight', 'l6ServicesRight', 'l5ServicesRight', 'l4ServicesRight', 'l3ServicesRight', 'l2ServicesRight', 'l1ServicesRight'],
                priority: 3,
                auth: ['*'],
                widget: '_100554_serviceAim'
            },
            {
                category: 'Services',
                scope: ['l6ServicesLeft'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_serviceExploreProjects'
            },
            {
                category: 'Services',
                scope: ['l6ServicesLeft'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_serviceDashboard'
            },
            {
                category: 'Services',
                scope: ['l5ServicesLeft', 'l4ServicesLeft', 'l3ServicesLeft', 'l2ServicesLeft', 'l2ServicesRight', 'l1ServicesLeft'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_serviceProject'
            },
            {
                category: 'Services',
                scope: ['l5ServicesLeft'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_serviceWorkspace'
            },
            {
                category: 'Services',
                scope: ['l5ServicesLeft'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_servicePanel'
            },
            {
                category: 'Services',
                scope: ['l5ServicesLeft'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_serviceSave'
            },
            {
                category: 'Services',
                scope: ['l4ServicesLeft'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_serviceProduct'
            },
            {
                category: 'Services',
                scope: ['l3ServicesLeft'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_servicePage'
            },
            // {
            //     category: 'Services',
            //     scope: ['l3ServicesLeft'],
            //     priority: 2,
            //     auth: ['*'],
            //     widget: '_100554_serviceSelectDs'
            // },
            // {
            //     category: 'Services',
            //     scope: ['l3ServicesLeft'],
            //     priority: 2,
            //     auth: ['*'],
            //     widget: '_100554_serviceDsDocList'
            // },
            // {
            //     category: 'Services',
            //     scope: ['l3ServicesLeft'],
            //     priority: 2,
            //     auth: ['*'],
            //     widget: '_100554_serviceDsTokens'
            // },
            // {
            //     category: 'Services',
            //     scope: ['l3ServicesLeft'],
            //     priority: 2,
            //     auth: ['*'],
            //     widget: '_100554_serviceDsAssets'
            // },
            // {
            //     category: 'Services',
            //     scope: ['l3ServicesLeft'],
            //     priority: 2,
            //     auth: ['*'],
            //     widget: '_100554_serviceDsComponentsList'
            // },
            // {
            //     category: 'Services',
            //     scope: ['l3ServicesLeft'],
            //     priority: 2,
            //     auth: ['*'],
            //     widget: '_100554_serviceDsStyles'
            // },
            // {
            //     category: 'Services',
            //     scope: ['l3ServicesRight'],
            //     priority: 1,
            //     auth: ['*'],
            //     widget: '_100554_serviceDetailsDs'
            // },
            // {
            //     category: 'Services',
            //     scope: ['l3ServicesRight'],
            //     priority: 1,
            //     auth: ['*'],
            //     widget: '_100554_serviceDsAssetsOverview'
            // },
            // {
            //     category: 'Services',
            //     scope: ['l3ServicesRight'],
            //     priority: 1,
            //     auth: ['*'],
            //     widget: '_100554_serviceDsAssetsVideo'
            // },
            // {
            //     category: 'Services',
            //     scope: ['l3ServicesRight'],
            //     priority: 1,
            //     auth: ['*'],
            //     widget: '_100554_serviceDsAssetsImage'
            // },
            // {
            //     category: 'Services',
            //     scope: ['l3ServicesRight'],
            //     priority: 1,
            //     auth: ['*'],
            //     widget: '_100554_serviceDsAssetsEditor'
            // },

            {
                category: 'Services',
                scope: ['l2ServicesLeft', 'l2ServicesRight'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_serviceSource'
            },
            {
                category: 'Services',
                scope: ['l2ServicesLeft', 'l2ServicesRight'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_serviceHistories'
            },
            {
                category: 'Services',
                scope: ['l0ServicesRight'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_serviceUserSettings'
            },
            {
                category: 'Services',
                scope: ['l0ServicesRight'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_serviceNotification'
            },
            {
                category: 'Components',
                scope: ['l5Explore'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_pluginExploreList'
            },
            {
                category: 'Stories',
                scope: ['l5Explore'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_pluginExploreStories'
            },

            {
                category: 'Stories',
                scope: ['l3PageNavigation'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_pluginPageNavigation'
            },
            {
                category: 'Stories',
                scope: ['l3PageProperties'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_pluginPageProperties'
            },
            {
                category: 'Linter',
                scope: ['l3PageAI'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_pluginPageAIVerify'
            },
            {
                category: 'Results',
                scope: ['l2PreviewResults'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_pluginPreviewResultJs'
            },

            {
                category: 'Background',
                scope: ['l2StyleHelper'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_pluginStyleBackground'
            },
            {
                category: 'Border',
                scope: ['l2StyleHelper'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_pluginStyleBorder'
            },
            {
                category: 'Clippath',
                scope: ['l2StyleHelper'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_pluginStyleClippath'
            },
            {
                category: 'Text Shadow',
                scope: ['l2StyleHelper'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_pluginStyleTextShadow'
            },
            {
                category: 'Tokens',
                scope: ['l2StyleHelper'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_pluginStyleTokens'
            },

            {
                category: 'Transform',
                scope: ['l2StyleHelper'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_pluginStyleTransform'
            },

            {
                category: 'Columns',
                scope: ['l2StyleHelper'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_pluginStyleColumn'
            },

            {
                category: 'Spacing',
                scope: ['l2StyleHelper'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_pluginStyleSpacing'
            },

            {
                category: 'Flex',
                scope: ['l2StyleHelper'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_pluginStyleFlex'
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

export default new PluginCollabCoreIndex();
