/// <mls fileReference="_100554_/l2/pluginCollabCoreIndex.ts" enhancement="_100554_/l2/enhancementLit" />

import { PluginBaseIndex } from '/_100554_/l2/pluginBaseIndex.js';

export class PluginCollabCoreIndex extends PluginBaseIndex {

    public getMenus(): mls.plugin.MenuAction[] {

        return [
            {
                category: 'Services',
                scope: ['l4ServicesRight', 'l3ServicesRight', 'l2ServicesRight'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_servicePreview'
            },
            {
                category: 'Services',
                scope: ['l4ServicesRight', 'l3ServicesRight', 'l2ServicesRight'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_serviceMindMap'
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
            /*{
                    category: 'Services',
                    scope: ['l7ServicesRight'],
                    priority: 1,
                    auth: ['*'],
                    widget: '_100554_serviceLiveView'
                },*/
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
                scope: ['l5ServicesLeft', 'l1ServicesLeft'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_serviceProject'
            },
            {
                category: 'Services',
                scope: ['l2ServicesLeft', 'l2ServicesRight'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_serviceUnit'
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
                scope: ['l5ServicesLeft'],
                priority: 3,
                auth: ['*'],
                widget: '_100554_serviceCollabFileSystem'
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
                widget: '_100555_/l2/pluginExplore/pluginExploreList.ts'
            },
            {
                category: 'Stories',
                scope: ['l3PageStyle'],
                priority: 2,
                auth: ['*'],
                widget: '_100555_/l2/pluginEditL3/pluginEditStyleL3'
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
                widget: '_100555_/l2/pluginPreview/pluginPreviewResultJs'
            },

            {
                category: 'Background',
                scope: ['l2StyleHelper'],
                priority: 2,
                auth: ['*'],
                widget: '_100555_/l2/pluginStyle/pluginStyleBackground'
            },
            {
                category: 'Border',
                scope: ['l2StyleHelper'],
                priority: 2,
                auth: ['*'],
                widget: '_100555_/l2/pluginStyle/pluginStyleBorder'
            },
            {
                category: 'Clippath',
                scope: ['l2StyleHelper'],
                priority: 2,
                auth: ['*'],
                widget: '_100555_/l2/pluginStyle/pluginStyleClippath'
            },
            {
                category: 'Text Shadow',
                scope: ['l2StyleHelper'],
                priority: 2,
                auth: ['*'],
                widget: '_100555_/l2/pluginStyle/pluginStyleTextShadow'
            },
            {
                category: 'Tokens',
                scope: ['l2StyleHelper'],
                priority: 1,
                auth: ['*'],
                widget: '_100555_/l2/pluginStyle/pluginStyleTokens'
            },

            {
                category: 'Transform',
                scope: ['l2StyleHelper'],
                priority: 2,
                auth: ['*'],
                widget: '_100555_/l2/pluginStyle/pluginStyleTransform'
            },

            {
                category: 'Filter',
                scope: ['l2StyleHelper'],
                priority: 2,
                auth: ['*'],
                widget: '_100555_/l2/pluginStyle/pluginStyleFilter'
            },

            {
                category: 'Columns',
                scope: ['l2StyleHelper'],
                priority: 2,
                auth: ['*'],
                widget: '_100555_/l2/pluginStyle/pluginStyleColumn'
            },

            {
                category: 'Margin',
                scope: ['l2StyleHelper'],
                priority: 2,
                auth: ['*'],
                widget: '_100555_/l2/pluginStyle/pluginStyleMargin'
            },

            {
                category: 'Padding',
                scope: ['l2StyleHelper'],
                priority: 2,
                auth: ['*'],
                widget: '_100555_/l2/pluginStyle/pluginStylePadding'
            },
            {
                category: 'Flex',
                scope: ['l2StyleHelper'],
                priority: 2,
                auth: ['*'],
                widget: '_100555_/l2/pluginStyle/pluginStyleFlex'
            },
            {
                category: 'Cursor',
                scope: ['l2StyleHelper'],
                priority: 2,
                auth: ['*'],
                widget: '_100555_/l2/pluginStyle/pluginStyleCursor'
            },
            {
                category: 'Box Shadow',
                scope: ['l2StyleHelper'],
                priority: 2,
                auth: ['*'],
                widget: '_100555_/l2/pluginStyle/pluginStyleBoxShadow'
            },
            {
                category: 'Pseudo',
                scope: ['l2StyleHelper'],
                priority: 2,
                auth: ['*'],
                widget: '_100555_/l2/pluginStyle/pluginLessPseudo'
            },
            {
                category: 'Details',
                scope: ['l5Project'],
                priority: 1,
                auth: ['admin'],
                widget: '_100555_/l2/pluginProject/pluginProjectUsage'
            },
            {
                category: 'Details',
                scope: ['l5Project'],
                priority: 1,
                auth: ['admin'],
                widget: '_100555_/l2/pluginProject/pluginProjectConfig'
            },
            {
                category: 'Details',
                scope: ['l5Project'],
                priority: 1,
                auth: ['admin'],
                widget: '_100555_/l2/pluginProject/pluginProjectInfo'
            },
            {
                category: 'About',
                scope: ['l5Project'],
                priority: 1,
                auth: ['admin'],
                widget: '_100555_/l2/pluginProject/pluginProjectReadMe'
            },
            {
                category: 'Helpers',
                scope: ['l5Project'],
                priority: 1,
                auth: ['*'],
                widget: '_100555_/l2/pluginProject/pluginProjectFindFiles'
            },
            {
                category: 'Helpers',
                scope: ['l5Project'],
                priority: 1,
                auth: ['*'],
                widget: '_100555_/l2/pluginProject/pluginProjectDeleteFiles'
            },
            {
                category: 'Helpers',
                scope: ['l5Project'],
                priority: 1,
                auth: ['*'],
                widget: '_100555_/l2/pluginProject/pluginPresenterRecorder'
            },
            {
                category: 'Helpers',
                scope: ['l5Project'],
                priority: 1,
                auth: ['*'],
                widget: '_100555_/l2/pluginProject/pluginProjectRunTest'
            },
            {
                category: 'Helpers',
                scope: ['l5Project'],
                priority: 1,
                auth: ['*'],
                widget: '_100555_/l2/pluginProject/pluginGenerateDist'
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
                widget: '_100555_/l2/pluginSystem/pluginSystemUser'
            },
            {
                category: 'System',
                scope: ['l5UserSettings'],
                priority: 1,
                auth: ['*'],
                widget: '_100555_/l2/pluginSystem/pluginSystemLanguage'
            },

            {
                category: 'System',
                scope: ['l5UserSettings'],
                priority: 1,
                auth: ['*'],
                widget: '_100555_/l2/pluginSystem/pluginSystemTheme'
            },
            {
                category: 'Page',
                scope: ['l2NewFile'],
                priority: 1,
                auth: ['*'],
                widget: '_100555_/l2/pluginNewFile/pluginNewFilePage'
            },
            {
                category: 'Service',
                scope: ['l2NewFile'],
                priority: 1,
                auth: ['*'],
                widget: '_100555_/l2/pluginNewFile/pluginNewFileService'
            },
            {
                category: 'Component',
                scope: ['l2NewFile'],
                priority: 1,
                auth: ['*'],
                widget: '_100555_/l2/pluginNewFile/pluginNewFileWebComponent'
            },
            {
                category: 'Blank',
                scope: ['l2NewFile'],
                priority: 1,
                auth: ['*'],
                widget: '_100555_/l2/pluginNewFile/pluginNewFileBlank'
            },
            {
                category: 'Agent',
                scope: ['l2NewFile'],
                priority: 1,
                auth: ['*'],
                widget: '_100555_/l2/pluginNewFile/pluginNewFileAgent'
            },
            {
                category: 'MD',
                scope: ['l2NewFile'],
                priority: 1,
                auth: ['*'],
                widget: '_100555_/l2/pluginNewFile/pluginNewFileMd'
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
