/// <mls shortName="serviceResults" project="100554" enhancement="_100554_enhancementLit" groupName="services" />

import { html } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';
import { getDependenciesByMFile } from './_100554_libCompile';
import { initCodelensCustomElement } from './_100554_codelensCustomElement';
import { initCodelensComponentDetails } from './_100554_codelensComponentDetails';
import { initCodelensServiceDetails } from './_100554_codelensServiceDetails';

/// **collab_i18n_start**
const message_pt = {
    
}

const message_en = {
    
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**
@customElement('service-results-100554')
export class ServiceResults extends ServiceBase {

private msg: MessageType = messages['en'] ;

    constructor() {
        super();
        initCodelensCustomElement();
        initCodelensComponentDetails();
        initCodelensServiceDetails();
        this.editorModelName = `serviceresults_${this.position}.js`;
        mls.events.addListener(2, 'FileAction', (ev) => this.onFileActionReceived.bind(this)(ev));
        mls.events.addListener(2, 'MonacoAction', (ev) => this.onMonacoEvents(ev));
    }

    @property({ type: String })
    msize = '';

    createRenderRoot() {
        return this;
    }

    public details: IService = {
        icon: '&#xf1c9',
        state: 'background',
        tooltip: 'Results',
        visible: true,
        position: "all",
        widget: '_100554_serviceResults',
        level: [2]
    }

    public onClickLink = (op: string): boolean => {
        if (op === 'opProdJS') return this.showProdJS();
        if (op === 'opProdJS2') return this.showProdJS3();
        if (op === 'opTSConfig') return this.showTsConfig();
        if (op === 'opTSLibs') return this.showTsLib();
        if (op === 'opDevDoc') return this.showDevDoc();
        if (op === 'opDevDocJson') return this.showDevDocJson();
        if (op === 'opJsonImport') return this.showJsonImport();
        if (op === 'opReferences') return this.showFileRefs();
        if (op === 'opAssistant') return this.showAssistant();
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: 'Production - Javascript',
        actions: {
            opProdJS: 'Production - Javascript',
            opTSConfig: 'Typescript Config',
            opTSLibs: 'Typescript Libs',
            opReferences: 'References',
            opDevDoc: 'Dev - Documentation',
            opDevDocJson: 'Dev - Documentation Json',
            opJsonImport: 'Json Imports'
        },
        actionDefault: 'opProdJS2', // call after close icon clicked
        icons: {},
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
    }


    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {
        this._onServiceClick(visible, reinit, el)
    }

    private async _onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {
        const editor = mls.l2.editor.editors[this.confInvert];
        if (!editor) await this.delay(3000);
        if (editor) {
            const { project, shortName } = editor;
            await this.getCompileResults(shortName, project);
            this.actualFileName = shortName;
            this.actualFileProject = project;
        }

        if (this.visible) this.createEditor();


        if (!reinit) {
            this.setInitialModelProdJS('');
            if (el && typeof el.layout === 'function') el.layout();
        }

        if (this.hasError) this.openErrorMode();
        else if (this.actualResultMode === 'refs') this.createListRefs();
        else if (this.actualResultMode === 'devDocPage') this.openResultsDocsPageMode();
        else if (this.isReferenceOpen) this.openReferenceMode();
        else if (this.isHelpAssistant) this.openHelpAssistantMode();
        else this.openActualResultMode();
    }

    @query('mls-editor-100529')
    private c2: HTMLElement | undefined;

    private _ed1: monaco.editor.IStandaloneCodeEditor | undefined;

    private editorModelName = 'serviceresults.js';

    private actualFileName: string | undefined;

    private actualFileProject: number | undefined;

    private isReferenceOpen: boolean = false;

    private isHelpAssistant: boolean = false;

    private assistantArgs: mls.events.IMonacoAction | undefined;

    private actualResultMode: ResultMode = 'prodJS';

    private devDocContainer: HTMLElement | undefined;

    private list: HTMLUListElement | undefined;

    private refTitle: HTMLElement | undefined;

    get confE() { return `l${this.level}_${this.position}_results`; }

    get confInvert() { return `l${this.level}_${this.position === 'left' ? 'right' : 'left'}`; }

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

    private resultsLanguages: IResultNames = {
        prodJS: 'javascript',
        devJS: 'javascript',
        devTS: 'typescript',
        devDoc: 'json',
        errors: 'json',
        configTS: 'json',
        libTS: 'json',
        jsonImport: 'json',
    }

    private extensions: any = {
        javascript: '.js',
        typescript: '.ts',
        json: '.json',
    }

    private isServiceVisible(): boolean {
        return this.visible === 'true';
    }

    private createEditor(): void {
        if (!this.c2 || this._ed1) return;
        this._ed1 = monaco.editor.create(this.c2, mls.editor.conf[this.confE] as monaco.editor.IEditorOptions);
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            noImplicitAny: true
        });
        (this.c2 as any)['mlsEditor'] = this._ed1;

    }

    private createOrGetModel(resultName: string, editorType: string, src: string): mls.l2.editor.IMFile {

        const project = 100529;
        const shortName = resultName;
        const uri = this.getUri(`_${project}_${shortName}`);
        let model1 = mls.l2.editor.get({ project, shortName });
        if (!model1) {
            const model = monaco.editor.createModel(src, editorType, uri);
            const extension = this.extensions[editorType] as string;
            model1 = {
                changed: false,
                error: false,
                project,
                shortName,
                model,
                extension
            } as mls.l2.editor.IMFile;
            mls.l2.editor.add(model1);
        }
        return model1;

    }

    private setInitialModelProdJS(src: string) {
        const model1 = this.createOrGetModel(this.editorModelName, 'javascript', src);
        if (!model1) return;
        mls.l2.editor.editors[`${this.confE}_${this.editorModelName}`] = model1;
        if (this._ed1) this._ed1.setModel(model1.model);
    }

    private setModelLanguage(language: string, value: string): void {
        const activeModel = mls.l2.editor.editors[`${this.confE}_${this.editorModelName}`];
        if (!activeModel) return;
        monaco.editor.setModelLanguage(activeModel.model, language);
        if (this._ed1) this._ed1.setScrollTop(0);
        activeModel.model.setValue(value);
    }

    private getUri(shortFN: string): monaco.Uri {
        return monaco.Uri.parse(`file://server/${shortFN}_${this.position}.ts`);
    }

    private hasError: boolean = false;

    private async getCompileResults(shortName: string, project: number): Promise<void> {

        const editor = mls.l2.editor.editors[this.confInvert];
        if (!editor || !shortName || !project) return;
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

        const jsonImp = await getDependenciesByMFile(mfile);
        this.hasError = results.errors.length > 0;
        this.results = {
            ...results,
            errors: JSON.stringify(errs, null, 2),
            references: [],
            configTS: JSON.stringify(monaco.languages.typescript.typescriptDefaults.getCompilerOptions(), null, 2),
            libTS: JSON.stringify(libs2, null, 2),
            jsonImport: JSON.stringify(jsonImp, null, 2),
        };
    }

    private async onFileActionReceived(ev: mls.events.IEvent) {

        if (!ev.desc) return;
        const params: mls.events.IFileAction = JSON.parse(ev.desc);
        const { shortName, project } = params;
        if (params.position === this.position) return;
        const isServiceVisible = this.isServiceVisible();
        this.actualFileName = params.shortName;
        this.actualFileProject = params.project;

        if ((params.action === 'changed' || params.action === 'open') && isServiceVisible) {

            await this.getCompileResults(shortName, project);
            if (this.actualResultMode === 'refs') this.createListRefs();
            else if (this.actualResultMode === 'devDocPage') this.openResultsDocsPageMode();
            else if (this.hasError) this.openErrorMode();
            else this.openActualResultMode();

        } else if (params.action === 'fileReference') {
            await this.getCompileResults(shortName, project);
            this.isReferenceOpen = true;
            if (this.visible === 'true') this.openReferenceMode();
            else this.openMe();

        }

    }

    private onMonacoEvents(ev: mls.events.IEvent): void {

        if (!ev.desc) return;
        const args: mls.events.IMonacoAction = JSON.parse(ev.desc);
        if (!args) return;
        const { action, position } = args;
        if (position === this.position) return;
        if (action === 'helpAssistant' as any) {
            this.actualResultMode = 'assistant';
            this.assistantArgs = args;
            this.isHelpAssistant = true;
            if (this.visible === 'true') this.openHelpAssistantMode();
            else this.openMe();
        }
    }

    private async getReferences(shortName: string, project: number): Promise<mls.l2.editor.IMFile[]> {
        await mls.l2.editor.compileAllProjectIfNeed(project);
        const refs: mls.l2.editor.IMFile[] = mls.l2.editor.listAllAffectedFiles(project, shortName);
        return refs;
    }

    private showProdJS(): boolean {
        if (this.menu.setMode) this.menu.setMode('initial');
        this.actualResultMode = 'prodJS';
        return this.showProdJS2();
    }

    private showProdJS2(): boolean {
        this.menu.title = 'Production - Javascript';
        if (this.menu.updateTitle) this.menu.updateTitle();
        if (this.hasError) {
            this.setModelLanguage(this.resultsLanguages.errors, this.results.errors);
            return true;
        }
        this.setModelLanguage(this.resultsLanguages.prodJS, this.results.prodJS);
        return true;
    }

    private showProdJS3(): boolean {
        this.actualResultMode = 'prodJS';
        return this.showProdJS2();
    }

    private showTsConfig(): boolean {
        this.menu.title = 'Typescript Config';
        if (this.menu.updateTitle) this.menu.updateTitle();
        if (this.menu.setMode) this.menu.setMode('editor');
        this.actualResultMode = 'configTS';
        this.setModelLanguage(this.resultsLanguages.configTS, this.results.configTS);
        return true;
    }

    private showTsLib(): boolean {
        this.menu.title = 'Typescript Libs';
        if (this.menu.updateTitle) this.menu.updateTitle();
        if (this.menu.setMode) this.menu.setMode('editor');
        this.actualResultMode = 'libTS';
        this.setModelLanguage(this.resultsLanguages.libTS, this.results.libTS);
        return true;
    }


    private showDevDoc(): boolean {
        this.menu.title = 'Develpoment Docs';
        if (this.menu.updateTitle) this.menu.updateTitle();
        this.actualResultMode = 'devDocPage';
        if (!this.devDocContainer) {
            this.devDocContainer = document.createElement('mls-load-page-l4-100529');
            this.devDocContainer.setAttribute('path', '_100529_service_results_doc');
        }
        if (this.menu.setMode) this.menu.setMode('page', this.devDocContainer);
        return true;
    }


    private showFileRefs(): boolean {
        this.menu.title = 'File References';
        if (this.menu.updateTitle) this.menu.updateTitle();
        this.menu.title = this.menu.actions['opProdJS'];
        this.actualResultMode = 'refs';
        const div1 = document.createElement('div');
        div1.style.padding = '2rem';
        this.list = document.createElement('ul');
        const hr = document.createElement('hr');
        this.refTitle = document.createElement('h2');
        this.createListRefs();
        div1.appendChild(this.refTitle);
        div1.appendChild(hr);
        div1.appendChild(this.list);
        if (this.menu.setMode) this.menu.setMode('page', div1);
        return true;
    }

    private showAssistant(): boolean {
        this.menu.title = 'Help Assistant';
        if (this.menu.updateTitle) this.menu.updateTitle();
        this.menu.title = this.menu.actions['opProdJS'];

        const div1 = document.createElement('div');
        div1.style.padding = '2rem';

        if (this.assistantArgs && this.assistantArgs.codeLenCommand) {
            const el = document.createElement(this.assistantArgs.codeLenCommand.refs)
            div1.appendChild(el)
        }
        if (this.menu.setMode) this.menu.setMode('page', div1);
        return true;
    }

    private async createListRefs() {

        if (!this.list) return;
        if (this.refTitle) this.refTitle.innerHTML = `<b>File References from:</b> _${this.actualFileProject}_${this.actualFileName}`;
        this.list.innerHTML = 'Loading...';

        const references = await this.getReferences(this.actualFileName as string, this.actualFileProject as number);
        this.results.references = references;
        this.list.innerHTML = '';
        if (this.results.references.length === 0) {
            this.list.innerHTML = 'No references.';
            return;
        }
        this.results.references.forEach((ref) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.innerHTML = `Project: ${ref.project} ShortName: ${ref.shortName} `;
            a.onclick = (e) => {
                e.preventDefault();

                const cmdOpen: mls.events.IFileAction = {
                    action: 'open',
                    level: 2,
                    project: ref.project,
                    shortName: ref.shortName,
                    extension: ref.extension,
                    folder: '',
                    position: this.position as any
                };
                mls.events.fire([2], ['FileAction'], JSON.stringify(cmdOpen), 0);
            };

            li.appendChild(a);
            if (this.list) this.list.appendChild(li);
        });

    }

    private showDevDocJson(): boolean {
        this.menu.title = 'Develpoment Docs Json';
        if (this.menu.updateTitle) this.menu.updateTitle();
        if (this.menu.setMode) this.menu.setMode('editor');
        this.actualResultMode = 'devDoc';
        this.setModelLanguage(this.resultsLanguages.devDoc, this.results.devDoc);
        return true;
    }

    private showJsonImport(): boolean {
        this.menu.title = 'Imports Json';
        if (this.menu.updateTitle) this.menu.updateTitle();
        if (this.menu.setMode) this.menu.setMode('editor');
        this.actualResultMode = 'jsonImport';
        this.setModelLanguage(this.resultsLanguages.jsonImport, this.results.jsonImport);
        return true;
    }


    private delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    private async openActualResultMode() {
        const language = this.resultsLanguages[this.actualResultMode];
        const value = this.results[this.actualResultMode]
        if (language && value) this.setModelLanguage(language, value);
    }

    private openErrorMode() {
        this.setModelLanguage(this.resultsLanguages.errors, this.results.errors);
    }

    private openResultsDocsPageMode() {

        this.menu.title = 'Develpoment Docs';
        if (this.menu.updateTitle) this.menu.updateTitle();
        this.actualResultMode = 'devDocPage';
        if (!this.devDocContainer) return;
        this.devDocContainer.setAttribute('force', 'true');
        this.devDocContainer.setAttribute('path', '_100529_service_results_doc');
    }


    private openReferenceMode() {
        if (this.menu.setMenuActive) this.menu.setMenuActive('opReferences');
        this.isReferenceOpen = false;
    }

    private openHelpAssistantMode() {
        if (this.menu.setMenuActive) this.menu.setMenuActive('opAssistant');
        this.isHelpAssistant = false;
    }

    updated(changedProperties: any) {
        if (changedProperties.has('msize')) {
            if (!this.visible) return;
            this.c2?.setAttribute('msize', this.msize);
        }
    }

    render() {
        return html`
            <mls-editor-100529 ismls2="true"></mls-editor-100529>
        `
    }
}

type ResultMode = 'refs' | 'prodJS' | 'devTS' | 'devJS' | 'devDoc' | 'devDocPage' | 'configTS' | 'libTS' | 'errors' | 'assistant' | 'jsonImport';

type Modify<T, R> = Pick<T, Exclude<keyof T, keyof R>> & R

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

type IResultNames = {
    prodJS: string,
    devJS: string,
    devTS: string,
    devDoc: string,
    errors: string,
    configTS: string,
    libTS: string,
    refs?: string,
    devDocPage?: string,
    assistant?: string,
    jsonImport: string,
}

