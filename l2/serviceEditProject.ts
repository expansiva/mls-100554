/// <mls shortName="serviceEditProject" project="100554" enhancement="_100554_enhancementLitService" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';

const message_pt = {
    loading: 'Carregando...',
    selectadd: 'por favor selecione abaixo para adicionar',
    allTasksLast: 'Todas as tarefas, últimas',
    user: 'Usuário',
    all: 'Todos',
    ref: 'Ref',
    add: 'Adicionar',
    notFoundReference: 'Referência não encontrada',
    tasksByReference: 'Tarefas por referência',
    noActionsToAdd: 'Nenhuma ação para adicionar',
    selectColumnsYouWant: 'Selecione as colunas que deseja visualizar',
    save: 'Salvar',
    cancel: 'Cancelar'
}

const message_en = {
    loading: 'Loading...',
    selectadd: 'please select below to add',
    allTasksLast: 'All Tasks, last',
    user: 'User',
    all: 'All',
    ref: 'Ref',
    add: 'Add',
    notFoundReference: 'Not found reference',
    tasksByReference: 'Tasks by reference',
    noActionsToAdd: 'No Actions to Add',
    selectColumnsYouWant:'Select the columns you want to view',
    save: 'Save',
    cancel: 'Cancel'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en-us': message_en,
    'pt-br': message_pt
}

@customElement('service-edit-project-100554')
export class ServiceEditProject100554 extends ServiceBase {

    private msg: MessageType = messages['en-us'];
    
    public static modelCount: number;

    public details: IService = {
        icon: '&#xf15b',
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
        title: 'Project Configs',
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
            this.createEditor();
            this.loadProjectConfigs();
            setTimeout(() => {
                if (el && typeof el.layout === 'function') el.layout();
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
        let src: string | Blob | null | undefined;
        const info: mls.stor.IFileInfoValue | null = file.getValueInfo ? await file.getValueInfo() : null;
        const haveInfo: boolean | null = info && !!info.content;
        src = haveInfo ? info?.content : "";
        if (!src) {
            src = await file.getContent();
            if (!src) console.log('error on getContent, src is null');
        }
        if (src instanceof Blob) throw new Error('html file must be string');
        if (!src) src = "";
        return src;
    }

    private setInitialConfig(value: string) {

        const newValue = `mls["project_config"] = ${value};`
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
        const content = '{}';
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
        if (!model1) model1 = monaco.editor.createModel(src, editorType, uri);

        return model1;
    }

    private getUri(shortFN: string): monaco.Uri {
        ServiceEditProject100554.modelCount = ServiceEditProject100554.modelCount + 1 || 1;
        return monaco.Uri.parse(`file://server/${shortFN}_${ServiceEditProject100554.modelCount}.ts`);
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
