/// <mls shortName="pluginPreviewResultTestJs" project="100554" enhancement="_100554_enhancementLit" groupName="other" />

import { html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { PluginBaseModule } from '/_100554_/l2/pluginBaseModule.js';
import { getDependenciesByMFile } from '/_100554_/l2/libCompile.js';

/// **collab_i18n_start**

const message_pt = {}
const message_en = {}
type MessageType = typeof message_en;
const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt

}
/// **collab_i18n_end**

@customElement('plugin-preview-result-test-js-100554')
export class PluginPreviewResultJs extends PluginBaseModule {

    private msg: MessageType = messages['en'];
    private _ed1: monaco.editor.IStandaloneCodeEditor | undefined;
    private hasError: boolean = false;
    private results: Results = {
        errors: '',
        prodJS: '',
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
        const actualFile = (mls.actual[2] as any).left;
        if (!actualFile) return;
        const { project, shortName } = actualFile;
        this.setInitialModelProdTestJS(project, shortName, 'compiling...');
        await this.getCompileResults(project, shortName);
        this.setInitialModelProdTestJS(project, shortName, this.results.prodJS);

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

        const models = mls.editor.models[`_${project}_${shortName}`]
        if (!models || !models.test) return;
        if (models.test.compilerResults && !models.test.compilerResults.prodJS) models.test.compilerResults.modelNeedCompile = true;
        await mls.l2.typescript.compile(models.test);
        const errs = {
            Errors: models.test.compilerResults?.errors || []
        };

        this.hasError = errs.Errors.length > 0;
        this.results = {
            prodJS: models.test.compilerResults?.prodJS || '',
            errors: JSON.stringify(errs, null, 2),
        };

    }

    private setInitialModelProdTestJS(project: number, shortName: string, src: string) {
        const model1 = this.createOrGetModel(project, shortName, 'javascript', src);
        if (!model1) return;
        if (this._ed1) this._ed1.setModel(model1);
    }

    private getUri(shortFN: string): monaco.Uri {
        return monaco.Uri.parse(`file://server/${shortFN}_results_test_js.ts`);
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

type Results = {
    prodJS: string,
    errors: string;
}

interface IHTMLEditorElement extends HTMLElement {
    mlsEditor: monaco.editor.IStandaloneCodeEditor
}