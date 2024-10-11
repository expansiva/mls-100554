/// <mls shortName="pluginPreviewResultJs" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html, css, svg, repeat, TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';
import { PluginBaseModule } from './_100554_pluginBaseModule';
import { getDependenciesByMFile } from './_100554_libCompile';

/// **collab_i18n_start**
const message_pt = {
    noItens: 'Nenhum item ICA foi encontrado!'
}

const message_en = {
    noItens: 'No ICA items were found!',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

export class PluginPreviewResultJs extends PluginBaseModule {

    private msg: MessageType = messages['en'];
    private _ed1: monaco.editor.IStandaloneCodeEditor | undefined;
    private hasError: boolean = false;
    private results: Results = {
        devDoc: '',
        devJS: '',
        devTS: '',
        errors: '',
        prodJS: '',
        references: [],
        configTS: '',
        libTS: '',
        jsonImport: '',
    };


    get confE() { return `l2_left`; }

    @property({ type: String }) msize = '';
    @query('mls-editor-100529') editor: IHTMLEditorElement | undefined;

    updated(changedProperties: any) {
        if (changedProperties.has('msize')) {
            this.editor?.setAttribute('msize', this.msize);
        }
    }

    createRenderRoot() {
        return this;
    }

    async firstUpdated() {
        this.createEditor();
        const editor = mls.l2.editor.editors[this.confE];
        if (!editor) return;
        const { project, shortName } = editor;
        this.setInitialModelProdJS(project, shortName, 'compiling...');
        await this.getCompileResults(project, shortName);
        this.setInitialModelProdJS(project, shortName, this.results.prodJS);


    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return html`<mls-editor-100529></mls-editor-100529>`
    }

    private createEditor(): void {
        if (!this.editor || this._ed1) return;
        this._ed1 = monaco.editor.create(this.editor, mls.editor.conf[this.confE] as monaco.editor.IEditorOptions);
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            noImplicitAny: true
        });
        this._ed1.updateOptions({ readOnly: true });
        this.editor.mlsEditor = this._ed1;
    }

    private async getCompileResults(project: number, shortName: string): Promise<void> {

        const mfile = mls.l2.editor.get({ shortName, project });
        if (!mfile) return;
        if (mfile.compilerResults && !mfile.compilerResults.prodJS) mfile.compilerResults.modelNeedCompile = true;
        const results = await mls.l2.editor.getCompilerResultTS(mfile);
        const errs = {
            Errors: results.errors
        };

        const libs = monaco.languages.typescript.typescriptDefaults.getExtraLibs();
        const libs2: any = {};
        Object.keys(libs).forEach((key) => {
            libs2[key] = {
                version: libs[key].version
            };
        });

        this.hasError = results.errors.length > 0;
        const jsonImp = await getDependenciesByMFile(mfile);

        this.results = {
            ...results,
            errors: JSON.stringify(errs, null, 2),
            references: [],
            configTS: JSON.stringify(monaco.languages.typescript.typescriptDefaults.getCompilerOptions(), null, 2),
            libTS: JSON.stringify(libs2, null, 2),
            jsonImport: JSON.stringify(jsonImp, null, 2),
        };

    }

    private setInitialModelProdJS(project: number, shortName: string, src: string) {
        const model1 = this.createOrGetModel(project, shortName, 'javascript', src);
        if (!model1) return;
        if (this._ed1) this._ed1.setModel(model1);
    }

    private getUri(shortFN: string): monaco.Uri {
        return monaco.Uri.parse(`file://server/${shortFN}_results_js.ts`);
    }

    private createOrGetModel(project: number, shortName: string, editorType: string, src: string): monaco.editor.ITextModel {
        const uri = this.getUri(`_${project}_${shortName}`);
        let modelResultJS = monaco.editor.getModel(uri);
        if (modelResultJS) {
            modelResultJS.setValue(src);
            return modelResultJS;
        }
        modelResultJS = monaco.editor.createModel(src, editorType, uri);
        return modelResultJS;
    }

}


if (!customElements.get('plugin-preview-result-js-100554')) {
    customElements.define('plugin-preview-result-js-100554', PluginPreviewResultJs);
}

type Results = {
    prodJS: string,
    devJS: string,
    devTS: string,
    errors: string;
    devDoc: string;
    libTS: string;
    configTS: string;
    references: mls.l2.editor.IMFile[],
    refs?: string,
    devDocPage?: string,
    assistant?: string,
    jsonImport: string,
}

interface IHTMLEditorElement extends HTMLElement {
    mlsEditor: monaco.editor.IStandaloneCodeEditor
}