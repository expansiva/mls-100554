/// <mls shortName="enhancementLit" project="100554" enhancement="_100554_enhancementVanilla" groupName="other" />
import { convertFileNameToTag } from './_100554_utilsLit'
import { getPropierties } from './_100554_propiertiesLit'
import { getComponentDependencies } from './_100554_dependenciesLit'
import { validateTagName, validateRender } from './_100554_validateLit'
import { setCodeLens } from './_100554_codeLensLit'
import { injectStyle, getCssWithoutTag } from './_100554_processCssLit'


export const getAddNewFileDetails = () =>{
    return [
        {
            title: "Criar um arquivo em branco",
            description: "Criar um arquivo em branco em lit 3.",
            tags: ["lit", "html", "component"],
            example: ``,
            aimActionSuggest: ""
        },
        {
            title: "Criar um web component em lit",
            description: "Criar um web component em lit 3 ,que será utilizado em páginas.\n O Lit é um framework para criar web componentes rápidos e com atualizações dinâmicas sem ter que repintar toda a tela.\n Após criar o arquivo use a inteligência artificial para preparar o web component.",
            tags: ["lit", "html", "component"],
            example: `
import { html, css, LitElement } from 'lit'; 
import { customElement, property } from 'lit/decorators.js';

@customElement('[tagName]')
export class [className] extends LitElement {
    
    static styles = css\`[[mls_getDefaultDesignSystem]]\`;

    @property() 
    name: string = 'Somebody';

    render() {
        return html\`<p> Hello, \${ this.name } !</p>\`;
    }
}`,
            aimActionSuggest: "_100554_aimActionAddIca"
        }
    ]
}

export const requires: mls.l2.editor.IRequire[] = [
    {
        type: 'tspath',
        name: 'lit',
        ref: "file://server/_100554_litElement.ts"
    },
    {
        type: 'tspath',
        name: 'lit/decorators.js',
        ref: "file://server/_100554_litDecorators.ts"
    },
    {
        type: "cdn",
        name: "lit",
        ref: "https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js",

    },
    {
        type: "cdn",
        name: "lit/decorators.js",
        ref: "https://cdn.jsdelivr.net/npm/lit@3.0.0/decorators/+esm",

    }
];

export const getDefaultHtmlExamplePreview = (model: mls.l2.editor.IMFile): string => {
    const tag = convertFileNameToTag(`_${model.storFile.project}_${model.storFile.shortName}`);
    return `<${tag}></${tag}>`;
}

export const getDesignDetails = (model: mls.l2.editor.IMFile): Promise<mls.l2.enhancement.IDesignDetailsReturn> => {
    return new Promise<mls.l2.enhancement.IDesignDetailsReturn>((resolve, reject) => {
        try {
            const ret = {} as mls.l2.enhancement.IDesignDetailsReturn;
            ret.defaultHtmlExamplePreview = getDefaultHtmlExamplePreview(model);
            ret.properties = getPropierties(model);
            ret.webComponentDependencies = getComponentDependencies(model);
            (ret as any)['servicePreviewDefault'] = '_100529_service_preview';
            resolve(ret);
        } catch (e) {
            reject(e);
        }
    })
}


export const onAfterChange = async (mfile: mls.l2.editor.IMFile): Promise<void> => {
    try {
        setCodeLens(mfile);
        if (validateTagName(mfile)) {
            mls.events.fireFileAction('statusOrErrorChanged', mfile.storFile, 'left');
            mls.events.fireFileAction('statusOrErrorChanged', mfile.storFile, 'right');
            return;
        }

        if (validateRender(mfile)) {
            mls.events.fireFileAction('statusOrErrorChanged', mfile.storFile, 'left');
            mls.events.fireFileAction('statusOrErrorChanged', mfile.storFile, 'right');
            return;
        }
    } catch (e: any) {
        return e.message || e;
    }
};


export const onAfterCompile = async (mfile: mls.l2.editor.IMFile): Promise<void> => {
    await injectStyle(mfile, 0);
    return;
}

export async function setStylesProcessed(newCss: string, el: HTMLElement, tag: string) {
    const cssWithoutTag = getCssWithoutTag(newCss, tag);
    if (!el.shadowRoot) return;
    const stylesheet = createStyleSheet(cssWithoutTag, el.ownerDocument.defaultView!);
    if (!stylesheet) return;
    el.shadowRoot.adoptedStyleSheets = [stylesheet];
    (el as any).requestUpdate();
}

function createStyleSheet(cssString: string, defaultView: Window) {
    const sheet = (new (defaultView as any).CSSStyleSheet() as any);
    sheet.replaceSync(cssString);
    return sheet;
}
