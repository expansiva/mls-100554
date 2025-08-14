/// <mls shortName="pluginCollabCoreIndex" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { PluginBaseIndex } from './_100554_pluginBaseIndex';

export class PluginCollabCoreIndex extends PluginBaseIndex {

    public getMenus(): mls.plugin.MenuAction[] {

        return [
            {
                category: 'Services',
                scope: ['l7ServicesRight', 'l6ServicesRight', 'l5ServicesRight', 'l4ServicesRight', 'l3ServicesRight', 'l2ServicesRight'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_servicePreview'
            },
            {
                category: 'Services',
                scope: ['l1ServicesRight'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_servicePreviewL1'
            },
            {
                category: 'Services',
                scope: ['l7ServicesRight', 'l6ServicesRight', 'l5ServicesRight', 'l4ServicesRight', 'l3ServicesRight', 'l2ServicesRight', 'l1ServicesRight', 'l0ServicesRight'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_serviceDetail'
            },
            {
                category: 'Services',
                scope: ['l7ServicesLeft', 'l6ServicesLeft', 'l5ServicesLeft', 'l4ServicesLeft', 'l3ServicesLeft', 'l2ServicesLeft', 'l1ServicesLeft'],
                priority: 10,
                auth: ['*'],
                widget: '_100554_serviceCollabMessages'
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
                scope: ['l5ServicesLeft', 'l3ServicesLeft', 'l2ServicesLeft', 'l2ServicesRight', 'l1ServicesLeft'],
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
                priority: 1,
                auth: ['*'],
                widget: '_100554_servicePage'
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
                widget: '_100554_serviceOrganism'
            },
            {
                category: 'Services',
                scope: ['l2ServicesLeft', 'l2ServicesRight'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_serviceSource'
            },
            {
                category: 'Services',
                scope: ['l2ServicesLeft', 'l2ServicesRight', 'l5ServicesRight'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_serviceHistories'
            },
            {
                category: 'Services',
                scope: ['l0ServicesLeft'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_serviceUser'
            },
            {
                category: 'Services',
                scope: ['l1ServicesLeft'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_serviceSourceL1'
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
                widget: '_100554_pluginNavigationRenderOrganism'
            },
            {
                category: 'Stories',
                scope: ['l3PageStyle'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_pluginEditStyleL3'
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
                category: 'Filter',
                scope: ['l2StyleHelper'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_pluginStyleFilter'
            },

            {
                category: 'Columns',
                scope: ['l2StyleHelper'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_pluginStyleColumn'
            },

            {
                category: 'Margin',
                scope: ['l2StyleHelper'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_pluginStyleMargin'
            },

            {
                category: 'Padding',
                scope: ['l2StyleHelper'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_pluginStylePadding'
            },
            {
                category: 'Flex',
                scope: ['l2StyleHelper'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_pluginStyleFlex'
            },
            {
                category: 'Cursor',
                scope: ['l2StyleHelper'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_pluginStyleCursor'
            },
            {
                category: 'Box Shadow',
                scope: ['l2StyleHelper'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_pluginStyleBoxShadow'
            },
            {
                category: 'Pseudo',
                scope: ['l2StyleHelper'],
                priority: 2,
                auth: ['*'],
                widget: '_100554_pluginLessPseudo'
            },
            {
                category: 'Details',
                scope: ['l5Project'],
                priority: 1,
                auth: ['admin'],
                widget: '_100554_pluginProjectUsage'
            },
            {
                category: 'Details',
                scope: ['l5Project'],
                priority: 1,
                auth: ['admin'],
                widget: '_100554_pluginProjectConfig'
            },
            {
                category: 'Details',
                scope: ['l5Project'],
                priority: 1,
                auth: ['admin'],
                widget: '_100554_pluginProjectInfo'
            },
            {
                category: 'About',
                scope: ['l5Project'],
                priority: 1,
                auth: ['admin'],
                widget: '_100554_pluginProjectReadMe'
            },
            {
                category: 'Helpers',
                scope: ['l5Project'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_pluginProjectFindFiles'
            },
            {
                category: 'Helpers',
                scope: ['l5Project'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_pluginProjectDeleteFiles'
            },
            {
                category: 'Helpers',
                scope: ['l5Project'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_pluginPresenterRecorder'
            },
            {
                category: 'Helpers',
                scope: ['l5Project'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_pluginProjectRunTest'
            },
            {
                category: 'Profile',
                scope: ['l5UserSettings'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_pluginCollabLogin'
            },
            {
                category: 'System',
                scope: ['l5UserSettings'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_pluginSystemUser'
            },
            {
                category: 'System',
                scope: ['l5UserSettings'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_pluginSystemLanguage'
            },

            {
                category: 'System',
                scope: ['l5UserSettings'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_pluginSystemTheme'
            },
            {
                category: 'System',
                scope: ['l5UserSettings'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_pluginSystemNotification'
            },
            {
                category: 'System',
                scope: ['l5UserSettings'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_pluginSystemPrivacyPolicy'
            },
            {
                category: 'System',
                scope: ['l5UserSettings'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_pluginSystemTermsOfService'
            },
            {
                category: 'Page',
                scope: ['l2NewFile'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_pluginNewFilePage'
            },
            {
                category: 'Service',
                scope: ['l2NewFile'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_pluginNewFileService'
            },
            {
                category: 'Component',
                scope: ['l2NewFile'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_pluginNewFileWebComponent'
            },
            {
                category: 'Blank',
                scope: ['l2NewFile'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_pluginNewFileBlank'
            },
            {
                category: 'Preview',
                scope: ['l3PreviewAttr'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_pluginAttrDataset'
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
