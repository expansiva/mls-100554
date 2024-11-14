/// <mls shortName="enhancementLitService" project="100554" enhancement="_blank" />
import {
    getDesignDetails as getDesignDetailsDefault,
    getDefaultHtmlExamplePreview as getDefaultHtmlExamplePreviewDefault,
    onAfterChange as onAfterChangeDefault,
    onAfterCompile as onAfterCompileDefault,
    requires as requiresDefault,
    // setStylesProcessed as setStylesProcessedDefault,
} from './_100554_enhancementLit';

import { getMessageKey } from "./_100554_collabLitElement";

/// **collab_i18n_start**
const message_pt = {
    title: 'Criar um service em lit',
    description: "Criar um service em lit 3 ,que será utilizado no sistema collab.\n O Lit é um framework para criar web componentes rápidos e com atualizações dinâmicas sem ter que repintar toda a tela.\n Após criar o arquivo use a inteligência artificial para preparar o web component."
}

const message_en = {
    title: 'Create a service in Lit',
    description: "Create a service in Lit 3, which will be used in the collab system.\n Lit is a framework for creating fast web components with dynamic updates without repainting the entire screen.\n After creating the file, use artificial intelligence to prepare the web component."
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**


const lang = getMessageKey(messages)
const msg: MessageType = messages[lang] ;

export const getAddNewFileDetails = () => {
    return [
        {
            title: msg.title,
            description: msg.description,
            tags: ["lit", "internal", "service"],
            example: `
            import { html, css } from 'lit';
            import { customElement, property } from 'lit/decorators.js';
            import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

            @customElement('[tagName]')
            export class [className] extends ServiceBase {

                static styles = css${'`[[mls_getDefaultDesignSystem]]`'};

                public details: IService = {
                    icon: '&#xf15b',
                    state: 'foreground',
                    position: 'right',
                    tooltip: 'Service Example',
                    visible: true,
                    widget: '[widgetName]',
                    level: [5]
                }

                public onClickLink = (op: string): boolean => {
                    if (this.menu.setMode) this.menu.setMode('initial');
                    return false;
                }

                public menu: IMenu = {
                    title: 'Example',
                    actions: {
                    },
                    icons: {},
                    actionDefault: '', // call after close icon clicked
                    setMode: undefined, // child will set this
                    onClickLink: this.onClickLink,
                    getLastMode: undefined,
                    updateTitle: undefined
                }

                onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

                }


                @property() 
                name: string = 'Somebody';

                render() {
                    return html\`<p> Hello, \${ this.name } !</p>\`;
                }
            }`,
            aimActionSuggest: ""
        }
    ]
}

export const requires = requiresDefault;

export const getDefaultHtmlExamplePreview = (modelTS: mls.editor.IModelTS): string => {
    return getDefaultHtmlExamplePreviewDefault(modelTS)
}

export const getDesignDetails = (modelTS: mls.editor.IModelTS): Promise<mls.l2.enhancement.IDesignDetailsReturn> => {
    return getDesignDetailsDefault(modelTS);
}

export const onAfterChange = async (modelTS: mls.editor.IModelTS): Promise<void> => {
    return onAfterChangeDefault(modelTS);
};

export const onAfterCompile = async (modelTS: mls.editor.IModelTS): Promise<void> => {
    return onAfterCompileDefault(modelTS);
}

// export const setStylesProcessed = async (newCss: string, el: HTMLElement, tag: string): Promise<void> => {
//     return setStylesProcessedDefault(newCss, el, tag);
// }
