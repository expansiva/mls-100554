/// <mls shortName="serviceEditProject" project="100554" enhancement="_100554_enhancementLitService" groupName="other" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IMenu } from './_100554_serviceBase';
import { getConfigProject, updateConfigProject, createConfigFile } from './_100554_libProjectConfig';

declare global {
    interface Window {
        project_config: any
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

    constructor() {
        super();
        this.setEvents();
    }

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
        const { project } = mls.actual[5];
        if (reinit) {
            this.refreshIfNeeded(project);
        }
    }

    async setEvents() {
        mls.events.addEventListener([5], ['ProjectSelected'], (ev) => {
            if (!ev.desc) return;
            const desc: IProjectSelectEvent = JSON.parse(ev.desc);
            this.refreshIfNeeded(desc.value);
        });


    }

    @property({ type: String })
    msize = '';

    @query('mls-editor-100529')
    private c2: HTMLElement | undefined;

    private _ed1: monaco.editor.IStandaloneCodeEditor | undefined;

    private model: monaco.editor.ITextModel | undefined;

    private lastProject: number | undefined;

    private template: string = `window.project_config`

    private showStart() {
        return true;
    }

    private refreshIfNeeded(project: number | undefined) {
        if (this.lastProject !== project) {
            this.loadProjectConfigs();
        }
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
        const { project } = mls.actual[5];
        if (!project) return;
        this.lastProject = project;
        let config = await getConfigProject(project);
        if (!config) config = await createConfigFile(project);
        this.setInitialConfig(JSON.stringify(config, null, 2), project);
    }

    private setInitialConfig(value: string, project: number) {
        const newValue = this.template + ' = ' + value;
        this.model = this.createOrGetModel('typescript', newValue, project);
        if (!this.model || !this._ed1) return;
        this._ed1.setModel(this.model);
    }

    private createOrGetModel(editorType: string, src: string, project: number) {
        const uri = this.getUri(`${this.constructor.name}_${project}}`);
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

        if (!this.model) return;
        const val = this.model.getValue();
        const errors = monaco.editor.getModelMarkers(({ resource: this.model.uri }));
        if (errors && errors.length > 0) return;
        const that = this;
        (async function scope() {
            eval(val); // eslint-disable-line no-eval
            if (window.project_config && typeof window.project_config === 'object' && that.lastProject) {
                updateConfigProject(that.lastProject, window.project_config);
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

interface IProjectSelectEvent {
    emitter: 'right' | 'left',
    value: number
}