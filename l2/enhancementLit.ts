/// <mls shortName="enhancementLit" project="100554" enhancement="_blank" groupName="other" />
import { convertFileNameToTag } from './_100554_utilsLit'
import { getPropierties } from './_100554_propiertiesLit'
import { getComponentDependencies } from './_100554_dependenciesLit'
import { validateTagName, validateRender } from './_100554_validateLit'
import { setCodeLens } from './_100554_codeLensLit'
import { injectStyle, getCssWithoutTag } from './_100554_processCssLit'
import { getMessageKey } from "./_100554_collabLitElement";

/// **collab_i18n_start**
const message_pt = {
    title1: "Criar um arquivo em branco.",
    title2: "Criar um arquivo de pagina.",
    title3: "Criar um web component em lit",
    desc1: "Criar um arquivo em branco em lit 3.",
    desc2: "Criar um arquivo do tipo pagina. Na pagina sera possivel manipular o globalState e dos eventos da página",
    desc3: "Criar um web component em lit 3 ,que será utilizado em páginas.\n O Lit é um framework para criar web componentes rápidos e com atualizações dinâmicas sem ter que repintar toda a tela.\n Após criar o arquivo use a inteligência artificial para preparar o web component.",
}

const message_en = {
    title1: "Create a blank file.",
    title2: "Create a page file.",
    title3: "Create a web component in Lit",
    desc1: "Create a blank file in Lit 3.",
    desc2: "Create a page file. In the page, it will be possible to manipulate the globalState and the page events.",
    desc3: "Create a web component in Lit 3 that will be used on pages.\n Lit is a framework for creating fast web components with dynamic updates without repainting the entire screen.\n After creating the file, use artificial intelligence to prepare the web component."
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en-us': message_en,
    'pt-br': message_pt
}
/// **collab_i18n_end**

const lang = getMessageKey(messages);
let msg: MessageType = messages[lang];

export const getAddNewFileDetails = () => {
    return [
        {
            title: msg.title1,
            description: msg.desc1,
            tags: ["lit", "html", "component"],
            example: ``,
            aimActionSuggest: ""
        },
        {
            title: msg.title2,
            description: msg.desc2,
            tags: ["lit", "html", "page"],
            example: `
import { CollabPageElement } from './_100554_collabPageElement'
import { customElement } from 'lit/decorators.js';

@customElement('[tagName]')
export class [className] extends CollabPageElement {

    initPage() {
        window.globalState = {
            tables: {
                sex: [{ key: 'm', value: 'masculino' }, { key: 'f', value: 'feminino' }],
            },
            newUser: {
                name: '',
                age: 0,
                city: '',
                sex: ''
            },
            sum: 0,
        };
    }

    /// **collab_events_start**
    handleClickbuttonSum() {
        // here or code for event
    }

}`,
            aimActionSuggest: ""
        },
        {
            title: msg.title3,
            description: msg.desc3,
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
        validateLess(mfile);
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

function validateLess(mfile: mls.l2.editor.IMFile) {

    const model: monaco.editor.ITextModel = (mfile as any).modelLESS;
    const keyToStorFileLess = mls.stor.getKeyToFiles(mfile.project, 2, mfile.shortName, '', '.less');
    const storFileLess = mls.stor.files[keyToStorFileLess];
    if (!model || !storFileLess) return;

    storFileLess.hasError = false;
    const value = model.getValue();
    let text = removeTokensFromSource(value);
    text = removeCommentLines(text);
    const markers: monaco.Position[] = [];
    const validRootSelectorClass = /^[a-zA-Z][\w-]*\.[a-zA-Z][\w-]*$/;
    const validRootSelectorTag = /^\s*[a-zA-Z]+[\w-]*-[\w-]*\s*$/;
    const rootRules = getRootSelectors(text);

    if (rootRules) {
        rootRules.forEach((rule) => {
            const lineSelector = rule.trim().split('\n')[0].trim();
            const selector = lineSelector.split('{')[0].trim();
            const position = getLineByText(model, lineSelector);
            if (!validRootSelectorClass.test(selector) && !validRootSelectorTag.test(selector) && position) {
                markers.push(position);
            }
        });
    }

    if (markers.length > 0) storFileLess.hasError = true;
    setErrorOnEditor(markers, model);
}

function setErrorOnEditor(position: monaco.Position[], model: monaco.editor.ITextModel) {
    monaco.editor.setModelMarkers(model, 'markerSource', []);
    const markers: monaco.editor.IMarkerData[] = [];
    position.forEach((pos) => {
        const markerOptions = {
            severity: monaco.MarkerSeverity.Error,
            message: 'Invalid selector',
            startLineNumber: pos.lineNumber,
            startColumn: pos.column,
            endLineNumber: pos.lineNumber,
            endColumn: pos.column,
        };
        markers.push(markerOptions);
    })
    monaco.editor.setModelMarkers(model, 'markerSource', markers);
}

function getLineByText(model: monaco.editor.ITextModel, searchText: string) {
    const lineCount = model.getLineCount();
    for (let lineNumber = 1; lineNumber <= lineCount; lineNumber++) {
        const lineContent = model.getLineContent(lineNumber);
        if (lineContent.trim() === searchText) {
            return new monaco.Position(lineNumber, 1);
        }
    }
    return null;
}

function removeTokensFromSource(src: string) {
    const regex = /\/\/Start Less Tokens[\s\S]*?\/\/End Less Tokens/g;
    return src.replace(regex, '');
}

function removeCommentLines(text: string) {

    const lines = text.split('\n');
    const lineCount = lines.length - 1;

    const newLines = [];

    for (let lineNumber = 1; lineNumber <= lineCount; lineNumber++) {
        const lineContent = lines[lineNumber]
        if (!isCommentLine(lineContent)) {
            newLines.push(lineContent);
        }
    }
    const newContent = newLines.join('\n');
    return newContent;
}

function getRootSelectors(lessContent: string): string[] {
    const rootSelectors = [];
    const regex = /^([^\s{]+(?:\.[^\s{]+)*(?:\s+[^\s{]+)*)\s*\{/gm; 
    let match;
    while ((match = regex.exec(lessContent)) !== null) {
        rootSelectors.push((match[1].trim().replace(/\n/g, ' ').replace(/}/g, '') + ' {').trim()); 
    }
    return rootSelectors;
}

function isCommentLine(line: string) {
    if (!line) return false;
    if (line.trim().startsWith('//')) {
        return true;
    }
    return line.trim().startsWith('/*') && line.trim().endsWith('*/');
}
