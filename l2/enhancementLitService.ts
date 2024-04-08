/// <mls shortName="enhancementLitService" project="100554" enhancement="_blank" />
import {
    getDesignDetails as getDesignDetailsDefault,
    getDefaultHtmlExamplePreview as getDefaultHtmlExamplePreviewDefault,
    getPromptDefault as getPromptDefaultDefault,
    onAfterChange as onAfterChangeDefault,
    onAfterCompile as onAfterCompileDefault,
    requires as requiresDefault,
    setStylesProcessed as setStylesProcessedDefault,
} from './_100554_enhancementLit';

export const description = "Use this enhancement for create a service collab using lit"

export const example = ``;

export const getAddNewFileDetails = () => {
    return [
        {
            title: "Criar um service em lit",
            description: "Criar um service em lit 3 ,que será utilizado no sistema collab.\n O Lit é um framework para criar web componentes rápidos e com atualizações dinâmicas sem ter que repintar toda a tela.\n Após criar o arquivo use a inteligência artificial para preparar o web component.",
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

export const getDefaultHtmlExamplePreview = (model: mls.l2.editor.IMFile): string => {
    return getDefaultHtmlExamplePreviewDefault(model)
}

export const getDesignDetails = (model: mls.l2.editor.IMFile): Promise<mls.l2.enhancement.IDesignDetailsReturn> => {
    return getDesignDetailsDefault(model);
}

export const onAfterChange = async (mfile: mls.l2.editor.IMFile): Promise<void> => {
    return onAfterChangeDefault(mfile);
};

export const getPromptDefault = (): string => {
    return getPromptDefaultDefault();
}

export const onAfterCompile = async (mfile: mls.l2.editor.IMFile): Promise<void> => {
    return onAfterCompileDefault(mfile);
}

export const setStylesProcessed = async (newCss: string, el: HTMLElement, tag: string): Promise<void> => {
    return setStylesProcessedDefault(newCss, el, tag);
}
