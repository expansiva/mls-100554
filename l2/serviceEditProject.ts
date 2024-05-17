/// <mls shortName="serviceEditProject" project="100554" enhancement="_100554_enhancementLitService" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

interface Variation {
    type: string;
    enabled: boolean;
    subdomain: string;
    designSystem: string;
    variation: number;
}

interface Language {
    language: string;
    path: string;
    variations: Variation[];
}

interface DesignSystem {
    dsIndex: string;
    dsName: string;
    widgetIOName: string;
}

interface ProjectConfig {
    name: string;
    projectDriver?: string;
    projectURL?: string;
    designSystems: DesignSystem[];
    languages: Language[];
}

declare global {
    interface Window {
        project_config: ProjectConfig
    }
}

/// **collab_i18n_start**
const message_pt = {
    loading: 'Carregando...',
    menu_title: 'Configuração do projeto'
}

const message_en = {
    loading: 'Loading...',
    menu_title: 'Project Configs'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('service-edit-project-100554')
export class ServiceEditProject100554 extends ServiceBase {

    private msg: MessageType = messages['en'];

    public static modelCount: number;

    public details: IService = {
        icon: '&#xf085',
        state: 'foreground',
        position: 'right',
        tooltip: 'Service Edit Project',
        visible: true,
        widget: '_100554_serviceEditProject',
        level: [5]
    }

    public onClickLink = (op: string): boolean => {
        if (op === 'opConfig') return this.showStart();
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu: IMenu = {
        title: this.msg.menu_title,
        actions: {
        },
        icons: {},
        actionDefault: 'opConfig', // call after close icon clicked
        setMode: undefined, // child will set this
        onClickLink: this.onClickLink,
        getLastMode: undefined,
        updateTitle: undefined
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {
        if (visible) {
            setTimeout(() => {
                this.setMsizeEditor();
            }, 100)
        }
    }

    @property({ type: String })
    msize = '';

    @query('mls-editor-100529')
    private c2: HTMLElement | undefined;

    private _ed1: monaco.editor.IStandaloneCodeEditor | undefined;

    private model: monaco.editor.ITextModel | undefined;

    private fileInfo: mls.stor.IFileInfo | undefined;

    private template: string = `window.project_config`

    private showStart() {
        return true;
    }

    private setMsizeEditor() {
        if (!this.visible) return;
        this.c2?.setAttribute('msize', this.msize);
    }

    private createEditor(): void {
        if (!this.c2 || this._ed1) return;
        const opt = {
            automaticLayout: true,
        };
        this._ed1 = monaco.editor.create(this.c2, opt);
        (this.c2 as any)['mlsEditor'] = this._ed1;
        this.setMsizeEditor();
    }

    private async loadProjectConfigs() {
        this.fileInfo = await this.getFileOrCreate();
        const src = await this.getFileContent(this.fileInfo);
        this.setInitialConfig(src);
    }

    private async getFileContent(file: mls.stor.IFileInfo) {
        if (!file) throw new Error('No file find');
        let src: string | Blob | null | undefined;
        const info: mls.stor.IFileInfoValue | null = file.getValueInfo ? await file.getValueInfo() : null;
        const haveInfo: boolean | null = info && !!info.content;
        src = haveInfo ? info?.content : "";
        if (!src) {
            src = await file.getContent();
            if (!src) console.log('error on getContent, src is null');
        }
        if (src instanceof Blob) throw new Error('html file must be string');
        if (!src) src = '{}';
        return src;
    }

    private setInitialConfig(value: string) {

        const newValue = this.template + ' = ' + value;
        this.model = this.createOrGetModel('typescript', newValue);
        if (!this.model || !this._ed1) return;
        this._ed1.setModel(this.model);
    }

    private async getFileOrCreate(): Promise<mls.stor.IFileInfo> {
        const { project } = mls.actual[5];
        const shortName = 'project';
        if (project === undefined) throw new Error('No project selected!')
        const key = mls.stor.getKeyToFiles(project, this.level, shortName, '', '.json');
        let configFile = mls.stor.files[key];
        if (!configFile) {
            await this.createConfigFile(project, shortName);
            configFile = mls.stor.files[key];
        }

        return configFile;
    }

    private async createConfigFile(project: number, shortName: string) {
        const det = mls.l5.getProjectDetails(project);
        const newConfig: ProjectConfig = {
            name: det.name,
            designSystems: [],
            languages: []
        }
        const content = JSON.stringify(newConfig);
        const params = {
            project,
            level: 5,
            shortName,
            extension: '.json',
            versionRef: '0',
            folder: ''
        };
        const file = await mls.stor.addOrUpdateFile(params);
        file.status = 'new';
        const fileInfo: mls.stor.IFileInfoValue = {
            content,
            contentType: 'string',
        };
        await mls.stor.localStor.setContent(file, fileInfo);
    }

    private createOrGetModel(editorType: string, src: string) {
        if (!this.fileInfo) return;
        const uri = this.getUri(`${this.constructor.name}_${this.fileInfo.project}}`);
        let model1 = monaco.editor.getModel(uri);
        if (!model1) {
            model1 = monaco.editor.createModel(src, editorType, uri);
            this.setEventsModel(model1);
        }

        return model1;
    }

    private timeoutChangesEditorStyle: number = 0;

    private setEventsModel(model: monaco.editor.ITextModel) {

        model.onDidChangeContent((event) => {
            if (this.timeoutChangesEditorStyle) clearTimeout(this.timeoutChangesEditorStyle);
            this.timeoutChangesEditorStyle = setTimeout(() => {
                this.onEditorChange();
            }, 1000);
        });
    }

    private async onEditorChange() {
        if (!this.model || !this.fileInfo) return;
        const val = this.model.getValue();
        const errors = monaco.editor.getModelMarkers(({ resource: this.model.uri }));
        if (errors && errors.length > 0) return;
        const that = this;
        (async function scope() {
            eval(val); // eslint-disable-line no-eval
            if (window.project_config && typeof window.project_config === 'object') {
                await mls.stor.localStor.setContent(that.fileInfo, {
                    contentType: 'string',
                    content: JSON.stringify(window.project_config, null, 2)
                });
            }
        }).call(this);

    }

    private getUri(shortFN: string): monaco.Uri {
        ServiceEditProject100554.modelCount = ServiceEditProject100554.modelCount + 1 || 1;
        return monaco.Uri.parse(`file://server/${shortFN}_${ServiceEditProject100554.modelCount}.ts`);
    }

    firstUpdated() {
        this.createEditor();
        this.loadProjectConfigs();
    }

    createRenderRoot() {
        return this;
    }

    updated(changedProperties: any) {
        if (changedProperties.has('msize')) {
            if (!this.visible) return;
            this.setMsizeEditor();
        }
    }

    render() {
        return html`
            <mls-editor-100529 ismls2="true"></mls-editor-100529>
        `
    }
}
